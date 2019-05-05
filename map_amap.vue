<template>
  <div class="amap-page-container">
    <el-amap vid="amapDemo" :zoom="zoom" :center="center" class="amap-demo" ref="mapA">
      <el-amap-marker vid="component-marker" :position="componentMarker.position" :content-render="componentMarker.contentRender"></el-amap-marker>
      <el-amap-marker v-for="(marker, index) in markers" :key="index" :position="marker.position" :events="marker.events" :visible="marker.visible" :draggable="marker.draggable" :vid="index"></el-amap-marker>
    </el-amap>
    <div class="toolbar" v-if="drag">
      <el-button type="primary" @click="addMarker" style="display: block;margin: 10px auto 0">{{ markers[0].position[0] === 0?'添加':'重置' }}锚点到窗口中心</el-button>
    </div>
  </div>
</template>

<script>
/* 
  高德地图插件
  传入
    city: '' // 城市，将会定位到中心点，参考data中map数组，如果存在锚点则无效
    drag: '' // 布尔，是否可拖曳锚点
    name: '' // 字符串，锚点名称
    position // 经纬度位置，纬度在前
  传出
    '经度 纬度' // 字符串
*/
import { AMapManager } from "vue-amap";

const exampleComponents = {
  props: ["name"],
  template: `<div>{{name}}</div>`
};

export default {
  components: {
    AMapManager
  },
  props: {
    drag: {
      type: Boolean,
      default: true
    },
    name: {
      type: String
    },
    city: {
      type: String,
      default: "北京市"
    },
    position: {
      type: [Array, String],
    }
  },
  data() {
    return {
      map: {
        河北省: [114.502461, 38.045474],
        山西省: [112.549248, 37.857014],
        内蒙古自治区: [111.670801, 40.818311],
        辽宁省: [123.429096, 41.796767],
        吉林省: [125.3245, 43.886841],
        黑龙江省: [126.642464, 45.756967],
        江苏省: [118.767413, 32.041544],
        浙江省: [120.153576, 30.287459],
        安徽省: [117.283042, 31.86119],
        福建省: [119.306239, 26.075302],
        江西省: [115.892151, 28.676493],
        山东省: [117.000923, 36.675807],
        河南省: [113.665412, 34.757975],
        湖北省: [114.298572, 30.584355],
        湖南省: [112.982279, 28.19409],
        广东省: [113.280637, 23.125178],
        广西壮族自治区: [108.320004, 22.82402],
        海南省: [110.33119, 20.031971],
        四川省: [104.065735, 30.659462],
        贵州省: [106.713478, 26.578343],
        云南省: [102.712251, 25.040609],
        西藏自治区: [91.132212, 29.660361],
        陕西省: [108.948024, 34.263161],
        甘肃省: [103.823557, 36.058039],
        青海省: [101.778916, 36.623178],
        宁夏回族自治区: [106.278179, 38.46637],
        新疆维吾尔自治区: [87.617733, 43.792818],
        北京市: [116.405285, 39.904989],
        天津市: [117.190182, 39.125596],
        上海市: [121.472644, 31.231706],
        重庆市: [106.504962, 29.533155]
      },
      zoom: 14,
      center: [116.405285, 39.904989],
      markers: [
        {
          position: [116.405285, 39.904989],
          events: {
            click: () => {
              // alert("click marker");
            },
            dragend: e => {
              let lngLat = [e.lnglat.lng, e.lnglat.lat];
              this.markers[0].position = lngLat;
              this.componentMarker.position = lngLat;
              this.handChange(lngLat);
            }
          },
          visible: true, // 显示
          draggable: this.drag, // 拖曳
          template: "<span>1</span>"
        }
      ],
      componentMarker: {
        position: [116.405285, 39.904989],
        contentRender: (h, instance) =>
          h(exampleComponents, {
            style: {
              backgroundColor: "rgba(245, 49, 90, 0.8)",
              width: "100px",
              borderRadius: "5px",
              color: "white",
              margin: "36px 0 0 -40px",
              textAlign: "center"
            },
            props: { name: this.titleName }
          })
      }
    };
  },
  methods: {
    chnageDraggle() {
      let draggable = this.markers[0].draggable;
      this.markers[0].draggable = !draggable;
    },
    addMarker() {
      let position = [
        this.$refs.mapA.$$getInstance().view.Nh.center.lng,
        this.$refs.mapA.$$getInstance().view.Nh.center.lat
      ];
      this.markers[0].position = position;
      this.componentMarker.position = position;
      this.handChange(position);
    },
    // 传出事件
    handChange(lngLat) {
      this.$emit("location", lngLat);
    }
  },
  computed: {
    titleName() {
      if (this.name === "") {
        return "点位名称";
      } else {
        return this.name;
      }
    }
  },
  created() {
    if (!this.position && !this.city) {
      this.center = this.map["北京市"]
    }
  },
  watch: {
    position(val) {
      if (val) {
        let position = []
        position = val.split(',')
        this.center = position
        this.componentMarker.position = position
        this.markers[0].position = position
      }
    },
    city(val) {
      if (this.map[this.city] && !this.position) {
        this.center = this.map[this.city];
      }
    }
  },
};
</script>

<style scoped>
.amap-demo {
  height: 400px;
}
</style>

