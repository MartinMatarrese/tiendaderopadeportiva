import { Schema, Types, model } from "mongoose";

const cartSchema = new Schema ({
    userId: {
        type: Types.ObjectId,
        ref: "users",
        required: true
    },
    products: {
        type: [
            {
                id_prod: {
                    type: Schema.Types.ObjectId,
                    required: true,
                    ref: "products"
                },
                quantity: {
                    type: Number,
                    required: true
                }
            }
        ],
        default: []
    }
})
cartSchema.pre("find", function() {
    this.populate("products.id_prod")
})
const cartModel = model("carts", cartSchema)
export default cartModel