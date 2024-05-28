<template>
  <q-dialog @hide="hideDetailDialog" v-model="detailDialogStatus">
    <q-card class="fit" flat :style="{
         width: $q.screen.width * 0.3 + 'px',
        'min-width': $q.screen.width * 0.3 + 'px',
         height: $q.screen.height * 0.9 + 'px',
        'min-height': $q.screen.height * 0.9 + 'px',
       }">
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="row col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs q-pa-sm">
         <div class="text-subtitle2">
          订单详情
         </div>
         <q-space />

        </div>
        <div class="col-shrink q-pa-sm full-height bg-white">
          <q-scroll-area class="fit full-height">
            <q-list separator >

              <q-item class="q-mt-sm bg-white full-width">
                <q-item-section avatar>
                  <q-img
                    v-if="refundOrderData.coverImage && refundOrderData.coverImage.id"
                    class="carousel-rounded-borders full-width"
                    :src="$q.localStorage.getItem('cyonestore_system_local').attach_url + refundOrderData.coverImage.path"
                  >
                    <template  v-slot:error>
                      <div class="absolute-full flex flex-center bg-white ">
                        <q-icon name="las la-image" size="sm" color="grey"></q-icon>
                      </div>
                    </template>
                  </q-img>

                  <q-img v-else class="carousel-rounded-borders " ratio="1">
                    <template >
                      <div class="absolute-full flex flex-center bg-white ">
                        <q-icon name="las la-image" size="sm" color="grey"></q-icon>
                      </div>
                    </template>
                  </q-img>

                </q-item-section>

                <q-item-section top>
                  <q-item-label lines="2" class="text-subtitle1">
                    {{ refundOrderData.goods_name }} {{ refundOrderData.goods_specification ? '-' + refundOrderData.goods_specification : '' }}
                  </q-item-label>
                </q-item-section>

              </q-item>

              <q-item v-if="refundOrderData.goods_number > 0">
                <q-item-section>
                  <q-item-label>数量</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="text-red-6 text-weight-bold text-subtitle2">{{ refundOrderData.goods_number }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="refundOrderData.goods_selling_price > 0">
                <q-item-section>
                  <q-item-label>退款金额</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="text-red-6 text-weight-bold text-subtitle2">{{ refundOrderData.goods_selling_price }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="refundOrderData.goods_selling_point > 0">
                <q-item-section>
                  <q-item-label>{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_integralUnit }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="text-red-6 text-weight-bold text-subtitle2">{{ refundOrderData.goods_selling_point }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item v-if="refundOrderData.goods_selling_saving > 0">
                <q-item-section>
                  <q-item-label>{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_balanceUnit }}</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label class="text-red-6 text-weight-bold text-subtitle2">{{ refundOrderData.goods_selling_saving }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item >
                <q-item-section>
                  <q-item-label>退款方式</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>{{ refundOrderData.wod_status }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item >
                <q-item-section>
                  <q-item-label>退款原因</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>{{ orderBack.ob_why_label }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item >
                <q-item-section>
                  <q-item-label>退款备注</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>{{ orderBack.ob_back_note }}</q-item-label>
                </q-item-section>
              </q-item>

              <q-item >
                <q-item-section>
                  <q-item-label>申请时间</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                    {{ $q_date.formatDate(orderBack.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item >
                <q-item-section>
                  <q-item-label>物流公司</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                  {{ orderBack.ob_wuliu_company }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item >
                <q-item-section>
                  <q-item-label>物流单号</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                    {{ orderBack.ob_wuliu_order_no }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item >
                <q-item-section>
                  <q-item-label>物流备注</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                    {{ orderBack.ob_wuliu_note }}
                  </q-item-label>
                </q-item-section>
              </q-item>

              <q-item >
                <q-item-section>
                  <q-item-label>最新更新时间</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label>
                    {{ $q_date.formatDate(orderBack.updated_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}
                  </q-item-label>
                </q-item-section>
              </q-item>

            </q-list>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
         <q-btn class="q-px-xl" unelevated label="关闭"  @click="hideDetailDialog" color="grey" />
      </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'jfmallBackOrderDetail',
  data () {
    return {
      orderData: {},
      deliceryman: {},
      step: 0,
      orderStatusObject: {},
      detailDialogStatus: false,
      refundOrderData: {},
      orderBack: {}
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
        .dispatch('jfOrder/backGoodsItem', { detailId: orderId })
        .then((res) => {
          if (res.code == 200) {
            this.refundOrderData = res.data ? res.data : {}
            if (res.data && res.data.orderBack && res.data.orderBack.id) {
              this.orderBack = res.data.orderBack
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
            .dispatch('jfOrder/setData', obj)
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
