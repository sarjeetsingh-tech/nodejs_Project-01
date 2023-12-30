const express = require("express");
const userRouter = require("./routes/user");
const buildConnection = require("./connection");
const { logIncomingRequest } = require("./middlewares");

const url = "mongodb://127.0.0.1:27017/np1users"
buildConnection(url).then(() => {
    console.log("connection setup")
}).catch((err) => {
    console.log("failed to connect " + err);
})

const PORT = 5000
const app = express();

app.use(express.urlencoded({ extended: true })) /
app.use(logIncomingRequest("./incomingRequests.txt"));
app.use("/api/users", userRouter)

app.listen(PORT, () => {
    console.log(`serving at port ${PORT} `)
})