<template>
  <div class="basic-info-detail">
    <div class="cards-container">
      <detail-card :data="formatterData"></detail-card>
    </div>
  </div>
</template>

<script>
import DetailCard from '^domain-goods/components/detail-card'

const NAME_CHART = {
  categoryName: '商品类目',
  code: '商品系统编码',
  name: '商品名称',
  subName: '副标题',
}

export default {
  name: 'BasicInfoDetail',
  components: {
    DetailCard,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
    propertyInfo: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      list: [],
      formatterDefaultData: [],
      // formatterListData: [],
    }
  },
  computed: {
    formatterData() {
      return [...this.formatterDefaultData, ...this.formatterListData]
    },
    formatterListData() {
      return this.propertyInfo.map(item => {
        return {
          id: item.propertyId,
          value: item.propertyValue,
          label: item.propertyName,
        }
      })
    },
  },
  watch: {
    data(val) {
      const data = []
      for (let item in NAME_CHART) {
        data.push({
          label: NAME_CHART[item],
          value: val[item],
          id: item,
        })
      }
      this.formatterDefaultData = data
    },
  },
}
</script>
