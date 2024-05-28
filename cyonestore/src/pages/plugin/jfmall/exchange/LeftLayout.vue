<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-pb-md">
      <q-input
        outlined
        @keyup.enter="scanCodeButton"
        v-model="goodsBarCode"
        label="请输入商品条码"
        hint="按快捷键(s)激活"
        class="q-mt-xs"
        dense
        ref="goodsBarCodeInput"
      >
        <template v-slot:after>
          <q-btn padding="xs" icon="add_box" color="primary" @click="scanCodeButton" />
        </template>
      </q-input>
      <q-separator />
    </div>
    <div class="col-shrink full-height bg-white full-width">
      <q-scroll-area class="fit" content-style="position:inherit" v-if="shoppingCartsList.length > 0">
        <q-list separator>
          <q-item
            clickable
            v-ripple
            :key="key"
            v-for="(item, key) in shoppingCartsList"
            @click="selectShoppingCarInfo(item)"
            :active="item.id == selectedShoppingCarInfo.id"
            active-class="bg-teal-1 text-grey-8"
          >
            <q-item-section no-wrap>
              <q-item-label class="text-body1 text-dark full-width" lines="2" v-if="item.goods">
                <div> {{ item.goods.jg_name }} </div>
                <div class="text-orange" v-if="item.goodsSpecification && item.goodsSpecification.id">
                  /{{ item.goodsSpecification.sl_title }}
                </div>
              </q-item-label>
              <q-item-label>
                <span class="text-caption" v-if="item.jc_unit_price > 0">
                  {{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                  <span class="text-h6 text-deep-orange"> {{ formatAmount(item.jc_number * item.jc_unit_price) }} </span>
                </span>
                <span class="text-caption" v-if="item.jc_unit_point > 0">
                  <span class="q-px-sm" v-if="item.jc_unit_price > 0">+</span>

                  <span class="text-h6 text-deep-orange">{{ formatAmount(item.jc_number * item.jc_unit_point) }}</span>

                  {{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_integralUnit }}
                </span>
                <span class="text-caption" v-if="item.jc_unit_balance > 0">
                  <span class="q-px-sm" v-if="item.jc_unit_price > 0 || item.jc_unit_point > 0">+</span>

                  <span class="text-h6 text-deep-orange">{{ formatAmount(item.jc_number * item.jc_unit_balance) }}</span>

                  {{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_balanceUnit }}
                </span>
              </q-item-label>
            </q-item-section>

            <q-item-section side>
              <q-item-label>
                <span class="cursor-pointer text-dark text-caption"
                  >× <span class="text-h6 text-deep-orange">{{ item.jc_number }}</span>
                </span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <div class="flex flex-center text-blue-grey justify-end fit" v-else>
        <div>
          <div class="text-center">
            <q-icon size="83px" name="las la-barcode"></q-icon>
          </div>
          <div>请选择右侧商品</div>
        </div>
      </div>
    </div>
    <div class="col-shrink q-pb-md">
      <q-separator color="primary" />
      <q-card class="no-border-radius bg-white">
        <q-list>
          <q-item clickable v-ripple v-if="member_id > 0">
            <q-item-section>
              <q-item-label>{{ currentMemberInfo.mem_memberName }}</q-item-label>
              <q-item-label caption lines="1">
                卡号:{{ currentMemberInfo.mem_memberCardNum }}

                <span class="q-mx-sm"
                  >{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_integralUnit }}:{{
                    formatAmount(currentMemberInfo.mem_memberPointsCount)
                  }}</span
                >
                <span class="q-mx-sm"
                  >{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_balanceUnit }}:{{
                    formatAmount(currentMemberInfo.mem_memberMoneyCount)
                  }}</span
                >
              </q-item-label>
            </q-item-section>
            <q-item-section side top>手机号:{{ currentMemberInfo.mem_memberMobile }}</q-item-section>
          </q-item>
          <q-item clickable v-ripple v-else>
            <q-item-section>
              <q-item-label>散客</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator inset />
          <q-item clickable v-ripple>
            <q-item-section class="text-subtitle1 text-weight-bold">
              <span>
                总计:
                <span class="text-h6 text-negative"
                  >{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneySymbol }} {{ totalAmount }}</span
                >
              </span>
            </q-item-section>
            <q-item-section class="text-subtitle1 text-weight-bold">
              <span>
                总计{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_integralUnit }}:
                <span class="text-h6 text-positive"> {{ totalUsePoint }} </span>
              </span>
            </q-item-section>
            <q-item-section class="text-subtitle1 text-weight-bold">
              <span>
                总计{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_balanceUnit }}:
                <span class="text-h6 text-primary"> {{ totalUseStored }}</span>
              </span>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>

    <hl-checkout-plugin
      @paySuccessCallBack="paySuccessCallBack"
      @closeCheckoutPopup="checkoutPageReceive = false"
      ref="openCheckoutCounterPage"
      v-if="checkoutPageReceive"
    ></hl-checkout-plugin>
  </div>
</template>

<script>
import keyboardJS from 'keyboardJS'
export default {
  name: 'LeftLayout',
  props: ['member_id', 'currentMemberInfo', 'levelId'],
  data () {
    return {
      goodsBarCode: '',
      shoppingCartsList: [],
      selectedShoppingCarInfo: {},
      checkoutPageReceive: false,
      totalAmount: 0,
      totalUsePoint: 0,
      totalUseStored: 0,
      joTotalNumber: 0
    }
  },
  computed: {
    // totalAmount () {
    //   const that = this
    //   let amount = 0
    //   this.shoppingCartsList.forEach(function (item) {
    //     amount += that.formatAmount(item.chud_totalPrice)
    //   })

    //   return this.formatAmount(amount)
    // },
    totalNumber () {
      let number = 0
      const that = this
      this.shoppingCartsList.forEach(function (item) {
        number += that.formatAmount(item.jc_number)
      })
      return that.formatAmount(number)
    }
  },
  created () {
    // this.getShoppingCartList()
    // this.focusCodeInput()
  },
  mounted () {
    keyboardJS.bind('s', (e) => {
      this.focusCodeInput()
    })
  },
  watch: {},
  methods: {
    // 文本框聚焦
    focusCodeInput () {
      const that = this
      this.$nextTick(() => {
        setTimeout(() => {
          that.$refs.goodsBarCodeInput.focus()
        }, 500)
      })
    },

    // 获取购物车数据
    getShoppingCartList () {
      const obj = {
        member_id: parseInt(this.member_id)
      }
      this.$store
        .dispatch('jfExchange/getShoppingCartList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.shoppingCartsList = res.data ? res.data : []

            const currentCarDefaultInfo = res.data && res.data.length > 0 ? res.data[res.data.length - 1] : {}
            this.calculation()
            this.selectShoppingCarInfo(currentCarDefaultInfo)
            this.$emit('shoppingCartsList', this.shoppingCartsList)
          }
        })
        .catch((error) => {})
    },

    // 修改数量
    changeQuantityValue (type, quantity) {
      if (this.selectedShoppingCarInfo && this.selectedShoppingCarInfo.id > 0) {
        if (type == 1) {
          this.selectedShoppingCarInfo.jc_number++
        } else if (type == 2) {
          this.selectedShoppingCarInfo.jc_number--
        } else if (type == 3) {
          this.selectedShoppingCarInfo.jc_number = quantity
        }

        if (this.selectedShoppingCarInfo.jc_number <= 0) {
          this.delCarData({ cart_id: this.selectedShoppingCarInfo.id })
          return false
        }
        if (this.selectedShoppingCarInfo.jc_number) {
          if (this.formatAmount(this.selectedShoppingCarInfo.jc_number)) {
            this.addingGoodsBut({
              member_id: parseInt(this.member_id),
              goods_id: this.selectedShoppingCarInfo.goods_id,
              spe_id: this.selectedShoppingCarInfo.spe_id,
              jc_number: this.selectedShoppingCarInfo.jc_number
            })
          } else {
            this.getShoppingCartList()
          }
        }
      }
    },

    scanCodeButton () {
      if (this.goodsBarCode) {
        this.addingGoodsBut({
          member_id: parseInt(this.member_id),
          goodsBarCode: this.goodsBarCode,
          jc_source: 'exchange',
          jc_number: 1,
          levelId: this.levelId
        })
      }
    },

    // 添加商品
    addingGoodsBut (val) {
      if (this.member_id <= 0) {
        this.$q.notify({
          color: 'red',
          message: '操作失败',
          caption: '请先读卡',
          icon: 'ion-close-circle-outline',
          position: 'top-right'
        })
        return false
      }
      this.$store
        .dispatch('jfExchange/setData', val)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '操作成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            if (this.goodsBarCode) {
              this.goodsBarCode = ''
            }

            this.getShoppingCartList()
          } else {
            this.$q.notify({
              message: '操作失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            if (this.goodsBarCode) {
              this.goodsBarCode = ''
            }
            this.getShoppingCartList()
          }
        })
        .catch((error) => {})
    },

    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    // 删除与清空购物车单条数据
    deleteAllData () {
      const obj = {
        member_id: parseInt(this.member_id)
      }
      this.delCarData(obj)
    },
    deleteAllShoppingCart () {
      this.shoppingCartsList = []
      this.calculation()
    },

    // 删除购物车内商品
    delCarData (obj) {
      this.$store.dispatch('jfExchange/delData', obj).then((res) => {
        if (res.code == 200) {
          this.$q.notify({
            message: '成功',
            caption: '成功删除' + res.data + '条数据',
            icon: 'ion-checkmark-circle-outline',
            color: 'green',
            position: 'top-right',
            timeout: 500
          })
          this.getShoppingCartList()
        } else {
          this.$q.notify({
            message: '失败',
            caption: res.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        }
      })
    },

    // 调用结账函数
    openCheckoutCounterPage () {
      if (this.totalUsePoint > this.currentMemberInfo.mem_memberPointsCount) {
        this.$q.notify({
          color: 'red',
          message: '操作失败',
          caption: `您的${this.$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_integralUnit}不足，请重新选择兑换商品，或充值`,
          icon: 'ion-close-circle-outline',
          position: 'top'
        })
        return false
      } else if (this.totalUseStored > this.currentMemberInfo.mem_memberMoneyCount) {
        this.$q.notify({
          color: 'red',
          message: '操作失败',
          caption: `您的${this.$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_balanceUnit}不足，请重新选择兑换商品，或充值`,
          icon: 'ion-close-circle-outline',
          position: 'top'
        })
        return false
      } else {
        if (this.formatAmount(this.totalAmount) > 0) {
          const amountsPayable = this.totalAmount
          this.checkoutPageReceive = true
          const buyGoodsData = _.map(this.shoppingCartsList, 'id')
          const return_param = {
            buyGoodsData,
            amountsPayable: this.totalAmount,
            member_id: this.member_id,
            jo_point: this.totalUsePoint,
            jo_saving_money: this.totalUseStored,
            jo_total: this.joTotalNumber
          }

          this.$nextTick(() => {
            this.$refs.openCheckoutCounterPage.checkoutPageReceive('jfmall', amountsPayable, parseInt(this.member_id), return_param)
          })
        } else {
          this.$q.dialog({
            title: '兑换',
            message: '确定兑换当前' + this.joTotalNumber + '件商品吗?',
            cancel: true,
            persistent: true
          }).onOk(() => {
            this.exchangeSuccessCallBack()
          }).onCancel(() => {
            // console.log('>>>> Cancel')
          }).onDismiss(() => {
            // console.log('I am triggered on both OK and Cancel')
          })
        }
      }
    },

    exchangeSuccessCallBack () {
      const buyGoodsData = _.map(this.shoppingCartsList, 'id')
      const obj = {
        buyGoodsData,
        member_id: this.member_id,
        jo_point: this.totalUsePoint,
        jo_saving_money: this.totalUseStored,
        jo_total: this.joTotalNumber
      }
      this.$store
        .dispatch('jfExchange/exchangeGoods', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              message: '操作成功',
              caption: '收银成功',
              icon: 'ion-checkmark-circle-outline',
              position: 'top-right',
              timeout: 500
            })
            this.$emit('paySuccessCallBack')
          } else {
            this.$q.notify({
              color: 'red',
              message: '失败',
              caption: res.message ? res.message : '操作失败',
              icon: 'ion-close-circle-outline',
              position: 'top-right',
              timeout: 500
            })
            this.disabled = false
          }
        })
        .catch((error) => {})
    },

    // 处理结账成功执行
    paySuccessCallBack (v) {
      this.cashRegisterData = v
      this.checkoutPageReceive = false
      this.$store
        .dispatch('jfExchange/addinvoice', v)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              message: '操作成功',
              caption: '收银成功',
              icon: 'ion-checkmark-circle-outline',
              position: 'top-right',
              timeout: 500
            })
            this.$emit('paySuccessCallBack')
          } else {
            this.$q.notify({
              color: 'red',
              message: '失败',
              caption: res.message ? res.message : '操作失败',
              icon: 'ion-close-circle-outline',
              position: 'top-right',
              timeout: 500
            })
            this.disabled = false
          }
        })
        .catch((error) => {})
    },

    //  选中购物车内数据
    selectShoppingCarInfo (item) {
      this.selectedShoppingCarInfo = item
      this.$emit('selectedShoppingCarInfo', item)
    },
    calculation () {
      if (this.shoppingCartsList) {
        let amount = 0
        let usePoint = 0
        let useStored = 0
        let joTotal = 0
        const that = this
        this.shoppingCartsList.forEach(function (item) {
          amount += that.formatAmount(item.jc_unit_price * item.jc_number)
          usePoint += that.formatAmount(item.jc_unit_point * item.jc_number)
          useStored += that.formatAmount(item.jc_unit_balance * item.jc_number)
          joTotal += that.formatAmount(item.jc_number)
        })
        this.totalAmount = this.formatAmount(amount)
        this.totalUsePoint = this.formatAmount(usePoint)
        this.totalUseStored = this.formatAmount(useStored)
        this.joTotalNumber = this.formatAmount(joTotal)
      }
    }
  }
}
</script>
