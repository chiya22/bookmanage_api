const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

// 社内サーバーのみで運用するため使用しない

//新規ユーザー登録API
router.post("/register", async (req, res) => {

  const { username, email, password } = req.body;

  if (!username || !email || !password ) {
    return res.status(401).json({ error: '必須項目に値が設定されていません' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
  });

  return res.json({ user });
});

//ユーザーログインAPI
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password ) {
    return res.status(401).json({ error: '必須項目に値が設定されていません' });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ erorr: "ユーザーIDまたはパスワードが誤っています。" });
  }

  const isPasswordVaild = await bcrypt.compare(password, user.password);

  if (!isPasswordVaild) {
    return res.status(401).json({ error: "ユーザーIDまたはパスワードが誤っています。" });
  }

  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: "1d",
  });

  return res.json({ token });
});

module.exports = router;
