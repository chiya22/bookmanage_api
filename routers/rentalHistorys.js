const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const isAuthenticated = require("../middlewares/isAuthenticated");

const prisma = new PrismaClient();

//貸出履歴取得（全件）
router.get("/",isAuthenticated, async (req, res) => {
  try {
    const rentalHistorys = await prisma.rentalHistorys.findMany({
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
router.get("/:isbn",isAuthenticated, async (req, res) => {
  const { isbn } = req.params;
  try {
    const rentalHistory = await prisma.rentalHistorys.findUnique({
     where: {isbn},
    });
    res.status(201).json(rentalHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "サーバーエラーです。" });
  }
})

//貸出履歴登録
router.post("/", isAuthenticated, async (req, res) => {
  const {isbn, rentalDate, renterName} = req.body;
  if (!isbn || !rentalDate || !renterName) {
    return res.status(400).json({ error: '必須項目に値が設定されていません' });
  }

  try {
    const newRentalHistory = await prisma.rentalHistorys.create({
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
    const { isbn, rentalDate, returnDate, renterName } = req.body;

    if (!isbn || !rentalDate || !rerturnDate || !renterName) {
      return res.status(400).json({ error: '更新する項目に値が設定されていません。' });
    }

    // 更新処理
    const updateRentalHistory = await prisma.rentalHistorys.update({
      where: { isbn },
      data: {
        ...(rentalDate && { rentalDate }),
        ...(returnDate && { returnDate }),
        ...(renterName && { renterName }),
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
router.delete('/', async (req, res) => {
  try {
    const {isbn} = req.body;

    // 削除処理
    const deleteRentalHistory = await prisma.rentalHistorys.delete({
      where: { isbn },
    });
    res.status(201).json(deleteRentalHistory);
  } catch (error) {
    console.error(error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: '削除対象が見つかりません' });
    }
    res.status(500).json({ error: 'サーバーエラーが発生しました' });
  }
});

module.exports = router;
