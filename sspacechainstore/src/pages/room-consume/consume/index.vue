<template>
  <div class="fit row no-wrap justify-between items-stretch content-stretch">
    <!-- left -->
    <div class="col-shrink col-xs-3 col-sm-4 col-md-4 col-lg-4 col-xl-4">
      <left-layout
        @shoppingCartsList="getShoppingCartsList"
        @selectedShoppingCarInfo="getSelectedShoppingCarInfo"
        @paySuccessCallBack="paySuccessCallBack"
        :member_id="currentMemberInfo && currentMemberInfo.id ? currentMemberInfo.id : 0"
        :currentMemberInfo="currentMemberInfo"
        ref="shoppingCarRef"
        :consumehangup_id="pendingOrderInfo && pendingOrderInfo.id ? pendingOrderInfo.id : 0"
        :couponInfo="couponInfo"
        :currentRoomId="currentRoomId"
      />
    </div>
    <!-- center -->
    <div class="col-shrink col-xs-2 col-sm-1 col-md-1 col-lg-1 col-xl-1">
      <div class="fit column no-wrap justify-between items-stretch content-stretch">
        <div class="col-shrink q-px-xs">
          <q-btn
            color="deep-orange"
            @click="changeQuantityValue(1)"
            :disable="shoppingCartsInfo && shoppingCartsInfo.id && shoppingCartsInfo.goods && parseInt(shoppingCartsInfo.goods.goo_is_weigh) != 1 ? false : true"
            class="full-width q-my-xs"
            v-if="authorityMeta('plus')"
          >
            <span class="text-h4">+</span>
          </q-btn>
          <q-btn
            v-if="authorityMeta('reduce')"
            color="orange"
            @click="changeQuantityValue(2)"
            :disable="shoppingCartsInfo && shoppingCartsInfo.id && shoppingCartsInfo.goods ? false : true"
            class="full-width q-my-xs"
          >
            <span class="text-h4">-</span>
          </q-btn>
          <q-btn
            v-if="authorityMeta('number')"
            color="white"
            class="full-width q-my-xs q-py-sm"
            padding="none"
            :disable="shoppingCartsInfo && shoppingCartsInfo.id ? false : true"
            @click="editQuantityValueDialog"
          >
            <span class="text-subtitle1 q-my-xs text-black">数量(x)</span>
          </q-btn>

          <q-btn
            color="white"
            class="full-width q-my-xs q-py-sm"
            padding="none"
            :disable="shoppingCartsInfo && shoppingCartsInfo.id && shoppingCartsInfo.goods && parseInt(shoppingCartsInfo.goods.goo_is_weigh) != 1 ? false : true"
            @click="editSellPriceDialog"
            v-if="authorityMeta('change')"
          >
            <span class="text-subtitle1 q-my-xs text-black">改价(g)</span>
          </q-btn>
          <q-btn color="white" class="full-width q-my-xs q-py-sm" padding="none" :disable="shoppingCartsList && shoppingCartsList.length > 0 ? false : true" @click="deleteAllData">
            <span class="text-subtitle1 q-my-xs text-black">清空(q)</span>
          </q-btn>

          <q-btn color="negative" class="full-width q-my-xs q-py-sm" @click="cancelConsumeUseCoupon"  padding="none" v-if="couponInfo && couponInfo.id" >

            <span class="text-subtitle1 q-my-xs text-white">
              撤销卡券

            </span>
          </q-btn>
          <q-btn color="green" class="full-width q-my-xs q-py-sm" @click="openCheckCouponBtn"  padding="none" v-else>
             <span class="text-subtitle1 q-my-xs text-white">核销卡券</span>
          </q-btn>
        </div>
        <div class="col-shrink q-px-xs" v-if="authorityMeta('settlement')">
          <q-btn color="deep-orange" class="full-width q-py-sm q-mb-xs" no-caps @click="placeGoodsShoppingOrder" :disable="shoppingCartsList && shoppingCartsList.length > 0 ? false : true">
            <span class="text-h6 q-my-xs text-white">点单完成<br />(space)</span>
          </q-btn>
        </div>
      </div>
    </div>
    <!-- right -->
    <div class="col-shrink col-xs-7 col-sm-7 col-md-7 col-lg-7 col-xl-7">
      <right-layout
        :member_id="currentMemberInfo && currentMemberInfo.id ? currentMemberInfo.id : 0"
        :currentMemberInfo="currentMemberInfo"
        @refreshShoppingCart="refreshShoppingCart"
        :consumehangup_id="pendingOrderInfo && pendingOrderInfo.id ? pendingOrderInfo.id : 0"
         ref="rightLayoutRef"
         :currentRoomId="currentRoomId"
      />
    </div>
    <!-- 修改数量弹窗 -->
    <q-dialog v-model="quantityDialogStatus">
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 0.6 : 0.4)) + 'px',
          'max-width': parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 0.6 : 0.4)) + 'px',
        }"
      >
        <q-card-section>
          <q-input ref="quantityValueRef" class="q-mb-md text-h6" v-model="quantityValue" outlined square>
            <template v-slot:prepend>
              数量
            </template>
          </q-input>
          <hl-keyboard
            :inputNumber="quantityValue"
            @changeNumber="
              (v) => {
                quantityValue = v
              }
            "
            @confirmEvent="editQuantityValue(3, quantityValue)"
            :decimal="true"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- 修改价格弹窗 -->
    <q-dialog v-model="sellPriceDialogStatus">
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 0.6 : 0.4)) + 'px',
          'max-width': parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 0.6 : 0.4)) + 'px',
        }"
      >
        <q-card-section>
          <q-card-section class="row">
             <div class="col-6 col-md-3 q-mt-md q-px-xs" v-for="(item, key) in priceDiscountList">
                  <q-btn unelevated rounded color="green" @click="changeDiscount(item)" class="q-px-md full-width">
                     {{ item }}%
                  </q-btn>
                </div>
          </q-card-section>

          <q-input class="q-mb-md text-h6" v-model="sellPriceValue" ref="sellPriceValueRef" outlined square>
            <template v-slot:prepend>
              售价
            </template>
          </q-input>
          <hl-keyboard
            :inputNumber="sellPriceValue"
            @changeNumber="
              (v) => {
                sellPriceValue = v
              }
            "
            @confirmEvent="editSellPriceValueValue(sellPriceValue)"
            :decimal="true"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- 读卡弹窗 -->
    <hl-dialog-card-reading ref="cardReadingRef" @refreshDataList="getMemberInfo" />

    <weigh-components-car v-if="weighDialogStatus" @cancelWeighResult="weighDialogStatus = false" @confirmWeighResult="editQuantityValue" ref="weighRef" />

    <dialog-coupon-check ref="checkCouponDialogRef" v-if="checkCouponDialogStatus" @colseDialog="checkCouponDialogStatus = false" @setUseCoupon="getCouponCheck" />

  </div>
</template>

<script>
import keyboardJS from 'keyboardJS'

import LeftLayout from './LeftLayout.vue'
import RightLayout from './RightLayout.vue'

import DialogCouponCheck from 'pages/plugin/hlcoupon/check/DialogCheck.vue'
export default {
  name: 'cash',
  components: {
    LeftLayout,
    RightLayout,
    DialogCouponCheck
  },
  data () {
    return {
      quantityDialogStatus: false, // 修改数量弹窗状态
      quantityValue: '', // 数量文本框
      sellPriceDialogStatus: false, // 修改售价弹窗状态
      sellPriceValue: '', // 售价文本框
      currentMemberInfo: {}, // 会员信息
      pendingOrderStatus: false, // 挂单列表
      shoppingCartsList: [], // 购物车列表
      hangUpTotal: 0, // 挂单总条数
      pendingOrderInfo: {}, // 挂单记录
      shoppingCartsInfo: {}, // 选中的购物车数据
      weighDialogStatus: false,
      priceDiscountList: [],
      checkCouponDialogStatus: false,
      couponInfo: {},
      currentRoomId: 0
    }
  },
  computed: {},
  created () {
    if (this.$route.query.currentRoomId) {
      this.currentRoomId = parseInt(this.$route.query.currentRoomId)
    }
  },
  watch: {},
  mounted () {
    keyboardJS.bind('numadd', (e) => {
      if (this.shoppingCartsInfo && this.shoppingCartsInfo.id && this.shoppingCartsInfo.goods && parseInt(this.shoppingCartsInfo.goods.goo_is_weigh) != 1) {
        this.changeQuantityValue(1)
      }
    })
    keyboardJS.bind('numsubtract', (e) => {
      if (this.shoppingCartsInfo && this.shoppingCartsInfo.id && this.shoppingCartsInfo.goods && parseInt(this.shoppingCartsInfo.goods.goo_is_weigh) != 1) {
        this.changeQuantityValue(2)
      }
    })

    keyboardJS.bind('x', (e) => {
      if (this.shoppingCartsInfo && this.shoppingCartsInfo.id && this.shoppingCartsInfo.goods && parseInt(this.shoppingCartsInfo.goods.goo_is_weigh) != 1) {
        this.editQuantityValueDialog()
      }
    })
    keyboardJS.bind('g', (e) => {
      if (this.shoppingCartsInfo && this.shoppingCartsInfo.id && this.shoppingCartsInfo.goods && parseInt(this.shoppingCartsInfo.goods.goo_is_weigh) != 1) {
        this.editSellPriceDialog()
      }
    })
    keyboardJS.bind('q', (e) => {
      if (this.shoppingCartsList && this.shoppingCartsList.length > 0) {
        this.deleteAllData()
      }
    })
    keyboardJS.bind('h', (e) => {
      this.openPendingDialog()
    })
    keyboardJS.bind('m', (e) => {
      this.openReadingDialog()
    })
    keyboardJS.bind('space', (e) => {
      this.openCheckoutCounterPage()
    })
  },
  methods: {
    openCheckCouponBtn () {
      this.checkCouponDialogStatus = true
      this.$nextTick(() => {
        this.$refs.checkCouponDialogRef.init()
      })
    },
    getCouponCheck (couponInfo) {
      this.checkCouponDialogStatus = false

      if (couponInfo && couponInfo.member_id) {
        this.couponInfo = couponInfo
        this.$nextTick(() => {
          this.$refs.cardReadingRef.getMemberIdReturnData(couponInfo.member_id)
        })
      }

      this.$nextTick(() => {
        this.refreshShoppingCart()
      })
    },
    // 刷新购物车列表
    refreshShoppingCart () {
      this.$nextTick(() => {
        this.$refs.shoppingCarRef.getShoppingCartList()
      })
    },
    // 加 减 购物车选中商品数量
    changeQuantityValue (type, quantity) {
      if (parseInt(this.shoppingCartsInfo.goods.goo_is_weigh) != 1) {
        this.$nextTick(() => {
          this.$refs.shoppingCarRef.changeQuantityValue(type, quantity)
        })
      } else {
        this.$refs.shoppingCarRef.delCarData({ buff_id: this.shoppingCartsInfo.id })
      }
    },
    // 清空购物车
    deleteAllData () {
      this.$nextTick(() => {
        this.$refs.shoppingCarRef.deleteAllData()
      })
    },
    // 修改购物车选中商品数量
    editQuantityValue (type, quantity) {
      this.quantityDialogStatus = false
      this.quantityValue = ''
      this.$nextTick(() => {
        this.$refs.shoppingCarRef.changeQuantityValue(type, quantity)
      })
    },
    // 修改购物车选中商品售价
    editSellPriceValueValue (newPrice) {
      this.sellPriceDialogStatus = false
      this.sellPriceValue = ''
      this.$nextTick(() => {
        this.$refs.shoppingCarRef.changSellingValue(newPrice)
      })
    },
    // 结账
    openCheckoutCounterPage () {
      this.$nextTick(() => {
        this.$refs.shoppingCarRef.openCheckoutCounterPage()
      })
    },
    // 打开读卡界面
    openReadingDialog () {
      this.$nextTick(() => {
        this.$refs.cardReadingRef.openReaderDialog()
      })
    },
    // 获取读卡后数据
    getMemberInfo (memberInfo) {
      this.currentMemberInfo = memberInfo
      this.$nextTick(() => {
        this.$refs.shoppingCarRef.getShoppingCartList()
      })
    },

    // 获取当前购物车商品列表
    getShoppingCartsList (val) {
      this.shoppingCartsList = val
    },

    // 获取购物车选中数据
    getSelectedShoppingCarInfo (v) {
      this.shoppingCartsInfo = v
    },

    // 修改数量
    editQuantityValueDialog () {
      const that = this

      if (this.shoppingCartsInfo.goods && parseInt(this.shoppingCartsInfo.goods.goo_is_weigh) == 1) {
        this.weighDialogStatus = true
        this.$nextTick(() => {
          this.$refs.weighRef.init(this.shoppingCartsInfo, 1)
        })
      } else {
        this.quantityDialogStatus = true
        this.$nextTick(() => {
          setTimeout(() => {
            that.$refs.quantityValueRef.focus()
          }, 500)
        })
      }
    },
    // 修改价格
    editSellPriceDialog () {
      const that = this
      this.sellPriceDialogStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          that.$refs.sellPriceValueRef.focus()
        }, 500)
      })
    },
    // 结账成功
    paySuccessCallBack () {
      this.couponInfo = {}
      this.resetMemberInfo()

      this.$nextTick(() => {
        this.$refs.rightLayoutRef.getGoodsList()

        this.refreshShoppingCart()
      })
    },
    authorityMeta (key) {
      return true
    },

    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    changeDiscount (proportion) {
      this.sellPriceValue = this.formatAmount(this.shoppingCartsInfo.cgb_selling_price * proportion * 0.01)
    },
    cancelConsumeUseCoupon () {
      const couponInfo = this.couponInfo
      const obj = {
        record_id: couponInfo.id
      }
      this.$store
        .dispatch('hlCoupon/cancelConsumeUseCoupon', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.couponInfo = {}
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '撤销成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.refreshShoppingCart()
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
            return false
          }
        })
        .catch((error) => {})
    },

    placeGoodsShoppingOrder () {
      const obj = {
        currentRoomId: this.currentRoomId
      }
      this.$store
        .dispatch('roomConsume/placeGoodsShoppingOrder', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$router.push({ name: 'roomConsume', params: { rcId: this.currentRoomId } })
          }
        })
        .catch((error) => {})
    }
  }
}
</script>

<style lang="sass">
.grid-masonry
  flex-direction: column
  height: 700px

  &--2
    > div
      &:nth-child(2n + 1)
        order: 1
      &:nth-child(2n)
        order: 2

    &:before
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 1
  &--3
    > div
      &:nth-child(3n + 1)
        order: 1
      &:nth-child(3n + 2)
        order: 2
      &:nth-child(3n)
        order: 3

    &:before,
    &:after
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 2
</style>
