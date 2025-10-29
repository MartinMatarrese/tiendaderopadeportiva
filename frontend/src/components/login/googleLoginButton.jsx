import logo from "../../image/g-logo.png"
import "./googleLoginButton.css"

const backUrl = process.env.REACT_APP_BACK_URL;

const GoogleLoginButton = () => {
    const handleGoogleLogin = () => {
        window.location.href = `${backUrl}users/google`;
    };

    return (
        <button className="google-btn" onClick={handleGoogleLogin}>
            <img src={logo} alt="Google" className="google-icon"/>
            Iniciar sessión con Google
        </button>
    );
};

export default GoogleLoginButton;