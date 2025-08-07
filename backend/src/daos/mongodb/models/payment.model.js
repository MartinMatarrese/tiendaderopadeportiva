import { model, Schema } from "mongoose";

const paymentSchema = new Schema ({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    status: {
        type: String,
        enum: ["success", "pending", "failure", "approved"],
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

    ticketId: {
        type: Schema.Types.ObjectId,
        ref: "ticket"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const paymentModel = model("payment", paymentSchema);