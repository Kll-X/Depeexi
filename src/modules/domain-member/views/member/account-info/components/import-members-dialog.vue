<template>
  <el-dialog :visible="visible" title="批量导入会员" @close="onDialogClose">
    <div v-show="importedData.length === 0" class="import-data">
      <div
        class="upload-area"
        @click="handleImportExcel"
        @drop="onUploadAreaDrop"
        @dragover="onUploadAreaDragOver"
      >
        <img class="upload-area-icon" src="../images/excel.svg" />
        <div class="upload-area-title">上传 excel 会员表</div>
        <div class="el-upload__text drop-tip">
          将文件拖到此处，或
          <el-button type="text" size="mini">点击上传</el-button>
        </div>
      </div>

      <div class="import-data-tip">
        如果没有excel会员导入模板，请先<el-button
          type="text"
          size="mini"
          @click="handleDownloadTemplate"
          >下载</el-button
        >
      </div>
    </div>

    <div v-show="importedData.length" class="imported-page">
      <el-button type="primary" @click="handleImportExcel">
        重新导入
      </el-button>

      <div class="imported-counter">
        当前已经导入
        <el-button type="text">{{ importedData.length }}</el-button>
        条数据
      </div>

      <el-data-table
        ref="table"
        v-bind="tableConfig"
        :columns="tableConfig.columns"
      />

      <div slot="footer" style="text-align: right; margin-top: 20px;">
        <el-button @click="$emit('close-dialog')">取消</el-button>
        <el-button type="primary" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import StateTag from '^domain-member/components/state-tag'
import {ENABLE_OPTIONS, ENABLE, DISABLE} from '^domain-member/const/const'
import {importExcel, exportExcel, parseExcel} from '@femessage/excel-it'
import {templateLite as templateColumns} from '^domain-member/const/export-member-template-columns'
import {importMembers} from '^domain-member/services/deepexi-system-digital-retail'
import {phonePattern} from '@/const/pattern'

export default {
  name: 'ImportMembersDialog',

  components: {
    StateTag,
  },

  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      importedData: [],
      tableConfig: {
        hasPagination: false,
        hasNew: false,
        hasEdit: false,
        hasDelete: false,
        columns: [
          {
            prop: 'username',
            label: '会员账号',
            minWidth: 150,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'nickName',
            label: '会员昵称',
            minWidth: 150,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'phone',
            label: '手机号码',
            minWidth: 150,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'status',
            label: '状态',
            minWidth: 100,
            formatter: ({status}) => {
              if (status == null) return ''
              let type = 'success'
              if (!status) {
                type = 'danger'
              }
              const text = ENABLE_OPTIONS[status]
              return <state-tag type={type}>{text}</state-tag>
            },
          },
        ],
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
    // 赋值 excel 数据
    setImportedData(data) {
      this.importedData = validateData(data)
    },

    // 导入会员
    handleImportExcel() {
      importExcel([], data => {
        const excelData = data[0].data
        this.setImportedData(transformExcelData(excelData))
      })
    },

    // 下载模板
    handleDownloadTemplate() {
      exportExcel({
        columns: Object.keys(templateColumns).map(k => ({
          prop: k,
          label: templateColumns[k],
        })),
        fileName: '批量导入会员模板',
      })
    },

    handleSubmit() {
      importMembers(this.importedData).then(resp => {
        this.$message.success(resp.msg)
        this.$emit('close-dialog')
        this.$emit('import-success')
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
        this.setImportedData(transformExcelData(excelData))
      })
    },

    onUploadAreaDragOver: e => e.preventDefault(),
  },
}

function transformExcelData(excelData) {
  const transformedData = excelData.map(item => {
    const obj = {}

    Object.keys(templateColumns).forEach(k => {
      obj[k] = item[templateColumns[k]]
    })

    return obj
  })

  return transformedData
}

function validateData(data = []) {
  return data
    .map(val => {
      if (phonePattern.test(val.phone)) {
        return val
      }
    })
    .filter(Boolean)
}
</script>

<style lang="less" scoped>
.import-data {
  text-align: center;
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

  & .drop-tip,
  & .import-data-tip {
    font-size: 12px;
  }

  &:hover {
    cursor: pointer;
    background-color: rgb(244, 248, 255);
  }
}
</style>
