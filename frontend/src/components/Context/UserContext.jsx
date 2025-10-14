import { createContext, useContext, useState, useEffect, useCallback } from "react"; 
import axios from "axios"; 
import Swal from "sweetalert2";

const AuthContext = createContext(); 

export const AuthProvider = ({ children }) => { 
    const [ user, setUser ] = useState(null); 
    const [ loading, setLoading ] = useState(true);
    const [ sessionTimer, setSessionTimer ] = useState(null);
    const [ timeLeft, setTimeLeft ] = useState(29 * 60);
     
    useEffect(() => {
        const initAuth = async() => {
            try {
                const storedUser = sessionStorage.getItem("user");
                const storedToken = sessionStorage.getItem("token");
                if(storedUser && storedToken) {
                    setUser(JSON.parse(storedUser));
                    return;
                };

                if(typeof window != "undefined") {
                    const query = new URLSearchParams(window.location.search);
                    const token = query.get("token");                    
                    if( token ) {
                        const response = await axios.get("http://localhost:8080/users/current", {
                            headers: { Authorization: `Bearer ${token}`},
                            withCredentials: true
                        })
                        const userData = response.data;
                        sessionStorage.setItem("user", JSON.stringify(userData));
                        sessionStorage.setItem("token", token);
                        window.history.replaceState({}, document.title, "/");
                    }
                }
            } catch(error) {
                console.error("Error al inicializar auth", error);                
            } finally {
                setLoading(false)
            }
        };
        initAuth();
    }, []);

    const startSessionTimer = useCallback(() => {
        if(sessionTimer) {
            clearInterval(sessionTimer)
        }
        setTimeLeft(29 * 60);

        const handelLogout = async() => {
        if(sessionTimer) {
            clearInterval(sessionTimer);
            setSessionTimer(null);
        }

        try {
            await axios.post("http:/localhost:8080/users/logout", {}, { withCredentials: true })
        } catch (error) {
            console.error("Error en logout automático:", error);
        } finally {
            setUser(null);
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");

            Swal.fire({
                position: "center",
                icon: "warning",
                title: "Sessión expirada",
                text: "Tu sessión a caducado por inactividad",
                showConfirmButton: true,
                confirmButtonText: "Entendido"
            });
        }
    };

        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if(prevTime <= 1) {
                    handelLogout();
                    return 0;
                }
                return prevTime -1;
            })
        }, 1000)
        setSessionTimer(timer)
    }, [sessionTimer]);

    useEffect(() => {
        if(user) {
            startSessionTimer();
        } else {
            if(sessionTimer) {
                clearInterval(sessionTimer);
                setSessionTimer(null)
            }
        }

        return () => {
            if(sessionTimer) {
                clearInterval(sessionTimer)
            }
        }
    }, [user, sessionTimer, startSessionTimer]);

    // useEffect(() => {
    //     if(user) {
    //         const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    //         const resetTimer = () => startSessionTimer();
    //         events.forEach(event => {
    //             document.addEventListener(event, resetTimer)
    //         });

    //         return () => {
    //             events.forEach(event => {
    //                 document.removeEventListener(event, resetTimer)
    //             });
    //         };
    //     };
    // }, [user, startSessionTimer]);

    const isAuthenticated = !!user;

    const login = async( credentials, navigate, navigateCallBack ) => { 
        try { 
            const response = await axios.post("http://localhost:8080/users/login", credentials, { withCredentials: true, }); 
            const { token, user } = response.data; 
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("user", JSON.stringify(user)) 
            
            setUser(user); 
                    
            Swal.fire({ 
                toast: true,
                position: "top-end", 
                icon: "success", 
                title: `Bienvenido ${user.first_name} ${user.last_name}`, 
                showConfirmButton: false, 
                timer: 1500 
            });
            // navigate(`/?token=${token}`);
            if(navigateCallBack) {
                navigateCallBack()
            } else {
                navigate("/")
            }

        } catch (error) { 
            console.log("Login error", error.response?.data); 
            Swal.fire({ 
                position: "center", 
                icon: "error", 
                title: "Error al iniciar sesión", 
                text: error.response?.data?.error || "Intenta nuevamente", 
                confirmButtonText: "Aceptar" 
            }); 
        };
    };

    const forgotPassword = async(email) => {
        try {
            console.log("Enaviando solicitud de forgot-password para email: ", email);
            
            const response = await axios.post("http://localhost:8080/users/forgot-password", {email}, {withCredentials: true});

            console.log("Respuesta recibida:", response.data);

            Swal.fire({ 
                    position: "center", 
                    icon: "success", 
                    title: "Email enviado", 
                    html: `
                        <div style="text-align: center;">
                            <p>✅ Se ha enviado un email real a:</p>
                            <p><strong>${email}</strong></p>
                            <p style="font-size: 14px; color: #666;">
                                Revisa tu bandeja de entrada y carpeta de spam.
                            </p>
                        </div>
                    `,
                    showConfirmButton: true, 
                    confirmButtonText: "Entendido",
            });
            
            return response.data;
        } catch (error) {
            console.log("Forgot password error", error.response?.data);

            let errorMessage = "No se pudo enviar el email de recuperación";

            if(error.response?.data?.message?.includes("Gmail") || error.response?.data?.message?.includes("configuración")) {
                errorMessage = "Error de configuracion del email. Contacta al administrador.";
            };
            Swal.fire({ 
                position: "center", 
                icon: "error", 
                title: "Error", 
                text: errorMessage,
                confirmButtonText: "Aceptar" 
            });
        };
    };

    const resetPassword = async(token, newPassword) => {
        try {
            const response = await axios.post("http://localhost:8080/users/reset-password", { 
                token, 
                password: newPassword
            }, {withCredentials: true});

            Swal.fire({ 
                position: "center", 
                icon: "success", 
                title: "Contraseña actualizada",
                text: "Su contraseña fue actualizada correctamente",
                showConfirmButton: true, 
                confirmButtonText: "Aceptar" 
            });

            return response.data
        } catch (error) {
            console.log("Reset password", error.response?.data);
            Swal.fire({ 
                position: "center", 
                icon: "error", 
                title: "Error al iniciar sesión", 
                text: error.response?.data?.error || "No se pudo actualizar la contraseña",
                confirmButtonText: "Aceptar" 
            });
        };
    }
                     
    const logout = async( navigate ) => { 
        try {
            await axios.post("http://localhost:8080/users/logout", {}, { withCredentials: true });

            setUser(null);
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
                        
            Swal.fire({ 
                position: "center",
                icon: "success",
                title: "Sesión cerrada",
                showConfirmButton: false,
                timer: 1500
            });
            navigate("/");
        } catch (error) {            
            Swal.fire({ 
                position: "center",
                icon: "error",
                title: error.response?.data?.error || "Intenta nuevamente", 
                showConfirmButton: false, timer: 1500 
            });
        };
    };
                          
    return (
        <AuthContext.Provider value={{ user, login, forgotPassword, resetPassword, logout, loading, isAuthenticated, startSessionTimer, timeLeft }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);