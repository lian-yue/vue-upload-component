<template>
  <input
    type="file"
    :name="$parent.name"
    :id="$parent.id || $parent.name"
    :accept="$parent.accept"
    @change="change"
    :webkitdirectory="$parent.directory && $parent.mode === 'html5'"
    :multiple="$parent.multiple && $parent.mode === 'html5'"
  />
</template>
<script>
export default {
  methods: {
    change(e) {
      this.$destroy()
      this.$parent.addInputFile(e.target)
    }
  }
}
</script>
