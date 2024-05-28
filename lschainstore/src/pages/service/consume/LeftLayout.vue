<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-sm q-pb-lg">
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
        <q-table
          :data="shoppingCartsList"
          :columns="columns"
          row-key="id"
          hide-bottom
          flat
          bordered
          title-classs="bg-brown"
          separator="vertical"
          @row-click="selectShoppingCarInfo"
          :pagination="{
            rowsPerPage: 0,
          }"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th auto-width />
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" @click="selectShoppingCarInfo(props.row)">
              <q-td auto-width>
                <q-btn
                  size="sm"
                  color="primary"
                  round
                  dense
                  @click="props.expand = !props.expand"
                  :icon="props.expand ? 'keyboard_arrow_down' : 'keyboard_arrow_right'"
                />
              </q-td>
              <q-td key="chud_goo_name" :props="props">
                {{ props.row.chud_goo_name }}<span v-if="props.row.chud_specificationName"> / {{ props.row.chud_specificationName }}</span>
                <q-tooltip v-if="props.row.goodsPic">
                  {{ props.row.chud_goo_code }}
                </q-tooltip>
              </q-td>

              <!-- <q-td key="chud_goo_price" :props="props">
                <div>
                  {{ props.row.chud_goo_price }}
                </div>
              </q-td> -->
              <!-- <q-td key="chud_discount_rate" :props="props">
                <div>
                  {{ props.row.chud_discount_rate }}
                </div>
              </q-td> -->
              <q-td key="chud_selling_price" :props="props">
                <div>
                  {{ props.row.chud_selling_price }}
                </div>
              </q-td>
               <q-td key="chud_consumeNumber" :props="props">
                <div>
                  {{ props.row.chud_consumeNumber }}
                </div>
              </q-td>
              <q-td key="chud_discount_amount" :props="props">
                <div>
                  {{ props.row.chud_discount_amount }}
                </div>
              </q-td>

              <q-td key="chud_totalPrice" :props="props">
                <div>
                  {{ props.row.chud_totalPrice }}
                </div>
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%" v-if="props.row.promotionData.length > 0">
                <div class="text-left">
                  <q-list bordered padding>
                    <q-item tag="label" v-ripple v-for="(item, key) in props.row.promotionData" :key="key" v-if="item.ppi_blend == '0'">
                      <q-item-section avatar top>
                        <q-radio @input="selectPromotionData(props.row)" v-model="props.row.chud_promotion_id" :val="item.id" />
                      </q-item-section>

                      <q-item-section>
                        <q-item-label
                          >{{ item.ppi_name }}
                          <q-chip square color="blue-1" text-color="blue-8" v-if="item.ppi_discounts_model == 1">折扣</q-chip>
                          <q-chip square color="red-1" text-color="red-8" v-if="item.ppi_discounts_model == 2">特价</q-chip>
                          <q-chip square color="blue-1" text-color="blue-8" v-if="item.ppi_discounts_model == 3">满减</q-chip>
                        </q-item-label>
                        <q-item-label>
                          <!-- 折扣 -->
                          <span v-if="item.ppi_discounts_model == 1">
                            <span v-if="item.ppi_discounts_type == 1"
                              >针对选择的范围，进行直接折扣，例如：全场打95折、某一类别\品牌打9折、特定商品打8折。</span
                            >
                            <span v-if="item.ppi_discounts_type == 2">
                              针对选择的范围，买满多少金额进行折扣，例如：全场买满100元打95折、某一类别\品牌买满100元
                              打9折、特定商品买满100元打8折</span
                            >
                            <span v-if="item.ppi_discounts_type == 3"
                              >针对选择的范围，买满多少数量进行折扣，例如：全场买满10个打95折、某一类别\品牌买满10个打9
                              折、特定商品买满10个打8折。编码重复录入，即可实现量贩促销。</span
                            >
                          </span>
                          <span v-if="item.ppi_discounts_model == 2">
                            <span v-if="item.ppi_discounts_type == 1">选择的商品直接特价。</span>
                            <span v-if="item.ppi_discounts_type == 2"
                              >选择的商品买满一定数量时执行新价格，例如：原价150元的玉兰油买满2瓶则每瓶特价140元。</span
                            >
                            <span v-if="item.ppi_discounts_type == 3">
                              选择的商品购买数量为双数时，对逢偶数的商品做特价优惠，而逢奇数的商品保持原价，
                              例如：原价50的饮料买第一杯原价，第二杯特价，第三杯原价，第四杯特价，以此类推。</span
                            >

                            <span v-if="item.ppi_discounts_type == 4">设定组合商品特价销售</span>
                            <span v-if="item.ppi_discounts_type == 5"> 根据指定范围，任意选择N件M元，比如某个类别的商品任意选择3件100元。</span>
                          </span>
                          <span v-if="item.ppi_discounts_model == 3">
                            <span v-if="item.ppi_discounts_type == 1">买满一定金额，减一定金额，按倍数减，例如买满100减20，那么买满200减20*2。</span>
                            <span v-if="item.ppi_discounts_type == 2"
                              >买满一定金额，减一定金额，固定直减，例如买满100减10，那么买满200还是减10。</span
                            >
                            <span v-if="item.ppi_discounts_type == 3"
                              >买满一定金额，加一定金额，赠送商品，例如买满100元加10元送商品A或者B，加20元送商品C或者D。</span
                            >
                            <span v-if="item.ppi_discounts_type == 4">买满一定数量，赠送商品，例如买1个牙膏送赠品A或者B，买2个牙膏送赠品A或者B</span>
                            <span v-if="item.ppi_discounts_type == 5">买满一定数量的商品送低价商品，如：买5送2，赠送最低价的那2个商品。</span>
                          </span>
                        </q-item-label>
                      </q-item-section>

                      <!-- <q-item-section side>
                        <q-item-label>详情</q-item-label>
                      </q-item-section> -->
                    </q-item>
                  </q-list>
                </div>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </q-scroll-area>
      <div class="flex flex-center text-blue-grey justify-end fit" v-else>
        <div>
          <div class="text-center">
            <q-icon size="83px" name="las la-barcode"></q-icon>
          </div>
          <div>请扫码商品条码或选择右侧商品</div>
        </div>
      </div>
    </div>
    <div class="col-shrink q-pb-xl bg-white" v-if="configListData.length > 0">
      <q-scroll-area
        class="full-width q-mb-xl"
        style="height: 120px"
        :style="{
          width: parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 1 : 1)) + 'px',
        }"
      >
        <div class="row q-col-gutter-sm">
          <div class="col-xs-12 col-sm-6 col-md-4 cursor-pointer" v-for="item in configListData" :key="item.id">
            <q-card bordered flat class="q-ma-xs">
              <div class="row q-px-md">
                <div class="col-10 q-mt-sm">
                  <span class="text-subtitle2">{{ item.ppi_name }}</span>
                </div>
                <div class="col-2">
                  <q-radio v-model="selectPromotion" :val="item.id" @input="saveData" class="q-mx-sm" />
                </div>
              </div>
              <q-separator />
              <div class="row q-ma-md">
                <span v-if="item.ppi_blend == '0'">
                  全场商品<span v-if="item.ppi_discounts_model == 1"
                    >折扣，<span v-for="i in item.detail" :key="i.id">
                      <span v-if="item.ppi_discounts_type == 1">直接打{{ i.ppd_discounts }}折</span
                      ><span v-if="item.ppi_discounts_type == 2">全场买满{{ i.ppd_meet_amount }}元打{{ i.ppd_discounts }}折</span
                      ><span v-if="item.ppi_discounts_type == 3">全场买满{{ i.ppd_meet_number }}件打{{ i.ppd_discounts }}折 </span>
                    </span> </span
                  ><span v-if="item.ppi_discounts_model == 2"
                    >特价，<span v-for="i in item.detail" :key="i.id">
                      <span v-if="item.ppi_discounts_type == 1">直接特价{{ i.ppd_special_price }}元</span>
                      <span v-if="item.ppi_discounts_type == 2">全场买满{{ i.ppd_meet_number }}件特价{{ i.ppd_special_price }}元</span>
                      <span v-if="item.ppi_discounts_type == 3">商品购买数量为双数时，对逢偶数的商品做特价优惠，而逢奇数的商品保持原价</span>
                      <span v-if="item.ppi_discounts_type == 5">任意选择{{ i.ppd_meet_number }}件{{ i.ppd_special_price }}元 </span>
                    </span></span
                  ><span v-if="item.ppi_discounts_model == 3"
                    >满减满送，
                    <span v-for="i in item.detail" :key="i.id"
                      ><span v-if="item.ppi_discounts_type == 1">买满{{ i.ppd_meet_amount }}元，减{{ i.ppd_minus_amount }}元，按倍数减</span>
                      <span v-if="item.ppi_discounts_type == 2">买满一定{{ i.ppd_meet_amount }}元，减{{ i.ppd_minus_amount }}元，固定直减</span>
                      <span v-if="item.ppi_discounts_type == 3">买满一定{{ i.ppd_meet_amount }}元，加{{ i.ppd_special_price }}元，赠送商品</span>
                      <span v-if="item.ppi_discounts_type == 4">买满{{ i.ppd_meet_number }}件，赠送商品</span>
                      <span v-if="item.ppi_discounts_type == 5">买满{{ i.ppd_meet_number }}件商品送{{ i.ppd_minus_amount }}件低价商品</span>
                    </span>
                  </span>
                </span>
                <span v-else>
                  混合促销<span v-if="item.ppi_discounts_model == 1 && item.blendDiscount"
                    >折扣 <span v-if="item.ppi_discounts_type == 1">直接打{{ item.blendDiscount.pbd_discounts }}折</span
                    ><span v-if="item.ppi_discounts_type == 2"
                      >买满{{ item.blendDiscount.pbd_meet_amount }}元打{{ item.blendDiscount.pbd_discounts }}折</span
                    ><span v-if="item.ppi_discounts_type == 3"
                      >买满{{ item.blendDiscount.pbd_meet_number }}件打{{ item.blendDiscount.pbd_discounts }}折
                    </span> </span
                  ><span v-if="item.ppi_discounts_model == 2"
                    >特价，
                    <span v-if="item.ppi_discounts_type == 1">直接特价{{ item.blendDiscount.pbd_special_price }}元</span>
                    <span v-if="item.ppi_discounts_type == 2"
                      >买满{{ item.blendDiscount.pbd_meet_number }}件特价{{ item.blendDiscount.pbd_special_price }}元</span
                    >
                    <span v-if="item.ppi_discounts_type == 3">购买数量为双数时，偶数的商品做特价优惠，奇数的商品保持原价</span>
                    <span v-if="item.ppi_discounts_type == 5"
                      >任意选择{{ item.blendDiscount.pbd_meet_number }}件{{ item.blendDiscount.pbd_special_price }}元
                    </span> </span
                  ><span v-if="item.ppi_discounts_model == 3"
                    >满减满送，
                    <span v-if="item.ppi_discounts_type == 1"
                      >买满{{ item.blendDiscount.pbd_meet_amount }}元，减{{ item.blendDiscount.pbd_minus_amount }}元，按倍数减</span
                    >
                    <span v-if="item.ppi_discounts_type == 2"
                      >买满一定{{ item.blendDiscount.pbd_meet_amount }}元，减{{ item.blendDiscount.pbd_minus_amount }}元，固定直减</span
                    >
                    <span v-if="item.ppi_discounts_type == 3"
                      >买满一定{{ item.blendDiscount.pbd_meet_amount }}元，加{{ item.blendDiscount.pbd_special_price }}元，赠送商品</span
                    >
                    <span v-if="item.ppi_discounts_type == 4">买满{{ item.blendDiscount.pbd_meet_number }}件，赠送商品</span>
                    <span v-if="item.ppi_discounts_type == 5"
                      >买满{{ item.blendDiscount.pbd_meet_number }}件商品送{{ item.blendDiscount.pbd_minus_amount }}件低价商品</span
                    >
                  </span>
                </span>
              </div>
            </q-card>
          </div>
        </div>
      </q-scroll-area>
    </div>
    <div class="col-shrink q-pb-xl">
      <q-separator color="primary" />
      <q-card class="no-border-radius bg-white">
        <div class="row q-pa-xs items-center">
          <div class="col-6 col-sm-12">
            <div class="row q-pa-xs q-mt-sm" v-if="member_id > 0">
              <div class="col-6 col-sm-2 col-xs-4 col-md-4 col-lg-4 col-xl-2">
                <q-chip square color="blue-1" text-color="blue-8">卡号：{{ currentMemberInfo.mem_memberCardNum }}</q-chip>
              </div>
              <div class="col-6 col-sm-3 col-xs-4 col-md-5 col-lg-5 col-xl-3">
                <q-chip square color="blue-1" text-color="blue-8">
                  级别：{{ currentMemberInfo.memberLevel ? currentMemberInfo.memberLevel.mcl_level_name : '无等级' }}
                  <span v-if="parseInt(currentMemberInfo.mem_specifiedEndTime) < 2147457847">
                    ({{ this.$q_date.formatDate(currentMemberInfo.mem_specifiedEndTime * 1000, 'YYYY-MM-DD') }})
                  </span>
                </q-chip>
              </div>
              <div class="col-6 col-sm-2 col-xs-4 col-md-4 col-lg-4 col-xl-2">
                <q-chip square color="blue-1" text-color="blue-8">
                  积分：{{ currentMemberInfo.mem_memberPointsCount > 0 ? currentMemberInfo.mem_memberPointsCount : '0' }}
                </q-chip>
              </div>
              <div class="col-6 col-sm-2 col-xs-4 col-md-4 col-lg-4 col-xl-2">
                <q-chip square color="blue-1" text-color="blue-8">
                  储值：{{ currentMemberInfo.mem_memberMoneyCount > 0 ? currentMemberInfo.mem_memberMoneyCount : '0' }}
                </q-chip>
              </div>
              <div class="col-6 col-sm-2 col-xs-4 col-md-4 col-lg-4 col-xl-2">
                <q-chip square color="blue-1" text-color="blue-8">
                  优惠券：{{ currentMemberInfo.mem_countCoupon > 0 ? currentMemberInfo.mem_countCoupon : '0' }}
                </q-chip>
              </div>
            </div>
            <q-list v-else>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>散客</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </div>
        </div>
        <q-separator color="primary" />
        <div class="row q-pa-xs q-mb-sm q-pb-xs text-center">
          <div class="col-6 col-md-3">
            原价:
            <span class="text-subtitle2 text-negative text-weight-bolder">
              {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
              {{ totalPriceAmount }}
            </span>
          </div>
          <div class="col-6 col-md-3">
            小计:
            <span class="text-subtitle2 text-negative text-weight-bolder">
              {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
              {{ totalAmount }}
            </span>
          </div>
          <div class="col-6 col-md-3">
            共
            <span class="text-subtitle2 text-negative text-weight-bolder">
              {{ totalNumber }}
            </span>
            件
          </div>
          <div class="col-6 col-md-3">
            优惠:
            <span class="text-subtitle2 text-negative text-weight-bolder">
              {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
              {{ totalDiscountsAmount }}
            </span>
          </div>
        </div>
        <q-separator color="primary" />
      </q-card>
    </div>
    <hl-local-printer ref="localPrinterRef" />
    <hl-checkout
      @paySuccessCallBack="paySuccessCallBack"
      @closeCheckoutPopup="checkoutPageReceive = false"
      ref="openCheckoutCounterPage"
      v-if="checkoutPageReceive"
    ></hl-checkout>
  </div>
</template>

<script>
import keyboardJS from 'keyboardJS'
import { LocalStorage } from 'quasar'
export default {
  name: 'LeftLayout',
  props: ['member_id', 'consumehangup_id', 'currentMemberInfo'],
  data () {
    return {
      goodsBarCode: '',
      shoppingCartsList: [],
      selectedShoppingCarInfo: {},
      checkoutPageReceive: false,
      showPromotionStatus: false,
      showGoodsList: false,
      selectPromotion: '',
      configListData: [],
      columns: [
        {
          name: 'chud_goo_name',
          align: 'center',
          label: '商品名称',
          field: 'chud_goo_name',
          classes: this.rowClasses
        },
        // {
        //   name: 'chud_specificationName',
        //   label: '规格',
        //   field: 'chud_specificationName',
        //   align: 'center',
        //   classes: this.rowClasses,
        //   style: 'width: 10px'
        // },

        // {
        //   name: 'chud_goo_code',
        //   align: 'center',
        //   label: 'SKU码',
        //   field: 'chud_goo_code',
        //   classes: this.rowClasses
        // },
        {
          name: 'chud_selling_price',
          label: '售价',
          field: 'chud_selling_price',
          align: 'left',
          classes: this.rowClasses
        },
        {
          name: 'chud_consumeNumber',
          align: 'left',
          label: '数量',
          field: 'chud_consumeNumber',
          classes: this.rowClasses
        },
        // {
        //   name: 'chud_goo_price',
        //   align: 'center',
        //   label: '标价',
        //   field: 'chud_goo_price',
        //   classes: this.rowClasses
        // },
        // {
        //   name: 'chud_discount_rate',
        //   label: '折扣(%)',
        //   align: 'center',
        //   field: 'chud_discount_rate',
        //   classes: this.rowClasses,
        // },
        {
          name: 'chud_discount_amount',
          label: '优惠',
          align: 'left',
          field: 'chud_discount_amount',
          classes: this.rowClasses
        },

        {
          name: 'chud_totalPrice',
          label: '小计',
          field: 'chud_totalPrice',
          align: 'left',
          classes: this.rowClasses
        }
      ],
      consumeDataForm: {}
    }
  },
  computed: {
    totalAmount () {
      const that = this
      let amount = 0
      this.shoppingCartsList.forEach(function (item) {
        amount += that.formatAmount(item.chud_totalPrice)
      })
      // return this.amountSetting(amount)

      return this.amountSetting(amount)
    },
    totalNumber () {
      let number = 0
      const that = this
      if (this.shoppingCartsList.length > 0) {
        number = this.shoppingCartsList.length
      }
      return that.formatAmount(number)
    },
    totalServeFeeAmount () {
      const that = this
      let amount = 0
      this.shoppingCartsList.forEach(function (item) {
        amount += that.formatAmount(item.serveFee)
      })

      return this.formatAmount(amount)
    },

    totalPriceAmount () {
      const that = this
      let amount = 0
      this.shoppingCartsList.forEach(function (item) {
        amount += that.formatAmount(item.chud_totalPriceAmount)
      })
      // return this.formatAmount(amount)
      return this.amountSetting(amount)
    },

    totalDiscountsAmount () {
      const that = this
      const amount = that.formatAmount(that.totalPriceAmount) - this.formatAmount(that.totalAmount)
      return this.formatAmount(amount)
    }
  },
  created () {
    this.getShoppingCartList()
    this.focusCodeInput()
    this.getConsumeSet()
    this.openPlugins = LocalStorage.getItem('lschainstore_plugins_local').openPlugins
    if (this.openPlugins.indexOf('Promotion') > -1) {
      this.showPromotion()
    }
  },
  mounted () {
    keyboardJS.bind('s', (e) => {
      this.focusCodeInput()
    })
  },
  watch: {},
  methods: {
    rowClasses (val) {
      if (val.id == this.selectedShoppingCarInfo.id) {
        return 'bg-grey-2 ellipsis'
      } else {
        return ''
      }
    },
    getConsumeSet () {
      const obj = {
        name: 'consume'
      }
      this.$store
        .dispatch('settings/getConsumeSet', obj)
        .then((res) => {
          if (res.code == 200) {
            this.consumeDataForm = res.data
          }
        })
        .catch((error) => {})
    },
    // 文本框聚焦
    focusCodeInput () {
      const that = this
      this.$nextTick(() => {
        setTimeout(() => {
          that.$refs.goodsBarCodeInput.focus()
        }, 500)
      })
    },
    showPromotion () {
      // this.showPromotionStatus = true;
      const obj = {
        model: [1, 2, 3],
        status: 1,
        blend: 1,
        scope: 1,
        type: [1, 2, 3, 4, 5]
      }
      this.$store
        .dispatch('promotion/getConfigData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.configListData = res.data ? res.data : []
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
    },
    saveData () {
      const obj = {
        shoppingCartsList: this.shoppingCartsList,
        totalNumber: this.totalNumber,
        totalAmount: this.totalAmount,
        selectPromotion: this.selectPromotion
      }
      this.$store.dispatch('consume/setPromotion', obj).then((res) => {
        if (res.code == 200) {
          this.$q.notify({
            message: '成功',
            caption: '成功选择促销方案',
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
        this.showPromotionStatus = false
        this.getShoppingCartList()
      })
    },
    selectPromotionData (val) {
      const data = val.promotionData.find(function (x) {
        return x.id == val.chud_promotion_id
      })
      let shoppingCarts = [val]
      if (parseInt(data.ppi_discounts_model) == 3) {
        shoppingCarts = this.shoppingCartsList
      }

      // if (parseInt(data.ppi_discounts_scope) == 2) {
      //   this.shoppingCartsList.forEach((item) => {
      //     if (val.chud_type_id == item.chud_type_id) {
      //       shoppingCarts.push(item);
      //     }
      //   });

      //   // shoppingCarts = this.shoppingCartsList;
      // }
      // if (parseInt(data.ppi_discounts_scope) == 3) {
      //   this.shoppingCartsList.forEach((item) => {
      //     if (val.chud_brand_id == item.chud_brand_id) {
      //       shoppingCarts.push(item);
      //     }
      //   });
      // }
      // if (parseInt(data.ppi_discounts_scope) == 4) {
      //   shoppingCarts = [val];
      // }
      const obj = {
        shoppingCartsList: shoppingCarts,
        totalNumber: this.totalNumber,
        totalAmount: this.totalAmount,
        selectPromotion: val.chud_promotion_id
      }
      this.$store.dispatch('consume/setPromotion', obj).then((res) => {
        if (res.code == 200) {
          this.$q.notify({
            message: '成功',
            caption: '成功选择促销方案',
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
        this.showPromotionStatus = false
        this.getShoppingCartList()
      })
    },

    // 获取购物车数据
    getShoppingCartList () {
      this.selectPromotion = ''
      const obj = {
        consumehangup_id: this.consumehangup_id,
        member_id: parseInt(this.member_id)
      }
      this.$store
        .dispatch('consume/getShoppingCartList', obj)
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
          this.selectedShoppingCarInfo.chud_consumeNumber++
        } else if (type == 2) {
          this.selectedShoppingCarInfo.chud_consumeNumber--
        } else if (type == 3) {
          this.selectedShoppingCarInfo.chud_consumeNumber = quantity
        }

        if (this.selectedShoppingCarInfo.chud_consumeNumber <= 0) {
          this.delCarData({ buff_id: this.selectedShoppingCarInfo.id })
        }
        if (this.selectedShoppingCarInfo.chud_consumeNumber) {
          if (this.formatAmount(this.selectedShoppingCarInfo.chud_consumeNumber)) {
            this.addingGoodsBut(
              {
                member_id: parseInt(this.member_id),
                chud_consumeNumber: this.formatAmount(this.selectedShoppingCarInfo.chud_consumeNumber),
                goods_id: this.selectedShoppingCarInfo.goods_id,
                number_type: 'update',
                chud_specificationId: this.selectedShoppingCarInfo.chud_specificationId,
                chud_goodsOrService: this.selectedShoppingCarInfo.chud_goodsOrService,
                chud_goo_price: this.selectedShoppingCarInfo.chud_goo_price,
                chud_selling_price: this.selectedShoppingCarInfo.chud_selling_price,
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
              chud_consumeNumber: this.formatAmount(this.selectedShoppingCarInfo.chud_consumeNumber),
              goods_id: this.selectedShoppingCarInfo.goods_id,
              number_type: 'update',
              chud_specificationId: this.selectedShoppingCarInfo.chud_specificationId,
              chud_goodsOrService: this.selectedShoppingCarInfo.chud_goodsOrService,
              chud_goo_price: this.selectedShoppingCarInfo.chud_goo_price,
              chud_selling_price: newPrice,
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
          chud_specificationId: 0,
          chud_specificationName: ''
        }
        if (parseInt(type) == 1) {
          goodsData.goods_id = val.id
          goodsData.chud_goo_name = val.goo_name
          goodsData.chud_goodsOrService = val.goo_goodsOrService
          goodsData.chud_goo_price = val.goo_price
          goodsData.chud_memberPrice = val.goo_price
          goodsData.chud_goo_code = val.goo_code
          goodsData.chud_cost_price = val.goo_purchasePrice
          goodsData.chud_selling_price = val.goo_price
          goodsData.chud_consumeNumber = val.chud_consumeNumber
          // goodsData.chud_type_id = val.ca_type_id
          // goodsData.chud_brand_id = val.ca_brand_id
        } else {
          goodsData.goods_id = val.goods_id
          goodsData.chud_specificationId = val.id
          goodsData.chud_specificationName = val.sl_title
          goodsData.chud_goodsOrService = data.goo_goodsOrService
          goodsData.chud_goo_price = val.sl_sellingPrice
          goodsData.chud_goo_name = data.goo_name
          goodsData.chud_memberPrice = val.sl_sellingPrice
          goodsData.chud_goo_code = val.sl_barCode
          goodsData.chud_cost_price = val.sl_warehousingPrice
          goodsData.chud_selling_price = val.sl_sellingPrice
          goodsData.chud_consumeNumber = data.chud_consumeNumber
          // goodsData.chud_type_id = data.ccb_type_id
          // goodsData.chud_brand_id = data.ccb_brand_id
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
        .dispatch('consume/addShoppingCart', goodsData)
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
      this.selectPromotion = ''
      const obj = {
        consumehangup_id: this.consumehangup_id,
        member_id: parseInt(this.member_id)
      }
      this.delCarData(obj)
    },

    // 删除购物车内商品
    delCarData (obj) {
      this.$store.dispatch('consume/delData', obj).then((res) => {
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

      this.$nextTick(() => {
        this.$refs.openCheckoutCounterPage.checkoutPageReceive('consume', amountsPayable, parseInt(this.member_id), return_param)
      })
    },

    // 处理结账成功执行
    paySuccessCallBack (v) {
      // this.cashRegisterData = v
      console.log('cashRegisterData', v)
      this.checkoutPageReceive = false
      this.$store
        .dispatch('consume/addinvoice', v)
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
            this.selectPromotion = ''
            this.$emit('addInvoiceSucces')
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
    amountSetting (value) {
      const amountSetting = this.consumeDataForm

      if (parseInt(amountSetting.consume_consume_amountSettingSwitch) == 1) {
        if (parseInt(amountSetting.consume_consume_amountShowDigitsSwitch) == 1) {
          return (Math.round(parseFloat(value) * 100) / 100).toFixed(parseInt(amountSetting.consume_consume_amountShowDigits))
        }
        if (parseInt(amountSetting.consume_consume_amountShowDigitsSwitch) == 2) {
          return Math.round(parseFloat(value)) // 四舍五入取整
        }
        if (parseInt(amountSetting.consume_consume_amountShowDigitsSwitch) == 3) {
          return Math.floor(parseFloat(value)) // 向下取整
        }
        if (parseInt(amountSetting.consume_consume_amountShowDigitsSwitch) == 4) {
          return Math.ceil(parseFloat(value)) // 向上取整
        }
      } else {
        return this.formatAmount(value)
      }
    }
  }
}
</script>
