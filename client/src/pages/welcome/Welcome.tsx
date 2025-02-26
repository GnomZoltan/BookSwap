import LoginRegisterButton from "../loginAndLogout/LoginRegisterButton";

const Welcome: React.FC = () => {
    return (
        <div className="home-container">
            <header className="header">
                <div className="project-title">BookSwap</div>
                <div className="header-buttons">
                <LoginRegisterButton />
                </div>
            </header>

            <footer className="footer">Read Easily</footer>
        </div>
    );
}

export default Welcome;