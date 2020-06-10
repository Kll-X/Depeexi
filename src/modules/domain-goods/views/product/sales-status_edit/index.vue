<template>
  <div v-loading="baseInfoLoading" class="sales-status-edit">
    <div class="cards-container">
      <form-card>
        <el-form-renderer
          ref="formRender"
          :content="form"
          class="base-info"
          label-width="130px"
        ></el-form-renderer>
      </form-card>
    </div>
    <div class="buttons_group">
      <el-button @click="$router.back()">取消</el-button>
      <el-button :loading="saveLoading" type="primary" @click="saveFrom"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
import FormCard from '^domain-goods/components/form-card'
import {STATUS_OPTIONS__SHELVES_EDIT} from '^domain-goods/const/dictionary.js'
import {
  getCommodityShelves,
  putCommodityShelves,
} from '^domain-goods/services/commodity-center.js'

export default {
  name: 'SalesStatusEdit',
  components: {
    FormCard,
  },
  data() {
    return {
      form: [
        {
          $id: 'cannelName',
          $type: 'input',
          label: '渠道名称',
          $el: {
            disabled: true,
            placeholder: '请输入',
            maxlength: 32,
          },
        },
        {
          $id: 'shopName',
          $type: 'input',
          label: '店铺名称',
          $el: {
            disabled: true,
            placeholder: '请输入',
            maxlength: 32,
          },
        },
        {
          $id: 'systemGoodCode',
          $type: 'input',
          label: '系统商品编码',
          $el: {
            disabled: true,
            placeholder: '请输入',
            maxlength: 32,
          },
        },

        {
          $id: 'systemGoodName',
          $type: 'input',
          label: '系统商品名称',
          $el: {
            disabled: true,
            placeholder: '请输入',
            maxlength: 32,
          },
        },
        {
          $id: 'systemGoodSKU',
          $type: 'input',
          label: '系统商品SKU编码',
          $el: {
            disabled: true,
            placeholder: '请输入',
            maxlength: 32,
          },
        },
        {
          $id: 'cannelGoodCode',
          $type: 'input',
          label: '渠道商品编码',
          $el: {
            disabled: true,
            placeholder: '请输入',
            maxlength: 32,
          },
        },
        {
          $id: 'cannelGoodName',
          $type: 'input',
          label: '渠道商品名称',
          $el: {
            disabled: true,
            placeholder: '请输入',
            maxlength: 32,
          },
        },
        {
          $id: 'cannelGoodSKU',
          $type: 'input',
          label: '渠道商品SKU编码',
          $el: {
            disabled: true,
            placeholder: '请输入',
            maxlength: 32,
          },
        },
        {
          $id: 'status',
          $type: 'radio-group',
          label: '上下架状态',
          options: STATUS_OPTIONS__SHELVES_EDIT,
        },
      ],
      saveLoading: false,
      baseInfoLoading: true,
      skuInfo: {},
    }
  },
  computed: {
    getId() {
      return this.$route.params.id
    },
  },
  created() {
    this.getData()
  },
  methods: {
    saveFrom() {
      const data = this.$refs.formRender.getFormValue()
      this.saveLoading = true
      putCommodityShelves({
        id: this.getId,
        itemId: this.skuInfo.itemId,
        ...data,
      })
        .then(res => {
          this.$message.success(`保存成功`)
          this.$router.back()
        })
        .catch(() => {})
        .finally(() => {
          this.saveLoading = false
        })
    },
    transformData(data) {
      const res = {}
      const {itemWholeDTO = {}, skuDTO = {}, updatedTime, status} = data
      res.cannelName = '渠道名称'
      res.shopName = '店铺名称'
      res.systemGoodCode = itemWholeDTO.code
      res.systemGoodName = itemWholeDTO.name
      res.systemGoodSKU = (skuDTO && skuDTO.code) || '无'
      res.cannelGoodCode = '渠道商品编码'
      res.cannelGoodName = '渠道商品名称'
      res.cannelGoodSKU = '渠道商品SKU编码'
      res.status = status
      res.shopId = Number((Math.random() * 10000000000000).toFixed(0))
      res.channelId = Number((Math.random() * 10000000000000).toFixed(0))
      res.priceSystemId = Number((Math.random() * 10000000000000).toFixed(0))
      // res.updatedTime = dayjs(updatedTime).format('YYYY-MM-DD HH:mm:ss')
      return res
    },
    getData() {
      this.baseInfoLoading = true
      getCommodityShelves({id: this.getId})
        .then(res => {
          this.skuInfo = res.payload
          const data = this.transformData(res.payload)
          this.$refs.formRender.value = {...data}
          // this.$refs.formRender.updateForm(res)
        })
        .catch(() => {})
        .finally(() => {
          this.baseInfoLoading = false
        })
    },
  },
}
</script>
<style lang="less" scoped>
@import '~^domain-goods/styles/var.less';

.sales-status-edit {
  height: 100%;
  padding-bottom: 60px;

  .cards-container {
    min-height: calc(100% - 60px);

    .base-info {
      width: calc(460px + 130px);
    }
  }

  .buttons_group {
    height: 36px;
    width: 100%;
    position: absolute;
    bottom: 0;
    padding: 12px 0;
    text-align: center;
    background: @color__buttons-group-bg;
  }
}
</style>
