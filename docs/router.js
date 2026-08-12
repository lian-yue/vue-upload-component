import { createRouter, createWebHashHistory } from 'vue-router'

import i18n from './i18n'
import RouterComponent from './views/Router'
const DocumentComponent = () => import('./views/Document')
const ExampleComponent = () => import('./views/Example')
const FullExampleComponent = () => import('./views/examples/Full')
const SimpleExampleComponent = () => import('./views/examples/Simple')
const AvatarExampleComponent = () => import('./views/examples/Avatar')
const DragExampleComponent = () => import('./views/examples/Drag')
const MultipleExampleComponent = () => import('./views/examples/Multiple')
const ChunkExampleComponent = () => import('./views/examples/Chunk')
const VuexExampleComponent = () => import('./views/examples/Vuex')
const TypescriptExampleComponent = () => import('./views/examples/Typescript')
const AsyncEventsExampleComponent = () => import('./views/examples/AsyncEvents')

let examples = [{
    path: '',
    component: FullExampleComponent,
  },
  {
    path: 'full',
    component: FullExampleComponent,
  },
  {
    path: 'simple',
    component: SimpleExampleComponent,
  },
  {
    path: 'avatar',
    component: AvatarExampleComponent,
  },
  {
    path: 'drag',
    component: DragExampleComponent,
  },
  {
    path: 'multiple',
    component: MultipleExampleComponent,
  },
  {
    path: 'chunk',
    component: ChunkExampleComponent,
  },
  {
    path: 'vuex',
    component: VuexExampleComponent,
  },
  {
    path: 'typescript',
    component: TypescriptExampleComponent,
  },
  {
    path: 'asyncevents',
    component: AsyncEventsExampleComponent,
  },
]


const router = createRouter({
  history: createWebHashHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      try {
        const el = document.getElementById(decodeURIComponent(to.hash.slice(1)))
        if (el) {
          return { el, top: document.querySelector('#header')?.offsetHeight || 0 }
        }
      } catch (error) {
        return { left: 0, top: 0 }
      }
    } else {
      return { left: 0, top: 0 }
    }
    return { left: 0, top: 0 }
  },
  routes: [{
    path: '/:locale(' + i18n.global.availableLocales.join('|') + ')?',
    component: RouterComponent,
    children: [{
        path: 'documents',
        component: DocumentComponent,
      },
      {
        path: 'examples',
        component: ExampleComponent,
        children: examples,
      },
      {
        path: '',
        component: ExampleComponent,
        children: examples,
      },
    ]
  }, ]
})
export default router
