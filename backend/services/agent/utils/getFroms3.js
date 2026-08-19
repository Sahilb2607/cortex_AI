import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../config/s3.js";
import { GetObjectCommand } from "@aws-sdk/client-s3";
export const getFroms3 = async (filename, expiresIn = 600) => {
  return await getSignedUrl(
    s3,
    new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
    }),
    { expiresIn },
  );
};
