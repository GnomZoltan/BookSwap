import React, { useEffect, useState } from 'react';
import { updateMyself, getMyself } from '../../api/userApi'; // Assuming updateMyself is in userApi
import './EditProfile.css'; // Optional for styling
import { useNavigate } from 'react-router-dom';

const EditProfile: React.FC = () => {
  const [userData, setUserData] = useState({
    id: '',
    username: '',
    email: '',
    description: '',
    photoUrl: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch current user data
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await getMyself(); // Fetch current user data
        setUserData(response.data); // Populate state with the current data
      } catch (err) {
        setError('Failed to fetch user data.');
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
      [name]: value, // Update the corresponding field
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedData = Object.keys(userData).reduce((acc, key) => {
        if (userData[key as keyof typeof userData] !== '') {
          acc[key as keyof typeof userData] = userData[key as keyof typeof userData];
        }
        return acc;
      }, {} as typeof userData);

      await updateMyself(updatedData); // Call the update API with changed inputs
      alert('User information updated successfully.');
      navigate(`/profile/${userData.id}`)
    } catch (err) {
      console.error(err);
      setError('Failed to update user information.');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="user-edit-page">
      <h1>Edit Your Profile</h1>
      <form onSubmit={handleSubmit} className="user-edit-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={userData.username}
            onChange={handleChange}
            placeholder="Enter your username"
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
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={userData.description}
            onChange={handleChange}
            placeholder="Enter a description about yourself"
          />
        </div>

        <div className="form-group">
          <label htmlFor="photoUrl">Photo URL</label>
          <input
            type="text"
            id="photoUrl"
            name="photoUrl"
            value={userData.photoUrl}
            onChange={handleChange}
            placeholder="Enter your photo URL"
          />
        </div>

        <button type="submit" className="submit-button">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProfile;
