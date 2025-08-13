const express = require("express");
const app = express();
const authRoute = require("./routers/auth");
const booksRoute = require("./routers/books");
const inventoryCheckHistorysRoute = require("./routers/inventoryCheckHistorys");
const rentalHistorysRoute = require("./routers/rentalHistorys");
const cors = require("cors");

require("dotenv").config();

const PORT = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use("/api/auth", authRoute);
app.use("/api/books", booksRoute);
app.use("/api/inventoryCheckHistorys", inventoryCheckHistorysRoute);
app.use("/api/rentalHistorys", rentalHistorysRoute);

app.listen(PORT, () => console.log(`server is running on Port ${PORT}`));
