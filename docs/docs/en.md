
> **The document uses Google Translate**

## Getting Started

### NPM

``` bash
npm install vue-upload-component@next --save
```

``` js
import VueUploadComponent from 'vue-upload-component'
app.component('file-upload', VueUploadComponent)
```

### Typescript
``` js
import VueUploadComponent from 'vue-upload-component'

app.component('file-upload', VueUploadComponent)
```

### Curated

**No data**


### Script


unpkg

``` html
<script src="https://unpkg.com/vue@3.5.41/dist/vue.global.prod.js"></script>
<script src="https://unpkg.com/vue-upload-component@next/dist/vue-upload-component.js"></script>
<script>
const app = Vue.createApp({})
app.component('file-upload', VueUploadComponent)
app.mount('#app')
</script>
```

jsDelivr

``` html
<script src="https://cdn.jsdelivr.net/npm/vue@3.5.41/dist/vue.global.prod.js"></script>
<script src="https://cdn.jsdelivr.net/npm/vue-upload-component@next/dist/vue-upload-component.js"></script>
<script>
const app = Vue.createApp({})
app.component('file-upload', VueUploadComponent)
app.mount('#app')
</script>
```


### Simple example



```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Vue-upload-component Test</title>
  <script src="https://unpkg.com/vue@3.5.41/dist/vue.global.prod.js"></script>
  <script src="https://unpkg.com/vue-upload-component@next/dist/vue-upload-component.js"></script>
</head>
<body>
<div id="app">
  <ul>
    <li v-for="file in files">{{file.name}} - Error: {{file.error}}, Success: {{file.success}}</li>
  </ul>
  <file-upload
    ref="upload"
    v-model="files"
    post-action="/post.method"
    put-action="/put.method"
    @input-file="inputFile"
    @input-filter="inputFilter"
  >
  Upload file
  </file-upload>
  <button v-show="!$refs.upload || !$refs.upload.active" @click.prevent="$refs.upload.active = true" type="button">Start upload</button>
  <button v-show="$refs.upload && $refs.upload.active" @click.prevent="$refs.upload.active = false" type="button">Stop upload</button>
</div>
<script>
const app = Vue.createApp({
  data() {
    return {
      files: []
    }
  },
  components: {
    FileUpload: VueUploadComponent
  },
  methods: {
    /**
     * Has changed
     * @param  Object|undefined   newFile   Read only
     * @param  Object|undefined   oldFile   Read only
     * @return undefined
     */
    inputFile: function (newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // Get response data
        console.log('response', newFile.response)
        if (newFile.xhr) {
          //  Get the response status code
          console.log('status', newFile.xhr.status)
        }
      }
    },
    /**
     * Pretreatment
     * @param  Object|undefined   newFile   Read and write
     * @param  Object|undefined   oldFile   Read only
     * @param  Function           prevent   Prevent changing
     * @return undefined
     */
    inputFilter: function (newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Filter non-image file
        if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
          return prevent()
        }
      }

      const URLApi = window.URL || window.webkitURL
      if (URLApi && !newFile && oldFile && oldFile.blob && oldFile.blob.startsWith('blob:')) {
        URLApi.revokeObjectURL(oldFile.blob)
      }
      if (URLApi && newFile && newFile.file && (!oldFile || newFile.file !== oldFile.file)) {
        if (oldFile && oldFile.blob && oldFile.blob.startsWith('blob:')) {
          URLApi.revokeObjectURL(oldFile.blob)
        }
        newFile.blob = URLApi.createObjectURL(newFile.file)
      }
    }
  },
})
app.component('file-upload', VueUploadComponent)
app.mount('#app')
</script>
</body>
</html>
```

### Chunk Upload

Component 3.x includes a chunk upload handler. The default protocol does not require a `CustomUpload.js` file or a copy of the component source. Configure the frontend endpoint and implement the `start`, `upload`, and `finish` phases on the backend.

#### Example

This is a complete Vue 3 single-file component that you can save as a `.vue` file in your project. It uses component 3.x (the npm `next` tag). Replace `/upload/post` and `/upload/chunk` with your backend endpoints.

```vue
<script setup>
import { ref } from 'vue'
import FileUpload from 'vue-upload-component'

const upload = ref(null)
const files = ref([])
const chunk = {
  action: '/upload/chunk',
  minSize: 1048576,
  maxActive: 3,
  maxRetries: 5,
}

function startUpload() {
  if (upload.value) {
    upload.value.active = true
  }
}
</script>

<template>
  <FileUpload
    ref="upload"
    v-model="files"
    post-action="/upload/post"
    chunk-enabled
    :chunk="chunk"
    :size="0"
    multiple
  >
    Select files
  </FileUpload>
  <button type="button" :disabled="!files.length" @click="startUpload">
    Start upload
  </button>
  <ul>
    <li v-for="file in files" :key="file.id">
      {{ file.name }} — {{ file.error || (file.success ? 'Success' : 'Pending or uploading') }}
    </li>
  </ul>
</template>
```

While the queue is stopped, selecting files only adds them to the list; click “Start upload” to start the queue. Files added while the queue is running are uploaded automatically. After the queue finishes, adding more files requires clicking “Start upload” again. In this example, files larger than 1 MiB (1048576 bytes) use the chunk endpoint. Files at or below that size use the ordinary `post-action` endpoint.

| Option | Meaning |
| --- | --- |
| `chunk-enabled` | Enables chunk uploads; disabled by default. |
| `chunk.action` | Endpoint URL shared by all three chunk phases. |
| `chunk.minSize` | File size threshold for using chunks, not the size of each chunk. |
| `chunk.maxActive` | Maximum number of chunks uploaded concurrently per file. |
| `chunk.maxRetries` | Maximum retries after a chunk upload fails, excluding the first request. |
| `size` | Maximum file size accepted by the component; `0` means no limit. |

The backend supplies the actual chunk size in `data.end_offset` in the `start` response. Backend and reverse proxy size limits must still be configured separately.

The [chunk upload example](https://lian-yue.github.io/vue-upload-component/#/en/examples/chunk) and its [source](https://github.com/lian-yue/vue-upload-component/blob/master/docs/views/examples/Chunk.vue) also demonstrate concurrent chunks, retries, and pause/resume. That example page limits files to 10 MiB; adjust `size` to upload larger files.

#### start

Send a `POST` to `chunk.action` with a JSON body:

```json
{
  "phase": "start",
  "name": "large.bin",
  "size": 2621440,
  "mime_type": "application/octet-stream"
}
```

The backend creates an upload session and returns a success status, a non-empty session ID, and the number of bytes per chunk:

```json
{
  "status": "success",
  "data": {
    "session_id": "upload-1",
    "end_offset": 1048576
  }
}
```

In this protocol, `end_offset` means the chunk size and should be a positive integer byte count. The example splits a 2.5 MiB file into three chunks.

#### upload

Send each chunk as a `POST` to the same `chunk.action`, using `multipart/form-data`:

| Field | Content |
| --- | --- |
| `phase` | `upload` |
| `session_id` | Session ID from `start`, such as `upload-1`. |
| `start_offset` | Starting byte offset of this chunk in the original file. |
| `chunk` | Binary contents of this chunk. |

The three offsets in the example are `0`, `1048576`, and `2097152`. Their sizes are `1048576`, `1048576`, and `524288` bytes. Store chunks by session and offset. The backend must handle out-of-order arrival from concurrent uploads and duplicate requests from retries.

After saving each chunk, return:

```json
{ "status": "success" }
```

If a chunk request fails or its response `status` is not `success`, the handler retries according to `maxRetries`. The file upload fails when the retry limit is exceeded.

#### finish

After all chunks have uploaded successfully, send JSON to the same `chunk.action`:

```json
{
  "phase": "finish",
  "session_id": "upload-1"
}
```

The backend should check that all chunks are present, merge and save the file, then return:

```json
{ "status": "success" }
```

Successful responses in every phase should use a successful HTTP status code and include the JSON field `status: "success"`. Failed `start` and `finish` requests are not automatically retried through `maxRetries`. Inspect `file.success`, `file.error`, and `file.response` for the upload result.

Chunk storage, completeness checks, and merging are backend responsibilities. The repository's [`src/utils/chunkUpload.js`](https://github.com/lian-yue/vue-upload-component/blob/master/src/utils/chunkUpload.js) is only a documentation demo endpoint: it randomly returns failures and does not store or merge files.

#### Extending the handler

To add request fields, use `chunk.startBody`, `chunk.uploadBody`, and `chunk.finishBody`. Use `chunk.headers` for chunk request headers. These options do not require a custom handler.

For a different backend protocol, refer to or extend [`ChunkUploadHandler`](https://github.com/lian-yue/vue-upload-component/blob/master/src/chunk/ChunkUploadHandler.js) and implement a handler class in your own project. Save it anywhere you can import it, for example `src/upload/CustomUpload.js`. This path is not required or automatically loaded by the component.

The component creates the handler with `new Handler(file, options)`. It must provide an `upload()` method returning a Promise that resolves when the entire file upload succeeds and rejects on failure. Implement the corresponding methods if pause/resume is needed; extending the default handler lets you reuse its lifecycle handling.

After implementing and exporting your class, import it into the consuming Vue component and supply it as `chunk.handler`. For example, from `src/UploadExample.vue`:

```js
import CustomUpload from './upload/CustomUpload.js'

const chunk = {
  action: '/upload/chunk',
  minSize: 1048576,
  handler: CustomUpload,
}
```

Pass this object through `:chunk="chunk"` in the example above. It replaces the default handler; keep the default handler when using the built-in protocol.


### SSR (Server isomorphism)


```html
<template>
  <file-upload v-model="files" post-action="/">Upload file</file-upload>
</template>
<style>
/*
import '~vue-upload-component/dist/vue-upload-component.part.css'
@import "~vue-upload-component/dist/vue-upload-component.part.css";


or


 */
.file-uploads {
  overflow: hidden;
  position: relative;
  text-align: center;
  display: inline-block;
}
.file-uploads.file-uploads-html4 input[type="file"] {
  opacity: 0;
  font-size: 20em;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  width: 100%;
  height: 100%;
}
.file-uploads.file-uploads-html5 input[type="file"] {
  overflow: hidden;
  position: fixed;
  width: 1px;
  height: 1px;
  z-index: -1;
  opacity: 0;
}
</style>
<script>
import FileUpload from 'vue-upload-component/dist/vue-upload-component.esm.ssr.js'
export default {
  components: {
    FileUpload,
  },
  data() {
    return {
      files: []
    }
  },
}
</script>
```


## Options / Props


### input-id

The `id` attribute of the input tag

* **Type:** `String`

* **Default:** `this.name`

* **Usage:**
  ```html
  <file-upload input-id="file2"></file-upload>
  <!--Output-->
  <input id="file2" />
  ```





### name

The `name` attribute of the input tag

* **Type:** `String`

* **Default:** `file`

* **Usage:**
  ```html
  <file-upload name="file"></file-upload>
  <!--Output-->
  <input name="file" />
  ```





### post-action

`POST` Request upload URL

* **Type:** `String`

* **Default:** `undefined`

* **Usage:**
  ```html
  <file-upload post-action="/upload/post.php"></file-upload>
  ```





### put-action

`PUT` Request upload URL

* **Type:** `String`

* **Default:** `undefined`

* **Browser:** `> IE9`

* **Details:**

  `put-action` is not empty Please give priority to` PUT` request

* **Usage:**
  ```html
  <file-upload put-action="/upload/put.php"></file-upload>
  ```



### custom-action

Custom upload method

* **Type:** `async Function`

* **Default:** `undefined`

* **Details:**  

  `custom-action` priority than `put-action, post-action`

* **Usage:**
  ```html
  <file-upload :custom-action="customAction"></file-upload>
  ```
  ```js
  async function customAction(file, component) {
    // return await component.uploadPut(file)
    return await component.uploadHtml4(file)
  }
  ```





### headers

Attach `header` data

* **Type:** `Object`

* **Default:** `{}`

* **Browser:** `> IE9`

* **Usage:**
  ```html
  <file-upload :headers="{'X-Token-CSRF': 'code'}"></file-upload>
  ```





### data

`POST request`:  Append request `body`
`PUT request`:  Append request `query`

* **Type:** `Object`

* **Default:** `{}`

* **Usage:**
  ```html
  <file-upload :data="{access_token: 'access_token'}"></file-upload>
  ```




### model-value, v-model

File List

* **Type:** `Array<File | Object>`

* **Default:** `[]`

* **Details:**

  View **[`File`](#file)** details
  > In order to prevent unpredictable errors, can not directly modify the `files`, please use [`add`](#instance-methods-add), [`update`](#instance-methods-update), [`remove`](#instance-methods-remove) method to modify

* **Usage:**
  ```html
  <file-upload :model-value="files" @update:model-value="updateValue"></file-upload>
  <!--or-->
  <file-upload v-model="files"></file-upload>
  ```





### accept

The `accept` attribute of the input tag, MIME type

* **Type:** `String`

* **Default:** `undefined`

* **Browser:** `> IE9`

* **Usage:**
  ```html
  <file-upload accept="image/png,image/gif,image/jpeg,image/webp"></file-upload>
  <!--or-->
  <file-upload accept="image/*"></file-upload>
  ```





### capture

The `capture` attribute of the input tag. Use `user` for the front camera or `environment` for the rear camera on supported devices.

* **Type:** `Boolean | 'user' | 'environment'`

* **Default:** `undefined`

* **Usage:**
  ```html
  <file-upload accept="image/*" capture="environment"></file-upload>
  ```


### disabled

Disables file selection and drag-and-drop handling.

* **Type:** `Boolean`

* **Default:** `false`

* **Usage:**
  ```html
  <file-upload :disabled="true"></file-upload>
  ```


### multiple

The `multiple` attribute of the input tag
Whether to allow multiple files to be selected

* **Type:** `Boolean`

* **Default:** `false`

* **Details:**

  If it is `false` file inside only one file will be automatically deleted

* **Usage:**
  ```html
  <file-upload :multiple="true"></file-upload>
  ```



### directory

The `directory` attribute of the input tag
Whether it is a upload folder

* **Type:** `Boolean`

* **Default:** `false`

* **Browser:** [http://caniuse.com/#feat=input-file-directory](http://caniuse.com/#feat=input-file-directory)

* **Usage:**
  ```html
  <file-upload :directory="true" :multiple="true"></file-upload>
  ```





### create-directory

Adds directory entries as zero-byte files with the MIME type `text/directory` when reading a dropped or selected directory.

* **Type:** `Boolean`

* **Default:** `false`

* **Usage:**
  ```html
  <file-upload directory multiple create-directory></file-upload>
  ```


### extensions

Allow upload file extensions

* **Type:** `Array | String | RegExp`

* **Default:** `[]`

* **Usage:**
  ```html
  <file-upload extensions="jpg,gif,png,webp"></file-upload>
  <!--or-->
  <file-upload :extensions="['jpg', 'gif', 'png', 'webp']"></file-upload>
  <!--or-->
  <file-upload :extensions="/\.(gif|jpe?g|png|webp)$/i"></file-upload>
  ```




### size

Allow the maximum byte to upload

* **Type:** `Number`

* **Default:** `0`

* **Browser:** `> IE9`

* **Details:**

  `0` is equal to not limit

* **Usage:**
  ```html
  <file-upload :size="1024 * 1024"></file-upload>
  ```




### timeout

Upload timeout time in milliseconds

* **Type:** `Number`

* **Default:** `0`

* **Browser:** `> IE9`

* **Usage:**
  ```html
  <file-upload :timeout="600 * 1000"></file-upload>
  ```

### maximum

List the maximum number of files

* **Type:** `Number`

* **Default:** `props.multiple ? 0 : 1`

* **Usage:**
  ```html
  <file-upload :maximum="10"></file-upload>
  ```



### thread

Also upload the number of files at the same time (number of threads)

* **Type:** `Number`

* **Default:** `1`

* **Browser:** `> IE9`

* **Usage:**
  ```html
  <file-upload :thread="3"></file-upload>
  ```

### chunk-enabled

Whether chunk uploads is enabled or not

* **Type:** `Boolean`

* **Default:** `false`

* **Usage:**
  ```html
  <file-upload :chunk-enabled="true"></file-upload>
  <file-upload chunk-enabled></file-upload>
  ```

### chunk

All the options to handle chunk uploads

* **Type:** `Object`

* **Default:**
```js
{
    headers: {},
    action: '',
    minSize: 1048576,
    maxActive: 3,
    maxRetries: 5,

    // This is the default Handler implemented in this package
    // you can use your own handler if your protocol is different
    handler: ChunkUploadDefaultHandler
}
```

See [Chunk Upload](#getting-started-chunk-upload) for the complete configuration and request protocol.

### drop

Drag and drop upload

* **Type:** `Boolean | Element | CSS selector`

* **Default:** `false`

* **Browser:** [http://caniuse.com/#feat=dragndrop](http://caniuse.com/#feat=dragndrop)

* **Details:**

  When set to `true`, use the parent component's root element as the drop container if it contains the upload component. Otherwise, try the app's root element with the same check, then fall back to the upload component's actual DOM parent. Text and comment placeholders are not used as containers. This also supports uploads inside Teleport modals.

  To choose a specific area, pass a CSS selector or DOM element. Use `drop="body"` explicitly to receive drops across the page.

* **Usage:**
  ```html
  <file-upload :drop="true"></file-upload>
  ```

  ```html
  <teleport to="body">
    <div class="upload-modal">
      <file-upload :drop="true"></file-upload>
    </div>
  </teleport>
  ```





### drop-directory

Whether to open the drag directory

* **Type:** `Boolean`

* **Default:** `true`

* **Details:**

  If set to `false` filter out the directory

* **Usage:**
  ```html
  <file-upload :drop-directory="false"></file-upload>
  ```



### add-index

* **Type:** `Boolean, Number`

* **Default:** `undefined`

* **Version:** : `>=2.6.1`

* **Details:**

  The default value of the `index` parameter for the [`add()`](#instance-methods-add) method

* **Usage:**
  ```html
  <file-upload :add-index="true"></file-upload>
  ```




## Options / Events

The files is changed to trigger the method
Default for `v-model` binding

### @update:model-value
* **Arguments:**

  * `files: Array<File | Object>`


* **Usage:**
  ```html
  <template>
    <file-upload :model-value="files" @update:model-value="updateValue"></file-upload>
    <!--or-->
    <file-upload v-model="files"></file-upload>
  </template>
  <script>
  export default {
    data() {
      return {
        files: []
      }
    },
    methods: {
      updateValue(value) {
        this.files = value
      }
    }
  }
  </script>
  ```



### @input-filter

Add, update, remove pre-filter

* **Arguments:**

  * `newFile: File | Object | undefined`  `Read and write`
  * `oldFile: File | Object | undefined`  `Read only`
  * `prevent: Function`   Call this function to prevent modification


* **Details:**

  If the `newFile` value is `undefined` 'is deleted
  If the `oldFile` value is `undefined` 'is added
  If `newFile`, `oldFile` is exist, it is updated

  > Synchronization modify `newFile`
  > Asynchronous Please use `update`,` add`, `remove`,` clear` method
  > Asynchronous Please set an error first to prevent being uploaded

  > Synchronization can not use `update`,` add`, `remove`,` clear` methods
  > Asynchronous can not modify `newFile`

* **Usage:**
  ```html
  <template>
    <ul>
      <li v-for="file in files">
        <img :src="file.blob" width="50" height="50" />
      </li>
    </ul>
    <file-upload :model-value="files" @input-filter="inputFilter"></file-upload>
  </template>
  <script>
  export default {
    data() {
      return {
        files: []
      }
    },
    methods: {
      inputFilter(newFile, oldFile, prevent) {
        if (newFile && !oldFile) {
          // Add file

          // Filter non-image file
          // Will not be added to files
          if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.name)) {
            return prevent()
          }

          // Create the 'blob' field for thumbnail preview
          const URLApi = window.URL || window.webkitURL
          if (URLApi) {
            newFile.blob = URLApi.createObjectURL(newFile.file)
          }
        }

        if (newFile && oldFile) {
          // Update file

          // Increase the version number
          if (!newFile.version) {
            newFile.version = 0
          }
          newFile.version++
        }

        if (!newFile && oldFile) {
          // Remove file

          // Refused to remove the file
          // return prevent()
          const URLApi = window.URL || window.webkitURL
          if (URLApi && oldFile.blob && oldFile.blob.startsWith('blob:')) {
            URLApi.revokeObjectURL(oldFile.blob)
          }
        }
      }
    }
  }
  </script>
  ```

### @input-file

Add, update, remove after

* **Arguments:**

  * `newFile: File | Object | undefined` `Read only`
  * `oldFile: File | Object | undefined` `Read only`


* **Details:**

  If the `newFile` value is `undefined` 'is deleted
  If the `oldFile` value is `undefined` 'is added
  If `newFile`, `oldFile` is exist, it is updated


  >You can use `update`,` add`, `remove`,` clear` methods in the event
  >You can not modify the `newFile` object in the event
  >You can not modify the `oldFile` object in the event

* **Usage:**
  ```html
  <template>
    <file-upload ref="upload" v-model="files" @input-file="inputFile"></file-upload>
  </template>
  <script>
  export default {
    data() {
      return {
        files: []
      }
    },
    methods: {
      inputFile(newFile, oldFile) {
        if (newFile && !oldFile) {
          // Add file
        }

        if (newFile && oldFile) {
          // Update file

          // Start upload
          if (newFile.active !== oldFile.active) {
            console.log('Start upload', newFile.active, newFile)

            // min size
            if (newFile.size >= 0 && newFile.size < 100 * 1024) {
              newFile = this.$refs.upload.update(newFile, {error: 'size'})
            }
          }

          // Upload progress
          if (newFile.progress !== oldFile.progress) {
            console.log('progress', newFile.progress, newFile)
          }

          // Upload error
          if (newFile.error !== oldFile.error) {
            console.log('error', newFile.error, newFile)
          }

          // Uploaded successfully
          if (newFile.success !== oldFile.success) {
            console.log('success', newFile.success, newFile)
          }
        }

        if (!newFile && oldFile) {
          // Remove file

          // Automatically delete files on the server
          if (oldFile.success && oldFile.response.id) {
            // $.ajax({
            //   type: 'DELETE',
            //   url: '/file/delete?id=' + oldFile.response.id,
            // });
          }
        }

        // Automatic upload
        if (Boolean(newFile) !== Boolean(oldFile) || oldFile.error !== newFile.error) {
          if (!this.$refs.upload.active) {
            this.$refs.upload.active = true
          }
        }
      }
    }
  }
  </script>
  ```



## Instance / Data

### features

Used to determine the browser support features

* **Type:** `Object`

* **Read only:** `true`

* **Default:** `{ html5: true, directory: false, drop: false }`

* **Usage:**
  ```html
  <app>
    <file-upload ref="upload"></file-upload>
    <span v-show="$refs.upload && $refs.upload.features.drop">Support drag and drop upload</span>
    <span v-show="$refs.upload && $refs.upload.features.directory">Support folder upload</span>
    <span v-show="$refs.upload && $refs.upload.features.html5">Support for HTML5</span>
  </app>
  ```



### active

Activation or abort upload

* **Type:** `Boolean`

* **Read only:** `false`

* **Default:** `false`

* **Usage:**
  ```html
  <app>
    <file-upload ref="upload"></file-upload>
    <span v-if="!$refs.upload || !$refs.upload.active" @click="$refs.upload.active = true">Start upload</span>
    <span v-else @click="$refs.upload.active = false">Stop upload</span>
  </app>
  ```



### dropActive

Is dragging

* **Type:** `Boolean`

* **Read only:** `true`

* **Default:** `false`

* **Usage:**
  ```html
  <app>
    <file-upload ref="upload" :drop="true"></file-upload>
    <span v-show="$refs.upload && $refs.upload.dropActive">Drag and drop here for upload</span>
  </app>
  ```


### dropElementActive

Is Dragged to container

* **Type:** `Boolean`

* **Read only:** `true`

* **Default:** `false`

* **Usage:**
  ```html
  <app>
    <file-upload ref="upload" :drop="true"></file-upload>
    <span v-show="$refs.upload && $refs.upload.dropActive && $refs.upload.dropElementActive">Already dragged here, release the mouse to add the file</span>
  </app>
  ```





### uploaded

All uploaded

* **Type:** `Boolean`

* **Read only:** `true`

* **Default:** `true`

* **Usage:**
  ```html
  <app>
    <file-upload ref="upload"></file-upload>
    <span v-show="$refs.upload && $refs.upload.uploaded">All files have been uploaded</span>
  </app>
  ```





## Instance / Methods



### get()

Use `id` to get a file object

* **Arguments:**

  * `id: File | Object | String`


* **Result:** `File | Object | Boolean` There is a return file, object that otherwise returns `false`



### add()

Add one or more files

* **Arguments:**

  * `files: Array<File | window.File | Object> | File | window.File | Object`     If it is an array of responses will be an array
  * `index: Number | Boolean` = [`props.add-index`](#options-props-add-index)   `true = ` Start, `false = ` End, `Number = ` Index


* **Result:** `Object | Array<File | Object> | Boolean`     The incoming array is returned to the array otherwise the object or `false`

* **Usage:**
  ```html
  <template>
    <ul>
      <li v-for="file in files">
        <span>{{file.name}}</span>
      </li>
    </ul>
    <file-upload v-model="files"></file-upload>
    <button type="button" @click.prevent="addText">Add a file</button>
  </template>
  <script>
  export default {
    data() {
      return {
        files: []
      }
    },
    methods: {
      addText() {
        let file = new window.File(['foo'], 'foo.txt', {
          type: "text/plain",
        })
        this.$refs.upload.add(file)
      }
    }
  }
  </script>
  ```


###  addInputFile()

Add the file selected by `<input type = "file">` to the upload list

* **Arguments:**

  * `el: HTMLInputElement`     File element


* **Result:** `Promise<Array<File>>`  Added list of files

* **Version:** : `>=3.0.0`

The results of Vue 2. X

* **Result:** `Array<File>`  Added list of files

* **Version:** : `<3.0.0`



###  addDataTransfer()

Add files that are dragged or pasted into the upload list

* **Arguments:**

  * `dataTransfer: DataTransfer`  Drag or paste data


* **Result:** `Promise<Array<File>>`   Added list of files


* **Version:** : `>=2.5.1`



### update()

Update a file object

* **Arguments:**

  * `id: File | Object | String`
  * `data: Object`                    Updated data object


* **Result:**  `Object | Boolean`  Successfully returned `newFile` failed to return` false`


* **Usage:**
  ```html
  <template>
    <ul>
      <li v-for="file in files">
        <span>{{file.name}}</span>
        <button v-show="file.active" type="button" @click.prevent="abort(file)">Abort</button>
      </li>
    </ul>
    <file-upload v-model="files"></file-upload>
  </template>
  <script>
  export default {
    data() {
      return {
        files: []
      }
    },
    methods: {
      abort(file) {
        this.$refs.upload.update(file, {active: false})
        // or
        // this.$refs.upload.update(file, {error: 'abort'})
      }
    }
  }
  </script>
  ```

### remove()

Remove a file object

* **Arguments:**

  * `id: File | Object | String`


* **Result:**  `Object | Boolean`  Successfully returned `oldFile` failed to return` false`

* **Usage:**
  ```html
  <template>
    <ul>
      <li v-for="file in files">
        <span>{{file.name}}</span>
        <button type="button" @click.prevent="remove(file)">Remove</button>
      </li>
    </ul>
    <file-upload v-model="files"></file-upload>
  </template>
  <script>
  export default {
    data() {
      return {
        files: []
      }
    },
    methods: {
      remove(file) {
        this.$refs.upload.remove(file)
      }
    }
  }
  </script>
  ```

### replace()
  Replace the location of the two files

* **Arguments:**

  * `id1: File | Object | String`
  * `id2: File | Object | String`


* **Result:**  `Boolean`


### clear()

Empty the file list

* **Result:**  `Boolean`  Always return `true`



## Instance / File



> **File object in the `@input-filter` event outside the use of [`update`](#instance-methods-update) method**




### fileObject

* **Type:** `Boolean`

* **Read only:** `true`

* **Required:** `true`

* **Default:** `true`

* **Version:** : `>=2.6.0`

* **Details:**

  If the attribute does not exist, the object will not be processed internally
  If the attribute does not exist, it is not `File` but `Object`




### id

File ID

* **Type:** `String | Number`

* **Read only:** `false`

* **Default:** `Math.random().toString(36).substr(2)`

* **Details:**

  >`id` can not be repeated
  >Upload can not modify `id`


### size

File size

* **Type:** `Number`

* **Read only:** `false`

* **Default:** `-1`

* **Browser:** `> IE9`


### name

Filename

* **Type:** `String`

* **Read only:** `false`

* **Default:** ` `

* **Details:**

  Format:  `directory/filename.gif`  `filename.gif`



### type

MIME type

* **Type:** `String`

* **Read only:** `false`

* **Default:** ` `

* **Browser:** `> IE9`

* **Details:**

  Format:  `image/gif`   `image/png`  `text/html`




### active

Activation or abort upload

* **Type:** `Boolean`

* **Read only:** `false`

* **Default:** `false`

* **Details:**

  `true` = Upload
  `false` = Abort






### error

Upload failed error code

* **Type:** `String`

* **Read only:** `false`

* **Default:** ` `

* **Details:**

  Built-in
  `size`, `extension`, `timeout`, `abort`, `network`, `server`, `denied`




### success

Whether the upload was successful

* **Type:** `Boolean`

* **Read only:** `false`

* **Default:** `false`


### putAction

Customize the current file `PUT` URL

* **Type:** `String`

* **Read only:** `false`

* **Default:** `this.putAction`



### postAction

Customize the current file `POST` URL

* **Type:** `String`

* **Read only:** `false`

* **Default:** `this.postAction`




### headers

Customize the current file `HTTP` Header

* **Type:** `Object`

* **Read only:** `false`

* **Default:** `this.headers`


### data

Customize the current file `body` or` query` to attach content

* **Type:** `Object`

* **Read only:** `false`

* **Default:** `this.data`


### timeout

Customize the upload timeout for a current single file

* **Type:** `Number`

* **Read only:** `false`

* **Default:** `this.timeout`


### response

Response data

* **Type:** `Object | String`

* **Read only:** `false`

* **Default:** `{}`




### progress

Upload progress

* **Type:** `String`

* **Read only:** `false`

* **Default:** `0.00`

* **Browser:** `> IE9`



### speed

Per second upload speed

Reset to `0` when the file goes from inactive to active (retry / resume)

* **Type:** `Number`

* **Read only:** `true`

* **Default:** `0`

* **Browser:** `> IE9`




### xhr

`HTML5` upload` XMLHttpRequest` object

* **Type:** `XMLHttpRequest`

* **Read only:** `true`

* **Default:** `undefined`

* **Browser:** `> IE9`




### iframe

`HTML4` upload` iframe` element

* **Type:** `Element`

* **Read only:** `true`

* **Default:** `undefined`

* **Browser:** `= IE9`
