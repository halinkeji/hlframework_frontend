<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
      }"
      class="q-pa-sm fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pb-md">
          <div class="text-subtitle1">卡密登记</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink q-pa-sm full-height">
          <q-scroll-area class="fit full-height">
            <q-form ref="kmjhDataRef">
              <q-input
                outlined
                bottom-slots
                v-model="kmjhData.pkl_card_secret"
                dense
                @clear="clearCard"
                :disable="cardSecretData.package ? true : false"
                clearable
                class="q-pb-none q-mb-lg full-width"
                label="请输入卡密"
                :rules="[(val) => /^\d+$/.test(val) || '请输入正确的卡密']"
              >

              </q-input>

              <q-input
                outlined
                bottom-slots
                v-model="member.mem_memberMobile"
                dense
                class="q-pb-none q-mb-lg full-width"
                :disable="cardSecretData.package ? false : true"
                label="请输入手机号"
                lazy-rules
                :rules="[(val) => /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(val) || '填写手机号']"
              >
              </q-input>
              <q-input
                outlined
                bottom-slots
                v-model="member.mem_memberName"
                :disable="cardSecretData.package ? false : true"
                dense
                class="q-pb-none q-mb-lg full-width"
                lazy-rules
                label="请输入昵称"
                :rules="[(val) => !!val || '请输入昵称']"
              >
              </q-input>
            </q-form>
            <!-- 卡密详情 -->
            <q-card flat bordered class="q-mt-lg q-pa-sm" v-if="cardSecretData.package">
              <div class="bg-white">
                <div class="text-subtitle1">卡内权益</div>
                <q-separator />
                <div class="row q-pa-sm bg-grey-3 text-center q-mt-xs">
                  <div class="col">赠送{{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_integralUnit }}</div>
                  <div class="col">赠送{{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}</div>
                </div>
                <div
                  class="row q-pa-sm text-center"
                  v-if="cardSecretData.package"
                  style="border-left: 1px solid #d2d2d2; border-bottom: 1px solid #d2d2d2; border-right: 1px solid #d2d2d2"
                >
                  <div class="col text-grey">
                    {{ cardSecretData.package.pkp_give_balance }}
                  </div>
                  <div class="col text-grey">{{ cardSecretData.package.pkp_give_integral }}</div>
                </div>
              </div>

              <!-- 赠送优惠券 -->
              <div v-if="cardSecretData.coupon">
                <div class="q-mb-xs q-mt-sm"><q-icon color="primary" name="las la-square-full" size="16px" />赠送优惠券</div>
                <q-card flat>
                  <div class="">
                    <div bordered separator v-if="cardSecretData.coupon.length > 0">
                      <div class="q-mt-sm" v-for="(item, key) in cardSecretData.coupon" :key="key">
                        <q-list bordered separator>
                          <q-item>
                            <q-item-section>
                              <q-item-label class="text-h6">{{ item.cou_title }}</q-item-label>
                              <q-separator class="q-my-sm" />
                              <q-item-label caption lines="3">
                                <q-badge outline color="red" class="q-mx-xs">
                                  {{ couponTypeItem[parseInt(item.cou_type)] }}
                                </q-badge>
                              </q-item-label>
                              <q-item-label caption lines="3">
                                <span v-if="parseInt(item.cou_dateType) == 1"
                                  >有效期：{{ $q_date.formatDate(item.cou_startTime * 1000, 'YYYY-MM-DD HH:mm:ss') }} 至
                                  {{ $q_date.formatDate(item.cou_endTime * 1000, 'YYYY-MM-DD HH:mm:ss') }}</span
                                >

                                <q-badge outline color="teal" class="q-ma-xs" v-else-if="parseInt(item.cou_dateType) == 2">
                                  领取后{{ item.cou_startDay }}
                                  <span v-if="parseInt(item.cou_endDay) == 1"> 年 </span>
                                  <span v-else-if="parseInt(item.cou_endDay) == 2"> 季 </span>
                                  <span v-else-if="parseInt(item.cou_endDay) == 3"> 月 </span>
                                  <span v-else-if="parseInt(item.cou_endDay) == 4"> 周 </span>
                                  <span v-else-if="parseInt(item.cou_endDay) == 5"> 天 </span>
                                  <span v-else-if="parseInt(item.cou_endDay) == 6"> 小时 </span>
                                  内有效
                                </q-badge>
                              </q-item-label>
                              <q-item-label caption lines="3" v-if="parseInt(item.cou_type) == 1">
                                <span class="text-h6 text-deep-orange text-text-weight-bolder"> {{ item.cou_rebate * 0.1 }} </span>
                                <span class="text-caption">折</span>
                              </q-item-label>
                              <q-item-label caption lines="3" v-if="parseInt(item.cou_type) == 2">
                                <span class="text-caption"> 满 </span>
                                <span class="text-h6 text-deep-orange text-text-weight-bolder">{{ item.cou_fill }}</span>
                                <span class="text-caption"> 减 </span>
                                <span class="text-h6 text-deep-orange text-text-weight-bolder">{{ item.cou_minus }} </span>
                              </q-item-label>
                              <q-item-label caption lines="3" v-if="[3, 4, 5].indexOf(parseInt(item.cou_type))">
                                {{ item.cou_extra }}
                              </q-item-label>
                              <q-item-label caption lines="3" v-if="parseInt(item.cou_type) == 6">
                                兑换 <span class="text-h6 text-deep-orange text-text-weight-bolder"> {{ item.cou_give_integral }} </span>
                                {{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_integralUnit }}
                              </q-item-label>
                              <q-item-label caption lines="3" v-if="parseInt(item.cou_type) == 7">
                                兑换 <span class="text-h6 text-deep-orange text-text-weight-bolder"> {{ item.cou_give_balance }} </span>
                                {{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </div>
                    </div>
                  </div>
                </q-card>
              </div>
            </q-card>
          </q-scroll-area>
        </div>
        <!-- 底部按钮 -->
        <div class="col-shrink bg-white q-pb-sm row q-gutter-sm text-center justify-center">
          <q-toolbar class="text-center row justify-around">
            <q-btn
              rounded
              unelevated
              color="green"
              label="验证"
              :disable="addButtonDisabled || cardSecretData.package ? true : false"
              class="col-4"
              @click="getList"
            />
            <q-btn
              rounded
              unelevated
              color="primary"
              label="登记"
              :disable="cardSecretData.package ? false : true"
              class="col-4"
              @click="setData()"
            />
          </q-toolbar>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'kmjhReg',
  components: {},
  data () {
    return {
      showCard: false,
      addButtonDisabled: false,
      invoiceData: [],
      cardSecret: '',
      cardSecretData: {},
      kmjhData: {
        pkl_card_secret: '',
        memberId: ''
      },
      member: {
        mem_memberMobile: '',
        mem_memberName: ''
      },
      headerLocal: {},
      couponTypeItem: this.$store.state.hlCoupon.typeItem,
      couponPropertyItem: this.$store.state.hlCoupon.propertyItem,
      addStoreSidebar: false
    }
  },
  created () {
    const headerLocal = this.$q.localStorage.getItem('cychainstore_header_local')
    if (headerLocal && headerLocal.member_id) {
      this.headerLocal = headerLocal

      this.kmjhData.memberId = this.headerLocal.member_id
    }
  },
  mounted () {},
  computed: {},
  methods: {
    init () {
      this.addStoreSidebar = true
    },
    clearCard () {
      this.cardSecret = ''
      this.cardSecretData = {}
    },
    getList () {
      this.$refs.kmjhDataRef.validate().then((success) => {
        if (success) {
          const obj = {
            cardSecret: this.kmjhData.pkl_card_secret
          }
          this.$store
            .dispatch('kmjh/getMemberCardData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.cardSecretData = res.data ? res.data : []
              } else {
                this.$q.notify({
                  message: '查找失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.kmjhData.pkl_card_secret = ''
              }
              this.cardSecretData = res.data ? res.data : []
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    setData () {
      this.$refs.kmjhDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          const params = {
            ...this.kmjhData,
            ...this.member
          }
          this.$store
            .dispatch('kmjh/setMemberData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '激活成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.hideNowPage()
              } else {
                this.$q.notify({
                  message: '激活失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.addButtonDisabled = false
              }
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    hideNowPage () {
      this.addStoreSidebar = false
      this.$nextTick(() => {
        this.$emit('hideNowPage')
      })
    }
  }
}
</script>
