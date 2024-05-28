<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.7 + 'px',
        'min-width': this.$q.screen.width * 0.7 + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white  q-pb-md row q-pa-sm">
          <div class="text-h6">{{ mezsData.id > 0 ? '修改' : '新增' }}满额赠送</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>

        <div class="col-shrink q-pa-sm full-height ">
          <q-scroll-area class="fit full-height">
            <q-form ref="mezsDataRef">
              <div class="row">
                <div class="col-6 q-pr-md">
                  <q-banner rounded class="text-white bg-red" dense>
                    注意：赠送卡券、次卡、{{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_balanceUnit }}、{{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit }}时，不填不选则不赠送!
                  </q-banner>
                </div>
              </div>
              <div class="row q-mt-md">
                <div class="col-6 q-pr-md">
                  <q-input outlined dense v-model="mezsData.pmp_name" label="套餐名称" lazy-rules :rules="[(val) => !!val || '请输入名称']" />
                </div>
                <div class="col-6 q-pr-sm">
                  <q-select
                    outlined
                    dense
                    v-model="mezsData.pmp_status"
                    :options="[
                      {
                        label: '开启',
                        value: 1,
                      },
                      {
                        label: '关闭',
                        value: 0,
                      },
                    ]"
                    label="状态"
                    class="col-12 col-md-2"
                    option-label="label"
                    emit-value
                    map-options
                  />
                </div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-6 q-pr-md">
                  <q-select
                    outlined
                    dense
                    v-model="mezsData.pmp_level_id"
                    :options="memberCardLevelDatas"
                    label="会员级别"
                    class="col-12 col-md-2"
                    option-label="mcl_level_name"
                    option-value="id"
                    emit-value
                    map-options
                  />
                </div>
              </div>
              <div class="row q-mt-md">
                <div class="col-6 q-pr-md">
                  <q-input outlined dense v-model="mezsData.pmp_min_limit_amount" label="金额满最小值" :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的金额满最小值']" />
                </div>
                <div class="col-6 q-pr-sm">
                  <q-input outlined dense v-model="mezsData.pmp_max_limit_amount" label="金额满最大值" :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的金额满最大值']" />
                </div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-6 q-pr-md">
                  <q-input outlined dense v-model="mezsData.pmp_give_balance" :label="`赠送${$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_balanceUnit}`" :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的数值']" />
                </div>
                <div class="col-6 q-pr-sm">
                  <q-input outlined dense v-model="mezsData.pmp_give_integral" :label="`赠送${$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit}`" :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || `请输入正确的赠送${$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit}`]" />
                </div>
              </div>
              <div class="q-mt-xs">
                <q-chip outline square color="red" text-color="white"> 赠送{{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_balanceUnit }} {{ mezsData.pmp_give_balance }} {{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_moneyUnit }}，赠送 {{ mezsData.pmp_give_integral }} {{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit }} </q-chip>
              </div>

              <div class="q-mb-xs q-mt-md"><q-icon color="primary" name="las la-square-full" size="16px" />赠送优惠券</div>
              <q-card flat class="row">
                <div class="q-pr-md col-6">
                  <q-btn unelevated color="primary" label="添加优惠券" class="q-mb-md" @click="showCoupon" />
                  <q-list bordered separator v-if="selectedCouponData.length > 0">
                    <q-item v-for="(item, key) in selectedCouponData" :key="key">
                      <q-item-section avatar>
                        <q-avatar icon="las la-credit-card" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>{{ item.cou_title }}</q-item-label>
                        <q-item-label caption lines="2">
                          <q-badge outline color="red" style="font-size:10px;">
                            <span v-if="parseInt(item.cou_type) == 1">
                              折 扣 券
                            </span>
                            <span v-if="parseInt(item.cou_type) == 2">
                              代 金 券
                            </span>
                            <span v-if="parseInt(item.cou_type) == 3">
                              礼 品 券
                            </span>
                            <span v-if="parseInt(item.cou_type) == 4">
                              团 购 券
                            </span>
                            <span v-if="parseInt(item.cou_type) == 5">
                              优 惠 券
                            </span>
                          </q-badge>
                        </q-item-label>
                        <q-item-label caption lines="2">{{ item.cou_description }}</q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label><q-btn flat round color="red" class="q-mr-sm" icon="delete" @click="delCoupon(key)"/></q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <div class="q-ml-md" v-else>
                    暂无赠送
                  </div>
                </div>
              </q-card>
              <div class="q-mb-xs q-mt-md"><q-icon color="primary" name="las la-square-full" size="16px" />赠送次数</div>
              <q-card flat class="row">
                <div class="q-pr-md col-6">
                  <q-btn label="添加次卡" unelevated @click="addGroupCountSelectGoods" color="primary" class="q-mb-md" />
                  <q-list bordered separator v-if="selectedCountData.length > 0">
                    <q-item v-for="(item, key) in selectedCountData" :key="key">
                      <q-item-section avatar>
                        <q-avatar icon="payment" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>名称：{{ item.grp_name }}</q-item-label>
                        <q-item-label>价格：{{ item.grp_packagePrice }}</q-item-label>
                        <q-item-label v-if="item.grp_timeType == 1">
                          有效期：
                          <q-badge color="red"> 永久有效</q-badge>
                        </q-item-label>
                        <q-item-label v-else-if="item.grp_timeType == 3">
                          有效期：
                          <q-badge color="red">
                            {{ $q_date.formatDate(item.grp_startTime * 1000, 'YYYY-MM-DD HH:mm:ss') }}
                            至
                            {{ $q_date.formatDate(item.grp_endTime * 1000, 'YYYY-MM-DD HH:mm:ss') }}
                          </q-badge>
                        </q-item-label>
                        <q-item-label v-if="item.grp_timeType == 2">
                          有效期：
                          <q-badge color="red">
                            领取后{{ item.grp_startTime }}
                            <span v-if="item.grp_endTime == 1">年 </span>
                            <span v-if="item.grp_endTime == 2">季度 </span>
                            <span v-if="item.grp_endTime == 3">月 </span>
                            <span v-if="item.grp_endTime == 4">周 </span>
                            <span v-if="item.grp_endTime == 5">天 </span>内有效
                          </q-badge>
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label><q-btn flat round color="red" class="q-mr-sm" icon="delete" @click="delCount(key)"/></q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                  <div class="q-ml-md" v-else>
                    暂无赠送
                  </div>
                </div>
              </q-card>

            </q-form>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
          <q-btn unelevated label="确定" :disable="addButtonDisabled" class="q-px-xl" color="primary" @click="setData"  />
          <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
        </div>
      </div>

      <coupon ref="couponRef" v-if="couponPoppupStatus" @dataList="hideCouponPoppup" />
      <select-goods ref="selectGoodsTimeRef" v-if="selectGoodsPoppupStatus" @dataList="hideSelectGoodsPoppup" />
      <hl-select-count-group ref="selectGoodsRef" v-if="selectCountStatus" @refreshDataList="setCount"></hl-select-count-group>
    </q-card>
  </q-dialog>
</template>
<script>
import Coupon from '../hlcoupon/components/SelectCoupon'
import SelectGoods from './SelectGoods'
export default {
  name: 'AddPackage',
  components: {
    Coupon,
    SelectGoods
  },
  data () {
    return {
      showDialog: true,
      selectCountStatus: false,
      couponPoppupStatus: false,
      selectGoodsPoppupStatus: false,
      addButtonDisabled: false,
      memberCardLevelDatas: [],
      mezsData: {
        pmp_name: '',
        pmp_level_id: '',
        pmp_status: 1,
        pmp_give_balance: 0,
        pmp_give_integral: 0
      },
      selectedCouponData: [],
      selectedCountData: [],
      selectedGoodsTimingData: [],
      selectedCouponIdData: []
    }
  },
  created () {
    this.getLevel()
  },
  mounted () {},
  computed: {},
  methods: {
    getLevel () {
      this.$store
        .dispatch('level/getAllData')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.memberCardLevelDatas = res.data
            }
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    showCoupon () {
      this.couponPoppupStatus = true
    },
    showSelectGoods () {
      this.selectGoodsPoppupStatus = true
      this.selectCountStatus = true
      this.$nextTick(() => {
        this.$refs.selectGoodsTimeRef.info()
      })
    },
    hideCouponPoppup (selectedCouponData) {
      if (selectedCouponData) {
        if (!this.selectedCouponIdData.includes(parseInt(selectedCouponData.id))) {
          this.selectedCouponData.push(selectedCouponData)
          this.selectedCouponIdData.push(parseInt(selectedCouponData.id))
        }
      }
      this.couponPoppupStatus = false
    },
    hideSelectGoodsPoppup (item) {
      this.selectedGoodsTimingData.push(item)
      this.selectGoodsPoppupStatus = false
    },
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.$store
          .dispatch('mezs/getItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.mezsData = res.data.package ? res.data.package : {}
              this.mezsData.pmp_status = parseInt(res.data.package.pmp_status)
              this.selectedCouponData = res.data.coupon ? res.data.coupon : []
              this.selectedCountData = res.data.count ? res.data.count : []
              this.selectedGoodsTimingData = res.data.timing ? res.data.timing : []
              if (res.data.coupon) {
                this.selectedCouponIdData = res.data.coupon.map((item) => {
                  return item.id
                })
              }
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            }
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
    },
    setData () {
      this.$refs.mezsDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          if (this.formatAmount(this.mezsData.pmp_min_limit_amount) > this.formatAmount(this.mezsData.pmp_max_limit_amount)) {
            this.$q.notify({
              message: '失败',
              caption: '最小值不得大于等于最大值',
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.addButtonDisabled = false
            return false
          }
          const params = {
            ...this.mezsData,
            couponData: this.selectedCouponData,
            countData: this.selectedCountData,
            TimingData: this.selectedGoodsTimingData
          }
          this.$store
            .dispatch('mezs/setData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.mezsData.id > 0 ? '修改' : '新增'}` + '满额赠送成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.showDialog = false
              } else {
                this.$q.notify({
                  message: '失败',
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
    setCount (mezsId, item) {
      this.selectedCountData.push(item)
      this.$q.notify({
        message: '成功',
        caption: '添加次卡成功！',
        icon: 'ion-checkmark-circle-outline',
        color: 'green',
        timeout: 500,
        position: 'top-right'
      })
    },
    delCoupon (key) {
      this.selectedCouponData.splice(key, 1)
    },
    delCount (key) {
      this.selectedCountData.splice(key, 1)
    },
    delTiming (key) {
      this.selectedGoodsTimingData.splice(key, 1)
    },
    addGroupCountSelectGoods () {
      this.selectCountStatus = true
      this.$nextTick(() => {
        this.$refs.selectGoodsRef.info()
      })
    },
    hideNowPage () {
      this.$emit('dataList')
      this.addButtonDisabled = false
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
