<template>
  <div>
    <div class="upload-btn">
      <file-upload
        title="Add upload files"
        name="file"
        post-action="/post"
        put-action="/put"
        :multiple="true"
        :files="files"
        ref="upload">
      </file-upload>
      <button v-show="!upload.active" @click.prevent="upload.active = true" type="button">Start upload</button>
      <button v-show="upload.active" @click.prevent="upload.active = false" type="button">Stop upload</button>
    </div>
  </div>
</template>


<script>
import FileUpload from '../src'
export default {
  components: {
    FileUpload,
  },
  props: {
    files: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      upload: {},
    }
  },
  mounted() {
    this.upload = this.$refs.upload.$data
  }
}
</script>
