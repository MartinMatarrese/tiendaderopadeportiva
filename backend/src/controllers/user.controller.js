import { userService } from "../services/user.service.js";
import { sendMail } from "../utils/mailer.js";

class UserController {
    constructor() {
        this.service = userService;
    };

    register = async(req, res, next) => {
        try {
            const user = await this.service.register(req.body);
            if(!user) {
                return res.status(404).json({ error: "No se pudo registrar el usuario"})
            }
            return res.status(201).json(user);
        } catch(error) {
            next(error);
        };
    };

    login = async(req, res, next) => {
        try {
            const { user, token } = await this.service.login(req.body);
            res
            .cookie("token", token, { httpOnly: true })
            .json({ message: "Login Ok", token });
            
        } catch(error) {
            if(error.message === "Usuario no encontrado" || error.message === "Credenciales incorrectas") {
                return res.status(401).json({ error: error.message });
            };
            next(error);
        };
    };

    privateData = async(req, res, next) => {
        try {
            const user = req.user;
            if(!user)
                return res.status(401).json({error: "No autorizado"})
                res.json({
                    first_name: user.first_name,
                    last_name: user.last_name
            })
                
        } catch(error) {
            next(error)
        }
    };

    updateUser = async(req, res, next) => {
        try {
            const userId = req.user._id;
            const dataToUpdate = req.body;
            if(req.file) {
                dataToUpdate.profilePic = `/public/img/users/${req.file.filename}`;
            }
            const updateUser = await this.service.updateUser(userId, dataToUpdate);
            if(!updateUser) {
                return res.status(400).json({ error: "Usuario no encontrado"});
            };
            res.status(200).json({ message: "Foto de perfil actualizada correctamente", user: updateUser });
        } catch (error) {
            next(error);
        };
    };

    googleProfile = async(req, res, next) => {
        try {
            const user = req.user;           
            
            if(!user) return res.status(401).send("No autorizado");
            const token = this.service.generateToken(user);
            res
            .cookie("token", token, { httpOnly: true })
            .redirect(`http://localhost:3000/tiendaderopadeportiva?token=${token}`)
                        
        } catch (error) {
            next(error)
        };
    };

    logout = async(req, res, next) => {
        try {
            res.clearCookie("token", { httpOnly: true });
            res.status(200).send({ message:"Logout OK" });
        } catch (error) {
            next(error);
        };
    };

    forgotPassword = async(req, res, next) => {
        try {
            const { email } = req.body;            
            const user = await this.service.getUserByEmail(email);            
            if(!user) {                
                return res.status(404).json({message: "Usuario no encontrado"});
            };
            const resetToken = await this.service.generateResetToken(user);
            const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
            await sendMail(
                email,
                "Restablecer contraseña",
                `
                <h2>Hola ${user.first_name} ${user.last_name}</h2>
                <p>Has solicitado restablecer tu contraseña.</p>
                <p>Haz click en el siguiente enlace para continuar:</p>
                <a href="${resetLink}">"${resetLink}</a>
                <p>Este enlace caduca en 15 minutos</p>
                `
            );

            res.status(200).json({ message: "Email de recuperación enviado" });
        } catch (error) {            
            next(error);
        };
    };

    resetPassword = async(req, res, next) => {
        try {
            const { token, password } = req.body;
            await this.service.resetPassword(token, password);
            res.status(200).json({ status: "success", message: "Contraseña actualizada"});
        } catch (error) {
            res.status(404).json({ status: "error", message: error.message });
        };
    };
};

export const userController = new UserController();