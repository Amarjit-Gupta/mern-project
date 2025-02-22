require('dotenv').config();

const express = require("express");


const mongoose = require("mongoose");

const cors = require("cors");

const PORT = process.env.PORT || 5000;

const DB_URL = process.env.DATABASE_URL;


mongoose.connect(DB_URL).then(()=>{
    console.log("database connected");
}).catch((err)=>{
    console.log("connection failed: ",err);
});



const userSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String }      
});

const User = mongoose.model("students", userSchema);

const dataSchema = new mongoose.Schema({
    name: { type: String },
    price: { type: String },
    category: { type: String },
    company: { type: String }
});

const Data = mongoose.model("schools", dataSchema);

const app = express();

app.use(express.json());

app.use(cors());

app.post("/signup", async (req, res) => {

    const { name, email, password } = req.body;
    try {
        let result1 = await User.findOne({ email });
        let result = new User(req.body);
        if (result1) {
            res.status(400).json({ message: "email already exist" });
        }
        else { 
            let data = await result.save();
            data = data.toObject();
            delete data.password;
                res.status(200).json({ data });    
        }
    }
    catch (err) {
        res.status(500).json({ message: "something went wrong" });
    }
});

app.post("/login", async (req, res) => {
    let data = await User.findOne(req.body).select("-password");
    if (data) {
            res.send({ data });
    }
    else {
        res.send({ result: "No data found" });
    }
});

app.post("/addproduct",async (req, res) => {
    let data = new Data(req.body);
    let result = await data.save();
    res.send(result);
});

app.get("/productlist",async (req, res) => {
    let data = await Data.find({});
    res.send(data);
});


app.get("/hello",(req, res) => {
    res.send("Hello.....");
});

app.delete("/delete/:id",async (req, res) => {
    // console.log(req.params.id);
    let data = await Data.deleteOne({ _id: req.params.id });
    res.send(data);
});

app.get("/update/:id",async (req, res) => {
    let data = await Data.findOne({ _id: req.params.id });
    res.send(data);
});

app.put("/update/:id",async (req, res) => {
    let data = await Data.updateOne(
        { _id: req.params.id }, { $set: req.body }
    );
    res.send(data);
});


app.get("/search/:key", async (req, res) => {
    const quer = req.params.key;
    // console.log(quer);
    let result = await Data.find({
        "$or": [
            { name: { $regex: quer, $options: 'i' } },  // ("i" makes case-insensitive)
            { category: { $regex: quer, $options: 'i' } },
            { company: { $regex: quer, $options: 'i' } }
        ]
    });
    res.send(result);
});

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`);
});