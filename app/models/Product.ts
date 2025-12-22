import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema({
    description: { type: String, required: true },
    brand: { type: String, required: true },
    img: { type: String, required: true },
    basePrice: { type: Number, required: true },
    oldPrice: { type: Number },
    sizes: { type: [String], default: [] },
    categories: { type: [String], default: [] },
}, { timestamps: true });

const Product = models.Product || model("Product", ProductSchema);

export default Product;