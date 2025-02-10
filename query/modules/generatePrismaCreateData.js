import crypto from "crypto";

/**
 * Artist ID schema:
 * a) If the artist's name is one word, then take the artist's name,
 * add a hyphen, then add a randomly generated four byte / eight
 * character word
 *
 * b) If the artist's name is two words, then take the artist's name separated
 * by a hyphen, add a hyphen to the end of the second word,
 * then add a randomly generated four byte / eight character word
 *
 * c) If the artist's name is three or more words, then take the artist's name
 * separated by hyphens, add a hyphen to the end of the third word,
 * then add a randomly generated four byte / eight character word
 *
 * If a word in the artist's name is longer than fifty characters,
 * then take the first three characters of the artist's name, and
 * use that name when applying the schema.
 */

const generateArtistId = (artistName, bytes = 4) => {
  if (
    artistName === undefined ||
    typeof artistName !== "string" ||
    artistName.length === 0 ||
    artistName.length > 150
  ) {
    console.log("The provided artistName is invalid");
    return null;
  }

  let artistNameArr = artistName.split(" ");
  let modifiedArtistNameArr = [];

  if (artistNameArr.length > 3) {
    modifiedArtistNameArr = artistNameArr.slice(0, 3);
  } else {
    modifiedArtistNameArr = [...artistNameArr];
  }

  modifiedArtistNameArr = modifiedArtistNameArr.map((word) => {
    if (word.length > 50) {
      return word.slice(0, 3);
    }

    let newWord = word;

    // If the word is one letter, then add two random digits
    // from 0-9
    if (word.length === 1) {
      newWord += Math.floor(Math.random() * 10);
      newWord += Math.floor(Math.random() * 10);
      // If the word is two letters, then add one random digit
      // from 0-9
    } else if (word.length === 2) {
      newWord += Math.floor(Math.random() * 10);
    }

    return newWord;
  });

  let newArtistId = "";

  if (modifiedArtistNameArr.length === 1) {
    newArtistId += modifiedArtistNameArr[0].toLowerCase();
    newArtistId += "-";
    newArtistId += crypto.randomBytes(bytes).toString("hex");
  } else if (modifiedArtistNameArr.length === 2) {
    newArtistId += modifiedArtistNameArr[0].toLowerCase();
    newArtistId += "-";
    newArtistId += modifiedArtistNameArr[1].toLowerCase();
    newArtistId += "-";
    newArtistId += crypto.randomBytes(bytes).toString("hex");
  } else {
    newArtistId += modifiedArtistNameArr[0].toLowerCase();
    newArtistId += "-";
    newArtistId += modifiedArtistNameArr[1].toLowerCase();
    newArtistId += "-";
    newArtistId += modifiedArtistNameArr[2].toLowerCase();
    newArtistId += "-";
    newArtistId += crypto.randomBytes(bytes).toString("hex");
  }

  return newArtistId;
};

/** Song name schema:
 * a) If the song is one word, then take the first letter of the song name,
 * add two random numbers from 0-9, add a hyphen, then add a randomly generated
 * four byte / eight character word
 *
 * b) If the song is two words, then take the first letter of both words,
 * add a random number from 0-9, add a hyphen, then add a randomly generated
 * four byte / eight character word
 *
 * c) If the song is more than two words, take the first letter of each word,
 * then add to the new string a hyphen, and then add a randomly-generated four
 * byte / eight character word.
 *
 */

const generateSongId = (songName, bytes = 4) => {
  if (
    songName === undefined ||
    typeof songName !== "string" ||
    songName.length === 0 ||
    songName.length > 150
  ) {
    console.log("The provided songName is invalid");
    return null;
  }

  let songNameArr = songName.split(" ");
  let newSongId = "";

  if (songNameArr.length === 1) {
    newSongId += songNameArr[0].charAt(0).toLowerCase();
    newSongId += Math.floor(Math.random() * 10);
    newSongId += Math.floor(Math.random() * 10);
    newSongId += "-";
    newSongId += crypto.randomBytes(bytes).toString("hex");
  } else if (songNameArr.length === 2) {
    newSongId += songNameArr[0].charAt(0).toLowerCase();
    newSongId += songNameArr[1].charAt(0).toLowerCase();
    newSongId += Math.floor(Math.random() * 10);
    newSongId += "-";
    newSongId += crypto.randomBytes(bytes).toString("hex");
  } else {
    newSongId += songNameArr[0].charAt(0).toLowerCase();
    newSongId += songNameArr[1].charAt(0).toLowerCase();
    newSongId += songNameArr[2].charAt(0).toLowerCase();
    newSongId += "-";
    newSongId += crypto.randomBytes(bytes).toString("hex");
  }

  return newSongId;
};

console.log(generateSongId("Echoes In"));
console.log(generateArtistId("A P J"));

export const generatePrismaCreateData = (songCharacteristics) => {
  const {
    genre,
    positivity,
    energy,
    rhythm,
    liveliness,
    songName,
    artistName,
  } = songCharacteristics;

  // going to need to create an artist database at some point.
  // for creating new songs, it's not necessary right now.

  // check if artist is already in the database - if yes,
  // then use that artist id.  If not, then create a new artist id.

  // If the song exists in the database with the same artist and
  // song name, then return.

  let newSongId = generateSongId(songName);
  let newArtistId = generateSongId(artistName);

  let data = {};
  data["genre"] = genre;
  data["artist_id"] = newArtistId;
  data["title"] = songName;
  data["song_id"] = newSongId;
  data["artist_name"] = artistName;
  data["audio"] = `audio/${newArtistId}`;
  data["image_art"] = `images/${newSongId}`;
  data["positivity"] = positivity;
  data["energy"] = energy;
  data["rhythm"] = rhythm;
  data["liveliness"] = liveliness;
  return data;
};

// {
//     genre,
//     artist_id: `${songCover.originalname}`, // can change once this is functioning.
//     title: songName,
//     song_id: `${mp3Audio.originalname}`,
//     artist_name: artistName,
//     audio: `audio/${mp3Audio.originalname}`,
//     image_art: `images/${songCover.originalname}`,
//     positivity: Number(positivity),
//     energy: Number(energy),
//     rhythm: Number(rhythm),
//     liveliness: Number(liveliness),
