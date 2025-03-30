import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { CreateInvalidationCommand } from "@aws-sdk/client-cloudfront";

// Helper function to delete only the song objects from the cloud
// and not the images.
export const deleteArtworkInCloud = async (
  artistSongs,
  s3Client,
  cloudFrontClient,
  _s3Params,
  _cloudFrontParams,
  _imageArtwork
) => {
  let artworkCount = 0;

  for (let song of artistSongs) {
    if (song["image_art"] === _imageArtwork) {
      ++artworkCount;
    }
  }

  if (artworkCount === 1) {
    let s3Params = JSON.parse(JSON.stringify(_s3Params));
    let cloudFrontParams = JSON.parse(JSON.stringify(_cloudFrontParams));

    s3Params["Key"] = `${_imageArtwork}`;
    const imageCommand = new DeleteObjectCommand(s3Params);
    await s3Client.send(imageCommand);

    cloudFrontParams["InvalidationBatch"]["Paths"]["Items"] = [
      "/" + `${_imageArtwork}`,
    ];
    const cloudFrontSongCommand = new CreateInvalidationCommand(
      cloudFrontParams
    );

    await cloudFrontClient.send(cloudFrontSongCommand);
  }
};
