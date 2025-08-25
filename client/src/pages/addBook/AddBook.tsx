// import React, { useState, useEffect } from 'react';
// import { addBook, getBookById, updateBook } from '../../api/bookApi'; // Include uploadPhotos API
// import { uploadPhoto, deletePhoto } from '../../api/photoApi';
// import { getAllGenres } from '../../api/genreApi';
// import './AddBook.css';
// import { useNavigate, useParams } from 'react-router-dom';

// const AddBook: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [formData, setFormData] = useState({
//     title: '',
//     author: '',
//     language: '',
//     city: '',
//     condition: 1,
//     forFree: false,
//     description: '',
//     genreNames: [] as string[],
//     bookPhotos: [] as string[],
//   });

//   const [genres, setGenres] = useState<{ id: string; name: string }[]>([]);
//   const [genrePopupVisible, setGenrePopupVisible] = useState(false);
//   const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // For file uploads
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchGenres = async () => {
//       try {
//         const response = await getAllGenres();
//         setGenres(response.data);
//       } catch (err) {
//         setError('Failed to fetch genres.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     const fetchBookData = async () => {
//       if (id) {
//         try {
//           const response = await getBookById(id); // Fetch book by ID
//           const book = response.data;
//           setFormData({
//             title: book.title,
//             author: book.author,
//             language: book.language,
//             city: book.city,
//             condition: book.condition,
//             forFree: book.forFree,
//             description: book.description,
//             genreNames: book.genre.map((g: { genre: { name: string } }) => g.genre.name),
//             bookPhotos: book.photos.map((p: { photoUrl: string }) => p.photoUrl),
//           });
//           setSelectedFiles(book.photos.map((p: { photoUrl: string }) => p.photoUrl));
//         } catch (err) {
//           setError('Failed to fetch book data.');
//         }
//       }
//     };

//     fetchGenres();
//     if (id) fetchBookData();
//   }, [id]);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   if (e.target.files) {
//   //     setSelectedFiles(Array.from(e.target.files)); // Update selected files
//   //   }
//   // };

//   // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
//   //   if (e.target.files) {
//   //     const filesArray = Array.from(e.target.files); // Гарантуємо, що це масив
//   //     if (typeof index === 'number') {
//   //       setSelectedFiles((prev) => {
//   //         const updatedFiles = [...prev];
//   //         updatedFiles[index] = filesArray[0]; // Замінюємо існуюче фото новим файлом
//   //         return updatedFiles;
//   //       });
//   //     } else {
//   //       setSelectedFiles((prev) => [...prev, ...filesArray]); // Додаємо нові файли
//   //     }
//   //   }
//   // };  

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
//     if (e.target.files) {
//       const file = e.target.files[0];
//       if (typeof index === 'number') {
//         setSelectedFiles((prev) => {
//           const updated = [...prev];
//           updated[index] = file; // Replace the file at the index
//           return updated;
//         });
//       } else {
//         setSelectedFiles((prev) => [...prev, file]); // Add new file
//       }
//     }
//   };

//   const handleRemovePhoto = async (index: number) => {
//     const fileToRemove = selectedFiles[index];
  
//     try {
//       if (typeof fileToRemove === 'string') {
//         await deletePhoto(fileToRemove); // Викликаємо API для видалення фото
//       }
  
//       setSelectedFiles((prev) => prev.filter((_, i) => i !== index)); // Видаляємо фото з локального стану
//     } catch (err) {
//       console.error('Failed to remove photo:', err);
//       setError('Failed to remove photo. Please try again.');
//     }
//   };
  

//   const toggleForFree = () => {
//     setFormData((prev) => ({
//       ...prev,
//       forFree: !prev.forFree,
//     }));
//   };

//   const toggleGenre = (name: string) => {
//     setFormData((prev) => {
//       const isSelected = prev.genreNames.includes(name);
//       return {
//         ...prev,
//         genreNames: isSelected
//           ? prev.genreNames.filter((genreName) => genreName !== name)
//           : [...prev.genreNames, name],
//       };
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       let photoUrls: string[] = [];
//       const newFiles = selectedFiles.filter((file) => file instanceof File) as File[];

//       if (newFiles.length > 0) {
//         const formData = new FormData();
//         newFiles.forEach((file) => formData.append('photos', file));
//         const response = await uploadPhoto(formData);
//         photoUrls = response.data.map((photo: { fileUrl: string }) => photo.fileUrl);
//       }

//       const bookData = {
//         ...formData,
//         bookPhotos: [
//           ...selectedFiles.filter((file) => typeof file === 'string'), // Keep existing URLs
//           ...photoUrls, // Add new URLs
//         ],
//       };

//       if (id) {
//         await updateBook(id, bookData);
//         alert('Book updated successfully!');
//       } else {
//         await addBook(bookData);
//         alert('Book added successfully!');
//       }
//       navigate('/home', { replace: true });
//     } catch {
//       setError('Failed to save book.');
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="book-addition-page">
//       <h1>{id ? 'Edit Book' : 'Add a New Book'}</h1>
//       <form onSubmit={handleSubmit} className="book-addition-form">
//         {/* Title */}
//         <div className="form-group">
//           <label htmlFor="title">Title</label>
//           <input
//             type="text"
//             id="title"
//             name="title"
//             value={formData.title}
//             onChange={handleInputChange}
//             placeholder="Enter the book title"
//           />
//         </div>

//         {/* Author */}
//         <div className="form-group">
//           <label htmlFor="author">Author</label>
//           <input
//             type="text"
//             id="author"
//             name="author"
//             value={formData.author}
//             onChange={handleInputChange}
//             placeholder="Enter the author's name"
//           />
//         </div>

//         {/* Language */}
//         <div className="form-group">
//           <label htmlFor="language">Language</label>
//           <input
//             type="text"
//             id="language"
//             name="language"
//             value={formData.language}
//             onChange={handleInputChange}
//             placeholder="Enter the book's language"
//           />
//         </div>

//         {/* City */}
//         <div className="form-group">
//           <label htmlFor="city">City</label>
//           <input
//             type="text"
//             id="city"
//             name="city"
//             value={formData.city}
//             onChange={handleInputChange}
//             placeholder="Enter the city"
//           />
//         </div>

//         {/* Condition */}
//         <div className="form-group">
//           <label htmlFor="condition">Condition</label>
//           <input
//             type="number"
//             id="condition"
//             name="condition"
//             value={formData.condition}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 condition: parseInt(e.target.value, 10) || 0,
//               }))
//             }
//             placeholder="Enter the book's condition"
//           />
//         </div>

//         {/* For Free */}
//         <div className="form-group">
//           <label>For Free</label>
//           <button type="button" onClick={toggleForFree} className={`toggle-button ${formData.forFree ? 'active' : ''}`}>
//             {formData.forFree ? 'Yes' : 'No'}
//           </button>
//         </div>

//         {/* Description */}
//         <div className="form-group">
//           <label htmlFor="description">Description</label>
//           <textarea
//             id="description"
//             name="description"
//             value={formData.description}
//             onChange={handleInputChange}
//             placeholder="Enter a description of the book"
//           />
//         </div>

//         {/* File Upload */}
//         {/* <div className="form-group">
//           <label htmlFor="photos">Upload Photos</label>
//           <input type="file" id="photos" multiple onChange={handleFileChange} />
//         </div> */}

//         {/* <div className="form-group">
//           <label>Book Photos</label>
//           <div className="photo-preview">
//             {selectedFiles.map((file, index) => (
//               <div key={index} className="photo-item">
//                 {typeof file === 'string' ? (
//                   <img src={file} alt={`Photo ${index}`} />
//                 ) : (
//                   <img src={URL.createObjectURL(file)} alt={`Photo ${index}`} />
//                 )}
//                 <input
//                   type="file"
//                   onChange={(e) => handleFileChange(e, index)}
//                   className="photo-replace"
//                 />
//               </div>
//             ))}
//           </div>
//           <input type="file" multiple onChange={handleFileChange} />
//         </div> */}

//         <div className="form-group">
//           <label>Book Photos</label>
//           <div className="photo-preview">
//             {selectedFiles.map((file, index) => (
//               <div key={index} className="photo-item">
//                 {typeof file === 'string' ? (
//                   <img src={file} alt={`Photo ${index}`} />
//                 ) : (
//                   <img src={URL.createObjectURL(file)} alt={`Photo ${index}`} />
//                 )}
//                 <input
//                   type="file"
//                   onChange={(e) => handleFileChange(e, index)}
//                   className="photo-replace"
//                 />
//                 <button type="button" onClick={() => handleRemovePhoto(index)}>
//                   Remove
//                 </button>
//               </div>
//             ))}
//           </div>
//           <input type="file" multiple onChange={handleFileChange} />
//         </div>

//         {/* Genres */}
//         <div className="form-group">
//           <label>Genres</label>
//           <button type="button" onClick={() => setGenrePopupVisible(true)}>
//             Select Genres
//           </button>
//           <div className="selected-genres">
//             {formData.genreNames.map((genreName) => (
//               <span key={genreName}>{genreName}</span>
//             ))}
//           </div>
//         </div>

//         {genrePopupVisible && (
//           <div className="genre-popup">
//             <div className="genre-popup-content">
//               <h3>Select Genres</h3>
//               {genres.map((genre) => (
//                 <div key={genre.id} className="genre-item">
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={formData.genreNames.includes(genre.name)}
//                       onChange={() => toggleGenre(genre.name)}
//                     />
//                     {genre.name}
//                   </label>
//                 </div>
//               ))}
//               <button type="button" onClick={() => setGenrePopupVisible(false)}>
//                 Done
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Submit */}
//         <button type="submit" className="submit-button">
//           {id ? 'Save Changes' : 'Add Book'}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddBook;



import React, { useState, useEffect } from 'react';
import { addBook, getBookById, updateBook } from '../../api/bookApi'; // Include uploadPhotos API
import { uploadPhoto, deletePhoto } from '../../api/photoApi';
import { getAllGenres } from '../../api/genreApi';
import './AddBook.css';
import { useNavigate, useParams } from 'react-router-dom';
import { getMyself } from '../../api/userApi';
import { useAuth } from '../../content/AuthContext';
import { jwtDecode } from 'jwt-decode';

const AddBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userPhoto, setUserPhoto] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    language: '',
    city: '',
    condition: 1,
    forFree: false,
    description: '',
    genreNames: [] as string[],
    bookPhotos: [] as string[],
  });

  const [genres, setGenres] = useState<{ id: string; name: string }[]>([]);
  const [genrePopupVisible, setGenrePopupVisible] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]); // For file uploads
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { accessToken } = useAuth();

  const loggedUserId = accessToken ? jwtDecode<{ id: string }>(accessToken).id : null;

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await getAllGenres();
        setGenres(response.data);
      } catch (err) {
        setError('Failed to fetch genres.');
      } finally {
        setLoading(false);
      }
    };

    const fetchPhoto = async () => {
        try {
          const response = await getMyself();
          const data = response.data.photoUrl;
          setUserPhoto(data);
        } catch (error) {
          console.error('Failed to fetch photo:', error);
        }
      };

    const fetchBookData = async () => {
      if (id) {
        try {
          const response = await getBookById(id); // Fetch book by ID
          const book = response.data;
          setFormData({
            title: book.title,
            author: book.author,
            language: book.language,
            city: book.city,
            condition: book.condition,
            forFree: book.forFree,
            description: book.description,
            genreNames: book.genre.map((g: { genre: { name: string } }) => g.genre.name),
            bookPhotos: book.photos.map((p: { photoUrl: string }) => p.photoUrl),
          });
          setSelectedFiles(book.photos.map((p: { photoUrl: string }) => p.photoUrl));
        } catch (err) {
          setError('Failed to fetch book data.');
        }
      }
    };

    fetchGenres();
    fetchPhoto();
    if (id) fetchBookData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files) {
  //     setSelectedFiles(Array.from(e.target.files)); // Update selected files
  //   }
  // };

  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
  //   if (e.target.files) {
  //     const filesArray = Array.from(e.target.files); // Гарантуємо, що це масив
  //     if (typeof index === 'number') {
  //       setSelectedFiles((prev) => {
  //         const updatedFiles = [...prev];
  //         updatedFiles[index] = filesArray[0]; // Замінюємо існуюче фото новим файлом
  //         return updatedFiles;
  //       });
  //     } else {
  //       setSelectedFiles((prev) => [...prev, ...filesArray]); // Додаємо нові файли
  //     }
  //   }
  // };  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (typeof index === 'number') {
        setSelectedFiles((prev) => {
          const updated = [...prev];
          updated[index] = file; // Replace the file at the index
          return updated;
        });
      } else {
        setSelectedFiles((prev) => [...prev, file]); // Add new file
      }
    }
  };

  const handleRemovePhoto = async (index: number) => {
    const fileToRemove = selectedFiles[index];
  
    try {
      if (typeof fileToRemove === 'string') {
        await deletePhoto(fileToRemove); // Викликаємо API для видалення фото
      }
  
      setSelectedFiles((prev) => prev.filter((_, i) => i !== index)); // Видаляємо фото з локального стану
    } catch (err) {
      console.error('Failed to remove photo:', err);
      setError('Failed to remove photo. Please try again.');
    }
  };
  

  const toggleForFree = () => {
    setFormData((prev) => ({
      ...prev,
      forFree: !prev.forFree,
    }));
  };

  const toggleGenre = (name: string) => {
    setFormData((prev) => {
      const isSelected = prev.genreNames.includes(name);
      return {
        ...prev,
        genreNames: isSelected
          ? prev.genreNames.filter((genreName) => genreName !== name)
          : [...prev.genreNames, name],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let photoUrls: string[] = [];
      const newFiles = selectedFiles.filter((file) => file instanceof File) as File[];

      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach((file) => formData.append('photos', file));
        const response = await uploadPhoto(formData);
        photoUrls = response.data.map((photo: { fileUrl: string }) => photo.fileUrl);
      }

      const bookData = {
        ...formData,
        bookPhotos: [
          ...selectedFiles.filter((file) => typeof file === 'string'), // Keep existing URLs
          ...photoUrls, // Add new URLs
        ],
      };

      if (id) {
        await updateBook(id, bookData);
        alert('Book updated successfully!');
      } else {
        await addBook(bookData);
        alert('Book added successfully!');
      }
      navigate('/home', { replace: true });
    } catch {
      setError('Failed to save book.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="book-addition-page">
      <header className="home-header">
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/home')}>
          BookSwap
        </div>
        <div className="header-actions">
          {/* <button className="custom-button my-chats" onClick={() => navigate('/my-chats')}>
            ✉
          </button> */}
          <button className="custom-button my-liked" onClick={() => navigate('/wishlist')}>
            ♡
          </button>
          <button className="custom-button add-book" onClick={() => navigate('/add-book')}>
            +
          </button>
          <button className="custom-button profile" onClick={() => navigate(`/profile/${loggedUserId}`)}>
            <img src={userPhoto} alt="profile" />
          </button>
        </div>
      </header>
      <h1>{id ? 'Edit Book' : 'Add a New Book'}</h1>
      <form onSubmit={handleSubmit} className="book-addition-form">
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Назва</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter the book title"
          />
        </div>

        {/* Author */}
        <div className="form-group">
          <label htmlFor="author">Автор</label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleInputChange}
            placeholder="Enter the author's name"
          />
        </div>

        {/* Language */}
        <div className="form-group">
          <label htmlFor="language">Мова</label>
          <input
            type="text"
            id="language"
            name="language"
            value={formData.language}
            onChange={handleInputChange}
            placeholder="Enter the book's language"
          />
        </div>

        {/* City */}
        <div className="form-group">
          <label htmlFor="city">Місто</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            placeholder="Enter the city"
          />
        </div>

        {/* Condition */}
        <div className="form-group">
          <label htmlFor="condition">Стан</label>
          <input
            type="number"
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                condition: parseInt(e.target.value, 10) || 0,
              }))
            }
            placeholder="Enter the book's condition"
          />
        </div>

        {/* For Free */}
        <div className="form-group">
          <label>Безкоштовно</label>
          <button type="button" onClick={toggleForFree} className={`toggle-button ${formData.forFree ? 'active' : ''}`}>
            {formData.forFree ? 'Так' : 'Ні'}
          </button>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Опис</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter a description of the book"
          />
        </div>

        {/* File Upload */}
        {/* <div className="form-group">
          <label htmlFor="photos">Upload Photos</label>
          <input type="file" id="photos" multiple onChange={handleFileChange} />
        </div> */}

        {/* <div className="form-group">
          <label>Book Photos</label>
          <div className="photo-preview">
            {selectedFiles.map((file, index) => (
              <div key={index} className="photo-item">
                {typeof file === 'string' ? (
                  <img src={file} alt={`Photo ${index}`} />
                ) : (
                  <img src={URL.createObjectURL(file)} alt={`Photo ${index}`} />
                )}
                <input
                  type="file"
                  onChange={(e) => handleFileChange(e, index)}
                  className="photo-replace"
                />
              </div>
            ))}
          </div>
          <input type="file" multiple onChange={handleFileChange} />
        </div> */}

        <div className="form-group">
          <label>Фото книги
          </label>
          <div className="photo-preview">
            {selectedFiles.map((file, index) => (
              <div key={index} className="photo-item">
                {typeof file === 'string' ? (
                  <img src={file} alt={`Photo ${index}`} />
                ) : (
                  <img src={URL.createObjectURL(file)} alt={`Photo ${index}`} />
                )}
                {/* <input
                  type="file"
                  onChange={(e) => handleFileChange(e, index)}
                  className="photo-replace"
                /> */}
                <button type="button" onClick={() => handleRemovePhoto(index)}>
                  Видалити
                </button>
              </div>
            ))}
          </div>
          <input type="file" multiple onChange={handleFileChange} />
        </div>

        {/* Genres */}
        {/* <div className="form-group">
          <label>Genres</label>
          <button type="button" className="genres-btn" onClick={() => setGenrePopupVisible(true)}>
            Select Genres
          </button>
          <div className="selected-genres">
            {formData.genreNames.map((genreName) => (
              <span key={genreName}>{genreName}</span>
            ))}
          </div>
        </div>

        {genrePopupVisible && (
          <div className="genre-popup">
            <div className="genre-popup-content">
              <h3>Select Genres</h3>
              {genres.map((genre) => (
                <div key={genre.id} className="genre-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.genreNames.includes(genre.name)}
                      onChange={() => toggleGenre(genre.name)}
                    />
                    {genre.name}
                  </label>
                </div>
              ))}
              <button type="button" onClick={() => setGenrePopupVisible(false)}>
                Done
              </button>
            </div>
          </div>
        )} */}

        {/* Genres Dropdown */}
        {/* Genres */}
          <div className="form-group">
            <label>Genres</label>
            <div className="genres-list">
              {genres.map((genre) => (
                <label key={genre.id} className="genre-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.genreNames.includes(genre.name)}
                    onChange={() => toggleGenre(genre.name)}
                  />
                  {genre.name}
                </label>
              ))}
            </div>
          </div>

        {/* Submit */}
        <button type="submit" className="submit-button">
          {id ? 'Зберегти зміни' : 'Додати книгу'}
        </button>
      </form>
    </div>
  );
};

export default AddBook;


