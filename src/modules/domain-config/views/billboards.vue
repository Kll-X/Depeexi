<template>
  <div class="billboards">
    <p style="padding:20px 0 0 30px;">
      <el-button
        class="common-operate-btn"
        size="mini"
        type="primary"
        @click="form.isShow = true"
        >新增</el-button
      >
    </p>

    <div class="card">
      <div v-for="item in cardData" :key="item.id" class="card-item__wrap">
        <el-card class="card-item">
          <div class="card-item__content">
            <img :src="item.imageUrl" />
            <p>{{ item.title }}</p>
          </div>

          <div class="card-item__operate">
            <el-switch
              v-model="item.isUse"
              @change="onChangeStatus(item)"
            ></el-switch>
            <label>
              <el-button type="text" class="button" @click="setBillboard(item)"
                >设置</el-button
              >
              <el-button
                v-if="!item.isUse"
                type="text"
                class="danger"
                @click="onDelete(item)"
                >删除</el-button
              >
            </label>
          </div>
        </el-card>
      </div>
    </div>

    <p v-show="cardData.length == 0" class="card--empty">暂无数据</p>

    <el-drawer
      v-if="form.isShow"
      :visible.sync="form.isShow"
      :title="currentBillboardData.id ? '编辑' : '新增'"
      direction="rtl"
      size="650px"
      @close="resetData"
    >
      <div class="drawer-content">
        <el-form-renderer
          ref="form"
          :content="formContent"
          label-width="120px"
        ></el-form-renderer>
        <operate-row>
          <el-button @click="form.isShow = false">取 消</el-button>
          <el-button :loading="form.loading" type="primary" @click="saveForm"
            >确 定</el-button
          >
        </operate-row>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import OperateRow from '../components/operate-row'
import UploadToAli from '@femessage/upload-to-ali'
import {Cascader} from 'element-ui'
import {
  newBillboard,
  getBillboards,
  deleteBillboard,
  editBillboard,
  getAllCategory,
} from '../services/billboards'

function formatChildren(arr) {
  return arr.map(v => {
    if (!v.children || v.children.length == 0) {
      delete v.children
    } else {
      v.children = formatChildren(v.children)
    }
    return v
  })
}

export default {
  components: {
    OperateRow,
  },
  data() {
    return {
      currentBillboardData: {},
      form: {
        isShow: false,
        loading: false,
      },
      formContent: [
        {
          $id: 'title',
          $attrs: {},
          $el: {
            placeholder: '请输入榜单标题',
          },
          $type: 'input',
          label: '榜单标题',
          rules: [
            {
              required: true,
              message: '请输入榜单标题',
              trigger: ['blur', 'change'],
            },
          ],
        },
        {
          $id: 'categoryId',
          component: Cascader,
          label: '关联品类',
          $el: {
            'show-all-levels': false,
            props: {
              label: 'name',
              value: 'id',
            },
            options: [],
          },
          outputFormat(value) {
            return value && value[value.length - 1]
          },
        },
        {
          $id: 'type',
          $attrs: {},
          $el: {},
          $type: 'radio-group',
          label: '榜单类型',
          $default: 1,
          $options: [
            {label: '人气榜（该品类下浏览最多的商品)', value: 1},
            {label: '销售榜', value: 0},
          ],
        },
        {
          $id: 'imageUrl',
          label: '图片',
          component: UploadToAli,
          rules: [
            {
              required: true,
              message: '请上传图片',
              trigger: ['blur', 'change'],
            },
          ],
        },
        {
          $id: 'status',
          $attrs: {},
          $el: {},
          $type: 'radio-group',
          label: '状态',
          $default: 1,
          $options: [{label: '启用', value: 1}, {label: '禁用', value: 0}],
        },
        {
          $id: 'sort',
          $attrs: {},
          $el: {
            placeholder: '请输入排序值',
            type: 'number',
          },
          $type: 'input',
          label: '排序',
          rules: [
            {
              required: true,
              message: '请输入数字',
              trigger: ['blur', 'change'],
            },
          ],
        },
      ],

      cardData: [],
    }
  },
  watch: {
    'form.isShow'(show) {
      if (!show) {
        this.resetData()
      }
    },
  },
  mounted() {
    this.fetchList()
    getAllCategory().then(res => {
      let categoryList = res.payload || []
      categoryList = formatChildren(categoryList)

      let config = this.formContent.find(v => v.$id == 'categoryId')
      config.$el.options = categoryList
    })
  },
  methods: {
    resetIframe() {
      this.$parent.iframeQuery = Date.now()
      this.$parent.iframeLoading = true
    },
    resetData() {
      this.currentBillboardData = {}
    },
    fetchList() {
      this.resetIframe()
      getBillboards().then(res => {
        let data = res.payload || []
        data = data
          .map(v => {
            v.isUse = v.status == 1
            return v
          })
          .sort((a, b) => {
            return a.sort - b.sort
          })
        this.cardData = data
      })
    },
    onDelete({id}) {
      this.$confirm('确定要删除吗？')
        .then(() => {
          deleteBillboard(id).then(res => {
            this.$message.success('删除成功')
            this.fetchList()
          })
        })
        .catch(() => {})
    },
    onChangeStatus(item) {
      const status = item.isUse ? '1' : '0'

      editBillboard(item.id, {
        status,
      }).then(() => {
        this.$message.success('保存成功')
        this.fetchList()
      })
    },
    async setBillboard(data) {
      this.currentBillboardData = Object.assign({}, data)
      this.form.isShow = true

      await this.$nextTick()
      this.$refs.form.updateForm(data)
    },

    saveForm() {
      const form = this.$refs.form
      const data = form.getFormValue()

      const params = {
        ...data,
      }
      form.validate(valid => {
        if (!valid) return
        let id = this.currentBillboardData.id
        let request = id ? editBillboard(id, params) : newBillboard(params)

        request.then(res => {
          this.fetchList()
          this.$message.success('保存成功')
          this.form.isShow = false
        })
      })
    },
  },
}
</script>

<style lang="less" scoped>
.billboards {
  /deep/ .el-drawer__body {
    padding: 15px;
    padding-right: 40px;
  }

  .drawer-content {
    display: flex;
    flex-direction: column;
    height: 100%;

    form {
      flex: 1;
    }

    .form-operate {
      text-align: center;
    }
  }
}

.card {
  padding: 20px;
  display: flex;
  flex-wrap: wrap;

  &--empty {
    text-align: center;
    padding: 30px 0 60px;
  }

  .card-item {
    /deep/ .el-card__body {
      padding: 0;
    }

    &__wrap {
      min-width: 320px;
      width: 33.3%;
      padding: 10px;
      box-sizing: border-box;
      justify-content: center;
    }

    &__content {
      padding: 15px;

      img {
        width: 100%;
        height: 145px;
        margin-bottom: 10px;
        object-fit: scale-down;
      }

      p {
        padding: 6px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 500;
        font-size: 14px;
        color: rgba(45, 48, 59, 1);
      }
    }

    &__operate {
      padding: 2px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .danger {
        color: #f56c6c;
      }
    }
  }
}
</style>
