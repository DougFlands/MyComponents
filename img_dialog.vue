<template>
  <el-dialog :visible.sync="status.dialog" width='70%' class="img-com-dialog">
    <div class="rotate-group">
      <a title="逆时针旋转90°" @click="rotate(-90)" class="rotate">
        <svg-icon icon-class="Counterclockwise90" class="icon-img"></svg-icon>
      </a>
      <a title="旋转180°" @click="rotate(180)" class="rotate">
        <svg-icon icon-class="rotate180" class="icon-img"></svg-icon>
      </a>
      <a title="顺时针旋转90°" @click="rotate(90)" class="rotate">
        <svg-icon icon-class="Clockwise90" class="icon-img"></svg-icon>
      </a>
    </div>
    <div class="img">
      <img :src="urlLocal" :style="{'transform':`rotate(${rotateNum}deg)`}" ref="img">
    </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="status.dialog = false">关闭</el-button>
      </div>
  </el-dialog>
</template>

<script>
/* 
  点击查看大图
  type:
  download
  private
*/
import { getDownloadUrl, getPrivateUrl } from '@/util'

export default {
  props: {
    url: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      getDownloadUrl,
      getPrivateUrl,
      rotateNum: 0,
      status: {
        dialog: false
      }
    }
  },
  methods: {
    open() {
      this.rotateNum = 0
      this.status.dialog = true
    },
    rotate(num) {
      this.rotateNum += num
    }
  },
  computed: {
    urlLocal() {
      let url = ''
      if (this.type === 'download') {
        url = getDownloadUrl(this.url)
      } else if (this.type === 'private') {
        url = getPrivateUrl(this.url)
      } else {
        url = this.url
      }
      return url
    }
  }
}
</script>

<style>
.img-com-dialog .el-dialog {
  min-width: 400px;
  max-width: 1400px;
}
</style>

<style scoped lang="stylus">
.img
  display flex
  justify-content center
  align-items center
  margin-top 45px
  img
    display block
    width 80%
.rotate-group
  width 100%
  margin-left -20px
  .rotate
    margin-left 40px
    cursor pointer
    .icon-img
      height 45px
      width 35px
</style>