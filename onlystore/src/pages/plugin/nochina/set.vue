<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="left" narrow-indicator>
          <q-tab name="set" label="基础设置" />
          <q-tab name="code" label="区号设置" />
        </q-tabs>
      </div>

      <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs" v-if="tab == 'set'">
        <q-scroll-area class="fit full-height">
          <q-form ref="dataFrom" class="row">
            <div class="col-6" v-if="is_main_store">
              <q-input outlined dense label="谷歌地图key" v-model="dataFrom.nc_google_map_key" placeholder="请输入谷歌地图key">
                <template v-slot:hint> 谷歌地图key </template>
              </q-input>
            </div>

            <div class="row q-my-sm">
              <div class="col-2 q-pr-xs">
                <q-input outlined dense label="经度" v-model="addressData.lng" disable> </q-input>
              </div>
              <div class="col-2 q-pr-xs">
                <q-input outlined dense label="经度" v-model="addressData.lat" disable> </q-input>
              </div>
              <div class="col-2 q-pr-xs">
                <q-input outlined dense label="省" v-model="addressData.province" disable> </q-input>
              </div>
              <div class="col-2 q-pr-xs">
                <q-input outlined dense label="市" v-model="addressData.city" disable> </q-input>
              </div>
              <div class="col-2 q-pr-xs">
                <q-input outlined dense label="区" v-model="addressData.district" disable> </q-input>
              </div>
              <div class="col-2 q-pr-xs">
                <q-input outlined dense label="详细地址" v-model="addressData.address"> </q-input>
              </div>
            </div>

            <q-card flat class="full-width" v-if="currentConfig && currentConfig.nc_google_map_key">
              <q-card-section>
                <div class="row items-center no-wrap">
                  <div class="col">
                    <gmap-autocomplete placeholder="请搜索地址" @place_changed="setPlace"> </gmap-autocomplete>
                  </div>

                  <div class="col-auto">
                    <q-btn unelevated color="primary" @click="usePlace" label="搜索" />
                  </div>
                </div>
              </q-card-section>

              <q-separator />

              <q-card-section v-if="currentConfig && currentConfig.nc_google_map_key">
                <Gmap-Map class="full-width" :style="{ height: this.$q.screen.height * 3 + 'px' }" :zoom="4" :center="{ lat: 0, lng: 0 }">
                  <Gmap-Marker v-for="(marker, index) in markers" :key="index" :position="marker.position"></Gmap-Marker>
                  <Gmap-Marker
                    v-if="this.place"
                    label="&#x2605;"
                    :position="{
                      lat: this.place.geometry.location.lat() ? this.place.geometry.location.lat() : 111.75199,
                      lng: this.place.geometry.location.lng() ? this.place.geometry.location.lng() : 40.8414899,
                    }"
                  ></Gmap-Marker>
                </Gmap-Map>
              </q-card-section>
            </q-card>
          </q-form>
        </q-scroll-area>
      </div>
      <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs" v-if="tab == 'code'">
        <code-list />
      </div>

      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs" v-if="tab == 'set'">
        <q-btn unelevated color="primary" label="保存" class="q-px-xl" :disable="addSidebar" @click="saveBut()" />
      </div>
    </div>
  </q-page>
</template>

<script>
import Vue from 'vue'
import GmapVue from 'gmap-vue'
import { LocalStorage } from 'quasar'
const nochainConfig = LocalStorage.getItem('onlystroe_system_local').nochainConfig
if (nochainConfig && nochainConfig.nc_google_map_key) {
  Vue.use(GmapVue, {
    load: {
      key: nochainConfig.nc_google_map_key,
      libraries: 'places' // This is required if you use the Autocomplete plugin
      // OR: libraries: 'places,drawing'
      // OR: libraries: 'places,drawing,visualization'
      // (as you require)

    /// / If you want to set the version, you can do so:
    // v: '3.26',
    },

    /// / If you intend to programmatically custom event listener code
    /// / (e.g. `this.$refs.gmap.$on('zoom_changed', someFunc)`)
    /// / instead of going through Vue templates (e.g. `<GmapMap @zoom_changed="someFunc">`)
    /// / you might need to turn this on.
    // autobindAllEvents: false,

    /// / If you want to manually install components, e.g.
    /// / import {GmapMarker} from 'gmap-vue/src/components/marker'
    /// / Vue.component('GmapMarker', GmapMarker)
    /// / then set installComponents to 'false'.
    /// / If you want to automatically install all the components this property must be set to 'true':
    installComponents: true
  })
}

import CodeList from './CodeList.vue'
export default {
  name: 'noChinaSet',
  components: {
    CodeList
  },
  data () {
    return {
      tab: 'set',
      dataFrom: {
        nc_google_map_key: ''
      },
      addressData: {
        lng: '',
        lat: '',
        address: '',
        province: '', // 省
        city: '', // 市
        district: '' // 区
      },
      addSidebar: false,
      multiple: false,
      uploadImgStatus: false,
      markers: [],
      place: null,
      currentConfig: {}
    }
  },
  created () {},
  mounted () {
    this.getItemData()
    this.currentConfig = LocalStorage.getItem('onlystore_plugins_local').nochainConfig
  },

  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getItemData () {
      this.$store
        .dispatch('nochina/getConfig', this.dataFrom.id)
        .then((res) => {
          if (res.code == 200) {
            this.dataFrom = res.data ? res.data.config : {}

            this.addressData = res.data ? res.data.address : {}
          }
        })
        .catch((error) => {})
    },
    saveBut () {
      this.$refs.dataFrom.validate().then((success) => {
        if (success) {
          this.addSidebar = true
          const obj = {
            ...this.dataFrom,
            addressData: this.addressData
          }
          this.$store
            .dispatch('nochina/setConfig', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.addSidebar = false
              } else {
                this.addSidebar = false
              }
            })
            .catch((error) => {
              this.addSidebar = false
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                position: 'top-right'
              })
            })
        }
      })
    },
    getImageData (v) {
      this.uploadImgStatus = false
      const that = this
      if (v) {
        if (that.imageType == 'qrcode') {
          v.forEach((item) => {
            that.dataFrom.pwa_qrcode = item.path
          })
        } else {
          v.forEach((item) => {
            that.dataFrom.pwa_avatar = item.path
          })
        }
      }
    },
    delImage (val) {
      if (val == 'qrcode') {
        this.dataFrom.pwa_qrcode = ''
      } else {
        this.dataFrom.pwa_avatar = ''
      }
    },
    closeUpload (v) {
      this.uploadImgStatus = false
    },
    clickImage (val) {
      this.multiple = false
      this.imageType = val
      this.$nextTick(() => {
        this.uploadImgStatus = true
      })
    },
    uplodMultipleImgSubmit () {
      this.multiple = true
      this.$nextTick(() => {
        this.uploadImgStatus = true
      })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    },
    setDescription (description) {
      this.description = description
    },
    setPlace (place) {
      this.place = place
    },
    usePlace (place) {
      if (this.place) {
        this.markers.push({
          position: {
            lat: this.place.geometry.location.lat(),
            lng: this.place.geometry.location.lng()
          }
        })
        console.log(this.place)

        this.addressData.lng = this.place.geometry.location.lng()
        this.addressData.lat = this.place.geometry.location.lat()

        if (this.place.address_components && this.place.address_components.length > 0) {
          // <span class="extended-address">赛罕区</span>

          // <span class="postal-code">邮政编码: 010051</span>   <span class="postal-code">V6C 2R7</span>

          // <span class="locality">呼和浩特市</span> <span class="locality">Vancouver</span>

          // <span class="country-name">中国</span> <span class="country-name">加拿大</span>

          // <span class="region">内蒙古自治区</span> <span class="region">BC</span>

          // <span class="street-address">空港大道</span> <span class="street-address">655 Burrard St</span>

          const addressData = this.place.address_components
          for (let i = 0; i < this.place.address_components.length; i++) {
            console.log('xx', addressData[i])
            if (addressData[i].types && addressData[i].types.length > -1) {
              if (addressData[i].types.indexOf('administrative_area_level_1') > -1) {
                this.addressData.province = addressData[i].long_name
              }

              if (addressData[i].types.indexOf('locality') > -1) {
                this.addressData.city = addressData[i].long_name
              }

              if (addressData[i].types.indexOf('administrative_area_level_2') > -1) {
                this.addressData.district = addressData[i].long_name
              }

              if (addressData[i].types.indexOf('sublocality_level_1') > -1) {
                this.addressData.district = addressData[i].long_name
              }

              if (addressData[i].types.indexOf('route') > -1) {
                this.addressData.address = addressData[i].long_name
              }
            }
          }
        }

        this.place = null
      }
    }
  }
}
</script>
