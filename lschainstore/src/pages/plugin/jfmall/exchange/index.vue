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
        :levelId="levelId"
      />
    </div>
    <!-- center -->
    <div class="col-shrink col-xs-2 col-sm-1 col-md-1 col-lg-1 col-xl-1">
      <div class="fit column no-wrap justify-between items-stretch content-stretch">
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
          >
            <span class="text-h4">+</span>
          </q-btn>
          <q-btn
            color="orange"
            @click="changeQuantityValue(2)"
            :disable="shoppingCartsInfo && shoppingCartsInfo.id && shoppingCartsInfo.goods ? false : true"
            class="full-width q-my-xs"
          >
            <span class="text-h4">-</span>
          </q-btn>
          <q-btn
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
            :disable="shoppingCartsList && shoppingCartsList.length > 0 ? false : true"
            @click="deleteAllData"
          >
            <span class="text-subtitle1 q-my-xs text-black">清空(q)</span>
          </q-btn>

          <q-btn color="white" class="full-width q-my-xs q-py-sm" v-if="!currentMemberInfo.id" @click="openReadingDialog" padding="none">
            <span class="text-subtitle1 q-my-xs text-black">会员(m)</span>
          </q-btn>
          <q-btn color="negative" class="full-width q-my-xs q-py-sm" v-else @click="resetMemberInfo" padding="none">
            <span class="text-subtitle1 q-my-xs">重置</span>
          </q-btn>
        </div>
        <div class="col-shrink q-px-xs">
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
    <div class="col-shrink col-xs-7 col-sm-7 col-md-7 col-lg-7 col-xl-7">
      <right-layout
        :member_id="currentMemberInfo && currentMemberInfo.id ? currentMemberInfo.id : 0"
        :levelId="levelId"
        :currentMemberInfo="currentMemberInfo"
        @refreshShoppingCart="refreshShoppingCart"
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
                quantityValue = v
              }
            "
            @confirmEvent="editQuantityValue(3, quantityValue)"
            :decimal="true"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <!-- 读卡弹窗 -->
    <hl-dialog-card-reading ref="cardReadingRef" @refreshDataList="getMemberInfo" />
  </div>
</template>

<script>
import keyboardJS from 'keyboardJS'
import LeftLayout from './LeftLayout.vue'
import RightLayout from './RightLayout.vue'
export default {
  name: 'cash',
  components: {
    LeftLayout,
    RightLayout
  },
  data () {
    return {
      levelId: '',
      quantityDialogStatus: false, // 修改数量弹窗状态
      quantityValue: '', // 数量文本框
      sellPriceDialogStatus: false, // 修改售价弹窗状态
      sellPriceValue: '', // 售价文本框
      currentMemberInfo: {}, // 会员信息
      shoppingCartsList: [], // 购物车列表
      shoppingCartsInfo: {}, // 选中的购物车数据
      debtStatus: 0
    }
  },
  computed: {},
  created () {},
  watch: {},
  mounted () {
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

    keyboardJS.bind('x', (e) => {
      if (
        this.shoppingCartsInfo &&
        this.shoppingCartsInfo.id &&
        this.shoppingCartsInfo.goods &&
        parseInt(this.shoppingCartsInfo.goods.goo_is_weigh) != 1
      ) {
        this.editQuantityValueDialog()
      }
    })
    keyboardJS.bind('g', (e) => {
      if (
        this.shoppingCartsInfo &&
        this.shoppingCartsInfo.id &&
        this.shoppingCartsInfo.goods &&
        parseInt(this.shoppingCartsInfo.goods.goo_is_weigh) != 1
      ) {
        this.editSellPriceDialog()
      }
    })
    keyboardJS.bind('q', (e) => {
      if (this.shoppingCartsList && this.shoppingCartsList.length > 0) {
        this.deleteAllData()
      }
    })
    keyboardJS.bind('m', (e) => {
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
        this.$refs.shoppingCarRef.delCarData({ buff_id: this.shoppingCartsInfo.id, mId: this.currentMemberInfo.id })
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
      this.debtStatus = memberInfo.fieldMyouka ? memberInfo.fieldMyouka.mfm_debt_status : 0
      this.levelId = memberInfo.memberLevel.id
      this.$nextTick(() => {
        this.$refs.shoppingCarRef.getShoppingCartList()
      })
    },
    // 重置会员卡
    resetMemberInfo () {
      this.$nextTick(() => {
        this.currentMemberInfo = {}
        this.$refs.shoppingCarRef.deleteAllShoppingCart()
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
      this.quantityDialogStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          that.$refs.quantityValueRef.focus()
        }, 500)
      })
    },
    // 结账成功
    paySuccessCallBack () {
      this.resetMemberInfo()

      this.$nextTick(() => {
        this.refreshShoppingCart()
      })
    },
    // 欠账结算
    checkoutDebt () {
      const buffer_data = _.map(this.shoppingCartsList, 'id')
      const return_param = {
        sc_consumeType: 'consume',
        goodsData: buffer_data,
        consumehangup_id: this.consumehangup_id,
        sc_handleMoneyCount: 10,
        currentMemberId: this.memberId,
        sc_realMoneyCount: 10
      }
      this.$store
        .dispatch('components/buffer', return_param)
        .then((res) => {
          if (res.code == 200 && res.data && res.data.id) {
            this.setDebtData(parseInt(res.data.id))
          } else {
            this.$q.notify({
              message: '失败',
              caption: '结账失败',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 1500,
              position: 'top-right'
            })
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
