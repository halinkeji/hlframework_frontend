<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: $q.screen.width * 0.3 + 'px',
        'min-width': $q.screen.width * 0.3 + 'px',
      }"
    >
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2">新增直采单</div>

        <q-space />
        <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-py-sm">
        <q-form ref="erpInRef">
          <div v-if="is_main_store">
            <q-select
              outlined
              option-value="id"
              option-label="name"
              emit-value
              map-options
              v-model="directData.cep_order_store_id"
              :options="libInStoreList"
              dense
              label="直采店铺"
              lazy-rules
              :disable="directData.cep_order_store_id ? true : false"
              :rules="[(val) => !!val || '请选择直采店铺']"
            />
          </div>
          <div>
            <q-select
              outlined
              option-value="id"
              option-label="cd_name"
              emit-value
              map-options
              v-model="directData.cep_depot_id"
              :disable="directData.cep_depot_id ? true : false"
              :options="depotData"
              @input="selectDepot"
              dense
              label="请选择仓库"
              lazy-rules
              :rules="[(val) => !!val || '请选择仓库']"
            />
          </div>
          <div>
            <q-select
              outlined
              v-model="directData.cep_supplier_id"
              :options="supplierData"
              option-value="id"
              option-label="ces_name"
              option-disable="inactive"
              @input="selectSupplier"
              emit-value
              map-options
              dense
              label="请选择供货商"
              :disable="directData.cep_supplier_id ? true : false"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn unelevated label="确认" class="q-px-xl" color="primary" @click="createOrderGoodsData" />
        <q-btn unelevated label="关闭" class="q-ml-sm q-px-xl" color="grey" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'CreateOrderDialog',
  components: {},
  data () {
    return {
      directData: {
        cep_fold_clause: 0,
        cep_real_pay_amount: 0,
        cep_discount_amount: 0,
        cep_total_purchase_num: 0,
        cep_total_purchase_amount: 0,
        cep_supplier_id: '',
        cep_note: '',
        cep_pay_type: '',
        cep_supplier_name: '',
        cep_supplier_code: '',
        cep_depot_id: '',
        cep_depot_code: '',
        cep_depot_name: '',
        cep_status: 1,
        cep_type: 14,
        cep_order_store_id: ''
      },

      showDialog: false,
      depotData: [],
      libInStoreList: [],
      supplierData: []
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

      if (this.is_main_store) {
        this.getLibInStoreData()
      } else {
        const accountInfo = this.$q.localStorage.getItem('fzchainstore_account_info')
        if (accountInfo) {
          this.directData.cep_order_store_id = accountInfo.store_id
        }
      }

      this.getSupplierList()
      this.getDepotList()
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
        .dispatch('clothingDepot/getAllData')
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
      if (that.directData.cep_depot_id > 0) {
        const data = that.depotData.find(function (x) {
          return x.id == that.directData.cep_depot_id
        })
        that.directData.cep_depot_code = data.cd_code
        that.directData.cep_depot_name = data.cd_name
      }
    },

    getSupplierList () {
      this.$store
        .dispatch('clothingSupplier/getSupp')
        .then((res) => {
          if (res.code == 200) {
            this.supplierData = res.data ? res.data : []
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

    selectSupplier () {
      const that = this
      if (that.directData.cep_supplier_id > 0) {
        const data = that.supplierData.find(function (x) {
          return x.id == that.directData.cep_supplier_id
        })
        that.directData.cep_supplier_code = data.ces_number
        that.directData.cep_supplier_name = data.ces_name
        that.directData.cep_pay_type = data.ces_pay_type
      }
    },

    hideNowPage () {
      this.showDialog = false
      this.$emit('colseDialog')
    },

    createOrderGoodsData () {
      const obj = {
        ...this.directData
      }
      this.$store
        .dispatch('erpDirect/createDirectOrderData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '创建订货单成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })

            this.$nextTick(() => {
              this.$router.push({ name: 'addErpDirect', query: { id: res.data.id } })
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
