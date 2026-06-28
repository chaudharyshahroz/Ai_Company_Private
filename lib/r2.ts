/**
 * Cloudflare R2 file upload stub.
 * In demo mode: writes to /public/uploads and returns a local URL.
 * In production: uploads via the AWS S3 SDK to your R2 bucket.
 */

import { isDemoMode } from "./demo";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export interface UploadInput {
  filename: string;
  contentType: string;
  body: Buffer;
}

export interface UploadResult {
  url: string;
  key: string;
}

export async function uploadFile(input: UploadInput): Promise<UploadResult> {
  if (isDemoMode()) {
    const dir = path.join(process.cwd(), "public", "uploads");
    await mkdir(dir, { recursive: true });
    const key = `${Date.now()}-${input.filename}`;
    await writeFile(path.join(dir, key), input.body);
    return {
      url: `/uploads/${key}`,
      key,
    };
  }

  // Real R2 upload via S3 SDK
  // const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
  // const client = new S3Client({
  //   region: "auto",
  //   endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  //   credentials: {
  //     accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY!,
  //     secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY!,
  //   },
  // });
  // const key = `${Date.now()}-${input.filename}`;
  // await client.send(new PutObjectCommand({
  //   Bucket: process.env.CLOUDFLARE_R2_BUCKET!,
  //   Key: key,
  //   Body: input.body,
  //   ContentType: input.contentType,
  // }));
  // return {
  //   url: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${key}`,
  //   key,
  // };
  throw new Error("R2 upload not yet wired up — set CLOUDFLARE_R2_* env vars");
}