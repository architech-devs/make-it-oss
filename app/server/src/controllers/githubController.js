import axios from "axios";
import { decryptToken } from "../models/user.js";

export const getUserRepos = async (req, res) => {
  console.log(req.user.username)
  console.log(req.user.accessToken)
  try {
    const token = decryptToken(req.user.accessToken);
    console.log(token)
    const response = await axios.get("https://api.github.com/user/repos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch repos" });
  }
};

export const getUserOrgs = async (req, res) => {
  try {
    const token = decryptToken(req.user.token);
    const response = await axios.get("https://api.github.com/user/orgs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orgs" });
  }
};

export const getOrgRepos = async (req, res) => {
  const { org } = req.params;
  try {
    const token = decryptToken(req.user.token);
    const response = await axios.get(
      `https://api.github.com/orgs/${org}/repos`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch org repos" });
  }
};
