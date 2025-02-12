export const generateModeData = (modeData) => {
  return {
    name: modeData["newModeName"],
    positivity: modeData["positivityScore"],
    energy: modeData["energyScore"],
    rhythm: modeData["rhythmScore"],
    liveliness: modeData["livelinessScore"],
    positivitySign: modeData["positivitySign"],
    energySign: modeData["energySign"],
    rhythmSign: modeData["rhythmSign"],
    livelinessSign: modeData["livelinessSign"],
  };
};
