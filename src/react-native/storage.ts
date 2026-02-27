/**
 * ThinkPink Quote Engine SDK - React Native Storage Adapter
 *
 * Wraps AsyncStorage to provide the same interface as the
 * browser localStorage helper used in the core SDK.
 */

export interface RNStorageAdapter {
  getItem(key: string): Promise<string | null>
  setItem(key: string, value: string): Promise<void>
  removeItem(key: string): Promise<void>
  getAllKeys?(): Promise<string[]>
}

const QE_PREFIX = 'qe_'

/**
 * Create a storage adapter for React Native.
 *
 * Pass your AsyncStorage instance (from `@react-native-async-storage/async-storage`)
 * to get a Quote Engine-compatible storage helper.
 *
 * @example
 * ```ts
 * import AsyncStorage from '@react-native-async-storage/async-storage'
 * import { createRNStorage } from '@thinkpinkstudio/quote-engine-sdk/react-native'
 *
 * const storage = createRNStorage(AsyncStorage)
 * ```
 */
export function createRNStorage(asyncStorage: RNStorageAdapter) {
  return {
    async get<T>(key: string): Promise<T | null> {
      try {
        const item = await asyncStorage.getItem(`${QE_PREFIX}${key}`)
        return item ? JSON.parse(item) : null
      } catch {
        return null
      }
    },

    async set<T>(key: string, value: T): Promise<void> {
      try {
        await asyncStorage.setItem(`${QE_PREFIX}${key}`, JSON.stringify(value))
      } catch {
        // Storage full or unavailable
      }
    },

    async remove(key: string): Promise<void> {
      try {
        await asyncStorage.removeItem(`${QE_PREFIX}${key}`)
      } catch {
        // Ignore
      }
    },

    async clear(): Promise<void> {
      try {
        if (asyncStorage.getAllKeys) {
          const keys = await asyncStorage.getAllKeys()
          const qeKeys = keys.filter((k) => k.startsWith(QE_PREFIX))
          await Promise.all(qeKeys.map((k) => asyncStorage.removeItem(k)))
        }
      } catch {
        // Ignore
      }
    },
  }
}
