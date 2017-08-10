# vue-upload-component

> Vue.js file upload component, Support for multiple file uploads, progress, html4, ie9
**Html4 does not support the progress bar, file size, accept, timeout, headers, response status code error of judgment**



## Install

``` bash
    npm install vue-upload-component --save
```

### HTML
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Vue-upload-component Test</title>
  <script src="https://unpkg.com/vue"></script>
  <script src="https://unpkg.com/vue-upload-component@2.4.0-beta.5/dist/vue-upload-component.js"></script>
</head>
<body>
  <div id="app">
    <file-upload v-model="files"
                 post-action="/post.method"
                 put-action="/put.method">Upload file
    </file-upload>
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
      }
    });
  </script>
</body>
</html>
```

### CommonJS
```js
    var FileUpload = require('vue-upload-component');
    new Vue({
        template: '<file-upload v-model="files" post-action="/post.method" put-action="/put.method">Upload file</file-upload>',
        data: function() {
            return {
                files: []
            }
        },
        components: {
            FileUpload: FileUpload
        }
    })

```

### ES6
```js
    import FileUpload from 'vue-upload-component'
    new Vue({
        template: '<file-upload v-model="files" post-action="/post.method" put-action="/put.method">Upload file</file-upload>',
        data() {
            return {
                files: []
            }
        },
        components: {
            FileUpload
        }
    })

```


### SSR (Server)
```js
import FileUpload from 'vue-upload-component/src'
```

#### webpack.config.js
```js
var nodeExternals = require('webpack-node-externals');
{
    //.....
    externals: [
        nodeExternals({whitelist:[/^vue-upload-component/]})
    ]
    //.....
}
```

## Examples

https://lian-yue.github.io/vue-upload-component/


https://github.com/lian-yue/vue-upload-component/tree/2.0/example/
``` html
    <div id="app">
        <file-upload v-model="files" post-action="/post.method" put-action="/put.method">Upload file</file-upload>
    </div>

    <script type="text/javascript">
    var FileUpload = require('vue-upload-component');

    new Vue({
        el:'#app',
        data() {
            return {
                files: [],
            }
        },
        components: {
            FileUpload: FileUpload,
        },
    });
    </script>
```

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```



# Setting


## Props
``` html
<file-upload
    name="post file name"

    drop="Boolean (true = $parent) or Element or Css Selector"

    dropDirectory="true or false"

    extensions="Array or String or Regular"

    post-action="./post.method"

    put-action="./put.method"

    accept="accept"

    multiple="true or false"

    directory="true or false"

    size="max Size"

    timeout="3600000"

    headers="Request headers object"

    data="Request data object"

    thread="Number  (Multi-file uploads at the same time)"

    filter="Function(file) (Custom upload filters)"

    value="Upload files"

    v-model="files"

    @input="Function(files)"

    @input-file="Function(newFile, oldFile)"
    >
    Add Files
</file-upload>
```




### Props value
``` js
    [
        {
            id: 'String', // Read only
            name: 'filename String',
            size: 'filesize   Number',   // -1  = html4
            progress: 'progress String', // Read only
            speed: "Speed Number", // Read only
            active: 'active Boolean',   // set active = fasle  abort upload
            error: 'error String',  // Read only
            success: 'success Boolean', // Read only
            response: 'Response data Object or String', // Read only
            putAction: 'String uri',
            postAction: 'String uri',
            timeout: "Number",
            headers: {
                "X-Csrf-Token": "xxxx",
            },
            data: {
                "_csrf_token": "xxxxxx",
            },

            xhr: "False or XMLHttpRequest object",             // html5
            iframe: "False or Element object",                  // html4
            file: "undefined or File object"               // html5
            el: "undefined or Input object"
        }
    ]
```





## data
``` js
    {
        mode: 'html5',  // html5 or html4

        active: false,   // set active = false abort upload

        uploaded: true,  // Read only

        dropActive: false,  // Read only

        destroy: false,  // Read only    Component destroy = true
    }
```


## methods
````
    clear()
    get(id or file Object)
    add(window.File Object or object)
    update(id or file Object, data)
    remove(id or file Object)
```
