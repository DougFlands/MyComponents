<template>
  <div class="carousel">
    <div class="figure" :style="{
      transformOrigin: '50% 50% ' + -apothem +'px',
     transform: 'rotateY(' + (theta * dataIndex-theta) + 'rad)'}">
      <div class="photo" v-for="(item, index) in propImgArr" :key="index" :style="{transformOrigin: '50% 50% '+ -apothem +'px',
          transform: 'rotateY(' + index*theta + 'rad)'}">
        <img :src=item alt="" ref="image">
        <p>{{ index+1 }}</p>
      </div>
    </div>
    <div class="nav" @click="change($event)">
      <button class="nav prev">Prev</button>
      <button class="nav next">Next</button>
    </div>
  </div>
</template>


<script>
/* 使用方法 */
/* 父组件声明 */
/* <caro :propImgArr="imgAr"></caro> */
/* 传入数据(必须以require方式传入) */
/* imgAr: [require("../assets/9.jpg")] */
  export default {
    props: {
      propImgArr: {
        type: Array,
        default: []
      }
    },
    data() {
      return {
        theta: 2 * Math.PI / this.propImgArr.length,
        dataIndex: 1,
        apothem: 0,
      };
    },
    methods: {
      change(e) {
        if (e.target.classList.contains('next')) {
          this.dataIndex--
        } else {
          this.dataIndex++
        }
      },
    },
    mounted() {
      this.apothem = parseFloat(this.$refs.image[0].width / (2 * Math.tan(Math.PI / this.propImgArr.length)))
      var that = this
      window.onresize = () => {
        return (() => {
          that.apothem = parseFloat(that.$refs.image[0].width / (2 * Math.tan(Math.PI / that.propImgArr.length)))
        })
      }
    }
  };

</script>

<style scoped>
  .carousel {
    padding: 20px;
    perspective: 500px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .carousel .figure {
    margin: 0;
    width: 40%;
    height: auto;
    transform-style: preserve-3d;
    transition: transform 0.5s;
  }

  .carousel .figure .photo {
    width: 100%;
    box-sizing: border-box;
    padding: 50px;
    backface-visibility: hidden;
  }

  .carousel .figure .photo:not(:first-of-type) {
    position: absolute;
    left: 0;
    top: 0;
  }

  .carousel .figure .photo img {
    width: 100%;
  }

  .carousel .figure .photo p {
    margin: 0;
    padding: 0;
  }

  .carousel .nav {
    display: flex;
    justify-content: center;
  }

  .carousel .nav button {
    flex: 0 0 auto;
    margin: 0 5px;
    cursor: pointer;
    color: #333;
    background: none;
    letter-spacing: 1px;
    padding: 5px 10px;
  }

</style>
