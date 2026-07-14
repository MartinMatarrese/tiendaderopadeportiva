import { model, Schema } from "mongoose";

const paymentSchema = new Schema ({
    payment_id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },

    userId: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },

    buyerEmail: {
        type: String,
        required: true,
        index: true
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

    items: [{
        title: String,
        quantity: Number,
        unit_price: Number,
        subtotal: Number
    }],

    cartId: {
        type: Schema.Types.ObjectId,
        ref: "carts",
        index: true
    },

    ticketId: {
        type: Schema.Types.ObjectId,
        ref: "ticket"
    },

    paymentMethod: {
        type: String,
        default: "unknown"
    },

    dateApproved: {
        type: Date
    },

    emailSent: {
        type: Boolean,
        default: false
    },

    processedAt: {
        type: Date,
        default: Date.now
    },

    error: {
        type: String
    }

}, {
    timestamps: true
});

export const paymentModel = model("payment", paymentSchema);