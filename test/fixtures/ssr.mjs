import assert from 'node:assert/strict'
import { createSSRApp, h, provide, inject } from 'vue'
import { renderToString } from 'vue/server-renderer'

const cases = [
  ['empty', undefined, undefined],
  ['text', () => 'Choose file', 'Choose file'],
  ['element', () => h('button', 'Choose file'), '<button>Choose file</button>'],
  ['component', () => h({ render: () => h('button', 'Choose file') }), '<button>Choose file</button>'],
  ['injection', () => h({
    setup() {
      const label = inject('label')
      return () => h('button', label)
    },
  }), '<button>Injected label</button>'],
  ['async', () => h({
    async setup() {
      await Promise.resolve()
      return () => h('button', 'Async label')
    },
  }), '<button>Async label</button>'],
]

for (const filename of ['vue-upload-component.ssr.js', 'vue-upload-component.esm.ssr.js']) {
  const { default: FileUpload } = await import(new URL(`../../dist/${filename}`, import.meta.url).href)
  for (const [name, slot, expected] of cases) {
    const errors = []
    const warnings = []
    const app = createSSRApp({
      setup() {
        provide('label', 'Injected label')
        return () => h(FileUpload, { name: 'upload-file' }, slot ? { default: slot } : undefined)
      },
    })
    app.config.errorHandler = error => errors.push(error)
    app.config.warnHandler = warning => warnings.push(warning)

    const html = await renderToString(app)
    assert.equal(errors.length, 0, `${filename} / ${name}: ${errors.join('; ')}`)
    assert.equal(warnings.length, 0, `${filename} / ${name}: ${warnings.join('; ')}`)
    assert.match(html, /type="file"/)
    assert.match(html, /name="upload-file"/)
    if (expected) assert.ok(html.includes(expected), `${filename} / ${name}: ${html}`)
  }
}
