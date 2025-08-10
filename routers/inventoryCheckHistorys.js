const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

//チェック履歴取得（全件）
router.get("/inventoryCheckHistory",isAuthenticated, async (req, res) => {
  try {
    const inventoryCheckHistorys = await prisma.inventoryCheckHistorys.findMany({
//      take: 10,
      orderBy: { checkDate: "desc" },
    });
    res.status(201).json(inventoryCheckHistorys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }

})

//チェック履歴取得（1件）
router.get("/inventoryCheckHistorys/:isbn",isAuthenticated, async (req, res) => {
  const { isbn } = req.params;
  try {
    const inventoryCheckHistory = await prisma.inventoryCheckHistorys.findUnique({
     where: {isbn},
    });
    res.status(201).json(inventoryCheckHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
})

//チェック履歴登録
router.post("/inventoryCheckHistorys", isAuthenticated, async (req, res) => {
  const { inventoryCheckHistory } = req.body;

  if (!inventoryCheckHistory) {
    return res.status(400).json({ message: "チェック履歴情報がありません" });
  }

  const {isbn} = req.body;
  if (!isbn ) {
    return res.status(400).json({ error: '必須項目に値が設定されていません' });
  }

  try {
    const newinventoryCheckHistory = await prisma.post.create({
      data: {
        isbn,
      },
    });
    res.status(201).json(newinventoryCheckHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
});

//チェック履歴更新
router.put('/inventoryCheckHistorys/:isbn', async (req, res) => {
  try {
    const isbn = Number(req.params.isbn);
    const { checkDate } = req.body;

    if (!isbn || !checkDate) {
      return res.status(400).json({ error: '更新する項目に値が設定されていません。' });
    }

    // 更新処理
    const updatedinventoryCheckHistory = await prisma.inventoryCheckHistorys.update({
      where: { isbn },
      data: {
        ...(checkDate && { checkDate }),
      },
    });
    res.status(201).json(updatedinventoryCheckHistory);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '更新対象が見つかりません' });
    }
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

//チェック履歴削除
router.delete('/inventoryCheckHistorys/:isbn', async (req, res) => {
  try {
    const isbn = Number(req.params.isbn);

    // 削除処理
    const deletedinventoryCheckHistory = await prisma.inventoryCheckHistorys.delete({
      where: { isbn },
    });
    res.status(201).json(deletedinventoryCheckHistory);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '削除対象が見つかりません' });
    }
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

module.exports = router;
