import { Redis } from "@upstash/redis";

export type VotePayload = {
  cpfHash: string;
  voterName: string;
  voterEmail?: string;
  votes: Record<string, string | null>;
  createdAt: string;
  userAgent?: string | null;
};

const memory = new Map<string, VotePayload>();
const memoryIndex = new Set<string>();

function redisClient() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

const PREFIX = "eletroawards2026";
const voteKey = (cpfHash: string) => `${PREFIX}:vote:${cpfHash}`;
const indexKey = `${PREFIX}:vote-index`;

export async function hasVoted(cpfHash: string) {
  const redis = redisClient();
  if (!redis) return memory.has(voteKey(cpfHash));
  return Boolean(await redis.exists(voteKey(cpfHash)));
}

export async function saveVote(payload: VotePayload) {
  const key = voteKey(payload.cpfHash);
  const redis = redisClient();
  if (!redis) {
    if (memory.has(key)) return false;
    memory.set(key, payload);
    memoryIndex.add(key);
    return true;
  }
  const result = await redis.set(key, payload, { nx: true });
  if (result !== "OK") return false;
  await redis.sadd(indexKey, key);
  return true;
}

export async function getVote(cpfHash: string) {
  const key = voteKey(cpfHash);
  const redis = redisClient();
  if (!redis) return memory.get(key) || null;
  return (await redis.get<VotePayload>(key)) || null;
}

export async function getAllVotes() {
  const redis = redisClient();
  if (!redis) return Array.from(memoryIndex).map((key) => memory.get(key)).filter(Boolean) as VotePayload[];
  const keys = await redis.smembers<string>(indexKey);
  if (!keys.length) return [];
  const values = await redis.mget<VotePayload>(...keys);
  return values.filter(Boolean) as VotePayload[];
}

export function storageMode() {
  return redisClient() ? "redis" : "memory-dev";
}
