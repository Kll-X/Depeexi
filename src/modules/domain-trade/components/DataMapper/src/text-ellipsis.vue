<script>
export default {
  name: 'TextEllipsis',
  props: {
    content: {
      type: [String, Number, Object],
      default: '',
    },
    contentRows: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      height: 'auto',
      contentHeight: 'auto',
    }
  },
  computed: {
    show() {
      return window.parseInt(this.height) < this.contentHeight
    },
  },
  watch: {
    content() {
      this.computedEllipsis()
    },
  },
  mounted() {
    this.computedEllipsis()
    window.addEventListener('resize', this.computedEllipsis)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.computedEllipsis)
  },
  methods: {
    computedEllipsis() {
      this.$nextTick(() => {
        const el = this.$el
        const children = el.children[0].children[0]
        this.height = `${window.parseInt(
          window.getComputedStyle(el, null).lineHeight,
        ) * this.contentRows}px`
        this.contentHeight = children.offsetHeight
      })
    },
  },
  render(h) {
    return h(
      'div',
      {
        class: 'text-ellipsis-container',
        style: {
          'max-height': this.height,
          '-webkit-line-clamp': this.contentRows,
        },
      },
      [
        h(
          'el-tooltip',
          {
            props: {
              placement: 'top',
              content: `${this.content}`,
              disabled: !this.show,
            },
          },
          [h('div', [h('span', {class: 'mapper-content'}, [this.content])])],
        ),
      ],
    )
  },
}
</script>
<style lang="less" scoped>
.mapper-content {
  color: #2d303b;
  font-size: 14px;
}
</style>
