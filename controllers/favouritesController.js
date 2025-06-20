import User from "../models/User.js";

export const getFavouritesProducts = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('likedProducts');
        res.json(user.likedProducts);
    } catch (err) {
        console.error("Lỗi favorites GET:", err);
        res.status(500).json({ message: "Lỗi server" });
    }
}

export const editFavouritesProducts = async (req, res) => {
    const user = await User.findById(req.user.id);
    const pid = req.params.productId;
    if (!user.likedProducts.includes(pid)) user.likedProducts.push(pid);
    await user.save();
    res.json({ success: true });
}

export const removeFavouritesProducts = async (req, res) => {
    const user = await User.findById(req.user.id);
    user.likedProducts = user.likedProducts.filter(id => id.toString() !== req.params.productId);
    await user.save();
    res.json({ success: true });
}