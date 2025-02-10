import { getSignedUrl } from "@aws-sdk/cloudfront-signer";

export const generateSignedUrls = (
  song,
  cloudFrontUrl,
  dlt,
  privateKey,
  keyPairId
) => {
  // Making a deep copy of the song object
  // to prevent accidentally modifying
  // the song by reference to make for
  // easier debugging
  let newSong = JSON.parse(JSON.stringify(song));

  // The timestamp when the URL will expire
  // is one day times the integer dlt.
  let dateLessThan = new Date(Date.now() + 1000 * 60 * 60 * 24 * dlt);
  newSong.audioUrl = getSignedUrl({
    dateLessThan,
    url: `${cloudFrontUrl}` + `${newSong.audio}`,
    keyPairId,
    privateKey,
  });

  newSong.imageUrl = getSignedUrl({
    dateLessThan,
    url: `${cloudFrontUrl}` + `${newSong.image_art}`,
    keyPairId,
    privateKey,
  });

  return newSong;
};
