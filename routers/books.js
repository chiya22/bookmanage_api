const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

//書籍取得（全件）
router.get("/books",isAuthenticated, async (req, res) => {
  try {
    const books = await prisma.books.findMany({
//      take: 10,
      orderBy: { isbn: "asc" },
    });
   res.status(201).json(books);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }

})

//書籍取得（1件）
router.get("/books/:isbn",isAuthenticated, async (req, res) => {
  const { isbn } = req.params;
  try {
    const book = await prisma.books.findUnique({
     where: {isbn: isbn},
    });
    res.status(201).json(book);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
})

//書籍登録
router.post("/books", isAuthenticated, async (req, res) => {
  const { book } = req.body;

  if (!book) {
    return res.status(400).json({ message: "登録情報がありません" });
  }

  const {isbn, title, author,publisher} = req.body;
  if (!isbn || !title || !author || !publisher ) {
    return res.status(400).json({ error: '必須項目に値が設定されていません' });
  }

  try {
    const newBook = await prisma.post.create({
      data: {
        isbn,
        title,
        author,
        publisher,
        // isRented,
        // rentedBy,
      },
    });
    res.status(201).json(newBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
});

//書籍更新
router.put('/books/:isbn', async (req, res) => {
  try {
    const isbn = Number(req.params.isbn);
    const { title, author, publisher, isRented, rentedBy } = req.body;

    if (!isbn || !title || !author || !publisher || isRented) {
      return res.status(400).json({ error: '更新する項目に値が設定されていません。' });
    }

    // 更新処理
    const updatedBook = await prisma.books.update({
      where: { isbn },
      data: {
        ...(title && { title }),
        ...(author && { author }),
        ...(publisher && { publisher }),
      },
    });
    res.status(201).json(updatedBook);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '更新対象が見つかりません' });
    }
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

//書籍削除
router.delete('/books/:isbn', async (req, res) => {
  try {
    const isbn = Number(req.params.isbn);

    // 削除処理
    const deletedBook = await prisma.books.delete({
      where: { isbn },
    });
    res.status(201).json(deletedBook);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '削除対象が見つかりません' });
    }
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

module.exports = router;
