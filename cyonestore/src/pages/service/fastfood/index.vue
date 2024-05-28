<template>
  <q-page class="fit row">
    <!-- <div class="row fit "> -->
    <div class="col-shrink col-xs-4 col-sm-4 col-md-4 col-lg-4 col-xl-4 bg-grey-2">
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink ">
          <q-card flat square >
            <q-toolbar class="text-dark ">
              <q-toolbar-title class="text-subtitle2"> 快餐 </q-toolbar-title>
            </q-toolbar>
            <q-separator />
          </q-card>
        </div>
        <div class="col-shrink full-height">
          <q-scroll-area class="fit">
            <q-list separator class="rounded-borders q-mt-sm">
              <q-item>
                <q-item-section no-wrap>
                  <q-item-label class="text-subtitle1 text-dark" lines="1">菜品</q-item-label>
                </q-item-section>

                <q-item-section side>
                  <q-item-label>
                    <span class="cursor-pointer text-dark text-subtitle1">数量 </span>
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="text-subtitle1 text-dark">售价/小计</q-item-label>
                </q-item-section>
              </q-item>
              <div v-for="(item, key) in carListData" :key="key" :class="{ 'bg-grey-5 text-white': item.id == currentCarInfo.id }">
                <q-item clickable @click="currentCarInfo = item">
                  <q-item-section no-wrap>
                    <q-item-label class="text-subtitle2 text-dark" lines="2">
                      <q-badge color="red" rounded v-if="parseInt(item.doc_status) == -1" class="q-mr-sm" />{{ item.doc_food_name }}
                    </q-item-label>

                    <div class="row  q-gutter-sm items-center text-dark">
                      <q-badge color="orange" v-for="(i, k) in item.spec"  :key="`spec-${k}`"> {{ i.ocs_son_spec_name }} ¥ {{ i.ocs_price }} </q-badge>
                      <q-badge color="blue-grey" v-for="(i, k) in item.foodAttribute" :key="`attribute-${k}`"> {{ i.ocs_son_spec_name }} </q-badge>
                    </div>

                    <q-item-label caption v-if="item.doc_remarks">备注： {{ item.doc_remarks }}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label>
                      <span class="cursor-pointer text-dark text-subtitle1">{{ item.doc_quantity }} </span>
                    </q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label caption class="text-italic text-body2">
                      价格:<span :class="item.doc_selling_price != item.doc_list_price ? 'text-strike' : ''"> ¥ {{ item.doc_list_price }} </span>
                      <span class="text-negative" v-if="item.doc_selling_price != item.doc_list_price"> ¥{{ item.doc_selling_price }} </span>
                    </q-item-label>

                    <q-item-label caption class="text-body2 text-dark"></q-item-label>
                    <q-item-label class="text-h6 text-negative">¥ {{ item.doc_subtotal_amount }}</q-item-label>
                    <q-item-label class="text-body2 text-negative" v-if="item.doc_selling_price != item.doc_list_price">优惠：- ¥ {{ formatAmount(formatAmount(item.doc_list_price * item.doc_quantity) - item.doc_subtotal_amount) }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </q-list>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white row q-py-sm">
          <q-item dense class="col-6">
            <q-item-section>总额</q-item-section>
            <q-item-section side class="text-h6 text-negative">￥ {{ carData.totalAmount }}</q-item-section>
          </q-item>
          <q-item dense class="col-6">
            <q-item-section>数量</q-item-section>
            <q-item-section side class="text-h6 text-negative">{{ carData.totalNumber }}</q-item-section>
          </q-item>
        </div>
      </div>
    </div>
    <div class="col-shrink col-xs-2 col-sm-2 col-md-1 col-lg-1 col-xl-1 q-pa-xs bg-white column">
      <q-btn
        unelevated
        color="negative"
        label="删除"
        class="full-width text-h6 q-my-xs"
        :disable="currentCarInfo && currentCarInfo.id ? false : true"
        @click="delDishes(currentCarInfo.id)"
      />
      <q-btn
        unelevated
        color="grey"
        label="备注"
        class="full-width text-h6 q-my-xs"
        :disable="currentCarInfo && currentCarInfo.id ? false : true"
        @click="showRemarks(currentCarInfo.doc_remarks)"
      />
      <q-btn
        unelevated
        color="green"
        label="数量"
        class="full-width text-h6 q-my-xs"
        :disable="currentCarInfo && currentCarInfo.id ? false : true"
        @click="editQuantityValueDialog"
      />
      <q-btn
        unelevated
        color="orange"
        label="改价"
        class="full-width text-h6 q-my-xs"
        :disable="currentCarInfo && currentCarInfo.id ? false : true"
        @click="editSellPriceDialog"
      />
      <q-btn
        unelevated
        color="deep-orange"
        label="清空"
        :disable="carListData.length > 0 ? false : true"
        @click="clearCart"
        class="full-width text-h6 q-my-xs"
      />

      <!-- <q-btn unelevated color="green" label="挂单" class="full-width text-h6 q-my-xs"  :disable="carListData.length > 0 ? false : true" @click="pendingOrder" /> -->

      <q-btn
        v-if="carListData && carListData.length > 0"
        unelevated
        color="red"
        label="结账"
        @click="settlementOrder"
        class="full-width text-h6 q-my-xs"
      />
    </div>
    <div class="col-shrink col-xs-6 col-sm-7 col-md-7 col-lg-7 col-xl-7">
      <q-card square bordered flat class="fit row bg-grey-2">
        <div class="col-shrink col-xs-10 col-sm-10 col-md-11 col-lg-11 col-xl-11  column justify-between">
          <div v-if="dishesData.length > 0" class="row">
            <div v-for="(item, key) in dishesData" :key="key" class="col-lg-2 col-md-2 col-sm-4 q-pa-xs">
              <q-card square flat class="q-pa-xs" bordered @click="addFoodInfo(item)">

                  <q-badge color="red" floating v-if="parseInt(item.fl_is_limit_time) == 1">
                    {{ $q_date.formatDate(item.tld_time_start * 1000, 'HH:mm') }}
                    ~
                    {{ $q_date.formatDate(item.tld_time_end * 1000, 'HH:mm') }}
                    余量{{ formatAmount(item.last_buy_quantity) }}
                  </q-badge>

               <q-badge color="red" floating v-if="parseInt(item.goo_goodsOrService) == 3">套餐</q-badge>
                <q-card-section class="text-center">
                  <div class="text-subtitle1 ellipsis text-weight-bold q-py-xs">{{ item.goo_name }}</div>
                  <div class="text-subtitle2 text-negative" v-if="parseInt(item.goo_size) == 1"><q-badge color="secondary" label="选规格" /></div>
                  <div class="text-subtitle2 text-negative" v-else>￥ {{ item.goo_listPrice }}</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="text-center" v-else>
            空
          </div>
          <div class="row justify-around q-pa-sm items-center">
            <div class="col-6 text-right">
              <!-- <q-pagination color="dark" v-model="page.pageIndex" :max="maxPage" @input="getList()" direction-links input outline /> -->
            </div>
            <div class="col-6 ">
              <q-input
                dense
                color="dark"
                v-model="queryText"
                label="菜品编码/菜品名称/菜品简称"
                clearable
                @clear="getList()"
                @keyup.enter="getList()"
              >
                <template v-slot:after>
                  <q-btn round color="secondary" unelevated dense @click="getList()" icon="find_replace" />
                </template>
              </q-input>
            </div>
          </div>
        </div>
        <div class="col-shrink col-xs-2 col-sm-2 col-md-1 col-lg-1 col-xl-1">
          <q-separator vertical />
          <q-tabs
            v-model="dishesType"
            vertical
           class="bg-white text-dark"
            active-class="text-white color_shallow text-h6 "
          >
            <q-tab name="all" label="全部" @click="getList" />
            <q-tab :name="item.id" :label="item.gt_name" @click="getList" v-for="(item, key) in dishesTypeList" :key="key" />
          </q-tabs>
        </div>
      </q-card>
    </div>
    <!-- </div> -->

    <spec ref="specRef" v-if="specPoppupStatus" @dataList="hideSpec" @addSpecData="addSpecData" />
    <remarks ref="remarksRef" v-if="remarksPoppupStatus" @saveRemarks="saveRemarks" />
    <order-settle ref="orderSettleRef" v-if="orderSettleRefStatus" @closeDialog="closeSettleDialog" @paySuccessCallBack="paySuccessCallBack" />

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
                quantityValue = v;
              }
            "
            @confirmEvent="editQuantityValue(quantityValue)"
            :decimal="true"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="sellPriceDialogStatus">
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 0.6 : 0.4)) + 'px',
          'max-width': parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 0.6 : 0.4)) + 'px',
        }"
      >
        <q-card-section>
          <q-input class="q-mb-md text-h6" v-model="sellPriceValue" ref="sellPriceValueRef" outlined square>
            <template v-slot:prepend>
              售价
            </template>
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

  </q-page>
</template>
<script>
import Spec from './Spec'
import Remarks from './Remarks'
import OrderSettle from './OrderSettle'
export default {
  name: 'addOrder',
  components: { Spec, Remarks, OrderSettle },
  data () {
    return {
      orderCheckout: false,
      specPoppupStatus: false,
      principalPoppupStatus: false,
      remarksPoppupStatus: false,
      orderSettleRefStatus: false,
      currentDeskId: -2,
      queryText: '',
      dishesType: 'all',

      carData: {
        doc_desk_id: '',
        doc_food_id: '',
        doc_spec_id: '',
        doc_member_id: '',
        doc_status: 1,
        doc_list_price: '',
        doc_member_level_price: '',
        doc_selling_price: '',
        doc_quantity: '0',
        doc_subtotal_amount: '',
        member_level_id: '',
        totalAmount: 0,
        totalNumber: 0
      },
      carListData: [],
      dishesTypeList: [],
      dishesData: [],

      page: {
        pageIndex: 1,
        pageSize: 30,
        pageTotal: 0
      },

      quantityDialogStatus: false,
      quantityValue: '',
      currentCarInfo: {},
      sellPriceDialogStatus: false,
      sellPriceValue: ''
    }
  },
  created () {
    this.getDeskCarList()

    this.getList()
    this.getDishesTypeList()
  },
  mounted () {},
  computed: {
    maxPage () {
      return Math.ceil(this.page.pageTotal / this.page.pageSize) && Math.ceil(this.page.pageTotal / this.page.pageSize) != 'Infinity'
        ? Math.ceil(this.page.pageTotal / this.page.pageSize)
        : 1
    }
  },
  methods: {

    getDeskCarList () {
      const params = {
        deskId: 0
      }
      this.$store
        .dispatch('fastfood/getDeskCarList', params)
        .then((res) => {
          if (res.code == 200) {
            this.carListData = res.data ? res.data : []
            if (res.data && res.data.length > 0) {
              if (this.currentCarInfo && !this.currentCarInfo.id) {
                this.currentCarInfo = res.data[0]
              }
            }

            this.carTotal()
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
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

    getDishesTypeList () {
      this.$store
        .dispatch('fastfood/getFoodTypeData')
        .then((res) => {
          if (res.code == 200) {
            this.dishesTypeList = res.data ? res.data : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
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

    getList () {
      this.$nextTick(() => {
        const params = {
          queryText: this.queryText,
          type: this.dishesType
        }
        this.$store
          .dispatch('dishes/getOrderFoodList', params)
          .then((res) => {
            if (res.code == 200) {
              this.dishesData = res.data ? res.data : []
            }
          })
          .catch((error) => {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: error.message,
              color: 'red'
            })
          })
      })
    },

    // 将菜品添加至购物车
    addFoodInfo (item) {
      if (parseInt(item.goo_size) == 1) {
        this.showSpec(item.id, this.currentDeskId, null, null)
      } else {
        this.setBaseFoodCar(item)
      }
    },

    showSpec (id, deskId, levelId) {
      this.specPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.specRef.init(id, deskId, levelId)
      })
    },

    addSpecData (params) {
      this.specPoppupStatus = false
      this.$nextTick(() => {
        this.setDeskCarData(params)
      })
    },

    // 添加无规格菜品
    setBaseFoodCar (item) {
      const params = {
        doc_food_id: item.id,
        doc_food_name: item.goo_name,
        doc_food_code: item.goo_code,
        doc_status: 1,
        doc_desk_id: this.currentDeskId,
        doc_list_price: item.goo_listPrice,
        doc_selling_price: item.goo_listPrice,
        doc_quantity: 1,
        doc_goods_service: item.goo_goodsOrService
      }

      if (item.fl_is_limit_time == 1 && item.last_buy_quantity > 0) {
        params.doc_selling_price = item.tld_discount_price
        params.doc_time_limit_discount_price = item.tld_discount_price
        params.doc_is_limit_time = item.fl_is_limit_time
        params.doc_limit_quantity = item.tld_limit_quantity
        params.doc_limit_time_start = item.tld_time_start
        params.doc_limit_time_end = item.tld_time_end
      }

      this.setDeskCarData(params)
    },

    // 将数据保存、更新至购物车
    setDeskCarData (params) {
      this.$store
        .dispatch('fastfood/setDeskCarData', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '添加购物车成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.getDeskCarList()
            // this.carTotal()
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
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
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

    // 修改购物车选中商品数量
    editQuantityValue (quantity) {
      this.quantityDialogStatus = false
      this.quantityValue = ''
      const regu = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/
      if (!regu.test(quantity)) {
        this.$q.notify({
          message: '注意',
          caption: '请输入正确的数量！',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
        return false
      }
      this.$nextTick(() => {
        const item = this.currentCarInfo
        this.setDeskCarData({
          carFoodId: item.id,
          doc_quantity: quantity,
          doc_is_limit_time: item.doc_is_limit_time,
          doc_limit_quantity: item.doc_limit_quantity,
          doc_limit_time_start: item.doc_limit_time_start,
          doc_limit_time_end: item.doc_limit_time_end
        })
      })
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

    // 修改购物车选中商品售价
    editSellPriceValueValue (newPrice) {
      this.sellPriceDialogStatus = false
      this.sellPriceValue = ''
      const regu = /^(([1-9]{1}\d*)|(0{1}))(\.\d{0,2})?$/
      if (!regu.test(newPrice)) {
        this.$q.notify({
          message: '注意',
          caption: '请输入正确的价格！',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
        return false
      }

      this.$nextTick(() => {
        this.updataCarInfo({
          carFoodId: this.currentCarInfo.id,
          doc_selling_price: newPrice
        })
      })
    },

    // 打开修改备注
    showRemarks (remarks) {
      this.remarksPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.remarksRef.init(remarks)
      })
    },

    // 修改备注
    saveRemarks (value) {
      this.remarksPoppupStatus = false
      this.$nextTick(() => {
        this.currentCarInfo.doc_remarks = value
        this.updataCarInfo({
          carFoodId: this.currentCarInfo.id,
          doc_remarks: value
        })
      })
    },

    // 删除购物车单独菜品
    delDishes (id) {
      const params = [id]
      this.$store.dispatch('fastfood/delAllDeskCar', params).then((res) => {
        if (res.code == 200) {
          this.$q.notify({
            message: '成功',
            caption: '成功删除菜品!',
            color: 'green',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
          this.currentCarInfo = {}
          this.getDeskCarList()
        }
      })
    },

    // 清空购物车
    clearCart () {
      this.$q
        .dialog({
          title: '提示',
          message: '确定清空当前购物车吗？',
          cancel: true
        })
        .onOk(() => {
          const params = {
            deskId: this.currentDeskId
          }
          this.$store.dispatch('fastfood/clearCart', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '清空购物车成功',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'green'
              })
              this.currentCarInfo = {}

              this.getDeskCarList()
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
        })
        .onCancel(() => {})
    },

    settlementOrder () {
      this.orderSettleRefStatus = true
      this.$nextTick(() => {
        this.$refs.orderSettleRef.init(this.currentDeskId)
      })
    },

    closeSettleDialog () {
      this.orderSettleRefStatus = false
    },
    paySuccessCallBack () {
      this.orderSettleRefStatus = false
      this.currentCarInfo = {}
      this.getDeskCarList()
    },

    carTotal () {
      let totalAmount = 0
      let totalNumber = 0
      const that = this
      if (this.carListData.length > 0) {
        this.carListData.forEach(function (value, index, array) {
          totalAmount += that.formatAmount(value.doc_subtotal_amount)
          totalNumber = totalNumber + that.formatAmount(value.doc_quantity)
        })
      } else {
        totalAmount = 0
        totalNumber = 0
      }

      this.carData.totalAmount = totalAmount.toFixed(2)
      this.carData.totalNumber = totalNumber
    },

    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    hideSpec () {
      this.getDeskCarList()
      this.specPoppupStatus = false
    },

    hidePrincipal () {
      this.getDeskCarList()
      this.principalPoppupStatus = false
    },

    // 小票对账
    pendingOrder () {

    },

    updataCarInfo (params) {
      this.$store
        .dispatch('fastfood/setDeskCarData', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '更改成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.getDeskCarList()
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              color: 'red',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.getDeskCarList()
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
          this.getDeskCarList()
        })
    }
  }
}
</script>
