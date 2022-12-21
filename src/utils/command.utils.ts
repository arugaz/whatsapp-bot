import PQueue from "p-queue";
import Collection from "../libs/collection.libs";
import type { Command } from "../types/command.types";

/**
 * Commands collection
 * to store in memory
 */
export const commands = new Collection<string, Command>();

/**
 * Cooldown collection
 * to store in memory
 */
export const cooldowns = new Map<string, number>();

/**
 * Queue collection
 * handle with max 15 commands at the same time
 */
export const queues = new PQueue({ concurrency: 15 });
