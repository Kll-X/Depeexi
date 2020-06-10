<template>
  <div class="detail-info-detail">
    <div class="cards-container">
      <detail-card :title="$attrs.title" :vertical="true">
        <div class="card-item">
          <span class="card-item-label">商品图片:</span>
          <div
            v-if="commodityImg && commodityImg.length > 0"
            class="card-item-content"
          >
            <UploadToAliWrap
              v-bind="pictureOptions"
              :value="commodityImg"
            ></UploadToAliWrap>
          </div>
        </div>
        <div class="card-item">
          <span class="card-item-label">商品视频:</span>
          <div v-if="!!commodityVideo" class="card-item-content">
            <UploadToAliWrap
              v-bind="videoOptions"
              :value="commodityVideo"
            ></UploadToAliWrap>
          </div>
        </div>
        <div slot="append">
          <div class="card-item">
            <span class="card-item-label">详细描述:</span>
            <div class="card-item-content">
              <el-radio-group v-model="activeName" style="margin-bottom: 10px;">
                <el-radio-button label="移动端详情">移动端详情</el-radio-button>
                <!-- <el-radio-button label="PC端详情">PC端详情</el-radio-button> -->
              </el-radio-group>
              <!-- <el-button-group>
                <el-button
                  type="primary"
                  plain
                  @click="activeName = `移动端详情`"
                  >移动端详情</el-button
                >
                <el-button type="primary" plain @click="activeName = `PC端详情`"
                  >PC端详情</el-button
                >
              </el-button-group> -->
              <!-- <el-tab-pane label="PC端详情" name="PC端详情">
              </el-tab-pane>-->
            </div>
          </div>

          <div
            v-show="activeName === `移动端详情`"
            class="detail-box"
            v-html="detailDescMB"
          ></div>
          <div
            v-show="activeName === `PC端详情`"
            class="detail-box"
            v-html="detailDescPC"
          ></div>
        </div>
      </detail-card>
    </div>
  </div>
</template>

<script>
import {RadioButton} from 'element-ui'
import DetailCard from '^domain-goods/components/detail-card'
import UploadToAliWrap from '^domain-goods/components/upload-to-ali-wrap'
import {TERMINAL_TYPES} from '^domain-goods/const/dictionary'

export default {
  name: 'DetailInfoDetail',
  components: {
    DetailCard,
    UploadToAliWrap,
    ElRadioButton: RadioButton,
  },
  props: {
    data: {
      type: Array,
      default() {
        return []
      },
    },
  },
  data() {
    return {
      pictureOptions: {
        // style: 'width:40%',
        placeholder: '请输入',
        max: 15,
        multiple: true,
        preview: true,
        // info: '建议尺寸：800*800像素，你可以拖拽图片调整顺序，最多上传15张',
      },
      videoOptions: {
        // style: 'width:35%',
        placeholder: '请输入',
        accept: 'video/*',
        size: Number.MAX_SAFE_INTEGER,
        info: '目前仅支持在手机端播放',
      },
      commodityImg: [],
      commodityImgArr: [],
      commodityVideo: '',
      detailDescPC: '',
      detailDescMB: '',
      activeName: '移动端详情',
    }
  },
  watch: {
    data(val) {
      let detailDescPC = ''
      let detailDescMB = ''
      let commodityVideo = ''
      let commodityImg = []
      let commodityImgArr = []
      val &&
        val.forEach(info => {
          const {terminalType, detailContent, picture, video} = info

          switch (terminalType) {
            case TERMINAL_TYPES['PC端']:
              detailDescPC = detailContent
              //   this.pcDetail = info
              break
            case TERMINAL_TYPES['移动端']:
              detailDescMB = detailContent
              //   this.mobileDetail = info
              break

            case TERMINAL_TYPES['图片']:
              commodityImg.push(picture)
              commodityImgArr.push(info)
              break

            case TERMINAL_TYPES['视频']:
              commodityVideo = video
              break

            default:
              //   detailDescMB = detailContent
              break
          }
        })
      this.commodityImg = commodityImg
      this.commodityImgArr = commodityImgArr
      this.commodityVideo = commodityVideo
      this.detailDescMB = detailDescMB
      this.detailDescPC = detailDescPC
    },
  },
}
</script>
<style lang="less" scoped>
@import '~^domain-goods/styles/var.less';

.detail-info-detail {
  .card-item {
    display: flex;
    min-height: 50px;

    .img-box {
      display: inline-block;
      padding: 0 6px;
    }

    .card-item-content {
      padding: 0 10px;
    }
  }

  .detail-box {
    border: 1px dashed #cad1e8;
    height: 400px;
    overflow: auto;
    border-radius: 4px;
    background: rgba(#2878ff, 5%);
    padding: 10px;
  }
}
</style>
<style lang="less">
.detail-info-detail {
  .upload-area {
    display: none !important;
  }

  .upload-to-oss .upload-del-icon {
    display: none !important;
  }
}
</style>
