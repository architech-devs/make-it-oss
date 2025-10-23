import axios from "axios";
import jwt from "jsonwebtoken";
import User, { encryptToken } from "../models/user.js";

export const githubLogin = (req, res) => {
  const redirectUri = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,read:org,user`;
  res.redirect(redirectUri);
};

export const githubCallback = async (req, res) => {
  const code = req.query.code;

  try {
    // Exchange code for token
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;

    // Get user info
    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const { login, avatar_url, id } = userResponse.data;

    // Save user
    let user = await User.findOneAndUpdate(
      { githubId: id },
      {
        username: login,
        avatarUrl: avatar_url,
         accessToken: encryptToken(accessToken),
      },
      { new: true, upsert: true }
    );
    // Create JWT
    const sessionToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    // res.cookie("token", accessToken, { httpOnly: true, secure: true });
    res.redirect(`${process.env.CLIENT_URL}dashboard`);
    // res.status(500).json({ error: "GitHub OAuth Successfull",Token:accessToken });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "GitHub OAuth failed" });
  }
};

export const getCurrentUser = async (req, res) => {
  res.json({ user: req.user });
};

export const logoutUser = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
