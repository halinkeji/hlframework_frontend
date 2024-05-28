<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink full-height ">
      <q-scroll-area class="fit full-height">

        <q-card flat bordered class="q-my-xs">
          <q-card-section class="row items-center q-py-xs">
            <span><q-icon color="primary" name="las la-square-full" class="q-pr-sm" size="16px" />赠送优惠券</span>
            <q-space />
            <q-btn unelevated color="primary" label="添加优惠券" @click="showCoupon" />
          </q-card-section>

          <q-separator />

          <q-card-section flat class="row" v-if="selectedCouponData.length > 0">
            <div class="q-pr-md col-3" v-for="(item, key) in selectedCouponData" :key="key">
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
                      兑换 <span class="text-h6 text-deep-orange text-text-weight-bolder"> {{ item.cou_give_integral }} </span> {{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit }}
                    </q-item-label>
                    <q-item-label caption lines="3" v-if="parseInt(item.cou_type) == 7">
                      兑换 <span class="text-h6 text-deep-orange text-text-weight-bolder"> {{ item.cou_give_balance }} </span> {{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_balanceUnit }}
                    </q-item-label>
                  </q-item-section>
                  <q-btn round color="red" flat class="absolute-top-right" icon="las la-times-circle" @click="delCoupon(key)" />
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
      </q-scroll-area>
    </div>
    <select-coupon ref="couponRef" v-if="couponPoppupStatus" @dataList="setCouponData" />

  </div>
</template>
<script>
// import SelectCoupon from '@pages/plugin/hlcoupon/components/SelectCoupon'
import SelectCoupon from '../../../plugin/hlcoupon/components/SelectCoupon'
export default {
  name: 'UpgradeBind',
  components: {
    SelectCoupon
  },
  data () {
    return {
      selectedCouponData: [],
      selectedCountData: [],
      selectedGoodsTimingData: [],
      selectedCouponIdData: [],
      selectCountStatus: false,
      couponPoppupStatus: false,
      selectGoodsPoppupStatus: false,
      couponTypeItem: this.$store.state.hlCoupon.typeItem,
      couponPropertyItem: this.$store.state.hlCoupon.propertyItem
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    setBindGiveCoupon (val) {
      this.selectedCouponData = val
    },
    setBindGiveGoodsCount (val) {
      this.selectedCountData = val
    },
    setBindGiveGoodsTime (val) {
      this.selectedGoodsTimingData = val
    },
    delCoupon (key) {
      this.selectedCouponData.splice(key, 1)
      this.$emit('setCouponData', this.selectedCouponData)
    },
    delCount (key) {
      this.selectedCountData.splice(key, 1)
      this.$emit('setGoodsCountData', this.selectedCountData)
    },
    delTiming (key) {
      this.selectedGoodsTimingData.splice(key, 1)
      this.$emit('setGoodsTimeData', this.selectedGoodsTimingData)
    },
    setCount (packageId, item) {
      this.selectedCountData.push(item)
      this.$emit('setGoodsCountData', this.selectedCountData)
    },
    setCouponData (selectedCouponData) {
      if (selectedCouponData) {
        if (!this.selectedCouponIdData.includes(parseInt(selectedCouponData.id))) {
          this.selectedCouponData.push(selectedCouponData)
          this.selectedCouponIdData.push(parseInt(selectedCouponData.id))
        }
      }
      this.couponPoppupStatus = false
      this.$emit('setCouponData', this.selectedCouponData)
    },
    setGoodsTimingData (item) {
      this.selectedGoodsTimingData.push(item)
      this.selectGoodsPoppupStatus = false
      this.$emit('setGoodsTimeData', this.selectedGoodsTimingData)
    },
    showGroupCountList () {
      this.selectCountStatus = true
      this.$nextTick(() => {
        this.$refs.selectGoodsRef.info()
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
    }
  }
}
</script>
