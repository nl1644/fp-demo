export const env = {
  // Client-side (Public)
  fpPublicKey: process.env.NEXT_PUBLIC_FP_PUBLIC_API_KEY || "",

  // Server-side (Private)
  fpServerApiKey: process.env.FP_SERVER_API_KEY || "",
  BASE64_KEY: process.env.FP_SEALED_RESULTS_DECRYPTION_KEY || "",
  dbPath: process.env.DATABASE_PATH || "db.sqlite",
  nodeEnv: process.env.NODE_ENV || "development",
  isDev: process.env.NODE_ENV === "development",
};

// Simple validation
const isServer = typeof window === "undefined";

if (!env.fpPublicKey && env.isDev) {
  console.warn(
    "⚠️  NEXT_PUBLIC_FP_PUBLIC_API_KEY is missing in your .env file. " +
      "Fingerprint identification may not work correctly.",
  );
}

if (isServer && !env.fpServerApiKey && env.isDev) {
  console.warn(
    "⚠️  FP_SERVER_API_KEY is missing in your .env file. " +
      "Fingerprint server API calls may fail. " +
      "This key should NOT be prefixed with NEXT_PUBLIC_.",
  );
}
