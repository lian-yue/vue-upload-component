import { mount } from '@vue/test-utils'
import { Fragment, h, nextTick, Teleport } from 'vue'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import FileUpload from '../src/FileUpload.vue'

function mountUpload(props = {}) {
  return mount(FileUpload, {
    props: {
      modelValue: [],
      ...props,
    },
  })
}

describe('FileUpload XHR request ownership', () => {
  let wrapper
  let requests

  beforeEach(() => {
    vi.useFakeTimers()
    vi.spyOn(Math, 'random').mockReturnValue(0)
    requests = []
    class ControlledXMLHttpRequest {
      constructor() {
        this.upload = {}
        this.status = 0
        this.responseText = ''
        this.send = vi.fn()
        this.abort = vi.fn(() => this.onabort?.({ type: 'abort' }))
        requests.push(this)
      }

      open() {}
      setRequestHeader() {}
      getResponseHeader() { return 'application/json' }

      respond(status, source) {
        this.status = status
        this.responseText = JSON.stringify({ source })
        this.onload({ type: 'load' })
      }
    }
    vi.stubGlobal('XMLHttpRequest', ControlledXMLHttpRequest)
    wrapper = mountUpload({ postAction: '/upload' })
  })

  afterEach(() => {
    wrapper.unmount()
    for (const xhr of requests) xhr.abort()
    vi.clearAllTimers()
    vi.unstubAllGlobals()
  })

  async function startUpload() {
    const file = wrapper.vm.add(new File(['0123456789'], 'file.txt'))
    wrapper.vm.update(file, { active: true })
    await nextTick()
    await vi.advanceTimersByTimeAsync(50)
    expect(requests).toHaveLength(1)
    expect(requests[0].send).toHaveBeenCalledOnce()
    return file.id
  }

  function restart(id) {
    wrapper.vm.update(id, { active: false })
    wrapper.vm.update(id, { active: true, error: '', progress: '0.00' })
  }

  it.each([200, 500])('ignores an old %i response before the retry request starts', async (status) => {
    const id = await startUpload()
    restart(id)
    requests[0].respond(status, 'old')
    expect(wrapper.vm.get(id).response).toEqual({})
    await vi.advanceTimersByTimeAsync(50)

    expect(requests).toHaveLength(2)
    expect(wrapper.vm.get(id)).toMatchObject({ active: true, success: false, error: '', response: {} })
    requests[1].respond(200, 'new')
    await vi.advanceTimersByTimeAsync(0)
    expect(wrapper.vm.get(id)).toMatchObject({ active: false, success: true, error: '', response: { source: 'new' } })
  })

  it('ignores old progress and errors while the retry request is running', async () => {
    const id = await startUpload()
    restart(id)
    await vi.advanceTimersByTimeAsync(50)
    expect(requests).toHaveLength(2)

    requests[0].upload.onprogress({ lengthComputable: true, loaded: 9, total: 10 })
    expect(wrapper.vm.get(id)).toMatchObject({ progress: '0.00', speed: 0 })
    requests[0].respond(500, 'old')
    await vi.advanceTimersByTimeAsync(100)
    expect(requests[1].abort).not.toHaveBeenCalled()
    expect(wrapper.vm.get(id)).toMatchObject({ active: true, error: '' })
    expect(wrapper.vm.get(id).response).toEqual({})

    requests[1].respond(200, 'new')
    await vi.advanceTimersByTimeAsync(0)
    expect(wrapper.vm.get(id)).toMatchObject({ success: true, response: { source: 'new' } })
  })

  it('aborts the obsolete request and preserves a real retry error', async () => {
    const id = await startUpload()
    restart(id)
    await vi.advanceTimersByTimeAsync(100)

    expect(requests[0].abort).toHaveBeenCalledOnce()
    expect(requests[1].abort).not.toHaveBeenCalled()
    requests[1].respond(500, 'new')
    await vi.advanceTimersByTimeAsync(0)
    expect(wrapper.vm.get(id)).toMatchObject({ active: false, success: false, error: 'server', response: { source: 'new' } })
  })

  it('does not send a request cancelled while its xhr is being attached', async () => {
    let cancelled = false
    await wrapper.setProps({
      onInputFile(file) {
        if (file?.xhr && !cancelled) {
          cancelled = true
          wrapper.vm.update(file, { active: false })
        }
      },
    })
    const file = wrapper.vm.add(new File(['x'], 'file.txt'))
    wrapper.vm.update(file, { active: true })
    await nextTick()
    await vi.advanceTimersByTimeAsync(50)

    expect(requests).toHaveLength(1)
    expect(requests[0].send).not.toHaveBeenCalled()
    expect(wrapper.vm.get(file.id)).toMatchObject({ active: false, error: 'abort' })
  })

  it('keeps the current request valid when file metadata changes', async () => {
    const id = await startUpload()
    wrapper.vm.update(id, { name: 'renamed.txt', data: { label: 'updated' } })
    requests[0].upload.onprogress({ lengthComputable: true, loaded: 5, total: 10 })
    expect(wrapper.vm.get(id).progress).toBe('50.00')
    requests[0].respond(200, 'current')
    await vi.advanceTimersByTimeAsync(0)
    expect(wrapper.vm.get(id)).toMatchObject({ name: 'renamed.txt', success: true, error: '', data: { label: 'updated' } })
  })

  it('preserves the missing-file error when an active file is removed', async () => {
    const uploadXhr = vi.spyOn(wrapper.vm, 'uploadXhr')
    const id = await startUpload()
    const result = uploadXhr.mock.results[0].value.catch(error => error)
    wrapper.vm.remove(id)
    await vi.advanceTimersByTimeAsync(100)
    expect(await result).toMatchObject({ message: 'not_exists' })
    expect(requests[0].abort).toHaveBeenCalledOnce()
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('FileUpload drop containers', () => {
  const wrappers = []
  const elements = []

  function createContainer() {
    const element = document.createElement('div')
    document.body.appendChild(element)
    elements.push(element)
    return element
  }

  async function mountHost(component, props = {}) {
    const wrapper = mount(component, { attachTo: createContainer(), props })
    wrappers.push(wrapper)
    // happy-dom omits input.ondrop; these tests cover container binding, not feature detection.
    const uploads = component === FileUpload ? [wrapper] : wrapper.findAllComponents(FileUpload)
    for (const upload of uploads) upload.vm.features.drop = true
    await nextTick()
    await nextTick()
    return wrapper
  }

  function dropFile(element, name) {
    const event = new Event('drop', { bubbles: true, cancelable: true })
    Object.defineProperty(event, 'dataTransfer', {
      value: { files: [new File(['file'], name)], items: [] },
    })
    element.dispatchEvent(event)
    return event
  }

  afterEach(() => {
    for (const wrapper of wrappers.splice(0)) wrapper.unmount()
    for (const element of elements.splice(0)) element.remove()
  })

  it('keeps the parent component container including siblings outside the upload button', async () => {
    const Parent = {
      render: () => h('section', [
        h('div', [h(FileUpload, { drop: true, multiple: true })]),
        h('p', { class: 'inside' }, 'Drop here'),
      ]),
    }
    const host = await mountHost({
      render: () => h('main', [h(Parent), h('p', { class: 'outside' }, 'Outside')]),
    })
    const upload = host.findComponent(FileUpload)

    expect(upload.vm.dropElement).toBe(host.find('section').element)
    dropFile(host.find('.inside').element, 'inside.txt')
    dropFile(host.find('.outside').element, 'outside.txt')
    expect(upload.vm.files.map(file => file.name)).toEqual(['inside.txt'])
  })

  it.each(['fragment', 'disabled teleport'])('keeps the containing app root fallback for a %s parent', async (kind) => {
    const Parent = {
      render: () => h(kind === 'fragment' ? Fragment : Teleport,
        kind === 'fragment' ? null : { to: document.body, disabled: true },
        [h('div', [h(FileUpload, { drop: true })])]),
    }
    const host = await mountHost({
      render: () => h('main', [h(Parent), h('p', { class: 'root-sibling' }, 'Drop here')]),
    })
    const upload = host.findComponent(FileUpload)

    expect(upload.vm.dropElement).toBe(host.element)
    dropFile(host.find('.root-sibling').element, 'root.txt')
    expect(upload.vm.files.map(file => file.name)).toEqual(['root.txt'])
  })

  it.each([false, true])('uses the actual modal container when teleported (element wrapper: %s)', async (wrapped) => {
    const portal = createContainer()
    const Modal = {
      render() {
        const modal = h(Teleport, { to: portal }, [
          h('section', { class: 'modal-drop' }, [
            h(FileUpload, { drop: true, multiple: true }),
            h('p', { class: 'modal-sibling' }, 'Drop here'),
          ]),
        ])
        return wrapped ? h('div', [modal]) : modal
      },
    }
    const host = await mountHost({ render: () => h('main', [h(Modal)]) })
    const upload = host.findComponent(FileUpload)
    const modal = portal.querySelector('.modal-drop')

    expect(upload.vm.dropElement).toBe(modal)
    dropFile(portal.querySelector('.modal-sibling'), 'modal.txt')
    dropFile(host.element, 'outside.txt')
    expect(upload.vm.files.map(file => file.name)).toEqual(['modal.txt'])

    host.unmount()
    wrappers.splice(wrappers.indexOf(host), 1)
    expect(dropFile(modal, 'after-unmount.txt').defaultPrevented).toBe(false)
  })

  it.each(['selector', 'element', 'body'])('preserves explicit %s targets and removes old listeners when changed or disabled', async (kind) => {
    const target = createContainer()
    target.id = 'explicit-upload-drop'
    const nextTarget = createContainer()
    const drop = kind === 'selector' ? '#explicit-upload-drop' : kind === 'body' ? 'body' : target
    const upload = await mountHost(FileUpload, { drop, multiple: true })
    const firstTarget = kind === 'body' ? document.body : target

    expect(upload.vm.dropElement).toBe(firstTarget)
    dropFile(firstTarget, 'first.txt')
    expect(upload.vm.files.map(file => file.name)).toEqual(['first.txt'])

    await upload.setProps({ drop: nextTarget })
    dropFile(firstTarget, 'old-target.txt')
    dropFile(nextTarget, 'second.txt')
    expect(upload.vm.files.map(file => file.name)).toEqual(['first.txt', 'second.txt'])

    await upload.setProps({ disabled: true })
    dropFile(nextTarget, 'disabled.txt')
    expect(upload.vm.files).toHaveLength(2)

    await upload.setProps({ drop: false })
    expect(upload.vm.dropElement).toBeNull()
    expect(dropFile(nextTarget, 'after-disable.txt').defaultPrevented).toBe(false)
  })
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

  it('updates regular XHR speed once per second and preserves it on completion', async () => {
    vi.useFakeTimers()
    vi.spyOn(performance, 'now')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(400)
      .mockReturnValueOnce(1000)
    const xhr = {
      upload: {},
      status: 200,
      responseText: '',
      setRequestHeader: vi.fn(),
      getResponseHeader: vi.fn(() => null),
      send: vi.fn(),
      abort: vi.fn(),
    }
    const wrapper = mountUpload()
    const file = wrapper.vm.add(new File(['x'.repeat(2000)], 'x.txt', { type: 'text/plain' }))
    file.active = true

    const upload = wrapper.vm.uploadXhr(xhr, file, file.file)
    xhr.upload.onloadstart()
    xhr.upload.onprogress({ lengthComputable: true, loaded: 1000, total: 2000 })

    expect(wrapper.vm.get(file.id)).toMatchObject({ progress: '50.00', speed: 0 })

    xhr.upload.onprogress({ lengthComputable: true, loaded: 2000, total: 2000 })
    expect(wrapper.vm.get(file.id)).toMatchObject({ progress: '100.00', speed: 2000 })

    xhr.onload({ type: 'load' })
    await expect(upload).resolves.toMatchObject({ progress: '100.00', speed: 2000 })
  })

  it('resets the speed when an inactive file becomes active again', async () => {
    vi.useFakeTimers()
    vi.spyOn(performance, 'now')
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(1000)
    const xhr = {
      upload: {},
      status: 400,
      responseText: '',
      setRequestHeader: vi.fn(),
      getResponseHeader: vi.fn(() => null),
      send: vi.fn(),
      abort: vi.fn(),
    }
    const wrapper = mountUpload()
    const file = wrapper.vm.add(new File(['x'.repeat(2000)], 'x.txt', { type: 'text/plain' }))
    file.active = true

    const upload = wrapper.vm.uploadXhr(xhr, file, file.file)
    xhr.upload.onloadstart()
    xhr.upload.onprogress({ lengthComputable: true, loaded: 2000, total: 2000 })
    xhr.onerror({ type: 'error' })
    await expect(upload).rejects.toThrow('denied')

    const failed = wrapper.vm.update(file, { active: false, success: false, error: 'denied' })
    expect(failed).toMatchObject({ active: false, error: 'denied', speed: 2000 })

    // 重试 不能沿用上一次上传的速度
    const retried = wrapper.vm.update(failed, { active: true, error: '', progress: '0.00' })
    expect(retried).toMatchObject({ active: true, speed: 0 })

    const stopped = wrapper.vm.update(retried, { active: false, error: 'denied' })
    expect(wrapper.vm.update(stopped, { active: true, error: '', speed: 123 })).toMatchObject({ speed: 123 })
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

  it.each(['remove', 'clear'])('stops chunk requests without retrying after %s and allows a new upload', async (method) => {
    vi.useFakeTimers()
    const requests = []
    let completeUploads = false
    class PendingXMLHttpRequest {
      constructor() {
        this.upload = { addEventListener: vi.fn() }
        this.abort = vi.fn(() => this.onabort?.({ type: 'abort' }))
      }

      open() {}
      setRequestHeader() {}

      send(body) {
        this.body = body
        requests.push(this)
        if (typeof body === 'string' || completeUploads) {
          const data = typeof body === 'string' ? JSON.parse(body) : null
          this.status = 200
          this.response = data?.phase === 'start'
            ? { status: 'success', data: { session_id: 'session', end_offset: 4 } }
            : { status: 'success' }
          queueMicrotask(() => this.onload?.({ type: 'load' }))
        }
      }
    }
    vi.stubGlobal('XMLHttpRequest', PendingXMLHttpRequest)
    const wrapper = mountUpload({ chunkEnabled: true, chunk: { action: '/chunk', minSize: 0 } })
    let handler
    try {
      const file = wrapper.vm.add(new File(['abcdefghijkl'], 'file.txt'))
      wrapper.vm.active = true
      await nextTick()
      await vi.runAllTimersAsync()
      handler = wrapper.vm.get(file.id).chunk
      expect(handler.maxRetries).toBe(5)
      const chunkRequests = requests.filter(xhr => xhr.body instanceof FormData)
      expect(chunkRequests).toHaveLength(3)

      wrapper.vm[method](file.id)
      await vi.runAllTimersAsync()
      expect(chunkRequests.every(xhr => xhr.abort.mock.calls.length === 1)).toBe(true)
      expect(requests).toHaveLength(4)
      expect(wrapper.vm.files).toHaveLength(0)
      expect(wrapper.vm.uploading).toBe(0)
      expect(wrapper.vm.activeUploadIds.size).toBe(0)
      expect(wrapper.vm.activeUploadTokens.size).toBe(0)

      completeUploads = true
      const nextFile = wrapper.vm.add(new File(['abcdefghijkl'], 'file.txt'))
      wrapper.vm.active = true
      await nextTick()
      await vi.runAllTimersAsync()
      expect(wrapper.vm.get(nextFile.id)).toMatchObject({ active: false, success: true, error: '' })
      expect(wrapper.vm.uploading).toBe(0)
    } finally {
      if (handler) {
        handler.file.active = false
        handler.stopChunks()
      }
      wrapper.unmount()
      vi.unstubAllGlobals()
    }
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
