<template>
  <div class="sales-info-detail">
    <div class="cards-container">
      <detail-card :title="$attrs.title">
        <el-table :data="tableData" style="width: 100%;">
          <template v-for="item in list">
            <el-table-column
              :label="item.label"
              :width="item.width || defaultOptions.width || auto"
              :key="item.key"
              :prop="item.key.toString()"
              min-width="120"
              :show-overflow-tooltip= "true"
            ></el-table-column>
          </template>
        </el-table>
      </detail-card>
    </div>
  </div>
</template>

<script>
import DetailCard from '^domain-goods/components/detail-card'

export default {
  name: 'SalesInfoDetail',
  components: {
    DetailCard,
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      },
    },
    propertyList: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      tableData: [],
      defaultList: [
        {label: 'SKU编码', key: 'code', required: true},
        {label: '价格', key: 'price', required: true},
      ],
      list: [],
      defaultOptions: {
        width: 'auto',
      },
    }
  },
  watch: {
    data(val) {
      this.tableData = this.data
    },
    propertyList(val) {
      if (val) {
        this.list = val.reduce(
          (arr, info) => {
            arr.push({
              key: info.propertyId, //  propertyid
              label: info.propertyName,
            })
            return arr
          },
          [...this.defaultList],
        )
      } else {
        this.list = [...this.defaultList]
      }
    },
  },
}
</script>
