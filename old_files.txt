const express = require("express");
const users = require("./MOCK_DATA.json")
const fs = require("fs");

const PORT = 5000
const app = express();

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

app.get("/api/users", (req, res) => {
    // console.log(req.name);
    res.setHeader("x-myheader","nothing")
    console.log(req.headers);
    return res.json(users);
})

//custom middleware for the specific route
const customMiddleware = (req, res, next) => {
    req.name = "Ankit";
    next();
}
//---one syntax 
// app.use("/users",customMiddleware);

app.get("/users", [customMiddleware], (req, res) => {
    // console.log(req.name);
    const html = `<ul>
        ${users.map((user) => `<li>${user.first_name}</li>`).join('')}
    </ul>`;
    return res.send(html);
    // SSR
});

app.get("/api/users/:id", (req, res) => {
    const id = Number(req.params.id);
    const user = users.find((user) => id === user.id);

    if (user) {
        return res.json(user); // or res.send(user) depending on your use case
    } else {
        return res.status(404).json({ error: "User not found" });
    }
});

app.post("/api/users", (req, res) => {
    if(!req.body||!req.body.first_name||!req.body.last_name||!req.body.id||!req.body.gender||!req.body.email||!ip_address){
        return res.status(404).json({status:"some fields are missing"});
    }
    const body = req.body;
    users.push({ ...body, id: users.length + 1 });
    fs.writeFile("./MOCK_DATA.json", JSON.stringify(users), () => {
        res.status(201).json({ status: `success user added with id:${users.length}` });
    })
})


app.route("/api/users/:id")
    .patch((req, res) => {
        const id = req.params.id;
        const body = req.body;

        let updatedUsers = users.map((user) => {
            if (user.id == id) {
                for (let key in body) {
                    user[key] = body[key];
                }
                return user;
            } else {
                return user;
            }
        });

        let updatedUser = updatedUsers.find((user) => user.id == id);

        fs.writeFile("./MOCK_DATA.json", JSON.stringify(updatedUsers), () => {
            res.json({ status: `success user updated with id:${id}`, user: updatedUser });
        });
    })
    .delete((req, res) => {
        const id = req.params.id;

        // Log the ID for debugging
        console.log("Deleting user with ID:", id);

        // Filter users
        const newUsers = users.filter(user => user.id !== id);

        // Log the newUsers array for debugging
        console.log("Updated users array:", newUsers);

        // Write to file and respond
        fs.writeFile("./MOCK_DATA.json", JSON.stringify(newUsers), () => {
            res.json("deleted");
        });
    });



app.listen(PORT, () => {
    console.log(`serving at port ${PORT} `)
})