import React, { FormEvent } from "react";
import "../home/Home.css";
import { useAuth } from "../../content/AuthContext";
import { logout } from "../../api/authenticationApi";

const LogoutButton: React.FC = () => {
  const { setAccessToken } = useAuth();

  const handleClick = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      await logout();
      setAccessToken("");
    } catch (err) {
      console.error("Failed to logout");
    }
  };

  return (
    <div className="header-buttons">
      <button className="button" onClick={handleClick}>
        Logout
      </button>
    </div>
  );
};

export default LogoutButton;
