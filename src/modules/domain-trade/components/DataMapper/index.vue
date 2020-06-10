<script>
import TextEllipsis from './src/text-ellipsis'
export default {
  name: 'DataMapper',
  components: {
    TextEllipsis,
  },
  props: {
    // 数据
    data: {
      type: Object,
      default: () => {},
    },
    columns: {
      type: Array,
      default: () => [],
    },
    // 占位符
    placeholder: {
      type: String,
      default: '',
    },
    contentRows: {
      type: Number,
      default: 1,
    },
    // 是否以列显示
    isCloumnShow: {
      type: Boolean,
      default: false,
    },
    labelWidth: {
      type: [String || Number],
      default: '',
    },
  },
  methods: {
    // 渲染contentRows
    renderRow(h, columns) {
      const cols = this.renderCol(h, columns)
      return h(
        'el-row',
        {
          class: {
            'el-data-mapper-row': this.isCloumnShow,
          },
        },
        cols,
      )
    },
    // 渲染列
    renderCol(h, columns = []) {
      return columns.map((col, index) => {
        // 处理object path
        const isPath = col.prop.indexOf('.') >= 0
        let propData = isPath
          ? col.prop
              .split('.')
              .reduce((pre, next) => pre[next] || {}, this.data)
          : this.data[col.prop]
        // 处理内容
        typeof propData === 'object' && (propData = '')
        const VALUE = col.formatter
          ? col.formatter(this.data, col, index)
          : propData || this.placeholder
        const title = h(
          'div',
          {
            class: 'el-data-mapper-col-title',
            style: {
              width: `${this.labelWidth}px`,
            },
          },
          [col.label && `${col.label}：`],
        )
        return h(
          'el-col',
          {
            class: 'el-data-mapper-col ',
            props: {
              xs: 24,
              sm: 12,
              md: 12,
              lg: 8,
              xl: 8,
            },
            style: {
              width: this.isCloumnShow ? '100%' : '',
            },
          },
          [title, this.renderContent(h, VALUE)],
        )
      })
    },
    renderContent(h, content) {
      const textEllipsis = h('text-ellipsis', {
        props: {
          content,
          contentRows: this.contentRows,
        },
      })
      return h(
        'div',
        {
          class: 'el-data-mapper-col-content',
          style: {
            width: `${this.labelWidth}px`,
          },
        },
        [textEllipsis],
      )
    },
  },
  render(h) {
    const contentRows = this.renderRow(h, this.columns)
    return h(
      'div',
      {
        class: 'el-data-mapper',
      },
      [contentRows],
    )
  },
}
</script>
<style lang="less" scoped>
.el-data-mapper {
  margin-bottom: -14px;
  line-height: 21px;
}

.el-data-mapper-col {
  margin-bottom: 14px;
}

.el-data-mapper-col-title {
  color: #818389;
  font-size: 14px;
  text-align: right;
  vertical-align: middle;
  float: left;
  box-sizing: border-box;
}

.el-data-mapper-col-content {
  flex: 1;
  padding-right: 5px;
  color: #818389;
}

.el-data-mapper [class*='el-col-'] {
  /* float:none; */
  // display: inline-flex;
}

.el-data-mapper .text-ellipsis-container {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.el-data-mapper .text-ellipsis-container > .el-tooltip {
  word-break: break-all;
}

.el-data-mapper-row {
  display: flex;
  flex-direction: column;
  width: 100%;
}
</style>
