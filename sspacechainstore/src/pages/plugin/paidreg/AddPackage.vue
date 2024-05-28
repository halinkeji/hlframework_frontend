<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.5 + 'px',
        'min-width': this.$q.screen.width * 0.5 + 'px',
      }"
      class=" fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll q-pa-sm">
        <div class="col-shrink bg-white q-px-xs q-pb-md row items-center">
          {{ packageData.id > 0 ? '修改' : '新增' }}开卡套餐
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>

        <div class="col-shrink q-pa-sm full-height ">
          <q-scroll-area class="fit full-height">
            <q-form ref="packageDataRef">
              <div class="q-pr-sm">
                <q-banner rounded class="text-white bg-red" dense>
                  注意：赠送卡券、{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}、{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit }}时，不填不选则不赠送! 开启会员权益会直接赠送会员级别相关权益！
                </q-banner>
              </div>
              <div class="row q-mt-md">
                <div class="col-6 q-pr-md">
                  <q-input outlined dense v-model="packageData.pp_name" label="套餐名称" lazy-rules :rules="[(val) => !!val || '请输入名称']" />
                </div>
                <div class="col-6 q-pr-sm">
                  <q-input outlined dense v-model="packageData.pp_selling_price" label="售卡金额" :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的售卡金额']" />
                </div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-6 q-pr-md">
                  <q-select outlined dense v-model="packageData.pp_type" :options="typeOptions" label="类型" class="col-12 col-md-2" option-label="label" emit-value map-options />
                </div>
                <div class="col-6 q-pr-sm">
                  <q-select outlined dense v-model="packageData.pp_status" :options="statusOptions" label="状态" class="col-12 col-md-2" option-label="label" emit-value map-options />
                </div>
              </div>
              <div class="row q-mt-lg">
                <div class="col-6 q-pr-md">
                  <q-select
                    outlined
                    dense
                    v-model="packageData.pp_member_level"
                    :options="levelOptions"
                    label="会员等级"
                    class="col-12 col-md-2"
                    option-label="mcl_level_name"
                    option-value="id"
                    emit-value
                    map-options
                  />
                </div>
                <div class="col-6 q-pr-sm">
                  <q-select outlined dense v-model="packageData.pp_is_level_equity" :options="statusOptions" label="会员权益" class="col-12 col-md-2" option-label="label" emit-value map-options />
                </div>
              </div>
              <div class="row q-mt-lg">
                <div class="col-6 q-pr-md">
                  <q-input outlined dense v-model="packageData.pp_give_balance" :label="`赠送${$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_balanceUnit}`" :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确数值']" />
                </div>
                <div class="col-6 q-pr-sm">
                  <q-input outlined dense v-model="packageData.pp_give_integral" :label="`赠送${$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit}`" :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || `请输入正确的赠送${$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit}`]" />
                </div>
              </div>
              <div class="q-mt-xs">
                <q-chip outline square color="red" text-color="white"> 赠送{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_balanceUnit }} {{ packageData.pp_give_balance }} {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}，赠送 {{ packageData.pp_give_integral }} {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit }} </q-chip>
              </div>

            </q-form>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-py-sm q-gutter-sm text-center">
          <q-btn unelevated label="确定" :disable="addButtonDisabled" color="primary" class="q-px-xl" @click="setData"  />
          <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
        </div>
      </div>
    </q-card>

  </q-dialog>
</template>
<script>

export default {
  name: 'PaidregAddPackage',
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
        pp_name: '',
        pp_selling_price: '',
        pp_type: 1,
        pp_status: 1,
        pp_member_level: '',
        pp_is_level_equity: -1,
        pp_give_balance: 0,
        pp_give_integral: 0
      },
      selectedCouponData: [],
      selectedCountData: [],
      selectedGoodsTimingData: [],
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
          label: '非付费',
          value: 1
        },
        {
          label: '付费',
          value: 2
        }
      ],
      selectedCouponIdData: [],
      couponTypeItem: this.$store.state.hlCoupon.typeItem,
      couponPropertyItem: this.$store.state.hlCoupon.propertyItem
    }
  },
  created () {
    this.getMemberLevelList()
  },
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.$store
          .dispatch('paidreg/getItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.packageData = res.data.package ? res.data.package : {}
              this.packageData.pp_type = res.data.package.pp_type ? parseInt(res.data.package.pp_type) : ''
              this.packageData.pp_status = res.data.package.pp_status ? parseInt(res.data.package.pp_status) : ''
              this.packageData.pp_is_level_equity = res.data.package.pp_is_level_equity ? parseInt(res.data.package.pp_is_level_equity) : ''

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
            .dispatch('paidreg/setData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.packageData.id > 0 ? '修改' : '新增'}` + '开卡套餐成功',
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
