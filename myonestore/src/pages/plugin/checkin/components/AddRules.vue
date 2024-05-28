<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <coupon ref="couponRef" v-if="couponPoppupStatus" @dataList="hideCouponPoppup" />
    <hl-select-count-group ref="selectGoodsRef" v-if="selectCountStatus" @refreshDataList="setCount"></hl-select-count-group>
    <hl-select-time-group ref="selectGoodsTimeRef" v-if="selectGoodsPoppupStatus" @dataList="hideSelectGoodsPoppup"> </hl-select-time-group>
    <q-card
      :style="{
        width: dialogWidth,
        'max-width': dialogWidth,
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-pa-sm row">
          {{ id > 0 ? '修改' : '新增' }}签到规则
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>

        <div class="col-shrink q-pa-sm full-height">
          <q-scroll-area class="fit full-height">
            <q-form ref="InfoDataRef">
              <div class="row">
                <div class="col-6 q-pr-md">
                  <q-banner rounded class="text-white bg-red" dense>
                    注意：赠送卡券、次卡、{{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_balanceUnit }}、{{
                      $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit
                    }}时，不填不选则不赠送!
                  </q-banner>
                </div>
              </div>
              <div class="row q-my-xs">
                <div class="col-6">
                  <q-input
                    outlined
                    dense
                    class="q-px-sm"
                    v-model="rulesData.cr_sort"
                    label="排序:数字越小，排序越靠前"
                    lazy-rules
                    :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '请输入正整数']"
                  />
                </div>
                <div class="col-6">
                  <q-select
                    class="q-px-sm"
                    outlined
                    :disable="id > 0"
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    v-model="rulesData.cr_type"
                    :options="rulesType"
                    @input="rulesData.cr_day = '2'"
                    dense
                    label="请选择规则类型"
                  />
                </div>
              </div>
              <div v-if="rulesData.cr_type == '3'" class="row">
                <q-input
                  outlined
                  dense
                  class="q-px-sm col-6"
                  v-model="rulesData.cr_day"
                  label="连续签到天数"
                  lazy-rules
                  :rules="[(val) => /^\+?[0-9][0-9]*$/.test(val) || '请输入正整数', (val) => val >= 1 || '请输入正确的天数']"
                />
              </div>
              <div v-if="rulesData.cr_type == '4'" class="row">
                <q-input
                  outlined
                  dense
                  class="q-px-sm col-6"
                  v-model="rulesData.cr_day"
                  label="累计签到天数"
                  lazy-rules
                  :rules="[(val) => /^\+?[1-9][0-9]*$/.test(val) || '请输入正整数', (val) => val >= 1 || '请输入正确的天数']"
                />
              </div>
              <div class="row q-my-xs">
                <div class="col-6">
                  <q-input
                    outlined
                    dense
                    class="q-px-sm"
                    v-model="rulesData.cr_give_points"
                    :label="'赠送' + `${$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit}`"
                    lazy-rules
                    :rules="[(val) => /^[0-9]+(.[0-9]{1,2})?$/.test(val) || '请输入正确的' + `${$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit}`]"
                  />
                </div>
                <div class="col-6">
                  <q-input outlined dense class="q-px-sm" v-model="rulesData.cr_give_money" label="赠送金额" lazy-rules :rules="[(val) => /^[0-9]+(.[0-9]{1,2})?$/.test(val) || '请输入正确的金额']" />
                </div>
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

                        <q-item-label caption lines="2">
                          <span v-if="item.cou_dateType == 1">
                            {{ $q_date.formatDate(item.cou_startTime * 1000, 'YYYY-MM-DD') }}
                            至 {{ $q_date.formatDate(item.cou_endTime * 1000, 'YYYY-MM-DD') }} 有效
                          </span>
                          <span v-else>
                            领取后{{ item.cou_startDay  }}
                              <span v-if="parseInt(item.cou_endDay) == 1">
                                年
                              </span>
                              <span v-else-if="parseInt(item.cou_endDay) == 2">
                                季
                              </span>
                              <span v-else-if="parseInt(item.cou_endDay) == 3">
                                月
                              </span>
                              <span v-else-if="parseInt(item.cou_endDay) == 4">
                                周
                              </span>
                              <span v-else-if="parseInt(item.cou_endDay) == 5">
                                天
                              </span>
                              <span v-else-if="parseInt(item.cou_endDay) == 6">
                                小时
                              </span>
                              内有效
                          </span>
                        </q-item-label>
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
                            {{ $q_date.formatDate(item.grp_startTime * 1000, 'YYYY-MM-DD HH:mm') }}
                            至
                            {{ $q_date.formatDate(item.grp_endTime * 1000, 'YYYY-MM-DD HH:mm') }}
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
              <div class="q-mb-xs q-mt-md"><q-icon color="primary" name="las la-square-full" size="16px" />赠送计时</div>
              <q-card flat class="row">
                <div class="q-pr-md col-6">
                  <q-btn label="添加计时卡" unelevated @click="showSelectGoods" color="primary" class="q-mb-md" />
                  <q-list bordered separator v-if="selectedGoodsTimingData.length > 0">
                    <q-item v-for="(item, key) in selectedGoodsTimingData" :key="key">
                      <q-item-section avatar>
                        <q-avatar icon="access_time" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>名称：{{ item.gtg_name }}</q-item-label>
                        <q-item-label>价格：{{ item.gtg_selling_price }}</q-item-label>
                        <q-item-label v-if="item.detail">
                          <div v-for="(i, k) in item.detail" :key="k">
                            <span>商品名称：{{ i.tgd_goods_name }}</span
                            >({{ i.tgd_time_compute_duration }}分钟)
                          </div>
                        </q-item-label>
                      </q-item-section>
                      <q-item-section side>
                        <q-item-label><q-btn flat round color="red" class="q-mr-sm" icon="delete" @click="delTiming(key)"/></q-item-label>
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
          <q-btn unelevated class="q-px-xl" label="提交"  @click="saveData()" :disable="disableButton" color="primary" />
          <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage()" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import Coupon from 'src/pages/plugin/hlcoupon/components/SelectCoupon'
export default {
  name: 'AddRules',
  components: {
    Coupon
  },
  data () {
    return {
      selectCountStatus: false,
      couponPoppupStatus: false,
      selectGoodsPoppupStatus: false,
      id: 0,
      dialogWidth: '1000px',
      addStoreSidebar: false,
      rulesData: {
        cr_sort: 0,
        cr_type: '1',
        cr_give_points: 0,
        cr_give_money: 0,
        cr_day: 2
      },
      rulesType: this.$store.state.checkin.rulesType,
      selectedCouponData: [],
      selectedCountData: [],
      selectedGoodsTimingData: [],
      selectedCouponIdData: [],
      disableButton: false
    }
  },
  created () {},
  mounted () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.5) + 'px'
    }
  },
  computed: {},
  methods: {
    getItem (id) {
      this.addStoreSidebar = true
      if (id > 0) {
        this.id = id
        this.$store.dispatch('checkin/getItem', parseInt(id)).then((res) => {
          if (res.code == 200 && res.data) {
            this.rulesData = res.data.checkinRuleInfo
            this.selectedCouponData = res.data.coupon ? res.data.coupon : []
            this.selectedCountData = res.data.count ? res.data.count : []
            this.selectedGoodsTimingData = res.data.timing ? res.data.timing : []
            if (res.data.coupon) {
              this.selectedCouponIdData = res.data.coupon.map((item) => {
                return item.id
              })
            }
          }
        })
      }
    },
    // 提交数据
    saveData () {
      this.disableButton = true
      this.$refs.InfoDataRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.rulesData,
            id: this.id,
            couponData: this.selectedCouponData,
            countData: this.selectedCountData,
            TimingData: this.selectedGoodsTimingData
          }
          this.$store
            .dispatch('checkin/setRule', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.id > 0 ? '修改' : '新增'}规则成功`,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.$nextTick(() => {
                  this.hideNowPage()
                })
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
      })
    },
    hideNowPage () {
      this.addStoreSidebar = false
      this.disableButton = false
      this.$emit('getMethods')
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
      console.log(selectedCouponData)
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
    setCount (id, item) {
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
