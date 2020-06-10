<template>
  <div class="select-goods">
    <div :class="{hidden: stepIndex !== 0}" class="button-groups">
      <el-button class="btn" type="primary" size="small" @click="selectBtnClick">选择商品</el-button>
      <el-button class="btn" size="small" @click="importDialogVisible = true">批量导入</el-button>
    </div>
    <el-form :model="$data" :rules="rules" ref="form" label-width="0px">
      <el-table
        row-class-name="table-row"
        :data="tableData"
        class="table-form-container"
        style="width: 100%;"
      >
        <template v-if="stepIndex === 1">
          <el-table-column
            key="inventoryRatio"
            min-width="140"
            :show-overflow-tooltip="true"
            prop="inventoryRatio"
            label="商品库存数量"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableData.' + scope.$index + '.inventoryRatio'"
                :rules="rules['inventoryRatio']"
              >
                <el-input :clearable="true" v-model.number="scope.row.inventoryRatio" placeholder="请输入"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <!-- <el-table-column
            key="automaticShelvesUp"
            min-width="140"
            :show-overflow-tooltip= "true"
            prop="automaticShelvesUp"
            label="自动上架"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableData.' + scope.$index + '.automaticShelvesUp'"
                :rules="rules['automaticShelvesUp']"
              >
                <el-select
                  :clearable="true"
                  v-model="scope.row.automaticShelvesUp"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            key="shelvesThresholdUp"
            min-width="140"
            :show-overflow-tooltip= "true"
            prop="shelvesThresholdUp"
            label="上架临界值"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableData.' + scope.$index + '.shelvesThresholdUp'"
                :rules="rules['shelvesThresholdUp']"
              >
                <el-input
                  :clearable="true"
                  v-model="scope.row.shelvesThresholdUp"
                  :disabled="!(scope.row.shelvesThresholdUp === 1)"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            key="automaticShelvesDown"
            min-width="140"
            :show-overflow-tooltip= "true"
            prop="automaticShelvesDown"
            label="自动下架"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableData.' + scope.$index + '.automaticShelvesDown'"
                :rules="rules['automaticShelvesDown']"
              >
                <el-select
                  :clearable="true"
                  v-model="scope.row.automaticShelvesDown"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in options"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column
            key="shelvesThresholdDown"
            min-width="140"
            :show-overflow-tooltip= "true"
            prop="shelvesThresholdDown"
            label="下架临界值"
          >
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableData.' + scope.$index + '.shelvesThresholdDown'"
                :rules="rules['shelvesThresholdDown']"
              >
                <el-input
                  :clearable="true"
                  v-model="scope.row.shelvesThresholdDown"
                  :disabled="!(scope.row.shelvesThresholdDown === 1)"
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>-->
        </template>

        <el-table-column
          key="systemGoodCode"
          min-width="140"
          :show-overflow-tooltip="true"
          prop="systemGoodCode"
          label="系统商品编码"
        ></el-table-column>
        <el-table-column
          key="systemGoodName"
          min-width="140"
          :show-overflow-tooltip="true"
          prop="systemGoodName"
          label="系统商品名称"
        ></el-table-column>
        <el-table-column
          key="systemGoodSKU"
          min-width="140"
          :show-overflow-tooltip="true"
          prop="systemGoodSKU"
          label="系统商品SKU编码"
        ></el-table-column>
        <el-table-column
          key="cannelName"
          min-width="140"
          :show-overflow-tooltip="true"
          prop="cannelName"
          label="渠道名称"
        >
          <template slot-scope="scope">
            <el-form-item
              v-show="stepIndex === 0"
              :prop="'tableData.' + scope.$index + '.cannelName'"
              :rules="rules['cannelName']"
            >
              <el-select :clearable="true" v-model="scope.row.cannelName" placeholder="请选择">
                <el-option
                  v-for="item in cannelOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <span v-show="!(stepIndex === 0)">
              {{
              cannelOptions[scope.row.cannelName] &&
              cannelOptions[scope.row.cannelName].label
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          key="shopName"
          min-width="140"
          :show-overflow-tooltip="true"
          prop="shopName"
          label="店铺名称"
        >
          <template slot-scope="scope">
            <el-form-item
              v-show="stepIndex === 0"
              :prop="'tableData.' + scope.$index + '.shopName'"
              :rules="rules['shopName']"
            >
              <el-select
                :disabled="scope.row.cannelName === 0"
                :clearable="true"
                v-model="scope.row.shopName"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in shopNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <span v-show="!(stepIndex === 0)">
              {{
              shopNameOptions[scope.row.shopName] &&
              shopNameOptions[scope.row.shopName].label
              }}
            </span>
          </template>
        </el-table-column>
        <!-- 暂时隐藏 -->
        <!-- <el-table-column key="cannelGoodCode" min-width="140" :show-overflow-tooltip= "true" prop="cannelGoodCode" label="渠道商品编码">
          <template slot-scope="scope">
            <el-form-item
              v-show="stepIndex === 0"
              :prop="'tableData.' + scope.$index + '.cannelGoodCode'"
              :rules="rules['cannelGoodCode']"
            >
              <el-input :clearable="true" v-model="scope.row.cannelGoodCode" placeholder="请输入"></el-input>
            </el-form-item>
            <span v-show="!(stepIndex === 0)">
              {{
              scope.row.cannelGoodCode
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column key="cannelGoodName" min-width="140" :show-overflow-tooltip= "true" prop="cannelGoodName" label="渠道商品名称">
          <template slot-scope="scope">
            <el-form-item
              v-show="stepIndex === 0"
              :prop="'tableData.' + scope.$index + '.cannelGoodName'"
              :rules="rules['cannelGoodName']"
            >
              <el-input :clearable="true" v-model="scope.row.cannelGoodName" placeholder="请输入"></el-input>
            </el-form-item>
            <span v-show="!(stepIndex === 0)">
              {{
              scope.row.cannelGoodName
              }}
            </span>
          </template>
        </el-table-column>
        <el-table-column key="cannelGoodSKU" min-width="140" :show-overflow-tooltip= "true" prop="cannelGoodSKU" label="渠道商品SKU编码">
          <template slot-scope="scope">
            <el-form-item
              v-show="stepIndex === 0"
              :prop="'tableData.' + scope.$index + '.cannelGoodSKU'"
              :rules="rules['cannelGoodSKU']"
            >
              <el-input :clearable="true" v-model="scope.row.cannelGoodSKU" placeholder="请输入"></el-input>
            </el-form-item>
            <span v-show="!(stepIndex === 0)">{{ scope.row.cannelGoodSKU }}</span>
          </template>
        </el-table-column>-->
        <!-- fixed="right"  -->
        <el-table-column v-if="stepIndex === 0" key="opearation" min-width="140" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              style="font-size:12px"
              @click.native.prevent="deleteRow(scope.$index, tableData)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form>

    <el-dialog ref="dialog" :visible.sync="dialogVisible" title="选择商品" width="840px">
      <select-goods :dialog-visible="dialogVisible" ref="selectGoods"></select-goods>
      <div slot="footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="saveData()">确认</el-button>
      </div>
    </el-dialog>
    <import-dialog
      :visible.sync="importDialogVisible"
      @handle-confirm="importExcel"
      @close-dialog="importDialogVisible = false"
      :tableData="tableData"
    ></import-dialog>
  </div>
</template>

<script>
import selectGoods from './container/select-goods'
import importDialog from './container/import-dialog'
import {numberPattern} from '^domain-goods/const/pattern'

export default {
  name: 'GoodConfiguration',
  components: {
    selectGoods,
    importDialog,
  },
  props: {
    stepIndex: {
      type: Number,
      default: 1,
    },
    reSet: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      importDialogVisible: false,
      tableData: [],
      rules: {
        cannelGoodSKU: [
          // {
          //   required: true,
          //   message: '请输入渠道商品SKU编码',
          //   trigger: ['blur', 'change'],
          // },
          {
            // min: 0,
            max: 32,
            message: '最长不得超过32个字符',
            trigger: ['blur', 'change'],
          },
        ],
        cannelGoodName: [
          // {
          //   required: true,
          //   message: '请输入渠道商品名称',
          //   trigger: ['blur', 'change'],
          // },
          {
            // min: 0,
            max: 32,
            message: '最长不得超过32个字符',
            trigger: ['blur', 'change'],
          },
        ],
        cannelGoodCode: [
          // {
          //   required: true,
          //   message: '请输入渠道商品编码',
          //   trigger: ['blur', 'change'],
          // },
          {
            // min: 0,
            max: 32,
            message: '最长不得超过32个字符',
            trigger: ['blur', 'change'],
          },
        ],
        shopName: [],
        cannelName: [
          {
            required: true,
            message: '请选择',
            trigger: ['blur', 'change'],
          },
        ],
        automaticShelvesDown: [],
        shelvesThresholdDown: [],
        automaticShelvesUp: [],
        shelvesThresholdUp: [],
        inventoryRatio: [
          {
            required: true,
            message: '请输入库存数量',
            trigger: ['blur', 'change'],
          },
          // {
          //   min: 0,
          //   max: 32,
          //   message: '最长不得超过32个字符',
          //   trigger: ['blur', 'change'],
          // },
          {
            pattern: numberPattern,
            message: '请输入数字',
            trigger: ['blur', 'change'],
          },
        ], // 商品库存
      },
      selected: [],
      dialogVisible: false,
      options: [
        {
          value: 1,
          label: '是',
        },
        {
          value: 0,
          label: '否',
        },
      ],
      //  渠道列表,目前写死
      cannelOptions: [
        {
          value: 0,
          label: '移动商城',
        },
        // {
        //   value: 1,
        //   label: '天猫',
        // },
      ],
      // 店铺列表,目前写死
      shopNameOptions: [
        {
          value: 1,
          label: '1号',
        },
        {
          value: 0,
          label: '2号',
        },
      ],
    }
  },
  watch: {
    // 添加更多时，进行重置弹窗内容
    reSet: {
      immediate: true,
      handler(val) {
        if (val) {
          this.clearSelected() // 清空选中数据
          this.tableData = []
          this.$refs.selectGoods && this.$refs.selectGoods.clearSelection()
          this.$emit('update:reSet', false)
        }
      },
    },
  },
  methods: {
    selectBtnClick() {
      this.$refs.selectGoods &&
        this.$refs.selectGoods.setSelected(this.tableData)
      this.dialogVisible = true
    },
    deleteRow(index, rows) {
      rows.splice(index, 1)
    },
    saveData() {
      // 保存tabledata中不存在的项
      const selected = this.$refs.selectGoods && this.$refs.selectGoods.selected
      this.tableData = [
        ...selected.map(item => {
          return {...item, cannelName: 0}
        }),
      ]
      this.$emit('change', this.tableData)
      this.dialogVisible = false
    },
    importExcel(payload) {
      // 数据转化
      this.tableData.push(...payload)
      this.$emit('change', this.tableData)
    },
    clearSelected() {
      this.selected = []
    },
  },
}
</script>
<style lang="less" scoped>
.select-goods {
  .button-groups {
    margin-top: 22px;
    margin-bottom: 22px;

    .btn {
      padding: 7px 10px;
      font-size: 12px;
      min-width: 70px;
      border-radius: 4px;
    }
  }

  .hidden {
    visibility: hidden;
  }
}
</style>
<style lang="less">
@import '~^domain-goods/styles/var.less';

.select-goods {
  .el-dialog__footer {
    background: @color__buttons-group-bg;
    padding: 10px 20px;
  }
}
.table-row {
  td {
    padding-bottom: 0px;
    & > div {
      padding-bottom: 18px;
    }
  }
}
.el-table__row {
  .el-form-item {
    margin-bottom: 0;
    // &.is-error {
    //   margin-bottom: 0px;
    // }
  }
}
</style>
