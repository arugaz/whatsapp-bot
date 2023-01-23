import { Queue } from "@arugaz/queue"
import Collection from "@arugaz/collection"
import type { Command, Event } from "../../types/command"

/**
 * Commands collection
 * to store in memory
 */
export const commands = new Collection<string, Command>()

/**
 * Queue collection
 * handle with max 25 commands at the same time
 * with max timeout 30 seconds
 */
export const commandQueues = new Queue({ concurrency: 25, timeout: 30 * 1000, throwOnTimeout: true })

/**
 * Events collection
 * to store in memory
 */
export const events = new Map<string, Event>()

/**
 * Cooldown collection
 * to store in memory
 */
export const cooldowns = new Map<string, number>()
