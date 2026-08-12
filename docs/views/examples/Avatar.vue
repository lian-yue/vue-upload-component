<template>
  <div class="example-avatar">
    <div v-show="$refs.upload && $refs.upload.dropActive" class="drop-active">
      <h3>Drop files to upload</h3>
    </div>
    <div class="avatar-upload"  v-show="!edit">
      <div class="text-center p-2">
        <label for="avatar">
          <img :src="files.length ? files[0].url : 'https://www.gravatar.com/avatar/default?s=200&r=pg&d=mm'"  class="rounded-circle" />
          <h4 class="pt-2">or<br/>Drop files anywhere to upload</h4>
        </label>
      </div>
      <div class="text-center p-2">
        <file-upload
          extensions="gif,jpg,jpeg,png,webp"
          accept="image/png,image/gif,image/jpeg,image/webp"
          name="avatar"
          class="btn btn-primary"
          post-action="/upload/post"
          :drop="!edit"
          v-model="files"
          @input-filter="inputFilter"
          @input-file="inputFile"
          ref="upload">
          Upload avatar
        </file-upload>
      </div>
    </div>

    <div class="avatar-edit" v-show="files.length && edit">
      <div class="avatar-edit-image" v-if="files.length">
        <img ref="editImage" :src="files[0].url" />
      </div>
      <div class="text-center p-4">
        <button type="button" class="btn btn-secondary" @click.prevent="$refs.upload.clear">Cancel</button>
        <button type="submit" class="btn btn-primary" @click.prevent="editSave">Save</button>
      </div>
    </div>
    <div class="pt-5 source-code">
      Source code: <a href="https://github.com/lian-yue/vue-upload-component/blob/master/docs/views/examples/Avatar.vue">/docs/views/examples/Avatar.vue</a>
    </div>
  </div>
</template>
<style>
.example-avatar .avatar-upload .rounded-circle {
  width: 200px;
  height: 200px;
}
.example-avatar .text-center .btn {
  margin: 0 .5rem

}
.example-avatar .avatar-edit-image {
  max-width: 100%;
  height: 80vh;
}
.example-avatar .avatar-edit-image img {
  max-width: 100%;
  max-height: 100%;
}
.example-avatar .avatar-edit-image cropper-canvas {
  height: 100%;
}


.example-avatar .drop-active {
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: fixed;
  z-index: 9999;
  opacity: .6;
  text-align: center;
  background: #000;
}

.example-avatar .drop-active h3 {
  margin: -.5em 0 0;
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  -webkit-transform: translateY(-50%);
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  font-size: 40px;
  color: #fff;
  padding: 0;
}
</style>


<script>
import Cropper from 'cropperjs'
import FileUpload from 'vue-upload-component'
export default {
  components: {
    FileUpload,
  },

  data() {
    return {
      files: [],
      edit: false,
      cropper: false,
    }
  },

  watch: {
    edit(value) {
      if (value) {
        this.$nextTick(function () {
          if (!this.$refs.editImage) {
            return
          }
          const cropper = new Cropper(this.$refs.editImage)
          const selection = cropper.getCropperSelection()
          const cropperImage = cropper.getCropperImage()
          if (selection) {
            selection.aspectRatio = 1
            selection.initialAspectRatio = 1
            const setSquareSelection = () => {
              const size = Math.min(selection.width, selection.height)
              if (size > 0) {
                selection.$change(
                  selection.x + (selection.width - size) / 2,
                  selection.y + (selection.height - size) / 2,
                  size,
                  size,
                  1,
                )
              }
            }
            cropperImage ? cropperImage.$ready(setSquareSelection) : setSquareSelection()
          }
          this.cropper = cropper
        })
      } else {
        if (this.cropper) {
          this.cropper.destroy()
          this.cropper = false
        }
      }
    }
  },

  methods: {
    async editSave() {
      const oldFile = this.files[0]
      const selection = this.cropper && this.cropper.getCropperSelection()
      if (!oldFile || !selection) {
        return
      }

      try {
        const canvas = await selection.$toCanvas()
        const blob = await new Promise((resolve, reject) => {
          canvas.toBlob((result) => {
            result ? resolve(result) : reject(new Error('crop'))
          }, oldFile.type)
        })
        const file = new File([blob], oldFile.name, { type: blob.type || oldFile.type })

        this.$refs.upload.update(oldFile.id, {
          file,
          type: file.type,
          size: file.size,
          active: true,
        })
        this.edit = false
      } catch (error) {
        this.alert(error.message || 'crop')
      }
    },

    alert(message) {
      alert(message)
    },

    inputFile(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        this.$nextTick(function () {
          this.edit = true
        })
      }
      if (!newFile && oldFile) {
        this.edit = false
      }
    },

    inputFilter(newFile, oldFile, prevent) {
      if (newFile && !oldFile) {
        if (!/\.(gif|jpg|jpeg|png|webp)$/i.test(newFile.name)) {
          this.alert('Your choice is not a picture')
          return prevent()
        }
      }

      if (newFile && (!oldFile || newFile.file !== oldFile.file)) {
        newFile.url = ''
        let URL = window.URL || window.webkitURL
        if (URL && URL.createObjectURL) {
          newFile.url = URL.createObjectURL(newFile.file)
        }
      }
    }
  }
}
</script>
