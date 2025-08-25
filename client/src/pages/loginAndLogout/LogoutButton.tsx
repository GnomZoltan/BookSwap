import React, { FormEvent } from "react";
import "../welcome/Welcome.css";
import { useAuth } from "../../content/AuthContext";
import { logout } from "../../api/authenticationApi";
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  const handleClick = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      await logout();
      setAccessToken("");
    } catch (err) {
      console.error("Failed to logout");
    }

    navigate("/")
  };

  return (
    <div>
      <button className="logout-btn" onClick={handleClick}>
        Вийти
      </button>
    </div>
  );
};

export default LogoutButton;
