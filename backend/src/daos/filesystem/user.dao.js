import fs from "fs";
import {v4 as uuidv4 } from "uuid";

class UserDaoFs {
    constructor(path) {
        this.path = path
    };

    getAll = async() => {
        try {
            if(fs.existsSync(this.path)) {
                const users = await fs.promises.readFile(this.path, "utf-8");
                return JSON.parse(users);
            }
            return [];
        } catch(error) {
            throw new Error("Error al obtener usuarios");
        };
    };

    create = async(userData) => {
        try {
            const users = await this.getAll();
            const newUser = {
                id: uuidv4(),
                ...userData
            };
            users.push(newUser);
            await fs.promises.writeFile(this.path, JSON.stringify(users, null, 2));
            return newUser;
        } catch(error) {
            throw new Error(`Error al crear el usuario: ${error.message}`);
        };
    };

    getById = async(id) => {
        try {
            const users = await this.getAll(id);
            const user = users.find((u) => u.id === id);
            return user || null
        } catch(error) {
            throw new Error("Error al obtener el usuario por ID");
        };
    };

};

export const userDao = new UserDaoFs("/src/users.json");