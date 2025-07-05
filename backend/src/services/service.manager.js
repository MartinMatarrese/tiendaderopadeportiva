export default class Services {
    constructor(dao) {
        this.dao = dao;
    }

    async getAll() {
        try {
            const response = await this.dao.getAll();
            if(!response) throw new Error("Error getAll");
            return response;
        } catch(error) {
            throw error;            
        }
    };

    async create(obj) {
        try {
            const response = await this.dao.create(obj);
            if(!response) throw new Error("Error al crear");
            return response;
        } catch(error){
            throw (error)
        }
    };

    async upDate(id, obj) {
        try {
            const response = await this.dao.upDate(id, obj);
            if(!response) throw new Error("Error al actualizar");
            return response;
        } catch (error) {
            throw(error)
        }
    };

    async delete(id) {
        try {
            const response = await this.dao.delete(id);
            if(!response) throw new Error("Error al borrar");
            return response;
        } catch(error) {
            throw(error)
        }
    };

    async getById(id) {
        try {
            const response = await this.dao.getById(id);
            if(!response) throw new Error("Error getById");
            return response;
        } catch(error) {
            throw(error)
        }
    };
};