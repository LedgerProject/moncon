import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io";
import { Server as HTTPServer } from "http";
import registerRoutes from "./routes/registerRoutes.js";
import publisherRoutes from "./routes/publisherRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import jsRoutes from "./routes/jsRoutes.js";
import zenroomRouter from "./routes/zenroomRouter.js";
import {
  checkIfAdmin,
  checkIfPublisher,
} from "./middlewares/authMiddleware.js";
import UserModel from "./models/user.js";

const app = express();
const http = new HTTPServer(app);
const port = process.env.PORT;

app.use(cors({ origin: process.env.CORS }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the moncon API!");
});

app.use("/v1/register", registerRoutes);
app.use("/v1/publisher", checkIfPublisher, publisherRoutes);
app.use("/v1/user", userRoutes);
app.use("/v1/admin", checkIfAdmin, adminRoutes);
app.use("/v1/js", jsRoutes);
app.use("/v1/zenroom", zenroomRouter);

http.listen(port, async () => {
  try {
    await mongoose.connect(process.env.MONGO_CONNECTION, {
      useNewUrlParser: true,
    });

    console.log(`Server started and listening on port ${port}`);
  } catch (err) {
    console.log("Error starting server: ", err.message);
  }
});

const io = new Server(http, {
  cors: {
    origin: process.env.CORS,
  },
});

io.on("connection", (socket) => {
  socket.on("webCredentialRequest", async (data) => {
    console.log("webCredentialRequest in app.js");
    console.log(data);
    const userId = data?.credential["my-vc"]?.credentialSubject?.id;
    try {
      const user = await UserModel.findOne({ id: userId });
      if (!user) {
        await UserModel.create({ id: userId });
      }
    } catch {
      console.log("userId");
      console.log("error creating user");
    }
    socket.join(data.room);
    socket.broadcast.to(data.idProvider).emit("webCredentialResponse", data);
  });

  socket.on("validatedCredential", (data) => {
    console.log(data, "validatedCredential");
    socket.broadcast.to(data.room).emit("validatedCredentialResponse", data);
  });

  socket.on("validatedPayment", (data) => {
    console.log(data, "validatedPayment");
    socket.broadcast.to(data.room).emit("validatedPaymentResponse", data);
  });

  socket.on("payment", (data) => {
    console.log("payment in app.js");
    console.log(data, "payment");
    socket.join(data.room);
    socket.broadcast.to(data.idProvider).emit("paymentResponse", data);
  });

  socket.on("login", (data) => {
    console.log("login in app.js");
    console.log("login data: ", data);
    socket.join(data.room);
    socket.broadcast.to(data.idProvider).emit("onLogin", data);
  });

  socket.on("notificationMessages", (data) => {
    console.log("notificationMessages in app.js");
    socket.broadcast.to(data.room).emit("appNotification", data);
  });

  socket.on("disconnect", () => {
    console.log(`disconnect: ${socket.id}`);
  });
});
