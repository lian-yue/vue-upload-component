# vue-upload-component

> Vue.js file upload component, Support for multiple file uploads, progress, html4, ie9
**Html4 does not support the progress bar, file size, timeout, headers, response status code error of judgment**



## Install

``` bash
    npm install vue-upload-component --save
```


## Demo
``` html

    <div id="app">
        <file-upload title="Add upload files"></file-upload>
    </div>

    <script type="text/javascript">
    var FileUpload = require('./FileUpload.vue');

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
``` json
    {
        files: [{
            //
            request: {
                headers: {
                    "X-Csrf-Token": "xxxx",
                },
                data: {
                    "_csrf_token": "xxxxxx",
                },
            },
        }],

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
