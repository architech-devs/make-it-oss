import express from "express";

//Creating admin authorisation
export const adminAuth = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if(!authHeader){
            return res.status(401).json({ error : "Unauthorized. Missing Authorization header."});
        }

        const token = authHeader.split(" ")[1];
        //Compare with an environment variable
        if(token !== process.env.ADMIN_AUTH_SECRET){
            return res.status(403).json({ error :  "Forbidden. Invalid admin token."})
        }
        //If success then continue
        next();
    } catch (error) {
        console.log("Auth error", error);
        return res.status(500).json({ error : "Internal server error"})
    }
}