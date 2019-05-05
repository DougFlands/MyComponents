/* 
	返回地址字典
*/
const localList = {
  methods: {
    _getLocalInfo(province) {
      if (localStorage.getItem(`city_${province}`)) {
        return new Promise((res, rej) => {
          res()
        })
      } else {
        return this.$api.common.area_dict(province).then(e => {
          localStorage.setItem(`city_${province}`, JSON.stringify(e))
        })
      }
    },
    getLocalList(province = '', city = null, county = null, town = null) {
      return this._getLocalInfo(province).then(() => {
        let info = ''
        info = JSON.parse(localStorage.getItem(`city_${province}`))
        return info
      })
    }
  },
}

export {
  localList
}