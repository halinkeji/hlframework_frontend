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
                    注意：赠送卡券、{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}、{{
                      $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit
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
                    :label="'赠送' + `${$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit}`"
                    lazy-rules
                    :rules="[(val) => /^[0-9]+(.[0-9]{1,2})?$/.test(val) || '请输入正确的' + `${$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit}`]"
                  />
                </div>
                <div class="col-6">
                  <q-input outlined dense class="q-px-sm" v-model="rulesData.cr_give_money" label="赠送金额" lazy-rules :rules="[(val) => /^[0-9]+(.[0-9]{1,2})?$/.test(val) || '请输入正确的金额']" />
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
          <q-btn unelevated class="q-px-xl" label="提交"  @click="saveData()" :disable="disableButton" color="primary" />
          <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage()" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'AddRules',
  components: {

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

    setCouponData (val) {
      this.selectedCouponData = val
    },
    setGoodsCountData (val) {
      this.selectedCountData = val
    },
    setGoodsTimeData (val) {
      this.selectedGoodsTimingData = val
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
