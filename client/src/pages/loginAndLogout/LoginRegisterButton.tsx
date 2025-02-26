import { useNavigate } from "react-router-dom";
import "../welcome/Welcome.css";

const LoginRegisterButton: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="header-buttons">
      <button type="button" className="button" onClick={() => navigate("/login")}>
        Login
      </button>
      <button type="button" className="button" onClick={() => navigate("/register")}>
        Register
      </button>
    </div>
  );
};

export default LoginRegisterButton;
