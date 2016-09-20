<script>
export default {
  methods: {
    change(e) {
      this.$destroy();
      this.$parent._addInputFileElement(e.target);
    },
  },

  render(h) {
    const parent = this.$parent;
    return (
      <input
        type="file"
        name={parent.name}
        id={parent.id|| parent.name}
        accept={parent.accept}
        on-change={this.change}
        multiple={parent.multiple && parent.mode == 'html5'}
      />
    )
  }
}
</script>
