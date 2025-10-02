import { Schema, model } from "mongoose";

const userSchema = new Schema( {
    first_name: {
        type: String,
        required: [true, "El nombre es obligatorio"],
        minlength: [3, "Debe tener al menos tres caractares"],
        maxlength: 30
    },
    
    last_name: {
        type: String,
        required: [true, "El apellido es obligatorio"],
        minlength: [3, "Debe tener al menos tres caractares"],
        maxlength: 30
    },

    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        unique: true,
        match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
    },

    age: {
        type: Number,
        required: function () { 
            return !this.fromGoogle;
        },
        min: [18, "Debe ser mayor de edad"],
        max: 100
    },

    password: {
        type: String,
        required: true,
        minlength: [6, "La contraseña debe tener más de 6 caracteres"],
        default: ""
    },

    cart: {
        type: Schema.Types.ObjectId,
        ref: "carts",
        default: null
    },

    profilePic: {
        type: String,
        default: null
    },

    role: {
        type: String,
        default: "user"
    },

    fromGoogle: {
        type: Boolean,
        default: false
    },

    resetToken: {
        type: String
    },

    resetTokenExpiry: {
        type: Date
    }
});

export const userModel = model("users", userSchema)