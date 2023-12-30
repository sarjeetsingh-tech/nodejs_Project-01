const User = require("../models.js/user")

async function showAllUser(req, res) {
    res.setHeader("x-myheader", "nothing")
    console.log(req.headers);
    const allUsers = await User.find({});
    return res.json(allUsers);
}
const addUser = async (req, res) => {
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
}
const showUserById = async (req, res) => {
    const id = req.params.id;
    const reqUser = await User.findById(id);
    if (reqUser) {
        return res.json(reqUser); // or res.send(user) depending on your use case
    } else {
        return res.status(404).json({ error: "User not found" });
    }
}
const editUser = async (req, res) => {
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
}
const removeUser = async (req, res) => {
    const id = req.params.id;

    await User.findByIdAndDelete(id);

    res.json({ status: "success", message: "user deleted" });
}
const ssr = async (req, res) => {
    const users = await User.find({});
    const html = `<ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join('')}
    </ul>`;
    return res.send(html);
    // SSR
}
module.exports = {
    showAllUser, addUser, showUserById, editUser, removeUser,ssr
}