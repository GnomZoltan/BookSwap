import React, { useState, useEffect } from 'react';
import { addBook, getBookById, updateBook, generateBookDescription } from '../../api/bookApi';
import { uploadPhoto, deletePhoto } from '../../api/photoApi';
import { getAllGenres } from '../../api/genreApi';
import { useNavigate, useParams } from 'react-router-dom';
import './AddBook.css';

const AddBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    title: '', author: '', language: '', city: '', condition: 5, forFree: false, description: '',
    genreNames: [] as string[], bookPhotos: [] as string[],
  });
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<(File | string)[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGenres = async () => {
      try { const r = await getAllGenres(); setGenres(r.data); } catch { setError('Failed to fetch genres.'); } finally { setLoading(false); }
    };
    const fetchBookData = async () => {
      if (id) {
        try {
          const r = await getBookById(id); const book = r.data;
          setFormData({ title: book.title, author: book.author, language: book.language, city: book.city, condition: book.condition, forFree: book.forFree, description: book.description,
            genreNames: book.genre.map((g: { genre: { name: string } }) => g.genre.name),
            bookPhotos: book.photos.map((p: { photoUrl: string }) => p.photoUrl),
          });
          setSelectedFiles(book.photos.map((p: { photoUrl: string }) => p.photoUrl));
        } catch { setError('Failed to fetch book data.'); }
      }
    };
    fetchGenres(); if (id) fetchBookData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      setSelectedFiles((prev) => [...prev, file]);
    }
  };

  const handleRemovePhoto = async (index: number) => {
    const fileToRemove = selectedFiles[index];
    try {
      if (typeof fileToRemove === 'string') await deletePhoto(fileToRemove);
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    } catch { setError('Failed to remove photo.'); }
  };

  const toggleGenre = (name: string) => {
    setFormData((prev) => ({
      ...prev, genreNames: prev.genreNames.includes(name) ? prev.genreNames.filter((g) => g !== name) : [...prev.genreNames, name],
    }));
  };

  const handleGenerateDescription = async () => {
    if (!formData.title && !formData.author) return;
    setGeneratingDescription(true);
    try {
      const r = await generateBookDescription(formData.title, formData.author);
      setFormData((prev) => ({ ...prev, description: r.data.description }));
    } catch { setError('Failed to generate description.'); }
    finally { setGeneratingDescription(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let photoUrls: string[] = [];
      const newFiles = selectedFiles.filter((f) => f instanceof File) as File[];
      if (newFiles.length > 0) {
        const fd = new FormData(); newFiles.forEach((f) => fd.append('photos', f));
        const r = await uploadPhoto(fd); photoUrls = r.data.map((p: { fileUrl: string }) => p.fileUrl);
      }
      const bookData = { ...formData, bookPhotos: [...selectedFiles.filter((f) => typeof f === 'string'), ...photoUrls] };
      if (id) { await updateBook(id, bookData); alert('Book updated successfully!'); }
      else { await addBook(bookData); alert('Book added successfully!'); }
      navigate('/', { replace: true });
    } catch { setError('Failed to save book.'); }
  };

  if (loading) return <div className="add-book__loading"><p>Завантаження...</p></div>;
  if (error) return <div className="add-book__loading"><p>{error}</p></div>;

  return (
    <div className="add-book">
      <h1 className="add-book__title">{id ? 'Редагувати книгу' : 'Додати нову книгу'}</h1>
      <form onSubmit={handleSubmit} className="add-book__form">

        {/* Basic info */}
        <div className="add-book__section">
          <p className="add-book__section-label">Основна інформація</p>
          <div className="add-book__section-fields">
            <div className="form-field">
              <label htmlFor="title" className="form-field__label">Назва книги</label>
              <input type="text" id="title" name="title" className="form-field__input" value={formData.title} onChange={handleInputChange} placeholder="Введіть назву" required />
            </div>
            <div className="form-field">
              <label htmlFor="author" className="form-field__label">Автор</label>
              <input type="text" id="author" name="author" className="form-field__input" value={formData.author} onChange={handleInputChange} placeholder="Ім'я автора" required />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="add-book__section">
          <p className="add-book__section-label">Деталі</p>
          <div className="add-book__section-fields">
            <div className="add-book__row">
              <div className="form-field">
                <label htmlFor="language" className="form-field__label">Мова</label>
                <input type="text" id="language" name="language" className="form-field__input" value={formData.language} onChange={handleInputChange} placeholder="Українська" />
              </div>
              <div className="form-field">
                <label htmlFor="city" className="form-field__label">Місто</label>
                <input type="text" id="city" name="city" className="form-field__input" value={formData.city} onChange={handleInputChange} placeholder="Київ" />
              </div>
            </div>
            <div className="add-book__condition-row">
              <label className="form-field__label">Стан книги — {formData.condition}/10</label>
              <div className="add-book__condition-dots">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`add-book__condition-dot ${formData.condition >= n ? 'add-book__condition-dot--active' : ''}`}
                    onClick={() => setFormData((prev) => ({ ...prev, condition: n }))}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>
            <div className={`add-book__free-row ${formData.forFree ? 'add-book__free-row--active' : ''}`}>
              <div className="add-book__free-info">
                <span className="add-book__free-title">Безкоштовна роздача</span>
                <span className="add-book__free-sub">Книгу можна отримати без обміну</span>
              </div>
              <label className="add-book__toggle">
                <input type="checkbox" checked={formData.forFree} onChange={() => setFormData((prev) => ({ ...prev, forFree: !prev.forFree }))} />
                <span className="add-book__toggle-slider" />
              </label>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="add-book__section">
          <div className="add-book__description-header">
            <p className="add-book__section-label" style={{ marginBottom: 0 }}>Опис</p>
            <button
              type="button"
              className="add-book__generate-btn"
              onClick={handleGenerateDescription}
              disabled={generatingDescription || (!formData.title && !formData.author)}
            >
              {generatingDescription ? (
                <>
                  <svg className="add-book__spinner" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10" strokeOpacity="0.2"/><path d="M12 2a10 10 0 0 1 10 10"/></svg>
                  Генерація...
                </>
              ) : (
                <>
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/></svg>
                  Згенерувати AI
                </>
              )}
            </button>
          </div>
          <textarea
            id="description"
            name="description"
            className="form-field__textarea"
            style={{ marginTop: 'var(--space-4)' }}
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Короткий опис книги..."
            rows={4}
          />
        </div>

        {/* Photos */}
        <div className="add-book__section">
          <p className="add-book__section-label">Фото</p>
          {selectedFiles.length > 0 && (
            <div className="add-book__photos">
              {selectedFiles.map((file, index) => (
                <div key={index} className="add-book__photo-item">
                  <img src={typeof file === 'string' ? file : URL.createObjectURL(file)} alt={`Photo ${index}`} />
                  <button type="button" className="add-book__photo-remove" onClick={() => handleRemovePhoto(index)}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              ))}
            </div>
          )}
          <label className="add-book__upload">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span className="add-book__upload-label">Додати фото</span>
            <span className="add-book__upload-sub">PNG, JPG до 10 МБ</span>
            <input type="file" onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
          </label>
        </div>

        {/* Genres */}
        <div className="add-book__section">
          <p className="add-book__section-label">Жанри</p>
          <div className="add-book__genres">
            {genres.map((genre) => (
              <label key={genre.id} className={`add-book__genre-chip ${formData.genreNames.includes(genre.name) ? 'add-book__genre-chip--active' : ''}`}>
                <input type="checkbox" checked={formData.genreNames.includes(genre.name)} onChange={() => toggleGenre(genre.name)} style={{ display: 'none' }} />
                {genre.name}
              </label>
            ))}
          </div>
        </div>

        <button type="submit" className="add-book__submit">
          {id ? 'Зберегти зміни' : 'Опублікувати книгу'}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
