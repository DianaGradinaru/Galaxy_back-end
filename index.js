const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const config = require("./config");

const app = express()
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }));

const galaxy = require("./routes/galaxy");
const user = require("./routes/user");

app.get("/", galaxy.getAll);
app.post("/register", user.register);

app.listen(config.port, () => {
    console.log(`Running on http://${config.host}:${config.port}/`);
});
