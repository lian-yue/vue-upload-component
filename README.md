# vue-upload-component

> Vue.js file upload component, Support for multiple file uploads, progress, html4, ie9
**Html4 does not support the progress bar, file size, accept, timeout, headers, response status code error of judgment**



## Install

``` bash
    npm install vue-upload-component@next --save
```

### CommonJS
```js
    var FileUpload = require('vue-upload-component');

    new Vue({
        template: '<file-upload post-action="/post.method" put-action="/put.method"></file-upload>',
        components: {
            FileUpload: FileUpload
        }
    })

```

### ES6
```js
    import FileUpload from 'vue-upload-component'
    new Vue({
        template: '<file-upload post-action="/post.method" put-action="/put.method"></file-upload>',
        components: {
            FileUpload
        }
    })

```


## Examples

https://lian-yue.github.io/vue-upload-component/


https://github.com/lian-yue/vue-upload-component/tree/2.0/example/

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
    title="Add upload files"

    name="post file name"

    drop="Boolean (true = $parent) or Element or Css Selector"

    extensions="Array or String or Regular"

    post-action="./post.method"

    put-action="./put.method"

    accept="accept"

    multiple="true or false"

    size="max Size"

    timeout="3600000"

    events="Object"

    headers="Request headers object"

    data="Request data object"

    files="Upload files"

    thread="Number  (Multi-file uploads at the same time)"
    >
</file-upload>
```




### Props events
``` js
    events: {
        add(file, component) {
            console.log('add');
            if (this.auto) {
                component.active = true;
            }
            file.headers['X-Filename'] = encodeURIComponent(file.name)
            file.data.filename = file.name

            // file.putAction = 'xxx'
            // file.postAction = 'xxx'
        },
        progress(file, component) {
            console.log('progress ' + file.progress);
        },
        after(file, component) {
            console.log('after');
        },
        before(file, component) {
            console.log('before');
        }
    }
```



### Props files
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
    clear()  // Clear all files
    remove(id or file Object)  // Remove a file   return   file object or  false
    abort(id or file Object)  // Stop a file upload return   file object or  false
```
