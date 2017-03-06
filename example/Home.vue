<style>
.home {
  position: relative;
}

.file-uploads {
  font-size: 18px;
  padding: .6em;
  font-weight: bold;
  border: 1px solid #888;
  background: #f3f3f3
}


.drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: absolute;
  opacity: .4;
  background: #000;
}
button {
  padding: .6em;
}

table {
  margin-bottom: 2em
}
table th,table td {
  padding: .4em;
  border: 1px solid #ddd
}

</style>
<template>
  <main class="home">
    <div id="lists">
      <table>
        <thead>
          <tr>
            <th>Index</th>
            <th>ID</th>
            <th>Name</th>
            <th>Size</th>
            <th>Progress</th>
            <th>Speed</th>
            <th>Active</th>
            <th>Error</th>
            <th>Success</th>
            <th>Abort</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(file, index) in files">
              <td>{{index}}</td>
              <td>{{file.id}}</td>
              <td>{{file.name}}</td>
              <td>{{file.size | formatSize}}</td>
              <td>{{file.progress}}</td>
              <td>{{file.speed | formatSize}}</td>
              <td>{{file.active}}</td>
              <td>{{file.error}}</td>
              <td>{{file.success}}</td>
              <td><button type="button" @click.prevent="file.active = false">Abort</button></td>
              <td><button type="button" @click.prevent="remove(file)">x</button></td>
          </tr>
        </tbody>
      </table>
    </div>
    <div id="options">
      <table>
        <tbody>
          <tr>
            <td>
              <file-upload
                :title="title"
                :events="events"
                :name="name"
                :post-action="postAction"
                :put-action="putAction"
                :extensions="extensions"
                :accept="accept"
                :multiple="multiple"
                :size="size || 0"
                :headers="headers"
                :data="data"
                :drop="drop"
                :files="files"
                ref="upload">
              </file-upload>
            </td>
            <td>
              <button v-show="!upload.active" @click.prevent="upload.active = true" type="button">Start upload</button>
              <button v-show="upload.active" @click.prevent="upload.active = false" type="button">Stop upload</button>
            </td>
            <td>
              <label>
                  Auto start: <input type="checkbox" id="checkbox" v-model="auto">
              </label>
            </td>
            <td>
              <label>
                Accept: <input type="text" v-model="accept">
              </label>
            </td>
            <td>
              <label>
                Extensions: <input type="text" v-model="extensions">
              </label>
            </td>
            <td>
              <label>
                Drop: <input type="checkbox" id="checkbox" v-model="drop">
              </label>
            </td>
            <td>
              <label>
                Max file size: <input type="text" v-model.number="size">
              </label>
            </td>
            <td>
              <label>
                Multiple: <input type="checkbox" id="checkbox" v-model="multiple">
              </label>
            </td>
          </tr>
          <tr>
            <td>
              Auto start: {{auto}}
            </td>
            <td>
              Active: {{upload.active}}
            </td>
            <td>
              Uploaded: {{upload.uploaded}}
            </td>
            <td>
              Drop active: {{upload.dropActive}}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-show="upload.dropActive" class="drop-active">
      Drop ing
    </div>
  </main>
</template>


<script>
import FileUpload from '../src'

export default {
  components: {
    FileUpload,
  },

  data() {
     return {
      accept: 'image/*',
      accept: '',
      size: 1024 * 1024 * 10,
      multiple: true,
      extensions: 'gif,jpg,png',
      // extensions: ['gif','jpg','png'],
      // extensions: /\.(gif|png|jpg)$/i,
      files: [],
      upload: {},
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
          if (this.$parent.auto) {
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
}
</script>
