/**** Data constraints ****
 * 1. The audio file, song, and artist names cannot be null
 * 2. If the image art is null, then use a default image.
 * This can be modified to use the artist's default profile
 * picture.
 ****/

let songOne = {
  genre: "indie",
  artist_id: "justin-lee-ea4adbb8",
  title: "Early Hours", // song name cannot be null
  song_id: "eh1-1435340f",
  artist_name: "Justin Lee", // artist_name cannot be null
  audio: "audio/eh1-1435340f-audio.mp3", // mp3 file path cannot be null
  image_art: "images/justin-lee-ea4adbb8-profile.avif", // if image_art is null, use
  positivity: 60.0,
  energy: 50.0,
  rhythm: 50.0,
  liveliness: 30.0,
};

let songTwo = {
  genre: "indie",
  artist_id: "sky-toes-f3fddefc",
  title: "Brand New Day", // song name cannot be null
  song_id: "bnd-8ed742f6",
  artist_name: "Sky Toes", // artist_name cannot be null
  audio: "audio/bnd-8ed742f6-audio.mp3", // mp3 file path cannot be null
  image_art: "images/sky-toes-f3fddefc-profile.avif", // if image_art is null, use artist image
  positivity: 90.0,
  energy: 75.0,
  rhythm: 50.0,
  liveliness: 70.0,
};

let songThree = {
  genre: "indie",
  artist_id: "tobias-voigt-60ec6760",
  title: "Hope And Wonder", // song name cannot be null
  song_id: "haw-6a84eeff",
  artist_name: "Tobias Voigt", // artist_name cannot be null
  audio: "audio/haw-6a84eeff-audio.mp3", // mp3 file path cannot be null
  image_art: "images/tobias-voigt-60ec6760-profile.avif", // if image_art is null, use artist image
  positivity: 60.0,
  energy: 75.0,
  rhythm: 50.0,
  liveliness: 75.0,
};

let songFour = {
  genre: "indie",
  artist_id: "the-lakes-4b696865",
  title: "Steadfast", // song name cannot be null
  song_id: "s32-50c3327b",
  artist_name: "The Lakes", // artist_name cannot be null
  audio: "audio/s32-50c3327b-audio.mp3", // mp3 file path cannot be null
  image_art: "images/the-lakes-4b696865-profile.avif", // if image_art is null, use artist image
  positivity: 90.0,
  energy: 76.0,
  rhythm: 80.0,
  liveliness: 80.0,
};

let songFive = {
  genre: "folk",
  artist_id: "corals-a4a6074f",
  title: "Mountain Pine", // song name cannot be null
  song_id: "mp5-71f02aad",
  artist_name: "Corals", // artist_name cannot be null
  audio: "audio/mp5-71f02aad-audio.mp3", // mp3 file path cannot be null
  image_art: "images/corals-a4a6074f-profile.avif", // if image_art is null, use artist image
  positivity: 30,
  energy: 30,
  rhythm: 30,
  liveliness: 30,
};

let songSix = {
  genre: "folk",
  artist_id: "jacob-nicou-1248f20c",
  title: "Soula",
  song_id: "s15-d911d55c",
  artist_name: "Jacob Nicou",
  audio: "audio/s15-d911d55c-audio.mp3",
  image_art: "images/jacob-nicou-1248f20c-profile.avif",
  positivity: 60,
  energy: 60,
  rhythm: 50,
  liveliness: 50,
};

let songSeven = {
  genre: "folk",
  artist_id: "justin-lee-ea4adbb8",
  title: "Daybreak", // song name cannot be null
  song_id: "db7-6c1f2b89",
  artist_name: "Justin Lee", // artist_name cannot be null
  audio: "audio/db7-6c1f2b89-audio.mp3", // mp3 file path cannot be null
  image_art: "images/justin-lee-ea4adbb8-profile.avif", // if image_art is null, use artist image
  positivity: 30,
  energy: 30,
  rhythm: 30,
  liveliness: 30,
};

let songEight = {
  genre: "folk",
  artist_id: "sky-toes-f3fddefc",
  title: "Running Fields",
  song_id: "rf3-8426d753",
  artist_name: "Sky Toes",
  audio: "audio/rf3-8426d753-audio.mp3",
  image_art: "images/sky-toes-f3fddefc-profile.avif",
  positivity: 76,
  energy: 76,
  rhythm: 76,
  liveliness: 76,
};

let songNine = {
  genre: "folk",
  artist_id: "justin-lee-ea4adbb8",
  title: "High Hopes",
  song_id: "hha-0becc7ca",
  artist_name: "Justin Lee",
  audio: "audio/hha-0becc7ca-audio.mp3", //
  image_art: "images/justin-lee-ea4adbb8-profile.avif",
  positivity: 50,
  energy: 30,
  rhythm: 30,
  liveliness: 30,
};

let songTen = {
  genre: "folk",
  artist_id: "the-lakes-4b696865",
  title: "Parade",
  song_id: "pb1-f895d7af",
  artist_name: "The Lakes",
  audio: "audio/pb1-f895d7af-audio.mp3",
  image_art: "images/the-lakes-4b696865-profile.avif",
  positivity: 60,
  energy: 80,
  rhythm: 40,
  liveliness: 20,
};

let songEleven = {
  genre: "folk",
  artist_id: "light-patterns-4abbb0de",
  title: "Tethers",
  song_id: "t2k-fbd3a7b2",
  artist_name: "Light Patterns",
  audio: "audio/t2k-fbd3a7b2-audio.mp3",
  image_art: "images/light-patterns-4abbb0de-profile.avif",
  positivity: 31,
  energy: 32,
  rhythm: 33,
  liveliness: 33.33,
};

let songTwelve = {
  genre: "folk",
  artist_id: "asher-lee-04f4a1c8",
  title: "Dance With Me",
  song_id: "dwm-9bb46898",
  artist_name: "Asher Lee",
  audio: "audio/dwm-9bb46898-audio.mp3",
  image_art: "images/asher-lee-04f4a1c8-profile.avif",
  positivity: 75.0,
  energy: 75.0,
  rhythm: 75.0,
  liveliness: 74.99,
};

let songThirteen = {
  genre: "country",
  artist_id: "arbour-season-a9a8812a",
  title: "Arkansas",
  song_id: "asd-4a72d6a6",
  artist_name: "Arbour Season",
  audio: "audio/asd-4a72d6a6-audio.mp3",
  image_art: "images/arbour-season-a9a8812a-profile.avif",
  positivity: 60.0,
  energy: 30.0,
  rhythm: 30.0,
  liveliness: 45.67,
};

let songFourteen = {
  genre: "country",
  artist_id: "justin-lapoint-c743beaf",
  title: "Wide Open Spaces",
  song_id: "wos-69327d39",
  artist_name: "Justin LaPoint",
  audio: "audio/wos-69327d39-audio.mp3",
  image_art: "images/justin-lapoint-c743beaf-profile.avif",
  positivity: 30,
  energy: 60,
  rhythm: 60,
  liveliness: 70,
};

let songFifteen = {
  genre: "country",
  artist_id: "arbour-season-a9a8812a",
  title: "Roam",
  song_id: "r04-f4c65064",
  artist_name: "Arbour Season",
  audio: "audio/r04-f4c65064-audio.mp3",
  image_art: "images/arbour-season-a9a8812a-profile.avif",
  positivity: 74,
  energy: 74,
  rhythm: 74,
  liveliness: 74,
};

let songSixteen = {
  genre: "country",
  artist_id: "hemlock-ab4cad19",
  title: "Moving On",
  song_id: "mvi-4bd8e281",
  artist_name: "Hemlock",
  audio: "audio/mvi-4bd8e281-audio.mp3",
  image_art: "images/hemlock-ab4cad19-profile.avif",
  positivity: 76,
  energy: 76,
  rhythm: 76,
  liveliness: 76,
};

//

let songSeventeen = {
  genre: "country",
  artist_id: "tyler-edwards-0ce084cd",
  title: "A Few Good Hearts",
  song_id: "afg-63e4609a",
  artist_name: "Tyler Edwards",
  audio: "audio/afg-63e4609a-audio.mp3",
  image_art: "images/tyler-edwards-0ce084cd-profile.avif",
  positivity: 60,
  energy: 65,
  rhythm: 50,
  liveliness: 65,
};

let songEighteen = {
  genre: "classical",
  artist_id: "monument-music-3f4957a4",
  title: "Majestic Whispers",
  song_id: "mwa-a2e90722",
  artist_name: "Monument Music",
  audio: "audio/mwa-a2e90722-audio.mp3",
  image_art: "images/monument-music-3f4957a4-profile.avif",
  positivity: 95,
  energy: 91,
  rhythm: 91,
  liveliness: 75,
};

let songNineteen = {
  genre: "classical",
  artist_id: "dominique-charpentier-8e15e30b",
  title: "Trabucco",
  song_id: "tra-6d1406be",
  artist_name: "Dominique Charpentier",
  audio: "audio/tra-6d1406be-audio.mp3",
  image_art: "images/dominique-charpentier-8e15e30b-profile.avif",
  positivity: 91,
  energy: 91,
  rhythm: 91,
  liveliness: 75,
};

let songTwenty = {
  genre: "classical",
  artist_id: "arend-3686bd7b",
  title: "Cello Suite No. 1 - Bach",
  song_id: "csn-022a1d3c",
  artist_name: "Arend",
  audio: "audio/csn-022a1d3c-audio.mp3",
  image_art: "images/arend-3686bd7b-profile.avif",
  positivity: 75.01,
  energy: 75.01,
  rhythm: 75.01,
  liveliness: 75.01,
};

let songTwentyOne = {
  genre: "classical",
  artist_id: "dan-barracuda-06ed7bb4",
  title: "Roselina",
  song_id: "rsl-e3194b9a",
  artist_name: "Dan Barracuda",
  audio: "audio/rsl-e3194b9a-audio.mp3",
  image_art: "images/dan-barracuda-06ed7bb4-profile.avif",
  positivity: 70,
  energy: 70,
  rhythm: 80,
  liveliness: 80,
};

let songTwentyTwo = {
  genre: "classical",
  artist_id: "cory-alstad-5ff7ceb3",
  title: "What We Know Now",
  song_id: "wwk-24bd0a13",
  artist_name: "Cory Alstad",
  audio: "audio/wwk-24bd0a13-audio.mp3",
  image_art: "images/cory-alstad-5ff7ceb3-profile.avif",
  positivity: 30,
  energy: 29,
  rhythm: 28,
  liveliness: 27,
};

let songTwentyThree = {
  genre: "classical",
  artist_id: "evoli-89b50d07",
  title: "Rapidfire",
  song_id: "rpf-802c27ed",
  artist_name: "Evoli",
  audio: "audio/rpf-802c27ed-audio.mp3",
  image_art: "images/evoli-89b50d07-profile.avif",
  positivity: 60,
  energy: 95,
  rhythm: 85,
  liveliness: 75,
};

let songTwentyFour = {
  genre: "classical",
  artist_id: "philip-anderson-5c515158",
  title: "Achievement",
  song_id: "ach-ff5a99da",
  artist_name: "Philip Anderson",
  audio: "audio/ach-ff5a99da-audio.mp3",
  image_art: "images/philip-anderson-5c515158-profile.avif",
  positivity: 75,
  energy: 49.99,
  rhythm: 49.99,
  liveliness: 74.44,
};

let songTwentyFive = {
  genre: "folk",
  artist_id: "northwestern-505a37e6",
  title: "Light Meadows",
  song_id: "lms-1ab14941",
  artist_name: "Northwestern",
  audio: "audio/lms-1ab14941-audio.mp3",
  image_art: "images/northwestern-505a37e6-profile.avif",
  positivity: 80,
  energy: 60,
  rhythm: 70,
  liveliness: 50,
};

let songData = [
  songOne,
  songTwo,
  songThree,
  songFour,
  songFive,
  songSix,
  songSeven,
  songEight,
  songNine,
  songTen,
  songEleven,
  songTwelve,
  songThirteen,
  songFourteen,
  songFifteen,
  songSixteen,
  songSeventeen,
  songEighteen,
  songNineteen,
  songTwenty,
  songTwentyOne,
  songTwentyTwo,
  songTwentyThree,
  songTwentyFour,
  songTwentyFive,
];

export { songData };
