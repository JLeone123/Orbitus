/**** Data constraints ****
 * 1. The audio file, song, and artist names cannot be null
 * 2. If the image art is null, then use a default image.
 * This can be modified to use the artist's default profile
 * picture. I can implement this possibly at some point
 ****/

let songOne = {
  genre: "indie",
  artist_id: "the-planes-08a07dae",
  title: "a gentle breeze",
  song_id: "agb-4abcffa4",
  artist_name: "The Planes",
  audio: "audio/agb-4abcffa4-audio.mp3",
  image_art: "images/the-planes-08a07dae-profile.jpg",
  positivity: 60.0,
  energy: 50.0,
  rhythm: 50.0,
  liveliness: 30.0,
};

let songTwo = {
  genre: "indie",
  artist_id: "the-90s-surfers-abc39aa1",
  title: "it was nice meeting you, bro",
  song_id: "iwn-ee1490a5",
  artist_name: "The 90's Surfers",
  audio: "audio/iwn-ee1490a5-audio.mp3",
  image_art: "images/the-90s-surfers-abc39aa1-profile.jpg",
  positivity: 90.0,
  energy: 75.0,
  rhythm: 50.0,
  liveliness: 70.0,
};

let songThree = {
  genre: "indie",
  artist_id: "jordan-b-michael-195528cd",
  title: "walking through a spring forest",
  song_id: "wta-7b8e244a",
  artist_name: "Jordan B. Michael",
  audio: "audio/wta-7b8e244a-audio.mp3",
  image_art: "images/jordan-b-michael-195528cd-profile.jpg",
  positivity: 60.0,
  energy: 75.0,
  rhythm: 50.0,
  liveliness: 75.0,
};

let songFour = {
  genre: "folk",
  artist_id: "the-scroll-80e7b4ba",
  title: "Adventures with a friend",
  song_id: "awa-8ea8968b",
  artist_name: "The Scroll",
  audio: "audio/awa-8ea8968b-audio.mp3",
  image_art: "images/the-scroll-80e7b4ba-profile.jpg",
  positivity: 90.0,
  energy: 76.0,
  rhythm: 80.0,
  liveliness: 80.0,
};

let songFive = {
  genre: "folk",
  artist_id: "80s-feel-good-era-da826506",
  title: "Synthflow",
  song_id: "s31-bbe23126",
  artist_name: "80's Feel Good Era",
  audio: "audio/s31-bbe23126-audio.mp3",
  image_art: "images/80s-feel-good-era-da826506-profile.jpg",
  positivity: 30,
  energy: 30,
  rhythm: 30,
  liveliness: 30,
};

let songSix = {
  genre: "folk",
  artist_id: "80s-feel-good-era-da826506",
  title: "Driving during the sunrise",
  song_id: "ddt-0d1cf55f",
  artist_name: "80's Feel Good Era",
  audio: "audio/ddt-0d1cf55f-audio.mp3",
  image_art: "images/80s-feel-good-era-da826506-profile.jpg",
  positivity: 60,
  energy: 60,
  rhythm: 50,
  liveliness: 50,
};

let songSeven = {
  genre: "country",
  artist_id: "the-planes-08a07dae",
  title: "On a quest in medieval Scotland",
  song_id: "oaq-e19c1bb5",
  artist_name: "The Planes",
  audio: "audio/oaq-e19c1bb5-audio.mp3",
  image_art: "images/the-planes-08a07dae-profile.jpg",
  positivity: 30,
  energy: 30,
  rhythm: 30,
  liveliness: 30,
};

let songEight = {
  genre: "country",
  artist_id: "the-90s-feel-good-era-6864fc75",
  title: "Boating Near The River Bridge",
  song_id: "bnt-6864fc75",
  artist_name: "The 90's Feel Good Era",
  audio: "audio/bnt-6864fc75-audio.mp3",
  image_art: "images/the-90s-feel-good-era-6864fc75-profile.jpg",
  positivity: 76,
  energy: 76,
  rhythm: 76,
  liveliness: 76,
};

let songNine = {
  genre: "country",
  artist_id: "tcd-f037177d",
  title: "The stars in our skies",
  song_id: "tsi-e2985685",
  artist_name: "The Coffee Drinkers",
  audio: "audio/tsi-e2985685-audio.mp3",
  image_art: "images/the-coffee-drinkers-f037177d-profile.jpg",
  positivity: 50,
  energy: 30,
  rhythm: 30,
  liveliness: 30,
};

let songTen = {
  genre: "country",
  artist_id: "tcd-f037177d",
  title: "Fishing in 1563 England",
  song_id: "fi1-10460d36",
  artist_name: "The Coffee Drinkers",
  audio: "audio/fi1-10460d36-profile.mp3",
  image_art: "images/the-coffee-drinkers-f037177d-profile.jpg",
  positivity: 60,
  energy: 80,
  rhythm: 40,
  liveliness: 20,
};

let songEleven = {
  genre: "country",
  artist_id: "jl2-6760ad92",
  title: "'Merica",
  song_id: "m32-bfa3394d",
  artist_name: "JL LJ",
  audio: "audio/m32-bfa3394d-audio.mp3",
  image_art: "images/jl-lj-6760ad92-profile.jpg",
  positivity: 31,
  energy: 32,
  rhythm: 33,
  liveliness: 33.33,
};

let songTwelve = {
  genre: "classical",
  artist_id: "dml-46aaab41",
  title: "Protect the bumblebee",
  song_id: "ptb-bdc560de",
  artist_name: "DML",
  audio: "audio/pd-bdc560de-audio.mp3",
  image_art: "images/dml-46aaab41-profile.jpg",
  positivity: 75.0,
  energy: 75.0,
  rhythm: 75.0,
  liveliness: 74.99,
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
];

export { songData };
