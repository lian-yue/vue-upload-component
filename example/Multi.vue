
<template>
  <main class="multi">
    <div class="image">
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
            </tr>
          </thead>
          <tbody>
            <tr v-for="(file, index) in imageFiles">
                <td>{{index}}</td>
                <td>{{file.id}}</td>
                <td>{{file.name}}</td>
                <td>{{file.size | formatSize}}</td>
                <td>{{file.progress}}</td>
                <td>{{file.speed | formatSize}}</td>
                <td>{{file.active}}</td>
                <td>{{file.error}}</td>
                <td>{{file.success}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="upload-btn">
        <file-upload
          title="Add upload images"
          name="image"
          post-action="/image"
          put-action="/image"
          accept='image/*'
          :multiple="true"
          :files="imageFiles"
          ref="image">
        </file-upload>
        <button v-show="!image.active" @click.prevent="image.active = true" type="button">Start upload</button>
      </div>
    </div>

    <div class="video">
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
            </tr>
          </thead>
          <tbody>
            <tr v-for="(file, index) in videoFiles">
                <td>{{index}}</td>
                <td>{{file.id}}</td>
                <td>{{file.name}}</td>
                <td>{{file.size | formatSize}}</td>
                <td>{{file.progress}}</td>
                <td>{{file.speed | formatSize}}</td>
                <td>{{file.active}}</td>
                <td>{{file.error}}</td>
                <td>{{file.success}}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="upload-btn">
        <file-upload
          title="Add upload videos"
          name="video"
          post-action="/video"
          put-action="/video"
          accept='video/*'
          :multiple="true"
          :files="videoFiles"
          ref="video">
        </file-upload>
        <button v-show="!video.active" @click.prevent="video.active = true" type="button">Start upload</button>
        <button v-show="video.active" @click.prevent="video.active = false" type="button">Stop upload</button>
      </div>
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
      image: {},
      imageFiles: [],

      video: {},
      videoFiles: [],
    }
  },

  mounted() {
    this.image = this.$refs.image.$data
    this.video = this.$refs.video.$data
  },
}
</script>
