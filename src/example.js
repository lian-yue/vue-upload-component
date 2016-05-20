// var FileUpload = require('./FileUpload.vue');

import FileUpload from './FileUpload.vue';

new Vue({
    el:'#app',
    components: {
        FileUpload:FileUpload,
    },
    data: {
        accept: 'image/*',
        size: 1024 * 1024 * 10,
        multiple: true,
    },
    compiled: function() {
        this.$refs.upload.request = {
            headers: {
                "X-Csrf-Token": "xxxx",
            },
            data: {
                "_csrf_token": "xxxxxx",
            },
        };
    },
    methods: {
        remove: function(file) {
            this.$refs.upload.files.$remove(file);
        },
    }
});
