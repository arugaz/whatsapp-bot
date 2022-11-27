import Collection from "../libs/collection.libs";
import type { Command } from "../types/command.types";

/**
 * Commands collection to store in memory storage
 */
export const commands = new Collection<string, Command>();

/**
 * Cooldown collection to store in memory storage
 */
export const cooldowns = new Collection<string, number>();
