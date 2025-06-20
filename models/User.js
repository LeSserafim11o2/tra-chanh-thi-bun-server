import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
    username: {type: String, required: true},
    phone: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    role: {type: String, enum: ["user", "admin"], default: "user"},
    avatar: {type: String, default: "https://i.postimg.cc/x83kpBRy/Avatar-Default.jpg"},
    address: {
        street: {type: String, default: ""},
        ward: {type: String, default: ""},
        district: {type: String, default: ""}
    },
    likedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
})

UserSchema.pre("save", async function (next){
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
})

UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

export default mongoose.model("User", UserSchema);