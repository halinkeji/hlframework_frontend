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
          <div class="text-subtitle2">身份认证</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink bg-white q-pa-sm full-height">
          <div style="overflow-y: scroll" class="fit full-height">
            <q-form ref="dataForm" class="row q-col-gutter-sm">
              <div class="col-12">
                <q-item class="bg-grey-2">
                  <q-item-section>
                    <q-item-label>身份认证状态</q-item-label>
                  </q-item-section>
                  <q-item-section side top>
                    <q-option-group
                      v-model="merchantFrom.pmm_check_identity"
                      disable
                      :options="[
                        {
                          label: '未提交认证信息',
                          value: '-1',
                        },
                        {
                          label: '认证中',
                          value: '2',
                        },
                        {
                          label: '认证成功',
                          value: '1',
                        },
                      ]"
                      color="primary"
                      inline
                    />
                  </q-item-section>
                </q-item>
              </div>
              <div class="col-6 text-left">
                <hl-upload
                  :maxTotal="2"
                  :multiple="true"
                  :currentAttach="extendForm.cardIdImage"
                  @input="
                    (val) => {
                      $nextTick(() => {
                        extendForm.id_card = val;
                      });
                    }
                  "
                  currentDescription="身份证正反面"
                />
              </div>

              <div class="col-6 text-left">
                <hl-upload
                  :multiple="true"
                  :currentAttach="extendForm.licenseImage"
                  :maxTotal="4"
                  @input="
                    (val) => {
                      $nextTick(() => {
                        extendForm.license = val;
                      });
                    }
                  "
                  currentDescription="上传门店经营资质照片,最多为5张"
                />
              </div>

              <div class="col-12" v-if="merchantFrom && parseInt(merchantFrom.pmm_status) == -1">
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
                        <q-checkbox checked-icon="check_box" unchecked-icon="check_box_outline_blank" v-model="payConfig.payment" val="wxapp_jsapi" />
                      </q-item-section>
                    </q-item>

                    <q-item>
                      <q-item-section>
                        <q-item-label>付款码支付 （数字支付） </q-item-label>
                        <q-item-label caption>
                          付款码支付是指用户展示“付款码”给商户系统扫描后直接完成支付，适用于线下场所面对面收银的场景，例如商超、便利店、餐饮、医院、学校、电影院和旅游景区等具有明确经营地址的实体场所。
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-checkbox
                          checked-icon="check_box"
                          unchecked-icon="check_box_outline_blank"
                          v-model="payConfig.payment"
                          val="wechat_micropay"
                        />
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </div>

              <div class="col-12" v-if="merchantFrom && parseInt(merchantFrom.pmm_status) == -1">
                <q-card bordered flat>
                  <q-card-section> 结算方式 </q-card-section>
                  <q-separator />

                  <q-list>
                    <q-item v-if="commonWithdrawConfig && parseInt(commonWithdrawConfig.zeroStatus) == 1">
                      <q-item-section>
                        <q-item-label>T + 0 </q-item-label>
                        <q-item-label caption> 消费后的当天即可进行提现，非交易日也可以进行提现（交易日为：周一至周五）。 </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-radio checked-icon="check_box" unchecked-icon="check_box_outline_blank" v-model="withdrawConfig.withdrawCycle" val="0" />
                      </q-item-section>
                    </q-item>
                    <q-item>
                      <q-item-section>
                        <q-item-label>T + 1 </q-item-label>
                        <q-item-label caption> 消费后的第二天可进行提现，必须在交易日才可以进行提现（交易日为：周一至周五）。 </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-radio checked-icon="check_box" unchecked-icon="check_box_outline_blank" v-model="withdrawConfig.withdrawCycle" val="1" />
                      </q-item-section>
                    </q-item>

                    <q-item v-if="commonWithdrawConfig && parseInt(commonWithdrawConfig.oneStatus) == 1">
                      <q-item-section>
                        <q-item-label>最低提现金额</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          outlined
                          bottom-slots
                          v-model="withdrawConfig.minWithdrawAmount"
                          dense
                          :rules="[(val) => (val ? /^(0|[1-9]\d*)(.\d{1,2})?$/.test(val) && val >= 1 : true) || '请输入正确的数值']"
                          class="q-px-md"
                        >
                        </q-input>
                      </q-item-section>
                    </q-item>

                    <q-item>
                      <q-item-section>
                        <q-item-label>交易分佣</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          outlined
                          bottom-slots
                          v-model="withdrawConfig.serviceChargeRatio"
                          dense
                          :rules="[
                            (val) =>
                              (val ? /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 0.01 && val <= 100 : true) || '请输入正确的数值',
                          ]"
                          class="q-px-md"
                        >
                          <template v-slot:append>
                            <div class="text-dark text-subtilte2">%</div>
                          </template>
                        </q-input>
                      </q-item-section>
                    </q-item>

                    <q-item>
                      <q-item-section>
                        <q-item-label>手续费比例</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-input
                          outlined
                          bottom-slots
                          v-model="withdrawConfig.precedureFeeRatio"
                          dense
                          :rules="[
                            (val) =>
                              (val ? /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 0.01 && val <= 100 : true) || '请输入正确的数值',
                          ]"
                          class="q-px-md"
                        >
                          <template v-slot:append>
                            <div class="text-dark text-subtilte2">%</div>
                          </template>
                        </q-input>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </div>

              <div class="col-12" v-if="merchantFrom && parseInt(merchantFrom.pmm_status) == 1">
                <q-card bordered flat>
                  <q-card-section class="text-center text-subtitle1 q-pa-sm text-weight-bold"> 消费方式 </q-card-section>

                  <q-separator />
                  <q-list separator>
                    <q-item v-if="parseInt(payConfig.usePlatformBalance) == 1">
                      <q-item-section>
                        <q-item-label>
                          <q-icon name="check_circle" color="positive" size="xs"></q-icon>启用平台{{
                            $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_balanceUnit
                          }}</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                    <q-item v-if="parseInt(payConfig.usePlatformPoints) == 1">
                      <q-item-section>
                        <q-item-label>
                          <q-icon name="check_circle" color="positive" size="xs"></q-icon> 启用平台{{
                            $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit
                          }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-if="parseInt(payConfig.usePlatformCoupon) == 1">
                      <q-item-section>
                        <q-item-label><q-icon name="check_circle" color="positive" size="xs"></q-icon>启用平台卡券</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </div>

              <div class="col-12" v-if="merchantFrom && parseInt(merchantFrom.pmm_status) == 1">
                <q-card bordered flat>
                  <q-card-section class="text-center text-subtitle1 q-pa-sm text-weight-bold"> 结算周期 </q-card-section>

                  <q-separator />
                  <q-list>
                    <q-item v-if="parseInt(withdrawConfig.withdrawCycle) == 0">
                      <q-item-section v-if="withdrawConfig.minWithdrawAmount">
                        <q-item-label><q-icon name="check_circle" color="positive" size="xs"></q-icon>T + 0 </q-item-label>
                        <q-item-label caption> 消费后的当天即可进行提现，非交易日也可以进行提现（交易日为：周一至周五）。 </q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item v-if="parseInt(withdrawConfig.withdrawCycle) == 1">
                      <q-item-section>
                        <q-item-label><q-icon name="check_circle" color="positive" size="xs"></q-icon>T + 1 </q-item-label>
                        <q-item-label caption> 消费后的第二天可进行提现，必须在交易日才可以进行提现（交易日为：周一至周五）。 </q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item>
                      <q-item-section>
                        <q-item-label>
                          <q-icon name="check_circle" color="positive" size="xs"></q-icon> 可享受最低提现金额【{{
                            withdrawConfig.minWithdrawAmount
                          }}元】，交易分佣比例 【{{ withdrawConfig.serviceChargeRatio }}%】，提现手续费比例 【{{
                            withdrawConfig.precedureFeeRatio
                          }}%】。
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </div>

              <div class="col-12" v-if="merchantFrom && parseInt(merchantFrom.pmm_status) == 1">
                <q-card bordered flat>
                  <q-card-section class="text-center text-subtitle1 q-pa-sm text-weight-bold"> 支付方式 </q-card-section>

                  <q-separator />

                  <q-list>
                    <q-item v-if="payConfig.payment.indexOf('wxapp_jsapi') > -1">
                      <q-item-section>
                        <q-item-label><q-icon name="check_circle" color="positive" size="xs"></q-icon>微信小程序支付 </q-item-label>
                        <q-item-label caption>
                          会员可在微信小程序内在线支付购买商家服务或者商品，会员支付的费用，商家可根据T+0/1结算方式，从平台结算。
                        </q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item v-if="payConfig.payment.indexOf('wechat_micropay') > -1">
                      <q-item-section>
                        <q-item-label><q-icon name="check_circle" color="positive" size="xs"></q-icon>付款码支付 （数字支付） </q-item-label>
                        <q-item-label caption>
                          付款码支付是指用户展示“付款码”给商户系统扫描后直接完成支付，适用于线下场所面对面收银的场景，例如商超、便利店、餐饮、医院、学校、电影院和旅游景区等具有明确经营地址的实体场所。
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </div>

              <div class="col-12" v-if="saasProductLis && saasProductLis.length > 0">
                <q-card bordered flat>
                  <q-card-section> 服务套餐 </q-card-section>
                  <q-separator />
                  <q-card-section>
                    <div class="row q-col-gutter-sm">
                      <div class="col-12" v-for="(item, key) in saasProductLis" :key="`item-${key}`">
                        <q-card @click="clickRadioData(item.id)">
                          <q-item v-ripple clickable class="q-py-sm">
                            <q-item-section>
                              <q-item-label> {{ item.title }} </q-item-label>
                              <q-item-label>
                                <span class="text-subtitle1 text-negative text-weight-bold">{{ item.buy_price }}</span> 元 /
                                {{ cycleValue[item.cycle] }}
                              </q-item-label>
                            </q-item-section>

                            <q-item-section side>
                              <q-btn round color="positive" flat v-if="merchantFrom.pmm_product_id == item.id" icon="check_circle" />
                            </q-item-section>
                          </q-item>

                          <q-separator />

                          <q-expansion-item dense-toggle expand-separator header-class="text-right text-primary" label="查看详情">
                            <q-card-section>
                              <div v-html="item.description"></div>
                            </q-card-section>
                          </q-expansion-item>
                        </q-card>
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </q-form>
          </div>
        </div>
        <div class="col-shrink bg-white q-py-sm text-center q-mt-xs q-gutter-sm">
          <q-btn class="q-px-xl" unelevated color="primary" :disable="!(clickDisable && phoneDisable)" label="保存" @click="saveBut()" />

          <q-btn
            class="q-px-xl"
            unelevated
            color="positive"
            v-if="parseInt(merchantFrom.pmm_status) == -1 && parseInt(merchantFrom.pmm_check_identity) != 2"
            label="保存并提交认证"
            @click="saveCheckBut()"
          />

          <q-btn
            class="q-px-xl"
            unelevated
            color="positive"
            :disable="!(clickDisable && phoneDisable)"
            v-if="parseInt(merchantFrom.pmm_status) == -1 && parseInt(merchantFrom.pmm_check_identity) == 2"
            label="通过审核"
            @click="clickAgreeBtnData()"
          />

          <q-btn
            class="q-px-xl"
            unelevated
            color="negative"
            :disable="!(clickDisable && phoneDisable)"
            label="不通过"
            @click="clickNoAgreeBtnData()"
            v-if="parseInt(merchantFrom.pmm_status) == -1 && parseInt(merchantFrom.pmm_check_identity) == 2"
          />
        </div>
      </div>

      <q-dialog v-model="noAgreeBtnDialog" persistent>
        <q-card
          :style="{
            width: parseInt(this.$q.screen.width * 0.2) + 'px',
            'max-width': parseInt(this.$q.screen.width * 0.2) + 'px',
          }"
        >
          <q-card-section>
            <div class="text-subtlte2">请输入不通过的原因</div>
          </q-card-section>

          <q-separator />

          <q-card-section>
            <q-input dense outlined type="textarea" v-model="loseReason" autofocus />
          </q-card-section>

          <q-separator />

          <q-card-actions align="center" class="row q-gutter-sm">
            <q-btn color="blue-6" unelevated class="q-px-sm" label="保存" @click="noAgreeOperate" />
            <q-btn color="grey" unelevated class="q-px-sm" label="关闭" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
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
        pmm_status: '1',
        pmm_product_id: ''
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
      noAgreeBtnDialog: false,
      loseReason: '',
      commonWithdrawConfig: {},
      saasProductLis: [],
      cycleValue: {
        1: '年',
        2: '季度',
        3: '月',
        4: '周',
        5: '天'
      }
    }
  },
  created () {},
  methods: {
    init (storeId) {
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
    },

    clickAgreeBtnData () {
      if (!parseInt(this.merchantFrom.pmm_product_id)) {
        this.$q.notify({
          message: '失败',
          caption: '请选择服务套餐',
          icon: 'ion-close-circle-outline',
          color: 'red',
          position: 'top-right',
          timeout: 500
        })

        return false
      }
      const obj = {
        pmm_relation_store_id: this.dataFrom.id,
        pmm_status: 1,
        pmm_check_identity: 1
      }

      this.checkStore(obj)
    },

    noAgreeOperate () {
      this.noAgreeBtnDialog = false
      const obj = {
        pmm_relation_store_id: this.dataFrom.id,
        pmm_status: -2,
        pmm_lose_reason: this.loseReason,
        pmm_check_identity: -1
      }

      this.checkStore(obj)
    },

    clickNoAgreeBtnData () {
      this.noAgreeBtnDialog = true
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
            this.commonWithdrawConfig = res.data && res.data.commonWithdrawConfig ? res.data.commonWithdrawConfig : {}

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

            if (this.dataFrom && this.dataFrom.apply_id) {
              this.getProductListData()
            }
          }
        })
        .catch((error) => {})
    },
    getProductListData () {
      this.$store
        .dispatch('merchantManage/getProductListData', {
          apply_id: this.dataFrom.apply_id
        })
        .then((res) => {
          if (res.code == 200) {
            this.saasProductLis = res.data && res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },
    saveCheckBut () {
      if (!parseInt(this.merchantFrom.pmm_product_id)) {
        this.$q.notify({
          message: '失败',
          caption: '请选择服务套餐',
          icon: 'ion-close-circle-outline',
          color: 'red',
          position: 'top-right',
          timeout: 500
        })

        return false
      }
      this.merchantFrom.pmm_check_identity = 2
      this.$nextTick(() => {
        this.saveBut()
      })
    },
    saveBut () {
      this.$refs.dataForm.validate().then((success) => {
        if (success) {
          this.extendForm.pay_config = this.payConfig
          this.extendForm.withdraw_config = this.withdrawConfig

          this.addStoreSidebar = false
          const obj = {
            ...this.dataFrom,
            merchantFrom: this.merchantFrom,
            extendForm: this.extendForm
          }
          this.clickDisable = false
          this.$store
            .dispatch('merchantManage/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.clickDisable = true
                this.$q.notify({
                  message: '成功',
                  caption: '保存认证信息成功！',
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

    checkStore (obj) {
      this.$refs.dataForm.validate().then((success) => {
        if (success) {
          this.addStoreSidebar = false

          this.clickDisable = false
          this.$store
            .dispatch('merchantManage/checkMerchantStatus', obj)
            .then((res) => {
              if (res.code == 200) {
                this.clickDisable = true
                this.$q.notify({
                  message: '成功',
                  caption: '审核门店信息成功！',
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
    clickRadioData (id) {
      if (parseInt(this.merchantFrom.pmm_product_id) == parseInt(id)) {
        this.merchantFrom.pmm_product_id = ''
      } else {
        this.merchantFrom.pmm_product_id = id
      }
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
