import jwt from "jsonwebtoken";
import * as dotenv from 'dotenv';
dotenv.config({path:'.././.env'})

function getAccessToken(req) {
    try {
        const authHeader = req.headers['authorization'];
        const authContent = authHeader && authHeader.split(' ');
        if (!authHeader || authContent.length !== 2 || authContent[0] !== "Bearer" || authContent[1] === null) {
            console.log("Access token not provided or invalid");
            return null;
        }
        return authContent[1];
    } catch (err) {
        console.log("Access token not provided or invalid");
        return null;
    }
}


export async function authenticateToken(req, res, next) {
    try {
        const token = getAccessToken(req);
        if (token === null) {
            return res.status(401).json({ message: "Access token not found" });
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) {
                console.log(err)
                return res.status(401).json({ message: "Invalid access token" });
            }
            req.user = user;
            req.accessToken = token;
            next();
        })
    } catch (err) {
        return res.status(500).json({ message: "Problem encountered when validating token" });
    }
}