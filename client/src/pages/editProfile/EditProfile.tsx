// import React, { useEffect, useState } from 'react';
// import { updateMyself, getMyself } from '../../api/userApi'; // uploadPhoto для завантаження фото
// import './EditProfile.css';
// import { useNavigate } from 'react-router-dom';
// import { uploadPhoto, deletePhoto } from '../../api/photoApi';

// const EditProfile: React.FC = () => {
//   const [userData, setUserData] = useState({
//     id: '',
//     username: '',
//     email: '',
//     description: '',
//     photoUrl: '',
//   });
//   const [selectedFile, setSelectedFile] = useState<File | null>(null); // Для нового фото
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         setLoading(true);
//         const response = await getMyself(); // Отримати дані поточного користувача
//         setUserData(response.data);
//       } catch (err) {
//         setError('Не вдалося завантажити дані користувача.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUserData();
//   }, []);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setUserData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setSelectedFile(e.target.files[0]);
//     }
//   };

//   const handleRemovePhoto = async () => {
//     try {
//       if (userData.photoUrl) {
//         // Виклик API для видалення фото
//         const fileName = userData.photoUrl.split('/').pop();
//         if (fileName) {
//           await deletePhoto(fileName);
//         }
//       }

//       // Очищуємо локальні дані
//       setSelectedFile(null);
//       setUserData((prev) => ({
//         ...prev,
//         photoUrl: '',
//       }));
//     } catch (err) {
//       console.error('Не вдалося видалити фото:', err);
//       setError('Не вдалося видалити фото.');
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       let updatedPhotoUrl = userData.photoUrl;
  
//       // Якщо є новий файл, завантажуємо фото
//       if (selectedFile) {
//         const formData = new FormData();
//         formData.append('photos', selectedFile);
  
//         const photoResponse = await uploadPhoto(formData); // Завантаження фото
//         updatedPhotoUrl = photoResponse.data[0].fileUrl; // Отримуємо URL першого фото з масиву
//       }
  
//       // Оновлюємо дані користувача
//       const updatedData = { ...userData, photoUrl: updatedPhotoUrl };
//       console.log(updatedData);
//       await updateMyself(updatedData); // Відправлення оновлених даних
  
//       alert('Зміни збережено успішно.');
//       navigate(`/profile/${userData.id}`, { replace: true });
//     } catch (err) {
//       console.error(err);
//       setError('Не вдалося зберегти зміни.');
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   if (loading) return <p>Завантаження...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div className="user-edit-page">
//       <h1>Редагувати профіль</h1>
//       <form onSubmit={handleSubmit} className="user-edit-form">
//         <div className="form-group">
//           <label htmlFor="username">Ім'я користувача</label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={userData.username}
//             onChange={handleChange}
//             placeholder="Введіть ваше ім'я"
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={userData.email}
//             onChange={handleChange}
//             placeholder="Введіть ваш email"
//           />
//         </div>

//         <div className="form-group">
//           <label htmlFor="description">Опис</label>
//           <textarea
//             id="description"
//             name="description"
//             value={userData.description}
//             onChange={handleChange}
//             placeholder="Розкажіть про себе"
//           />
//         </div>

//         <div className="form-group">
//           <label>Фото</label>
//           {userData.photoUrl || selectedFile ? (
//             <div className="photo-preview">
//               <img
//                 src={selectedFile ? URL.createObjectURL(selectedFile) : userData.photoUrl}
//                 alt="Фото користувача"
//               />
//               <button type="button" onClick={handleRemovePhoto}>
//                 Видалити
//               </button>
//             </div>
//           ) : (
//             <input type="file" accept="image/*" onChange={handleFileChange} />
//           )}
//         </div>

//         <button type="submit" className="submit-button">
//           Зберегти зміни
//         </button>
//       </form>
//     </div>
//   );
// };

// export default EditProfile;


import React, { useEffect, useState } from 'react';
import { updateMyself, getMyself } from '../../api/userApi';
import './EditProfile.css';
import { useNavigate } from 'react-router-dom';
import { uploadPhoto, deletePhoto } from '../../api/photoApi';
import { useAuth } from '../../content/AuthContext';
import { jwtDecode } from 'jwt-decode';

const EditProfile: React.FC = () => {
  const [userData, setUserData] = useState({
    id: '',
    username: '',
    email: '',
    description: '',
    photoUrl: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { accessToken } = useAuth();
  const loggedUserId = accessToken ? jwtDecode<{ id: string }>(accessToken).id : null;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await getMyself();
        setUserData(response.data);
      } catch (err) {
        setError('Не вдалося завантажити дані користувача.');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemovePhoto = async () => {
    try {
      if (userData.photoUrl) {
        const fileName = userData.photoUrl.split('/').pop();
        if (fileName) {
          await deletePhoto(fileName);
        }
      }
      setSelectedFile(null);
      setUserData((prev) => ({ ...prev, photoUrl: '' }));
    } catch (err) {
      console.error('Не вдалося видалити фото:', err);
      setError('Не вдалося видалити фото.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      let updatedPhotoUrl = userData.photoUrl;

      if (selectedFile) {
        const formData = new FormData();
        formData.append('photos', selectedFile);
        const photoResponse = await uploadPhoto(formData);
        updatedPhotoUrl = photoResponse.data[0].fileUrl;
      }

      const updatedData = { ...userData, photoUrl: updatedPhotoUrl };
      await updateMyself(updatedData);

      alert('Зміни збережено успішно.');
      navigate(`/profile/${userData.id}`, { replace: true });
    } catch (err) {
      console.error(err);
      setError('Не вдалося зберегти зміни.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Завантаження...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="edit-container">
      {/* Header (same as Home/Wishlist) */}
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
            <img src={userData.photoUrl} alt="profile" />
          </button>
        </div>
      </header>

      {/* Edit form */}
      <div className="user-edit-page">
        <h1>Редагувати профіль</h1>
        <form onSubmit={handleSubmit} className="user-edit-form">
          <div className="form-group">
            <label>Фото</label>
            {userData.photoUrl || selectedFile ? (
              <div className="photo-preview">
                <img
                  src={selectedFile ? URL.createObjectURL(selectedFile) : userData.photoUrl}
                  alt="Фото користувача"
                />
                <button type="button" className="custom-button danger" onClick={handleRemovePhoto}>
                  Видалити фото
                </button>
              </div>
            ) : (
              <input type="file" accept="image/*" onChange={handleFileChange} />
            )}
          </div>

          <div className="form-group">
            <label htmlFor="username">Ім'я користувача</label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleChange}
              placeholder="Введіть ваше ім'я"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              placeholder="Введіть ваш email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Опис</label>
            <textarea
              id="description"
              name="description"
              value={userData.description}
              onChange={handleChange}
              placeholder="Розкажіть про себе"
            />
          </div>

          <button type="submit" className="custom-button primary">
            Зберегти зміни
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
