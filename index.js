const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multipart = require("connect-multiparty")();
const http = require("http");
const { Server, Socket } = require("socket.io");

// multer
const multer = require("multer");
const upload = multer({ dest: "public/uploads/" });

const config = require("./config");

const app = express()
    .use(cors())
    .use(express.static("public"))
    .use(bodyParser.json()) //express.json
    .use(bodyParser.urlencoded({ extended: true })); //express.urlencoded

const galaxy = require("./routes/galaxy");
const user = require("./routes/user");
const messages = require("./routes/messages");
const replies = require("./routes/replies");

app.get("/", galaxy.getAll);
app.get("/:key", galaxy.getImage);
app.post("/", upload.single("image"), galaxy.submit);

app.get("/replies", multipart, replies.addReply);
app.post("/replies", multipart, replies.addReply);

app.post("/delete", galaxy.delete);

app.get("/login");
app.post("/login", multipart, user.login);

app.get("/register");
app.post("/register", multipart, user.register);

app.get("/profile", user.profile);
app.post("/profile", multipart, user.profile);

app.get("/profile/myPosts", user.myPosts);
app.post("/profile/myPosts", multipart, user.myPosts);

app.post("/profile/favorites", multipart, user.getFavorites);
app.post("/profile/favorites/add", multipart, user.addFavorites);

app.post("/profile/favorites", user.removeFavorites);
app.post("/profile/favorites/remove", user.removeFavorites);

app.get("/messages", multipart, messages.addMessage);
app.post("/messages", multipart, messages.addMessage);

app.listen(config.port, () => {
    console.log(`Running on http://${config.host}:${config.port}/`);
});

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    },
});

io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("join_room", (data) => {
        socket.join(data);
        console.log(`User with ID: ${socket.id} joined room ${data}`);
    });

    socket.on("send_message", (data) => {
        socket.to(data.room).emit("receive_message", data);
    });
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

server.listen(3001, () => {
    console.log("SERVER RUNNING");
});
