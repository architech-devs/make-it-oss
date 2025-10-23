import jwt from "jsonwebtoken";
import User from "../models/user.js";
import dotenv from "dotenv";
dotenv.config();


export const authenticate = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1];
  const cookieHeader = req.headers.cookie;

if (cookieHeader) {
  const cookies = cookieHeader.split('; ');
  const tokenCookie = cookies.find(c => c.startsWith('token='));
  if (tokenCookie) {
    token = tokenCookie.split('=')[1];
  }
 
}
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Invalid token" });

    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ message: "Forbidden" });
  }
};

const processedCodes = new Set();

export const preventDuplicateOAuth = (req, res, next) => {
  const { code } = req.query;
  
  if (!code) {
    return next();
  }
  
  if (processedCodes.has(code)) {
    console.log('Duplicate OAuth request detected, ignoring');
    return res.status(400).json({ error: 'Request already processed' });
  }
  
  processedCodes.add(code);
  
  setTimeout(() => {
    processedCodes.delete(code);
  }, 10 * 60 * 1000);
  
  next();
};