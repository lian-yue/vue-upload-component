import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { afterEach, describe, expect, it, vi } from 'vitest'
import FileUpload from '../src/FileUpload.vue'

function mountUpload(props = {}) {
  return mount(FileUpload, {
    props: {
      modelValue: [],
      ...props,
    },
  })
}

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('FileUpload', () => {
  it('keeps special and duplicate ids addressable without corrupting the index', () => {
    const wrapper = mountUpload({ multiple: true })
    const files = wrapper.vm.add([
      { id: '__proto__', name: 'first' },
      { id: '__proto__', name: 'second' },
    ])

    expect(files).toHaveLength(2)
    expect(files[0].id).toBe('__proto__')
    expect(files[1].id).not.toBe('__proto__')
    expect(wrapper.vm.get('__proto__')).toMatchObject({ id: '__proto__', name: 'first' })
    expect(Object.getPrototypeOf(wrapper.vm.maps)).toBeNull()
  })

  it('escapes extension strings and ignores non-string runtime values', () => {
    const wrapper = mountUpload({ extensions: ['tar.gz', '[', 1] })

    expect(wrapper.vm.iExtensions.test('archive.tar.gz')).toBe(true)
    expect(wrapper.vm.iExtensions.test('archive.tarXgz')).toBe(false)
    expect(wrapper.vm.iExtensions.test('name.[')).toBe(true)
  })

  it('does not create an extension filter for the default empty list', () => {
    const wrapper = mountUpload()

    expect(wrapper.vm.iExtensions).toBeUndefined()
  })

  it('normalizes invalid maximum and thread values', () => {
    const wrapper = mountUpload({ multiple: true, maximum: -2.5, thread: 0 })

    expect(wrapper.vm.iMaximum).toBe(0)
    expect(wrapper.vm.iThread).toBe(1)
  })

  it('does not accept a drop while disabled', async () => {
    const wrapper = mountUpload({ disabled: true })
    const addDataTransfer = vi.spyOn(wrapper.vm, 'addDataTransfer')
    const preventDefault = vi.fn()

    wrapper.vm.onDrop({ preventDefault, dataTransfer: { files: [] } })

    expect(preventDefault).toHaveBeenCalledOnce()
    expect(addDataTransfer).not.toHaveBeenCalled()
  })

  it('turns a synchronous custom upload failure into a settled file error', async () => {
    vi.useFakeTimers()
    const customAction = vi.fn(() => {
      throw new Error('boom')
    })
    const wrapper = mountUpload({ customAction })
    const file = wrapper.vm.add(new File(['x'], 'x.txt', { type: 'text/plain' }))

    wrapper.vm.update(file, { active: true })
    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()

    const current = wrapper.vm.get(file.id)
    expect(customAction).toHaveBeenCalledOnce()
    expect(current.active).toBe(false)
    expect(current.success).toBe(false)
    expect(current.error).toBe('boom')
    expect(wrapper.vm.uploading).toBe(0)
  })

  it('keeps a scheduled upload valid when active file metadata changes', async () => {
    vi.useFakeTimers()
    const customAction = vi.fn(file => Promise.resolve(file))
    const wrapper = mountUpload({ customAction })
    const file = wrapper.vm.add(new File(['x'], 'x.txt', { type: 'text/plain' }))

    const activeFile = wrapper.vm.update(file, { active: true })
    wrapper.vm.update(activeFile, { progress: '1.00' })
    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()

    const current = wrapper.vm.get(file.id)
    expect(customAction).toHaveBeenCalledOnce()
    expect(current.active).toBe(false)
    expect(current.success).toBe(true)
    expect(current.error).toBe('')
  })

  it('does not start a stale upload after immediate reactivation', async () => {
    vi.useFakeTimers()
    const customAction = vi.fn(file => Promise.resolve(file))
    const wrapper = mountUpload({ customAction })
    const file = wrapper.vm.add(new File(['x'], 'x.txt', { type: 'text/plain' }))

    const firstActivation = wrapper.vm.update(file, { active: true })
    const stoppedFile = wrapper.vm.update(firstActivation, { active: false, error: 'abort' })
    wrapper.vm.update(stoppedFile, { active: true, error: '' })
    await nextTick()
    await vi.runAllTimersAsync()
    await nextTick()

    expect(customAction).toHaveBeenCalledOnce()
    expect(wrapper.vm.get(file.id).success).toBe(true)
  })

  it('always returns a rejected promise for a synchronous custom action failure', async () => {
    const wrapper = mountUpload({
      customAction: () => {
        throw new Error('direct failure')
      },
    })
    const file = wrapper.vm.add(new File(['x'], 'x.txt', { type: 'text/plain' }))

    await expect(wrapper.vm.upload(file)).rejects.toThrow('direct failure')
  })

  it('pauses an active chunk handler when the file is stopped', () => {
    const wrapper = mountUpload()
    const file = wrapper.vm.add(new File(['x'], 'x.txt', { type: 'text/plain' }))
    const pause = vi.fn()
    const activeFile = wrapper.vm.update(file, { active: true, chunk: { pause } })

    wrapper.vm.update(activeFile, { active: false, error: 'abort' })

    expect(pause).toHaveBeenCalledOnce()
    expect(wrapper.vm.uploading).toBe(0)
  })

  it('releases and restores the upload slot when a chunk handler pauses and resumes', async () => {
    vi.useFakeTimers()
    const handlers = []
    class PausableHandler {
      constructor(file, options) {
        this.file = file
        this.options = options
        this.paused = false
        this.resuming = false
        this.settled = false
        handlers.push(this)
      }

      upload() {
        this.promise = new Promise(resolve => {
          this.resolve = () => {
            this.settled = true
            resolve()
          }
        })
        return this.promise
      }

      pause() {
        this.paused = true
        this.file = this.options.onPause(this.file)
      }

      resume() {
        this.resuming = true
        this.paused = false
        this.file = this.options.onResume(this.file)
        this.resuming = false
      }
    }
    const wrapper = mountUpload({
      chunkEnabled: true,
      chunk: { action: '/chunk', minSize: 0, handler: PausableHandler },
    })
    const file = wrapper.vm.add(new File(['xx'], 'x.txt', { type: 'text/plain' }))

    wrapper.vm.update(file, { active: true })
    await nextTick()
    await vi.runAllTimersAsync()
    const handler = handlers[0]

    handler.pause()
    expect(wrapper.vm.uploading).toBe(0)
    expect(wrapper.vm.get(file.id)).toMatchObject({ active: false, error: '' })

    handler.resume()
    expect(handlers).toHaveLength(1)
    expect(wrapper.vm.uploading).toBe(1)
    expect(wrapper.vm.get(file.id).active).toBe(true)

    handler.resolve()
    await handler.promise
    await Promise.resolve()
    await Promise.resolve()
    await nextTick()
    expect(wrapper.vm.get(file.id)).toMatchObject({ active: false, success: true })
    expect(wrapper.vm.uploading).toBe(0)
  })

  it('releases the upload slot when a paused chunk file is removed', () => {
    const wrapper = mountUpload()
    const file = wrapper.vm.add(new File(['x'], 'x.txt', { type: 'text/plain' }))
    let handlerFile
    const pause = vi.fn(() => {
      handlerFile.active = false
    })
    const activeFile = wrapper.vm.update(file, {
      active: true,
      chunk: { pause, settled: false },
    })
    handlerFile = activeFile

    pause()
    wrapper.vm.remove(activeFile)

    expect(wrapper.vm.uploading).toBe(0)
    expect(wrapper.vm.activeUploadIds.size).toBe(0)
  })

  it('rejects an id update that collides with another file', () => {
    const wrapper = mountUpload({ multiple: true })
    const files = wrapper.vm.add([
      { id: 'one', name: 'one' },
      { id: 'two', name: 'two' },
    ])

    expect(wrapper.vm.update(files[1], { id: 'one' })).toBe(false)
    expect(wrapper.vm.files.map((file) => file.id)).toEqual(['one', 'two'])
  })
})
