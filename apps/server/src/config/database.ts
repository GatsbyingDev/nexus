import mongoose from "mongoose";
import { env } from "./env";

const wait = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

export const connectDB = async (): Promise<void> => {
  const maxAttempts = 3;
  const delayMs = 5000;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await mongoose.connect(env.MONGODB_URI);
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      await wait(delayMs);
    }
  }
};

export const disconnectDB = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};
