<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-pa-sm full-height">
      <div style="overflow-y: scroll" class="fit full-height">
        <q-form ref="dataForm" class="row q-col-gutter-sm">
          <div class="col-md-6 col-12">
            <q-input
              outlined
              bottom-slots
              v-model="dataFrom.name"
              label
              dense
              lazy-rules
              maxlength="255"
              :rules="[(val) => !!val || '平台名称是必填项']"
            >
              <template v-slot:label> 平台名称<span class="text-red text-weight-bold"> *</span> </template>
            </q-input>
          </div>

          <div class="col-md-6 col-12">
            <q-input outlined label="联系人" bottom-slots maxlength="50" v-model="dataFrom.contact_people" dense> </q-input>
          </div>

          <div class="col-md-6 col-12">
            <q-input
              outlined
              bottom-slots
              v-model="dataFrom.contact_tel"
              dense
              label
            >
              <template v-slot:label> 联系电话 </template>
            </q-input>
          </div>

          <div class="col-md-6 col-12">
            <q-input
              outlined
              bottom-slots
              v-model="dataFrom.contact_moblie"
              dense
              label="手机号*"
              lazy-rules
              :rules="[
                (val) => !!val || '请填写手机号',
                (val) => /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val) || '电话号不正确',
              ]"
            >
              <template v-slot:label> 手机号<span class="text-red text-weight-bold"> *</span> </template>
            </q-input>
          </div>

          <div class="col-md-6 col-12">
            <q-input outlined bottom-slots label="经度" v-model="dataFrom.lng" dense> </q-input>
          </div>

          <div class="col-md-6 col-12">
            <q-input outlined bottom-slots v-model="dataFrom.lat" dense>
              <template v-slot:after>
                <q-btn
                  v-if="!addressMap"
                  unelevated
                  @click="showQqMap(dataFrom.lat, dataFrom.lng)"
                  color="blue-6"
                  label="选择坐标"
                  class="full-width q-pt-xs"
                >
                </q-btn
                ><q-btn v-if="addressMap" unelevated @click="addressMap = false" color="red" label="关闭选择" class="full-width q-pt-xs"
              /></template>
            </q-input>
          </div>

          <div class="col-12 q-pb-md">
            <hl-address
              :province="dataFrom.province"
              :city="dataFrom.city"
              :area="dataFrom.district"
              :cityCode="dataFrom.adcode"
              @province="provinceupdate"
              @city="cityupdate"
              @area="areaupdate"
              :requiredStatus="true"
            ></hl-address>
          </div>

          <div class="col-12">
            <q-input outlined maxlength="255" label="详细地址" bottom-slots v-model="dataFrom.address" dense>

            </q-input>
          </div>
    <hl-qq-map @getAddressInfo="getAddressInfo" v-if="addressMap" ref="qqMap"></hl-qq-map>

          <div class="col-3 text-left">
            <hl-upload
              :multiple="false"
              :currentAttach="dataFrom.logoData"
              @input="
                (val) => {
                  $nextTick(() => {
                    dataFrom.logo = val;
                  });
                }
              "
              currentDescription="平台logo图，建议尺寸为100*100"
            />
          </div>
          <div class="col-9 text-left">
            <hl-upload
              :multiple="true"
              :currentAttach="dataFrom.loopImage"
              :maxTotal="5"
              @input="
                (val) => {
                  $nextTick(() => {
                    dataFrom.loop_image = val;
                  });
                }
              "
              currentDescription="Banner,尺寸建议宽度为600*350,最多为5张"
            />
          </div>

          <div class="col-12 col-md-8">
            <hl-editor
              @change="
                (v) => {
                  dataFrom.description = v;
                }
              "
              :content="dataFrom.description"
              :minHeight="$q.screen.height * 0.4"
              titleText="平台简介"
            ></hl-editor>
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
                  caption: '修改平台信息成功',
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
