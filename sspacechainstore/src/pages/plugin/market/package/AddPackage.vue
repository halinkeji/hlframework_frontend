<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.55 + 'px',
        'min-width': this.$q.screen.width * 0.55 + 'px',
      }"
      class="fit"
    >

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
                  <q-input outlined dense v-model="packageData.pmp_sort" label="排序" :rules="[(val) => /^\d+$/.test(val) || '请输入正确的排序']">
                  </q-input>
                </div>
                <div class="col-6 q-pl-sm">
                  <q-input outlined dense v-model="packageData.pmp_name" label="权益名称" :rules="[(val) => !!val || '请输入权益名称']"> </q-input>
                </div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-6 q-pr-sm">
                  <q-input
                    outlined
                    dense
                    v-model="packageData.pmp_market_amount"
                    label="佣金"
                    hint="下级会员消费时，他的上级可获得的固定佣金"
                    :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的佣金']"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2">{{
                        $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol
                      }}</span>
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
                    :rules="[
                      (val) =>
                        !val
                          ? '请输入佣金比例'
                          : (/^(\d+|\d+\.\d{1})$/.test(val) && parseFloat(val) <= 99.9 && parseFloat(val) >= 0) || '支持0到99.9',
                    ]"
                  >
                    <template v-slot:append>
                      <q-separator dark color="grey" class="q-mr-sm" vertical />
                      <span class="text-subtitle2">%</span>
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
                    :label="`赠送${$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_balanceUnit}`"
                    :rules="[
                      (val) =>
                        /^(\d+|\d+\.\d{1,2})$/.test(val) ||
                        '请输入正确的赠送' + $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
                    ]"
                  />
                </div>
                <div class="col-6 q-pl-sm">
                  <q-input
                    outlined
                    dense
                    v-model="packageData.pmp_give_integral"
                    :label="`赠送${$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit}`"
                    :rules="[
                      (val) =>
                        /^(\d+|\d+\.\d{1,2})$/.test(val) ||
                        '请输入正确的赠送' + `${$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit}`,
                    ]"
                  />
                </div>
              </div>

              <hl-give-data-bind
                @setCouponData="setCouponData"
                @setGoodsCountData="setGoodsCountData"
                @setGoodsTimeData="setGoodsTimeData"
                ref="upgradeBindRef"
              />
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

export default {
  name: 'MarketAddPackage',
  components: {

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

              if (res.data && res.data.coupon && res.data.coupon.length > 0) {
                this.selectedCouponData = res.data.coupon
                this.$refs.upgradeBindRef.setBindGiveCoupon(this.selectedCouponData)
              }
              if (res.data && res.data.count && res.data.count.length > 0) {
                this.selectedCountData = res.data.count
                this.$refs.upgradeBindRef.setBindGiveGoodsCount(this.selectedCountData)
              }
              if (res.data && res.data.timing && res.data.timing.length > 0) {
                this.selectedGoodsTimingData = res.data.timing
                this.$refs.upgradeBindRef.setBindGiveGoodsTime(this.selectedGoodsTimingData)
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
