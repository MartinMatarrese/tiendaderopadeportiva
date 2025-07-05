import { userService } from "../services/user.service.js";

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
            const token = await this.service.login(req.body);
            res
            .cookie("token", token, { httpOnly: true })
            .json({ message: "Login Ok", token});
        } catch(error) {
            if(error.message === "Usuario no encontrado" || error.message === "Credenciales incorrectas") {
                return res.status(401).json({ error: error.message });
            };
            next(error);
        };
    };

    privateData = async(req, res, next) => {
        try {
            if(!req.user)
                throw new Error("No se puede acceder a los datos del usuario");
                res.json({
                    user: req.user
                });
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
            res.redirect(`http://localhost:3000/tiendaderopadeportiva/perfil?token=${token}`);
            // res.json({
            //     mensaje: "Autenticación con Google exitosa",
            //     usuario: req.user
            // });
        } catch (error) {
            next(error)
        };
    };

    logout = async(req, res, next) => {
        try {
            res.clearCookie("token");
            res.status(200).send({ message:"Logout OK" });
        } catch (error) {
            next(error);
        };
    };
};

export const userController = new UserController();