import React, { useEffect, useState } from 'react';
import { updateMyself, getMyself } from '../../api/userApi';
import { useNavigate } from 'react-router-dom';
import { uploadPhoto, deletePhoto } from '../../api/photoApi';
import './EditProfile.css';

const EditProfile: React.FC = () => {
  const [userData, setUserData] = useState({ id: '', username: '', email: '', description: '', photoUrl: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try { setLoading(true); const r = await getMyself(); setUserData(r.data); }
      catch { setError('Не вдалося завантажити дані користувача.'); }
      finally { setLoading(false); }
    };
    fetchUserData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target; setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files && e.target.files[0]) setSelectedFile(e.target.files[0]); };

  const handleRemovePhoto = async () => {
    try {
      if (userData.photoUrl) { const fileName = userData.photoUrl.split('/').pop(); if (fileName) await deletePhoto(fileName); }
      setSelectedFile(null); setUserData((prev) => ({ ...prev, photoUrl: '' }));
    } catch (err) { console.error('Не вдалося видалити фото:', err); setError('Не вдалося видалити фото.'); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true); let updatedPhotoUrl = userData.photoUrl;
      if (selectedFile) { const fd = new FormData(); fd.append('photos', selectedFile); const r = await uploadPhoto(fd); updatedPhotoUrl = r.data[0].fileUrl; }
      const updatedData = { ...userData, photoUrl: updatedPhotoUrl };
      await updateMyself(updatedData);
      alert('Зміни збережено успішно.');
      navigate(`/profile/${userData.id}`, { replace: true });
    } catch (err) { console.error(err); setError('Не вдалося зберегти зміни.'); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="edit-profile__loading"><p>Завантаження...</p></div>;
  if (error) return <div className="edit-profile__loading"><p>{error}</p></div>;

  return (
    <div className="edit-profile">
      <h1 className="edit-profile__title">Редагувати профіль</h1>
      <form onSubmit={handleSubmit} className="edit-profile__form">
        <div className="edit-profile__card">
          <p className="edit-profile__section-label">Фото профілю</p>
          <div className="edit-profile__avatar-section">
            {(userData.photoUrl || selectedFile) ? (
              <div className="edit-profile__avatar-preview">
                <img src={selectedFile ? URL.createObjectURL(selectedFile) : userData.photoUrl} alt="Profile" className="edit-profile__avatar" />
                <button type="button" className="btn btn--danger btn--sm" onClick={handleRemovePhoto}>Видалити фото</button>
              </div>
            ) : (
              <label className="edit-profile__avatar-upload">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                Завантажити фото
                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
            )}
          </div>
        </div>
        <div className="edit-profile__card">
          <p className="edit-profile__section-label">Особисті дані</p>
          <div className="form-field"><label htmlFor="username" className="form-field__label">Ім'я користувача</label><input type="text" id="username" name="username" className="form-field__input" value={userData.username} onChange={handleChange} placeholder="Введіть ваше ім'я" /></div>
          <div className="form-field" style={{ marginTop: 'var(--space-4)' }}><label htmlFor="email" className="form-field__label">Email</label><input type="email" id="email" name="email" className="form-field__input" value={userData.email} onChange={handleChange} placeholder="Введіть ваш email" /></div>
          <div className="form-field" style={{ marginTop: 'var(--space-4)' }}><label htmlFor="description" className="form-field__label">Опис</label><textarea id="description" name="description" className="form-field__textarea" value={userData.description} onChange={handleChange} placeholder="Розкажіть про себе..." rows={4} /></div>
        </div>
        <button type="submit" className="edit-profile__submit">Зберегти зміни</button>
      </form>
    </div>
  );
};

export default EditProfile;
