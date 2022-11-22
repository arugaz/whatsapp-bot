import Collection from "../libs/collection.libs";
import type { Command } from "../types/command.types";

/**
 * Commands collection for save in memory storage
 */
export const commands = new Collection<string, Command>();

/**
 * Coldown collection for save in memory storage
 */
export const cooldowns = new Collection<string, number>();
