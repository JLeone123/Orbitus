export const validateScores = (songCharacteristics) => {
  if (typeof songCharacteristics !== "object") {
    console.log('The "fields" argument is not an object.');
    return null;
  }

  if (Object.keys(songCharacteristics).length === 0) {
    console.log('The provided "fields" argument is empty!');
    return null;
  }

  let { genre, positivity, energy, rhythm, liveliness } = songCharacteristics;
  let scores = [positivity, energy, rhythm, liveliness];
  let scoreNames = ["positivity", "energy", "rhythm", "liveliness"];
  let genres = ["indie", "folk", "country", "classical"];

  // validate the genre field
  if (genre === undefined || typeof genre !== "string" || genre.length === 0) {
    console.log(
      "The provided genre is invalid.  All of the provided genres are valid."
    );
    return null;
  }

  for (let sC of scores) {
    if (
      sC === undefined ||
      typeof sC !== "string" ||
      isNaN(Number(sC)) ||
      Number(sC) < 0 ||
      Number(sC) > 100
    ) {
      console.log(
        "The provided value for the song's " +
          sC +
          " score is invalid.  A valid rating is from 0 to 100."
      );
      return null;
    }
  }

  let newCharacteristics = {};

  if (genres.includes(genre)) {
    newCharacteristics["genre"] = genre;
  } else {
    newCharacteristics["genre"] = "Select Genre";
  }

  scoreNames.forEach((scoreName, i) => {
    newCharacteristics[scoreName] = Number(scores[i]);
  });

  return newCharacteristics;
};
