<template>
  <q-dialog @hide="hideDetailDialog" v-model="detailDialogStatus">
    <q-card
      class="fit"
      flat
      :style="{
        width: $q.screen.width * 0.5 + 'px',
        'min-width': $q.screen.width * 0.5 + 'px',
        height: $q.screen.height * 0.9 + 'px',
        'min-height': $q.screen.height * 0.9 + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="row col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs q-pa-sm">
          <div class="text-subtitle2">订单详情</div>
          <q-space />
        </div>
        <div class="col-shrink q-pa-sm full-height bg-white">
          <q-scroll-area class="fit full-height">
            <div class="row">
              <div class="col-6">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8">订单号:</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-dark" lines="2">{{ orderData.wo_order }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8">订单状态:</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-dark" lines="2">{{ orderStatusObject[orderData.wo_state] }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6" v-if="orderData.wo_point > 0">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8"
                      >{{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit }}:</q-item-label
                    >
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-dark" lines="2">{{ orderData.wo_point }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6" v-if="orderData.wo_saving_money > 0">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8"
                      >{{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_balanceUnit }}:</q-item-label
                    >
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-dark" lines="2">{{ orderData.wo_saving_money }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6" v-if="orderData.wo_shipping > 0">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8">运费:</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-dark" lines="2">{{ orderData.wo_shipping }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6" v-if="orderData.wo_deduct_balance > 0">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8">储值抵扣金额:</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-dark" lines="2">{{ orderData.wo_deduct_balance }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6" v-if="orderData.wo_deduct_integral_money > 0">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8">积分抵扣的金额:</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-dark" lines="2">{{ orderData.wo_deduct_integral_money }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6" v-if="orderData.wo_deduct_coupon_money > 0">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8">卡券抵扣的金额:</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-dark" lines="2">{{ orderData.wo_deduct_coupon_money }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6" v-if="orderData.wo_handle_amount > 0">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8">应付金额:</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-red text-h6" lines="2">{{ orderData.wo_handle_amount }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6" v-if="orderData.wo_real_amount > 0">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8">实付金额:</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-red text-h6" lines="2">{{ orderData.wo_real_amount }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-12">
                <q-item>
                  <q-item-section>
                    <q-item-label v-if="parseInt(orderData.wo_type) == 1">配送信息</q-item-label>
                    <q-item-label v-if="parseInt(orderData.wo_type) == 2">自取信息</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6" v-if="parseInt(orderData.wo_type) == 2">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8">到店时间：</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-red text-h6" lines="2">
                      {{ $q_date.formatDate(orderData.wo_pickup_time * 1000, 'YYYY-MM-DD HH:mm:ss') }}</q-item-label
                    >
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6" v-if="parseInt(orderData.wo_type) == 2">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8">核销码：</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-red text-h6" lines="2"> {{ orderData.wo_pickup_code }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6" v-if="parseInt(orderData.wo_type) == 2">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8">联系人：</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-dark" lines="2"> {{ orderData.wo_name }} </q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6" v-if="parseInt(orderData.wo_type) == 2">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8">联系电话：</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-dark" lines="2"> {{ orderData.wo_mobile }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6" v-if="parseInt(orderData.wo_type) == 1 && orderData.memberAddress && orderData.address_id">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8">联系人：</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-dark" lines="2"> {{ orderData.memberAddress.ma_name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6" v-if="parseInt(orderData.wo_type) == 1 && orderData.memberAddress && orderData.address_id">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8">联系电话：</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-dark" lines="2"> {{ orderData.memberAddress.ma_telephone }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6" v-if="parseInt(orderData.wo_type) == 1 && orderData.memberAddress && orderData.address_id">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8">地址：</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label class="text-dark" lines="2">
                      {{ orderData.memberAddress.province }}-{{ orderData.memberAddress.city }}-{{ orderData.memberAddress.district }}
                      {{ orderData.memberAddress.ma_address }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>

              <div class="col-6" v-if="parseInt(orderData.wo_state) >= 3 && parseInt(orderData.wo_type) == 1">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8">快递单号：</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label class="text-dark" lines="2"> {{ orderData.wo_wuliu_order }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
              <div class="col-6" v-if="parseInt(orderData.wo_state) >= 3 && parseInt(orderData.wo_type) == 1">
                <q-item clickable>
                  <q-item-section>
                    <q-item-label class="text-grey-8">快递公司：</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-item-label class="text-dark" lines="2"> {{ $store.state.wxMallOrder.wuliuCompany[orderData.wo_wuliu_company] }}</q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </div>

            <div class="full-width">
               <q-table
              row-key="id"
              hide-bottom
              flat
              bordered
              class="q-mt-sm full-width"
              title-classs="bg-brown"
              separator="cell"
              title="商品详情"
              title-class="text-subtitle2"
              :data="orderData.orderDetail"
              :columns="goodsColumns"
              :pagination="{
                rowsPerPage: 0,
              }"
            >
              <template v-slot:body="props">
                <q-tr :props="props">
                  <q-td key="coverImage" :props="props">
                    <q-avatar square>
                      <img
                        :src="
                          props.row.coverImage && props.row.coverImage.id
                            ? $q.localStorage.getItem('oneyouka_system_local').attach_url + props.row.coverImage.path
                            : ''
                        "
                        alt=""
                      />
                    </q-avatar>
                  </q-td>
                  <q-td key="goods_name" :props="props" >
                    {{ props.row.goods_name }}
                    <span v-if="props.row.spe_id > 0">{{ props.row.goods_specification }}</span>
                  </q-td>
                  <q-td key="goods_selling_point" :props="props">
                    {{ props.row.goods_selling_point }}
                  </q-td>
                  <q-td key="goods_selling_saving" :props="props">
                    {{ props.row.goods_selling_saving }}
                  </q-td>
                  <q-td key="goods_number" :props="props">
                    {{ props.row.goods_number }}
                  </q-td>
                  <q-td key="goods_shipping" :props="props">
                    {{ props.row.goods_shipping }}
                  </q-td>

                  <q-td key="goods_member_price" :props="props">
                    {{ props.row.goods_member_price }}
                  </q-td>
                  <q-td key="goods_selling_price" :props="props">
                    {{ props.row.goods_selling_price }}
                  </q-td>
                    <q-td key="comment" :props="props">
                      <div v-if="props.row.goodsComment && props.row.goodsComment.id">
                        总评分：<q-icon :key="`star${k}`" v-for="(i,k) in props.row.goodsComment.gc_comment_star_level" name="star" color="red"></q-icon>
                      </div>
                      <div v-else>
                        未评价
                      </div>

                  </q-td>
                </q-tr>
              </template>
            </q-table>
            </div>

            <div v-if="parseInt(orderData.wo_state) >= 4 && parseInt(orderData.wo_type) == 1 && wuliuLog && wuliuLog.length > 0">
              <q-table
                row-key="id"
                hide-bottom
                flat
                bordered
                class="q-mt-sm"
                title-classs="bg-brown"
                separator="cell"
                title="物流信息"
                title-class="text-subtitle2"
                :data="wuliuLog"
                :columns="wuliuColumns"
                :pagination="{
                  rowsPerPage: 0,
                }"
              >
              </q-table>
            </div>

            <q-table
              row-key="id"
              hide-bottom
              flat
              bordered
              class="q-mt-sm"
              title-classs="bg-brown"
              separator="cell"
              title="订单日志"
              title-class="text-subtitle2"
              :data="orderData.orderStatus"
              :columns="columns"
              :pagination="{
                rowsPerPage: 0,
              }"
            >
            </q-table>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
          <q-btn class="q-px-xl" unelevated label="关闭" @click="hideDetailDialog" color="grey" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'wxmallOrderDetail',
  data () {
    return {
      orderData: {},
      deliceryman: {},
      step: 0,
      orderStatusObject: {},
      detailDialogStatus: false,
      wuliuColumns: [
        {
          name: 'time',
          label: '日期',
          field: 'time',
          align: 'center'
        },
        // { name: 'created_at', label: '动作类型', field: 'created_at' },
        { name: 'address', label: '位置', align: 'center', field: 'address' }
      ],
      columns: [
        {
          name: 'created_at',
          label: '日期',
          field: 'created_at',
          align: 'center',
          format: (val) => {
            if (!val) {
              return ''
            } else {
              return this.$q_date.formatDate(val * 1000, 'YYYY-MM-DD HH:mm:ss')
            }
          }
        },
        // { name: 'created_at', label: '动作类型', field: 'created_at' },
        { name: 'wos_description', label: '日志内容', align: 'center', field: 'wos_description' }
      ],
      goodsColumns: [
        {
          name: 'coverImage',
          label: '封面图',
          field: 'coverImage',
          align: 'center'
        },
        {
          name: 'goods_name',
          label: '名称',
          field: 'goods_name',
          align: 'center',
          style: 'width: 300px;max-width:300px;word-break: break-word;',
          classes: 'ellipsis'

        },
        {
          name: 'goods_selling_point',
          label: '积分',
          field: 'goods_selling_point',
          align: 'center'
        },
        {
          name: 'goods_selling_saving',
          label: '储值',
          field: 'goods_selling_saving',
          align: 'center'
        },
        {
          name: 'goods_number',
          label: '数量',
          field: 'goods_number',
          align: 'center'
        },

        {
          name: 'goods_shipping',
          label: '运费',
          field: 'goods_shipping',
          align: 'center'
        },
        {
          name: 'goods_member_price',
          label: '会员价',
          field: 'goods_member_price',
          align: 'center'
        },
        {
          name: 'goods_selling_price',
          label: '售价',
          field: 'goods_selling_price',
          align: 'center'
        },
        {
          name: 'comment',
          label: '评价',
          field: 'comment',
          align: 'center'
        }
      ],
      wuliuLog: []
    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    hideDetailDialog () {
      this.detailDialogStatus = false
      this.$emit('operateSuccess')
    },
    getItem (orderId) {
      this.detailDialogStatus = true
      this.$store
        .dispatch('wxMallOrder/getItem', orderId)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.orderData = res.data
              this.wuliuLog = this.orderData && this.orderData.wo_wuliu_log && this.orderData.wo_wuliu_log.time ? this.orderData.wo_wuliu_log.log : []
              this.orderStatusObject = res.data && res.data.orderStatusObject ? res.data.orderStatusObject : {}
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
      this.$q
        .dialog({
          title: '是否确认',
          message: '是否取消订单',
          cancel: true
        })
        .onOk(() => {
          const obj = {
            id,
            state
          }
          this.$store
            .dispatch('wxMallOrder/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                if (parseInt(res.data.wo_state) == 7) {
                  this.$q.notify({
                    message: '成功',
                    caption: '订单已取消！',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    timeout: 500,
                    position: 'top-right'
                  })
                }

                this.hideDetailDialog()
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
        })
        .onCancel(() => {})
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
