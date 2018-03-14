import Vue from 'vue'
  
// Instance / File
global {
  namespace VueUpload {
    interface File {
      readonly fileObject: boolean
      id: string | number
      size: number
      name: string
      type: string
      active: boolean
      error: string
      success: boolean
      putAction: string
      postAction: string
      headers: object
      data: object
      timeout: number
      response: object | string
      progress: string
      speed: number
      xhr: XMLHttpRequest
      iframe: Element
    }
  }
}

interface VueUploadComponent extends Vue, Element {
  // Instance / Methods
  get(id: VueUpload.File | object | string): VueUpload.File | object | boolean
  add(files: Array<VueUpload.File | File | object> | VueUpload.File | File | object): object | Array<VueUpload.File | object> | boolean
  addInputFile(el: HTMLInputElement): Array<VueUpload.File>
  addDataTransfer(dataTransfer: DataTransfer): Promise<Array<VueUpload.File>>
  update(id: VueUpload.File | object | string, data: object): object | boolean
  // remove(id: VueUpload.File | object | string): object | boolean // Types are incompatible with Element
  replace(id1: VueUpload.File | object | string, id2: VueUpload.File | object | string): boolean
  clear(): boolean

  // Instance / Data
  readonly files: Array<VueUpload.File>
  readonly features: { html5?: boolean; directory?: boolean; drag?: boolean }
  active: boolean
  readonly dropActive: true
  readonly uploaded: true
}

// module 'vue/types/vue' {
  // https://stackoverflow.com/a/41286276/5221998
  // interface Vue {
  //   readonly $refs: { [key: string]: VueUploadComponent };
  // }
// }

export default VueUploadComponent
