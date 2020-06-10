<template>
  <type-container title="商品图片描述信息">
    <el-form-renderer
      ref="detailInfo"
      :content="detailContent"
      :disabled="disabled"
      label-width="120px"
    ></el-form-renderer>
  </type-container>
</template>

<script>
import TypeContainer from './type-container'
import UploadToAliWrap from '^domain-goods/components/upload-to-ali-wrap'
import DetailEditor from './detail-editor'
import {TERMINAL_TYPES} from '^domain-goods/const/dictionary'
// // `terminal_typeS` TINYINT(4) NOT NULL COMMENT '终端类型 1:PC 2:移动端',
// const TERMINAL_TYPES = {
// 图片: 0,
//   视频: 1,
//   PC: 2,
//   移动端: 3,
// }

export default {
  name: 'DetailInfo',
  components: {
    TypeContainer,
  },
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    var checkInfo = (rule, value, callback) => {
      if (value[0].length > 2000) {
        return callback(new Error('pc端详情过长, 长度应在2000个字符以内'))
      } else if (value[1].length > 2000) {
        return callback(new Error('移动端详情过长, 长度应在2000个字符以内'))
      }
      callback()
    }
    return {
      detailContent: [
        {
          $id: 'commodityImgArr',
          label: '商品图片',
          $el: {
            // style: 'width:40%',
            placeholder: '请输入',
            max: 15,
            size: 1024,
            multiple: true,
            accept: 'image/png,image/jpg,image/jpeg',
            preview: true,
            info: '建议尺寸：800*800像素，你可以拖拽图片调整顺序，最多上传15张',
          },
          rules: [{required: true, message: '请选择商品图片', trigger: 'blur'}],
          component: UploadToAliWrap,
        },
        {
          $id: 'commodityVideo',
          label: '商品视频',
          $el: {
            // style: 'width:35%',
            placeholder: '请输入',
            accept: 'video/*',
            size: Number.MAX_SAFE_INTEGER,
            info: '目前仅支持在手机端播放，建议时长9-30秒，建议视频宽高比16:9',
          },
          component: UploadToAliWrap,
        },
        {
          $id: 'detailDesc',
          label: '详情描述',
          $el: {
            style: 'width:85%',
            placeholder: '请输入',
          },
          rules: [
            {
              validator: checkInfo,
              // message: '最长不得超过32个字符',
              trigger: ['blur', 'change'],
            },
          ],
          component: DetailEditor,
        },
      ],
      pcDetail: {}, // 编辑的时候原来的PC信息
      mobileDetail: {}, // 编辑的时候原来的手机信息
      commodityVideoObj: {}, // 编辑的时候的原来video的信息
      commodityImgObjArr: [], // 编辑的时候原来的Img信息
      initData: [], // 初始数据
    }
  },
  methods: {
    // 设置form的值
    setFormValue(params) {
      const {itemDetail} = params || {}
      this.initData = itemDetail
      let detailDesc = []
      let commodityVideo = ''
      let commodityVideoObj = {}
      let commodityImgObjArr = []
      let commodityImgArr = []

      itemDetail &&
        itemDetail.forEach(info => {
          const {terminalType, detailContent, picture, video} = info
          switch (terminalType) {
            case TERMINAL_TYPES['PC端']:
              detailDesc[0] = detailContent
              this.pcDetail = info
              break
            case TERMINAL_TYPES['移动端']:
              detailDesc[1] = detailContent
              this.mobileDetail = info
              break

            case TERMINAL_TYPES['图片']:
              commodityImgArr.push(picture)
              commodityImgObjArr.push(info)
              break

            case TERMINAL_TYPES['视频']:
              commodityVideo = video
              commodityVideoObj = info
              break

            default:
              break
          }
        })
      this.commodityImgObjArr = commodityImgObjArr // 保存原对象数组,用于对比是更新删除添加
      this.commodityVideoObj = commodityVideoObj

      this.$refs.detailInfo.updateForm({
        detailDesc,
        commodityVideo,
        commodityImgArr,
      })
    },
    // 获取form的值
    async getFormValue() {
      const $detailInfo = this.$refs.detailInfo
      // `terminal_typeS` TINYINT(4) NOT NULL COMMENT '终端类型 1:PC 2:移动端',
      // `TERMINAL_TYPES` TINYINT(4) NOT NULL COMMENT '商品附件类型， 1:图片  2:视频',
      try {
        const valiDetailInfo = await $detailInfo.validate()
        if (valiDetailInfo) {
          const {
            commodityImgArr,
            commodityVideo,
            detailDesc,
          } = $detailInfo.getFormValue()
          const itemDetail = []
          const pcDetailContent =
            detailDesc && detailDesc[0] ? detailDesc[0] : ''
          const mobileDetailContent =
            detailDesc && detailDesc[1] ? detailDesc[1] : ''
          commodityImgArr &&
            commodityImgArr.forEach(info => {
              const currentImg =
                this.commodityImgObjArr.find(inner => inner.picture === info) ||
                {}
              itemDetail.push({
                ...currentImg,
                terminalType: TERMINAL_TYPES['图片'],
                picture: info,
              })
            })
          commodityVideo &&
            itemDetail.push({
              ...this.commodityVideoObj,
              terminalType: TERMINAL_TYPES['视频'],
              video: commodityVideo,
            })
          itemDetail.push({
            ...this.pcDetail,
            terminalType: TERMINAL_TYPES['PC端'],
            detailContent: pcDetailContent,
          })
          itemDetail.push({
            ...this.mobileDetail,
            terminalType: TERMINAL_TYPES['移动端'],
            detailContent: mobileDetailContent,
          })
          itemDetail.forEach(item => {
            delete item.updatedTime
            delete item.createdTime
          })
          const idList = this.initData.map(v => v.id)
          const idList_new = itemDetail.map(v => v.id)
          let del = []
          let add = []
          let updated = []
          itemDetail.forEach(item => {
            if (idList.includes(item.id)) {
              updated.push(item)
            } else {
              add.push(item)
            }
          })
          idList.forEach(item => {
            if (!idList_new.includes(item)) {
              del.push(item)
            }
          })
          // 将返回form表单的值
          return {itemDetail, add, del, updated}
        } else {
          this.$notify.error('请填写完整信息')
          return null
        }
      } catch (err) {
        console.error(err)
      }
    },
    // 重置form表单的值
    resetFormValue() {
      this.$refs.detailInfo.resetFields()
    },
  },
}
</script>
