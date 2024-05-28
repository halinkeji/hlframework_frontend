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
                    注意：赠送卡券、{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}、{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit }}时，不填不选则不赠送!
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
                <div class="col-6 q-pr-sm">
                  <q-select
                    outlined
                    dense
                    v-model="mezsData.pmp_max_type"
                    :options="[
                      {
                        label: '满实付',
                        value: 1,
                      },
                      {
                        label: '满应付',
                        value: 2,
                      },
                    ]"
                    label="满额条件类型"
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
                  <q-input outlined dense v-model="mezsData.pmp_give_balance" :label="`赠送${$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_balanceUnit}`" :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的数值']" />
                </div>
                <div class="col-6 q-pr-sm">
                  <q-input outlined dense v-model="mezsData.pmp_give_integral" :label="`赠送${$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit}`" :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || `请输入正确的赠送${$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit}`]" />
                </div>
              </div>
              <div class="q-mt-xs">
                <q-chip outline square color="red" text-color="white"> 赠送{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_balanceUnit }} {{ mezsData.pmp_give_balance }} {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}，赠送 {{ mezsData.pmp_give_integral }} {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit }} </q-chip>
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
          <q-btn unelevated label="确定" :disable="addButtonDisabled" class="q-px-xl" color="primary" @click="setData"  />
          <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
        </div>
      </div>

    </q-card>
  </q-dialog>
</template>
<script>

export default {
  name: 'AddPackage',
  components: {

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
        pmp_give_integral: 0,
        pmp_max_type: 1
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

    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.$store
          .dispatch('mezs/getItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.mezsData = res.data.package ? res.data.package : {}
              this.mezsData.pmp_status = parseInt(res.data.package.pmp_status)

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

    setCouponData (val) {
      this.selectedCouponData = val
    },
    setGoodsCountData (val) {
      this.selectedCountData = val
    },
    setGoodsTimeData (val) {
      this.selectedGoodsTimingData = val
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
