import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    price: {type: Number, required: true, min: 0},
    slug: {type: String, required: true, lowercase: true, unique: true, trim: true, match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/},
    category: {type: String, required: true, trim: true},
    description: {type: [String], required: true, default: []},
    image: {type: String, required: true, trim: true},
    inStock: {type: Boolean, required: true, default: true}
}, {timestamps: true});

export default mongoose.model("Product", ProductSchema);