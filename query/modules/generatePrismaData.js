export const generatePrismaData = (newSongCharacteristics) => {
  const genres = ["indie", "folk", "country", "classical"];
  const { genre, positivity, energy, rhythm, liveliness } =
    newSongCharacteristics;

  let data = {
    positivity: {
      gte: Number(positivity),
    },
    energy: {
      gte: Number(energy),
    },
    rhythm: {
      gte: Number(rhythm),
    },
    liveliness: {
      gte: Number(liveliness),
    },
  };

  if (genres.includes(genre)) {
    data["genre"] = genre;
  }

  return data;
};
