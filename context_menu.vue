<template>
  <div class="page">
    <el-button
      icon="el-icon-tickets"
      size="mini"
      class="contextmenu"
      @click="newWindowOpen"
      :style="{'top': contextMenuData.axis.y + 'px','left': contextMenuData.axis.x + 'px'}"
      v-show="contextMenuData.isShow"
    >新窗口打开</el-button>
  </div>
</template>

<script>
/* 
  右键菜单打开新窗口
  @contextmenu="showMenu($event, path)"
  path为路由路径，不需要前面的域名
*/
export default {
  data() {
    return {
      contextMenuData: {
        isShow: false,
        axis: {
          x: null,
          y: null
        },
        globalClick: null,
        path: ''
      }
    }
  },
  methods: {
    showMenu(event, path) {
      event.preventDefault()
      this.contextMenuData.path = path
      var x = event.clientX
      var y = event.clientY
      this.contextMenuData.axis = {
        x, y
      },
        this.contextMenuData.isShow = true
      this.contextMenuData.globalClick = document.getElementById('app').onclick = () => {
        this.contextMenuData.isShow = false
        this.contextMenuData.globalClick = null
      }
    },
    newWindowOpen() {
      let href = window.location.href.split('/')
      window.open(href[0] + '//' + href[2] + this.contextMenuData.path)
    }
  },
}
</script>

<style scoped lang="stylus">
.contextmenu 
  position absolute
  z-index 99
</style>