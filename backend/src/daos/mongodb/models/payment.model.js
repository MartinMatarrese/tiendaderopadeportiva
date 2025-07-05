import { model, Schema } from "mongoose";

const paymentSchema = new Schema ({
    paymentId: {
        type: String,
        required: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },

    status: {
        type: String,
        enum: ["success", "pending", "failure"],
        required: true
    },

    amount: {
        type: Number,
        required: true
    },

    cartId: {
        type: Schema.Types.ObjectId,
        ref: "carts"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const paymentModel = model("payment", paymentSchema);