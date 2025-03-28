import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";

export const deleteSongsInCloud = async (
  songs,
  s3Client,
  cloudFrontClient,
  _s3Params,
  _cloudFrontParams,
  _mp3AudioCount,
  _imageSongCoverCount
) => {
  let s3Params = JSON.parse(JSON.stringify(_s3Params));
  let cloudFrontParams = JSON.parse(JSON.stringify(_cloudFrontParams));

  // If there are multiple songs that use the same cover art,
  // then remove the song and cover art objects from AWS.

  console.log(_mp3AudioCount, _imageSongCoverCount);

  if (_mp3AudioCount >= 1 && _imageSongCoverCount === 1) {
    s3Params["Key"] = `${songs[0]["audio"]}`;
    const musicCommand = new DeleteObjectCommand(s3Params);
    await s3Client.send(musicCommand);

    s3Params["Key"] = `${songs[0]["image_art"]}`; // here
    const imageCommand = new DeleteObjectCommand(s3Params);
    await s3Client.send(imageCommand);

    // Invalidating the music data in the
    // CloudFront cache by removing both
    // the song and cover art objects
    // from AWS.
    cloudFrontParams["InvalidationBatch"]["Paths"]["Items"] = [
      "/" + `${songs[0]["audio"]}`,
      "/" + `${songs[0]["image_art"]}`,
    ];

    const cloudFrontSongCommand = new CreateInvalidationCommand(
      cloudFrontParams
    );

    await cloudFrontClient.send(cloudFrontSongCommand);

    return;

    // If there are multiple songs by the artist in the database
    // then delete the song object from AWS
  } else if (_mp3AudioCount > 1 && _imageSongCoverCount > 1) {
    s3Params["Key"] = `${songs[0]["audio"]}`;
    const musicCommand = new DeleteObjectCommand(s3Params);
    await s3Client.send(musicCommand);

    // Invalidating the music data in the
    // CloudFront cache by just removing
    // the song object from AWS.
    cloudFrontParams["InvalidationBatch"]["Paths"]["Items"] = [
      "/" + `${songs[0]["audio"]}`,
    ];

    console.log(cloudFrontParams);

    const cloudFrontSongCommand = new CreateInvalidationCommand(
      cloudFrontParams
    );

    await cloudFrontClient.send(cloudFrontSongCommand);

    return;
  }

  // // Deleting the s3 object from the s3 bucket
  // for (let song of songs) {
  //   s3Params["Key"] = `${song["audio"]}`;
  //   const musicCommand = new DeleteObjectCommand(s3Params);
  //   await s3Client.send(musicCommand);

  //   s3Params["Key"] = `${song["image_art"]}`;
  //   const imageCommand = new DeleteObjectCommand(s3Params);
  //   await s3Client.send(imageCommand);

  //   // Invalidating the music data in the
  //   // CloudFront cache
  //   cloudFrontParams["InvalidationBatch"]["Paths"]["Items"] = [
  //     "/" + `${song["audio"]}`,
  //     "/" + `${song["image_art"]}`,
  //   ];

  //   const cloudFrontSongCommand = new CreateInvalidationCommand(
  //     cloudFrontParams
  //   );
  //   await cloudFrontClient.send(cloudFrontSongCommand);
  // }
};
