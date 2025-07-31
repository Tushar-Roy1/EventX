const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const { OAuth2Client } = require("google-auth-library");

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = "bsbsfbrnsftentwnnwnwn";
const client = new OAuth2Client("1093327250697-e01u1su17cd2pjofoqj3fh484hao1542.apps.googleusercontent.com"); 

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await UserModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {
    res.status(422).json(e);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const userDoc = await UserModel.findOne({ email });
  if (!userDoc) return res.status(404).json({ error: "User not found" });

  const passOk = bcrypt.compareSync(password, userDoc.password);
  if (!passOk) return res.status(401).json({ error: "Invalid password" });

  jwt.sign(
    { email: userDoc.email, id: userDoc._id },
    jwtSecret,
    {},
    (err, token) => {
      if (err) return res.status(500).json({ error: "Token error" });
      res.cookie("token", token).json(userDoc);
    }
  );
};

const profile = (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.json(null);

  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const { name, email, _id } = await UserModel.findById(userData.id);
    res.json({ name, email, _id });
  });
};

const logout = (req, res) => {
  res.cookie("token", "").json(true);
};


const googleLogin = async (req, res) => {
  const { credential } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: credential, // ✅ Use 'credential' from frontend
      audience: "1093327250697-e01u1su17cd2pjofoqj3fh484hao1542.apps.googleusercontent.com",
    });

    const payload = ticket.getPayload();
    const { name, email } = payload;

    let user = await UserModel.findOne({ email });

    if (!user) {
      user = await UserModel.create({
        name,
        email,
        password: "",
      });
    }

    jwt.sign(
      { email: user.email, id: user._id },
      jwtSecret,
      {},
      (err, token) => {
        if (err) return res.status(500).json({ error: "Token creation error" });
        res.cookie("token", token).json(user);
      }
    );
  } catch (error) {
    console.error("Google login error:", error);
    res.status(400).json({ error: "Invalid Google token" });
  }
};


module.exports = {
  register,
  login,
  profile,
  logout,
  googleLogin
};
