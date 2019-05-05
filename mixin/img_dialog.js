/* 
  img标签加上
   @click="imgdialogOpen(url, 'private')"

   HTML加上
    <imgdialog ref="imgdialog" :url="status.bigImg.url" :type="status.bigImg.type"></imgdialog>

   配合components食用
*/

import imgdialog from '@/components/img_dialog';

const img_dialog = {
  components: {
    imgdialog,
  },
  data() {
    return {
      status: {
        bigImg: {
          url: '',
          type: '',
        }
      },
    }
  },
  methods: {
    imgdialogOpen(url, type) {
      this.status.bigImg.url = url
      this.status.bigImg.type = type
      this.$refs.imgdialog.open()
    },
  },
}

export {
  img_dialog
}
