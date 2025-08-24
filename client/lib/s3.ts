import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});


export async function getPresignedUrl(
  objectKey: string,
  expiresIn = 300
): Promise<string> {
  if (!objectKey) throw new Error("S3 object key is required");

  const command = new GetObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: objectKey,
  });

  try {
    const url = await getSignedUrl(s3, command, { expiresIn });
    return url;
  } catch (err) {
    console.error("Error generating presigned URL for S3:", err);
    throw err;
  }
}