## 安装

### npm 方式安装

``` bash
npm install vue-upload-component --save
```
``` js
const VueUploadComponent = require('vue-upload-component')
Vue.component('file-upload', VueUploadComponent)
```

### html 方式安装
``` html
<script src="https://unpkg.com/vue"></script>
<script src="https://unpkg.com/vue-upload-component"></script>
<script>
Vue.component('file-upload', VueUploadComponent)
</script>
```



## 使用

### 例子

https://lian-yue.github.io/vue-upload-component/

### 例子源代码

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
     * 已更新
     * @param  Object|undefined   newFile 新的 File 对象 只读
     * @param  Object|undefined   oldFile 旧的 File 对象 只读
     * @return undefined
     */
    inputFile: function(newFile, oldFile) {
      if (newFile && oldFile && !newFile.active && oldFile.active) {
        // 取得 响应数据
        console.log('response', newFile.response)
        if (newFile.xhr) {
          //  取响应状态码 需要 html5 支持
          console.log('status', newFile.xhr.status)
        }
      }
    },

    /**
     * 预处理
     * @param  Object|undefined   newFile 新的 File 对象 可以直接修改
     * @param  Object|undefined   oldFile 旧的 File 对象 只读
     * @param  Function           prevent 阻止修改
     * @return undefined
     */
    inputFilter: function(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        // 过滤 非 图片文件
        if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.file)) {
          return prevent()
        }
      }

      // 创建 blob 字段
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

### SSR (服务器同构)
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

https://github.com/liady/webpack-node-externals

* [**官方 `vue-hackernews` 演示**](https://github.com/lian-yue/vue-hackernews-2.0/)  

* [**查看改动**](https://github.com/lian-yue/vue-hackernews-2.0/commit/bd6c58a30cc6b8ba6c0148e737b3ce9336b99cf8)




***



## Props 参数



### inputId
* **类型：** `String`

* **默认值：** `this.name`

* **描述：**  
  input标签的 `id` 属性

* **用法：**
  ```html
  <file-upload inputId="file2"></file-upload>
  <!--输出-->
  <input id="file2" />
  ```





### name
* **类型：** `String`

* **默认值：** `file`

* **描述：**  
  input标签的 `name` 属性

* **用法：**
  ```html
  <file-upload name="file"></file-upload>
  <!--输出-->
  <input name="file" />
  ```





### post-action
* **类型：** `String`

* **默认值：** `undefined`

* **描述：**  
  `POST` 请求的上传URL

* **用法：**
  ```html
  <file-upload put-action="/upload/put.php"></file-upload>
  ```





### put-action
* **类型：** `String`

* **默认值：** `undefined`

* **描述：**  
  `PUT` 请求的上传URL  
  `put-action` 不为空请优先 `PUT` 请求  
  需要`HTML5`支持  

* **用法：**
  ```html
  <file-upload put-action="/upload/put.php"></file-upload>
  ```
  `PUT` 请求的上传地址
  地址不为空请优先 `PUT` 请求





### headers
* **类型：** `Object`

* **默认值：** `{}`

* **描述：**  
  自定义 `HTTP Header`  
  需要`HTML5`支持  

* **用法：**
  ```html
  <file-upload :headers="{'X-Token-CSRF': 'code'}"></file-upload>
  ```





### data
* **类型：** `Object`

* **默认值：** `{}`

* **描述：**  
  `POST 请求`: 附加请求的 body  
  `PUT 请求`: 附加请求的 query  

* **用法：**
  ```html
  <file-upload :data="{'access_token': 'access_token'}"></file-upload>
  ```




### value, v-model
* **类型：** `Array<Object>`

* **默认值：** `[]`

* **描述：**  
  文件列表
  **为了防止不可预知的错误，不可直接修改 `files`，请使用 [`add`](#add), [`update`](#update), [`remove`](#remove) 方法修改**

* **[文件对象信息](#file)**

* **用法：**
  ```html
  <file-upload :value="files" @input="updatetValue"></file-upload>
  <file-upload v-model="files"></file-upload>
  ```





### accept
* **类型：** `String`

* **默认值：** `undefined`

* **描述：**  
  表单的`accept`属性, MIME type  
  需要`HTML5`支持  

* **用法：**
  ```html
  <file-upload accept="image/png,image/gif,image/jpeg,image/webp"></file-upload>
  <file-upload accept="image/*"></file-upload>
  ```




### multiple
* **类型：** `Boolean`

* **默认值：** `false`

* **描述：**  
  文件表单的 `multiple` 属性  
  是否允许选择多个文件  
  如果是 `false` `files` 里面最多只有一个文件 多的会自动删除  

* **用法：**
  ```html
  <file-upload :multiple="true"></file-upload>
  ```



### directory
* **类型：** `Boolean`

* **默认值：** `false`

* **描述：**  
  文件表单的 `directory` 属性  
  是否是上传文件夹  

* **[查看支持的浏览器](http://caniuse.com/#feat=input-file-directory) **

* **用法：**
  ```html
  <file-upload :directory="true"></file-upload>
  ```





### extensions
* **类型：** `Array | String | RegExp`

* **默认值：** `undefined`

* **描述：**  
  允许上传的文件后缀

* **用法：**
  ```html
  <file-upload extensions="jpg,gif,png,webp"></file-upload>
  <file-upload :extensions="['jpg', 'gif', 'png', 'webp']"></file-upload>
  <file-upload :extensions="/\.(gif|jpe?g|png|webp)$/i"></file-upload>
  ```




### size
* **类型：** `Number`

* **默认值：** `0`

* **描述：**  
  允许上传的最大字节

* **用法：**
  ```html
  <file-upload :size="1024 * 1024"></file-upload>
  ```




### timeout
* **类型：** `Number`

* **默认值：** `0`

* **描述：**  
  上传超时时间毫秒

* **用法：**
  ```html
  <file-upload :timeout="600 * 1000"></file-upload>
  ```




### thread
* **类型：** `Number`

* **默认值：** `1`

* **描述：**  
  同时并发上传的文件数量 线程数  
  需要`HTML5`支持  

* **用法：**
  ```html
  <file-upload :thread="3"></file-upload>
  ```





### drop
* **类型：** `Boolean | Element | CSS selector`

* **默认值：** `false`

* **描述：**  
  拖拽上传  
  如果设置成 `true` 则读取父组件作为容器  
  需要`HTML5`支持

* **[查看支持的浏览器](http://caniuse.com/#feat=dragndrop)**


* **用法：**
  ```html
  <file-upload :drop="true"></file-upload>
  <file-upload drop=".drop-container"></file-upload>
  <file-upload :drop="$el"></file-upload>
  ```





### drop-directory
* **类型：** `Boolean`

* **默认值：** `true`

* **描述：**  
  是否开启拖拽目录  
  如果设置成 `false` 则过滤掉目录

* **用法：**
  ```html
  <file-upload :drop-directory="false"></file-upload>
  ```


***



## 事件

### @input
* **参数：**
  * `files: Array<Object>`

* **描述：**  
  文件被改变触发的方法  
  默认用于`v-model`绑定

* **用法：**
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
* **参数：**
  * `newFile: Object | undefined`  `读写`
  * `oldFile: Object | undefined`  `只读`
  * `prevent: Function`

* **描述：**  
  添加，更新，移除 前过滤器  
  事件内不可使用 `update`, `add`, `remove`, `clear` 方法  
  事件内可修改 `newFile` 对象
  `prevent()` 用于阻止修改

* **用法：**
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
          // 添加文件

          // 过滤非图片文件
          // 不会添加到 files 去
          if (!/\.(jpeg|jpe|jpg|gif|png|webp)$/i.test(newFile.file)) {
            return prevent()
            return
          }


          // 创建 `blob` 字段 用于缩略图预览
          newFile.blob = ''
          let URL = window.URL || window.webkitURL
          if (URL && URL.createObjectURL) {
            newFile.blob = URL.createObjectURL(newFile.file)
          }
        }

        if (newFile && oldFile) {
          // 更新文件

          // 增加版本号
          if (!newFile.version) {
            newFile.version = 0
          }
          newFile.version++
        }

        if (!newFile && oldFile) {
          // 移除文件

          // 拒绝删除文件
          // return prevent()
        }
      }
    }
  }
  ```

### @input-file
* **参数：**
  * `newFile: Object | undefined` `读写`
  * `oldFile: Object | undefined` `只读`

* **描述：**  
  添加，更新，移除 后  
  事件内可使用 `update`, `add`, `remove`, `clear` 方法  
  事件内不可修改 `newFile` 对象  
  事件内不可修改 `oldFile` 对象

* **用法：**
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
          // 添加文件

          // 自动上传
          if (!this.$refs.upload.active) {
            this.$refs.upload.active = true
          }
        }

        if (newFile && oldFile) {
          // 更新文件

          // 开始上传
          if (newFile.active !== oldFile.active) {
            console.log('Start upload', newFile.active, newFile)

            // 限定最小字节
            if (newFile.size >= 0 && newFile.size < 100 * 1024) {
              newFile = this.$refs.upload.update(newFile, {error: 'size'})
            }
          }

          // 上传进度
          if (newFile.progress !== oldFile.progress) {
            console.log('progress', newFile.progress, newFile)
          }

          // 上传错误
          if (newFile.error !== oldFile.error) {
            console.log('error', newFile.error, newFile)
          }

          // 上传成功
          if (newFile.success !== oldFile.success) {
            console.log('success', newFile.success, newFile)
          }
        }

        if (!newFile && oldFile) {
          // 删除文件

          // 自动删除 服务器上的文件
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







## Methods 方法


### get
* **参数：**
  * `id: Object | String`      文件对象 | 文件id

* **返回值：** `Object | Boolean` 存在返回文件对象否则返回`false`

* **描述：**  
  使用`id`获得某个文件对象


### add
* **参数：**
  * `files: Object | Array<Object> | window.File`     文件对象 | 文件数组(多个) | window.File 对象
  * `start: Boolean`                                  是否从开始位置插入

* **返回值：** `Object | Array<Object> | Boolean`      传入的是数组返回数组否则对象或`false`

* **描述：**  
  添加一个或多个文件

* **用法：**
  ```html
  <ul>
    <li v-for="file in files">
      <span>{{file.name}}</span>
    </li>
  </ul>
  <file-upload v-model="files"></file-upload>
  <button type="button" @click.prevent="addText">添加一个文件</button>
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
* **参数：**
  * `files: HTMLInputElement`     文件元素

* **返回值：** `Array`   返回已添加的文件列表

* **描述：**  
  把`<input type="file">`选择的文件添加进上传列表  
  要求版本 >= `2.5.1`



###  addDataTransfer
* **参数：**
  * `dataTransfer: DataTransfer`  拖拽或者粘贴的数据

* **返回值：** `Promise<Array>`   返回已添加的文件列表

* **描述：**  
  把拖拽或者粘贴的数据的文件添加进上传列表  
  要求版本 >= `2.5.1`



### update
* **参数：**
  * `id: Object | String`        文件对象 | 文件id
  * `data: Object`               更新的数据对象

* **返回值：**  `Object | Boolean`  成功返回`newFile` 失败返回 `false`

* **描述：**  
  更新某个文件对象

* **用法：**
  ```html
  <ul>
    <li v-for="file in files">
      <span>{{file.name}}</span>
      <button v-show="file.active" type="button" @click.prevent="abort(file)">停止</button>
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
* **参数：**
  * `id: Object | String`       文件对象 | 文件id

* **返回值：**  `Object | Boolean`  成功返回 `oldFile` 失败返回 `false`

* **描述：**  
  移除某个文件对象

* **用法：**
  ```html
  <ul>
    <li v-for="file in files">
      <span>{{file.name}}</span>
      <button type="button" @click.prevent="remove(file)">删除</button>
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
* **返回值：**  `Boolean`  总是返回 `true`

* **用法：**
  清空文件列表


***

## 组件 Data


### features
* **类型：** `Object`

* **只读：** `true`

* **默认值：** `{html5: true, directory: false, drag: false}`

* **描述：**  
  用于判断浏览器支持的特性

* **用法：**
  ```html
  <app>
    <file-upload ref="upload"></file-upload>
    <span v-show="$refs.upload && $refs.upload.features.drag">支持拖拽上传</span>
    <span v-show="$refs.upload && $refs.upload.features.directory">支持文件夹上传</span>
    <span v-show="$refs.upload && $refs.upload.features.html5">支持HTML5</span>
  </app>
  ```



### active
  * **类型：** `Boolean`

  * **只读：** `false`

  * **默认值：** `false`

  * **描述：**  
    激活或停止上传

  * **用法：**
    ```html
    <app>
      <file-upload ref="upload"></file-upload>
      <span v-if="!$refs.upload || !$refs.upload.active" @click="$refs.upload.active = true">开始上传</span>
      <span v-else @click="$refs.upload.active = false">停止上传</span>
    </app>
    ```



### dropActive
  * **类型：** `Boolean`

  * **只读：** `true`

  * **默认值：** `false`

  * **描述：**  
    是否正在拖拽

  * **用法：**
    ```html
    <app>
      <file-upload ref="upload" :drop="true"></file-upload>
      <span v-show="$refs.upload && $refs.upload.dropActive">拖拽到这里上传<span>
    </app>
    ```
    是否正在拖拽中





### uploaded
  * **类型：** `Boolean`

  * **只读：** `true`

  * **默认值：** `true`

  * **描述：**  
    是否全部已上传

  * **用法：**
    ```html
    <app>
      <file-upload ref="upload"></file-upload>
      <span v-show="$refs.upload && $refs.upload.uploaded">全部文件已上传完毕<span>
    </app>
    ```






***




## File

> **文件对象在`input-filter`事件外修改请使用 [`update`](#update) 方法**

### id
* **类型：** `String | Number`

* **只读：** `true`

* **默认值：** `Math.random().toString(36).substr(2)`

* **描述：**  
  文件id




### size
* **类型：** `Number`

* **只读：** `false`

* **默认值：** `-1`

* **描述：**  
  文件大小

  需要`HTML5`支持



### name
* **类型：** `String`

* **只读：** `false`

* **默认值：** `empty`

* **描述：**  
  文件名

  格式：  
  `directory/filename.gif`  
  `filename.gif`



### type
* **类型：** `String`

* **只读：** `false`

* **默认值：** ` `

* **描述：**  
  MIME类型

  格式：  
  `image/gif`  
  `image/png`  
  `text/html`  

  需要`HTML5`支持



### active
* **类型：** `Boolean`

* **只读：** `false`

* **默认值：** `false`

* **描述：**  
  激活或终止上传

  `true` = 上传  
  `false` = 停止






### error
* **类型：** `String`

* **只读：** `false`

* **默认值：** ` `

* **描述：**  
  上传失败错误代码

  内置  
  `size`, `extension`, `timeout`, `abort`, `network`, `server`, `denied`




### success
* **类型：** `Boolean`

* **只读：** `false`

* **默认值：** `false`

* **描述：**  
  是否上传成功



### putAction
* **类型：** `String`

* **只读：** `false`

* **默认值：** `this.putAction`

* **描述：**  
  自定义当前文件 `PUT` 地址



### postAction
* **类型：** `String`

* **只读：** `false`

* **默认值：** `this.postAction`

* **描述：**  
  自定义当前文件 `POST` 地址





### headers
* **类型：** `Object`

* **只读：** `false`

* **默认值：** `this.headers`

* **描述：**  
  自定义当前文件 `HTTP` Header



### data
* **类型：** `Object`

* **只读：** `false`

* **默认值：** `this.data`

* **描述：**  
  自定义当前文件 `body` 或 `query` 附加内容



### timeout
* **类型：** `Number`

* **只读：** `false`

* **默认值：** `0`

* **描述：**  
  自定义当前单个文件的上传超时时间




### response
* **类型：** `Object | String`

* **只读：** `false`

* **默认值：** `{}`

* **描述：**  
  响应的数据




### progress
* **类型：** `String`

* **只读：** `true`

* **默认值：** `0.00`

* **描述：**  
  上传进度




### speed
* **类型：** `Number`

* **只读：** `true`

* **默认值：** `0`

* **描述：**  
  每秒的上传速度




### xhr
* **类型：** `XMLHttpRequest`

* **只读：** `true`

* **默认值：** `undefined`

* **描述：**  
  `HTML5` 上传 `XMLHttpRequest` 对象




### iframe
* **类型：** `Element`

* **只读：** `true`

* **默认值：** `undefined`

* **描述：**  
  `HTML4` 上传 `iframe` 元素
