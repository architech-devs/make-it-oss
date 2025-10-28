import mongoose from "mongoose";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const userSchema = new mongoose.Schema({
  githubId: { type: String, required: true, unique: true },
  username: String,
  avatarUrl: String,
  accessToken: String,
  repositories: [String], // list of repo names
  favorites: [{ type: String }], // full_name of favorite repos
  analysisHistory: [{
    repo: String,
    analyzedAt: Date,
    resultSummary: String
  }],
  preferences: {
    defaultRepo: String,
    notifications: Boolean,
    theme: { type: String, default: 'light' }
  },
  organizations: [{
    orgName: String,
    role: { type: String, enum: ['admin', 'member'], default: 'member' },
    repos: [String]
  }]
}, { timestamps: true });

export const encryptToken = (token) => {
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    process.env.ENCRYPT_KEY,
    Buffer.alloc(16, 0)
  );
  let encrypted = cipher.update(token, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
};

export const decryptToken = (encryptedToken) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    process.env.ENCRYPT_KEY,
    Buffer.alloc(16, 0)
  );
  let decrypted = decipher.update(encryptedToken, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

export default mongoose.model("User", userSchema);
