import React, { useState, useEffect } from 'react';
import { addBook, getBookById, updateBook, generateBookDescription } from '../../api/bookApi';
import { uploadPhoto, deletePhoto } from '../../api/photoApi';
import { getAllGenres } from '../../api/genreApi';
import { useNavigate, useParams } from 'react-router-dom';
import './AddBook.css';

const AddBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [formData, setFormData] = useState({
    title: '', author: '', language: '', city: '', condition: 1, forFree: false, description: '',
    genreNames: [] as string[], bookPhotos: [] as string[],
  });
  const [genres, setGenres] = useState<{ id: string; name: string }[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (typeof index === 'number') { setSelectedFiles((prev) => { const u = [...prev]; u[index] = file; return u; }); }
      else { setSelectedFiles((prev) => [...prev, file]); }
    }
  };

  const handleRemovePhoto = async (index: number) => {
    const fileToRemove = selectedFiles[index];
    try {
      if (typeof fileToRemove === 'string') await deletePhoto(fileToRemove);
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    } catch (err) { console.error('Failed to remove photo:', err); setError('Failed to remove photo.'); }
  };

  const toggleForFree = () => setFormData((prev) => ({ ...prev, forFree: !prev.forFree }));

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
    } catch {
      setError('Failed to generate description.');
    } finally {
      setGeneratingDescription(false);
    }
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
      <div className="add-book__card">
        <h1 className="add-book__title">{id ? 'Редагувати книгу' : 'Додати нову книгу'}</h1>
        <form onSubmit={handleSubmit} className="add-book__form">
          <div className="form-field">
            <label htmlFor="title" className="form-field__label">Назва</label>
            <input type="text" id="title" name="title" className="form-field__input" value={formData.title} onChange={handleInputChange} placeholder="Назва книги" />
          </div>
          <div className="form-field">
            <label htmlFor="author" className="form-field__label">Автор</label>
            <input type="text" id="author" name="author" className="form-field__input" value={formData.author} onChange={handleInputChange} placeholder="Ім'я автора" />
          </div>
          <div className="add-book__row">
            <div className="form-field">
              <label htmlFor="language" className="form-field__label">Мова</label>
              <input type="text" id="language" name="language" className="form-field__input" value={formData.language} onChange={handleInputChange} placeholder="Мова" />
            </div>
            <div className="form-field">
              <label htmlFor="city" className="form-field__label">Місто</label>
              <input type="text" id="city" name="city" className="form-field__input" value={formData.city} onChange={handleInputChange} placeholder="Місто" />
            </div>
          </div>
          <div className="add-book__row">
            <div className="form-field">
              <label htmlFor="condition" className="form-field__label">Стан (1-10)</label>
              <input type="number" id="condition" name="condition" className="form-field__input" value={formData.condition} onChange={(e) => setFormData((prev) => ({ ...prev, condition: parseInt(e.target.value, 10) || 0 }))} min="1" max="10" />
            </div>
            <div className="form-field">
              <label className="form-field__label">Безкоштовно</label>
              <button type="button" onClick={toggleForFree} className={`add-book__toggle ${formData.forFree ? 'add-book__toggle--active' : ''}`}>
                {formData.forFree ? 'Так' : 'Ні'}
              </button>
            </div>
          </div>
          <div className="form-field">
            <div className="add-book__description-header">
              <label htmlFor="description" className="form-field__label">Опис</label>
              <button
                type="button"
                className="add-book__generate-btn"
                onClick={handleGenerateDescription}
                disabled={generatingDescription || (!formData.title && !formData.author)}
              >
                {generatingDescription ? (
                  <>
                    <svg className="add-book__spinner" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" /></svg>
                    Генерація...
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75z"/></svg>
                    Згенерувати
                  </>
                )}
              </button>
            </div>
            <textarea id="description" name="description" className="form-field__textarea" value={formData.description} onChange={handleInputChange} placeholder="Опис книги" rows={4} />
          </div>
          <div className="form-field">
            <label className="form-field__label">Фото книги</label>
            {selectedFiles.length > 0 && (
              <div className="add-book__photos">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="add-book__photo-item">
                    <img src={typeof file === 'string' ? file : URL.createObjectURL(file)} alt={`Photo ${index}`} />
                    <button type="button" className="add-book__photo-remove" onClick={() => handleRemovePhoto(index)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
            <label className="add-book__upload">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Додати фото
              <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} accept="image/*" />
            </label>
          </div>
          <div className="form-field">
            <label className="form-field__label">Жанри</label>
            <div className="add-book__genres">
              {genres.map((genre) => (
                <label key={genre.id} className={`add-book__genre-chip ${formData.genreNames.includes(genre.name) ? 'add-book__genre-chip--active' : ''}`}>
                  <input type="checkbox" checked={formData.genreNames.includes(genre.name)} onChange={() => toggleGenre(genre.name)} style={{ display: 'none' }} />
                  {genre.name}
                </label>
              ))}
            </div>
          </div>
          <button type="submit" className="btn btn--primary add-book__submit">{id ? 'Зберегти зміни' : 'Додати книгу'}</button>
        </form>
      </div>
    </div>
  );
};

export default AddBook;
