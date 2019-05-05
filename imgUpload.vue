<template>
  <div>
    <!-- file-list不能接受空list，只能依靠if去判断 -->
    <el-upload
      :action="getUploadUrl(url, type, id)"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-success="handleSuccess"
      :on-error="handleError"
      :limit="limit"
      :multiple="true"
      :on-exceed="moreImg"
      :on-remove="handleRemove"
      :file-list="imgDefault"
      v-if="imgDefault.length>0"
    >
      <i class="el-icon-plus"></i>
    </el-upload>

    <el-upload
      :action="getUploadUrl(url, type, id)"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-success="handleSuccess"
      :on-error="handleError"
      :limit="limit"
      :multiple="true"
      :on-exceed="moreImg"
      :on-remove="handleRemove"
      v-else
    >
      <i class="el-icon-plus"></i>
    </el-upload>

    <el-dialog :visible.sync="status.dialogVisible" :modal="false">
      <img width="100%" :src="status.dialogImageUrl" alt>
    </el-dialog>
  </div>
</template>

<script>
/* 说明,基于element-传图组件封装
  传入参数
    limit: 最多几张图片(Number)
    arrKey: 接受图片数组中的key值
    url: 请求地址后缀
    id: 最后带上id
    type: 1 活动 2 商品

  父组件接受方法
    @imgEvent=""

  传出参数
    {
      type: 0 // 0:error, 1:success, 2:remove, 3:info//Number
      arrKey： // 传入的key值
      imgArray: [] // 图片数组
      error: 错误提示(如果存在)
    }
*/
import {
  getUploadUrl, getDownloadUrl
} from '@/util'

export default {
  props: {
    limit: {
      type: Number,
      required: true,
    },
    arrKey: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    imgArr: {
      type: String,
      default: '',
    },
    id: {
      type: String,
      default: '',
    },
    type: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      getUploadUrl,
      getDownloadUrl,
      status: {
        dialogVisible: false,
        dialogImageUrl: '',
      },
      imgList: [],
      res: {}
    }
  },
  methods: {
    moreImg() {
      this.$error(`仅能上传 ${this.limit} 张图片`)
    },
    // 点击看大图
    handlePictureCardPreview(file) {
      this.status.dialogImageUrl = file.url;
      this.status.dialogVisible = true;
    },

    handleSuccess(response, file, fileList) {
      this.res = response
      this.imgList = fileList
      this.handChange(1)
    },

    handleError(err, file, fileList) {
      this.handChange(0, err)
    },

    handleRemove(e, list) {
      this.imgList = list
      this.handChange(2)
    },
    // 传出事件
    handChange(type, error) {
      let o = {
        type,
        arrKey: this.arrKey,
        imgArray: this.imgListFilter,
        error: error || ''
      }
      this.$emit('imgEvent', o, this.res)
    },
  },
  created() {
    // 对传来的图片进行处理，在修改图片页面用到
    if (this.imgArr !== '') {
      this.imgList = this.imgDefault
    }
  },
  watch: {
    // 如果仅能上传一张图片，则隐藏+号
    // imgList(val) {
    // if (this.limit === 1) {
    // if (val.length > 0) {
    // document.getElementsByClassName('el-upload--picture-card')[0].style.display = 'none'

    // } else {
    // document.getElementsByClassName('el-upload--picture-card')[0].style.display = 'block'

    //   }
    // }
    // },
    imgArr(val) {
      if (val !== '') {
        this.imgList = this.imgDefault
      } else {
        // if (this.limit === 1) {
        //   document.getElementsByClassName('el-upload--picture-card')[0].style.display = 'block'

        // }
      }
    }
  },
  mounted() {
    this.handChange(3)
  },
  computed: {
    // 如果传来图片的处理
    imgDefault() {
      if (this.imgArr !== '') {
        let arr = []
        let _imgArr = []
        if (this.imgArr[0] === '[') {
          _imgArr = JSON.parse(this.imgArr)
        } else {
          let _o = []
          _o.push(this.imgArr)
          _imgArr = _o
        }
        _imgArr.forEach((e) => {
          let url = ''
          if (/^http.*$/.test(e)) {
            url = e
          } else {
            url = getDownloadUrl(e)
          }
          arr.push({
            name: '',
            url: url,
          })
        })
        return arr
      } else {
        return []
      }
    },
    // 传出的图片过滤,增加双引号转为String
    imgListFilter() {
      let _arr = [],
        re = new RegExp(this.url + "\/(.*)")
      this.imgList.forEach(e => {
        if (e.name === '') {
          _arr.push(`"${re.exec(e.url)[0]}"`)
        } else {
          _arr.push(`"${re.exec(e.response.data.filepath)[0]}"`)
        }
      });
      return `[${_arr}]`
    }
  }
}

</script>
