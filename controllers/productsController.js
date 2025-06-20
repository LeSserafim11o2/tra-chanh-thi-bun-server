import Product from "../models/Product.js";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(404).json({ message: "Không có sản phẩm nào" });
    }
}

export const getProductCategory = (req, res) => {
    Product.findOne({ slug: req.params.slug })
        .then(product => {
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
        res.json(product);
        })
        .catch(error => res.status(500).json({ message: "Lỗi server", error }));
}

export const getProductsDetail = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm này" });
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: "ID không hợp lệ hoặc sản phẩm không tồn tại" });
    }
}

export const addProducts = async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.status(201).json({ message: "Thêm sản phẩm mới thành công", product: newProduct });
    } catch (error) {
        res.status(400).json({ error: "Không thể tạo sản phẩm mới", details: error.message });
    }
}

export const editProducts = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Không tìm thấy sản phẩm để cập nhật" });
        res.json({ message: "Cập nhật thông tin sản phẩm thành công", product: updated });
    } catch (error) {
        res.status(400).json({ error: "Lỗi khi cập nhật sản phẩm", details: error.message });
    }
}

export const deleteProducts = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Không tìm thấy sản phẩm để xoá" });
        res.json({ message: "Sản phẩm đã được xoá thành công", product: deleted });
    } catch (error) {
        res.status(400).json({ error: "Lỗi khi xoá sản phẩm", details: error.message });
    }
}