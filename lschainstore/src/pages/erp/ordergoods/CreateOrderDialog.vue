<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: $q.screen.width * 0.3 + 'px',
        'min-width': $q.screen.width * 0.3 + 'px',
      }"
    >
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2">新增订货单</div>

        <q-space />
        <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-py-sm">
        <q-form ref="erpInRef">
          <q-input disable dense outlined bottom-slots v-model="invoiceData.cep_contract_number" label="补货单据号">
            <template v-slot:after>
              <q-btn color="primary" @click="chooseInvoice()" unelevated label="选择补货单" />
            </template>
          </q-input>
          <div v-if="is_main_store">
            <q-select
              outlined
              option-value="id"
              option-label="name"
              emit-value
              map-options
              v-model="orderGoodsData.cep_order_store_id"
              :options="libInStoreList"
              dense
              @input="getStoreCredit"
              label="订货店铺"
              lazy-rules
              :disable="orderGoodsData.cep_order_store_id ? true : false"
              :rules="[(val) => !!val || '请选择订货店铺']"
            />
          </div>

          <q-select
            outlined
            option-value="id"
            option-label="cd_name"
            emit-value
            map-options
            v-model="orderGoodsData.cep_depot_id"
            :options="depotData"
            @input="selectDepot"
            dense
            :disable="orderGoodsData.cep_depot_id ? true : false"
            label="请选择仓库"
            lazy-rules
            :rules="[(val) => !!val || '请选择仓库']"
          />

          <div class="q-gutter-x-xs row" v-if="invoiceData.cep_contract_number">
            <div class="col-12">
              <q-input disable outlined dense bottom-slots v-model="invoiceData.cep_total_amount" label="补货实付款" />
            </div>
            <!-- {{ invoiceData.cep_type == 1 ? invoiceData.cep_total_type_quantity : invoiceData.cep_total_replenishment_quantity }} -->

            <div class="col-12">
              <q-input disable outlined dense bottom-slots v-model="invoiceData.cep_total_purchase_num" label="补货总数量" />
            </div>
            <div class="col-12">
              <q-input disable outlined dense bottom-slots v-model="invoiceData.cep_note" label="补货备注" />
            </div>
          </div>
          <div class="col-12">
            <q-card flat bordered v-if="linkTypeBufferData && linkTypeBufferData.length > 0">
            <q-item-label header>
              补货品类
            </q-item-label>
            <q-separator />
            <div class=" row">
              <div class="col-4" v-for="(item, key) in linkTypeBufferData">
                <q-item>
                  <q-item-section>
                    <q-item-label>
                      <span class="text-h6">{{ item.cel_number }}</span
                      >件
                    </q-item-label>
                    <q-item-label>
                      {{ item.cel_type_name }}
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </div>
            </div>
          </q-card>
          </div>

        </q-form>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn unelevated label="确认" class="q-px-xl" color="primary" @click="createOrderGoodsData" />
        <q-btn unelevated label="关闭" class="q-ml-sm q-px-xl" color="grey" v-close-popup />
      </q-card-actions>

      <choose-invoice
        v-if="chooseInvoiceVisible"
        ref="chooseInvoiceList"
        @getChooseInvoiceData="receivingAdministrator"
        @closeChooseInvoice="closeChooseInvoice"
      ></choose-invoice>
    </q-card>
  </q-dialog>
</template>

<script>
import ChooseInvoice from './components/ChooseInvoice'
export default {
  name: 'CreateOrderDialog',
  components: {
    ChooseInvoice
  },
  data () {
    return {
      orderGoodsData: {
        cep_fold_clause: 0,
        cep_real_pay_amount: 0,
        cep_discount_amount: 0,
        cep_total_purchase_num: 0,
        cep_total_purchase_amount: 0,
        cep_note: '',
        cep_depot_id: '',
        cep_depot_code: '',
        cep_depot_name: '',
        cep_if_pack: '2',
        cep_status: 1,
        cep_type: 4,
        cep_order_store_id: '',
        cep_patch_order_id: ''
      },
      storeCreditData: {},

      showDialog: false,
      depotData: [],
      libInStoreList: [],
      chooseInvoiceVisible: false,
      invoiceData: {},
      linkTypeBufferData: []
    }
  },

  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {},
  mounted () {},
  methods: {
    init () {
      this.showDialog = true
      this.getDepotList()
      if (this.is_main_store) {
        this.getLibInStoreData()
      } else {
        const accountInfo = this.$q.localStorage.getItem('lschainstore_account_info')
        if (accountInfo) {
          this.orderGoodsData.cep_order_store_id = accountInfo.store_id
        }
      }
    },

    hideNowPage () {
      this.showDialog = false
      this.$emit('colseDialog')
    },

    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },

    getDepotList () {
      this.$store
        .dispatch('erpdepot/getAllData')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.depotData = res.data
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

    selectDepot () {
      const that = this
      if (that.orderGoodsData.cep_depot_id > 0) {
        const data = that.depotData.find(function (x) {
          return x.id == that.orderGoodsData.cep_depot_id
        })
        that.orderGoodsData.cep_depot_code = data.cd_code
        that.orderGoodsData.cep_depot_name = data.cd_name
      }
    },

    getStoreCredit () {
      // const obj = {
      //   store: this.orderGoodsData.store_id
      // }
      this.$store
        .dispatch('storeCredit/getItemData', this.orderGoodsData.cep_order_store_id)
        .then((res) => {
          if (res.code == 200) {
            this.storeCreditData = res.data ? res.data : []
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

    chooseInvoice () {
      const obj = {
        StoreId: this.orderGoodsData.cep_order_store_id
      }

      this.chooseInvoiceVisible = true
      this.$nextTick(() => {
        this.$refs.chooseInvoiceList.getInvoice(obj)
      })
    },

    // 关闭
    closeChooseInvoice () {
      this.chooseInvoiceVisible = false
    },

    // 选择返回的数据
    receivingAdministrator (val) {
      if (val && val.length > 0) {
        const patchOrderData = val[0]

        this.orderGoodsData.cep_patch_order_id = patchOrderData.id
        this.orderGoodsData.cep_order_store_id = patchOrderData.store_id

        this.linkTypeBufferData = val[0].linkTypeBufferData ? val[0].linkTypeBufferData : []

        this.orderGoodsData.cep_depot_name = patchOrderData.cep_depot_name ? patchOrderData.cep_depot_name : ''
        this.orderGoodsData.cep_depot_id = patchOrderData.cep_depot_id ? patchOrderData.cep_depot_id : ''
        // this.orderGoodsData.cep_link_id = patchOrderData.id
        this.orderGoodsData.cep_order_store_id = patchOrderData.store_id
        this.orderGoodsData.cep_depot_code = patchOrderData.cep_depot_code
        this.orderGoodsData.cep_total_purchase_num = patchOrderData.cep_total_purchase_num

        this.invoiceData = patchOrderData
      }
    },

    createOrderGoodsData () {
      const obj = {
        ...this.orderGoodsData
      }
      this.$store
        .dispatch('erpOrderGoods/createGoodsOrderData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '创建订货单成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })

            this.$nextTick(() => {
              this.$router.push({ name: 'addErpOrderGoods', query: { id: res.data.id } })
            })
          } else {
            this.$q.notify({
              message: '添加失败',
              caption: res.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    }
  }
}
</script>

<style>
.erp-add-table .cell-span-erp-add {
  background: white !important;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
