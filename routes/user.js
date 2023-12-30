const express = require("express");
const router = express.Router();
const { showAllUser, addUser, showUserById, editUser, removeUser, ssr } = require("../controllers/user")

router.route("")
    .get(showAllUser)
    .post(addUser)


router.get("/ssr", ssr);


router.route("/:id")
    .get(showUserById)
    .patch(editUser)
    .delete(removeUser);

module.exports = router;