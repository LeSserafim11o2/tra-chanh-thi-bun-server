import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import { sendNewOrderNotification } from "../socket.js";

const calculateShippingFee = (address) => {
    const { district } = address;
    if (!district) return 30;

    const innerHN = ['Ba Đình', 'Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng', 'Hoàn Kiếm', 'Thanh Xuân', 'Hoàng Mai', 'Long Biên'];
    if (innerHN.includes(district)) return 10;
    if (district.includes("Hà Đông")) return 20;

    return 30;
};

export const checkoutPay = async (req, res) => {
    const { cartItems, phone, paymentMethod, note } = req.body;

    try {
        const user = await User.findOne({ phone });
        if (!user) return res.status(404).json({ message: "Không tìm thấy người dùng" });

        let total = 0;
        let items = [];
        const itemsDetail = [];

        for (const id in cartItems) {
            const product = await Product.findById(id);
            if (product) {
                const subtotal = product.price * cartItems[id];
                total += subtotal;
                items.push({
                    product: product._id,
                    quantity: cartItems[id],
                    price: product.price
                });
                itemsDetail.push({
                    name: product.name,
                    quantity: cartItems[id],
                    unitPrice: product.price,
                    subtotal
                });
            }
        }

        const shipping = calculateShippingFee(user.address);
        const finalTotal = total + shipping;

        const newOrder = await Order.create({
            user: user._id,
            items,
            note,
            shippingFee: shipping,
            total: finalTotal,
            paymentMethod
        });

        sendNewOrderNotification();

        res.status(201).json({ 
            message: "Đơn hàng đã được gửi", 
            orderId: newOrder._id, 
            shipping, 
            total: finalTotal 
        });
    } catch (err) {
        res.status(500).json({ message: "Lỗi khi tạo đơn hàng", error: err.message });
    }
}