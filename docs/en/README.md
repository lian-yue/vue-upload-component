> **The document uses Google Translate**

## Install

### npm install

``` bash
npm install vue-upload-component --save
```
``` js
const VueUploadComponent = require('vue-upload-component')
Vue.component('file-upload', VueUploadComponent)
```

### html install
``` html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vue-upload-component"></script>
<script>
Vue.component('file-upload', VueUploadComponent)
</script>
```



## Usage

### Example

https://lian-yue.github.io/vue-upload-component/

### Example source code

https://github.com/lian-yue/vue-upload-component/tree/2.0/example


### html
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Vue-upload-component Test</title>
  <script src="https://unpkg.com/vue"></script>
  <script src="https://unpkg.com/vue-upload-component"></script>
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
new Vue({
  el: '#app',
  data: function() {
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
    inputFile: function(newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // Get response data
        console.log('response', newFile.response)
        if (newFile.xhr) {
          //  Get the response status code
          //  Required html5 support
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
    inputFilter: function(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // Filter non-image file
        if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.file)) {
          return prevent()
        }
      }

      // Create a blob field
      newFile.blob = ''
      let URL = window.URL || window.webkitURL
      if (URL && URL.createObjectURL) {
        newFile.blob = URL.createObjectURL(newFile.file)
      }
    }
  }
});
</script>
</body>
</html>
```

### SSR (Server isomorphism)
```js
import FileUpload from 'vue-upload-component/src'
```

### webpack.config.js
```js
const nodeExternals = require('webpack-node-externals');
{
  //.....
  externals: [
    nodeExternals({whitelist:[/^vue-upload-component/]})
  ]
  //.....
}
```



***



## Props



### inputId
* **Type:** `String`

* **Default:** `this.name`

* **Description:**  
  The `id` attribute of the input tag

* **Usage:**
  ```html
  <file-upload inputId="file2"></file-upload>
  <!--Output-->
  <input id="file2" />
  ```





### name
* **Type:** `String`

* **Default:** `file`

* **Description:**  
  The `name` attribute of the input tag

* **Usage:**
  ```html
  <file-upload name="file"></file-upload>
  <!--输出-->
  <input name="file" />
  ```





### post-action
* **Type:** `String`

* **Default:** `undefined`

* **Description:**  
  `POST` Request upload URL

* **Usage:**
  ```html
  <file-upload put-action="/upload/put.php"></file-upload>
  ```





### put-action
* **Type:** `String`

* **Default:** `undefined`

* **Description:**  
  `PUT` Request upload URL  
  `put-action` is not empty Please give priority to` PUT` request  
  Required `html5` support

* **Usage:**
  ```html
  <file-upload put-action="/upload/put.php"></file-upload>
  ```





### headers
* **Type:** `Object`

* **Default:** `{}`

* **Description:**  
  Attach `header` data  
  Required `html5` support

* **Usage:**
  ```html
  <file-upload :headers="{'X-Token-CSRF': 'code'}"></file-upload>
  ```





### data
* **Type:** `Object`

* **Default:** `{}`

* **Description:**  
  `POST request`:  Append request `body`  
  `PUT request`:  Append request `query`

* **Usage:**
  ```html
  <file-upload :data="{'access_token': 'access_token'}"></file-upload>
  ```





### value, v-model
* **Type:** `Array<Object>`

* **Default:** `[]`

* **Description:**  
  File List  
  **In order to prevent unpredictable errors, can not directly modify the `files`, please use [`add`](#add), [`update`](#update), [`remove`](#remove) method to modify**

* **[File object](#file)**

* **Usage:**
  ```html
  <file-upload :value="files" @input="updatetValue"></file-upload>
  <file-upload v-model="files"></file-upload>
  ```





### accept
* **Type:** `String`

* **Default:** `undefined`

* **Description:**  
  The `accept` attribute of the input tag, MIME type  
  Required `html5` support  

* **Usage:**
  ```html
  <file-upload accept="image/png,image/gif,image/jpeg,image/webp"></file-upload>
  <file-upload accept="image/*"></file-upload>
  ```





### multiple
* **Type:** `Boolean`

* **Default:** `false`

* **Description:**  
  The `multiple` attribute of the input tag  
  Whether to allow multiple files to be selected  
  If it is `false` file inside only one file will be automatically deleted

* **Usage:**
  ```html
  <file-upload :multiple="true"></file-upload>
  ```



### directory
* **Type:** `Boolean`

* **Default:** `false`

* **Description:**  
  The `directory` attribute of the input tag  
  Whether it is a upload folder  

* **[View supported browsers](http://caniuse.com/#feat=input-file-directory)**

* **Usage:**
  ```html
  <file-upload :directory="true" :multiple="true"></file-upload>
  ```





### extensions
* **Type:** `Array | String | RegExp`

* **Default:** `undefined`

* **Description:**  
  Allow upload file extensions  

* **Usage:**
  ```html
  <file-upload extensions="jpg,gif,png,webp"></file-upload>
  <file-upload :extensions="['jpg', 'gif', 'png', 'webp']"></file-upload>
  <file-upload :extensions="/\.(gif|jpe?g|png|webp)$/i"></file-upload>
  ```




### size
* **Type:** `Number`

* **Default:** `0`

* **Description:**  
  Allow the maximum byte to upload

* **Usage:**
  ```html
  <file-upload :size="1024 * 1024"></file-upload>
  ```




### timeout
* **Type:** `Number`

* **Default:** `0`

* **Description:**  
  Upload timeout time in milliseconds

* **Usage:**
  ```html
  <file-upload :timeout="600 * 1000"></file-upload>
  ```




### thread
* **Type:** `Number`

* **Default:** `1`

* **Description:**  
  Also upload the number of files at the same time (number of threads)  
  Required `html5` support

* **Usage:**
  ```html
  <file-upload :thread="3"></file-upload>
  ```





### drop
* **Type:** `Boolean | Element | CSS selector`

* **Default:** `false`

* **Description:**  
  Drag and drop upload  
  If set to `true`, read the parent component as a container  
  Required `html5` support

* **[View supported browsers](http://caniuse.com/#feat=dragndrop)**

* **Usage:**
  ```html
  <file-upload :drop="true"></file-upload>
  ```





### drop-directory
* **Type:** `Boolean`

* **Default:** `true`

* **Description:**  
  Whether to open the drag directory  
  If set to `false` filter out the directory

* **Usage:**
  ```html
  <file-upload :drop-directory="false"></file-upload>
  ```


***



## Events

### @input
* **Arguments:**
  * `files: Array<Object>`

* **Description:**  
  The files is changed to trigger the method  
  Default for `v-model` binding

* **Usage:**
  ```html
  <file-upload :value="files" @input="updatetValue"></file-upload>
  <file-upload v-model="files"></file-upload>
  ```
  ```js
  {
    data() {
      return {
        files: []
      }
    },
    methods: {
      updatetValue(value) {
        this.files = value
      }
    }
  }
  ```



### @input-filter
* **Arguments:**
  * `newFile: Object | undefined`  `Read and write`
  * `oldFile: Object | undefined`  `Read only`
  * `prevent: Function`

* **Description:**  
  Add, update, remove pre-filter  
  You can not use `update`,` add`, `remove`,` clear` methods in the event  
  The `newFile` object can be modified within the event  
  `prevent()` can prevent modification

* **Usage:**
  ```html
  <ul>
    <li v-for="file in files">
      <img :src="file.blob" width="50" height="50" />
    </li>
  </ul>
  <file-upload :value="files" @input-filter="inputFilter"></file-upload>
  ```
  ```js
  {
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
          if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.file)) {
            return prevent()
          }


          // Create the `blob` field for thumbnail preview
          newFile.blob = ''
          let URL = window.URL || window.webkitURL
          if (URL && URL.createObjectURL) {
            newFile.blob = URL.createObjectURL(newFile.file)
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
        }
      }
    }
  }
  ```

### @input-file
* **Arguments:**
  * `newFile: Object | undefined` `Read only`
  * `oldFile: Object | undefined` `Read only`

* **Description:**  
  Add, update, remove after  
  You can use `update`,` add`, `remove`,` clear` methods in the event  
  You can not modify the `newFile` object in the event  
  You can not modify the `oldFile` object in the event

* **Usage:**
  ```html
  <file-upload ref="upload" v-model="files" @input-file="inputFile"></file-upload>
  ```
  ```js
  {
    data() {
      return {
        files: []
      }
    },
    methods: {
      inputFile(newFile, oldFile) {
        if (newFile && !oldFile) {
          // Add file

          // Automatic upload
          if (!this.$refs.upload.active) {
            this.$refs.upload.active = true
          }
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
      }
    }
  }
  ```






***







## Methods


### get
* **Arguments:**
  * `id: Object | String`      File object | file id

* **Result：** `Object | Boolean` There is a return file object that otherwise returns `false`

* **Description:**  
  Use `id` to get a file object


### add
* **Arguments:**
  * `files: Object | Array<Object> | window.File`     File object | file array (multiple) | window.File object
  * `start: Boolean`                                  Whether it is inserted from the start position

* **Result：** `Object | Array<Object> | Boolean`     The incoming array is returned to the array otherwise the object or `false`

* **Description:**  
  Add one or more files

* **Usage:**
  ```html
  <ul>
    <li v-for="file in files">
      <span>{{file.name}}</span>
    </li>
  </ul>
  <file-upload v-model="files"></file-upload>
  <button type="button" @click.prevent="addText">Add a file</button>
  ```
  ```js
  {
    data() {
      return {
        files: []
      }
    },
    methods: {
      addText() {
        let file = new File(['foo'], 'foo.txt', {
          type: "text/plain",
        })
        this.$refs.upload.add(file)
      }
    }
  }
  ```


###  addInputFile
* **Arguments:**
  * `files: HTMLInputElement`     File element

* **Result：** `Array`   Added list of files

* **Description:**  
  Add the file selected by `<input type = "file">` to the upload list
  Requires version >= `2.5.1`



###  addDataTransfer
* **Arguments:**
  * `dataTransfer: DataTransfer`  Drag or paste data

* **Result：** `Promise<Array>`   Added list of files

* **Description:**  
  Add files that are dragged or pasted into the upload list  
  Requires version >= `2.5.1`




### update
* **Arguments:**
  * `id: Object | String`        File object | file id
  * `data: Object`               Updated data object

* **Result：**  `Object | Boolean`  Successfully returned `newFile` failed to return` false`

* **Description:**  
  Update a file object

* **Usage:**
  ```html
  <ul>
    <li v-for="file in files">
      <span>{{file.name}}</span>
      <button v-show="file.active" type="button" @click.prevent="abort(file)">Abort</button>
    </li>
  </ul>
  <file-upload v-model="files"></file-upload>
  ```
  ```js
  {
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
  ```

### remove
* **Arguments:**
  * `id: Object | String`       File object | file id

* **Result：**  `Object | Boolean`  Successfully returned `oldFile` failed to return` false`

* **Description:**  
  Remove a file object

* **Usage:**
  ```html
  <ul>
    <li v-for="file in files">
      <span>{{file.name}}</span>
      <button type="button" @click.prevent="remove(file)">Remove</button>
    </li>
  </ul>
  <file-upload v-model="files"></file-upload>
  ```
  ```js
  {
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
  ```


### clear
* **Result：**  `Boolean`  Always return `true`

* **Description:**  
  Empty the file list


***

## Component Data data


### features
* **Type:** `Object`

* **Read only:** `true`

* **Default:** `{html5: true, directory: false, drag: false}`

* **Description:**  
  Used to determine the browser support features


* **Usage:**
  ```html
  <app>
    <file-upload ref="upload"></file-upload>
    <span v-show="$refs.upload && $refs.upload.features.drag">Support drag and drop upload</span>
    <span v-show="$refs.upload && $refs.upload.features.directory">Support folder upload</span>
    <span v-show="$refs.upload && $refs.upload.features.html5">Support for HTML5</span>
  </app>
  ```



### active
  * **Type:** `Boolean`

  * **Read only:** `false`

  * **Default:** `false`

  * **Description:**  
    Activation or abort upload

  * **Usage:**
    ```html
    <app>
      <file-upload ref="upload"></file-upload>
      <span v-if="!$refs.upload || !$refs.upload.active" @click="$refs.upload.active = true">Start upload</span>
      <span v-else @click="$refs.upload.active = false">Stop upload</span>
    </app>
    ```



### dropActive
  * **Type:** `Boolean`

  * **Read only:** `true`

  * **Default:** `false`

  * **Description:**  
    Is dragging

  * **Usage:**
    ```html
    <app>
      <file-upload ref="upload" :drop="true"></file-upload>
      <span v-show="$refs.upload && $refs.upload.dropActive">Drag and drop here for upload<span>
    </app>
    ```





### uploaded
  * **Type:** `Boolean`

  * **Read only:** `true`

  * **Default:** `true`

  * **Description:**  
    All uploaded

  * **Usage:**
    ```html
    <app>
      <file-upload ref="upload"></file-upload>
      <span v-show="$refs.upload && $refs.upload.uploaded">All files have been uploaded<span>
    </app>
    ```






***




## File

> **File object in the `input-filter` event outside the use of [`update`] (#update) method**


### id
* **Type:** `String | Number`

* **Read only:** `true`

* **Default:** `Math.random().toString(36).substr(2)`

* **Description:**  
  File ID




### size
* **Type:** `Number`

* **Read only:** `false`

* **Default:** `-1`

* **Description:**  
  File size

  Required `html5` support



### name
* **Type:** `String`

* **Read only:** `false`

* **Default:** ` `

* **Description:**  
  Filename  

  Format:  
  `directory/filename.gif`  
  `filename.gif`  



### type
* **Type:** `String`

* **Read only:** `false`

* **Default:** `empty`

* **Description:**  
  MIME type

  Format:  
  `image/gif`  
  `image/png`  
  `text/html`

  Required `html5` support



### active
* **Type:** `Boolean`

* **Read only:** `false`

* **Default:** `false`

* **Description:**  
  Activation or abort upload

  `true` = Upload  
  `false` = Abort  






### error
* **Type:** `String`

* **Read only:** `false`

* **Default:** ` `

* **Description:**  
  Upload failed error code

  Built-in  
  `size`, `extension`, `timeout`, `abort`, `network`, `server`, `denied`




### success
* **Type:** `Boolean`

* **Read only:** `false`

* **Default:** `false`

* **Description:**  
  Whether the upload was successful



### putAction
* **Type:** `String`

* **Read only:** `false`

* **Default:** `this.putAction`

* **Description:**  
  Customize the current file `PUT` URL



### postAction
* **Type:** `String`

* **Read only:** `false`

* **Default:** `this.postAction`

* **Description:**  
  Customize the current file `POST` URL





### headers
* **Type:** `Object`

* **Read only:** `false`

* **Default:** `this.headers`

* **Description:**  
  Customize the current file `HTTP` Header



### data
* **Type:** `Object`

* **Read only:** `false`

* **Default:** `this.data`

* **Description:**  
  Customize the current file `body` or` query` to attach content



### timeout
* **Type:** `Number`

* **Read only:** `false`

* **Default:** `0`

* **Description:**  
  Customize the upload timeout for a current single file




### response
* **Type:** `Object | String`

* **Read only:** `false`

* **Default:** `{}`

* **Description:**  
  Response data




### progress
* **Type:** `String`

* **Read only:** `true`

* **Default:** `0.00`

* **Description:**  
  Upload progress




### speed
* **Type:** `Number`

* **Read only:** `true`

* **Default:** `0`

* **Description:**  
  Per second upload speed




### xhr
* **Type:** `XMLHttpRequest`

* **Read only:** `true`

* **Default:** `undefined`

* **Description:**  
  `HTML5` upload` XMLHttpRequest` object




### iframe
* **Type:** `Element`

* **Read only:** `true`

* **Default:** `undefined`

* **Description:**  
  `HTML4` upload` iframe` element
