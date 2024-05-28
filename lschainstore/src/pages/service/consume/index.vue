<template>
  <div class="fit row no-wrap justify-between items-stretch content-stretch">
    <!-- left -->
    <div class="col-shrink col-xs-4 col-sm-5 col-md-5 col-lg-5 col-xl-5">
      <left-layout
        @shoppingCartsList="getShoppingCartsList"
        @selectedShoppingCarInfo="getSelectedShoppingCarInfo"
        @addInvoiceSucces="addInvoiceSuccesOperate"
        :member_id="currentMemberInfo && currentMemberInfo.id ? currentMemberInfo.id : 0"
        :currentMemberInfo="currentMemberInfo"
        ref="shoppingCarRef"
        :consumehangup_id="pendingOrderInfo && pendingOrderInfo.id ? pendingOrderInfo.id : 0"
      />
    </div>
    <!-- center -->
    <div class="col-shrink col-xs-2 col-sm-1 col-md-1 col-lg-1 col-xl-1">
      <div class="fit column no-wrap justify-between items-stretch content-stretch">
        <q-scroll-area class="fit full-height">
          <div class="col-shrink q-px-xs">
            <q-btn
              color="deep-orange"
              @click="changeQuantityValue(1)"
              :disable="
                shoppingCartsInfo && shoppingCartsInfo.id && shoppingCartsInfo.goods && parseInt(shoppingCartsInfo.goods.goo_is_weigh) != 1
                  ? false
                  : true
              "
              class="full-width q-my-xs"
              icon="las la-plus"
              v-if="authorityMeta('plus')"
            >
            </q-btn>
            <q-btn
              v-if="authorityMeta('reduce')"
              color="orange"
              @click="changeQuantityValue(2)"
              :disable="shoppingCartsInfo && shoppingCartsInfo.id && shoppingCartsInfo.goods ? false : true"
              class="full-width q-my-xs"
            >
              <i class="las la-minus"></i>
            </q-btn>
            <q-btn
              v-if="authorityMeta('number')"
              color="white"
              class="full-width q-my-xs q-py-sm"
              padding="none"
              :disable="shoppingCartsInfo && shoppingCartsInfo.id ? false : true"
              @click="editQuantityValueDialog"
            >
              <span class="q-my-xs text-black text-lowercase">数量(shift+x)</span>
            </q-btn>
            <q-btn
              color="white"
              class="full-width q-my-xs q-py-sm"
              padding="none"
              :disable="
                shoppingCartsInfo && shoppingCartsInfo.id && shoppingCartsInfo.goods && parseInt(shoppingCartsInfo.goods.goo_is_weigh) != 1
                  ? false
                  : true
              "
              @click="editSellPriceDialog"
              v-if="authorityMeta('change')"
            >
              <span class="q-my-xs text-black text-lowercase">改价(shift+g)</span>
            </q-btn>
            <q-btn
              color="white"
              class="full-width q-my-xs q-py-sm"
              padding="none"
              :disable="shoppingCartsList && shoppingCartsList.length > 0 ? false : true"
              @click="deleteAllData"
            >
              <span class="q-my-xs text-black text-lowercase">清空(shift+q)</span>
            </q-btn>
            <q-btn v-if="authorityMeta('hangup')" color="white" class="full-width q-my-xs q-py-sm" @click="openPendingDialog" padding="none">
              <span class=" q-my-xs text-black text-lowercase">
                挂单(shift+h)
                <q-badge v-if="hangUpTotal" color="red" rounded floating>{{ hangUpTotal }}</q-badge>
              </span>
            </q-btn>
            <q-btn
              color="white"
              class="full-width q-my-xs q-py-sm"
              v-if="authorityMeta('member') && !currentMemberInfo.id"
              @click="openReadingDialog"
              padding="none"
            >
              <span class="q-my-xs text-black text-lowercase">会员(shift+m)</span>
            </q-btn>
            <q-btn color="negative" class="full-width q-my-xs q-py-sm" v-else @click="resetMemberInfo" padding="none">
              <span class="q-my-xs">重置</span>
            </q-btn>
            <q-btn color="secondary" class="full-width q-my-xs q-py-sm" @click="showExchange">
              <span class="text-white text-subtitle2 q-my-xs text-lowercase">退换货</span>
            </q-btn>
            <q-btn color="info" class="full-width q-my-xs q-py-sm" @click="showRechange" :disable="!currentMemberInfo.id > 0 ? true : false">
              <span class="text-white text-subtitle2 q-my-xs text-lowercase">充值</span>
            </q-btn>
            <q-btn color="positive" class="full-width q-my-xs q-py-sm" @click="showPoint" :disable="!currentMemberInfo.id > 0 ? true : false">
              <span class="text-white text-subtitle2 q-my-xs text-lowercase">积分</span>
            </q-btn>
            <q-btn color="deep-orange-5 " class="full-width q-my-xs q-py-sm" @click="showCheck">
              <span class="text-white text-subtitle2 q-my-xs text-lowercase">卡券</span>
            </q-btn>
          </div>
        </q-scroll-area>
        <div class="col-shrink q-px-xs" v-if="authorityMeta('settlement')">
          <q-btn
            color="deep-orange"
            class="full-width q-py-sm q-mb-xs"
            no-caps
            @click="openCheckoutCounterPage()"
            :disable="shoppingCartsList && shoppingCartsList.length > 0 ? false : true"
          >
            <span class="text-h6 q-my-xs text-white">结账<br />(space)</span>
          </q-btn>
        </div>
      </div>
    </div>
    <!-- right -->
    <div class="col-shrink col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6">
      <right-layout
        :member_id="currentMemberInfo && currentMemberInfo.id ? currentMemberInfo.id : 0"
        :currentMemberInfo="currentMemberInfo"
        @refreshShoppingCart="refreshShoppingCart"
        :consumehangup_id="pendingOrderInfo && pendingOrderInfo.id ? pendingOrderInfo.id : 0"
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
            <template v-slot:prepend> 数量 </template>
          </q-input>
          <hl-keyboard
            :inputNumber="quantityValue"
            @changeNumber="
              (v) => {
                quantityValue = v;
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
          <q-input class="q-mb-md text-h6" v-model="sellPriceValue" ref="sellPriceValueRef" outlined square>
            <template v-slot:prepend> 售价 </template>
          </q-input>
          <hl-keyboard
            :inputNumber="sellPriceValue"
            @changeNumber="
              (v) => {
                sellPriceValue = v;
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

    <weigh-components-car
      v-if="weighDialogStatus"
      @cancelWeighResult="weighDialogStatus = false"
      @confirmWeighResult="editQuantityValue"
      ref="weighRef"
    />
    <exchange-goods ref="exchangeGoods" v-if="exchangeGoodsStatus"></exchange-goods>

    <recharge-money
      ref="rechargeRef"
      v-if="rechargeStatus"
      :memberId="currentMemberInfo && currentMemberInfo.id ? currentMemberInfo.id : 0"
      :currentMemberInfo="currentMemberInfo"
      @refreshMember="refreshMember"
    />

    <decount-print
      ref="decountPrintRef"
      v-if="decountStatus"
      :memberId="currentMemberInfo && currentMemberInfo.id ? currentMemberInfo.id : 0"
      :currentMemberInfo="currentMemberInfo"
      @refreshMember="refreshMember"
    />

    <check-view
      ref="checkRef"
      v-if="checkStatus"
      :memberId="currentMemberInfo && currentMemberInfo.id ? currentMemberInfo.id : 0"
      :currentMemberInfo="currentMemberInfo"
    />

    <!-- 挂单弹窗 -->
    <pending-order
      ref="pendingOrderRef"
      v-if="pendingOrderStatus"
      @hangUpSuccess="refreshShoppingCart"
      @hidePendingOrderDialog="getPendingDialogList"
      :member_id="currentMemberInfo && currentMemberInfo.id ? currentMemberInfo.id : 0"
      :currentMemberInfo="currentMemberInfo"
      @solutionsHanging="solutionsHanging"
    />
  </div>
</template>

<script>
import keyboardJS from 'keyboardJS'
import WeighComponentsCar from './components/WeighComponentsCar.vue'
import LeftLayout from './LeftLayout.vue'
import RightLayout from './RightLayout.vue'
import PendingOrder from './PendingOrder.vue'
import ExchangeGoods from 'src/pages/set/returngoods/ExchangeGoods.vue'
import RechargeMoney from './components/RechargeMoney.vue'
import DecountPrint from './components/DecountPrint.vue'
import CheckView from './components/CheckView.vue'

export default {
  name: 'cash',
  components: {
    LeftLayout,
    RightLayout,
    PendingOrder,
    WeighComponentsCar,
    ExchangeGoods,
    CheckView,
    RechargeMoney,
    DecountPrint
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
      exchangeGoodsStatus: false,
      rechargeStatus: false,
      checkStatus: false,
      decountStatus: false
    }
  },
  computed: {},
  created () {},
  watch: {},
  mounted () {
    this.getPendingDialogList()

    keyboardJS.bind('numadd', (e) => {
      if (
        this.shoppingCartsInfo &&
        this.shoppingCartsInfo.id &&
        this.shoppingCartsInfo.goods &&
        parseInt(this.shoppingCartsInfo.goods.goo_is_weigh) != 1
      ) {
        this.changeQuantityValue(1)
      }
    })
    keyboardJS.bind('numsubtract', (e) => {
      if (
        this.shoppingCartsInfo &&
        this.shoppingCartsInfo.id &&
        this.shoppingCartsInfo.goods &&
        parseInt(this.shoppingCartsInfo.goods.goo_is_weigh) != 1
      ) {
        this.changeQuantityValue(2)
      }
    })

    keyboardJS.bind('shift + x', (e) => {
      if (
        this.shoppingCartsInfo &&
        this.shoppingCartsInfo.id &&
        this.shoppingCartsInfo.goods &&
        parseInt(this.shoppingCartsInfo.goods.goo_is_weigh) != 1
      ) {
        this.editQuantityValueDialog()
      }
    })
    keyboardJS.bind('shift + g', (e) => {
      if (
        this.shoppingCartsInfo &&
        this.shoppingCartsInfo.id &&
        this.shoppingCartsInfo.goods &&
        parseInt(this.shoppingCartsInfo.goods.goo_is_weigh) != 1
      ) {
        this.editSellPriceDialog()
      }
    })
    keyboardJS.bind('shift + q', (e) => {
      if (this.shoppingCartsList && this.shoppingCartsList.length > 0) {
        this.deleteAllData()
      }
    })
    keyboardJS.bind('shift + h', (e) => {
      this.openPendingDialog()
    })
    keyboardJS.bind('shift + m', (e) => {
      this.openReadingDialog()
    })
    keyboardJS.bind('space', (e) => {
      this.openCheckoutCounterPage()
    })
  },
  methods: {
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
    showExchange () {
      this.exchangeGoodsStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.exchangeGoods.getViewData()
        }, 200)
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
      this.getPendingDialogList()
    },
    // 打开挂单
    openPendingDialog () {
      this.pendingOrderStatus = true
      this.$nextTick(() => {
        const pendingOrderId = this.pendingOrderInfo && this.pendingOrderInfo.id ? this.pendingOrderInfo.id : 0
        this.$refs.pendingOrderRef.openPendingOrderList(this.shoppingCartsList, pendingOrderId)
      })
    },
    // 重置会员卡
    resetMemberInfo () {
      this.$nextTick(() => {
        this.currentMemberInfo = {}
        this.$nextTick(() => {
          this.$refs.shoppingCarRef.getShoppingCartList()
        })
        this.getPendingDialogList()
      })
    },
    // 获取挂单条数
    getPendingDialogList () {
      const obj = {
        member_id: this.currentMemberInfo && this.currentMemberInfo.id ? this.currentMemberInfo.id : 0
      }
      this.$store
        .dispatch('consume/getHangUpList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.hangUpTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },

    // 获取当前购物车商品列表
    getShoppingCartsList (val) {
      this.shoppingCartsList = val
    },
    // 挂单数据去结账
    solutionsHanging (v) {
      this.pendingOrderInfo = v

      this.refreshShoppingCart()

      this.$nextTick(() => {
        if (this.pendingOrderInfo.member_id) {
          this.$refs.cardReadingRef.getMemberIdReturnData(this.pendingOrderInfo.member_id)
        }
      })
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
    addInvoiceSuccesOperate () {
      this.resetMemberInfo()
      this.$nextTick(() => {
        this.refreshShoppingCart()
      })
    },
    showRechange () {
      this.rechargeStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.rechargeRef.getViewData()
        }, 200)
      })
    },
    showPoint () {
      this.decountStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.decountPrintRef.getViewData()
        }, 200)
      })
    },
    showCheck () {
      this.checkStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.checkRef.getViewData()
        }, 200)
      })
    },
    // 给定指定ID 获取会员信息
    refreshMember (memberId) {
      if (memberId > 0) {
        const obj = {
          id: memberId,
          scenes: this.scenes
        }
        this.$store
          .dispatch('components/cardReader', obj)
          .then((res) => {
            if (res.code == 200) {
              this.currentMemberInfo = res.data
              this.$nextTick(() => {
                this.$refs.shoppingCarRef.getShoppingCartList()
              })
              this.getPendingDialogList()
            }
          })
          .catch((error) => {
            // console.log("12131", error);
          })
      }
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
