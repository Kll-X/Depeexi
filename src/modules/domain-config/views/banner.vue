<template>
  <div class="banner">
    <p style="padding:20px 0 0 30px;">
      <el-button
        class="common-operate-btn"
        size="mini"
        type="primary"
        @click="form.isShow = true"
      >新增</el-button>
    </p>

    <div class="card">
      <div class="card-item__wrap" v-for="item in cardData" :key="item.id">
        <el-card class="card-item">
          <div class="card-item__content">
            <img :src="item.imageUrl" />
            <p>{{ item.title }}</p>
          </div>

          <div class="card-item__operate">
            <el-switch v-model="item.isUse" @change="onChangeStatus(item)"></el-switch>
            <label>
              <el-button type="text" class="button" @click="setBanner(item)">设置</el-button>
              <el-button v-if="!item.isUse" type="text" class="danger" @click="onDelete(item)">删除</el-button>
            </label>
          </div>
        </el-card>
      </div>
    </div>

    <p v-show="cardData.length == 0" class="card--empty">暂无数据</p>

    <el-drawer
      v-if="form.isShow"
      :visible.sync="form.isShow"
      :title="currentBannerData.id ? '编辑' : '新增'"
      direction="rtl"
      size="650px"
      @close="resetData"
    >
      <div class="drawer-content">
        <el-form-renderer ref="form" :content="formContent" label-width="120px">
          <el-form-item label="链接">
            <el-radio-group v-model="extraData.linkType">
              <el-radio :label="0">无</el-radio>
              <el-radio :label="1">关联商品</el-radio>
              <el-radio :label="2">自定义地址</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="extraData.linkType == 1">
            <el-tag v-show="selectGoods.name" class="selectd-goods">
              {{
              selectGoods.name
              }}
            </el-tag>
            <el-button @click="goodsDialogData.isShow = true">选择</el-button>
          </el-form-item>
          <el-form-item v-if="extraData.linkType == 2">
            <el-input v-model="extraData.linkUrl" placeholder="请输入地址"></el-input>
          </el-form-item>
        </el-form-renderer>
        <operate-row>
          <el-button @click="form.isShow = false">取 消</el-button>
          <el-button :loading="form.loading" type="primary" @click="saveForm">确 定</el-button>
        </operate-row>
      </div>
    </el-drawer>

    <el-dialog
      v-if="goodsDialogData.isShow"
      :visible.sync="goodsDialogData.isShow"
      width="700px"
      title="选择商品"
    >
      <el-data-table ref="goodsTable" v-bind="goodsTableConfig"></el-data-table>
      <span slot="footer">
        <el-button @click="goodsDialogData.isShow = false">取 消</el-button>
        <el-button type="primary" @click="choseGoods">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import OperateRow from '../components/operate-row'
import UploadToAli from '@femessage/upload-to-ali'
import {
  goodsListUrl,
  newBanner,
  getBanners,
  deleteBanner,
  editBanner,
  getSingleGoods,
} from '../services/banner'

export default {
  components: {
    OperateRow,
  },
  data() {
    return {
      extraData: {
        linkType: 0,
        linkUrl: '',
      },
      currentBannerData: {},
      form: {
        isShow: false,
        loading: false,
      },
      formContent: [
        {
          $id: 'title',
          $attrs: {},
          $el: {
            placeholder: '请输入标题',
          },
          $type: 'input',
          label: '标题',
          rules: [
            {
              required: true,
              message: '请输入标题',
              trigger: ['blur', 'change'],
            },
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
      goodsDialogData: {
        isShow: false,
        loading: false,
        table: [],
      },
      cardData: [],
      goodsTableConfig: {
        dataPath: 'payload.content',
        totalPath: 'payload.totalElements',
        url: goodsListUrl,
        hasNew: false,
        hasOperation: false,
        hasDelete: false,
        columns: [
          {
            label: '选择',
            formatter: ({id, itemWholeDTO}) => {
              itemWholeDTO.id = id
              return (
                <el-radio v-model={this.selectGoods} label={itemWholeDTO}>
                  {'  '}
                </el-radio>
              )
            },
          },
          {
            prop: 'name',
            label: '商品名称',
            formatter: ({itemWholeDTO}) => {
              return itemWholeDTO.name
            },
          },
          {
            prop: 'code',
            label: '商品编码',
            formatter: ({itemWholeDTO}) => {
              return itemWholeDTO.code
            },
          },
        ],
        searchForm: [
          {
            el: {placeholder: '请输入商品名称', clearable: true},
            label: '商品名称',
            id: 'name',
            type: 'input',
          },
        ],
        paginationLayout: 'total, sizes, prev, pager, next',
      },
      selectGoods: {},
    }
  },
  watch: {
    'form.isShow'(show) {
      !show && this.resetData()
    },
  },
  mounted() {
    this.fetchList()
  },
  methods: {
    resetIframe() {
      this.$parent.iframeQuery = Date.now()
      this.$parent.iframeLoading = true
    },
    resetData() {
      this.currentBannerData = {}
      this.extraData = {
        linkType: 0,
        linkUrl: '',
      }
    },
    fetchList() {
      this.resetIframe()
      getBanners().then(res => {
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
          deleteBanner(id).then(res => {
            this.$message.success('删除成功')
            this.fetchList()
          })
        })
        .catch(() => {})
    },
    onChangeStatus(item) {
      const status = item.isUse ? '1' : '0'

      editBanner(item.id, {
        status,
      }).then(() => {
        this.$message.success('保存成功')
        this.fetchList()
      })
    },
    async setBanner(data) {
      this.currentBannerData = Object.assign({}, data)
      this.form.isShow = true
      if (data.linkType == 1) {
        try {
          let res = await getSingleGoods(data.linkUrl)
          res = res.payload || {}
          res.itemWholeDTO.id = res.id
          this.selectGoods = res.itemWholeDTO
        } catch (e) {
          this.$message.error('查询商品失败')
        }
      }

      await this.$nextTick()
      this.$refs.form.updateForm(data)
      this.extraData = {
        linkType: data.linkType,
        linkUrl: data.linkUrl,
      }
    },
    choseGoods() {
      this.goodsDialogData.isShow = false
    },
    saveForm() {
      const form = this.$refs.form
      const data = form.getFormValue()
      const linkType = this.extraData.linkType
      const linkUrl =
        linkType == 1
          ? this.selectGoods.id
          : linkType == 2
          ? this.extraData.linkUrl
          : ''

      const params = {
        ...data,
        linkType,
        linkUrl,
      }
      form.validate(valid => {
        if (!valid) return
        let id = this.currentBannerData.id
        let request = id ? editBanner(id, params) : newBanner(params)

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
.banner {
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

.selectd-goods {
  margin-right: 15px;
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
    border-radius: 10px;

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
        font-weight: 500;
        font-size: 14px;
        color: rgba(45, 48, 59, 1);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
