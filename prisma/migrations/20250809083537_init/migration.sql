-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "isbn" TEXT NOT NULL,
    "titile" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publiser" TEXT NOT NULL,
    "isRented" BOOLEAN NOT NULL DEFAULT false,
    "rentedBy" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("isbn")
);

-- CreateTable
CREATE TABLE "RentalHistory" (
    "id" SERIAL NOT NULL,
    "isbn" TEXT NOT NULL,
    "rentalDate" TEXT NOT NULL,
    "returnDate" TEXT NOT NULL,
    "renterName" TEXT NOT NULL,

    CONSTRAINT "RentalHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryCheckHistory" (
    "id" SERIAL NOT NULL,
    "isbn" TEXT NOT NULL,
    "checkDate" TEXT NOT NULL,

    CONSTRAINT "InventoryCheckHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "RentalHistory" ADD CONSTRAINT "RentalHistory_isbn_fkey" FOREIGN KEY ("isbn") REFERENCES "Book"("isbn") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryCheckHistory" ADD CONSTRAINT "InventoryCheckHistory_isbn_fkey" FOREIGN KEY ("isbn") REFERENCES "Book"("isbn") ON DELETE RESTRICT ON UPDATE CASCADE;
