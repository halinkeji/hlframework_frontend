<template>
  <div class="flex flex-wrap">
    <!-- 规格弹出框 -->
    <q-dialog v-model="checkPopup">
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 0.6 : 0.5)) + 'px',
          'max-width': parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 0.6 : 0.5)) + 'px',
        }"
      >
        <q-toolbar>
          <q-toolbar-title> 卡券核销 </q-toolbar-title>
          <q-btn
            flat
            round
            dense
            icon="close"
            @click="
              refreshBut();
              checkPopup = false;
            "
          />
        </q-toolbar>
        <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify" narrow-indicator>
          <q-tab name="check" label="核销" />
          <q-tab name="alarms" label="发券" />
        </q-tabs>

        <q-separator />

        <q-tab-panels v-model="tab" animated>
          <q-tab-panel name="check">
            <q-card-section>
              <div class="col-shrink bg-white full-height bg-grey-2 q-mt-xs">
                <div class="row fit bg-white justify-around">
                  <q-form @submit="coupoInquirenCheck" ref="submitFormRef" class="col-12 col-md-4 text-center q-px-xs q-pt-md">
                    <q-card square flat class="full-width">
                      <q-input
                        label="优惠券核销码"
                        outlined
                        bottom-slots
                        @keyup.enter.native="coupoInquirenCheck"
                        v-model="checkNumber"
                        lazy-rules
                        class="text-h6 full-width"
                        :rules="[(val) => !!val || '请填写优惠券核销码']"
                        :disable="couponInfo && couponInfo.id ? true : false"
                      >
                      </q-input>
                    </q-card>

                    <q-card flat bordered v-if="couponInfo && couponInfo.id">
                      <q-badge color="orange" floating> {{ couponInfo.cmd_type_name }}</q-badge>
                      <q-list>
                        <q-item>
                          <q-item-section class="text-dark" side>
                            <q-item-label>{{ couponInfo.coupon.cou_title }}</q-item-label>
                            <q-item-label caption>{{ couponInfo.coupon.cou_sub_title }}</q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item>
                          <q-item-section avatar>
                            <q-icon color="amber" name="alarm" />
                          </q-item-section>

                          <q-item-section class="text-dark" side>
                            <q-item-label>到期时间</q-item-label>
                            <q-item-label caption> {{ $q_date.formatDate(couponInfo.cmd_activityendtime * 1000, 'YYYY-MM-DD') }}</q-item-label>
                          </q-item-section>
                        </q-item>

                        <q-item>
                          <q-item-section avatar>
                            <q-icon color="red" name="redeem" />
                          </q-item-section>

                          <q-item-section class="text-dark" side>
                            <q-item-label class="text-h4 text-weight-bolder text-red" lines="2">
                              <span v-if="parseInt(couponInfo.coupon.cou_type) == 1">
                                {{ couponInfo.coupon.cou_rebate * 0.1 }}
                                <span class="text-caption">折</span>
                              </span>
                              <span v-if="parseInt(couponInfo.coupon.cou_type) == 2">
                                <span class="text-caption"> 满 </span>
                                <span class="text-h6 text-deep-orange text-text-weight-bolder">{{ couponInfo.coupon.cou_fill }}</span>
                                <span class="text-caption"> 减 </span>
                                <span class="text-h6 text-deep-orange text-text-weight-bolder">{{ couponInfo.coupon.cou_minus }} </span>
                              </span>
                              <span v-if="parseInt(couponInfo.coupon.cou_type) == 3">
                                {{ couponInfo.coupon.cou_extra }}
                              </span>
                              <span v-if="parseInt(couponInfo.coupon.cou_type) == 4">
                                {{ couponInfo.coupon.cou_extra }}
                              </span>
                              <span v-if="parseInt(couponInfo.coupon.cou_type) == 5">
                                {{ couponInfo.coupon.cou_extra }}
                              </span>
                            </q-item-label>
                          </q-item-section>
                        </q-item>
                      </q-list>
                    </q-card>
                  </q-form>
                </div>
              </div>
              <div class="col-shrink bg-white q-pb-md q-gutter-md q-mt-xs text-center">
                <q-btn unelevated color="amber-8" class="q-px-xl" label="重置" :disable="!checkNumber" @click="refreshBut()" size="lg" />
                <q-btn
                  unelevated
                  color="positive"
                  class="q-px-xl"
                  label="核销"
                  v-if="couponInfo && couponInfo.id"
                  :disable="!checkNumber"
                  size="lg"
                  @click="couponCheck"
                />
                <q-btn unelevated color="primary" class="q-px-xl" label="查询" v-else :disable="!checkNumber" size="lg" @click="coupoInquirenCheck" />
              </div>
            </q-card-section>
          </q-tab-panel>

          <q-tab-panel name="alarms">
            <q-card-section>
              <div class="col-shrink bg-white full-height bg-grey-2 q-mt-xs">
                <q-card flat bordered class="q-pa-md">
                  <div class="row q-gutter-md q-mb-md">
                    <q-chip color="red" text-color="white">系统会自动选择卡券属性为主动群发的卡券，默认发送数量为限领数量。</q-chip>
                  </div>
                  <div class="row q-gutter-md q-mb-md">
                    <div class="col-5">
                      <q-input
                        outlined
                        bottom-slots
                        v-model="card_number"
                        dense
                        @keyup.enter.native="cardReader"
                        class="q-pb-none"
                        label="请输入卡号/手机号/身份证号"
                      >
                      </q-input>
                    </div>
                    <q-btn unelevated color="blue-6" @click="cardReader()" label="添加会员" />
                    <q-btn unelevated color="blue-6" @click="addMember()" label="选择会员" />
                  </div>
                  <div class="row q-gutter-md">
                    <div v-for="(item, key) in memberList">
                      <q-chip removable color="#24c1a0" text-color="white" @remove="delMember(key)">
                       <q-avatar v-if="item.coverImage && item.coverImage.id" text-color="white">
                        <img :src="$q.localStorage.getItem('fzchainstore_store_local').attach_url + item.coverImage.path" />
                        </q-avatar>
                        <div class="ellipsis">
                          {{ item.mem_memberName }}
                          <q-tooltip>{{ item.mem_memberMobile }}</q-tooltip>
                        </div>
                      </q-chip>
                    </div>
                  </div>
                  <div class="q-my-md text-subtitle1">本次发放卡券</div>
                  <q-btn unelevated color="primary" label="添加优惠券" class="q-mb-md" @click="showCoupon" />

                  <div class="row q-gutter-md">
                    <div v-for="(item, key) in sendCouponsData" :key="key">
                      <q-chip color="#24c1a0" class="mr-2" removable @remove="delCoupons(key)">{{ item.cou_title }}</q-chip>
                    </div>
                  </div>
                  <div class="q-my-md text-subtitle1">选择会员组</div>
                  <div class="q-gutter-md row">
                    <div v-for="item in memberCardLevelDatas">
                      <q-checkbox v-model="memberGroup" :val="item.id" color="#24c1a0">{{ item.mcl_level_name }}</q-checkbox>
                    </div>
                  </div>
                </q-card>
              </div>
              <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
                <q-btn unelevated @click="sendBut()" class="q-px-xl" color="blue-6" label="发送" />
                <q-btn unelevated class="q-px-xl" :to="{ name: 'hlCoupon' }" color="grey" label="返回" />
              </div>
              <coupon ref="couponRef" v-if="couponPoppupStatus" @dataList="hideCouponPoppup" />
              <hl-choose-manager
                v-if="chooseManagerVisible"
                ref="chooseManagerList"
                @getChooseManageData="receivingAdministrator"
                @closeChooseManage="closeChooseManage"
              ></hl-choose-manager>
            </q-card-section>
          </q-tab-panel>
        </q-tab-panels>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import Coupon from 'src/pages/plugin/hlcoupon/components/SelectCoupon'
export default {
  name: 'CheckView',
  props: ['memberId', 'currentMemberInfo'],
  components: {
    Coupon
  },
  data () {
    return {
      checkPopup: false,
      checkNumber: '',
      tab: 'check',
      couponInfo: {
        coupon: {}
      },
      sendCouponsData: [],
      memberGroup: [],
      chooseManagerVisible: false,
      memberList: [],
      card_number: '',
      memberCardLevelDatas: [],
      selectedCouponIdData: [],
      disabledStatus: false,
      couponPoppupStatus: false
    }
  },

  mounted () {},
  created () {
    this.getLevel()
  },
  computed: {},
  watch: {
    memberId (val) {
      if (val > 0) {
        this.memberList.push(this.currentMemberInfo)
      }
    }
  },
  methods: {
    getViewData () {
      this.checkPopup = true
    },
    coupoInquirenCheck () {
      const obj = {
        check: this.checkNumber
      }
      this.$store
        .dispatch('hlCoupon/inquireCoupon', obj)
        .then((res) => {
          if (res.code == 400) {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            this.checkNumber = ''
            this.couponInfo = {}
            return false
          } else {
            this.couponInfo = res.data
          }
        })
        .catch((error) => {})
    },
    couponCheck () {
      const obj = {
        check: this.checkNumber
      }
      this.$store
        .dispatch('hlCoupon/couponCheck', obj)
        .then((res) => {
          if (res.code == 400) {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            this.checkNumber = ''
            this.couponInfo = {}
            return false
          }
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '核销成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.checkNumber = ''
            this.couponInfo = {}
          }
        })
        .catch((error) => {})
    },
    refreshBut () {
      this.checkNumber = ''
      this.couponInfo = {}
    },
    delMember (val) {
      this.memberList.splice(val, 1)
    },
    delCoupons (val) {
      this.sendCouponsData.splice(val, 1)
      this.selectedCouponIdData.splice(val, 1)
    },
    // 获取会员组
    getLevel () {
      this.$store
        .dispatch('level/getAllData')
        .then((res) => {
          if (res.code == 200) {
            this.memberCardLevelDatas = res.data
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    // 选择会员
    addMember () {
      this.chooseManagerVisible = true
      this.$nextTick(() => {
        this.$refs.chooseManagerList.getMemberListData()
      })
    },
    // 选择返回的数据
    receivingAdministrator (val) {
      if (val && val.length > 0) {
        const memberList = this.memberList.map((item) => {
          return parseInt(item.id)
        })
        val.forEach((item) => {
          if (memberList.indexOf(parseInt(item.id)) == -1) {
            this.memberList.push(item)
          } else {
            this.$q.notify({
              color: 'red',
              message: '失败',
              caption: item.mem_memberName + '已存在',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
      }
    },
    // 关闭
    closeChooseManage () {
      this.chooseManagerVisible = false
    },
    // 读卡传值
    cardReader () {
      if (this.card_number) {
        const obj = {
          card_number: this.card_number
        }

        this.$store
          .dispatch('components/cardReader', obj)
          .then((res) => {
            if (res.code == 200) {
              const memberList = this.memberList.map((item) => {
                return parseInt(item.id)
              })
              if (res.data) {
                if (memberList.indexOf(parseInt(res.data.id)) == -1) {
                  this.memberList.push(res.data)
                } else {
                  this.$q.notify({
                    color: 'red',
                    message: '操作失败',
                    caption: res.data.mem_memberName + '已存在',
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right'
                  })
                }
              }
              this.card_number = ''
            }
          })
          .catch((error) => {
            this.$q.notify({
              message: '失败',
              caption: error.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
          })
      }
    },
    // 发送
    sendBut () {
      this.disabledStatus = true
      const obj = {
        sendCouponsData: this.sendCouponsData,
        memberGroup: this.memberGroup,
        memberList: this.memberList
      }
      this.$store
        .dispatch('hlCoupon/send', obj)
        .then((res) => {
          if (res.data) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '添加成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.disabledStatus = false
            this.calenrBut()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '注意',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
          this.disabledStatus = false
        })
    },
    showCoupon () {
      this.couponPoppupStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.couponRef.getList(7)
        }, 100)
      })
    },
    hideCouponPoppup (selectedCouponData) {
      if (selectedCouponData) {
        if (!this.selectedCouponIdData.includes(parseInt(selectedCouponData.id))) {
          this.sendCouponsData.push(selectedCouponData)
          this.selectedCouponIdData.push(parseInt(selectedCouponData.id))
        }
      }
      this.couponPoppupStatus = false
    },
    calenrBut () {
      this.tab = 'check'
      this.checkPopup = false
      this.sendCouponsData = []
      this.memberGroup = []
      this.chooseManagerVisible = false
      this.memberList = []
      this.card_number = ''
      this.memberCardLevelDatas = []
      this.selectedCouponIdData = []
      this.disabledStatus = false
      this.couponPoppupStatus = false
    }
  }
}
</script>
