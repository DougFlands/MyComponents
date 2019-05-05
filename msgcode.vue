<template>
  <div class="warp">
    <img src="@/assets/icon-close.png" alt="" class="close" @click="emit('close')">

    <div class="img-warp">
      <div class="loading" v-show="loading" ref="loading">
        <Spinner color="#26a2ff" :type="0"></Spinner>
      </div>
      <img :src="img.sourceImg" alt="" class="img img-source" ref="img_source" v-show="imgSourceShow && !loading">
      <div class="img-group">
        <img :src="img.bgImg" alt="" class="img img-bg" ref="img_bg" v-show="!imgSourceShow && !loading">
        <div class="tips" :style="{'opacity': tips?'1':'0'}">
          <p>{{ tipsText }}</p>
        </div>
        <div class="handle-img" :style="[{'transform': `translate(${imgIcLeft}px)`}, {'margin-top': `-${imgIcTop}px`}]">
          <div :style="[{'height': `${handleImg}px`}, {'margin-top': `-${handleImg}px`}]" style="overflow: hidden">
            <img :src="img.icImg" alt="" class="img img-ic" ref="img_ic" v-show="!imgSourceShow" :style="{'margin-top': `${imgIcTop}px`}">
          </div>
          <div class="handle-warp" @touchstart="handleTouch">
            <img src="../assets/slide.png" alt="" class="handle" id="handle" >
          </div>
        </div>
      </div>
    </div>

    <div class="mask" @click="emit('close')"></div>
  </div>
</template>

<script>
import { downCaptchaSourceImg, downCaptchaIcImg, downCaptchaBgImg } from '@/util';
import 'hammerjs'
import { Spinner } from 'mint-ui';

export default {
  components: {
    Spinner,
  },
  props: {
    tel: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      imgSourceShow: true,
      loading: true,
      tips: false,
      tipsText: '',
      img: {
        sourceImg: '',
        icImg: '',
        bgImg: '',
        imgid: '',
        y: '',
      },
      imgIcMaxX: 0,
      imgIcLeft: 0,
      imgIcTop: 0,
      handleImg: 0,
      handleX: 0,
      attrPercen: 0
    }
  },
  methods: {
    getCaptcha() {
      this.loading = true
      this.$api.captcha.captcha().then(data => {
        this.img.sourceImg = downCaptchaSourceImg(data.theme)
        this.img.icImg = downCaptchaIcImg(data.theme, data.imageid)
        this.img.bgImg = downCaptchaBgImg(data.theme, data.imageid)
        this.img.y = data.y
        this.img.imgid = data.imageid
        this.imgIcTop = data.y * this.attrPercen
        this.loading = false
      })
    },
    handleEvent(e) {
      this.imgSourceShow = false
      let x = e.center.x - this.handleX
      if (x > 0 && x < this.imgIcMaxX) {
        this.imgIcLeft = x
      }
      if (e.isFinal) {
        let val = {
          biztype: 'login',
          imageid: this.img.imgid,
          icon_y: this.img.y,
          icon_x: parseInt(this.imgIcLeft / this.attrPercen),
          tel: this.tel,
        }
        this.$api.captcha.msgcode2(val).then(data => {
          this.tips = true
          this.tipsText = '验证码已发送'
          setTimeout(_ => {
            this.emit()
          }, 1500);
        }).catch(err => {
          // 重试
          if (err.errinfo === 'CAPTCHA_RETRY') {
            this.tipsText = '请重试'
          } else if (err.errinfo === 'MSGCODE_UNUSED') {
            this.tipsText = '验证码未使用'
          } else if (err.errinfo === 'MSGCODE_LIMIT') {
            this.tipsText = '今日发送次数已用完'
          } else if (err.errinfo === 'CAPTCHA_ERROR') {
            this.tipsText = '验证失败，请重试'
          } else if (err.errinfo === 'MSGCODE_FAILED') {
            this.tipsText = '验证码发送失败'
          } else {
            this.tipsText = err.errinfo
          }
          this.imgSourceShow = true
          this.getCaptcha()
          this.tips = true
          this.imgIcLeft = 0
          setTimeout(_ => {
            this.tips = false
          }, 2000)
        })
      }
    },
    // 记录鼠标距离左边的距离
    handleTouch(e) {
      this.handleX = e.touches[0].clientX
    },
    computeImgAttr() {
      this.$refs.img_source.width = parseInt(260 * this.attrPercen)
      this.$refs.img_bg.width = parseInt(260 * this.attrPercen)
      this.$refs.img_ic.width = parseInt(53 * this.attrPercen)
      this.handleImg = 116 * this.attrPercen
      this.imgIcMaxX = this.$refs.img_bg.width - this.$refs.img_ic.width
      // loading大小
      this.$refs.loading.style.width = parseInt(260 * this.attrPercen) + 'px'
      this.$refs.loading.style.height = parseInt(116 * this.attrPercen) + 'px'
    },
    emit(type) {
      if (type === 'close') {
        this.$emit('success', 'close')
      } else {
        this.$emit('success')
      }
    }
  },
  created() {
    this.getCaptcha()
    this.attrPercen = (window.screen.width * 0.9) / 260
  },
  mounted() {
    this.computeImgAttr()
    var hammertime = new Hammer(document.getElementById('handle'))
    hammertime.on('pan', this.handleEvent)
  }
}
</script>

<style scoped lang="stylus">
.warp
  width 100%
  height 100%
  display flex
  align-items center
  flex-direction column
  justify-content center
  .img-warp
    position relative
    border 1px solid #fff
    border-radius 5px 5px 5px
    background-color #fff
    padding 0.2rem
    width calc(90% -0.4rem)
    z-index 99
  .close
    position fixed
    top 3.6rem
    right 0.4rem
    z-index 200
    width 0.5rem
    margin 0 auto
    display block
  .mask
    position absolute
    z-index 50
    background rgba(0, 0, 0, 0.4)
    height 100%
    width 100%
    top 0
    bottom 0
    left 0
    right 0
.img
  display block
.img-source
  position relative
.loading
  background-color rgba(0, 0, 0, 0.3)
  display flex
  justify-content center
  align-items center
.img-group
  position relative
  .tips
    position absolute
    bottom 0.8rem
    width 100%
    color #fff
    height 0.5rem
    line-height 0.5rem
    text-align center
    margin-bottom 2px
    z-index 9999
    background-color rgba(0, 0, 0, 0.5)
    transition opacity 0.5s linear
  .img-bg
    z-index 1
  .handle-img
    position relative
    .img-ic
      z-index 999
    .handle-warp
      .handle
        display block
        width 1rem
        cursor pointer
</style>