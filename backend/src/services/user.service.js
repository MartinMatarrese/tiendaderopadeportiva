import { createHash, isValidPassword } from "../utils/utils.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { cartServices } from "./cart.service.js";
import { userRepository } from "../repository/user.repository.js";
import bcrypt from "bcrypt";

class UserService {
    constructor() {
        this.userRepository = userRepository;
    }

    generateToken = (user) => {
        const payLoad = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            age: user.age,
            role: user.role,
            cart: user.cart
        };
        
        return jwt.sign(payLoad, process.env.SECRET_KEY, {expiresIn: "10m"});
    };

    getUserByEmail = async(email) => {
        try {            
            const user = await this.userRepository.getByEmail(email);            
            return user;
        } catch(error) {
            console.error("Error al registrar el usuario: ", error.message);            
            throw new Error(`No se pudo obtener el usuario por el email: ${error.message}`);
        }
    };

    getUserById = async(id) => {
        try {
            const user = await this.userRepository.getById(id);
            return user;
        } catch (error) {
            throw new Error(`No se pudo obtener el usuario por el ID: ${error.message}`);
        }
    };

    register = async(user) => {
        try {
            const { email, password, fromGoogle = false } = user;            
            const existUser = await this.getUserByEmail(email);
            
            if(existUser) throw new Error("El usuario ya existe");

            let hashedPassword = null;

            if(!fromGoogle) {
                if(!password) {
                    throw new Error("La contraseña es obligatoria");
                };
            };
           
            const passwordStr = String(password)
            hashedPassword = createHash(passwordStr);

            if (!hashedPassword) {
                throw new Error("Error al encriptar la contraseña");
            }
            
            const newUser = await userRepository.create({
                ...user,
                password: hashedPassword
            });


            const cartUser = await cartServices.createCart({
                userId: newUser._id,
                products: []
            });
            const updateUser = await userRepository.update(newUser._id, { cart: cartUser._id});            
            return updateUser
        } catch(error) {            
            throw new Error(`Error al registrar el usuario: ${error.message}`);
        };
    };

    login = async(user) => {
        try {
            if(!user || !user.email || !user.password) {
                throw new Error("Faltan datos para iniciar sesión");
            }
            const { email, password } = user;
            const userExist = await this.getUserByEmail(email);
            if(!userExist) throw new Error("Usuario no encontrado");
            const passValid = isValidPassword(password, userExist);
            if(!passValid) throw new Error("Credenciales incorrectas");
            const token = this.generateToken(userExist);
            return { user: userExist, token };
        } catch (error) {
            throw new Error(error);
        }
    };

    updateUser = async(userId, dataToUpdate) => {
        try {
            const updateUser = await this.userRepository.update(userId, dataToUpdate);
            return updateUser
        } catch (error) {
            throw new Error(error.message);
        }
    };

    generateResetToken = async(user) => {
        try {
            return jwt.sign({ id: user._id }, process.env.SECRET_KEY, { expiresIn: "10m"})
        } catch (error) {
            throw new Error(error.message);
        };
    };

    resetPassword = async(token, newPassword) => {
        try {          
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            const hashed = await bcrypt.hash(newPassword, 10);
            return await this.userRepository.updatePassword(decoded._id, hashed)
        } catch (error) {
            throw new Error("token inválido o expirado", error.message);
        }
    }
};

export const userService = new UserService();