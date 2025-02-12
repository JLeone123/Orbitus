export const createFormData = (fd, scf, mp3f) => {
  let newFormData = new FormData();
  const raw = new Uint8Array(scf.buffer.length);
  const raw2 = new Uint8Array(mp3f.buffer.length);
  for (let i = 0; i < raw.length; i++) {
    raw[i] = scf.buffer[i];
  }

  let File = new File(mp3f.buffer, mp3f.originalname);
  newFormData.append("mp3Audio", mp3f.originalname);
  newFormData.append("songCover", scf.originalname);
  newFormData.append("genre", fd.genre);
  newFormData.append("songName", fd.songName);
  newFormData.append("artistName", fd.artistName);
  newFormData.append("positivity", fd.positivity);
  newFormData.append("energy", fd.energy);
  newFormData.append("rhythm", fd.rhythm);
  newFormData.append("liveliness", fd.liveliness);
  newFormData.append("eventType", fd.eventType);
  console.log(newFormData);
  return newFormData;
};
