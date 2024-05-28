<template>
  <q-dialog v-model="dialogStatus" persistent>
    <q-card
      :style="{
        width: $q.screen.width * 0.3 + 'px',
        'min-width': $q.screen.width * 0.3 + 'px',
      }"
    >
      <div class="col-shrink bg-white q-pa-sm text-subtitle2 row">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        卡券核销
         <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="colseDialog" />
      </div>
      <div class="col-shrink bg-white full-height bg-grey-2 q-mt-xs">
        <div class="row fit bg-white justify-around">
          <q-form @submit="coupoInquirenCheck" ref="submitFormRef" class="col-12 text-center q-px-xs q-pt-md">
            <q-card square flat class="full-width">
              <q-input
                label="优惠券核销码"
                outlined
                bottom-slots
                @keyup.enter.native="coupoInquirenCheck"
                v-model="checkNumber"
                lazy-rules
                :rules="[(val) => !!val || '请填写优惠券核销码']"
                :disable="couponInfo && couponInfo.id ? true : false"
              >
              </q-input>
            </q-card>

            <q-card flat bordered v-if="couponInfo && couponInfo.id">
              <q-badge color="orange" floating> {{ couponInfo.cmd_type_name }}</q-badge>
              <q-list>
                <q-item>
                  <q-item-section avatar>
                    <q-icon color="amber" name="person" />
                  </q-item-section>
                  <q-item-section class="text-dark" side>
                    <q-item-label>{{ couponInfo.coupon.cou_title }}</q-item-label>
                    <q-item-label caption>{{ couponInfo.coupon.cou_sub_title }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon color="amber" name="alarm" />
                  </q-item-section>

                  <q-item-section class="text-dark" side>
                    <q-item-label>到期时间</q-item-label>
                    <q-item-label caption> {{ $q_date.formatDate(couponInfo.cmd_activityendtime * 1000, 'YYYY-MM-DD  HH:mm:ss') }}</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon color="red" name="redeem" />
                  </q-item-section>

                  <q-item-section class="text-dark" side>
                    <q-item-label class="text-weight-bolder text-red" lines="2">
                      <span class="text-h4" v-if="parseInt(couponInfo.coupon.cou_type) == 1">
                        {{ couponInfo.coupon.cou_rebate * 0.1 }}
                        <span class="text-caption">折</span>
                      </span>
                      <span class="text-h4" v-if="parseInt(couponInfo.coupon.cou_type) == 2">
                        <span class="text-caption"> 满 </span>
                        <span class="text-h6 text-deep-orange text-text-weight-bolder">{{ couponInfo.coupon.cou_fill }}</span>
                        <span class="text-caption"> 减 </span>
                        <span class="text-h6 text-deep-orange text-text-weight-bolder">{{ couponInfo.coupon.cou_minus }} </span>
                      </span>
                      <span v-if="parseInt(couponInfo.coupon.cou_type) == 3">
                        {{ couponInfo.coupon.cou_extra }}
                      </span>
                      <span v-if="parseInt(couponInfo.coupon.cou_type) == 4">
                        {{ couponInfo.coupon.cou_extra }}
                      </span>
                      <span v-if="parseInt(couponInfo.coupon.cou_type) == 5">
                        {{ couponInfo.coupon.cou_extra }}
                      </span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <q-separator />

              <q-list dense separator v-if="couponInfo.bindGoodsList && couponInfo.bindGoodsList.length > 0">
                <q-item-label class="text-subtitle1 q-py-sm">
                  <q-chip color="primary" text-color="white"> 关联\限用商品 </q-chip>
                </q-item-label>
                <q-item :key="key" v-for="(item, key) in couponInfo.bindGoodsList">
                  <q-item-section avatar>
                    <q-icon color="red" name="las la-gift" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-subtitle1 text-left">
                      {{ item.goodsName }} <span v-if="item.specId > 0">-{{ item.specificationName }}</span>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label class="text-right">
                      <span class="text-orange">
                        {{ $q.localStorage.getItem('cychainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                      </span>
                      <span class="text-h6 text-orange text-weight-bold">{{ item.goodsPrice }}</span>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-form>
        </div>
      </div>
      <div class="col-shrink bg-white q-pb-md q-gutter-md q-mt-xs text-center">
        <q-btn unelevated color="amber-8" class="q-px-xl" label="重置" :disable="!checkNumber" @click="refreshBut()" size="lg" />
        <q-btn
          unelevated
          color="positive"
          class="q-px-xl"
          label="确定"
          v-if="couponInfo && couponInfo.id"
          :disable="!checkNumber"
          size="lg"
          @click="couponCheck"
        />
        <q-btn unelevated color="primary" class="q-px-xl" label="查询" v-else :disable="!checkNumber" size="lg" @click="coupoInquirenCheck" />
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'DialogCheck',
  data () {
    return {
      checkNumber: '',
      couponInfo: {
        coupon: {}
      },
      dialogStatus: false
    }
  },
  computed: {},
  created () {},
  mounted () {},
  methods: {
    init () {
      this.dialogStatus = true
    },
    coupoInquirenCheck () {
      const obj = {
        check: this.checkNumber
      }
      this.$store
        .dispatch('hlCoupon/inquireCoupon', obj)
        .then((res) => {
          if (res.code == 400) {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            this.checkNumber = ''
            this.couponInfo = {}
            return false
          } else {
            this.couponInfo = res.data
          }
        })
        .catch((error) => {})
    },
    couponCheck () {
      this.dialogStatus = false
      const couponInfo = this.couponInfo
      const obj = {
        coupon_id: couponInfo.cmd_card_id,
        record_id: couponInfo.id,
        member_id: couponInfo.member_id
      }
      this.$store
        .dispatch('hlCoupon/addConsumBufferData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '成功添加' + (res.data || 0) + '条商品',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.$emit('setUseCoupon', this.couponInfo)
            return false
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
            this.colseDialog()
            return false
          }
        })
        .catch((error) => {})
    },
    colseDialog () {
      this.dialogStatus = false

      this.$emit('colseDialog')
    },
    refreshBut () {
      this.checkNumber = ''
      this.couponInfo = {}
    }
  }
}
</script>
