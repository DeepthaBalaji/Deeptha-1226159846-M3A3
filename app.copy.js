const express = require("express");
const app = express();

const welComeMiddleware = (req, res, next) => {
    console.log('Welcome to my website');
    next();
}

const checkAdmin = (req, res, next) => {
    if(req.query.admin === 'true') {
        next();
    } else {
        res.status(400).send("Should be admin");
    }
}

app.use(welComeMiddleware);
app.use(checkAdmin);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});