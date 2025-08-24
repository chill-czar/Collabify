import {
  DeleteObjectsCommand,
  GetObjectCommand,
  S3Client,
  ObjectIdentifier, // ✅ correct type
} from "@aws-sdk/client-s3";

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

/**
 * Delete up to 1000 objects per call (S3 limit). Returns { deleted: number, errors: S3Error[] }
 */
export async function deleteS3KeysBatch(keys: string[]) {
  if (keys.length === 0) return { deleted: 0, errors: [] as any[] };

  const objects: ObjectIdentifier[] = keys.map((k) => ({ Key: k })); // ✅ Key is required
  const cmd = new DeleteObjectsCommand({
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Delete: { Objects: objects, Quiet: false },
  });

  try {
    const res = await s3.send(cmd);
    const deletedCount = Array.isArray(res.Deleted) ? res.Deleted.length : 0;
    const errors = Array.isArray(res.Errors) ? res.Errors : [];
    return { deleted: deletedCount, errors };
  } catch (err) {
    throw err; // bubble up, caller handles rollback
  }
}

/**
 * Deletes long lists of keys in batches of up to 1000 keys.
 * Retries are not implemented here — caller may opt to retry on failure.
 */
export async function deleteS3KeysRecursive(allKeys: string[]) {
  const BATCH = 1000;
  let totalDeleted = 0;
  const errors: any[] = [];

  for (let i = 0; i < allKeys.length; i += BATCH) {
    const batch = allKeys.slice(i, i + BATCH);
    const { deleted, errors: batchErrors } = await deleteS3KeysBatch(batch);
    totalDeleted += deleted;
    if (batchErrors && batchErrors.length) errors.push(...batchErrors);
  }

  return { totalDeleted, errors };
}
