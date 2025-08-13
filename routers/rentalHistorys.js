const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

//貸出履歴取得（全件）
router.get("/", async (req, res) => {
  try {
    const rentalHistorys = await prisma.rentalHistory.findMany({
//      take: 10,
      orderBy: { rentalDate: "desc" },
    });
    res.status(201).json(rentalHistorys);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }

})

//貸出履歴取得（1件）
router.get("/:isbn", async (req, res) => {
  const { isbn } = req.params;
  try {
    const rentalHistory = await prisma.rentalHistory.findUnique({
     where: {isbn},
    });
    res.status(201).json(rentalHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
})

//貸出履歴登録
router.post("/",  async (req, res) => {
  const {isbn, rentalDate, renterName} = req.body;
  if (!isbn || !rentalDate || !renterName) {
    return res.status(400).json({ error: '必須項目に値が設定されていません' });
  }

  try {
    const newRentalHistory = await prisma.rentalHistory.create({
      data: {
        isbn,
        rentalDate,
        renterName,
      },
    });
    res.status(201).json(newRentalHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
});

//貸出履歴更新
router.put('/', async (req, res) => {
  try {
    const { id, returnDate } = req.body;

    if (!id || !returnDate) {
      return res.status(400).json({ error: '更新する項目に値が設定されていません。' });
    }

    // 更新処理
    const id_number = Number(id)
    const updateRentalHistory = await prisma.rentalHistory.update({
      where: {id:id_number},
      data: {
        ...(returnDate && { returnDate }),
      },
    });
    res.status(201).json(updateRentalHistory);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '更新対象が見つかりません' });
    }
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

//貸出履歴削除
// router.delete('/', async (req, res) => {
//   try {
//     const {isbn} = req.body;

//     // 削除処理
//     const deleteRentalHistory = await prisma.rentalHistory.delete({
//       where: { isbn },
//     });
//     res.status(201).json(deleteRentalHistory);
//   } catch (error) {
//     console.error(error);
//     if (error.code === 'P2025') {
//       return res.status(404).json({ error: '削除対象が見つかりません' });
//     }
//     res.status(500).json({ error: 'サーバーエラーが発生しました' });
//   }
// });

module.exports = router;
