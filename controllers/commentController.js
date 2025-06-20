import Comment from "../models/Comment.js";

export const getProductComment = async (req, res) => {
    try {
        const {skip = 0, limit = 10} = req.query;
        const comments = await Comment.find({ product: req.params.productId })
            .populate("user", "username avatar")
            .sort({ createdAt: -1 })
            .skip(Number(skip))
            .limit(Number(limit));
        const totalCount = await Comment.countDocuments({ product: req.params.productId });
        res.json({comments, totalCount});
    } catch (err) {
        console.error("Error fetching comments:", err);
        res.status(500).json({ message: "Lỗi khi lấy bình luận" });
    }
}

export const sendProductComment = async (req, res) => {
    try {
        const { product, content, rating } = req.body;
        
        if (!product) {
            return res.status(400).json({ message: "Product ID là bắt buộc" });
        }
        
        if (!content || content.trim().length === 0) {
            return res.status(400).json({ message: "Nội dung bình luận không được để trống" });
        }
        
        if (content.length > 1000) {
            return res.status(400).json({ message: "Nội dung bình luận không được vượt quá 1000 ký tự" });
        }
        
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: "Đánh giá phải từ 1 đến 5 sao" });
        }
        
        const newComment = await Comment.create({
            product,
            user: req.user.id,
            content: content.trim(),
            rating: parseInt(rating),
        });
        
        const populatedComment = await Comment.findById(newComment._id)
            .populate("user", "username avatar");
        
        res.status(201).json(populatedComment);
    } catch (err) {
        console.error("Error creating comment:", err);
        
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: errors.join(', ') });
        }
        
        res.status(500).json({ message: "Lỗi khi gửi bình luận" });
    }
}

export const editProductComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        
        if (!comment) {
            return res.status(404).json({ message: "Không tìm thấy bình luận" });
        }
        
        if (comment.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "Bạn không có quyền sửa bình luận này" });
        }
        
        const { content, rating } = req.body;
        
        if (content !== undefined) {
            if (!content || content.trim().length === 0) {
                return res.status(400).json({ message: "Nội dung bình luận không được để trống" });
            }
            if (content.length > 1000) {
                return res.status(400).json({ message: "Nội dung bình luận không được vượt quá 1000 ký tự" });
            }
            comment.content = content.trim();
        }
        
        if (rating !== undefined) {
            if (rating < 1 || rating > 5) {
                return res.status(400).json({ message: "Đánh giá phải từ 1 đến 5 sao" });
            }
            comment.rating = parseInt(rating);
        }
        
        await comment.save();
        
        const updatedComment = await Comment.findById(comment._id)
            .populate("user", "username avatar");
        
        res.json(updatedComment);
    } catch (err) {
        console.error("Error updating comment:", err);
        
        if (err.name === 'ValidationError') {
            const errors = Object.values(err.errors).map(e => e.message);
            return res.status(400).json({ message: errors.join(', ') });
        }
        
        res.status(500).json({ message: "Lỗi khi cập nhật bình luận" });
    }
}

export const deleteProductComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        
        if (!comment) {
            return res.status(404).json({ message: "Không tìm thấy bình luận" });
        }

        const isOwner = comment.user.toString() === req.user.id;
        const isAdmin = req.user.role === "admin";
        
        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: "Bạn không có quyền xóa bình luận này" });
        }
        
        await Comment.findByIdAndDelete(req.params.id);
        res.json({ message: "Xóa bình luận thành công" });
    } catch (err) {
        console.error("Lỗi xóa comment:", err);
        res.status(500).json({ message: "Lỗi khi xóa bình luận" });
    }
}