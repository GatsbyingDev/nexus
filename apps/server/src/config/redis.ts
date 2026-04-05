import { Redis } from "@upstash/redis";
import { env } from "./env";

const PRESENCE_TTL_SECONDS = 300;

export const redis = new Redis({
  url: env.UPSTASH_REDIS_REST_URL,
  token: env.UPSTASH_REDIS_REST_TOKEN
});

const presenceKey = (userId: string): string => `user:${userId}:status`;

export const setPresence = async (userId: string, status: string, ttl = PRESENCE_TTL_SECONDS): Promise<void> => {
  await redis.set(presenceKey(userId), status, { ex: ttl });
};

export const getPresence = async (userId: string): Promise<string | null> => {
  const value = await redis.get<string>(presenceKey(userId));
  return value ?? null;
};

export const refreshPresence = async (userId: string): Promise<void> => {
  const current = await getPresence(userId);
  await setPresence(userId, current ?? "online", PRESENCE_TTL_SECONDS);
};

export const deletePresence = async (userId: string): Promise<void> => {
  await redis.del(presenceKey(userId));
};
