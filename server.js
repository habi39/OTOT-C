import * as dotenv from 'dotenv';
dotenv.config({path:'./.env'})
import express from 'express';
import jwt from "jsonwebtoken";
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import { ormFindOneUser as _FindOneuser,validatePassword , ormCreateUser as _createUser} from './Model/repository.js';
import { authenticateToken } from './Middleware/middleware.js';
const app = express()
const PORT = 3000
app.use(bodyParser.json());
mongoose.connect('mongodb://localhost:27017/mydb');


app.post('/login', async(req,res)=>{
    try {
        const { username, password } = req.body;
        const user = await _FindOneuser(username,password)
        if (user) {
            const accessToken = jwt.sign({username:username},process.env.ACCESS_TOKEN_SECRET,{expiresIn:"1h"})
            user.accessToken  = accessToken 
            user.save()
            console.log(user)
            console.log(user.accessToken)

            if(validatePassword(password, user.password)){
                console.log(`User ${username} logged in successfully!`)
                return res.status(200).json({message: `Log in is successful!`, user: user});
            }  else {
                return res.status(400).json({message: 'Username and/or Password are missing!'});
            }
        } else {
            return res.status(400).json({message: 'Incorrect username/password!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when trying to log in!'})
    }


})
app.post('/register', async(req,res)=>{
    try {
        const { username, password , role} = req.body;
        if (username && password && role) {
            if (role != "Admin" && role != "User") {
                return res.status(400).json({ message: "Invalid role, only Admin or User allowed" });
            }
            const resp = await _createUser(username, password, role);
            if (resp.err) {
                return res.status(400).json({message: 'Could not create a new user!'});
            } else {
                console.log(`Created new user ${username} successfully!`)
                return res.status(201).json({message: `Created new user ${username} successfully!`});
            }
        } else {
            return res.status(400).json({message: 'Username and/or Password are missing!'});
        }
    } catch (err) {
        return res.status(500).json({message: 'Database failure when creating new user!'})
    }
})

app.get("/welcome", authenticateToken, (req, res) => {
    return res.status(200).send('Hi, you are authenticated to view this page!');
});

app.get("/admin", authenticateToken, (req, res) => {
    const { username, password , role} = req.body;
    if (role!= "Admin") {
        return res.status(403).send("You are not authorized to access this page!");
    } else {
        return res.status(200).send('Hi, you are authorized to view this page!');
    }
})


app.get('/', (req, res) => res.send('Hello World with Express'));
app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});