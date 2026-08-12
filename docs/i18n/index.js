import {createI18n} from 'vue-i18n'
import en from './en'
import zhCN from './zh-cn'

export default createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    'zh-cn': zhCN,
    en,
  }
})
