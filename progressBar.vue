<template>
  <div class="warp">
    <p class="text">{{ text }}</p>
    <div class="bar">
      <div class="title" :style="{'left': filling}">
        <div class="content" :style="{'background-color': color,}">
          {{ data.index }} {{ unit }}
        </div>
        <div class="point" :style="{'border-top-color': color,}"></div>
      </div>
      <div :style="{'background-color': bgColor}" class="progress">
        <div class="filling" :style="{'background-color': color,'width': filling}"></div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {

      }
    },
    props: {
      text: String,
      color: String,
      bgColor: {
        type: String,
        default: 'rgba(0,0,0,0.1)'
      },
      unit: String,
      data: {
        index: Number,
        length: Number,
      }
    },
    methods: {

    },
    computed: {
      filling() {
        let s = (this.data.index / this.data.length) * 360;
        return s + 'px'
      },
    }
  }

  /* 
  {
    text: '左边文字',
    color: '线条颜色',
    unit: '跟随图标的单位',
    data: {
      index: 1, // 数值
      length: 10, // 总数
    },
  } 
  */

</script>

<style scoped>
  .warp {
    display: flex;
    margin-top: 40px;
    cursor: default;
    width: 450px;
  }

  .text {
    width: 40px;
    font-size: 12px;
    margin-right: 25px;
    margin-top: 25px;
  }

  .bar {
    width: 360px;
    position: relative;
  }

  .title {
    width: 40px;
    height: 26px;
    position: relative;
    margin-left: -19px;
    transition: left 1s, transform 1s;
  }

  .title .content {
    width: 40px;
    height: 16px;
    color: white;
    font-size: 12px;
    padding-bottom: 1px;
    text-align: center;
  }

  .title .point {
    width: 0;
    height: 0;
    border-left: 3px solid transparent;
    border-right: 3px solid transparent;
    border-top: 6px solid;
    position: relative;
    left: 17px;
  }

  .progress {
    width: 360px;
    height: 20px;
  }

  .filling {
    height: 100%;
    transition: width 1s, transform 1s;
  }

</style>

<style>
  * {
    vertical-align: baseline;
    font-weight: inherit;
    font-family: inherit;
    font-style: inherit;
    font-size: 100%;
    outline: 0;
    padding: 0;
    margin: 0;
    border: 0;
  }

  ol,
  ul {
    list-style: none;
  }

  a img,
   :link img,
   :visited img {
    border: 0;
  }

</style>
