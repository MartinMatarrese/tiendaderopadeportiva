import { createContext, useContext, useState, useEffect, useCallback } from "react"; 
import axios from "axios"; 
import Swal from "sweetalert2";

const AuthContext = createContext();

const BackUrl = process.env.REACT_APP_BACK_URL;

axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => { 
    const [ user, setUser ] = useState(null); 
    const [ loading, setLoading ] = useState(true);
    const [ sessionTimer, setSessionTimer ] = useState(null);
    const [ timeLeft, setTimeLeft ] = useState(29 * 60);
    const [ isAuthenticated, setIsAuthenticated ] = useState(undefined);

    
    useEffect(() => {
        const checkAuth = async() => {
            try {
                setLoading(true);
                console.log("Intentando autenticación...");
                console.log("Cookies disponibles:", document.cookie);

                const token = sessionStorage.getItem("token");
                const storedUser = sessionStorage.getItem("user");

                if(!token) {
                    setUser(null);
                    setIsAuthenticated(false);
                    setLoading(false);
                    return;
                };

                axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

                if(storedUser) {
                    setUser(JSON.parse(storedUser));
                    setIsAuthenticated(true);
                    setLoading(false);
                    return;
                }
                
                const response = await axios.get(`${BackUrl}users/current`, { withCredentials: true});
                console.log("Autenticación exitosa:", response.data);
                
                setUser(response.data.user);
                setIsAuthenticated(true);
                sessionStorage.setItem("user", JSON.stringify(response.data.user));
            } catch (error) {
                console.error("❌ Error de autenticación COMPLETO:", {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    headers: error.response?.header,
                    config: {
                        url: error.config?.url,
                        withCredentials: error.config?.withCredentials
                    }
                });
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");
                delete axios.defaults.headers.common["Authorization"];
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        }
        checkAuth()
    }, []);
    
    useEffect(() => {
        if(user && !sessionTimer) {
            startSessionTimer();
        }

        return() => {
            if(sessionTimer) {
                clearInterval(sessionTimer)
            };
        };
    }, [user, sessionTimer])

    const startSessionTimer = useCallback(() => {
        if(sessionTimer) {
            clearInterval(sessionTimer)
        }
        setTimeLeft(29 * 60);

        const handleLogout = async() => {
            if(sessionTimer) {
                clearInterval(sessionTimer);
                setSessionTimer(null);
            }

            try {
                await axios.post(`${BackUrl}users/logout`, {}, { withCredentials: true })
            } catch (error) {
                console.error("Error en logout automático:", error);
            } finally {
                setUser(null);
                sessionStorage.removeItem("token");
                sessionStorage.removeItem("user");

                Swal.fire({
                    position: "center",
                    icon: "warning",
                    title: "Sesión expirada",
                    text: "Tu sesión a caducado por inactividad",
                    showConfirmButton: true,
                    confirmButtonText: "Entendido"
                });
            }
        };

    const timer = setInterval(() => {
        setTimeLeft(prevTime => {
            if(prevTime <= 1) {
                handleLogout();
                return 0;
            }
            return prevTime -1;
        })
    }, 1000)
        setSessionTimer(timer)
        return() => {
            if(timer) {
                clearInterval(timer)
            }
        }
    }, [sessionTimer]);

    const register = async(userData) => {
        try {
            const response = await axios.post(`${BackUrl}users/register`, userData, { withCredentials: true});

            Swal.fire({
                position: "center",
                icon: "success",
                title: "Registro exitoso",
                html: `
                    <div style="text-align: center;">
                        <p>✅ Te has registrado correctamente</p>
                        <p><strong>Revisa en tu casilla de email para verificar tu cuenta</strong></p>
                        <p style="font-size: 14px; color: #666;">
                            Si no encuentras el email, revisa tu carpeta de spam
                        </p>
                    </div>
                `,
                showConfirmButton: true,
                confirmButtonText: "Aceptar"
            });

            return response.data;
        } catch (error) {
            console.log("Register error", error.response?.data);
            let errormsg = "Error en el registro";
            
            if(error.response?.data?.message?.includes("ya existe")) {
                errormsg = "Este email ya esta registrado";
            } else if(error.response?.data?.message) {
                errormsg = error.response.data.message;
            };

            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error en el registro",
                text: errormsg,
                confirmButtonText: "Aceptar"
            });

            throw error;
        };
    };

    const resendVerification = async(email) => {
        try {
            const response = await axios.post(`${BackUrl}users/resend-verification`, { email }, { withCredentials: true });
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Email reenviado",
                text: "Se ha reenviado un nuevo email de verificación",
                showConfirmButton: true,
                confirmButtonText: "Aceptar"
            });

            return response.data;
        } catch (error) {
            console.log("Resend verification error", error.response?.data);
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Error",
                text: error.response?.data?.message || "No se pudo reenviar el email",
                showConfirmButton: "Aceptar"
            });

            throw error
        };
    };

    const login = async( credentials, navigate, navigateCallBack ) => { 
        try { 
            const response = await axios.post(`${BackUrl}users/login`, credentials, { withCredentials: true, }); 
            const { token, user } = response.data;
            console.log("Login exitoso - User data:", user);
            
            sessionStorage.setItem("token", token);
            sessionStorage.setItem("user", JSON.stringify(user));

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            setUser(user);
            setIsAuthenticated(true);
                    
            Swal.fire({ 
                toast: true,
                position: "top-end", 
                icon: "success", 
                title: `Bienvenido ${user.first_name} ${user.last_name}`, 
                showConfirmButton: false, 
                timer: 1500 
            });
        
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
                text: "El email o la contraseña son incorrectos", 
                confirmButtonText: "Aceptar" 
            }); 
        };
    };

    const checkAuthWithToken = async(token) => {
        try {
            setLoading(true);
            console.log("Verificando token recibido vía URL");

            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            const response = await axios.get(`${BackUrl}users/current`);
            const userData = response.data.user;

            setUser(userData);
            setIsAuthenticated(true);
            sessionStorage.setItem("user", JSON.stringify(userData));
            sessionStorage.setItem("token", token);

            console.log("Autenticación exitosa con token de URL");            
            
        } catch (error) {
            console.error("Error autenticando con token:", error);
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            delete axios.defaults.headers.common["Authorization"];
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        };
    };

    useEffect(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get("auth_token");
    
            if(token) {
                console.log("token detectado en URL, procesando...");
                checkAuthWithToken(token);
                window.history.replaceState({}, document.title, window.location.pathname);
            };
        }, [checkAuthWithToken]);

    const forgotPassword = async(email) => {
        try {
            console.log("Enaviando solicitud de forgot-password para email: ", email);
            
            const response = await axios.post(`${BackUrl}users/forgot-password`, {email}, {withCredentials: true});

            console.log("Respuesta recibida:", response.data);

            Swal.fire({ 
                    position: "center", 
                    icon: "success", 
                    title: "Email enviado", 
                    html: `
                        <div style="text-align: center;">
                            <p>✅ Se ha enviado un email a:</p>
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
            const response = await axios.post(`${BackUrl}users/reset-password`, { 
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
            await axios.post(`${BackUrl}users/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem("token")}`
                }
             });

            setUser(null);
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
                        
        } catch (error) {            
            Swal.fire({ 
                position: "center",
                icon: "error",
                title: error.response?.data?.error || "Intenta nuevamente", 
                showConfirmButton: false, timer: 1500 
            });
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            sessionStorage.removeItem("token");
            sessionStorage.removeItem("user");
            delete axios.defaults.headers.common["Authorization"];

            Swal.fire({ 
                position: "center",
                icon: "success",
                title: "Sesión cerrada",
                showConfirmButton: false,
                timer: 1500
            });
            navigate("/");
        };
    };
                          
    return (
        <AuthContext.Provider value={{ user, login, register, resendVerification, forgotPassword, resetPassword, logout, loading, isAuthenticated, checkAuthWithToken, startSessionTimer, timeLeft }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);