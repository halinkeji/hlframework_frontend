<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-pa-sm full-height bg-grey-2">
      <q-scroll-area class="fit full-height">
        <q-form ref="payConfigRef">
          <div class="row">
            <div class="col-md-4 col-12 q-pr-md q-mt-md">
              <q-card bordered flat>
                <q-card-section>
                  <span class="text-subtitle1">消费使用优惠券</span>
                  <q-toggle v-model="payConfigForm.pzc_coupon_use_switch" color="green" :true-value="'1'" :false-value="'0'" class="float-right" />
                </q-card-section>
                <q-separator />
                <p class="q-ma-md">
                  开启后，会员消费时可以使用优惠券进行消费
                </p>
              </q-card>
            </div>
            <div class="col-md-4 col-12 q-pr-md q-mt-md">
              <q-card bordered flat>
                <q-card-section>
                  <span class="text-subtitle1">会员支付储值抵现倍率</span>
                  <q-toggle v-model="payConfigForm.pzc_balance_cash_switch" color="green" :true-value="'1'" :false-value="'0'" class="float-right" />
                </q-card-section>
                <q-separator />
                <p class="q-ma-md">
                  PC端、一码付，定额收款，主动收款时会员储值 抵现。如输入“1”则最大可抵现本次消费的1% 100元可用储值抵现 1 元
                </p>
                <q-input
                  outlined
                  bottom-slots
                  v-model="payConfigForm.pzc_balance_cash_ratio"
                  dense
                  :rules="[(val) => /(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100.00$)/.test(val) || '请输入0.01-100.00之间倍率']"
                  class="q-px-md"
                >
                </q-input>
              </q-card>
            </div>
            <div class="col-md-4 col-12 q-pr-md q-mt-md">
              <q-card bordered flat>
                <q-card-section>
                  <span class="text-subtitle1">储值扣费赠积分</span>
                  <q-toggle
                    v-model="payConfigForm.pzc_balance_give_point_switch"
                    color="green"
                    :true-value="'1'"
                    :false-value="'0'"
                    class="float-right"
                  />
                </q-card-section>
                <q-separator />
                <p class="q-ma-md">
                  设置会员储值扣费赠积分比例。 如：输入“1” [8元 * 1 = 8 积分]
                </p>
                <q-input
                  outlined
                  bottom-slots
                  v-model="payConfigForm.pzc_balance_give_point_ratio"
                  dense
                  :rules="[(val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的数值']"
                  class="q-px-md"
                >
                </q-input>
              </q-card>
            </div>
            <div class="col-md-4 col-12 q-pr-md q-mt-md">
              <q-card bordered flat>
                <q-card-section>
                  <span class="text-subtitle1">会员支付总积分可用倍率</span>
                  <q-toggle
                    v-model="payConfigForm.pzc_point_use_cash_switch"
                    color="green"
                    :true-value="'1'"
                    :false-value="'0'"
                    class="float-right"
                  />
                </q-card-section>
                <q-separator />
                <p class="q-ma-md">
                  PC端、微信端、 收款台会员可使用总积分倍率。
                  如输入“10”则最多可使用总积分的10%,例如会员总积分为100积分，则本次会员最多只能用总积分的10%
                  （示例：100×10%=10，本次交易最多只能使用10积分）
                </p>
                <q-input
                  outlined
                  bottom-slots
                  v-model="payConfigForm.pzc_point_use_cash_ratio"
                  dense
                  :rules="[(val) => /(^(\d|[1-9]\d)(\.\d{1,2})?$)|(^100.00$)/.test(val) || '请输入0.01-100.00之间倍率']"
                  class="q-px-md"
                >
                </q-input>
              </q-card>
            </div>
            <div class="col-md-4 col-12 q-pr-md q-mt-md">
              <q-card bordered flat>
                <q-card-section>
                  <span class="text-subtitle1">积分抵现比例</span>
                  <q-toggle v-model="payConfigForm.pzc_point_cash_switch" color="green" :true-value="'1'" :false-value="'0'" class="float-right" />
                </q-card-section>
                <q-separator />
                <p class="q-ma-md">
                  设置会员积分抵现比例。 如：输入“30” [100 积分 * 30% = 可抵扣 30 元]
                </p>
                <q-input
                  outlined
                  bottom-slots
                  v-model="payConfigForm.pzc_point_cash_ratio"
                  dense
                  :rules="[(val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的数值']"
                  class="q-px-md"
                >
                </q-input>
              </q-card>
            </div>
          </div>
        </q-form>
      </q-scroll-area>
    </div>
    <div class="col-shrink bg-white q-py-sm text-center">
      <q-btn unelevated v-if="authorityMeta('save')" class="q-px-xl" label="提交" @click="saveData" color="primary" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'PayConfig',
  data () {
    return {
      payConfigForm: {
        pzc_point_give_switch: '0', // 赠送积分开关
        pzc_point_give_ratio: 0, // 赠送积分比率
        pzc_balance_cash_switch: '0', // 储值抵现开关
        pzc_balance_cash_ratio: 0, // 储值抵现比例
        pzc_balance_give_point_switch: '0', // 储值扣费赠积分开关
        pzc_balance_give_point_ratio: 0, // 储值扣费赠积分比率
        pzc_point_cash_switch: '0', // 积分抵现比例开关
        pzc_point_cash_ratio: 0, // 积分抵现比例
        pzc_point_use_cash_switch: '0', // 积分抵现可用倍率开关
        pzc_point_use_cash_ratio: 0, // 积分抵现可用倍率
        pzc_coupon_use_switch: '0' // 是否使用优惠券
      }
    }
  },
  created () {},
  mounted () {
    this.getConsumeSet()
  },
  computed: {},
  methods: {
    getConsumeSet () {
      this.$store
        .dispatch('zzpay/getItem')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.payConfigForm = res.data
          }
        })
        .catch((error) => {
          // console.log('error', error)
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            position: 'top-right'
          })
        })
    },
    saveData () {
      this.$refs.payConfigRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.payConfigForm
          }
          this.$store
            .dispatch('zzpay/addData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: '修改信息成功',
                  color: 'green'
                })
                this.getConsumeSet()
              }
            })
            .catch((error) => {
              this.$q.notify({
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                message: '失败',
                caption: error.message,
                color: 'red'
              })
            })
        }
      })
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
