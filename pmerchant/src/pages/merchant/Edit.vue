<template>
  <q-dialog @hide="hideNowPage" v-model="dialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.5) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-py-sm">
          <div class="text-subtitle2">{{ nowStoreId ? '修改' : '新增' }}门店</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink bg-white q-pa-sm full-height">
          <div style="overflow-y: scroll" class="fit full-height">
            <q-form ref="dataForm" class="row q-col-gutter-sm">
              <div class="col-md-4 col-12">
                <q-select
                  outlined
                  v-model="dataFrom.trade_id"
                  map-options
                  emit-value
                  dense
                  option-label="name"
                  option-value="value"
                  :options="tradeListData"
                  :disable="!!dataFrom.id"
                  label="行业类型"
                  :rules="[(val) => !!val || '请选择行业类型']"
                  @input="inputTradeList"
                />
              </div>

              <div class="col-md-4 col-12">
                <q-select
                  outlined
                  v-model="extendForm.manage_type"
                  map-options
                  emit-value
                  dense
                  option-label="label"
                  option-value="value"
                  :options="applyListData"
                  :disable="!!dataFrom.id"
                  label="门店类型"
                  :rules="[(val) => !!val || '请选择门店类型']"
                />
              </div>
              <div class="col-md-4 col-12">
                <q-select
                  outlined
                  v-model="merchantFrom.pmm_status"
                  map-options
                  emit-value
                  dense
                  option-label="label"
                  option-value="value"
                  :options="[
                  {
                      label: '未提交申请',
                      value: '-3',
                    },
                  {
                      label: '审核不通过',
                      value: '-2',
                    },
                    {
                      label: '待审核',
                      value: '-1',
                    },
                    {
                      label: '停用',
                      value: '0',
                    },
                    {
                      label: '运营中',
                      value: '1',
                    },
                  ]"
                  disable
                  label="状态"
                  :rules="[(val) => !!val || '请选择门店状态']"
                />
              </div>

              <div class="col-12">
                <span>商家名称 <span class="text-red q-pl-xs">*</span></span>
                <q-input
                  outlined
                  bottom-slots
                  v-model="dataFrom.name"
                  dense
                  lazy-rules
                  maxlength="255"
                  :rules="[(val) => !!val || '商家名称是必填项']"
                >
                </q-input>
              </div>

              <div class="col-md-4 col-12">
                <span>联系人</span>
                <q-input outlined bottom-slots maxlength="50" v-model="dataFrom.contact_people" dense> </q-input>
              </div>
              <div class="col-md-4 col-12">
                <span>联系电话</span>
                <q-input outlined bottom-slots v-model="dataFrom.contact_tel" dense> </q-input>
                <!-- :rules="[(val) => !!val || '请填写联系电话', (val) => /^(1[3|4|5|6|7|8|9])\d{9}$|^0\d{2,3}-?\d{7,8}$/.test(val) || '联系电话不正确']" -->
              </div>
              <div class="col-md-4 col-12">
                <span>手机号<span class="text-red q-pl-xs">*</span></span>

                <q-input
                  hint="创建门店时手机号默认注册为管理账号"
                  outlined
                  bottom-slots
                  :disable="!!(phoneDisable || dataFrom.id)"
                  @input="inputPhoneNumber"
                  :rules="[
                    (val) => !!val || '请填写手机号',
                    (val) => /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val) || '电话号不正确',
                  ]"
                  v-model="dataFrom.contact_moblie"
                  dense
                  lazy-rules
                >
                  <template v-slot:after>
                    <q-btn
                      dense
                      v-if="!!(phoneDisable && !dataFrom.id) && !activateMode"
                      flat
                      label="更改手机号"
                      @click="
                        dataFrom.contact_moblie = '';
                        phoneDisable = false;
                      "
                    />
                  </template>
                </q-input>
              </div>
              <div class="col-md-6 col-12">
                <span>经度</span>
                <q-input outlined bottom-slots v-model="dataFrom.lng" dense> </q-input>
              </div>
              <div class="col-md-6 col-12">
                <span>纬度</span>
                <q-input outlined bottom-slots v-model="dataFrom.lat" dense>
                  <template v-slot:after
                    ><q-btn
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

              <div class="col-12">
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
                <hl-qq-map @getAddressInfo="getAddressInfo" v-if="addressMap" ref="qqMap"></hl-qq-map>
              </div>

              <div class="col-12">
                <span class="text-subtitle1">详细地址</span>
                <q-input outlined maxlength="255" bottom-slots v-model="dataFrom.address" dense> </q-input>
              </div>

              <div class="row q-pt-md text-center col-12">
                <div class="col-6 text-left">
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
                <div class="col-6 text-left">
                  <hl-upload
                    :multiple="true"
                    :currentAttach="dataFrom.loopImage"
                    :maxTotal="6"
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
              </div>

              <div class="col-12 q-pa-sm">
                <hl-editor
                  @change="
                    (v) => {
                      dataFrom.description = v;
                    }
                  "
                  :content="dataFrom.description"
                  :minHeight="$q.screen.height * 0.4"
                  titleText="商家简介"
                ></hl-editor>
              </div>

            </q-form>
          </div>
        </div>
        <div class="col-shrink bg-white q-py-sm text-center q-mt-xs q-gutter-sm">
          <q-btn class="q-px-xl" unelevated color="blue-6" :disable="!(clickDisable && phoneDisable)" label="保存" @click="saveBut()" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { LocalStorage } from 'quasar'
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
        id: '',
        apply_id: ''
      },

      addressMap: false,
      dialogStatus: false,
      storeId: 0,
      applyListData: [],
      tradeListData: [],
      merchantFrom: {
        pmm_status: '-1',
        pmm_check_identity: '-1'
      },
      clickDisable: true,
      phoneDisable: false,
      extendForm: {
        id_card: [],
        license: [],
        store_user_id: 0,
        manage_type: '',
        apply_source: '3'
      },
      payConfig: {
        usePlatformBalance: 0,
        usePlatformPoints: 0,
        usePlatformCoupon: 0,
        payment: []
      },
      withdrawConfig: {
        withdrawCycle: 1,
        minWithdrawAmount: 0,
        serviceChargeRatio: 0,
        precedureFeeRatio: 0
      },
      activateMode: false
    }
  },
  created () {},
  methods: {
    init (storeId, userData) {
      this.dialogStatus = true

      const storeLocal = LocalStorage.getItem('pmerchant_store_local')
      if (storeLocal) {
        this.tradeListData = storeLocal.tradeListData
      }
      if (storeId > 0) {
        this.nowStoreId = storeId
        this.$nextTick(() => {
          this.getItemData()
        })
      }

      if (userData && userData.id > 0) {
        this.phoneDisable = true
        this.dataFrom.contact_moblie = userData.mobile
        this.activateMode = true
      }
    },

    inputTradeList () {
      const that = this
      if (that.dataFrom.trade_id) {
        const findIndex = _.findIndex(that.tradeListData, function (o) {
          return o.value == that.dataFrom.trade_id
        })

        if (findIndex > -1) {
          this.applyListData = that.tradeListData[findIndex].model
        } else {
          this.applyListData = []
        }
      } else {
        this.applyListData = []
      }
    },

    inputPhoneNumber () {
      const that = this
      if (that.dataFrom && that.dataFrom.contact_moblie) {
        if (that.dataFrom.contact_moblie.length == 11) {
          this.verifyMobileOnly()
        }
      }
    },

    verifyMobileOnly () {
      const that = this
      that.phoneDisable = true
      that.$store
        .dispatch('merchantManage/verifyMobileOnly', {
          contact_moblie: that.dataFrom.contact_moblie
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            that.phoneDisable = true
          } else {
            that.phoneDisable = false
            that.dataFrom.contact_moblie = ''

            this.$q.notify({
              message: '失败',
              caption: '手机号重复，请更换',
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right',
              timeout: 2000
            })
          }
        })
        .catch((error) => {})
    },

    getItemData () {
      const that = this
      this.$store
        .dispatch('merchantManage/getData', {
          id: this.nowStoreId
        })
        .then((res) => {
          if (res.code == 200) {
            this.dataFrom = res.data && res.data.dataFrom ? res.data.dataFrom : {}
            this.merchantFrom = res.data && res.data.merchantFrom ? res.data.merchantFrom : {}
            this.extendForm = res.data && res.data.extendForm ? res.data.extendForm : {}

            if (this.extendForm && this.extendForm.pay_config) {
              for (const x in this.extendForm.pay_config) {
                this.payConfig[x] = this.extendForm.pay_config[x]
              }
            }

            if (this.extendForm && this.extendForm.withdraw_config) {
              for (const x in this.extendForm.withdraw_config) {
                this.withdrawConfig[x] = this.extendForm.withdraw_config[x]
              }
            }
            this.phoneDisable = true
            const tradeIndex = _.findIndex(that.tradeListData, function (o) {
              return parseInt(o.value) == parseInt(that.dataFrom.trade_id)
            })

            if (tradeIndex > -1) {
              this.applyListData = that.tradeListData[tradeIndex].model
            }
          }
        })
        .catch((error) => {})
    },
    // getApplyList () {
    //   this.$store
    //     .dispatch('merchantManage/getApplyList', {})
    //     .then((res) => {
    //       if (res.code == 200) {
    //         this.applyListData = res.data && res.data ? res.data : []
    //       }
    //     })
    //     .catch((error) => {})
    // },
    saveBut () {
      this.$refs.dataForm.validate().then((success) => {
        if (success) {
          this.extendForm.pay_config = this.payConfig
          this.extendForm.withdraw_config = this.withdrawConfig

          const obj = {
            ...this.dataFrom,
            merchantFrom: this.merchantFrom,
            extendForm: {
              manage_type: this.extendForm.manage_type,
              store_user_id: this.extendForm.store_user_id,
              apply_source: this.extendForm.apply_source
            }
          }

          this.clickDisable = false
          this.$store
            .dispatch('merchantManage/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.addStoreSidebar = false
                this.clickDisable = true
                this.$q.notify({
                  message: '成功',
                  caption: '保存门店信息成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  position: 'top-right',
                  timeout: 500
                })
                this.hideNowPage()
              } else {
                this.clickDisable = true
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  position: 'top-right',
                  timeout: 500
                })
              }
            })
            .catch((error) => {
              this.clickDisable = true
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
    hideNowPage () {
      this.dialogStatus = false
      this.$nextTick(() => {
        this.$emit('closeDialog')
      })
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
