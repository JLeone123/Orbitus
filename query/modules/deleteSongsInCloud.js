import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";

export const deleteSongsInCloud = async (
  songs,
  s3Client,
  cloudFrontClient,
  _s3Params,
  _cloudFrontParams
) => {
  let s3Params = JSON.parse(JSON.stringify(_s3Params));
  let cloudFrontParams = JSON.parse(JSON.stringify(_cloudFrontParams));

  // Deleting the s3 object from the s3 bucket
  for (let song of songs) {
    s3Params["Key"] = `${song["audio"]}`;
    const musicCommand = new DeleteObjectCommand(s3Params);
    await s3Client.send(musicCommand);

    s3Params["Key"] = `${song["image_art"]}`;
    const imageCommand = new DeleteObjectCommand(s3Params);
    await s3Client.send(imageCommand);

    // Invalidating the music data in the
    // CloudFront cache
    cloudFrontParams["InvalidationBatch"]["Paths"]["Items"] = [
      "/" + `${song["audio"]}`,
      "/" + `${song["image_art"]}`,
    ];

    const cloudFrontSongCommand = new CreateInvalidationCommand(
      cloudFrontParams
    );
    await cloudFrontClient.send(cloudFrontSongCommand);
  }
};
