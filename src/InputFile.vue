<template>
  <span class="file-uploads-input">
    <input
      type="file"
      :name="$parent.name"
      :id="$parent.id || $parent.name"
      :accept="$parent.accept"
      @change="change"
      :multiple="$parent.multiple && $parent.mode === 'html5'"
    />
  </span>
</template>
<script>
export default {
  methods: {
    change(e) {
      this.$destroy()
      this.$parent._addInputFileElement(e.target)
    }
  }
}
</script>
