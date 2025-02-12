/**
 * @param {object} modeCharacteristics the attributes of the newly created mode,
 * which include it's name, the signs of the scores to match songs with,
 * and the score thresholds to match songs with
 * @returns {boolean} Returns true if the modeCharacteristics are valid
 * and false if the modeCharacteristics are invalid
 */

export const checkMode = (modeCharacteristics) => {
  let {
    newModeName,
    positivityScore,
    energyScore,
    rhythmScore,
    livelinessScore,
    positivitySign,
    energySign,
    rhythmSign,
    livelinessSign,
  } = modeCharacteristics;

  if (
    newModeName === undefined ||
    typeof newModeName !== "string" ||
    newModeName.length === 0 ||
    newModeName.length > 150
  ) {
    console.log(
      "The mode name passed in is invalid.  A valid mode name is a string with a length between 1 and 150"
    );
    return false;
  }

  let signs = [positivitySign, energySign, rhythmSign, livelinessSign];

  // Can make this check more specific over time (if necessary).
  let signCheck = signs.every(
    (sign) =>
      sign !== undefined &&
      typeof sign === "string" &&
      (sign === "<" || sign === ">" || sign === "<=" || sign === ">=")
  );

  if (!signCheck) {
    console.log(
      "One of the provided signs is invalid. A valid sign is <, >, <=, or >="
    );
    return false;
  }

  let scores = [positivityScore, energyScore, rhythmScore, livelinessScore];

  let scoreCheck = scores.every(
    (score) =>
      score !== undefined &&
      typeof score === "number" &&
      score >= 0 &&
      score <= 100
  );

  if (!scoreCheck) {
    console.log(
      "One of the provided scores is invalid. A valid score is a number between 1 and 100"
    );

    return false;
  }

  // If all of the checks pass, then the mode characteristics must be valid,
  // so return true
  return true;
};
