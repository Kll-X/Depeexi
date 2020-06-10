<template>
  <div class="account-info-view">
    <div v-loading="memberInfoLoading" class="member-info">
      <div class="member-info-card">
        <div
          :style="{
            backgroundImage:
              'url(' + require('^domain-member/assets/personal-card.png') + ')',
          }"
          class="member-info-card-avatar"
        >
          <div class="member-info-card-avatar-img">
            <img
              v-if="memberInfoData.avatarUrl"
              :src="memberInfoData.avatarUrl"
            />
            <img
              v-else
              :src="require('^domain-member/assets/default-avatar.svg')"
            />
          </div>
        </div>
        <div class="member-info-card-content">
          <span
            >昵称：
            <p>{{ memberInfoData.nickName || '' }}</p></span
          >
          <span
            >账号：
            <p>{{ memberInfoData.username }}</p></span
          >
          <span
            >手机：
            <p>{{ memberInfoData.phone }}</p></span
          >
        </div>
      </div>
      <panel title="会员信息" body-padding="10px 20px">
        <data-mapper
          :columns="memberInfoColumns"
          :data="memberInfoData"
        ></data-mapper>
      </panel>
    </div>
    <panel title="业务信息" body-padding="10px 20px">
      <div class="tab-group">
        <el-radio-group v-model="tabActive" text-color="#5D81F9">
          <el-radio-button
            v-for="(tab, index) in tabs"
            :key="index"
            :label="tab.label"
            >{{ tab.value }}</el-radio-button
          >
        </el-radio-group>
      </div>
      <el-data-table
        v-if="tabActive === 'orderInfo'"
        ref="dataTable"
        :url="orderUrl"
        v-bind="businessConfign"
      ></el-data-table>
      <div v-else class="no-data">暂无信息</div>
    </panel>
  </div>
</template>

<script>
import Panel from '^domain-member/components/panel'
import DataMapper from '^domain-member/components/data-mapper'
import {RadioGroup, RadioButton} from 'element-ui'
import {SEX_OPTIONS} from '^domain-member/const/const'
import {ORDER_STATUS} from '^domain-member/const/order'
import {formatDate} from '^domain-member/const/filter'
import {
  getMemberInfo,
  orderList,
} from '^domain-member/services/deepexi-system-digital-retail'
import arealist from '@femessage/el-select-area/src/arealist'

export default {
  components: {
    Panel,
    DataMapper,
    'el-radio-group': RadioGroup,
    'el-radio-button': RadioButton,
  },
  data() {
    return {
      memberInfoColumns: [
        {
          prop: 'name',
          label: '姓名',
        },
        {
          prop: 'sex',
          label: '性别',
          formatter: ({sex}) => SEX_OPTIONS[sex],
        },
        {
          prop: 'birthday',
          label: '生日',
          formatter: ({birthday}) => formatDate(birthday, 'YYYY-MM-DD'),
        },
        {
          prop: 'job',
          label: '职业',
        },
        {
          prop: 'age',
          label: '年龄',
        },
        {
          prop: 'qq',
          label: 'QQ',
        },
        {
          prop: 'email',
          label: '邮箱',
        },
        {
          prop: 'inArea',
          label: '联系地址',
          formatter: ({inArea, contactAddress}) => {
            if (!inArea || !contactAddress) return
            const [provinceCode, cityCode, countyCode] = inArea.split(',')
            const {province_list, city_list, county_list} = arealist
            return `${province_list[provinceCode]}${city_list[cityCode]}${county_list[countyCode]}${contactAddress}`
          },
        },
      ],
      memberInfoData: {},
      memberInfoLoading: false,
      businessConfign: {
        columns: [
          {
            prop: 'status',
            label: '订单状态',
            minWidth: 150,
            'show-overflow-tooltip': true,
            formatter: ({status}) => ORDER_STATUS[status],
          },
          {
            prop: 'saleOrderNo',
            label: '订单号',
            minWidth: 150,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'sourceChannel',
            label: '来源渠道',
            minWidth: 150,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'sellerName',
            label: '来源店铺',
            minWidth: 150,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'originalTotalAmount',
            label: '订单金额',
            minWidth: 150,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'changeAmount',
            label: '优惠金额',
            minWidth: 150,
            'show-overflow-tooltip': true,
          },
          {
            prop: 'realPayAmount',
            label: '实付金额',
            minWidth: 150,
            'show-overflow-tooltip': true,
          },
          // {
          //   prop: 'goodsNum',
          //   label: '商品数量',
          //   minWidth: 150,
          //   'show-overflow-tooltip': true,
          // },
          // {
          //   prop: 'i',
          //   label: '已配货数',
          //   minWidth: 150,
          //   'show-overflow-tooltip': true,
          // },
          // {
          //   prop: 'j',
          //   label: '已发货数',
          //   minWidth: 150,
          //   'show-overflow-tooltip': true,
          // },
          // {
          //   prop: 'k',
          //   label: '已收货数',
          //   minWidth: 150,
          //   'show-overflow-tooltip': true,
          // },
          // {
          //   prop: 'l',
          //   label: '是否活动订单',
          //   minWidth: 150,
          //   'show-overflow-tooltip': true,
          // },
          // {
          //   prop: 'n',
          //   label: '关联活动订单号',
          //   minWidth: 150,
          //   'show-overflow-tooltip': true,
          // },
        ],
        hasNew: false,
        hasOperation: false,
      },
      tabActive: 'orderInfo',
      tabs: [
        {
          label: 'orderInfo',
          value: '订单信息',
        },
        // {
        //   label: 'activityInfo',
        //   value: '活动信息',
        // },
        // {
        //   label: 'shareInfo',
        //   value: '分享信息',
        // },
      ],
    }
  },
  computed: {
    orderUrl() {
      if (!this.memberInfoData.id) return
      return orderList(this.memberInfoData.id)
    },
  },
  created() {
    if (!!this.$route.query.id) {
      this.handleGetAccountInfo()
    }
  },
  methods: {
    handleGetAccountInfo() {
      this.memberInfoLoading = true
      getMemberInfo(this.$route.query.id)
        .then(({payload}) => {
          this.memberInfoData = payload
        })
        .finally(() => {
          this.memberInfoLoading = false
        })
    },
  },
}
</script>

<style lang="less">
.account-info-view {
  background-color: #f0f2f5;
  min-height: 100%;

  .member-info {
    display: flex;
    margin-bottom: 20px;

    &-card {
      width: 220px;
      height: 286px;
      background-color: #fff;
      border-radius: 10px;

      &-avatar {
        height: 120px;
        border-radius: 10px;
        margin-bottom: 10px;
        background:
          linear-gradient(
            241deg,
            rgba(61, 148, 255, 1) 0%,
            rgba(81, 176, 255, 1) 48%,
            rgba(40, 120, 255, 1) 100%
          );
        background-size: cover;
        display: flex;
        justify-content: center;
        align-items: center;

        &-img {
          height: 60px;
          width: 60px;
          background-color: #fff;
          border-radius: 50%;
          overflow: hidden;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      &-content {
        display: flex;
        flex-direction: column;
        padding-left: 20px;

        span {
          font-size: 14px;
          color: #818389;
          line-height: 40px;
          display: flex;

          p {
            color: #2d303b;
          }
        }
      }
    }

    .panel {
      margin-left: 20px;
      flex: 1;
    }
  }

  .tab-group {
    margin-bottom: 20px;

    span.el-radio-button__inner {
      border-color: #e4e8f3;
      font-weight: 400;
    }

    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: rgba(#2878ff, 0.08);
      box-shadow: -1px 0 0 0 rgba(#2878ff, 0.08);
    }
  }

  .el-table__header {
    font-size: 12px;

    thead {
      .is-leaf {
        background-color: #f4f6fa;
      }
    }
  }

  .no-data {
    text-align: center;
    border: 1px solid #eee;
    padding: 20px;
  }
}
</style>
