import { useAuth } from "../../content/AuthContext";
import LogoutButton from "../loginOrLogout/LogoutButton";
import LoginRegisterButton from "../loginOrLogout/LoginRegisterButton";

const Home: React.FC = () => {
    const { accessToken } = useAuth();

    return (
        <div className="home-container">
            <header className="header">
                <div className="project-title">BookSwap</div>
                <div className="header-buttons">
                {accessToken ? <LogoutButton /> : <LoginRegisterButton />}
                </div>
            </header>

            <footer className="footer">Read Easily</footer>
        </div>
    );
}

export default Home;