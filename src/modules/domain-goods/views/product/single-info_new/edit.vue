<template>
  <div v-loading="detailLoading" class="commodity-detail-container" @click="judgeCategory">
    <template v-if="activeIndex === 1">
      <div class="content">
        <!-- 基础信息 -->
        <basic-info
          ref="basicInfo"
          :category-name="(categoryItem && categoryItem.name) || ''"
          :disabled="disabled"
          :property-list="keyPropertyList"
          :brand-list="brandList"
          @select-category-click="dialogVisible = true"
        />
        <!-- 商品销售属性 -->
        <sale-properties
          v-loading="skuInfoLoading"
          ref="saleProperties"
          :disabled="disabled"
          :property-list="salesPropertyList"
          v-show="!disabled"
        ></sale-properties>
        <!-- 非关键属性 -->
        <other-properties
          ref="otherProperties"
          :disabled="disabled"
          :property-list="noKeyPropertyList"
          v-show="!disabled"
        ></other-properties>
        <!-- 详情 -->
        <detail-info ref="detailInfo" :disabled="disabled" v-show="!disabled" />
      </div>
      <!-- 保存按钮组 -->
      <div class="buttons-group footer-btns">
        <el-button class="cancel-btn" @click="$router.back()">取消</el-button>
        <el-button
          :disabled="disabled"
          :loading="confirmButtonLoading"
          class="save-btn"
          type="primary"
          @click="addNewCommodity"
        >{{ path === 'new' ? '提交' : '保存' }}</el-button>
      </div>
    </template>
    <!-- 添加成功页面 -->
    <add-commodity-success v-else-if="activeIndex === 2" @handle-continue="handleContinueAdd" />
    <!-- 选择类目弹窗 -->
    <el-dialog class="selectCategoryDialog" :visible.sync="dialogVisible" title="选择商品所属类目">
      <select-category
        v-loading="categoryLoading"
        :data="categoryTree"
        :default-item="categoryItem"
        v-model="target"
        :dialog-visible="dialogVisible"
        @select="setNameList"
        @change="categoryChange"
      ></select-category>
      <div slot="footer" class="buttons-group dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button
          :disabled="!confirmFlag"
          :loading="confirmButtonLoading"
          type="primary"
          @click="confirm"
        >提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import BasicInfo from './components/form/basic-info'
import DetailInfo from './components/form/detail-info'
import SaleProperties from './components/form/sale-properties'
import otherProperties from './components/form/other-properties'
import selectCategory from './components/select-category'
import AddCommoditySuccess from './components/add-commodity-success'
import {
  getCommodityGoods,
  getbackCategoryPropertyRelation,
  postCommodityGoods,
  putCommodityGoods,
  getBackCategorysTree,
  getBrandList,
} from '^domain-goods/services/commodity-center.js'
import {treeToArray, arrayToTree} from '^domain-goods/const/tree-utils'
import {addProps} from '^domain-goods/const/utils.js'

export default {
  components: {
    BasicInfo,
    DetailInfo,
    SaleProperties,
    otherProperties,
    selectCategory,
    AddCommoditySuccess,
  },
  data() {
    return {
      goodData: null, // 商品信息
      categoryId: null, //
      categoryItem: null, // 类目对象
      commodityDetail: null, // 商品详情信息
      categoryTree: [], // 类目树
      categoryList: [], // 类目列表
      propertyList: [], // 属性列表
      keyPropertyList: [], // 关键属性列表
      noKeyPropertyList: [], // 非关键属性列表
      salesPropertyList: [], // 销售商品规格
      dialogVisible: false,
      confirmButtonLoading: false,
      target: [], // 选择的节点id列表
      confirmFlag: false,
      categoryLoading: false,
      activeIndex: 1,
      detailLoading: false,
      brandList: [],
      skuInfoLoading: false,
    }
  },
  computed: {
    commodityId() {
      return this.$route.params.id
    },
    path() {
      return this.$route.name.split('-')[2]
    },
    userInfo() {
      const {tenantId, appId} = this.$store.state.user
      return {
        tenantId,
        appId,
      }
    },
    disabled() {
      return !this.categoryItem
    },
    is_changeCategory() {
      if (!this.goodData) return false
      return !(
        this.goodData &&
        this.goodData.itemWhole &&
        this.goodData.itemWhole.categoryId === this.categoryId
      )
    },
  },
  watch: {
    categoryId(val, oldVal) {
      this.categoryItem = this.categoryList.find(v => v.id === val) || null
      if (!val) return
      if (val !== oldVal) {
        this.fetchPropertyTree()
        // 切换类目时，重置sku表单
        oldVal &&
          this.$refs.saleProperties &&
          this.$refs.saleProperties.resetFormValue()
      }
    },
  },
  async created() {
    // 请求商品详情
    // todo 可以使用promise.all
    this.detailLoading = true
    // 查询品牌列表
    getBrandList({size: 999, page: 1}).then(({payload}) => {
      const {content = []} = payload
      const brandList = content.map(item => {
        return {
          value: item.id,
          label: item.chineseName,
        }
      })
      this.brandList = brandList
    })
    await this.getCategoryList()
    this.detailLoading = false
    if (this.commodityId) {
      this.detailLoading = true
      // this.path === 'detail' && (this.disabled = true)
      await this.getCommodityDetail()
      this.detailLoading = false
    }
  },
  methods: {
    judgeCategory() {
      // 点击时对是否选择类目进行验证
      this.$refs.basicInfo && this.$refs.basicInfo.validateCategory()
    },
    handleContinueAdd() {
      // 跳转继续页面
      this.activeIndex = 1
    },
    categoryChange() {
      // 选择发生变化,非叶子或第三级禁止确定,
      this.confirmFlag = false
    },
    setNameList(payload) {
      // 是否可以确定,选择叶子或者第三级
      this.confirmFlag = true
    },
    confirm() {
      this.categoryId = this.target.slice(-1)[0] || null
      this.dialogVisible = false
    },
    getCommodityDetail() {
      return getCommodityGoods({id: this.commodityId, size: 1}).then(res => {
        const {payload, code} = res
        if (payload && code) {
          this.commodityDetail = payload[0]
          const {itemWhole, sku} = payload[0]
          this.categoryId = itemWhole.categoryId
          this.goodData = payload[0]
          // 将对应的form设值
          const {
            code,
            name,
            brandId,
            subName,
            itemProperty,
            itemDetail,
          } = itemWhole
          const basicValue = {code, name, brandId, subName, itemProperty}
          const detailValue = {itemDetail}
          this.$refs.otherProperties.setFormValue(itemProperty)
          this.$refs.basicInfo.setFormValue(basicValue)
          this.$refs.detailInfo.setFormValue(detailValue)
          this.$refs.saleProperties.setFormValue(sku)
        }
      })
    },

    // 新建商品
    async addNewCommodity() {
      // 编辑时走编辑方法
      if (this.path === 'edit') {
        this.editHandle()
        return
      }
      // 否则进行新增
      // 获取组件中的数据
      const basicInfoValue = await this.$refs.basicInfo.getFormValue()
      const salePropertiesValue = await this.$refs.saleProperties.getFormValue()
      let otherPropertiesValue = await this.$refs.otherProperties.getFormValue()
      const detailInfoValue = await this.$refs.detailInfo.getFormValue()

      if (
        basicInfoValue &&
        detailInfoValue &&
        salePropertiesValue &&
        otherPropertiesValue
      ) {
        const {
          code,
          name,
          brandId,
          subName,
          goodsPropertyValue = [],
        } = basicInfoValue // 编码,标题,副标题, 品牌id，关键属性

        const itemDetail = detailInfoValue.itemDetail // 详情
        const keyPropertyList = goodsPropertyValue || [] // 关键属性
        otherPropertiesValue = otherPropertiesValue || [] // 其他属性
        // 主图
        const majorPictureItem = itemDetail.find(
          item => item.terminalType === 0,
        )
        const majorPicture = majorPictureItem && majorPictureItem.picture
        const itemProperty = [...keyPropertyList, ...otherPropertiesValue]
        const itemWhole = {
          code,
          name,
          brandId,
          subName,
          itemDetail,
          itemProperty,
          status: 0, // 未审核状态
          categoryId: this.categoryId, // 类目id
          majorPicture,
        }

        // sku列表添加所对应itemid
        const sku = salePropertiesValue.tableData.map(v => {
          return {
            ...v,
            itemId: this.commodityId,
          }
        })

        const params = {itemWhole, sku}
        this.confirmButtonLoading = true
        addProps(params, this.userInfo, ['createdTime', 'updatedTime']) // 每一个对象添加上appid和tenantId,去除时间

        postCommodityGoods(params)
          .then(() => {
            this.$emit('handle-next')
            this.$message.success('新增成功')
            this.clearFormValue()
            this.activeIndex = 2 // 跳转成功页
            this.categoryId = null
            this.target = []
            // 清空数据
          })
          .finally(() => {
            this.confirmButtonLoading = false
          })
      } else {
        this.$notify.error('请填写完整信息')
      }
    },

    // 编辑商品
    async editHandle() {
      // 获取组件中的数据
      const basicInfoValue = await this.$refs.basicInfo.getFormValue()
      const salePropertiesValue = await this.$refs.saleProperties.getFormValue()
      let otherPropertiesValue = await this.$refs.otherProperties.getFormValue()
      const detailInfoValue = await this.$refs.detailInfo.getFormValue()
      // 数据存在，则进行数据处理
      if (
        basicInfoValue &&
        detailInfoValue &&
        salePropertiesValue &&
        otherPropertiesValue
      ) {
        const {
          code, // 编码
          name, // 标题
          subName, // 副标题
          brandId, // 品牌id
          goodsPropertyValue = [], // 关键属性
        } = basicInfoValue
        let {
          itemDetail, //  详情，全部
          add: itemDetailAdd, // 新增的详情
          del: itemDetailDel, // 删除的详情ids
          updated: itemDetailUpdated, // 修改的详情
        } = detailInfoValue

        // 主图，默认为第一张图片
        const majorPictureItem = itemDetail.find(
          item => item.terminalType === 0,
        )
        const majorPicture = majorPictureItem && majorPictureItem.picture

        const keyPropertyList = goodsPropertyValue || [] //关键属性

        otherPropertiesValue = otherPropertiesValue || [] // 其他属性

        let itemPropertyUpdated = [] // 属性更新
        let itemPropertyAdd = [] // 属性增加
        let itemPropertyIdsDel = [] // 属性删除
        // 正在编辑商品资料中已存在的属性id列表
        const existPropertiesIdList =
          (this.goodData &&
            this.goodData.itemWhole &&
            this.goodData.itemWhole.itemProperty &&
            this.goodData.itemWhole.itemProperty.map(item => item.id)) ||
          []
        // this.is_changeCategory; true '新增并删除旧类目属性' false '修改类目属性'
        if (this.is_changeCategory) {
          itemPropertyAdd = [...keyPropertyList, ...otherPropertiesValue]
          itemPropertyIdsDel = existPropertiesIdList
        } else {
          // 属性更名
          ;[...keyPropertyList, ...otherPropertiesValue].forEach(item => {
            // 已存在属性
            if (item.id) {
              // 修改
              if (existPropertiesIdList.includes(item.id)) {
                itemPropertyUpdated.push({
                  ...item,
                  itemPropertyValueUpdate: item.itemPropertyValue,
                })
                return
              }
            }
            // 新增
            itemPropertyAdd.push({
              ...item,
            })
          })
          // 删除, 已存在id但是没有被更新的属性
          const itemPropertyUpdatedIds = itemPropertyUpdated.map(
            item => item.id,
          )
          itemPropertyIdsDel = existPropertiesIdList.filter(item => {
            return !itemPropertyUpdatedIds.includes(item)
          })
        }

        // 删掉改了名的属性
        delete itemPropertyUpdated.itemPropertyValue

        // 关键和非关键属性列表
        // 删关键属性
        const itemWholeBatchDelete = {
          itemPropertyIds: itemPropertyIdsDel,
          itemDetailIds: itemDetailDel,
        }
        // 增关键属性
        const itemWholeBatchAdd = {
          itemProperty: itemPropertyAdd,
          itemDetail: itemDetailAdd,
        }
        // 改关键属性
        const itemWholeBatchUpdate = {
          itemProperty: itemPropertyUpdated,
          itemDetail: itemDetailUpdated,
        }

        let itemWholeUpdate = {
          code,
          name,
          subName,
          brandId,
          itemWholeBatchDelete,
          itemWholeBatchAdd,
          itemWholeBatchUpdate,
          status: 0, // 未审核状态
          categoryId: this.categoryId, // 当前类目id
        }
        // 有改动才更新主图
        if (
          this.goodData &&
          this.goodData.itemWhole &&
          this.goodData.itemWhole &&
          this.goodData.itemWhole.majorPicture &&
          this.goodData.itemWhole.majorPicture !== majorPicture
        ) {
          itemWholeUpdate.majorPicture = majorPicture
        }

        let {del: skuDelete, add: skuUpdateAdd, updated: skuUpdateUpdate} =
          salePropertiesValue || {}
        // sku列表对象增加所对应itemid
        const skuAdd = skuUpdateAdd.map(v => {
          return {
            ...v,
            itemId: this.commodityId,
          }
        })
        const skuUpdate = skuUpdateUpdate.map(v => {
          return {
            ...v,
            itemId: this.commodityId,
          }
        })

        const params = {
          id: this.commodityId,
          itemWholeUpdate,
          skuDelete,
          skuAdd,
          skuUpdate,
        }
        addProps(params, this.userInfo, ['createdTime', 'updatedTime']) // 每个对象添加上appId和tenantId,去除时间
        this.confirmButtonLoading = true
        putCommodityGoods(params)
          .then(() => {
            this.$emit('handle-next')
            this.$message.success('修改成功')
            this.$router.push({
              path: '/product/single-info',
            })
          })
          .finally(() => {
            this.confirmButtonLoading = false
          })
      } else {
        this.$notify.error('请填写完整信息')
      }
    },
    getCategoryList() {
      this.categoryLoading = true
      // parentId: 0,
      return getBackCategorysTree({typeCode: 1, enabled: true}) // typecode 1 后台类目， enabled 启用
        .then(({payload}) => {
          const arrayTree = treeToArray(
            payload,
            {
              parentId: null,
              level: 0,
              path: '',
              children: 'children',
            },
            true,
          )
          const emptyChildArr = arrayTree.map(info => {
            return {
              ...info,
              children: info.children && info.children.length > 0 ? [] : null,
            }
          })
          this.categoryList = emptyChildArr
          const treeArray = arrayToTree(emptyChildArr)
          // 将树扁平化，然后再构建树（如果是子节点，则不再显示children）
          this.categoryTree = treeArray
        })
        .catch(() => {})
        .finally(() => {
          this.categoryLoading = false
        })
    },
    // 清除数据
    clearFormValue() {
      this.$refs.basicInfo.resetFormValue()
      this.$refs.saleProperties.resetFormValue()
      this.$refs.otherProperties.resetFormValue()
      this.$refs.detailInfo.resetFormValue()
      this.categoryId = null
    },
    // 请求属性列表树
    fetchPropertyTree() {
      // 该接口无分页
      this.skuInfoLoading = true
      getbackCategoryPropertyRelation({id: this.categoryId})
        .then(({payload}) => {
          // 将树扁平化
          const propertyList = treeToArray(
            payload || [],
            {parentId: 'parentId', level: 0, children: 'children'},
            true,
          )
          this.propertyList = propertyList
          // 设置关键属性列表
          this.$set(
            this,
            'keyPropertyList',
            propertyList.filter(
              info =>
                info.propertyTypes && info.propertyTypes.toString() === '1',
            ),
          )
          // 设置非关键属性列表
          this.$set(
            this,
            'noKeyPropertyList',
            propertyList.filter(
              info =>
                info.propertyTypes && info.propertyTypes.toString() === '3',
            ),
          )
          // 设置销售属性列表

          this.$set(
            this,
            'salesPropertyList',
            propertyList.filter(
              info =>
                info.propertyTypes && info.propertyTypes.toString() === '2',
            ),
          )
        })
        .finally(() => {
          this.skuInfoLoading = false
        })
    },
  },
}
</script>

<style lang="less">
.commodity-detail-container {
  height: 100%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  .content {
    min-height: calc(100% - 60px);
    background: #fff;
  }
  .foot-container {
    padding: 20px 0;
    display: flex;
    justify-content: center;
    position: relative;
  }

  .buttons-group {
    text-align: center;
    background: #f4f6fa;
    height: 36px;
    padding: 12px 0;

    &.dialog-footer {
      text-align: right;
      height: auto;
      padding: 10px 20px;
      margin: -10px -20px -20px;
    }

    &.footer-btns {
      // position: absolute;
      width: 100%;
      bottom: 0;
    }
  }
  .selectCategoryDialog {
    .el-dialog {
      width: 50%;
      max-width: 792px;
      min-width: 680px;
    }
  }
}
</style>