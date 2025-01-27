-- CreateTable
CREATE TABLE "Mode" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "positivity" INTEGER NOT NULL,
    "energy" INTEGER NOT NULL,
    "rhythm" INTEGER NOT NULL,
    "liveliness" INTEGER NOT NULL,
    "positivitySign" TEXT NOT NULL,
    "energySign" TEXT NOT NULL,
    "rhythmSign" TEXT NOT NULL,
    "livelinessSign" TEXT NOT NULL,

    CONSTRAINT "Mode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mode_name_key" ON "Mode"("name");
