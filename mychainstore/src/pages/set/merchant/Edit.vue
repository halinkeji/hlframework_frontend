<template>
  <q-dialog @hide="hideNowPage" v-model="dialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.6) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.6) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-pa-sm items-center">
          <div class="text-subtitle2">{{ nowStoreId ? '修改' : '新增' }}门店信息</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <q-separator />
        <div class="col-shrink bg-white q-pa-sm full-height">
          <div style="overflow-y: scroll" class="fit full-height">
            <q-form ref="dataForm">
              <div class="row q-col-gutter-sm">
                <div class="col-md-6 col-12">
                  <q-input
                    outlined
                    bottom-slots
                    v-model="dataFrom.name"
                    dense
                    lazy-rules
                    label
                    maxlength="255"
                    :rules="[(val) => !!val || '商家名称是必填项']"
                  >
                    <template v-slot:label>
                      <span>商家名称 <span class="text-red q-pl-xs">*</span></span>
                    </template>
                  </q-input>
                </div>
                <div class="col-md-6 col-12">
                  <q-input outlined bottom-slots maxlength="50" label v-model="dataFrom.contact_people" dense>
                    <template v-slot:label>
                      <span>联系人</span>
                    </template>
                  </q-input>
                </div>

                <div class="col-md-6 col-12">

                  <q-input outlined bottom-slots label v-model="dataFrom.contact_tel" dense>
                    <template v-slot:label>
                      <span>联系电话</span>
                    </template>
                  </q-input>
                  <!-- :rules="[(val) => !!val || '请填写联系电话', (val) => /^(1[3|4|5|6|7|8|9])\d{9}$|^0\d{2,3}-?\d{7,8}$/.test(val) || '联系电话不正确']" -->
                </div>
                <div class="col-md-6 col-12">

                  <q-input outlined bottom-slots v-model="dataFrom.contact_moblie" label dense lazy-rules :rules="[(val) => !!val || '请填写手机号']">
                    <template v-slot:label>
                      <span>手机号<span class="text-red q-pl-xs">*</span></span>
                    </template>
                  </q-input>
                  <!-- :rules="[(val) => !!val || '请填写手机号', (val) => /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val) || '电话号不正确']" -->
                </div>
                <div class="col-md-6 col-12">
                  <q-input outlined bottom-slots v-model="dataFrom.lng" label="经度" dense> </q-input>
                </div>
                <div class="col-md-6 col-12">

                  <q-input outlined bottom-slots v-model="dataFrom.lat" label="纬度" dense>
                    <template v-slot:after><q-btn
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

                <div class="col-6">
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
                <div class="col-6">

                  <q-input outlined maxlength="255" label="详细地址" bottom-slots v-model="dataFrom.address" dense> </q-input>
                </div>
                <div class="col-12">
                  <hl-qq-map @getAddressInfo="getAddressInfo" v-if="addressMap" ref="qqMap"></hl-qq-map>
                </div>

                <div class="col-6">
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
                    currentDescription="商家logo图，建议尺寸为100*100"
                  />
                </div>
                <div class="col-6">
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
                    currentDescription="门店展示图,尺寸建议宽度为600*350,最多为5张"
                  />
                </div>

                <div class="col-12 q-px-sm">
                  <hl-editor
                    @change="
                      (v) => {
                        dataFrom.description = v;
                      }
                    "
                    :content="dataFrom.description"
                    :minHeight="$q.screen.height * 0.4"
                    titleText="商户简介"
                  ></hl-editor>
                </div>
              </div>
            </q-form>
          </div>
        </div>
        <q-separator />
        <div class="col-shrink bg-white q-py-sm text-center q-mt-xs">
          <q-btn class="q-px-xl q-mx-xs" unelevated color="blue-6" label="保存" @click="saveBut()" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'editMerchant',
  components: {},
  data () {
    return {
      nowStoreId: 0,
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

      addressMap: false,
      dialogStatus: false
    }
  },
  created () {},
  methods: {
    init (storeId) {
      this.dialogStatus = true

      if (storeId > 0) {
        this.nowStoreId = storeId
        this.getItemData()
      }
    },
    getItemData () {
      this.$store
        .dispatch('settings/getData', {
          store_id: this.nowStoreId
        })
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
                this.hideNowPage()
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
    hideNowPage () {
      this.dialogStatus = false
      this.$emit('getMethods')
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
