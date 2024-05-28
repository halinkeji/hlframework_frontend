<template>
  <q-dialog @hide="hideNowPage" v-model="dialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-py-sm">
          <div class="text-subtitle2">邀请商家</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink bg-white q-pa-sm full-height">
          <div style="overflow-y: scroll" class="fit full-height">
            <div class="col-12">
              <q-select
                dense
                outlined
                map-options
                emit-value
                option-value="apply_id"
                option-label="client_name"
                v-model="setConfigData.apply_id"
                :options="applyDataList"
                label="应用"
                @input="getLibDataList"
                bottom-slots
              >
                <template v-slot:append>
                  <q-icon color="grey" v-if="setConfigData.apply_id" @click="clearApply" name="cancel"></q-icon>
                </template>
              </q-select>
            </div>

            <div class="col-12">
              <q-select
                dense
                outlined
                map-options
                emit-value
                option-value="id"
                option-label="name"
                v-model="setConfigData.lib_id"
                :options="libDataList"
                label="总部"
                @input="getStoreDataList"
                bottom-slots
              >
                <template v-slot:append>
                  <q-icon color="grey" v-if="setConfigData.lib_id" @click="clearStore" name="cancel"></q-icon>
                </template>
              </q-select>
            </div>

            <div class="col-12">
              <q-select
                dense
                outlined
                map-options
                emit-value
                option-value="id"
                option-label="name"
                v-model="setConfigData.store_id"
                :options="storeDataList"
                clearable
                bottom-slots
                label="店铺"
              />
            </div>

            <div class="col-12">
                <q-card bordered flat>
                  <q-card-section> 支付方式 </q-card-section>
                  <q-separator />

                  <q-list>
                    <q-item>
                      <q-item-section>
                        <q-item-label>微信小程序支付 </q-item-label>
                        <q-item-label caption>
                          会员可在微信小程序内在线支付购买商家服务或者商品，会员支付的费用，商家可根据T+0/1结算方式，从平台结算。
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>

                         <q-checkbox  v-model="payConfig.payment" val="wxapp_jsapi" />
                      </q-item-section>
                    </q-item>

                    <q-item>
                      <q-item-section>
                        <q-item-label>付款码支付 （数字支付） </q-item-label>
                        <q-item-label caption> 付款码支付是指用户展示“付款码”给商户系统扫描后直接完成支付，适用于线下场所面对面收银的场景，例如商超、便利店、餐饮、医院、学校、电影院和旅游景区等具有明确经营地址的实体场所。 </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                         <q-checkbox  v-model="payConfig.payment" val="wechat_micropay" />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </div>

              <div class="col-12 q-mt-sm">
                <q-card bordered flat>
                  <q-card-section> 结算方式 </q-card-section>
                  <q-separator />

                  <q-list>
                    <q-item>
                      <q-item-section>
                        <q-item-label>结算周期 </q-item-label>
                        <q-item-label caption>
                           T + 0 : 消费后的当天即可进行提现，非交易日也可以进行提现（交易日为：周一至周五）。
                           T + 1 : 消费后的第二天可进行提现，必须在交易日才可以进行提现（交易日为：周一至周五）。
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>

                        <q-option-group
                          v-model="withdrawConfig.withdrawCycle"
                          :options="[
                            {
                              label: 'T + 0',
                              value: 0,
                            },
                            {
                              label: 'T + 1',
                              value: 1,
                            },
                          ]"
                          color="primary"
                          inline
                        />

                      </q-item-section>
                    </q-item>

                  </q-list>
                </q-card>
              </div>
          </div>
        </div>
        <div class="col-shrink bg-white q-py-sm text-center q-mt-xs q-gutter-sm">
          <q-btn class="q-px-xl" unelevated color="blue-6" label="保存" @click="saveBut()" />
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
        id: '',
        apply_id: ''
      },

      addressMap: false,
      dialogStatus: false,
      storeId: 0,
      applyListData: [],
      tradeListData: [],
      merchantFrom: {
        pmm_status: '1'
      },
      clickDisable: true,
      phoneDisable: false,
      extendForm: {
        id_card: [],
        license: [],
        store_user_id: 0,
        manage_type: ''
      },
      payConfig: {
        usePlatformBalance: 0,
        usePlatformPoints: 0,
        usePlatformCoupon: 0,
        payment: []
      },
      withdrawConfig: {
        withdrawCycle: 1, // 提现周期 0 T+0 1 T+1
        minWithdrawAmount: 0, // 最低提现金额
        serviceChargeRatio: 0, // 服务费或者交易分佣
        precedureFeeRatio: 0 // 手续费比例
      },
      applyDataList: [],
      libDataList: [],
      storeDataList: [],

      setConfigData: {
        apply_id: '',
        lib_id: '',
        store_id: ''
      }
    }
  },
  created () {},
  methods: {
    init () {
      this.dialogStatus = true

      this.getApplyData()
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
      that.$store
        .dispatch('merchantManage/verifyMobileOnly', {
          contact_moblie: that.dataFrom.contact_moblie
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            that.phoneDisable = true
          } else {
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

    saveBut () {
      const obj = {
        formData: {
          payConfig: this.payConfig,
          withdrawConfig: this.withdrawConfig,
          pmm_status: '1'
        },
        set_config: this.setConfigData
      }
      this.$store
        .dispatch('merchantManage/merchantApplyJoinData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              message: '成功',
              caption: '添加成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.hideNowPage()
          } else {
            this.$q.notify({
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '失败',
              caption: res.message,
              color: 'red'
            })
          }
        })
        .catch((error) => {})
    },

    hideNowPage () {
      this.dialogStatus = false
      this.$nextTick(() => {
        this.$emit('closeDialog')
      })
    },

    getApplyData () {
      this.$store
        .dispatch('settings/getApplyListData')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.applyDataList = res.data
          }
        })
        .catch((error) => {})
    },
    getLibDataList () {
      this.setConfigData.lib_id = ''
      this.setConfigData.store_id = ''
      this.userListAll = []
      this.storeDataList = []
      this.libDataList = []
      this.$store
        .dispatch('settings/getAllStore', {
          apply_id: this.setConfigData.apply_id
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.libDataList = res.data
          }
        })
        .catch((error) => {})
    },
    getStoreDataList () {
      this.setConfigData.store_id = ''
      this.storeDataList = []
      this.userListAll = []
      this.$store
        .dispatch('settings/getAllStore', {
          lib_id: this.setConfigData.lib_id
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.storeDataList = res.data
          }
        })
        .catch((error) => {})
    },
    clearStore () {
      this.searchData.search_store = ''
      this.searchData.search_lib = ''
      this.storeDataList = []
      this.userListAll = []
    },
    clearApply () {
      this.searchData.search_apply = ''
      this.searchData.search_lib = ''
      this.searchData.search_store = ''

      this.storeDataList = []
      this.libDataList = []
    }
  }
}
</script>
