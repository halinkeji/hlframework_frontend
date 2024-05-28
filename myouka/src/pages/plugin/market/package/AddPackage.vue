<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.55 + 'px',
        'min-width': this.$q.screen.width * 0.55 + 'px',
      }"
      class="fit"
    >
      <select-coupon ref="couponRef" v-if="couponPoppupStatus" @dataList="hideCouponPoppup" />
      <hl-select-time-group ref="selectGoodsTimeRef" v-if="selectGoodsPoppupStatus" @dataList="hideSelectGoodsPoppup" />
      <hl-select-count-group ref="selectGoodsRef" v-if="selectCountStatus" @refreshDataList="setCount"></hl-select-count-group>
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md q-mb-md row">
          <div class="text-h6">{{ packageData.id > 0 ? '修改' : '新增' }}分佣权益</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>

        <div class="col-shrink q-pa-sm full-height">
          <q-scroll-area class="fit full-height">
            <q-form ref="packageRefs">
              <div class="row q-mt-xs">
                <div class="col-6 q-pr-sm">
                  <q-input outlined dense v-model="packageData.pmp_sort" label="排序" :rules="[(val) => /^\d+$/.test(val) || '请输入正确的排序']"> </q-input>
                </div>
                <div class="col-6 q-pl-sm">
                  <q-input outlined dense v-model="packageData.pmp_name" label="权益名称" :rules="[(val) => !!val || '请输入权益名称']"> </q-input>
                </div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-6 q-pr-sm">
                  <q-input outlined dense v-model="packageData.pmp_market_amount" label="佣金" hint="下级会员消费时，他的上级可获得的固定佣金" :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的佣金']">
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2 ">{{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_moneySymbol }}</span>
                    </template>
                  </q-input>
                </div>
                <div class="col-6 q-pl-sm">
                  <q-input
                    outlined
                    dense
                    v-model="packageData.pmp_market_proportion"
                    label="佣金比例"
                    hint="下级会员消费时，会员实付金额 × 分佣百分比 ＝ 他的上级可获得的佣金"
                    :rules="[(val) => (!val ? '请输入佣金比例' : (/^(\d+|\d+\.\d{1})$/.test(val) && parseFloat(val) <= 99.9 && parseFloat(val) >= 0) || '支持0到99.9')]"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2 ">%</span>
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-6 q-pr-sm">
                  <q-input
                    outlined
                    dense
                    v-model="packageData.pmp_give_balance"
                    :label="`赠送${$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_balanceUnit}`"
                    :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的赠送' + $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_balanceUnit]"
                  />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-input
                    outlined
                    dense
                    v-model="packageData.pmp_give_integral"
                    :label="`赠送${$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit}`"
                    :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的赠送' + `${$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit}`]"
                  />
                </div>
              </div>
              <q-card flat bordered class="q-my-xs">
                <q-card-section class="row items-center q-py-xs">
                  <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />赠送次数</span>
                  <q-space />
                  <q-btn label="添加次卡" unelevated @click="addGroupCountSelectGoods" color="primary" />
                </q-card-section>
                <q-separator />
                <q-card-section flat class="row" v-if="selectedCountData.length > 0">
                  <div class="q-pa-xs col-4" v-for="(item, key) in selectedCountData" :key="key">
                    <q-list bordered separator>
                      <q-item>
                        <q-item-section>
                          <q-item-label>名称：{{ item.grp_name }}</q-item-label>
                          <q-item-label>
                            价格：
                            <span class="text-orange"> {{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_moneySymbol }} </span>
                            <span class="text-h6 text-orange text-weight-bold">{{ item.grp_packagePrice }}</span>
                          </q-item-label>
                          <q-item-label v-if="parseInt(item.grp_timeType) == 1">
                            有效期：
                            <q-badge color="red"> 永久有效</q-badge>
                          </q-item-label>
                          <q-item-label v-else-if="parseInt(item.grp_timeType) == 3">
                            有效期：
                            <q-badge color="red">
                              {{ $q_date.formatDate(item.grp_startTime * 1000, 'YYYY-MM-DD') }}
                              至
                              {{ $q_date.formatDate(item.grp_endTime * 1000, 'YYYY-MM-DD') }}
                            </q-badge>
                          </q-item-label>
                          <q-item-label v-else-if="parseInt(item.grp_timeType) == 2">
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
                        <q-btn round color="red" flat class="absolute-top-right" icon="las la-times-circle" @click="delCount(key, 0)" />
                      </q-item>
                      <q-expansion-item expand-separator icon="payment" label="详情">
                        <q-list v-if="item.rechargeDetail">
                          <q-item v-for="(i, k) in item.rechargeDetail" :key="k">
                            <q-item-section>
                              <q-item-label>
                                {{ i.grc_goodsName }}
                                {{ i.grc_speName ? '-' + i.grc_speName : '' }}
                                ({{ i.grc_count }})
                              </q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-item-label caption>
                                <span v-if="parseInt(i.grc_limitTime) == 1">无限制</span>
                                <span v-if="parseInt(i.grc_limitTime) == 2">使用限制为{{ i.grc_limitCount }}次/年</span>
                                <span v-if="parseInt(i.grc_limitTime) == 3">使用限制为{{ i.grc_limitCount }}次/季度</span>
                                <span v-if="parseInt(i.grc_limitTime) == 4">使用限制为{{ i.grc_limitCount }}次/月</span>
                                <span v-if="parseInt(i.grc_limitTime) == 5">使用限制为{{ i.grc_limitCount }}次/周</span>
                                <span v-if="parseInt(i.grc_limitTime) == 6">使用限制为{{ i.grc_limitCount }}次/天</span>
                                <q-icon name="las la-archive" color="red" />
                              </q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-expansion-item>
                    </q-list>
                  </div>
                </q-card-section>
                <q-card-section flat v-else>
                  <div class="q-ml-md">
                    暂无赠送
                  </div>
                </q-card-section>
              </q-card>
              <q-card flat bordered class="q-my-xs">
                <q-card-section class="row items-center q-py-xs">
                  <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />赠送计时</span>
                  <q-space />
                  <q-btn label="添加时卡" unelevated @click="showSelectGoods" color="primary" />
                </q-card-section>
                <q-separator />
                <q-card-section flat class="row" v-if="selectedGoodsTimingData.length > 0">
                  <div class="q-px-xs col-4" v-for="(item, key) in selectedGoodsTimingData" :key="key">
                    <q-list bordered separator>
                      <q-item>
                        <q-item-section>
                          <q-item-label>名称：{{ item.gtg_name }}</q-item-label>
                          <q-item-label>
                            价格：
                            <span class="text-orange"> {{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_moneySymbol }} </span>
                            <span class="text-h6 text-orange text-weight-bold">{{ item.gtg_selling_price }}</span>
                          </q-item-label>
                        </q-item-section>
                        <q-btn round color="red" flat class="absolute-top-right" icon="las la-times-circle" @click="delTiming(key, 0)" />
                      </q-item>
                      <q-expansion-item expand-separator icon="access_time" label="详情">
                        <q-list v-if="item.detail">
                          <q-item v-for="(i, k) in item.detail" :key="k">
                            <q-item-section>
                              <q-item-label>{{ i.tgd_goods_name }}</q-item-label>
                            </q-item-section>
                            <q-item-section side>
                              <q-item-label caption>({{ i.tgd_time_compute_duration }}分钟) <q-icon name="star" color="yellow"/></q-item-label>
                            </q-item-section>
                          </q-item>
                        </q-list>
                      </q-expansion-item>
                    </q-list>
                  </div>
                </q-card-section>
                <q-card-section flat class="row" v-else>
                  <div class="q-ml-md">
                    暂无赠送
                  </div>
                </q-card-section>
              </q-card>
              <q-card flat bordered class="q-my-xs">
                <q-card-section class="row items-center q-py-xs">
                  <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />赠送优惠券</span>
                  <q-space />
                  <q-btn unelevated color="primary" label="添加优惠券" @click="showCoupon" />
                </q-card-section>
                <q-separator />
                <q-card-section flat class="row" v-if="selectedCouponData.length > 0">
                  <div class="q-px-xs col-4" v-for="(item, key) in selectedCouponData" :key="key">
                    <q-list bordered separator>
                      <q-item>
                        <q-item-section>
                          <q-item-label class="text-h6">{{ item.cou_title }}</q-item-label>
                          <q-item-label caption lines="3">
                            <q-badge outline color="red" class="q-mx-xs">
                              {{ couponTypeItem[parseInt(item.cou_type)] }}
                            </q-badge>
                            <q-badge outline color="primary" class="q-ma-xs">
                              {{ couponPropertyItem[parseInt(item.cou_couponProperty)] }}
                            </q-badge>
                            <q-badge outline color="teal" class="q-ma-xs" v-if="parseInt(item.cou_dateType) == 1">
                              {{ $q_date.formatDate(item.cou_startTime * 1000, 'YYYY-MM-DD') }} 至
                              {{ $q_date.formatDate(item.cou_startTime * 1000, 'YYYY-MM-DD') }}
                            </q-badge>
                            <q-badge outline color="teal" class="q-ma-xs" v-else-if="parseInt(item.cou_dateType) == 2">
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
                            {{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit }}
                          </q-item-label>
                          <q-item-label caption lines="3" v-if="parseInt(item.cou_type) == 7">
                            兑换 <span class="text-h6 text-deep-orange text-text-weight-bolder"> {{ item.cou_give_balance }} </span>
                            {{ $q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_balanceUnit }}
                          </q-item-label>
                        </q-item-section>
                        <q-btn round color="red" flat class="absolute-top-right" icon="las la-times-circle" @click="delCoupon(key, 0)" />
                      </q-item>
                    </q-list>
                  </div>
                </q-card-section>
                <q-card-section flat class="row" v-else>
                  <div class="q-ml-md">
                    暂无赠送
                  </div>
                </q-card-section>
              </q-card>
            </q-form>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
          <q-btn unelevated label="确定" :disable="addButtonDisabled" class="q-px-xl" color="primary" @click="setData" />
          <q-btn unelevated label="返回" class="q-px-xl" color="grey" v-close-popup />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import SelectCoupon from '../../hlcoupon/components/SelectCoupon.vue'
import SelectGoods from './SelectGoods'
export default {
  name: 'MarketAddPackage',
  components: {
    SelectCoupon,
    SelectGoods
  },
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      selectCountStatus: false,
      couponPoppupStatus: false,
      selectGoodsPoppupStatus: false,
      packageData: {
        pmp_sort: 0,
        pmp_name: '',
        pmp_market_proportion: '',
        pmp_market_amount: 0,
        pmp_give_balance: 0,
        pmp_give_integral: 0
      },
      selectedCountData: [],
      selectedGoodsTimingData: [],
      selectedCouponData: [],
      selectedCouponIdData: [],
      couponTypeItem: this.$store.state.hlCoupon.typeItem,
      couponPropertyItem: this.$store.state.hlCoupon.propertyItem
    }
  },
  created () {
    if (parseInt(this.$route.query.id) > 0) {
      this.init(this.$route.query.id)
    }
  },
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      if (id > 0) {
        this.$store
          .dispatch('market/getPackageItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.packageData = res.data.package ? res.data.package : {}
              this.selectedCouponData = res.data.coupon ? res.data.coupon : []
              this.selectedGoodsTimingData = res.data.timing ? res.data.timing : []
              this.selectedCountData = res.data.count ? res.data.count : []
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
      this.$refs.packageRefs.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          const params = {
            ...this.packageData,
            couponData: this.selectedCouponData,
            countData: this.selectedCountData,
            timingData: this.selectedGoodsTimingData
          }
          this.$store
            .dispatch('market/setPackageData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.packageData.id > 0 ? '修改' : '新增'}` + '分佣权益成功',
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
      if (selectedCouponData && !this.selectedCouponIdData.includes(parseInt(selectedCouponData.id))) {
        this.selectedCouponData.push(selectedCouponData)
        this.selectedCouponIdData.push(parseInt(selectedCouponData.id))
      }
      this.couponPoppupStatus = false
    },
    hideSelectGoodsPoppup (item) {
      this.selectedGoodsTimingData.push(item)
      this.$q.notify({
        message: '成功',
        caption: '添加计时卡成功！',
        icon: 'ion-checkmark-circle-outline',
        color: 'green',
        timeout: 500,
        position: 'top-right'
      })
      this.selectGoodsPoppupStatus = false
    },
    setCount (packageId, item) {
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
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
