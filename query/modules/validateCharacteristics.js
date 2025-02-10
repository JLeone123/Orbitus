import { validateScores } from "./validateScores.js";

export const validateCharacteristics = (songCharacteristics, image, audio) => {
  let songData = songCharacteristics;
  if (typeof songData !== "object") {
    console.log("The songCharacteristics argument is not an object.");
    return null;
  }

  if (Object.keys(songData).length === 0) {
    console.log('The provided "fields" argument is empty!');
    return null;
  }

  let songScores = {
    genre: songData["genre"],
    positivity: songData["positivity"],
    energy: songData["energy"],
    rhythm: songData["rhythm"],
    liveliness: songData["liveliness"],
  };

  let newScores = validateScores(songScores);

  let { songName, artistName } = songCharacteristics;

  if (
    songName === undefined ||
    typeof songName !== "string" ||
    songName.length === 0 ||
    songName.length > 150
  ) {
    console.log(
      "The provided song name is not valid.  A valid song name has between 1 and 150 characters"
    );
    return null;
  }

  if (
    artistName === undefined ||
    typeof artistName !== "string" ||
    artistName.length === 0 ||
    artistName.length > 150
  ) {
    console.log(
      "The provided artist name is not valid.  A valid artist name is between 1 and 150 characters"
    );
    return null;
  }

  let mp3Audio = image[0];
  let songCover = audio[0];

  // Validating the mp3 audio file
  if (
    mp3Audio === undefined ||
    typeof mp3Audio !== "object" ||
    mp3Audio.mimetype === undefined ||
    typeof mp3Audio.mimetype !== "string" ||
    mp3Audio.mimetype !== "audio/mpeg" ||
    mp3Audio.size < 1 ||
    mp3Audio.size > 50000000
  ) {
    console.log(
      'The MP3 audio file is invalid.  A valid MP3 audio file has a mimetype of "audio/* and a size between one byte and 50 MB'
    );
    return null;
  }

  // Validating mp3 audio file name
  if (
    mp3Audio["originalname"] === undefined ||
    typeof mp3Audio["originalname"] !== "string" ||
    mp3Audio["originalname"].trim().length === 0 ||
    mp3Audio["originalname"].trim().length > 150
  ) {
    console.log(
      "The mp3 audio file name is invalid.  A valid mp3 audio file name is between 1 and 150 characters"
    );

    return null;
  }

  // Validating song cover image file
  if (
    songCover === undefined ||
    typeof songCover !== "object" ||
    songCover.mimetype === undefined ||
    typeof songCover.mimetype !== "string" ||
    (songCover.mimetype !== "image/jpeg" &&
      songCover.mimetype !== "image/png") ||
    songCover.size < 1 ||
    songCover.size > 50000000
  ) {
    console.log(
      'The song cover image file is invalid.  A valid song cover image file has a mimetype of "image/* and has a file size between one byte than and fifty MB'
    );

    return null;
  }

  // Validating song cover image file name
  if (
    songCover["originalname"] === undefined ||
    typeof songCover["originalname"] !== "string" ||
    songCover["originalname"].trim().length === 0 ||
    songCover["originalname"].trim().length > 150
  ) {
    console.log(
      "The song cover image name is invalid.  A valid song cover name is between 1 and 150 characters"
    );

    return null;
  }

  // Creating a newData object to neatly store the
  // song characteristics alongside the files
  let newData = JSON.parse(JSON.stringify(newScores));
  newData["songName"] = songName.trim();
  newData["artistName"] = artistName.trim();

  let newCharacteristics = { newData };

  // Modifiying the original object here to create a valid name,
  // can add more validation here later.
  mp3Audio["originalname"] = mp3Audio["originalname"]
    .trim()
    .split(" ")
    .join("");
  songCover["originalname"] = songCover["originalname"]
    .trim()
    .split(" ")
    .join("");
  newCharacteristics["newMp3Audio"] = mp3Audio;
  newCharacteristics["newSongCover"] = songCover;
  //   console.log(newCharacteristics);
  return newCharacteristics;
};
