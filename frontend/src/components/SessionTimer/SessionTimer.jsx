import { useEffect, useState } from "react";
import { useAuth } from "../Context/UserContext";
import "./SessionTimer.css";

export const SessionTimer = () => {
    const { timeLeft, startSessionTimer } = useAuth();
    const [showWarning, setShowWarning ] = useState(false);

    useEffect(() => {
        if(timeLeft <= 300 && timeLeft > 0) {
            setShowWarning(true);
        } else {
            setShowWarning(false)
        }
    }, [timeLeft]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const reamingSeconds = seconds % 60;
        return `${minutes}:${reamingSeconds < 10 ? "0" : ""}${reamingSeconds}`;
    };

    const getTimerColor = () => {
        if(timeLeft <= 300) return "warning";
        if(timeLeft <= 600) return "info";
        return "normal";
    }

    if(!timeLeft || timeLeft > 29 * 60) return null;

    return (
        <div className={`session-timer ${getTimerColor()} ${showWarning ? "pulse" : ""}`}>
            <div className="timer-content">
                <span className="timer-icon">⏰</span>
                <span className="timer-text">
                    Session: {formatTime(timeLeft)}
                </span>
                {showWarning && (
                    <button className="extend-btn" onClick={startSessionTimer} title="Extender session por 30 minutos">
                        Extender
                    </button>
                )}
                <div>
                    {showWarning && (
                        <div className="timer-warning">
                            ⚠️ Tu sessión expirará en {Math.floor(timeLeft / 60)}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}