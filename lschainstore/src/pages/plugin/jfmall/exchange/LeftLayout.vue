<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white full-height">
      <q-input outlined @keyup.enter="scanCodeButton" v-model="goodsBarCode" label="请输入商品条码" hint="按快捷键(s)激活" class="q-mt-xs" dense ref="goodsBarCodeInput">
        <template v-slot:after>
          <q-btn padding="xs" icon="add_box" color="primary" @click="scanCodeButton" />
        </template>
      </q-input>
      <q-separator />
      <q-scroll-area class="fit" v-if="shoppingCartsList.length > 0">
        <q-list bordered separator class="q-mx-xs">
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
              <!-- <q-item-label lines="1" class="row">
                <span class="text-orange" v-if="item.chud_goodsOrService == 3">[套]</span>{{ item.chud_specificationName }}
              </q-item-label> -->
              <q-item-label  class="text-body1 text-dark" lines="1" v-if="item.goods">{{ item.goods.jg_name }}
                <span v-if="item.goodsSpecification && item.goodsSpecification.id">
                  /{{ item.goodsSpecification.sl_title }}
                </span>

              </q-item-label>
              <q-item-label caption class="text-body2 text-dark">
                <div v-if="item.jc_unit_price > 0" class="text-negative">会员价:{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }} {{ item.jc_unit_price }}</div>
                <div v-if="item.jc_unit_point > 0" class="text-positive">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}支付:{{ item.jc_unit_point }} </div>
                <div v-if="item.jc_unit_saving > 0" class="text-primary">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}支付:{{ item.jc_unit_saving }}</div>
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label>
                <span class="cursor-pointer text-dark text-subtitle1">{{ item.jc_number }} <span v-if="item.goods && item.mainGoods.goodsUnit && item.mainGoods.goodsUnit.gu_name">{{ item.mainGoods.goodsUnit.gu_name }}</span></span>
              </q-item-label>
              <q-item-label>
               小计:
                <span class="text-subtitle1 text-negative" v-if="item.jc_unit_price > 0">
                  {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }} {{ formatAmount(item.jc_number * item.jc_unit_price) }}
                </span>
                <span class="text-subtitle1 text-positive" v-if="item.jc_unit_point > 0">
                 <span v-if="item.jc_unit_price > 0">+</span> {{ formatAmount(item.jc_number * item.jc_unit_point) }} {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}
                </span>
                <span class="text-subtitle1 text-primary" v-if="item.jc_unit_saving > 0">
                 <span v-if="item.jc_unit_price > 0 || item.jc_unit_point > 0">+</span> {{ formatAmount(item.jc_number * item.jc_unit_saving) }} {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}
                </span>
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <div class="flex flex-center text-blue-grey justify-end fit ">
        <div>
          <div class="text-center">
            <q-icon size="83px" name="las la-barcode"></q-icon>
          </div>
          <div>
            请选择右侧商品
          </div>
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

              <span class="q-mx-sm">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}:{{ formatAmount(currentMemberInfo.mem_memberPointsCount) }}</span>
              <span class="q-mx-sm">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}:{{ formatAmount(currentMemberInfo.mem_memberMoneyCount) }}</span>
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
                <span class="text-h6 text-negative">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }} {{ totalAmount }}</span>
              </span>
            </q-item-section>
            <q-item-section class="text-subtitle1 text-weight-bold">
              <span>
                总计{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}: <span class="text-h6 text-positive"> {{ totalUsePoint }}
                  </span>
                  </span>
            </q-item-section>
            <q-item-section class="text-subtitle1 text-weight-bold">
              <span>
                总计{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}: <span class="text-h6 text-primary"> {{ totalUseStored }}</span>
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
      totalUseStored: 0
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
          this.delCarData({ buff_id: this.selectedShoppingCarInfo.id })
        }
        if (this.selectedShoppingCarInfo.jc_number) {
          if (this.formatAmount(this.selectedShoppingCarInfo.jc_number)) {
            this.addingGoodsBut(
              {
                id: this.selectedShoppingCarInfo.id,
                member_id: parseInt(this.member_id),
                main_goods_id: this.selectedShoppingCarInfo.main_goods_id,
                goods_id: this.selectedShoppingCarInfo.goods_id,
                spe_id: this.selectedShoppingCarInfo.spe_id,
                jc_type: 2,
                jc_number: this.selectedShoppingCarInfo.jc_number,
                levelId: this.levelId
              }
            )
          } else {
            this.getShoppingCartList()
          }
        }
      }
    },

    scanCodeButton () {
      if (this.goodsBarCode) {
        this.addingGoodsBut(
          {
            member_id: parseInt(this.member_id),
            goodsBarCode: this.goodsBarCode,
            jc_type: 2,
            jc_number: this.selectedShoppingCarInfo.jc_number,
            levelId: this.levelId
          }
        )
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
            this.specificationPopup = false
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
        mId: parseInt(this.member_id)
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
            caption: '成功删除' + res.message + '条数据',
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
      if (this.totalUsePoint > this.currentMemberInfo.mem_memberPointsCount || this.totalUseStored > this.currentMemberInfo.mem_memberMoneyCount) {
        this.$q.notify({
          color: 'red',
          message: '操作失败',
          caption: `您的${this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit}或${this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit}不足请重新选择兑换商品，或充值`,
          icon: 'ion-close-circle-outline',
          position: 'top-right'
        })
      } else {
        const amountsPayable = this.totalAmount
        this.checkoutPageReceive = true
        // const buffer_data = _.map(this.shoppingCartsList, 'id')
        const return_param = {
          // goodsData: buffer_data,
          goodsData: this.shoppingCartsList,
          amountsPayable: this.totalAmount,
          memeber_id: this.member_id,
          usePointsExchangePoint: this.totalUsePoint,
          usePointsExchangeMoney: this.totalUseStored
        }

        this.$nextTick(() => {
          this.$refs.openCheckoutCounterPage.checkoutPageReceive('jfmall', amountsPayable, parseInt(this.member_id), return_param)
        })
      }
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
        const that = this
        this.shoppingCartsList.forEach(function (item) {
          amount += that.formatAmount(item.jc_unit_price * item.jc_number)
          usePoint += that.formatAmount(item.jc_unit_point * item.jc_number)
          useStored += that.formatAmount(item.jc_unit_saving * item.jc_number)
        })
        this.totalAmount = this.formatAmount(amount)
        this.totalUsePoint = this.formatAmount(usePoint)
        this.totalUseStored = this.formatAmount(useStored)
      }
    }
  }
}
</script>
