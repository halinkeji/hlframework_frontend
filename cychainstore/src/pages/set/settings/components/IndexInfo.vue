<template>
  <div class="fit column no-wrap  justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-pa-sm full-height ">
      <div style="overflow-y: scroll;" class="fit full-height">
        <q-form ref="dataForm">
          <div class="row">
            <div class="col-md-10 col-12">
              <div class="row q-mt-md">
                <div class="col-md-6 col-12 q-pr-sm">
                  <span>商家名称 <span class="text-red q-pl-xs">*</span></span>
                  <q-input outlined bottom-slots v-model="dataFrom.name" dense lazy-rules maxlength="255" :rules="[(val) => !!val || '商家名称是必填项']"> </q-input>
                </div>
                <div class="col-md-6 col-12 q-pl-sm">
                  <span>联系人</span>
                  <q-input outlined bottom-slots maxlength="50" v-model="dataFrom.contact_people" dense> </q-input>
                </div>
              </div>
              <div class="row">
                <div class="col-md-6 col-12 q-pr-sm">
                  <span>联系电话</span>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="dataFrom.contact_tel"
                    dense

                  >
                  </q-input>
                  <!-- :rules="[(val) => !!val || '请填写联系电话', (val) => /^(1[3|4|5|6|7|8|9])\d{9}$|^0\d{2,3}-?\d{7,8}$/.test(val) || '联系电话不正确']" -->
                </div>
                <div class="col-md-6 col-12 q-pl-sm">
                  <span>手机号<span class="text-red q-pl-xs">*</span></span>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="dataFrom.contact_moblie"
                    dense
                    lazy-rules
                    :rules="[(val) => !!val || '请填写手机号']"
                  >
                  </q-input>
                  <!-- :rules="[(val) => !!val || '请填写手机号', (val) => /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val) || '电话号不正确']" -->
                </div>
                <div class="col-md-6 col-12 q-pr-sm">
                  <span>经度</span>
                  <q-input outlined bottom-slots v-model="dataFrom.lng" dense> </q-input>
                </div>
                <div class="col-md-6 col-12">
                  <span>纬度</span>
                  <q-input outlined bottom-slots v-model="dataFrom.lat" dense>
                    <template v-slot:after
                      ><q-btn v-if="!addressMap" unelevated @click="showQqMap(dataFrom.lat, dataFrom.lng)" color="blue-6" label="选择坐标" class="full-width q-pt-xs"> </q-btn
                      ><q-btn v-if="addressMap" unelevated @click="addressMap = false" color="red" label="关闭选择" class="full-width q-pt-xs"
                    /></template>
                  </q-input>
                </div>
              </div>

              <div>
                <span>所在区域</span>
                <hl-address
                  :province="dataFrom.province"
                  :city="dataFrom.city"
                  :area="dataFrom.district"
                  :cityCode="dataFrom.adcode"
                  @province="provinceupdate"
                  @city="cityupdate"
                  @area="areaupdate"
                ></hl-address>
              </div>
              <hl-qq-map @getAddressInfo="getAddressInfo" v-if="addressMap" ref="qqMap"></hl-qq-map>
            </div>
          </div>
          <div class="row q-mt-lg">
            <div class="col-8">
              <span class="text-subtitle1">详细地址</span>
              <q-input outlined maxlength="255" bottom-slots v-model="dataFrom.address" dense> </q-input>
            </div>
          </div>

          <div class="row q-pt-md text-center">
            <div class="col-3 text-left">
              <hl-upload
                :multiple="false"
                :currentAttach="dataFrom.logoData"
                @input="(val)=>{ $nextTick(()=>{ dataFrom.logo = val })}"
                currentDescription="商家logo图，建议尺寸为100*100"
              />
            </div>
            <div class="col-9 text-left">
              <hl-upload
                :multiple="true"
                :currentAttach="dataFrom.loopImage"
                :maxTotal="5"
                @input="(val)=>{ $nextTick(()=>{ dataFrom.loop_image = val })}"
                currentDescription="门店展示图,尺寸建议宽度为600*350,最多为5张"
              />
            </div>
          </div>

          <div class="row q-mt-sm">
            <div class="col-12 col-md-8">
              <hl-editor
                @change="
                  (v) => {
                    dataFrom.description = v
                  }
                "
                :content="dataFrom.description"
                :minHeight="$q.screen.height * 0.4"
                titleText="商家简介"
              ></hl-editor>
            </div>
          </div>
        </q-form>
      </div>
    </div>
    <div class="col-shrink bg-white q-py-sm text-center q-mt-xs">
      <q-btn class="q-px-xl" unelevated color="blue-6" label="保存" @click="saveBut()" />
    </div>

  </div>
</template>

<script>
export default {
  name: 'IndexMerchantInfo',
  components: {},
  data () {
    return {
      dataFrom: {
        loop_image: [],
        province: '',
        city: '',
        district: '',
        province_code: '',
        city_code: '',
        district_code: '',
        name: '',
        contact_people: '',
        contact_tel: '',
        lng: '',
        lat: '',
        address: '',
        contact_moblie: '',
        logo: '',
        description: '',
        urlsrc: '',
        trade_id: '',
        id: ''
      },
      imageData: false,
      multiple: false,
      addressMap: false
    }
  },
  mounted () {
    this.getItemData()
  },
  created () {},
  computed: {},
  methods: {
    getItemData () {
      this.$store
        .dispatch('settings/getData')
        .then((res) => {
          if (res.code == 200) {
            this.dataFrom = res.data ? res.data : {}
            if (this.dataFrom && this.dataFrom.loop_image) {
              this.dataFrom.loop_image = this.dataFrom.loop_image.split(',')
            } else {
              this.dataFrom.loop_image = []
            }
          }
        })
        .catch((error) => {})
    },
    saveBut () {
      this.$refs.dataForm.validate().then((success) => {
        if (success) {
          this.addStoreSidebar = false
          const obj = {
            ...this.dataFrom
          }
          this.$store
            .dispatch('settings/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '修改门店信息成功',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  position: 'top-right',
                  timeout: 500
                })
                this.getItemData()
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                position: 'top-right',
                timeout: 500
              })
            })
        }
      })
    },
    provinceupdate (a) {
      this.dataFrom.province = a.value
      this.dataFrom.province_code = a.code
    },

    cityupdate (a) {
      this.dataFrom.city = a.value
      this.dataFrom.city_code = a.code
    },

    areaupdate (a) {
      this.dataFrom.district = a.value
      this.dataFrom.district_code = a.code
    },

    showQqMap () {
      this.addressMap = true

      this.$nextTick(() => {
        this.$refs.qqMap.modelMap(this.dataFrom.lat, this.dataFrom.lng)
      })
    },
    getAddressInfo (val) {
      if (val.ad_info) {
        const ad_info = val.ad_info

        if (ad_info.adcode) {
          this.dataFrom.adcode = ad_info.adcode
          this.dataFrom.province = ad_info.province
          this.dataFrom.city = ad_info.city
          this.dataFrom.district = ad_info.district
          this.dataFrom.district_code = ad_info.adcode
        }

        if (val.formatted_addresses && val.formatted_addresses.recommend) {
          this.dataFrom.address = val.formatted_addresses.recommend
        }
        if (ad_info.location) {
          this.dataFrom.lng = ad_info.location.lng
          this.dataFrom.lat = ad_info.location.lat
        }
      }
    }
  }
}
</script>
