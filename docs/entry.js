import { createApp, h } from 'vue'
import { marked, Renderer as MarkedRenderer } from 'marked'
import highlightjs from 'highlight.js'
import 'highlight.js/styles/atom-one-light.css'
import store from './store'
import router from './router'
import i18n from './i18n'
import App from './views/App'

class Renderer extends MarkedRenderer {
  constructor() {
    super()
    this.headers = []
  }

  heading({ text, tokens, depth }) {
    const rawName = text.toLowerCase().replace(/([\u0000-\u002F\u003A-\u0060\u007B-\u007F]+)/g, '-').replace(/^-+|-+$/g, '')

    while (this.headers.length >= depth) {
      this.headers.pop()
    }
    let parent = this.headers.filter(value => !!value).join('-')
    if (parent) {
      parent = parent + '-'
    }
    while (this.headers.length < (depth - 1)) {
      this.headers.push('')
    }
    this.headers.push(rawName)
    const content = this.parser.parseInline(tokens)
    return '<h' +
      depth +
      ' id="' +
      parent +
      rawName +
      '">' +
      content +
      '</h' +
      depth +
      '>\n'
  }

  code({ text, lang }) {
    const language = lang && highlightjs.getLanguage(lang) ? lang : ''
    const code = language
      ? highlightjs.highlight(text, { language }).value
      : highlightjs.highlightAuto(text).value
    const languageClass = language ? ' language-' + language : ''
    return '<pre><code class="hljs' + languageClass + '">' + code + '</code></pre>\n'
  }
}

const renderer = new Renderer()
marked.setOptions({
  renderer,
  gfm: true,
  breaks: false,
})

function renderMarkdown(text) {
  renderer.headers = []
  return marked.parse(text)
}
const app = createApp({
  render() {
    return h(App)
  },
})

app.use(store)
app.use(i18n)
app.use(router)


// 设置当前 url 信息
router.push(window.location.hash ? window.location.hash.substr(1) : '')

// 载入
router.isReady().then(function() {
  app.mount('#app')
})


app.directive('markdown', {
  mounted(el, binding, vnode) {
    if (!el.className || !/vue-markdown/.test(el.className)) {
      el.className += ' vue-markdown'
    }

    let text = ''
    if (typeof vnode.children === 'string') {
      text = vnode.children
    } else {
      for (let i = 0; i < vnode.children.length; i++) {
        text += vnode.children[i].text || vnode.children[i].children || ''
      }
    }

    if (el.markdown === text) {
      return
    }


    el.markdown = text
    el.innerHTML = renderMarkdown(text)
    let selectorList = el.querySelectorAll('a')
    for (let i = 0; i < selectorList.length; i++) {
      selectorList[i].onclick = function(e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey) {
          return
        }
        if (e.defaultPrevented) {
          return
        }
        if (e.button !== undefined && e.button !== 0) {
          return
        }

        if (this.host !== window.location.host) {
          return
        }

        let href = this.getAttribute('href')
        if (!href) {
          return
        }

        if (href.charAt(0) !== '#') {
          return
        }

        e.preventDefault()
        router.push(href)
      }
    }
  },
  beforeUpdate(el, binding, vnode) {
    if (el.classList.contains("vue-markdown")) {
      el.classList.remove("vue-markdown");
    }
  },
  updated(el, binding, vnode) {
    if (!el.className || !/vue-markdown/.test(el.className)) {
      el.className += ' vue-markdown'
    }
    let text = ''
    if (typeof vnode.children === 'string') {
      text = vnode.children
    } else {
      for (let i = 0; i < vnode.children.length; i++) {
        text += vnode.children[i].text || vnode.children[i].children || ''
      }
    }
    if (el.markdown === text) {
      return
    }

    el.markdown = text
    el.innerHTML = renderMarkdown(text)
    let selectorList = el.querySelectorAll('a')
    for (let i = 0; i < selectorList.length; i++) {
      selectorList[i].onclick = function(e) {
        if (e.metaKey || e.ctrlKey || e.shiftKey) {
          return
        }
        if (e.defaultPrevented) {
          return
        }
        if (e.button !== undefined && e.button !== 0) {
          return
        }

        if (this.host !== window.location.host) {
          return
        }

        let href = this.getAttribute('href')
        if (!href) {
          return
        }

        if (href.charAt(0) !== '#') {
          return
        }

        e.preventDefault()
        router.push(href)
      }
    }
  }
})



app.config.globalProperties.$toLocale = function(to) {
  return '/' + i18n.global.locale.value + to
}

app.config.globalProperties.$formatSize = function(size) {
  if (size > 1024 * 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB'
  } else if (size > 1024 * 1024 * 1024) {
    return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB'
  } else if (size > 1024 * 1024) {
    return (size / 1024 / 1024).toFixed(2) + ' MB'
  } else if (size > 1024) {
    return (size / 1024).toFixed(2) + ' KB'
  }
  return size.toString() + ' B'
}



// new Vue({
//   store,
//   // router,
//   // i18n,
//   // ...App
// }).$mount('#app')
