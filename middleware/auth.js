import jwt from "jsonwebtoken";
import "dotenv/config";

export const verifyToken = (request, response, next) => {
    const authHeader = request.headers.authorization;
    if (!authHeader) return response.status(401).json({message: "Không có token!"});

    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
        if (error) return response.status(403).json({message: "Token không hợp lệ!"});
        request.user = user;
        next();
    })
}

export const isAdmin = (request, response, next) => {
    if (request.user.role !== "admin") {
        return response.status(403).json({message: "Bạn không phải là admin!"});
    }
    next();
}