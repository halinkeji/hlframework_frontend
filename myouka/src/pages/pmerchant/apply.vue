<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-sm items-center">
        <q-tabs
          v-model="activeName"
          class="bg-white q-mt-sm"
          active-color="primary"
          indicator-color="primary"
          align="left"
          content-class="text-grey-9"
          narrow-indicator
          dense
        >
          <q-tab name="0" v-if="!(merchantData && merchantData.id && parseInt(merchantData.pmm_status) == 1)" label="我要合作"> </q-tab>
          <q-tab name="0" v-if="merchantData && merchantData.id && parseInt(merchantData.pmm_status) == 1" label="微信小程序商家码"> </q-tab>
          <q-tab name="1" :disable="merchantData && merchantData.id ? false : true" label="合作内容"> </q-tab>
        </q-tabs>
      </div>

      <div class="absolute-top q-mt-xl q-pa-md row" v-if="merchantData && merchantData.id && parseInt(merchantData.pmm_status) == 1 && parseInt(activeName) == 0">
        <div class="col-12">
          <q-banner rounded class="bg-positive text-white">
            <template v-slot:avatar>
              <q-icon name="check_circle" color="white" />
            </template>
            您已成功加入门店共享平台！
          </q-banner>
        </div>
      </div>

      <div class="absolute-top q-mt-xl q-pa-md row" v-if="merchantData && merchantData.id && parseInt(merchantData.pmm_status) == -1 && parseInt(activeName) == 0">
        <div class="col-12">
          <q-banner rounded class="bg-warning text-white">
            <template v-slot:avatar>
              <q-icon name="timelapse" color="white" />
            </template>
            审核中，请您耐心等待，审核通过后会第一时间通知您。
          </q-banner>
        </div>
      </div>

      <div
        class="col-shrink full-height q-mt-xl q-pt-md"
        v-if="parseInt(activeName) == 0 && merchantData && merchantData.id && parseInt(merchantData.pmm_status) == 1"
      >
        <q-card-section class="row q-gutter-xs" v-if="merchantData && merchantData.id && parseInt(merchantData.pmm_status) == 1">
          <div class="col-auto" v-if="wxappQrcodeUrl && wxappQrcodeUrl.one">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 text-center">微信小程序商家码（280px）</div>
              </q-card-section>

              <q-separator />

              <q-card-section class="q-pt-none text-center" >
                <q-img :src="`data:image/png;base64,${wxappQrcodeUrl.one}`" style="width:140px" width="140" />
              </q-card-section>
              <q-separator />

              <q-card-actions align="center">
                <!-- <q-btn unelevated label="生成二维码" color="warning" @click="setWxappQrcode" /> -->
                <q-btn unelevated label="下载" color="primary" @click="downloadQrcode(wxappQrcodeUrl.one,'280 * 280')" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-auto" v-if="wxappQrcodeUrl && wxappQrcodeUrl.two">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 text-center">微信小程序商家码（640px）</div>
              </q-card-section>

              <q-separator />

              <q-card-section class="q-pt-none text-center" >
                <q-img :src="`data:image/png;base64,${wxappQrcodeUrl.two}`" style="width:320px" width="320" />
              </q-card-section>
              <q-separator />

              <q-card-actions align="center">
                <!-- <q-btn unelevated label="生成二维码" color="warning" @click="setWxappQrcode" /> -->
                <q-btn unelevated label="下载" color="primary" @click="downloadQrcode(wxappQrcodeUrl.two,'320 * 320')" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-auto" v-if="wxappQrcodeUrl && wxappQrcodeUrl.three">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 text-center">微信小程序商家码（1280px）</div>
              </q-card-section>

              <q-separator />

              <q-card-section class="q-pt-none text-center" >
                <q-img :src="`data:image/png;base64,${wxappQrcodeUrl.three}`" style="width:640px" width="640" />
              </q-card-section>
              <q-separator />

              <q-card-actions align="center">
                <!-- <q-btn unelevated label="生成二维码" color="warning" @click="setWxappQrcode" /> -->
                <q-btn unelevated label="下载" color="primary" @click="downloadQrcode(wxappQrcodeUrl.three,'1280 * 1280')" />
              </q-card-actions>
            </q-card>
          </div>

        </q-card-section>
      </div>

      <div
        class="col-shrink q-pa-sm full-height"
        v-if="
          parseInt(activeName) == 0 &&
          (!(merchantData && merchantData.id) || (merchantData && merchantData.id && parseInt(merchantData.pmm_status) == -2))
        "
      >
        <q-scroll-area class="fit full-height">
          <q-form ref="consumeSetFormRef" class="q-pa-sm row">
            <div class="col-12">
              <q-card bordered>
                <q-card-section class="row q-pa-none">
                  <q-item class="full-width">
                    <q-item-section>
                      <q-item-label class="text-weight-bold text-primary"> 申请加入门店共享平台 </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>

                <q-separator />

                <q-card-section
                  class="row q-col-gutter-sm justify-center"
                  v-if="merchantData && merchantData.id && parseInt(merchantData.pmm_status) == -2"
                >
                  <div class="full-width row">
                    <div class="col-12 text-center">
                      <q-icon name="error" color="negative" size="120px"></q-icon>
                    </div>
                    <div class="col-12 text-center">审核不通过，请按照失败原因进行处理，处理完毕之后重新提交审核！</div>
                    <div class="col-12 text-center">失败原因【{{ merchantData.pmm_lose_reason }}】</div>
                  </div>
                </q-card-section>

                <q-card-section class="row q-col-gutter-sm" v-if="showApplyStatus">
                  <div class="col-12">
                    <q-card bordered flat>
                      <q-card-section class="text-weight-bold"> 认证信息 </q-card-section>
                      <q-separator />
                      <q-card-section class="row">
                        <div class="col-5">
                          <hl-upload
                            :maxTotal="2"
                            :multiple="true"
                            :currentAttach="merchantExtendData.cardIdImage"
                            @input="
                              (val) => {
                                $nextTick(() => {
                                  merchantExtendData.id_card = val;
                                });
                              }
                            "
                            currentDescription="身份证正反面"
                          />
                        </div>

                        <div class="col-7">
                          <hl-upload
                            :multiple="true"
                            :currentAttach="merchantExtendData.licenseImage"
                            :maxTotal="5"
                            @input="
                              (val) => {
                                $nextTick(() => {
                                  merchantExtendData.license = val;
                                });
                              }
                            "
                            currentDescription="上传门店经营资质照片,最多为5张"
                          />
                        </div>
                      </q-card-section>
                    </q-card>
                  </div>

                  <div class="col-12">
                    <q-card bordered flat>
                      <q-card-section class="text-weight-bold"> 支付方式 </q-card-section>
                      <q-separator />

                      <q-list>
                        <q-item>
                          <q-item-section>
                            <q-item-label class="text-weight-bold">微信小程序支付 </q-item-label>
                            <q-item-label caption>
                              会员可在微信小程序内在线支付购买商家服务或者商品，会员支付的费用，商家可根据T+0/1结算方式，从平台结算。
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-checkbox
                              checked-icon="check_box"
                              unchecked-icon="check_box_outline_blank"
                              v-model="payConfig.payment"
                              val="wxapp_jsapi"
                            />
                          </q-item-section>
                        </q-item>

                        <q-item>
                          <q-item-section>
                            <q-item-label class="text-weight-bold">付款码支付 （数字支付）  </q-item-label>
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

                  <div class="col-12">
                    <q-card bordered flat>
                      <q-card-section class="text-weight-bold"> 结算方式 </q-card-section>
                      <q-separator />

                      <q-list>
                        <q-item v-if="pmerchantWithdrawConfig && parseInt(pmerchantWithdrawConfig.zeroStatus) == 1">
                          <q-item-section>
                            <q-item-label>T + 0 </q-item-label>
                            <q-item-label caption>
                              <q-icon name="las la-exclamation-circle" color="grey" size="xs" /> 消费后的当天即可进行提现，非交易日也可以进行提现（交易日为：周一至周五）。
                            </q-item-label>
                            <q-item-label class="text-subtitle2 text-dark text-weight-bold">
                              最低提现金额【{{ pmerchantWithdrawConfig.minWithdrawAmountZero }}元】，交易分佣比例 【{{
                                pmerchantWithdrawConfig.serviceChargeRatioZero
                              }}%】，提现手续费比例 【{{ pmerchantWithdrawConfig.precedureFeeRatioZero }}%】。
                            </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-radio size="sm" v-model="withdrawConfig.withdrawCycle" val="0" />
                          </q-item-section>
                        </q-item>
                        <q-item v-if="pmerchantWithdrawConfig && parseInt(pmerchantWithdrawConfig.oneStatus) == 1">
                          <q-item-section>
                            <q-item-label>T + 1 </q-item-label>
                             <q-item-label caption>
                               <q-icon name="las la-exclamation-circle" color="grey" size="xs" /> 消费后的第二天可进行提现，必须在交易日才可以进行提现（交易日为：周一至周五）。
                            </q-item-label>
                            <q-item-label class="text-subtitle2 text-dark text-weight-bold">
                              最低提现金额【{{ pmerchantWithdrawConfig.minWithdrawAmountOne }}元】，交易分佣比例 【{{
                                pmerchantWithdrawConfig.serviceChargeRatioOne
                              }}%】，提现手续费比例 【{{ pmerchantWithdrawConfig.precedureFeeRatioOne }}%】。
                              </q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-radio size="sm" v-model="withdrawConfig.withdrawCycle" val="1" />
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </q-form>
        </q-scroll-area>

        <q-dialog v-model="blogViewStatus">
          <q-card
            :style="{
              width: parseInt(this.$q.screen.width * 0.5) + 'px',
              'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
              height: parseInt(this.$q.screen.width * 0.7) + 'px',
            }"
          >
            <q-card-section class="row items-center">
              <div class="text-subtitle2 text-center">{{ currnetBlogTitle }}</div>
              <q-space />
              <q-btn flat icon="close" dense color="primary" v-close-popup />
            </q-card-section>

            <q-separator />

            <q-card-section>
              <div v-html="currnetBlogData.pb_content"></div>
            </q-card-section>
          </q-card>
        </q-dialog>
      </div>

      <div v-if="activeName == '1'" class="fit">
        <q-card-section class="row q-gutter-sm">
          <div class="col-6">
            <q-card bordered flat>
              <q-card-section class="text-center text-subtitle1 q-pa-sm text-weight-bold"> 消费方式 </q-card-section>

              <q-separator />
              <q-list separator>
                <q-item v-if="parseInt(payConfig.usePlatformBalance) == 1">
                  <q-item-section>
                    <q-item-label>
                      <q-icon name="check_circle" color="positive" size="xs"></q-icon>启用平台{{
                        $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_balanceUnit
                      }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
                <q-item v-if="parseInt(payConfig.usePlatformPoints) == 1">
                  <q-item-section>
                    <q-item-label>
                      <q-icon name="check_circle" color="positive" size="xs"></q-icon> 启用平台{{
                        $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit
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

          <div class="col-6">
            <q-card bordered flat>
              <q-card-section class="text-center text-subtitle1 q-pa-sm text-weight-bold"> 结算周期 </q-card-section>

              <q-separator />
              <q-list>
                <q-item v-if="parseInt(withdrawConfig.withdrawCycle) == 0">
                  <q-item-section>
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
                      <q-icon name="check_circle" color="positive" size="xs"></q-icon> 最低提现金额【{{
                        withdrawConfig.minWithdrawAmount
                      }}元】，交易分佣比例 【{{ withdrawConfig.serviceChargeRatio }}%】，提现手续费比例 【{{ withdrawConfig.precedureFeeRatio }}%】。
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>

          <div class="col-6">
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
                    <q-item-label caption> 付款码支付是指用户展示“付款码”给商户系统扫描后直接完成支付，适用于线下场所面对面收银的场景，例如商超、便利店、餐饮、医院、学校、电影院和旅游景区等具有明确经营地址的实体场所。 </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </q-card-section>
      </div>

      <div
        class="col-shrink bg-white q-mt-xs q-py-sm text-center row justify-start items-center q-pa-md"
        v-if="
          showApplyStatus && (parseInt(merchantData.pmm_status) == 1 || parseInt(merchantData.pmm_status) == -2 || !(merchantData && merchantData.id))
        "
      >
        <q-checkbox checked-icon="radio_button_checked" unchecked-icon="radio_button_unchecked" v-model="readDocumentRadio" val="1"></q-checkbox>
        已阅读并同意 <q-btn dense label="用户协议" @click="openBlogDialog('yhxy')" flat color="primary" /> 、
        <q-btn dense @click="openBlogDialog('yszc')" label="隐私政策" flat color="primary" />
      </div>

      <q-separator />

      <div
        class="col-shrink bg-white q-py-sm text-center row justify-center q-pa-md"
        v-if="
          showApplyStatus && (parseInt(merchantData.pmm_status) == 1 || parseInt(merchantData.pmm_status) == -2 || !(merchantData && merchantData.id))
        "
      >
        <q-btn class="q-px-md" unelevated color="blue-6" :disable="parseInt(readDocumentRadio) == 1 ? false : true" @click="saveApplyData">
          <q-icon name="unarchive" color="white" size="xs" class="q-mx-md"></q-icon>
          认证身份，解锁权益
        </q-btn>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'RechargeMoneySet',

  data () {
    return {
      activeName: '0',
      qrcodeDialog: false,
      currentLibId: 0,
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
      accountInfo: {},
      pmerchantWithdrawConfig: {},
      merchantData: {},
      wxappQrcodeUrl: '',
      showApplyStatus: false,
      readDocumentRadio: [],
      blogViewStatus: false,
      currnetBlogData: {},
      currnetBlogTitle: {},
      yhxyBlog: {},
      yszcBlog: {},
      merchantExtendData: {}
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getApplyJoinData()
    })
  },
  created () {
    if (this.$q.localStorage.getItem('myouka_account_info')) {
      this.accountInfo = this.$q.localStorage.getItem('myouka_account_info')
    }
  },
  computed: {},
  methods: {
    getApplyJoinData () {
      const obj = {}
      this.$store
        .dispatch('pmerchantManage/getApplyJoinData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.pmerchantWithdrawConfig = res.data ? res.data.pmerchantWithdrawConfig : {}
            this.merchantData = res.data && res.data.merchantData ? res.data.merchantData : {}

            this.merchantExtendData = res.data && res.data.merchantExtendData ? res.data.merchantExtendData : {}

            if (res.data.merchantExtendData && res.data.merchantExtendData.pay_config) {
              for (const x in res.data.merchantExtendData.pay_config) {
                this.payConfig[x] = res.data.merchantExtendData.pay_config[x]
              }
            }

            if (res.data.merchantExtendData && res.data.merchantExtendData.withdraw_config) {
              for (const x in res.data.merchantExtendData.withdraw_config) {
                this.withdrawConfig[x] = res.data.merchantExtendData.withdraw_config[x]
              }
            }

            if (this.merchantData && this.merchantData.pmm_wxapp_qrcode) {
              this.wxappQrcodeUrl = this.merchantData.pmm_wxapp_qrcode
              // this.wxappQrcodeUrl = 'data:image/png;base64,' + this.merchantData.pmm_wxapp_qrcode
            }
            if (!(this.merchantData && this.merchantData.id)) {
              this.showApplyStatus = true
            } else if (this.merchantData && this.merchantData.id && parseInt(this.merchantData.pmm_status) == -2) {
              this.showApplyStatus = true
            }

            if (res.data.yhxyBlog && res.data.yhxyBlog.id) {
              this.yhxyBlog = res.data.yhxyBlog
            }

            if (res.data.yszcBlog && res.data.yszcBlog.id) {
              this.yszcBlog = res.data.yszcBlog
            }
          }
        })
        .catch((error) => {})
    },

    saveApplyData () {
      if (!(this.merchantExtendData.id_card && this.merchantExtendData.id_card.length > 0)) {
        this.$q.notify({
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          message: '失败',
          caption: '请选择身份证正反面',
          color: 'red'
        })
        return false
      }

      if (!(this.merchantExtendData.license && this.merchantExtendData.license.length > 0)) {
        this.$q.notify({
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          message: '失败',
          caption: '请选择门店经营资质照片',
          color: 'red'
        })
        return false
      }

      const obj = {
        payConfig: this.payConfig,
        withdrawConfig: this.withdrawConfig,
        checkIdentity: 2,
        ...this.merchantExtendData
      }
      this.$store
        .dispatch('pmerchantManage/merchantApplyJoinData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              message: '成功',
              caption: '申请成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.showApplyStatus = false
            this.getApplyJoinData()
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
    closeDialog () {
      this.qrcodeDialog = false
      this.$emit('closeDialog')
    },
    setWxappQrcode () {
      this.$store
        .dispatch('merchantManage/setWxappQrcode', {
          merchant_id: this.params.data.merchantId
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              message: '成功',
              caption: '二维码生成成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.wxappQrcodeUrl = 'data:image/png;base64,' + res.data
          }
        })
        .catch((error) => {
          this.$q.notify({
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            message: '失败',
            caption: error.message,
            color: 'red'
          })
        })
    },

    downloadQrcode (url_code, img_name) {
      const blob = this.base64ToBlob('data:image/png;base64,' + url_code) // 转码
      const filename = img_name
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = filename
      a.click()
    },
    base64ToBlob (code) {
      const parts = code.split(';base64,')
      const contentType = parts[0].split(':')[1]
      const raw = window.atob(parts[1])
      const rawLength = raw.length
      const uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new window.Blob([uInt8Array], { type: contentType })
    },

    openBlogDialog (type) {
      this.blogViewStatus = true
      if (type == 'yszc') {
        this.currnetBlogData = this.yszcBlog
        this.currnetBlogTitle = '隐私政策'
      }

      if (type == 'yhxy') {
        this.currnetBlogData = this.yhxyBlog
        this.currnetBlogTitle = '用户协议'
      }
    }
  }
}
</script>

<style></style>
