const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

//チェック履歴取得（全件）
router.get("/",isAuthenticated, async (req, res) => {
  try {
    const inventoryCheckHistorys = await prisma.inventoryCheckHistory.findMany({
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
router.get("/:isbn",isAuthenticated, async (req, res) => {
  const { isbn } = req.params;
  try {
    const inventoryCheckHistory = await prisma.inventoryCheckHistory.findUnique({
     where: {isbn},
    });
    res.status(201).json(inventoryCheckHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
})

//チェック履歴登録
router.post("/", isAuthenticated, async (req, res) => {

  const {isbn, checkDate} = req.body;
  if (!isbn || !checkDate) {
    return res.status(400).json({ error: '必須項目に値が設定されていません' });
  }

  try {
    const newinventoryCheckHistory = await prisma.inventoryCheckHistory.create({
      data: {
        isbn,
        checkDate,
      },
    });
    res.status(201).json(newinventoryCheckHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
});

//チェック履歴更新
// router.put('/', async (req, res) => {
//   try {
//     const { isbn, checkDate } = req.body;

//     if (!isbn || !checkDate) {
//       return res.status(400).json({ error: '更新する項目に値が設定されていません。' });
//     }

//     // 更新処理
//     const updatedinventoryCheckHistory = await prisma.inventoryCheckHistory.update({
//       where: { isbn },
//       data: {
//         ...(checkDate && { checkDate }),
//       },
//     });
//     res.status(201).json(updatedinventoryCheckHistory);
//   } catch (error) {
//     console.error(error);
//     if (error.code === 'P2025') {
//       return res.status(404).json({ error: '更新対象が見つかりません' });
//     }
//     res.status(500).json({ error: 'サーバーエラーが発生しました' });
//   }
// });

//チェック履歴削除
// router.delete('/', async (req, res) => {
//   try {
//     const {isbn} = req.body;

//     // 削除処理
//     const deletedinventoryCheckHistory = await prisma.inventoryCheckHistory.delete({
//       where: { isbn },
//     });
//     res.status(201).json(deletedinventoryCheckHistory);
//   } catch (error) {
//     console.error(error);
//     if (error.code === 'P2025') {
//       return res.status(404).json({ error: '削除対象が見つかりません' });
//     }
//     res.status(500).json({ error: 'サーバーエラーが発生しました' });
//   }
// });

module.exports = router;
