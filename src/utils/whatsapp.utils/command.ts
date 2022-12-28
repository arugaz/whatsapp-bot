import Queue from "@arugaz/queue"
import Collection from "@arugaz/collection"
import type { Command } from "../../types/command.types"

/**
 * Commands collection
 * to store in memory
 */
export const commands = new Collection<string, Command>()

/**
 * Cooldown collection
 * to store in memory
 */
export const cooldowns = new Map<string, number>()

/**
 * Queue collection
 * handle with max 15 commands at the same time
 * with max timeout 30 seconds
 */
export const queues = new Queue({ concurrency: 15, timeout: 30, throwOnTimeout: true })
