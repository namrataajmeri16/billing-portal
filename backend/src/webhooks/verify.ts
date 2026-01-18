import crypto from "crypto";

export function verifySignature(
  rawBody: string,
  signature: string,
  secret: string
) {
  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  if (!crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature)
  )) {
    throw new Error("Invalid signature");
  }
}
