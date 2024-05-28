<template>
  <q-dialog @hide="hideNowPage" v-model="addConfig" persistent>
    <q-card
      :style="{
        width: dialogWidth,
        'max-width': dialogWidth,
      }"
      class="q-pa-sm fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <q-card-section class="row items-center ">
            <div class="text-h6">
              选择区域
            </div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
          </q-card-section>
        </div>
        <div class="col-shrink q-pa-sm full-height bg-white">
          <q-scroll-area class="fit full-height">
            <q-card flat horizontal bordered class="q-mt-xs" :key="`card-${key}`" v-for="(item, key) in districtsData[100000]">
              <q-card-section horizontal>
                <q-card-section>
                  <q-checkbox v-model="provinceData" @input="checkProvince(key, item)" :val="key" :label="item" />
                </q-card-section>
                <q-separator vertical />
                <q-card-section>
                  <q-checkbox v-model="cityData" :key="k" @input="checkCity(key, item, k, i)" :val="k" :label="i" v-for="(i, k) in districtsData[key]" />
                </q-card-section>
              </q-card-section>
            </q-card>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
          <q-btn unelevated :disable="btnDisable" @click="addShoppingCart" label="提交" color="primary" class="q-px-xl" />
          <q-btn unelevated label="关闭" type="reset" color="grey" class="q-px-xl" v-close-popup />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import districts from 'utils/districts'
export default {
  name: 'SelectArea',
  components: {},
  data () {
    return {
      chooseVisible: false,
      dialogWidth: '1000px',
      addConfig: true,
      districtsData: {},
      provinceData: [],
      cityData: [],
      selectAreaData: [],
      btnDisable: false
    }
  },
  mounted () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.9) + 'px'
    }
  },
  computed: {},
  created () {
    this.districtsData = districts
  },
  methods: {
    selectAreaPage (areaData) {
      this.addConfig = true
      this.selectAreaData = areaData
      this.setAreaData()
    },
    addShoppingCart () {
      this.addConfig = false
      this.$emit('refreshDataList', this.selectAreaData)
    },
    checkProvince (key, item) {
      if (this.provinceData.indexOf(key) > -1) {
        if (this.districtsData[key]) {
          for (const i in this.districtsData[key]) {
            const index = this.cityData.indexOf(i)
            if (index < 0) {
              this.cityData.push(i)
              const areaIndex = _.findIndex(this.selectAreaData, function (o) {
                return o.fta_city_code == i
              })
              if (areaIndex < 0) {
                this.selectAreaData.push({
                  fta_province: item,
                  fta_province_code: key,
                  fta_city: this.districtsData[key][i],
                  fta_city_code: i
                })
              }
            }
          }
        }
      } else {
        for (const i in this.districtsData[key]) {
          const index = this.cityData.indexOf(i)
          if (index > -1) {
            this.cityData.splice(index, 1)
            const areaIndex = _.findIndex(this.selectAreaData, function (o) {
              return o.fta_city_code == i
            })
            if (areaIndex > -1) {
              this.selectAreaData.splice(areaIndex, 1)
            }
          }
        }
      }
    },

    checkCity (provinceCode, province, cityCode, city) {
      if (this.cityData.indexOf(cityCode) > -1) {
        const areaIndex = _.findIndex(this.selectAreaData, function (o) {
          return o.fta_city_code == cityCode
        })
        if (areaIndex < 0) {
          this.selectAreaData.push({
            fta_province: province,
            fta_province_code: provinceCode,
            fta_city: city,
            fta_city_code: cityCode
          })
        }
      } else {
        const areaIndex = _.findIndex(this.selectAreaData, function (o) {
          return o.fta_city_code == cityCode
        })
        if (areaIndex > -1) {
          this.selectAreaData.splice(areaIndex, 1)
        }
      }
    },

    setAreaData () {
      _(this.selectAreaData).forEach((value, key) => {
        if (this.cityData.indexOf(value.fta_city_code) < 0) {
          this.cityData.push(value.fta_city_code)
        }
        if (this.provinceData.indexOf(value.fta_province_code) < 0) {
          this.provinceData.push(value.fta_province_code)
        }
      })
    },
    // 关闭

    hideNowPage () {
      this.addConfig = false
      this.$emit('refreshDataList', this.selectAreaData)
    }
  }
}
</script>
