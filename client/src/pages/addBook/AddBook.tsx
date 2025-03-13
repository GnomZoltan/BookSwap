// import React, { useState, useEffect } from 'react';
// import { addBook } from '../../api/bookApi';
// import { getAllGenres } from '../../api/genreApi';
// import './AddBook.css';
// import { useNavigate } from 'react-router-dom';

// const AddBook: React.FC = () => {
//   const [formData, setFormData] = useState({
//     title: '',
//     author: '',
//     language: '',
//     city: '',
//     condition: 1,
//     forFree: false,
//     description: '',
//     genreNames: [] as string[], // Updated
//     bookPhotos: [] as string[], // Updated
//   });

//   const [genres, setGenres] = useState<{ id: string; name: string }[]>([]);
//   const [genrePopupVisible, setGenrePopupVisible] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();
  

//   useEffect(() => {
//     // Fetch available genres
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

//     fetchGenres();
//   }, []);

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
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

//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const photos = e.target.value.split(',').map((url) => url.trim());
//     setFormData((prev) => ({
//       ...prev,
//       bookPhotos: photos, // Updated
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       await addBook(formData);
//       alert('Book added successfully!');
//       navigate("/home")
//     } catch (err) {
//       console.error('Error adding book:', err);
//       setError('Failed to add book.');
//     }
//   };

//   if (loading) return <p>Loading...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="book-addition-page">
//       <h1>Add a New Book</h1>
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
//             type="number" // Change input type to number
//             id="condition"
//             name="condition"
//             value={formData.condition}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 condition: parseFloat(e.target.value) || 0, // Ensure value is a float
//               }))
//             }
//             placeholder="Enter the book's condition"
//           />
//         </div>

//         {/* For Free Toggle */}
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

//         {/* Photos */}
//         <div className="form-group">
//           <label htmlFor="bookPhotos">Photos (comma-separated URLs)</label>
//           <input
//             type="text"
//             id="bookPhotos"
//             name="bookPhotos"
//             value={formData.bookPhotos.join(', ')} // Updated
//             onChange={handlePhotoChange}
//             placeholder="Enter photo URLs separated by commas"
//           />
//         </div>

//         {/* Genre Popup */}
//         <div className="form-group">
//           <label>Genres</label>
//           <button type="button" onClick={() => setGenrePopupVisible(true)}>
//             Select Genres
//           </button>
//           <div className="selected-genres">
//             {formData.genreNames.map((genreName) => (
//               <span key={genreName}>{genreName}</span> // Display genre names
//             ))}
//           </div>
//         </div>

//         {/* Genre Selection Popup */}
//         {genrePopupVisible && (
//           <div className="genre-popup">
//             <div className="genre-popup-content">
//               <h3>Select Genres</h3>
//               {genres.map((genre) => (
//                 <div key={genre.id} className="genre-item">
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={formData.genreNames.includes(genre.name)} // Check by name
//                       onChange={() => toggleGenre(genre.name)} // Toggle by name
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
//           Add Book
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AddBook;


// import React, { useState, useEffect } from 'react';
// import { addBook, getBookById, updateBook } from '../../api/bookApi';
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
//     genreNames: id ? [] : [] as string[], // Adjusted for Add or Update DTO
//     bookPhotos: id ? [] : [] as string[],
//   });

//   const [genres, setGenres] = useState<{ id: string; name: string }[]>([]);
//   const [genrePopupVisible, setGenrePopupVisible] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();
  

//   useEffect(() => {
//     // Fetch available genres
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
//             genreNames: book.genre.map((g: { genre: { name: string } }) => g.genre.name), // Access nested genre.name
//             bookPhotos: book.photos.map((p: { photoId: string; photoUrl: string }) => p.photoUrl),
//           });
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

//   const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const photos = e.target.value.split(',').map((url) => url.trim());
//     setFormData((prev) => ({
//       ...prev,
//       bookPhotos: photos, // Updated
//     }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       if (id) {
//         await updateBook(id, formData); // Call updateBook in edit mode
//         alert('Book updated successfully!');
//       } else {
//         await addBook(formData); // Call addBook in add mode
//         alert('Book added successfully!');
//       }
//       navigate('/home');
//     } catch (err) {
//       console.error('Error adding book:', err);
//       setError('Failed to add book.');
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
//             type="number" // Change input type to number
//             id="condition"
//             name="condition"
//             value={formData.condition}
//             onChange={(e) =>
//               setFormData((prev) => ({
//                 ...prev,
//                 condition: parseFloat(e.target.value) || 0, // Ensure value is a float
//               }))
//             }
//             placeholder="Enter the book's condition"
//           />
//         </div>

//         {/* For Free Toggle */}
//         <div className="form-group">
//           <label>For Free</label>
//           <button type="button" onClick={toggleForFree} className={toggle-button ${formData.forFree ? 'active' : ''}}>
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

//         {/* Photos */}
//         <div className="form-group">
//           <label htmlFor="bookPhotos">Photos (comma-separated URLs)</label>
//           <input
//             type="text"
//             id="bookPhotos"
//             name="bookPhotos"
//             value={formData.bookPhotos.join(', ')} // Updated
//             onChange={handlePhotoChange}
//             placeholder="Enter photo URLs separated by commas"
//           />
//         </div>

//         {/* Genre Popup */}
//         <div className="form-group">
//           <label>Genres</label>
//           <button type="button" onClick={() => setGenrePopupVisible(true)}>
//             Select Genres
//           </button>
//           <div className="selected-genres">
//             {formData.genreNames.map((genreName) => (
//               <span key={genreName}>{genreName}</span> // Display genre names
//             ))}
//           </div>
//         </div>

//         {/* Genre Selection Popup */}
//         {genrePopupVisible && (
//           <div className="genre-popup">
//             <div className="genre-popup-content">
//               <h3>Select Genres</h3>
//               {genres.map((genre) => (
//                 <div key={genre.id} className="genre-item">
//                   <label>
//                     <input
//                       type="checkbox"
//                       checked={formData.genreNames.includes(genre.name)} // Check by name
//                       onChange={() => toggleGenre(genre.name)} // Toggle by name
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
import { uploadPhoto } from '../../api/photoApi';
import { getAllGenres } from '../../api/genreApi';
import './AddBook.css';
import { useNavigate, useParams } from 'react-router-dom';

const AddBook: React.FC = () => {
  const { id } = useParams<{ id: string }>();
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
        } catch (err) {
          setError('Failed to fetch book data.');
        }
      }
    };

    fetchGenres();
    if (id) fetchBookData();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files)); // Update selected files
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

      if (selectedFiles.length > 0) {
        const formData = new FormData();
        selectedFiles.forEach((file) => formData.append('photos', file));
        const response = await uploadPhoto(formData); // Upload files
        photoUrls = response.data.map((photo: { fileUrl: string }) => photo.fileUrl);
      }

      const bookData = {
        ...formData,
        bookPhotos: photoUrls,
      };

      if (id) {
        await updateBook(id, bookData);
        alert('Book updated successfully!');
      } else {
        await addBook(bookData);
        alert('Book added successfully!');
      }
      navigate('/home');
    } catch (err) {
      console.error('Error adding/updating book:', err);
      setError('Failed to save book.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="book-addition-page">
      <h1>{id ? 'Edit Book' : 'Add a New Book'}</h1>
      <form onSubmit={handleSubmit} className="book-addition-form">
        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Title</label>
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
          <label htmlFor="author">Author</label>
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
          <label htmlFor="language">Language</label>
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
          <label htmlFor="city">City</label>
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
          <label htmlFor="condition">Condition</label>
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
          <label>For Free</label>
          <button type="button" onClick={toggleForFree} className={`toggle-button ${formData.forFree ? 'active' : ''}`}>
            {formData.forFree ? 'Yes' : 'No'}
          </button>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Enter a description of the book"
          />
        </div>

        {/* File Upload */}
        <div className="form-group">
          <label htmlFor="photos">Upload Photos</label>
          <input type="file" id="photos" multiple onChange={handleFileChange} />
        </div>

        {/* Genres */}
        <div className="form-group">
          <label>Genres</label>
          <button type="button" onClick={() => setGenrePopupVisible(true)}>
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
        )}

        {/* Submit */}
        <button type="submit" className="submit-button">
          {id ? 'Save Changes' : 'Add Book'}
        </button>
      </form>
    </div>
  );
};

export default AddBook;
