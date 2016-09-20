import Vue from 'vue/dist/vue.js'

var FileUpload = require('./FileUpload.vue');
// import FileUpload from './FileUpload.vue';


Vue.config.silent = false;
Vue.config.devtools = true;



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
    files: [],
    upload: [],
    title: 'Add upload files',
    drop: true,
    auto: false,

    name: 'file',

    postAction: './post.php',
    putAction: './put.php',

    headers: {
      "X-Csrf-Token": "xxxx",
    },

    data: {
      "_csrf_token": "xxxxxx",
    },

    events: {
      add(file, component) {
        console.log('add');
        if (this.auto) {
          component.active = true;
        }
        file.headers['X-Filename'] = encodeURIComponent(file.name)
        file.data.finename = file.name

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
      },
    }
  },

  mounted() {
    this.upload = this.$refs.upload.$data
  },

  methods: {
    remove(file) {
      var index = this.files.indexOf(file)
      if (index != -1) {
        this.files.splice(index, 1);
      }
    },
  },
});
