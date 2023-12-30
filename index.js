const express = require("express");
const users = require("./MOCK_DATA.json")
const fs = require("fs");
const mongoose = require("mongoose");
const { stringify } = require("querystring");


const PORT = 5000
const app = express();


mongoose
    .connect("mongodb://127.0.0.1:27017/np1users")
    .then(() => { console.log("mongodb connected") })
    .catch((err) => consolye.log("Failed to Connect " + err))


const userSchema = new mongoose.Schema({
    first_name: {
        type: String
    },
    last_name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    gender: {
        type: String
    },
    ip_address: {
        type: String
    }
})
const User = mongoose.model("User", userSchema);


//middleware--plugin
app.use(express.urlencoded({ extended: true }))//to make express understand what we are sending through post req
//kuch bi form data ayaga na osko body ma dalna ka kam krega


// console.log( users);//-->its a array


///---------------------------custom middlewares----------------------------
app.use((req, res, next) => {
    req.name = "Sarjeet";
    next();
})
app.use((req, res, next) => {
    // console.log(req.name);
    req.name = "sarjeet singh";
    next();
})

app.get("/api/users", async (req, res) => {
    // console.log(req.name);
    res.setHeader("x-myheader", "nothing")
    console.log(req.headers);
    const allUsers = await User.find({});
    return res.json(allUsers);
})

//custom middleware for the specific route
const customMiddleware = (req, res, next) => {
    req.name = "Ankit";
    next();
}
//---one syntax 
// app.use("/users",customMiddleware);

app.get("/users", [customMiddleware], async (req, res) => {
    // console.log(req.name);
    const users = await User.find({});
    const html = `<ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join('')}
    </ul>`;
    return res.send(html);
    // SSR
});

app.get("/api/users/:id", async (req, res) => {
    const id = req.params.id;
    const reqUser = await User.findById(id);
    if (reqUser) {
        return res.json(reqUser); // or res.send(user) depending on your use case
    } else {
        return res.status(404).json({ error: "User not found" });
    }
});

app.post("/api/users", async (req, res) => {
    if (!req.body || !req.body.first_name || !req.body.last_name || !req.body.gender || !req.body.email || !req.body.ip_address) {
        return res.status(404).json({ status: "some fields are missing" });
    }
    const body = req.body;
    const newUser = await User.create({
        first_name: body.first_name,
        last_name: body.last_name,
        email: body.email,
        gender: body.gender,
        ip_address: body.ip_address
    })
    console.log(newUser);
    return res.status(201).json({ status: "success" });
})


app.route("/api/users/:id")
    .patch(async (req, res) => {
        const id = req.params.id;
        const body = req.body;

        const updateFields = {};
        if (req.body.first_name) updateFields.first_name = req.body.first_name;
        if (req.body.last_name) updateFields.last_name = req.body.last_name;
        if (req.body.email) updateFields.email = req.body.email;
        if (req.body.gender) updateFields.gender = req.body.gender;
        if (req.body.ip_address) updateFields.ip_address = req.body.ip_address;

        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ status: "error", message: "No fields to update" });
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true } // Return the updated document
        );
        if (!updatedUser) {
            return res.status(404).json({ status: "error", message: "User not found" });
        }
        console.log("User updated:", updatedUser);
        return res.status(200).json({ status: "success", message: "User updated successfully", data: updatedUser });
    })
    .delete(async (req, res) => {
        const id = req.params.id;

        await User.findByIdAndDelete(id);

        res.json({ status: "success", message: "user deleted" });
    });



app.listen(PORT, () => {
    console.log(`serving at port ${PORT} `)
})