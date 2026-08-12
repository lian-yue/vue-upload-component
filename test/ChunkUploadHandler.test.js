import { afterEach, describe, expect, it, vi } from 'vitest'
import ChunkUploadHandler from '../src/chunk/ChunkUploadHandler.js'

class FakeXMLHttpRequest {
  static responses = []

  constructor() {
    this.headers = {}
    this.status = 0
    this.upload = {
      addEventListener: (name, callback) => {
        this.uploadProgress = callback
      },
    }
  }

  open(method, url) {
    this.method = method
    this.url = url
  }

  setRequestHeader(name, value) {
    this.headers[name] = value
  }

  send(body) {
    this.body = body
    const response = FakeXMLHttpRequest.responses.shift()
    if (!response) {
      throw new Error('missing response')
    }
    this.status = response.status ?? 200
    this.response = response.body
    queueMicrotask(() => this.onload?.({ type: 'load' }))
  }

  abort() {
    this.onabort?.({ type: 'abort' })
  }
}

function createFile(size = 6) {
  return {
    active: true,
    file: new Blob(['x'.repeat(size)]),
    name: 'file.bin',
    progress: '0.00',
    size,
    speed: 0,
    type: 'application/octet-stream',
  }
}

afterEach(() => {
  FakeXMLHttpRequest.responses = []
  vi.unstubAllGlobals()
})

describe('ChunkUploadHandler', () => {
  it('reports zero progress before chunks exist', () => {
    const handler = new ChunkUploadHandler(createFile(), { action: '/chunk' })

    expect(handler.progress).toBe(0)
  })

  it('rejects an invalid start response instead of hanging', async () => {
    vi.stubGlobal('XMLHttpRequest', FakeXMLHttpRequest)
    FakeXMLHttpRequest.responses.push({
      body: { status: 'success', data: { end_offset: 3, session_id: '' } },
    })
    const handler = new ChunkUploadHandler(createFile(), { action: '/chunk' })

    await expect(handler.upload()).rejects.toBe('server')
    expect(handler.settled).toBe(true)
  })

  it('uploads every chunk once and finishes only once', async () => {
    vi.stubGlobal('XMLHttpRequest', FakeXMLHttpRequest)
    FakeXMLHttpRequest.responses.push(
      { body: { status: 'success', data: { end_offset: 3, session_id: 'session' } } },
      { body: { status: 'success' } },
      { body: { status: 'success' } },
      { body: { status: 'success' } },
    )
    const file = createFile()
    const handler = new ChunkUploadHandler(file, { action: '/chunk', maxActive: 1 })

    const result = await handler.upload()

    expect(result.status).toBe('success')
    expect(handler.chunksUploaded).toHaveLength(2)
    expect(handler.progress).toBe(100)
    expect(handler.settled).toBe(true)
    expect(FakeXMLHttpRequest.responses).toHaveLength(0)
  })
})
