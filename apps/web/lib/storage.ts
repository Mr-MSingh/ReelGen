import { randomUUID } from "crypto";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function requireEnv(key: string) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing ${key}`);
  }
  return value;
}

export function createS3Client() {
  return new S3Client({
    region: "us-east-1",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
      accessKeyId: requireEnv("S3_ACCESS_KEY"),
      secretAccessKey: requireEnv("S3_SECRET_KEY"),
    },
    forcePathStyle: true,
  });
}

export async function createUploadUrl(params: {
  workspaceId: string;
  contentType: string;
}) {
  const bucket = requireEnv("S3_BUCKET");
  const key = `uploads/${params.workspaceId}/${randomUUID()}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    ContentType: params.contentType,
  });

  const url = await getSignedUrl(createS3Client(), command, {
    expiresIn: 60 * 5,
  });

  return { url, key, bucket };
}

export async function createDownloadUrl(key: string) {
  const bucket = requireEnv("S3_BUCKET");
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(createS3Client(), command, {
    expiresIn: 60 * 10,
  });
}
