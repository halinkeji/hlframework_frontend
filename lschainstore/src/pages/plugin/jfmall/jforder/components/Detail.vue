<template>
  <q-dialog v-model="detailDialogStatus" class="text-black">
    <q-card class="fit" flat :style="{ width: $q.screen.width * 0.8 + 'px', 'min-width': $q.screen.width * 0.8 + 'px' }">
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll q-pa-sm">
        <div class="col-shrink bg-white q-pb-md row">
          <div class="text-subtitle2">订单详情</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>

        <div class="col-shrink full-height">
          <q-scroll-area class="fit full-height">
            <div class="text-subtitle2">订单号：{{ orderData.jo_order }}</div>
            <div class="text-subtitle2">订单状态：{{ orderStatusObject[orderData.jo_state] }}</div>

            <q-stepper
              v-model="step"
              v-if="orderData.jo_state != 7 && orderData.jo_state != -1"
              ref="stepper"
              color="primary"
              animated
              flat
              class="q-mt-md"
            >
              <q-step
                :name="1"
                title="下单"
                v-if="!(orderData.jo_state == 6 && orderData.jo_order_time <= 0)"
                :caption="orderData.jo_order_time > 0 ? $q_date.formatDate(orderData.jo_order_time * 1000, 'YYYY-MM-DD  HH:mm:ss') : ''"
                icon="settings"
                :done="orderData.jo_state > 0"
              >
              </q-step>

              <q-step
                :name="2"
                title="付款"
                v-if="!(orderData.jo_state == 6 && orderData.jo_payment_time <= 0)"
                :caption="orderData.jo_payment_time > 0 ? $q_date.formatDate(orderData.jo_payment_time * 1000, 'YYYY-MM-DD  HH:mm:ss') : ''"
                icon=" mobile_friendly"
                :done="orderData.jo_state > 1"
              >
              </q-step>

              <q-step
                :name="3"
                :title="orderData.jo_type == 1 ? '配货' : '打包'"
                v-if="!(orderData.jo_state == 6 && orderData.jo_delivery_time <= 0)"
                :caption="orderData.jo_delivery_time > 0 ? $q_date.formatDate(orderData.jo_delivery_time * 1000, 'YYYY-MM-DD  HH:mm:ss') : ''"
                icon="assignment"
                :done="orderData.jo_state > 2"
              >
              </q-step>

              <q-step
                :name="4"
                :title="orderData.jo_type == 1 ? '出库' : '自取'"
                v-if="!(orderData.jo_state == 6 && orderData.jo_outbound_time <= 0)"
                :caption="orderData.jo_outbound_time > 0 ? $q_date.formatDate(orderData.jo_outbound_time * 1000, 'YYYY-MM-DD  HH:mm:ss') : ''"
                icon="local_shipping"
                :done="orderData.jo_state > 3"
              >
              </q-step>
              <q-step
                :name="5"
                title="交易成功"
                v-if="!(orderData.jo_state == 6 && orderData.jo_success_time <= 0)"
                :caption="orderData.jo_success_time > 0 ? $q_date.formatDate(orderData.jo_success_time * 1000, 'YYYY-MM-DD  HH:mm:ss') : ''"
                icon="verified_user"
                :done="orderData.jo_state > 4"
              >
              </q-step>
              <q-step
                :name="6"
                v-if="orderData.jo_state != 6 && orderData.jo_cancel_time > 0"
                title="订单已取消"
                :caption="orderData.jo_cancel_time > 0 ? $q_date.formatDate(orderData.jo_cancel_time * 1000, 'YYYY-MM-DD  HH:mm:ss') : ''"
                :done="orderData.jo_state > 5"
                icon="add_comment"
              >
              </q-step>
            </q-stepper>

            <div class="row q-mt-md q-col-gutter-sm">
              <div class="col-6">
                <q-list bordered>
                  <q-item-label header class="text-h6 text-dark">商品详情</q-item-label>

                  <q-item v-for="(item, key) in orderData.orderDetail" :key="key">
                    <q-item-section avatar>
                      <q-avatar square>
                        <img :src="item.coverImage && item.coverImage.id ? $q.localStorage.getItem('lschainstore_system_local').attach_url + item.coverImage.path : ''" alt="" />
                      </q-avatar>
                    </q-item-section>

                    <q-item-section>
                      <q-item-label lines="2" class="text-subtitle1">
                        {{ item.goods_name }}
                        <span v-if="item.goods_specification"> ({{ item.goods_specification }}) </span>
                      </q-item-label>
                      <q-item-label caption lines="2">
                        {{ item.goodsSpecification && item.goodsSpecification.id ? item.goodsSpecification.sl_title : '' }}
                      </q-item-label>
                      <q-item-label caption lines="2" class="q-gutter-sm">
                        <q-badge outline color="blue-grey" class="tag-font-size" v-if="formatAmount(item.goods_selling_point) > 0">
                          {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}
                          {{ item.goods_selling_point }}
                        </q-badge>

                        <q-badge outline color="green" class="tag-font-size" v-if="formatAmount(item.goods_selling_saving) > 0">
                          {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}
                          {{ item.goods_selling_saving }}
                        </q-badge>
                      </q-item-label>
                    </q-item-section>

                    <q-item-section side top>
                      <span class="text-red text-h6" v-if="item.goods_selling_price > 0">
                        <span class="text-caption"
                          >{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }} </span
                        >{{ item.goods_selling_price * item.goods_number }}</span
                      >
                      <div class="text-grey q-mt-sm text-caption" v-if="item.goods_number > 0">
                        数量: <span class="text-red-6 text-weight-bold text-subtitle2">{{ item.goods_number }}</span>
                      </div>
                      <div class="text-grey q-mt-sm text-caption" v-if="item.goods_shipping > 0">
                        运费: <span class="text-red-6 text-weight-bold text-subtitle2">{{ item.goods_shipping }}</span>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </div>
              <div class="col-6">
                <q-card flat bordered>
                  <q-item v-if="parseInt(orderData.jo_type) == 2">
                    <q-item-section avatar>
                      <q-avatar text-color="deep-orange" icon="las la-map-marker" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label>自取信息</q-item-label>
                      <q-item-label caption lines="2">{{ orderData.jo_name }} - {{ orderData.jo_mobile }}</q-item-label>
                      <q-item-label caption lines="2"
                        >到店时间：{{ $q_date.formatDate(orderData.jo_pickup_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>
                  <q-item v-if="parseInt(orderData.jo_type) == 1">
                    <q-item-section avatar>
                      <q-avatar text-color="deep-orange" icon="las la-map-marker" />
                    </q-item-section>

                    <q-item-section v-if="orderData.memberAddress && orderData.address_id">
                      <q-item-label>配送信息</q-item-label>
                      <q-item-label caption lines="2"
                        >{{ orderData.memberAddress.ma_name }} - {{ orderData.memberAddress.ma_telephone }}</q-item-label
                      >
                      <q-item-label caption lines="2"
                        >配送地址: {{ orderData.memberAddress.province }}-{{ orderData.memberAddress.city }}-{{ orderData.memberAddress.district }}
                        {{ orderData.memberAddress.ma_address }}</q-item-label
                      >
                    </q-item-section>
                  </q-item>

                  <q-separator />

                  <q-card flat class="bg-white q-mt-sm" v-if="parseInt(orderData.jo_type) == 1 && logisticsData.jol_courier_number">
                    <q-card-section class="text-h6"> 物流信息 </q-card-section>

                    <q-item class="q-mt-xs" v-if="logisticsData.jol_courier_number">
                      <q-item-section>
                        <q-item-label caption>{{ logisticsData.jol_courier_number }}</q-item-label>
                        <q-item-label caption>运单号</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-item class="q-mt-xs" v-if="logisticsData.jol_courier_company">
                      <q-item-section>
                        <q-item-label caption>{{ logisticsData.jol_courier_company }}</q-item-label>
                        <q-item-label caption>快递公司</q-item-label>
                      </q-item-section>
                    </q-item>

                    <q-list class="bg-white" v-if="logisticsData && logisticsData.jol_content">
                      <q-item class="q-mt-xs" :key="'wuliu-' + key" v-for="(item, key) in logisticsData.jol_content">
                        <q-item-section>
                          <q-item-label caption>{{ item.status }}</q-item-label>
                          <q-item-label caption>{{ item.time }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>

                  <q-card-section flat v-if="orderData.evaluation && orderData.evaluation.id">
                    <div class="text-h6">订单评价</div>
                    <div class="bg-white q-pt-sm">
                      <div class="row">
                        <div class="col-2 text-grey-8 q-pt-xs">物流包装</div>
                        <div class="col-10 q-pl-sm">
                          <q-icon
                            name="star"
                            :key="key"
                            size="2em"
                            v-for="(item, key) in parseInt(orderData.evaluation.je_package_evaluation)"
                            color="red"
                          ></q-icon>
                        </div>
                      </div>
                      <div class="row q-py-sm">
                        <div class="col-2 text-grey-8 q-pt-xs">物流速度</div>
                        <div class="col-10 q-pl-sm">
                          <q-icon
                            name="star"
                            :key="key"
                            size="2em"
                            v-for="(item, key) in parseInt(orderData.evaluation.je_speed_evaluation)"
                            color="red"
                          ></q-icon>
                        </div>
                      </div>
                      <div class="row q-pb-sm">
                        <div class="col-2 text-grey-8 q-pt-xs">客服服务</div>
                        <div class="col-10 q-pl-sm">
                          <q-icon
                            name="star"
                            :key="key"
                            size="2em"
                            v-for="(item, key) in parseInt(orderData.evaluation.je_steward_evaluation)"
                            color="red"
                          ></q-icon>
                        </div>
                      </div>
                    </div>
                    <div class="text-subtitle1">
                      {{ orderData.evaluation.je_overall_evaluation }}
                    </div>
                  </q-card-section>

                  <q-card-section>
                    <div class="text-right text-subtitle1" v-if="orderData.jo_point > 0">
                      <span>订单所需{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}:</span>
                      <span class="text-red text-h6">{{ orderData.jo_point }}</span>
                    </div>
                    <div class="text-right text-subtitle1" v-if="orderData.jo_saving_money > 0">
                      <span>订单所需{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}:</span>
                      <span class="text-red text-h6">{{ orderData.jo_saving_money }}</span>
                    </div>
                    <!-- <div class="text-right text-subtitle1" v-if="orderData.wo_shipping > 0">
                      <span>订单所需运费:</span>
                      <span class="text-red text-h6">{{ orderData.wo_shipping }}</span>
                    </div> -->
                    <div class="text-right text-subtitle1" v-if="orderData.jo_money > 0">
                      <span>商品总价：</span>
                      <span class="text-red text-h6"
                        >{{ orderData.jo_money }}{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span
                      >
                    </div>
                    <div class="text-right text-subtitle1 q-mt-md">
                      <span>实付金额：</span>
                      <span class="text-red text-h4"
                        >{{ formatAmount(formatAmount(orderData.jo_money))
                        }}{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span
                      >
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </q-scroll-area>
        </div>

        <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
          <q-btn
            v-if="orderData.jo_state < 3 && orderData.jo_state != -1"
            outline
            color="grey-7"
            label="取消订单"
            icon="las la-comment"
            @click="updateState(orderData.id, 7)"
          />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'Detail',
  data () {
    return {
      orderData: {},
      deliceryman: {},
      step: 0,
      logisticsData: {},
      wuliuData: [],
      orderId: 0,
      detailDialogStatus: false,
      orderStatusObject: {
        '-1': '已删除',
        1: '待付款',
        2: '待确认',
        3: '待发货',
        4: '待收货',
        5: '待评价',
        6: '已完成',
        7: '已取消'
      }
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    init (orderId) {
      this.orderId = orderId
      this.detailDialogStatus = true
      this.$nextTick(() => {
        this.getItem()
      })
    },
    getItem () {
      this.$store
        .dispatch('jforder/getItem', this.orderId)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.orderData = res.data
              this.logisticsData = this.orderData.orderLogistics ? this.orderData.orderLogistics : {}
              this.deliceryman = res.data.deliveryman ? res.data.deliveryman : []
              this.wuliuData = this.orderData.wuliu ? this.orderData.wuliu : {}
            }
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    updateState (id, state) {
      const obj = {
        id: id,
        state: state
      }
      this.$store
        .dispatch('jforder/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data.jo_state == 7) {
              this.$q.notify({
                message: '成功',
                caption: '订单已取消！',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
            }
            this.getItem()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    hideNowPage () {
      this.$emit('closeDialog')
    },
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
