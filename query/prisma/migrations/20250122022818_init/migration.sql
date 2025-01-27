-- CreateTable
CREATE TABLE "Song" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "genre" TEXT NOT NULL,
    "artist_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "song_id" TEXT NOT NULL,
    "artist_name" TEXT NOT NULL,
    "audio" TEXT NOT NULL,
    "image_art" TEXT NOT NULL,
    "positivity" INTEGER NOT NULL,
    "energy" INTEGER NOT NULL,
    "rhythm" INTEGER NOT NULL,
    "liveliness" INTEGER NOT NULL
);
