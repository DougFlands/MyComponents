<template>
  <el-dialog :visible.sync="status.dialog" width='50%'>
    <qrcode :value="value" :options="qrcode.options" tag="img" id="qrcode" ref="qrcode" class="code"></qrcode>
    <div class="qrcode-text">
      <slot></slot>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="downQrcode">下载二维码</el-button>
      <el-button type="primary" @click="status.dialog = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
/* 
  点击查看二维码
  url: 二维码的内容
  downText: 二维码下载后的文件名

  嵌入的字使用 span 标签可居中对齐

  import qrcode from '@/components/qrcode';

  <qrcode :url="status.companyQrcodeUrl" :downText="status.companyQrcodeText" ref="companyQrcode">
    <p class="qrcode-text">{{ status.companyQrcodeText }}</p>
  </qrcode>
  --event
  this.$refs.x.open()
*/
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
    downText: {
      type: String,
    },
  },
  data() {
    return {
      status: {
        dialog: false
      },
      qrcode: {
        options: {
          size: 300,
        }
      }
    }
  },
  methods: {
    open() {
      this.status.dialog = true
    },
    downQrcode() {
      let src = document.getElementById('qrcode').src
      const aLink = document.createElement('a')
      aLink.download = this.downText || '下载'
      aLink.href = src
      aLink.dispatchEvent(new MouseEvent('click', {}))
    }
  },
  computed: {
    value() {
      return this.url
    }
  }
}
</script>

<style scoped lang="stylus">
.code
  display block
  width 300px
  margin 0 auto
.qrcode-text
  text-align center
  margin 10px 0
  font-size 18px
</style>