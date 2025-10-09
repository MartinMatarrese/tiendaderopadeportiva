import logo from "../../image/g-logo.png"
import "./googleLoginButton.css"

const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
        window.location.href = "http://localhost:8080/users/google";
    };

    return (
        <button className="google-btn" onClick={handleGoogleLogin}>
            <img src={logo} alt="Google" className="google-icon"/>
            Iniciar sessión con Google
        </button>
    );
};

export default GoogleLoginButton;