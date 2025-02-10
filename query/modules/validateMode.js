export const validateMode = (modeCharacteristics) => {
  let { positivity, energy, rhythm, liveliness } = modeCharacteristics;
  let { positivitySign, energySign, rhythmSign, livelinessSign } =
    modeCharacteristics;

  let scores = [positivity, energy, rhythm, liveliness];

  let scoreCheck = scores.find(
    (s) =>
      s === undefined ||
      typeof Number(s) !== "number" ||
      isNaN(s) ||
      Number(s) < 0 ||
      Number(s) > 100
  );

  if (scoreCheck) {
    console.log(
      "One of the provided scores is invalid. A valid score is a number between 1 and 100 inclusive"
    );
    return false;
  }

  let signs = [positivitySign, energySign, rhythmSign, livelinessSign];

  let signCheck = signs.find(
    (s) => s !== "<=" && s !== "<" && s !== ">" && s !== ">="
  );

  if (signCheck) {
    console.log(
      "One or more of the provided signs are invalid.  Valid signs include <, >, <=, and >="
    );
    return false;
  }

  return true;
};
