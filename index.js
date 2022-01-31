const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const multipart = require("connect-multiparty")();

const config = require("./config");

const app = express()
    .use(cors())
    .use(bodyParser.json()) //express.json
    .use(bodyParser.urlencoded({ extended: true })); //express.urlencoded

const galaxy = require("./routes/galaxy");
const user = require("./routes/user");
const user_info = require("./routes/userPage");

app.get("/", galaxy.getAll);
app.post("/", multipart, galaxy.submit);

app.post("/delete", multipart, galaxy.delete);
// app.post("/delete/user_id/star_id", multipart, galaxy.delete);

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

app.listen(config.port, () => {
    console.log(`Running on http://${config.host}:${config.port}/`);
});
