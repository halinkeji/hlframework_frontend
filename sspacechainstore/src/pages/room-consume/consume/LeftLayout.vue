<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <div>
         <q-btn flat  dense icon="chevron_left" :to="{ name: 'roomConsume', params: { rcId: this.currentRoomId } }" label="返回" />
      </div>
      <q-separator />
      <q-input
        outlined
        @keyup.enter="addingGoodsBut(null, 3, null)"
        v-model="goodsBarCode"
        label="请输入商品条码"
        hint="按快捷键(s)激活"
        class="q-mt-xs"
        dense
        ref="goodsBarCodeInput"
      >
        <template v-slot:after>
          <q-btn padding="xs" icon="add_box" color="primary" @click="addingGoodsBut(null, 3, null)" />
        </template>
      </q-input>
    </div>
    <div class="col-shrink bg-white full-height">
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
            :class="parseInt(item.cgb_coupon_exchange_id) > 0 ? 'bg-lime' : ''"
          >
            <q-badge color="red" v-if="parseInt(item.cgb_coupon_exchange_id) > 0" floating>卡券</q-badge>
            <q-item-section no-wrap>
              <q-item-label lines="1" class="row"> <span class="text-orange" v-if="item.cgb_goodsOrService == 3">[套]</span> </q-item-label>
              <q-item-label caption class="text-body2 text-dark" lines="2">{{ item.cgb_goo_name }}</q-item-label>
              <q-item-label caption class="text-body2 text-dark"
                >现价:{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                {{ item.cgb_selling_price }}<span v-if="item.cgb_specificationName">/{{ item.cgb_specificationName }}</span></q-item-label
              >
            </q-item-section>
            <q-item-section side>
              <q-item-label>
                <span class="cursor-pointer text-dark text-subtitle1"
                  >{{ item.cgb_consumeNumber }}
                  <span v-if="item.goods && item.goods.goodsUnit && item.goods.goodsUnit.id">/{{ item.goods.goodsUnit.gu_name }}</span></span
                >
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-item-label caption class="text-italic text-body2"
                >原售价:{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                {{ item.cgb_goo_price }}</q-item-label
              >
              <q-item-label class="text-body2" v-if="item.serveFee">{{ item.serveTitle }}： {{ item.serveFee }}</q-item-label>
              <q-item-label class="text-h5 text-negative"
                >{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                {{ item.cgb_totalPrice }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </q-scroll-area>
      <div class="flex flex-center text-blue-grey justify-end fit">
        <div>
          <div class="text-center">
            <q-icon size="83px" name="las la-barcode"></q-icon>
          </div>
          <div>请扫码商品条码或选择右侧商品</div>
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
              <q-item-label caption lines="1">卡号：{{ currentMemberInfo.mem_memberCardNum }}</q-item-label>
            </q-item-section>
            <q-item-section side top>手机号：{{ currentMemberInfo.mem_memberMobile }}</q-item-section>
          </q-item>
          <q-item clickable v-ripple v-else>
            <q-item-section>
              <q-item-label>散客</q-item-label>
            </q-item-section>
          </q-item>
          <q-separator inset />
          <q-item clickable v-ripple>
            <q-item-section class="text-subtitle1 text-weight-bold"> 共 {{ totalNumber }} 件 </q-item-section>
            <q-item-section class="text-subtitle1 text-weight-bold text-negative" v-if="totalServeFeeAmount">
              税金
              {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }} {{ totalServeFeeAmount }}
            </q-item-section>

            <q-item-section
              class="text-subtitle1 text-weight-bold text-negative row"
              v-if="couponInfo && couponInfo.coupon && couponInfo.coupon.cou_title"
            >
              <q-item-label>
                <span class="text-dark"> 卡券：</span>
                {{ couponInfo && couponInfo.coupon && couponInfo.coupon.cou_title ? couponInfo.coupon.cou_title : '' }}
              </q-item-label>
            </q-item-section>

            <q-item-section side top>
              <q-item-label class="text-h4 text-negative text-weight-bolder">
                {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }} {{ totalAmount }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card>
    </div>
    <hl-local-printer ref="localPrinterRef" />
    <hl-checkout
      @paySuccessCallBack="paySuccessCallBack"
      @closeCheckoutPopup="checkoutPageReceive = false"
      ref="openCheckoutCounterPageRef"
      v-if="checkoutPageReceive"
    ></hl-checkout>
  </div>
</template>

<script>
import keyboardJS from 'keyboardJS'
export default {
  name: 'LeftLayout',
  props: ['member_id', 'consumehangup_id', 'currentMemberInfo', 'couponInfo', 'currentRoomId'],
  data () {
    return {
      goodsBarCode: '',
      shoppingCartsList: [],
      selectedShoppingCarInfo: {},
      checkoutPageReceive: false
    }
  },
  computed: {
    totalAmount () {
      const that = this
      let amount = 0
      this.shoppingCartsList.forEach(function (item) {
        amount += that.formatAmount(item.cgb_totalPrice)
      })

      return this.formatAmount(amount)
    },
    totalNumber () {
      let number = 0
      const that = this
      this.shoppingCartsList.forEach(function (item) {
        number += that.formatAmount(item.cgb_consumeNumber)
      })
      return that.formatAmount(number)
    },
    totalServeFeeAmount () {
      const that = this
      let amount = 0
      this.shoppingCartsList.forEach(function (item) {
        amount += that.formatAmount(item.serveFee)
      })

      return this.formatAmount(amount)
    }
  },
  created () {
    this.getShoppingCartList()
    this.focusCodeInput()
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
        consumehangup_id: this.consumehangup_id,
        cgb_room_id: this.currentRoomId,
        member_id: parseInt(this.member_id)
      }
      this.$store
        .dispatch('roomConsume/getShoppingCartList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.shoppingCartsList = res.data ? res.data : []

            const currentCarDefaultInfo = res.data && res.data.length > 0 ? res.data[res.data.length - 1] : {}
            if (!this.selectedShoppingCarInfo && !this.selectedShoppingCarInfo.id) {
              this.selectShoppingCarInfo(currentCarDefaultInfo)
            }

            this.$emit('shoppingCartsList', this.shoppingCartsList)
          }
        })
        .catch((error) => {})
    },

    // 修改数量
    changeQuantityValue (type, quantity) {
      if (this.selectedShoppingCarInfo && this.selectedShoppingCarInfo.id > 0) {
        if (type == 1) {
          this.selectedShoppingCarInfo.cgb_consumeNumber++
        } else if (type == 2) {
          this.selectedShoppingCarInfo.cgb_consumeNumber--
        } else if (type == 3) {
          this.selectedShoppingCarInfo.cgb_consumeNumber = quantity
        }

        if (this.selectedShoppingCarInfo.cgb_consumeNumber <= 0) {
          this.delCarData({ buff_id: this.selectedShoppingCarInfo.id })
        }
        if (this.selectedShoppingCarInfo.cgb_consumeNumber) {
          if (this.formatAmount(this.selectedShoppingCarInfo.cgb_consumeNumber)) {
            this.addingGoodsBut(
              {
                member_id: parseInt(this.member_id),
                cgb_consumeNumber: this.formatAmount(this.selectedShoppingCarInfo.cgb_consumeNumber),
                goods_id: this.selectedShoppingCarInfo.goods_id,
                number_type: 'update',
                cgb_specificationId: this.selectedShoppingCarInfo.cgb_specificationId,
                cgb_goodsOrService: this.selectedShoppingCarInfo.cgb_goodsOrService,
                cgb_goo_price: this.selectedShoppingCarInfo.cgb_goo_price,
                cgb_selling_price: this.selectedShoppingCarInfo.cgb_selling_price,
                buffer_id: this.selectedShoppingCarInfo.id
              },
              4,
              null
            )
          } else {
            this.getShoppingCartList()
          }
        }
      }
    },

    // 修改原价
    changSellingValue (newPrice) {
      if (newPrice) {
        const re = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/
        if (re.test(newPrice)) {
          this.addingGoodsBut(
            {
              member_id: parseInt(this.member_id),
              cgb_consumeNumber: this.formatAmount(this.selectedShoppingCarInfo.cgb_consumeNumber),
              goods_id: this.selectedShoppingCarInfo.goods_id,
              number_type: 'update',
              cgb_specificationId: this.selectedShoppingCarInfo.cgb_specificationId,
              cgb_goodsOrService: this.selectedShoppingCarInfo.cgb_goodsOrService,
              cgb_goo_price: this.selectedShoppingCarInfo.cgb_goo_price,
              cgb_selling_price: newPrice,
              buffer_id: this.selectedShoppingCarInfo.id
            },
            4,
            null
          )
        } else {
          this.getShoppingCartList()
        }
      }
    },

    // 添加商品
    addingGoodsBut (val, type, data) {
      if (parseInt(type) < 3 && val) {
        var goodsData = {
          member_id: parseInt(this.member_id),
          consumehangup_id: this.consumehangup_id,
          cgb_specificationId: 0,
          cgb_specificationName: '',
          cgb_room_id: this.currentRoomId
        }
        if (parseInt(type) == 1) {
          goodsData.goods_id = val.id
          goodsData.cgb_goo_name = val.goo_name
          goodsData.cgb_goodsOrService = val.goo_goodsOrService
          goodsData.cgb_goo_price = val.goo_price
          goodsData.cgb_memberPrice = val.goo_price
          goodsData.cgb_goo_code = val.goo_code
          goodsData.cgb_cost_price = val.goo_purchasePrice
          goodsData.cgb_selling_price = val.goo_price
          goodsData.cgb_consumeNumber = val.cgb_consumeNumber
        } else {
          goodsData.goods_id = val.goods_id
          goodsData.cgb_specificationId = val.id
          goodsData.cgb_specificationName = val.sl_title
          goodsData.cgb_goodsOrService = data.goo_goodsOrService
          goodsData.cgb_goo_price = val.sl_sellingPrice
          goodsData.cgb_goo_name = data.goo_name
          goodsData.cgb_memberPrice = val.sl_sellingPrice
          goodsData.cgb_goo_code = val.sl_barCode
          goodsData.cgb_cost_price = val.sl_warehousingPrice
          goodsData.cgb_selling_price = val.sl_sellingPrice
          goodsData.cgb_consumeNumber = data.cgb_consumeNumber
        }
      } else if (parseInt(type) == 3) {
        var goodsData = {
          bar_code: this.goodsBarCode,
          member_id: parseInt(this.member_id)
        }
      } else if (parseInt(type) == 4) {
        var goodsData = val
      } else {
        this.$q.notify({
          message: '添加失败',
          caption: '请刷新重试',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      let captionOperate = ''
      if (parseInt(type) == 4) {
        captionOperate = '更新购物车'
      } else {
        captionOperate = '添加商品'
      }

      this.$store
        .dispatch('roomConsume/addShoppingCart', goodsData)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: `${captionOperate}成功`,
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
        cgb_room_id: this.currentRoomId,
        consumehangup_id: this.consumehangup_id,
        member_id: parseInt(this.member_id)
      }
      this.delCarData(obj)
    },

    // 删除购物车内商品
    delCarData (obj) {
      this.$store.dispatch('roomConsume/delData', obj).then((res) => {
        if (res.code == 200) {
          this.$q.notify({
            message: '成功',
            caption: '成功删除' + res.message + '条数据',
            icon: 'ion-checkmark-circle-outline',
            color: 'green',
            position: 'top-right',
            timeout: 500
          })
          this.selectedShoppingCarInfo = {}

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
      const amountsPayable = this.formatAmount(this.totalAmount + this.totalServeFeeAmount)
      this.checkoutPageReceive = true
      const buffer_data = _.map(this.shoppingCartsList, 'id')

      const zzfwfData = {}
      this.shoppingCartsList.forEach(function (item) {
        zzfwfData[item.id] = {
          serveFee: item.serveFee,
          serveTitle: item.serveTitle
        }
      })

      const return_param = {
        goodsData: buffer_data,
        consumehangup_id: this.consumehangup_id,
        zzfwfData
      }

      const couponInfo = this.couponInfo

      let currentCouponInfo = {}

      if (couponInfo && couponInfo.id) {
        const couponCardInfo = couponInfo.coupon
        currentCouponInfo = {
          record_id: couponInfo.id,
          coupon_id: couponInfo.cmd_card_id,
          coupon_title: couponCardInfo.cou_title,
          amount: couponCardInfo.cou_discount_set
        }
      }

      this.$nextTick(() => {
        this.$refs.openCheckoutCounterPageRef.checkoutPageReceive(
          'consume',
          amountsPayable,
          parseInt(this.member_id),
          return_param,
          currentCouponInfo
        )
      })
    },

    // 处理结账成功执行
    paySuccessCallBack (v) {
      this.cashRegisterData = v
      this.checkoutPageReceive = false

      this.$store
        .dispatch('roomConsume/addinvoice', v)
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
            if (res.data && res.data.printTemplateData) {
              this.$refs.localPrinterRef.startPrinter(res.data.printTemplateData)
            }

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
      if (!(parseInt(item.cgb_coupon_exchange_id) > 0)) {
        this.selectedShoppingCarInfo = item
        this.$emit('selectedShoppingCarInfo', item)
      }
      if (parseInt(item.cgb_coupon_exchange_id) > 0) {
        this.$q.notify({
          color: 'red',
          message: '失败',
          caption: '卡券兑换商品不可选择',
          icon: 'ion-close-circle-outline',
          position: 'top-right',
          timeout: 500
        })
        return false
      }
    }
  }
}
</script>
