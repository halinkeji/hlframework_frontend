<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: this.$q.screen.width * 0.6 + 'px',
        'min-width': this.$q.screen.width * 0.6 + 'px',
      }"
      class="fit"
    >
      <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 row">
          <div class="text-subtitle2">结账</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="col-shrink bg-white full-height bg-grey-2 q-mt-xs">
          <div class="row fit bg-white justify-around">
            <q-form ref="addDeskLinkRef" class="col-12  col-md-6  q-px-xs  q-pt-md ">
              <q-scroll-area class="fit">
                <q-list bordered separator class="rounded-borders q-mt-sm full-width">
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
                  <div v-for="(item, key) in carListData" :key="key">
                    <q-separator />
                    <q-item clickable>
                      <q-item-section no-wrap>
                        <q-item-label class="text-subtitle2 text-dark" lines="2"
                          ><q-badge color="red" rounded v-if="parseInt(item.doc_status) == -1" class="q-mr-sm" />{{ item.doc_food_name }}
                        </q-item-label>

                        <div class="row  q-gutter-sm items-center text-dark">
                          <span v-for="(i, k) in item.spec"  :key="`s-${k}`">
                            <q-badge color="blue" v-if="i.ocs_member_level_price > 0">
                              会员价： {{ i.ocs_son_spec_name }} ¥ {{ i.ocs_member_level_price }}
                            </q-badge>
                            <q-badge color="orange" v-else> {{ i.ocs_son_spec_name }} ¥ {{ i.ocs_price }} </q-badge>
                          </span>

                          <q-badge color="blue-grey" v-for="(i, k) in item.foodAttribute"  :key="`f-${k}`"> {{ i.ocs_son_spec_name }} </q-badge>
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
                          价格:<span :class="item.doc_selling_price != item.doc_list_price || item.doc_member_level_price > 0 ? 'text-strike' : ''">
                            ¥ {{ item.doc_list_price }}
                          </span>
                          <span class="text-negative" v-if="item.doc_selling_price != item.doc_list_price"
                            >改价： ¥ {{ item.doc_selling_price }}
                          </span>
                          <span class="text-blue" v-if="item.doc_member_level_price > 0">会员价： ¥{{ item.doc_member_level_price }} </span>
                        </q-item-label>

                        <q-item-label class="text-h6 text-negative">¥ {{ item.doc_subtotal_amount }}</q-item-label>
                        <q-item-label
                          class="text-body2 text-negative"
                          v-if="item.doc_selling_price != item.doc_list_price || item.doc_member_level_price > 0"
                        >
                          优惠：- ¥
                          {{ formatAmount(formatAmount(item.doc_list_price * item.doc_quantity) - item.doc_subtotal_amount) }}
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </div>
                </q-list>
                <q-list bordered separator class="q-mt-sm full-width">
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>数量</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label class="text-h6 text-weight-bold"> {{ formatAmount(foodsQuantity) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>应付</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label class="text-h6 text-weight-bold">¥ {{ formatAmount(shouldPayMoney) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>优惠</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-item-label class="text-h6 text-weight-bold text-orange">- ¥ {{ formatAmount(discountMoney) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>实付</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                      <q-item-label class="text-h6 text-weight-bold text-negative">¥ {{ formatAmount(realPayMoney) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-scroll-area>
            </q-form>

            <q-separator vertical inset />
            <div class="col-12  col-md-5 q-px-xs q-pt-md text-center">
              <hl-card-reading ref="memberCardReading" navType="vertical" @refreshDataList="getMemberInfo"></hl-card-reading>
            </div>
          </div>
        </div>

        <div class="col-shrink bg-white q-pb-md q-gutter-md  q-mt-xs text-center">
          <q-btn unelevated label="结账" class="q-px-xl" :disable="addButtonDisabled" color="positive" @click="settleOrder" />
          <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
        </div>
      </div>
      <hl-checkout
        v-if="orderCheckout"
        ref="checkoutRef"
        @closeCheckoutPopup="closeCheckoutPopup"
        @paySuccessCallBack="paySuccessCallBack"
      ></hl-checkout>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'OrderSettle',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      userOptions: [],
      currentDeskId: '',
      memberId: '',
      carListData: [],
      shouldPayMoney: 0,
      discountMoney: 0,
      realPayMoney: 0,
      foodsQuantity: 0,
      orderCheckout: false
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (currentDeskId) {
      this.currentDeskId = currentDeskId

      this.showDialog = true
      this.getDeskSettleDetail()
    },
    getDeskSettleDetail () {
      this.$store
        .dispatch('fastfood/getDeskSettleDetail', { currentDeskId: this.currentDeskId, memberId: this.memberId })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.carListData = res.data ? res.data.carDetailData : []

            this.shouldPayMoney = res.data.shouldPayMoney
            this.realPayMoney = res.data.realPayMoney
            this.discountMoney = res.data.discountMoney
          } else {
            this.$q.notify({
              message: '失败',
              caption: '操作失败',
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
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.memberId = val.id
          this.$nextTick(() => {
            this.getDeskSettleDetail()
          })
        }
      }
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    settleOrder () {
      this.orderCheckout = true
      const params = {
        deskId: this.currentDeskId
      }
      this.$nextTick(() => {
        // 消费类型 钱 会员Id 需要返回的值
        this.$refs.checkoutRef.checkoutPageReceive('fastFood', this.formatAmount(this.realPayMoney), this.memberId, params)
      })
    },

    closeCheckoutPopup () {
      this.orderCheckout = false
    },

    paySuccessCallBack (v) {
      // 请求本身的函数进行  保存数据
      this.orderCheckout = false
      this.$store
        .dispatch('fastfood/orderSetData', v)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '点单消费结账成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            this.$emit('paySuccessCallBack')
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

    hideNowPage () {
      this.showDialog = false
    }
  }
}
</script>
