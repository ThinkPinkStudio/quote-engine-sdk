/**
 * Vitest test setup file
 */

import { afterAll, afterEach, beforeAll, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import { server } from './mocks/server'

// Establish API mocking before all tests
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})

// Reset any request handlers that are declared as a part of tests
afterEach(() => {
  server.resetHandlers()
  cleanup()
  vi.clearAllMocks()
})

// Clean up after the tests are finished
afterAll(() => {
  server.close()
})

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString()
    },
    removeItem: (key: string) => {
      delete store[key]
    },
    clear: () => {
      store = {}
    },
    get length() {
      return Object.keys(store).length
    },
    key: (index: number) => Object.keys(store)[index] || null,
  }
})()

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
})

// Mock fetch
global.fetch = vi.fn()

// Mock ReadableStream for streaming tests
class MockReadableStream {
  private chunks: Uint8Array[] = []
  private index: number = 0
  private isClosed: boolean = false
  private resolveNext: (() => void) | null = null

  constructor(source?: any) {
    if (Array.isArray(source)) {
      this.chunks = source.map((c) =>
        typeof c === 'string' ? new TextEncoder().encode(c) : c
      )
      this.isClosed = true
    } else if (source && typeof source.start === 'function') {
      const controller = {
        enqueue: (chunk: Uint8Array) => {
          // console.log(`[MockStream] Enqueued chunk type: ${typeof chunk}, isUint8Array: ${chunk instanceof Uint8Array}`)
          this.chunks.push(chunk)
          this.notify()
        },
        close: () => {
          this.isClosed = true
          this.notify()
        },
        error: () => {
          this.isClosed = true
          this.notify()
        },
      }
      Promise.resolve(source.start(controller))
    } else {
      this.isClosed = true
    }
  }

  private notify() {
    if (this.resolveNext) {
      this.resolveNext()
      this.resolveNext = null
    }
  }

  getReader() {
    return {
      read: async (): Promise<{ done: boolean; value: Uint8Array | undefined }> => {
        while (this.index >= this.chunks.length && !this.isClosed) {
          await new Promise<void>((resolve) => {
            this.resolveNext = resolve
          })
        }

        if (this.index < this.chunks.length) {
          const value = this.chunks[this.index]
          this.index++
          return { done: false, value: value as any }
        }
        return { done: true, value: undefined }
      },
      releaseLock: () => { },
    }
  }

  get locked() {
    return false
  }

  cancel() {
    return Promise.resolve()
  }
}

global.ReadableStream = MockReadableStream as any
if (typeof window !== 'undefined') {
  (window as any).ReadableStream = MockReadableStream
}

// Helper to create streaming responses
export function createStreamingResponse(chunks: string[]): Response {
  return {
    ok: true,
    status: 200,
    headers: new Headers({ 'content-type': 'text/event-stream' }),
    body: new MockReadableStream(chunks) as unknown as ReadableStream,
    json: async () => ({}),
    text: async () => chunks.join(''),
    blob: async () => new Blob([chunks.join('')]),
    clone() { return this; }
  } as unknown as Response
}

// Helper to create JSON responses
export function createJsonResponse<T>(data: T, status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers({ 'content-type': 'application/json' }),
    json: async () => data,
    text: async () => JSON.stringify(data),
    blob: async () => new Blob([JSON.stringify(data)]),
  } as unknown as Response
}

// Helper to create error responses
export function createErrorResponse(
  message: string,
  status = 400
): Response {
  return createJsonResponse({ error: { message } }, status)
}
