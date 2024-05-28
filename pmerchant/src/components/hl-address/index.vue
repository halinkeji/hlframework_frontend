<template>
  <div class="row q-col-gutter-sm">
    <div class="col">
      <q-select
        :outlined="outlined"
        :dense="dense"
        v-model="page_province"
        :options="provinceOptions"
        option-value="code"
        option-label="value"
        map-options
        label="省"
        @input="getCity"
      >
        <template v-slot:label> 省<span v-if="requiredStatus" class="text-red text-weight-bold"> *</span> </template>
      </q-select>
    </div>
    <div class="col">
      <q-select
        :outlined="outlined"
        :dense="dense"
        v-model="page_city"
        :options="cityOptions"
        option-value="code"
        option-label="value"
        map-options
        label="市"
        @input="getArea"
      >
      <template v-slot:label> 市<span v-if="requiredStatus" class="text-red text-weight-bold"> *</span> </template>
      </q-select>
    </div>
    <div class="col">
      <q-select
        :outlined="outlined"
        :dense="dense"
        v-model="page_area"
        :options="districtOptions"
        option-value="code"
        option-label="value"
        map-options
        label="区"
        @input="getDistrict"
      >
      <template v-slot:label> 区<span v-if="requiredStatus" class="text-red text-weight-bold"> *</span> </template>
      </q-select>
    </div>
  </div>
</template>
<script>
import districts from 'utils/districts'
export default {
  props: {
    province: {
      type: String,
      default: ''
    },
    city: {
      type: String,
      default: ''
    },
    area: {
      type: String,
      default: ''
    },
    dense: {
      type: Boolean,
      default: true
    },
    outlined: {
      type: Boolean,
      default: true
    },
    cityCode: {
      type: String,
      default: ''
    },

    requiredStatus: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    province (v) {
      const provinceOptions = this.provinceOptions
      if (v) {
        this.page_province = this.mapDistrictsValue(provinceOptions, v)

        this.cityOptions = this.mapDistrictsData(districts[this.page_province.code])
      }
    },
    city (v) {
      const cityOptions = this.cityOptions
      if (v) {
        this.page_city = this.mapCityValue(cityOptions, v)
        this.districtOptions = this.mapDistrictsData(districts[this.page_city.code])
      }
    },
    area (v) {
      const districtOptions = this.districtOptions
      if (v) {
        this.page_area = this.mapAreaValue(districtOptions, v)
      }
    },
    cityCode (code) {
      const that = this
      if (code) {
        const province_code = code.substr(0, 2) + '0000'
        that.$emit('province', {
          value: districts[100000][province_code],
          code: province_code
        })

        const city_data = districts[province_code]

        _.forEach(city_data, function (value, key) {
          _.forEach(districts[key], function (v, k) {
            if (code == k) {
              that.$emit('city', {
                value: value,
                code: key
              })
            }
          })
        })
      }
    }
  },
  data () {
    return {
      provinceOptions: [],
      cityOptions: [],
      districtOptions: [],
      page_province: '',
      page_city: '',
      page_area: ''
    }
  },
  created () {
    const provinceOptions = this.mapDistrictsData(districts[100000])
    this.provinceOptions = provinceOptions
  },
  mounted () {
    this.changeProvince(this.province)
    this.$nextTick(() => {
      this.changeCity(this.city)
      this.$nextTick(() => {
        this.changeArea(this.area)
      })
    })
  },
  methods: {
    getCity (val) {
      this.$emit('province', val)
      this.cityOptions = this.mapDistrictsData(districts[val.code])
      this.page_city = ''
      this.page_area = ''
    },
    getArea (val) {
      this.$emit('city', val)
      this.districtOptions = this.mapDistrictsData(districts[val.code])
      this.page_area = ''
    },
    getDistrict (val) {
      this.$emit('area', val)
    },
    mapDistrictsValue (ob, va) {
      let nowData = this.province
      _.forEach(ob, function (value, key) {
        if (value.value == va) {
          nowData = value
        }
      })
      return nowData
    },
    mapCityValue (ob, va) {
      let nowData = this.city
      _.forEach(ob, function (value, key) {
        if (value.value == va) {
          nowData = value
        }
      })
      return nowData
    },

    mapAreaValue (ob, va) {
      let nowData = this.area
      _.forEach(ob, function (value, key) {
        if (value.value == va) {
          nowData = value
        }
      })
      return nowData
    },

    mapDistrictsData (ob) {
      const data = []
      _.mapKeys(ob, function (value, key) {
        return data.push({
          value: value,
          code: key
        })
      })
      return data
    },
    changeProvince (v) {
      const provinceOptions = this.provinceOptions
      if (v) {
        this.page_province = this.mapDistrictsValue(provinceOptions, v)

        this.cityOptions = this.mapDistrictsData(districts[this.page_province.code])
      }
    },
    changeCity (v) {
      const cityOptions = this.cityOptions
      if (v) {
        this.page_city = this.mapDistrictsValue(cityOptions, v)
        this.districtOptions = this.mapDistrictsData(districts[this.page_city.code])
      }
    },
    changeArea (v) {
      const districtOptions = this.districtOptions
      if (v) {
        this.page_area = this.mapDistrictsValue(districtOptions, v)
      }
    }
  }
}
</script>
