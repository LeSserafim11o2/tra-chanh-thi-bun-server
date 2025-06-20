import User from "../models/User.js";
import jwt from "jsonwebtoken";
import "dotenv/config";

export const authRegister = async (request, response) => {
    try {
        const {username, phone, password} = request.body;
        if (!/^[^\s]+$/.test(username)) {
            return response.status(400).json({ message: "Tên người dùng không được chứa khoảng trắng." });
        }
        if (!/^0\d{9}$/.test(phone)) {
            return response.status(400).json({ message: "Số điện thoại phải có 10 chữ số và bắt đầu bằng 0." });
        }
        if (password.trim().length < 10) {
            return response.status(400).json({ message: "Mật khẩu phải từ 10 ký tự trở lên." });
        }
        const user = new User({username, phone, password});
        await user.save();
        response.status(201).json({message: "Đăng ký tài khoản thành công!"});
    } catch(error) {
        response.status(400).json({ message: "Đăng ký không thành công!", detail: error.message });
    }
}

export const authLogin = async (request, response) => {
    const {phone, password} = request.body;
    const user = await User.findOne({phone});
    if (!user || !(await user.comparePassword(password))) {
        return response.status(401).json({message: "Sai thông tin đăng nhập!"})
    }
    const token = jwt.sign({id: user._id, role: user.role}, process.env.JWT_SECRET, {expiresIn: "1d"});
    const { password: _, ...safeUser } = user._doc;
    response.json({ token, user: safeUser });
}