// var FileUpload = require('./FileUpload.vue');

import FileUpload from './FileUpload.vue';


Vue.filter('formatSize', function(size) {
    if (size > 1024 * 1024 * 1024 * 1024) {
		return (size / 1024 / 1024 / 1024 / 1024).toFixed(2) + ' TB';
	} else if (size > 1024 * 1024 * 1024) {
		return (size / 1024 / 1024 / 1024).toFixed(2) + ' GB';
	} else if (size > 1024 * 1024) {
		return (size / 1024 / 1024).toFixed(2) + ' MB';
	} else if (size > 1024) {
		return (size / 1024).toFixed(2) + ' KB';
	}
	return size.toString() + ' B';
});

new Vue({
    el:'#app',
    components: {
        FileUpload:FileUpload,
    },
    data: {
        accept: 'image/*',
        size: 1024 * 1024 * 10,
        multiple: true,
        extensions: 'gif,jpg,png',
        // extensions: ['gif','jpg','png'],
        // extensions: /\.(gif|png|jpg)$/i,
        drop: true,
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
