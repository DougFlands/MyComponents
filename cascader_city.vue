<template>
  <el-cascader
    ref="city"
    v-model="selectedLocal"
    @active-item-change="getLocal"
    @change="getLocal"
    :options="local"
    style="display:inline-block"
    :style="{width: `${width}px`}"
    :placeholder="place"
    :change-on-select="!selectFour"
    :disabled="disabled"
    clearable
  ></el-cascader>
  <!-- @change="getLocal"  -->
</template>

<script>
/* 说明,基于element级联封装查询城市
  传入参数
    place: String // 提示文字
    width: Number || String  // 宽度
    selectFour 是否选到第四级
    province 省份城市等数据，修改地理时使用

  父组件接受方法
    @cityData=""

  传出参数(省,市,区)
    local: 数字代码
    localZh: 中文
    
  额外函数
  设置父组件上ref属性，此函数可以清空参数
  this.$refs.city.clearVal()
*/
import { localList } from "@/mixin/local_list.js";
import { localFilter } from "@/mixin/local.js";

export default {
  mixins: [localList, localFilter],
  props: {
    width: {
      type: [Number, String],
      default: '300',
    },
    place: {
      type: String,
      default: '选择地址',
    },
    disabled: {
      type: Boolean,
      default: false
    },
    selectFour: {
      type: Boolean,
      default: false,
    },
    province: {
      type: String,
    },
    city: {
      type: String,
    },
    county: {
      type: String,
    },
    town: {
      type: String,
    },
  },
  data() {
    return {
      local: [],
      // 选择某一项之后保存指向children的指针
      localPointer: {},
      selectedLocal: [],
      localZh: [],
    }
  },
  methods: {
    // 选择地址
    getLocal(arr) {
      let [
        provinceid,
        cityid,
        countyid,
        town
      ] = arr || ''
      this.getLocalList(provinceid, cityid, countyid, town).then(data => {
        let id = town || countyid || cityid || provinceid
        if (provinceid) {
          if (cityid) {
            if (countyid) {
              this.setPointer(data, 6, id, 3)
            } else {
              this.setPointer(data, 4, id)
            }
          } else {
            this.setPointer(data, 2, id)
          }
        } else {
          this.localPointer['2'] = this.local
          this.setChildrenVal(data, 2)
        }
        this.handChange()

      }).catch(err => {
        console.log(err)
      })
    },
    // 写入数据
    setChildrenVal(data, level, id) {
      // 因为之后用的是Push，所以清空一下数据
      if (level !== 9) {
        this.localPointer[`${level}`].length = 0
      }
      // 最后街道添加一个空的选项
      let i = 0
      for (const e in data) {
        let e = e.toString()
        if (data.hasOwnProperty(e) && e.length === level && (id ? id === e.slice(0, level - 2) : true)) {
          const value = data[e];
          this.localPointer[`${level}`].push({
            value: e,
            label: value,
            children: []
          })
        } else if (data.hasOwnProperty(e) && e.length === 9 && (id ? id === e.slice(0, level - 3) : true)) {
          // 最后的街道级别有3位数
          const value = data[e];
          if (i === 0 && !this.selectFour) {
            this.localPointer[`${level}`].push({
              value: '',
              label: '空',
            })
            i = 1
          }
          this.localPointer[`${level}`].push({
            value: e,
            label: value,
          })
        }
      }
    },
    // 修改指向
    setPointer(data, pointeIndex, id, isLast = 2) {
      let indexNext = (pointeIndex + isLast).toString()
      pointeIndex = pointeIndex.toString()
      // 没用forEach是因为不能跳出循环
      for (let index = 0, len = this.localPointer[pointeIndex].length; index < len; index++) {
        if (this.localPointer[pointeIndex][index].value === id) {
          if (this.localPointer[pointeIndex][index].children) {
            this.localPointer[indexNext] = this.localPointer[pointeIndex][index].children
            break
          }
        }
      }
      this.setChildrenVal(data, Number(indexNext), id)
    },
    setLocalZh() {
      if (this.selectedLocal.length === 0) {
        // 判断是否为清空，是的话把ZH的信息清空掉
        return new Promise(res => {
          for (const key in this.localZh) {
            if (this.localZh.hasOwnProperty(key)) {
              this.localZh[key] = ''
            }
          }
          res()
        })
      } else {
        let [
          provinceid,
          cityid,
          countyid,
          town
        ] = this.selectedLocal || ''
        // 此时一定能从缓存获取数据，不会再发送请求
        return this.getLocalInfo(provinceid, cityid, countyid, town).then(data => {
          this.localZh = data
        })
      }
    },
    // 传出事件
    handChange() {
      this.setLocalZh().then(_ => {
        let o = {
          local: this.selectedLocal,
          localZh: this.localZh
        }
        this.$emit('cityData', o)
      })
    },
    // 清空
    clearVal() {
      this.local = []
      this.localPointer = []
      this.selectedLocal = []
      this.localZh = []
      this.getLocal([])
    },
    // 初始化时填入已有的值
    initSetVal() {
      let obj = ['province', 'city', 'county', 'town']
      let arr = []
      for (let i = 0; i < obj.length; i++) {
        const e = obj[i];
        if (this[e]) {
          arr.push(this[e])
          this.getLocal(arr)
          this.selectedLocal = [...arr]
        } else {
          break
        }
      }
    }
  },
  created() {
    this.getLocal([])
  },
  watch: {
    province(val) {
      this.initSetVal()
    }
  },
}

</script>

