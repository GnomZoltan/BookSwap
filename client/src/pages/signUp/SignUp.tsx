import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";
import { useAuth } from "../../content/AuthContext";
import { registerUser } from "../../api/authenticationApi";

const SignUp: React.FC = () => {
  const { setAccessToken } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const validateUsername = (username: string): boolean => {
    return username.length >= 3 && username.length <= 10;
  };

  const validatePassword = (password: string): boolean => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const isLengthValid = password.length >= 4 && password.length <= 10;

    return hasUpperCase && hasLowerCase && hasNumber && isLengthValid;
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setError("");

    if (!validateUsername(username)) {
      setError("Username must be between 3 and 10 characters.");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "Password must be between 4 and 10 characters and include at least one uppercase letter, one lowercase letter, and one digit."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await registerUser({ username, email, password });
      const accessToken = response.data;

      setAccessToken(accessToken);
      navigate("/");
    } catch (err) {
      setError("Failed to sign up. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm your password"
          />
        </div>

        <button type="submit" className="signup-btn">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
