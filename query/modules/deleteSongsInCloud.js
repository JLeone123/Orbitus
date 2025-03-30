import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";

// Helper function to delete only the song objects from the cloud
// and not the images.
export const deleteSongsInCloud = async (
  songs,
  s3Client,
  cloudFrontClient,
  _s3Params,
  _cloudFrontParams
) => {
  // _mp3AudioCount,
  // _imageSongCoverCount
  let s3Params = JSON.parse(JSON.stringify(_s3Params));
  let cloudFrontParams = JSON.parse(JSON.stringify(_cloudFrontParams));

  for (let song of songs) {
    // Invalidating the music data in the
    // CloudFront cache by removing
    // each song object.

    s3Params["Key"] = `${song["audio"]}`;
    const musicCommand = new DeleteObjectCommand(s3Params);
    await s3Client.send(musicCommand);

    cloudFrontParams["InvalidationBatch"]["Paths"]["Items"] = [
      "/" + `${song["audio"]}`,
    ];

    const cloudFrontSongCommand = new CreateInvalidationCommand(
      cloudFrontParams
    );

    await cloudFrontClient.send(cloudFrontSongCommand);
  }
};
