import express from "express";
import "dotenv/config";
import connectDatabase from "./config/database.js";
import productRoutes from "./routes/products.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import favoritesRoutes from "./routes/favourites.js";
import checkoutRoutes from "./routes/checkout.js";
import ordersRoutes from "./routes/orders.js";
import commentsRoutes from "./routes/comments.js";
import chatRoutes from "./routes/chat.js";
import chatUsersRoutes from "./routes/chatUsers.js";
import cors from "cors";
import bodyParser from "body-parser";
import { initSocketServer } from "./socket.js";

const app = express();
const PORT = process.env.PORT;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5176",
  "https://tra-chanh-thi-bun.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use("/", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/comments", commentsRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/chatUsers", chatUsersRoutes);

app.use((req, res, next) => {
    res.status(404).json({ message: 'Đường dẫn không có!' });
});

connectDatabase();

const index = app.listen(PORT, () => console.log(`Cổng đang được mở tại ${PORT}`));

initSocketServer(index, allowedOrigins);