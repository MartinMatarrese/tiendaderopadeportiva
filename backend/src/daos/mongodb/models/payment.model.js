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
        ref: "carts",
        index: true
    },

    ticketId: {
        type: Schema.Types.ObjectId,
        ref: "ticket"
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

// paymentSchema.index({ payment_id: 1 });
// paymentSchema.index({ cartId: 1 });
// paymentSchema.index({ userId: 1 });

export const paymentModel = model("payment", paymentSchema);