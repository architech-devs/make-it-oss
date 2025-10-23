import axios from "axios";
import jwt from "jsonwebtoken";
import User, { encryptToken } from "../models/user.js";

export const githubLogin = (req, res) => {
  try {
    console.log('GitHub login initiated');
    
    const state = Math.random().toString(36).substring(2, 15);
    console.log('Generated state:', state);
    
    res.cookie('oauth_state', state, { 
      httpOnly: true, 
      maxAge: 600000, // 10 minutes
      sameSite: 'lax',
      secure: false, // Set to false for development
      path: '/',
      domain: undefined
    });
    
    console.log('State cookie set:', state);
    
    const redirectUri = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=repo,read:org,user:email&state=${state}&redirect_uri=${encodeURIComponent(process.env.GITHUB_REDIRECT_URI)}`;
    
    console.log('Redirecting to GitHub OAuth...');
    res.redirect(redirectUri);
  } catch (err) {
    console.error('GitHub login error:', err);
    res.redirect(`${process.env.CLIENT_URL}/login?error=login_failed`);
  }
};

export const githubCallback = async (req, res) => {
  const { code, state, error } = req.query;

  console.log('=== GitHub Callback Called ===');
  console.log('Request URL:', req.url);
  console.log('User-Agent:', req.get('User-Agent'));
  console.log('Query params:', { code: code ? 'present' : 'missing', state, error });
  console.log('All cookies:', req.cookies);

  if (req.url.includes('favicon')) {
    console.log('Ignoring favicon request');
    return res.status(404).end();
  }

  if (!code) {
    console.log('No code provided, ignoring request');
    return res.status(400).json({ error: 'No authorization code provided' });
  }

  try {
    if (error) {
      console.error('GitHub OAuth error:', error);
      return res.redirect(`${process.env.CLIENT_URL}/login?error=github_${error}`);
    }

    const storedState = req.cookies?.oauth_state;
    console.log('State verification:', { received: state, stored: storedState });
    
    if (!state || state !== storedState) {
      console.error('Invalid state parameter:', { received: state, stored: storedState });
      
      if (process.env.NODE_ENV === 'development') {
        console.warn('⚠️ DEVELOPMENT MODE: Skipping state verification');
      } else {
        return res.redirect(`${process.env.CLIENT_URL}/login?error=invalid_state`);
      }
    }
    
    res.clearCookie('oauth_state', {
      httpOnly: true,
      sameSite: 'lax',
      secure: false,
      path: '/'
    });

    console.log('Exchanging code for token...');
    
    const tokenRequestData = {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code: code,
      redirect_uri: process.env.GITHUB_REDIRECT_URI
    };

    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      tokenRequestData,
      { 
        headers: { 
          Accept: "application/json",
          'User-Agent': 'make-it-oss-app'
        },
        timeout: 15000
      }
    );

    console.log('Token response received:', tokenResponse.status);
    
    const { access_token: accessToken, error: tokenError, error_description } = tokenResponse.data;
    
    if (tokenError || !accessToken) {
      console.error('Token exchange failed:', { tokenError, error_description, response: tokenResponse.data });
      return res.redirect(`${process.env.CLIENT_URL}/login?error=token_failed`);
    }

    console.log('Access token obtained successfully');

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { 
        Authorization: `Bearer ${accessToken}`,
        'User-Agent': 'make-it-oss-app'
      },
      timeout: 15000
    });

    const { login, avatar_url, id, email, name } = userResponse.data;
    console.log('User info retrieved:', { login, id });

    if (!login || !id) {
      console.error('Invalid user data received');
      return res.redirect(`${process.env.CLIENT_URL}/login?error=user_info_failed`);
    }

    let user = await User.findOneAndUpdate(
      { githubId: id },
      {
        username: login,
        avatarUrl: avatar_url,
        email: email,
        name: name || login,
        accessToken: encryptToken(accessToken),
        lastLogin: new Date()
      },
      { new: true, upsert: true }
    );

    console.log('User saved to database:', user.username);

    const sessionToken = jwt.sign(
      { 
        id: user._id,
        username: user.username,
        githubId: user.githubId
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.cookie("token", sessionToken, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // Set to false for development
      maxAge: 24 * 60 * 60 * 1000,
      path: '/'
    });

    console.log('OAuth flow completed successfully, redirecting to dashboard');
    res.redirect(`${process.env.CLIENT_URL}/dashboard`);

  } catch (err) {
    console.error('GitHub OAuth callback error:', err);
    
    if (err.response) {
      console.error('Error status:', err.response.status);
      console.error('Error data:', err.response.data);
    }
    
    res.redirect(`${process.env.CLIENT_URL}/login?error=oauth_failed`);
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }
    
    const userObj = req.user.toObject ? req.user.toObject() : req.user;
    const { accessToken, ...userWithoutToken } = userObj;
    res.json({ user: userWithoutToken });
  } catch (err) {
    console.error('Get current user error:', err);
    res.status(500).json({ error: "Failed to get user information" });
  }
};

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // Set to false for development
      path: '/'
    });
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ error: "Logout failed" });
  }
};