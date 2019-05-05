/* 
	翻译地址信息
*/
const localFilter = {
  methods: {
    _getLocal(province) {
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
    getLocalInfo(province = '', city = null, county = null, town = null) {
      if (province === '0' || !Number(province) || !Number(city) || !Number(county) || !Number(town)) {
        return new Promise(res => {
          res(
            {
              province: '',
              city: '',
              county: '',
              town: '',
            }
          )
        })
      }
      return this._getLocal(province).then(() => {
        let data = {}
        let info = ''
        info = JSON.parse(localStorage.getItem(`city_${province}`))
        data.province = info[province]
        data.city = info[city] || ''
        data.county = info[county] || ''
        data.town = info[town] || ''
        return data
      })
    }
  },
}

export {
  localFilter
}