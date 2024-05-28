<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <q-scroll-area class="fit q-px-sm">
      <div class="row">
        <div class="col-6 q-px-sm">
          <q-card class="q-mt-md">
            <q-item>
              <!-- <q-item-section avatar>
              <q-icon color="primary" name="mail" />
            </q-item-section> -->

              <q-item-section>
                <q-item-label class="text-primary text-weight-bold"> 发送概览 </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item>
              <q-item-section avatar>
                <q-avatar v-if="localLibInfo.logoData && localLibInfo.logoData.id">
                  <img :src="$q.localStorage.getItem('cychainstore_system_local').attach_url + localLibInfo.logoData.path" />
                </q-avatar>
                <q-avatar v-else color="grey-2" text-color="primary" icon="las la-user"></q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-primary text-weight-bold"> {{ localLibInfo.name }} </q-item-label>
                <q-item-label class="text-caption"> {{ localLibInfo.contact_moblie }} </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />
            <q-item>
              <q-item-section avatar>
                <q-avatar color="positive" text-color="white" size="sm" icon="mail_outline" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold"> 发送成功 </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label>
                  <span class="text-h5 text-black text-weight-bold"> {{ totalSendQuantity }} </span>
                  <span> 条 </span>
                </q-item-label>
              </q-item-section>
            </q-item>
             <q-separator />
            <q-item>
              <q-item-section avatar>
                <q-avatar color="red" text-color="white" size="sm" icon="mail_outline" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold"> 发送失败 </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label>
                  <span class="text-h5 text-black text-weight-bold"> {{ totalSendErrQuantity }} </span>
                  <span> 条 </span>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />
            <q-item>
              <q-item-section avatar>
                <q-avatar color="orange" text-color="white" size="sm" icon="mail_outline" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold"> 已购买 </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label>
                  <span class="text-h5 text-black text-weight-bold"> {{ totalBuyQuantity }} </span>
                  <span> 条 </span>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item>
              <q-item-section avatar>
                <q-avatar color="red" text-color="white" size="sm" icon="mail_outline" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold"> 已过期 </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label>
                  <span class="text-h5 text-black text-weight-bold"> {{ expiredQuantity }} </span>
                  <span> 条 </span>
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-item>
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" size="sm" icon="mail_outline" />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-bold"> 剩余短信条数 </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-item-label>
                  <span class="text-h5 text-black text-weight-bold"> {{ lastQuantity }} </span>
                  <span> 条 </span>
                </q-item-label>
              </q-item-section>
            </q-item>

          </q-card>
        </div>

        <div class="col-6 q-px-sm">
          <q-card class="q-mt-md">
            <q-item>
              <!-- <q-item-section avatar>
              <q-icon color="primary" name="mail" />
            </q-item-section> -->

              <q-item-section>
                <q-item-label class="text-primary text-weight-bold"> 短信套餐包 </q-item-label>
              </q-item-section>
            </q-item>

            <q-separator />

            <q-card-section>
              <div class="row q-col-gutter-sm">
                <div class="col-4 cursor-pointer" @click="clickCheckPackage(item)" :key="key" v-for="(item, key) in packageListData">
                  <q-card flat bordered :class="parseInt(checkPackageId) == parseInt(item.id) ? 'show-package-style' : 'hide-package-style'">
                    <q-badge color="orange" floating>{{ item.sp_tag }}</q-badge>

                    <q-card-section class="q-pa-sm">
                      <div class="text-h6 text-weight-bold text-center">{{ item.sp_name }}</div>
                    </q-card-section>
                      <q-card-section class="q-pa-sm">
                      <div class="text-subtitle2 text-weight-bold text-center">自购买后【{{ item.sp_time_number }}】{{ cycleValue[item.sp_time_cycle]  }}内有效</div>
                    </q-card-section>
                    <q-card-section class="q-pa-sm">
                      <div class="text-center">
                        <span class="text-deep-orange text-caption">¥</span>
                        <span class="text-h5 text-weight-bold text-deep-orange text-center q-px-xs"> {{ item.sp_price }}</span>
                        <span class="text-deep-orange text-caption q-px-xs"> / </span>
                        <span class="text-h5 text-weight-bold text-deep-orange text-center q-px-xs"> {{ item.sp_quantity }}</span>
                        <span class="text-deep-orange text-caption">条</span>
                      </div>
                    </q-card-section>

                    <q-card-section class="q-pa-sm">
                      <div class="text-caption text-grey">{{ item.sp_description }}</div>
                    </q-card-section>
                  </q-card>
                </div>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="q-pa-sm text-center">
              <q-btn
                :disable="checkPackageId && currentLibId ? false : true"
                @click="getBuySmsPackageCode"
                color="primary"
                class="q-px-xl"
                unelevated
                label="购买短信包"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <q-dialog persistent v-model="buySmsDialogStatus">
        <q-card
          :style="{
            width: parseInt(this.$q.screen.width * 0.3) + 'px',
            'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
          }"
        >
          <q-card-section>
            <div class="text-subsitle2 text-center">购买短信包</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-card flat bordered class="show-package-style">
              <q-badge color="orange" floating>{{ checkPackageItem.sp_tag }}</q-badge>

              <q-card-section class="q-pa-sm">
                <div class="text-h6 text-weight-bold text-center">{{ checkPackageItem.sp_name }}</div>
              </q-card-section>
              <q-card-section class="q-pa-sm">
                <div class="text-center">
                  <span class="text-deep-orange text-caption">¥</span>
                  <span class="text-h5 text-weight-bold text-deep-orange text-center q-px-xs"> {{ checkPackageItem.sp_price }}</span>
                  <span class="text-deep-orange text-caption q-px-xs"> / </span>
                  <span class="text-h5 text-weight-bold text-deep-orange text-center q-px-xs"> {{ checkPackageItem.sp_quantity }}</span>
                  <span class="text-deep-orange text-caption">条</span>
                </div>
              </q-card-section>

              <q-card-section class="q-pa-sm">
                <div class="text-caption text-grey">{{ checkPackageItem.sp_description }}</div>
              </q-card-section>
            </q-card>
          </q-card-section>

          <q-card-section class="row justify-center">
            <div class="col-12 text-center">
              <qrcode-vue :value="buySmsPackageUrl" :size="'200'" level="H" />
            </div>

            <div class="col-12 text-center text-grey text-caption">请扫码完成支付（请在{{ countDownNumber }}秒之内完成支付）</div>
          </q-card-section>
          <q-separator />
          <q-card-actions align="center">
            <q-btn label="关闭" @click="closeBuyPackageDialog" unelevated color="primary" class="q-px-xl" />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-scroll-area>
  </div>
</template>

<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'smsMarketManage',
  components: {},
  data () {
    return {
      localLibInfo: {},
      checkPackageId: 0,
      checkPackageItem: {},
      packageListData: [],
      lastQuantity: 0,
      expiredQuantity: 0,
      totalBuyQuantity: 0,
      totalSendQuantity: 0,
      totalSendErrQuantity: 0,
      currentLibId: 0,
      buySmsDialogStatus: false,
      buySmsPackageUrl: '',
      buyInvoiceId: 0,

      clockDown: null,
      countDownNumber: 60,

      cycleValue: {
        1: '年',
        2: '个季度',
        3: '个月',
        4: '周',
        5: '天'
      }
    }
  },
  created () {
    if (LocalStorage.getItem('cychainstore_account_info')) {
      const headerLocalInfo = LocalStorage.getItem('cychainstore_account_info')
      if (headerLocalInfo && headerLocalInfo.lib_id) {
        this.currentLibId = headerLocalInfo.lib_id
        this.$nextTick(() => {
          this.getSmsMarketManage()
        })
      }
    }
  },
  computed: {},
  beforeMount () {},
  mounted () {},
  methods: {
    clickCheckPackage (item) {
      if (item.id) {
        if (item.id == this.checkPackageId) {
          this.checkPackageId = 0
          this.checkPackageItem = {}
        } else {
          this.checkPackageId = item.id
          this.checkPackageItem = item
        }
      }
    },
    getSmsMarketManage () {
      const obj = {
        current_lib_id: this.currentLibId
      }
      this.$store
        .dispatch('smsMarket/getSmsMarketManage', obj)
        .then((res) => {
          if (res.code == 200 && res.data.relation_lib_id) {
            this.localLibInfo = res.data && res.data.libInfo ? res.data.libInfo : {}

            this.lastQuantity = res.data && res.data.lastQuantity ? res.data.lastQuantity : 0

            this.expiredQuantity = res.data && res.data.expiredQuantity ? res.data.expiredQuantity : 0
            this.totalBuyQuantity = res.data && res.data.totalBuyQuantity ? res.data.totalBuyQuantity : 0
            this.totalSendQuantity = res.data && res.data.totalSendQuantity ? res.data.totalSendQuantity : 0
            this.totalSendErrQuantity = res.data && res.data.totalSendErrQuantity ? res.data.totalSendErrQuantity : 0

            this.packageListData = res.data && res.data.packageListData ? res.data.packageListData : []
          }
        })
        .catch((error) => {})
    },
    closeBuyPackageDialog () {
      this.buySmsDialogStatus = false
      this.checkPackageId = 0
      this.buyInvoiceId = 0
      this.checkPackageItem = {}
      this.buySmsPackageUrl = ''

      this.stopClockDown()
    },
    stopClockDown () {
      this.countDownNumber = 60
      if (this.clockDown) {
        window.clearInterval(this.clockDown)
      }
    },
    getBuySmsPackageCode () {
      const that = this
      const obj = {
        current_lib_id: this.currentLibId,
        checkPackageId: this.checkPackageId
      }
      this.$store
        .dispatch('smsMarket/getBuySmsPackageCode', obj)
        .then((res) => {
          if (res.code == 200 && res.data.path && res.data.invoice_id) {
            this.buySmsDialogStatus = true

            this.buyInvoiceId = res.data.invoice_id

            this.buySmsPackageUrl = res.data.path

            this.clockDown = window.setInterval(() => {
              this.countDownNumber--
              if (this.countDownNumber < 0) {
                that.stopClockDown()
              }
            }, 1000)

            setTimeout(() => {
              that.getBuySmsOrderStatus()
            }, 2000)
          } else {
            this.$q.notify({
              message: '操作失败',
              caption: '请联系管理员',
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },

    getBuySmsOrderStatus () {
      const that = this
      const obj = {
        current_lib_id: this.currentLibId,
        buyInvoiceId: this.buyInvoiceId
      }
      this.$store
        .dispatch('smsMarket/getBuySmsOrderStatus', obj)
        .then((res) => {
          if (res.code == 100) {
            // 继续查询
            setTimeout(() => {
              that.getBuySmsOrderStatus()
            }, 5000)
          } else if (res.code == 200) {
            // 订单购买成功
            this.$q.notify({
              message: '成功',
              caption: '短信购买成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            this.$nextTick(() => {
              that.getSmsMarketManage()
              that.closeBuyPackageDialog()
            })
          } else {
            // 订单失效
            this.$q.notify({
              message: '订单超时',
              caption: '请重新购买',
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right'
            })
            that.closeBuyPackageDialog()
          }
        })
        .catch((error) => {
          // 订单失效
          this.$q.notify({
            message: '订单超时',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            position: 'center'
          })
          that.closeBuyPackageDialog()
        })
    }

  }
}
</script>
<style scoped>
.show-package-style {
  border: 2px solid #fcac00;
  background-color: #fff0d0;
}
.hide-package-style {
  border: 1px solid #6b6b6b;
}
</style>
