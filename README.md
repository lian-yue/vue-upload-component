# vue-upload-component

> Vue.js file upload component, Support for multiple file uploads, progress, html4, ie9
**Html4 does not support the progress bar, file size, accept, timeout, headers, response status code error of judgment**



## Install

``` bash
    npm install vue-upload-component --save
```
### CommonJS
```js
    var FileUpload = require('vue-upload-component');

    new Vue({
        template: '<file-upload action="/"></file-upload>',
        components: {
            FileUpload: FileUpload
        }
    })

```

### ES6
```js
    import FileUpload from 'vue-upload-component'
    new Vue({
        template: '<file-upload action="/"></file-upload>',
        components: {
            FileUpload
        }
    })

```


## Example

https://lian-yue.github.io/vue-upload-component/

``` html
    <!-- Example file ./index.html -->
    <!-- Example file ./src/example.js -->
    <div id="app">
        <file-upload title="Add upload files"></file-upload>
    </div>

    <script type="text/javascript">
    var FileUpload = require('vue-upload-component');

    new Vue({
        el:'#app',
        components: {
            FileUpload:FileUpload,
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


## Dispatch
    addFileUpload

    removeFileUpload

    fileUploadProgress

    beforeFileUpload

    afterFileUpload




## Setting

### Data
``` js
    {
        files: [
            {
                id: 'String',
                name: 'filename String',
                size: 'filesize   Number',
                progress: 'progress String',
                active: 'active Boolean',
                error: 'error String',
                errno: 'errno String',
                success: 'success Boolean',
                data: 'Response data Object or String',

                request: {
                    headers: {
                        "X-Csrf-Token": "xxxx",
                    },
                    data: {
                        "_csrf_token": "xxxxxx",
                    },
                },

            }
        ],

        // Global
        request: {
            headers: {
                "X-Csrf-Token": "xxxx",
            },
            data: {
                "_csrf_token": "xxxxxx",
            },
        },
    }
```


### Props
``` html
<file-upload :title="Add upload files" :name="file" :action="./upload.php" :accept="accept"  :multiple="multiple" :size="size" :timeout="3600000"></file-upload>
```
