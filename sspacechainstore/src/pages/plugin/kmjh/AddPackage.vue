<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.5 + 'px',
        'min-width': this.$q.screen.width * 0.5 + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-pa-sm row q-pb-md">
          <div class="text-h6">{{ packageData.id > 0 ? '查看' : '新增' }}卡密激活规则</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>

        <div class="col-shrink q-pa-sm full-height">
          <q-scroll-area class="fit full-height">
            <q-form ref="packageDataRef">
              <div class="q-pr-sm">
                <q-banner rounded class="text-white bg-red" dense>
                  注意：规则不可修改！注册规则必须选择会员等级！开启会员权益会直接赠送会员级别相关权益！赠送卡券、{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}、{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit }}时，不填不选则不赠送!
                </q-banner>
              </div>
              <div class="row q-mt-md">
                <div class="col-6 q-pr-md">
                  <q-input outlined dense v-model="packageData.pkp_name" label="名称" lazy-rules :rules="[(val) => !!val || '请输入名称']" />
                </div>
                <div class="col-6 q-pr-sm">
                  <q-input outlined dense v-model="packageData.pkp_selling_price" label="售价" :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的售价']" />
                </div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-6 q-pr-md">
                  <q-select outlined dense v-model="packageData.pkp_type" :options="typeOptions" label="类型" class="col-12 col-md-2" option-label="label" emit-value map-options />
                </div>
                <div class="col-6 q-pr-sm">
                  <q-select outlined dense v-model="packageData.pkp_status" :options="statusOptions" label="状态" class="col-12 col-md-2" option-label="label" emit-value map-options />
                </div>
              </div>
              <div class="row q-mt-lg">
                <div class="col-6 q-pr-md">
                  <q-select
                    outlined
                    dense
                    v-model="packageData.pkp_member_level"
                    :options="levelOptions"
                    label="会员等级"
                    class="col-12 col-md-2"
                    option-label="mcl_level_name"
                    option-value="id"
                    emit-value
                    map-options
                    :rules="[(val) => (parseInt(packageData.pkp_type) == 1 ? true : !!val || '请选择会员等级')]"
                  />
                </div>
                <div class="col-6 q-pr-sm">
                  <q-select outlined dense v-model="packageData.pkp_is_level_equity" :options="statusOptions" label="会员权益" class="col-12 col-md-2" option-label="label" emit-value map-options />
                </div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-6 q-pr-md">
                  <q-input outlined dense v-model="packageData.pkp_give_balance" :label="`赠送${$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_balanceUnit}`" :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的赠送'+$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_balanceUnit]" />
                </div>
                <div class="col-6 q-pr-sm">
                  <q-input outlined dense v-model="packageData.pkp_give_integral" :label="`赠送${$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit}`" :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的赠' + $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit]" />
                </div>
              </div>
              <div class="q-mt-xs">
                <q-chip outline square color="red" text-color="white"> 赠送{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_balanceUnit }} {{ packageData.pkp_give_balance }}{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}，赠送 {{ packageData.pkp_give_integral }} {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit }} </q-chip>
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
        <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm" v-if="!packageData.id">
          <q-btn unelevated label="确定" :disable="addButtonDisabled" class="q-px-xl" color="primary" @click="setData" />
          <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
        </div>
      </div>
    </q-card>

  </q-dialog>
</template>
<script>

export default {
  name: 'KmjhAddPackage',
  components: {

  },
  data () {
    return {
      showDialog: true,
      selectCountStatus: false,
      couponPoppupStatus: false,
      selectGoodsPoppupStatus: false,
      addButtonDisabled: false,
      packageData: {
        pkp_name: '',
        pkp_selling_price: '',
        pkp_type: 1,
        pkp_status: 1,
        pkp_member_level: '',
        pkp_is_level_equity: -1,
        pkp_give_balance: 0,
        pkp_give_integral: 0
      },
      selectedCouponData: [],
      selectedCountData: [],
      selectedGoodsTimingData: [],
      selectedCouponIdData: [],
      levelOptions: [],
      statusOptions: [
        {
          label: '开启',
          value: 1
        },
        {
          label: '关闭',
          value: -1
        }
      ],
      typeOptions: [
        {
          label: '卡密充值',
          value: 1
        },
        {
          label: '卡密激活',
          value: 2
        }
      ]
    }
  },
  created () {
    this.getMemberLevelList()
  },
  mounted () {},
  computed: {},
  methods: {
    getMemberLevelList () {
      this.$store
        .dispatch('level/getAllData')
        .then((res) => {
          if (res.code == 200) {
            this.levelOptions = res.data ? res.data : []
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
    hideCouponPoppup (couponValue) {
      if (couponValue) {
        const couponIndex = _.findIndex(this.selectedCouponData, function (o) {
          return parseInt(o.id) == parseInt(couponValue.id)
        })
        if (couponIndex < 0) {
          this.selectedCouponData.push(couponValue)
        }
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
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.$store
          .dispatch('kmjh/getItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.packageData = res.data.package ? res.data.package : {}
              this.packageData.pkp_type = res.data.package.pkp_type ? parseInt(res.data.package.pkp_type) : ''
              this.packageData.pkp_status = res.data.package.pkp_status ? parseInt(res.data.package.pkp_status) : ''
              this.packageData.pkp_is_level_equity = res.data.package.pkp_is_level_equity ? parseInt(res.data.package.pkp_is_level_equity) : ''

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
      this.$refs.packageDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          const params = {
            ...this.packageData,
            couponData: this.selectedCouponData,
            countData: this.selectedCountData,
            TimingData: this.selectedGoodsTimingData
          }
          this.$store
            .dispatch('kmjh/setData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.packageData.id > 0 ? '修改' : '新增'}` + '规则成功',
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
