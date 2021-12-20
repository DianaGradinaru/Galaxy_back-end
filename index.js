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

app.get("/", galaxy.getAll);
app.get("/login");
app.post("/login", user.login);
app.get("/register");
app.post("/", multipart, galaxy.submit);
app.post("/register", user.register);

app.listen(config.port, () => {
    console.log(`Running on http://${config.host}:${config.port}/`);
});
