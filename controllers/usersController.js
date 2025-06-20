import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const updateUserInfomation = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng!" });

        const { username, password, currentPassword, avatar, address } = req.body;

        if (password) {
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Sai mật khẩu hiện tại!" });
        }

        user.password = password;
        }

        if (username) user.username = username;
        if (avatar) user.avatar = avatar;
        if (address) {
        user.address = {
            street: address.street || "",
            ward: address.ward || "",
            district: address.district || "",
        };
        }

        await user.save();

        const { password: _, ...safeUser } = user._doc;
        res.json(safeUser);

    } catch (err) {
        res.status(500).json({ message: "Lỗi server" });
    }
}

export const getUserInfomation = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User không tồn tại!" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Lỗi server khi lấy thông tin user!" });
  }
}