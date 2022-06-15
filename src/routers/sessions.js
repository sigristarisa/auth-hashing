const express = require("express");
const router = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/prisma.js");

router.post("/", async (req, res) => {
  const { username, password } = req.body;
  const foundUser = await prisma.user.findFirst({
    where: {
      username,
    },
  });
  const passwordIsValid = await bcrypt.compare(password, foundUser.password);
  console.log("passwordIsValid", passwordIsValid);

  if (!foundUser || !passwordIsValid) {
    return res.status(401).json({ error: "Invalid username or password." });
  }

  const token = jwt.sign({ username }, process.env.JWT_SECRET);

  res.json({ data: token });
});

module.exports = router;
