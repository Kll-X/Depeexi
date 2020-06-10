<template>
  <div class="others-info-detail">
    <div class="cards-container">
      <detail-card
        :title="$attrs.title"
        :data="formatterListData"
      ></detail-card>
    </div>
  </div>
</template>

<script>
import DetailCard from '^domain-goods/components/detail-card'

export default {
  name: 'OthersInfoDetail',
  components: {
    DetailCard,
  },
  props: {
    propertyInfo: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {}
  },
  computed: {
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
}
</script>
