<template>
  <el-dialog :visible="visible" title="批量导入商品信息" @close="onDialogClose">
    <div v-show="importedData.length === 0" class="import-data">
      <div
        class="upload-area"
        @click="handleImportExcel"
        @drop="onUploadAreaDrop"
        @dragover="onUploadAreaDragOver"
      >
        <img class="upload-area-icon" src="./images/excel.svg" />
        <div class="upload-area-title">上传 excel 商品信息表</div>
        <div class="el-upload__text">
          将文件拖到此处，或
          <el-button type="text" class="btn-click">点击上传</el-button>
        </div>
      </div>

      <div class="import-data-tip">
        如果没有excel商品信息导入模板，请先
        <el-button type="text" @click="handleDownloadTemplate" class="btn-click">下载</el-button>
      </div>
    </div>

    <div v-show="importedData.length" class="imported-page">
      <el-button type="primary" @click="handleImportExcel">重新导入</el-button>

      <div class="imported-counter">
        当前已经导入
        <el-button type="text">{{ importedData.length }}</el-button>
        <span>条数据</span>
      </div>

      <el-data-table ref="table" v-bind="tableConfig" :columns="columns">
        <el-table-column width="40" prop="status" label>
          <template slot-scope="scope">
            <svg-icon v-show="(scope.row.status !== undefined) && scope.row.status" icon-class="anniu-queding" />
            <svg-icon v-show="(scope.row.status !== undefined) && !scope.row.status" icon-class="anniu-quxiao" />
          </template>
        </el-table-column>
      </el-data-table>

      <div slot="footer" style="text-align: right; margin-top: 20px;">
        <el-button @click="$emit('close-dialog')">取消</el-button>
        <el-button :loading="confirmButtonLoading" type="primary" @click="handleSubmit">确定</el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import {importExcel, parseExcel, exportExcel} from '@femessage/excel-it'
import {importTemplateColumns} from '^domain-goods/const/export-goods-template-columns'
import {getSkuItem} from '^domain-goods/services/commodity-center.js'

const ArrayToObject = (data, target) => {
  const res = {}
  for (const item of data) {
    res[item[target]] = item
  }
  return res
}

export default {
  name: 'ImportDialog',
  //   inject: ['accountInfo'],

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    tableData: {
      type: Array,
      default() {
        return []
      },
    },
    columns: {
      type: Array,
      default() {
        return [
          // {
          //   prop: 'systemGoodCode',
          //   label: '系统商品编码',
          // },
          // {
          //   prop: 'systemGoodName',
          //   label: '系统商品名称',
          // },
          {
            prop: 'systemGoodSKU',
            label: '系统商品SKU编码',
          },
          // {
          //   prop: 'cannelName',
          //   label: '渠道名称',
          // },
          // {
          //   prop: 'shopName',
          //   label: '店铺名称',
          // },
          {
            prop: 'shopCode',
            label: '店铺编码',
          },
          {
            prop: 'cannelGoodCode',
            label: '渠道商品编码',
          },
          {
            prop: 'cannelGoodName',
            label: '渠道商品名称',
          },
          {
            prop: 'cannelGoodSKU',
            label: '渠道商品SKU编码',
          },
        ]
      },
    },
  },

  data() {
    return {
      confirmButtonLoading: false,
      importedData: [],
      tableConfig: {
        hasPagination: false,
        hasNew: false,
        hasEdit: false,
        hasDelete: false,
        extraButtons: [
          {
            text: '移除',
            atClick: row => {
              this.importedData.splice(
                this.importedData.findIndex(item => item.phone === row.phone),
                1,
              )
              return Promise.reject()
            },
          },
        ],
      },
    }
  },

  watch: {
    importedData(data) {
      this.$refs.table.data = data
    },
  },

  methods: {
    // 导入数据
    handleImportExcel() {
      importExcel([], data => {
        const excelData = data[0].data
        const transformedData = this.transformMethod(excelData)
        this.importedData = transformedData
        if (transformedData.length === 0) {
          this.$message.warning('导入的数据为空')
        }
      })
    },

    transformMethod(excelData) {
      return excelData.map(item => {
        const obj = {}

        Object.keys(importTemplateColumns).forEach(k => {
          obj[k] = item[importTemplateColumns[k]]
        })

        return obj
      })
    },

    // 下载模板
    handleDownloadTemplate() {
      exportExcel({
        columns: Object.keys(importTemplateColumns).map(k => ({
          prop: k,
          label: importTemplateColumns[k],
        })),
        fileName: '批量导入商品信息模板',
      })
    },
    dataFormatter(val) {
      const newData = val.map(item => {
        return {
          // ...item, // 整个sku
          systemGoodName: item.itemWhole && item.itemWhole.name,
          systemGoodCode: item.itemWhole && item.itemWhole.code,
          systemGoodSKU: item.sku && item.sku.code,
          price: item.sku && item.sku.price,
          skuId: item.sku && item.sku.id,
          // skuId: null,
          itemId: item.itemWhole && item.itemWhole.id,
          // todo 需要根据店铺编码查询,暂时写死
          // shopCode: '10086',
          cannelName: 0,
          shopName: 0,
        }
      })
      return newData
    },

    handleSubmit() {
      this.confirmButtonLoading = true
      const skuCodes = this.importedData.map(item => item.systemGoodSKU)
      const shopCodes = this.importedData.map(item => 1)
      // let errArr = []
      // const list = this.tableData.map(item => item.systemGoodSKU)
      // list.forEach(item => {
      //   if (!skuCodes.includes(item)) errArr.push(item)
      // })
      getSkuItem({codes: skuCodes.toString(), shopCodes: shopCodes.toString()})
        .then(({payload}) => {
          // 通过skucode查询到的商品skuitem
          let {content} = payload

          // 导入数据数组
          if (!content) {
            // this.$message.error('导入失败，使用了不存在的sku编码或店铺编码')
            // return
            content = []
          }
          const getIds = content.map(item => item.sku && item.sku.id) // 查找到的skuid列表
          let importData = this.importedData.slice(0) //
          const importDataIds = importData.map(item => item.systemGoodSKU) // 导入数据skuid列表
          const errIds = importDataIds.filter(item => {
            // 错误的skuid列表
            return !getIds.includes(item)
          })
          if (importDataIds.length > getIds.length) {
            this.$message.error('导入失败，数据使用了不存在的sku编码或店铺编码')
            this.importedData = importData.map(item => {
              let status = true
              if (errIds.includes(item.systemGoodSKU)) {
                status = false
              }
              return {
                ...item,
                status,
              }
            })
            return
          }
          // 转化为对象，skucode作为索引
          const data = ArrayToObject(importData, 'systemGoodSKU')

          // 转换成数据对象， 添加导入数据
          const dataFormatter = this.dataFormatter(content).map(item => {
            let res = item
            if (data[item.systemGoodSKU]) {
              res = {...item, ...data[item.systemGoodSKU]}
            }
            return res
          })
          // .filter(item => item.itemId && item.skuId)
          // console.log(dataFormatter, 'dataFormatter');
          this.$message.success('导入成功')
          this.$emit('handle-confirm', dataFormatter)
          this.$emit('close-dialog')
        })
        .finally(() => {
          this.confirmButtonLoading = false
        })
    },

    onDialogClose() {
      this.importedData.length = 0
      this.$emit('close-dialog')
    },

    onUploadAreaDrop(e) {
      e.preventDefault()
      parseExcel(e.dataTransfer.files[0], [], data => {
        const excelData = data[0].data
        this.importedData = this.transformMethod(excelData)
      })
    },

    onUploadAreaDragOver: e => e.preventDefault(),
  },
}
</script>

<style lang="less" scoped>
@import '~^domain-goods/styles/var.less';

.import-data {
  text-align: center;
}

.icon-success {
  color: @color__success;
}

.icon-error {
  color: @color__danger;
}

.imported-page {
  .imported-counter {
    margin: 10px 0;
  }
}

.upload-area {
  border-radius: 4px;
  border: dashed #ccc 1px;
  padding: 20px 0;

  .upload-area-icon {
    width: 20px;
  }

  .upload-area-title {
    font-weight: bold;
  }

  .el-upload__text{
    font-size: 12px;
  }

  &:hover {
    cursor: pointer;
    background-color: rgb(244, 248, 255);
  }
}

.import-data-tip{
  font-size: 12px;
}

.btn-click{
  font-size: 12px;
}
</style>
