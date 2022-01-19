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

app.get("/login");
app.post("/login", multipart, user.login);

app.get("/register");
app.post("/register", multipart, user.register);

app.get("/profile", user_info.getData);
app.post("/profile", multipart, user_info.getData);

app.listen(config.port, () => {
    console.log(`Running on http://${config.host}:${config.port}/`);
});
