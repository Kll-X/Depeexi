<script>
import {Row, Col} from 'element-ui'
import TextEllipsis from './text-ellipsis'

export default {
  name: 'DataMapper',
  components: {
    'el-row': Row,
    'el-col': Col,
    TextEllipsis,
  },
  props: {
    // 数据
    data: {
      type: Object,
      default: () => {},
    },
    // 设置列
    // [{
    //   prop: 'prop',
    //   label: 'label'
    // }]
    columns: {
      type: Array,
      default: () => [],
    },
    // 占位符
    placeholder: {
      type: String,
      default: '',
    },
    rows: {
      type: Number,
      default: 1,
    },
  },
  methods: {
    // 渲染rows
    renderRow(h, columns) {
      const cols = this.renderCol(h, columns)
      return h('el-row', cols)
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
            class: 'data-mapper-col-title',
          },
          [col.label && `${col.label}：`],
        )
        return h(
          'el-col',
          {
            class: 'data-mapper-col',
            props: {
              xs: 24,
              sm: 12,
              md: 12,
              lg: 8,
              xl: 8,
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
          rows: this.rows,
        },
      })
      return h(
        'div',
        {
          class: 'data-mapper-col-content',
        },
        [textEllipsis],
      )
    },
  },
  render(h) {
    const rows = this.renderRow(h, this.columns)
    return h(
      'div',
      {
        class: 'data-mapper',
      },
      [rows],
    )
  },
}
</script>

<style lang="less" scoped>
.data-mapper {
  margin-bottom: -14px;

  &-col {
    margin-bottom: 14px;
    line-height: 20px;

    &-title {
      color: #818389;
      font-size: 14px;
    }

    &-content {
      flex: 1;
      padding-right: 5px;
      color: #2d303b;
      font-size: 14px;
    }
  }

  [class*='el-col-'] {
    float: none;
    display: inline-flex;
  }
}
</style>
