export const createFormData = (fd, scf, mp3f) => {
  let newFormData = new FormData();
  const raw = new Uint8Array(scf.buffer.length);
  const raw2 = new Uint8Array(mp3f.buffer.length);
  for (let i = 0; i < raw.length; i++) {
    raw[i] = scf.buffer[i];
  }

  //   for (let j = 0; j < raw2.length; j++) {
  //     raw2[j] = mp3f.buffer[j].charCodeAt(0);
  //   }

  let File = new File(mp3f.buffer, mp3f.originalname);
  console.log(File);
  //   newFormData.append("songCover", raw, scf.originalname);
  //   newFormData.append("mp3Audio", new Blob(raw2), mp3f.originalname);
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

  //   let scBlob = new Blob([scf.buffer], { type: scf.mimetype });
  //   console.log(scBlob);
  //   let songCoverFile = new File({
  //     fileBits: scBlob,
  //     fieldname: scf.fieldname,
  //     name: scf.originalname,
  //     encoding: scf.encoding,
  //     type: scf.mimetype,
  //   });

  //   console.log(songCoverFile);

  //   newFormData.append("songCover", songCoverFile);

  //   newFormData.append("songCover", scf.buffer, {
  //     fieldname: scf.fieldname,
  //     name: scf.originalname,
  //     encoding: scf.encoding,
  //     type: scf.mimetype,
  //     size: scf.size,
  //   });
};
