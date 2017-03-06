<template>
  <div>
    <div class="upload-btn">
      <file-upload
        title="Add upload files"
        name="file"
        post-action="/"
        :multiple="true"
        :events="events"
        ref="upload">
      </file-upload>
      <button v-show="!upload.active" @click.prevent="upload.active = true" type="button">Start upload</button>
      <button v-show="upload.active" @click.prevent="upload.active = false" type="button">Stop upload</button>
    </div>
    <div class="lists">
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
              <td><button type="button" @click.prevent="abort(file)">Abort</button></td>
              <td><button type="button" @click.prevent="remove(file)">x</button></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import FileUpload from '../src'
import { mapState } from 'vuex'

function addFile(file) {
  var newFile = Object.assign({}, file)
  file._vuex = newFile
  this.$store.commit('addFile', newFile)
}


function updateFile(file) {
  var oldFile = file._vuex
  var newFile = Object.assign({}, file)
  file._vuex = newFile
  this.$store.commit('updateFile', {oldFile, newFile})
}

function removeFile(file) {
  this.$store.commit('removeFile', file._vuex)
}


export default {
  components: {
    FileUpload,
  },
  data() {
    return {
      upload: {},
      events: {
        add: addFile,
        progress: updateFile,
        before: updateFile,
        after: updateFile,
        remove: removeFile,
      },
    }
  },

  computed: mapState({
    files: state => state.files
  }),

  methods: {
    remove(file) {
      this.$store.commit('removeFile', file)
      this.$refs.upload.remove(file.id)
    },
    abort(file) {
      this.$refs.upload.abort(file.id)
    },
  },

  mounted() {
    this.upload = this.$refs.upload.$data
  }
}
</script>
