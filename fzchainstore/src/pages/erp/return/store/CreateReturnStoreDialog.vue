<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card>
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2">新增退货单</div>

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
              v-model="storeReturnData.cep_order_store_id"
              :options="libInStoreList"
              dense
              label="退货店铺"
              lazy-rules
              :disable="storeReturnData.cep_order_store_id ? true : false"
              :rules="[(val) => !!val || '请选择退货店铺']"
            />
          </div>
          <div>
            <q-select
              outlined
              option-value="id"
              option-label="cd_name"
              emit-value
              map-options
              v-model="storeReturnData.cep_depot_id"
              :options="depotData"
              @input="selectDepot"
              dense
              :disable="storeReturnData.cep_depot_id ? true : false"
              label="请选择接收仓库"
              lazy-rules
              :rules="[(val) => !!val || '请选择接收仓库']"
            />
          </div>
        </q-form>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn unelevated label="确认" class="q-px-xl" color="primary" @click="createPurchaseData" />
        <q-btn unelevated label="关闭" class="q-ml-sm q-px-xl" color="grey" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'CreateReturnStoreDialog',
  components: {},
  data () {
    return {
      storeReturnData: {
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
        cep_type: 10,
        cep_order_store_id: ''
      },

      context: null,
      showDialog: false,
      supplierData: [],
      depotData: [],
      libInStoreList: []
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
        this.getDepotList()
      } else {
        this.getDepot(1)
        const accountInfo = this.$q.localStorage.getItem('fzchainstore_account_info')
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
        .dispatch('clothingDepot/getAllData')
        .then((res) => {
          if (res.code == 200) {
            this.depotData = res.data ? res.data : []
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
    getDepot (val) {
      const obj = {
        type: val
      }
      this.$store
        .dispatch('erpTransfer/getAllData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.depotData = res.data ? res.data : []
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
      if (that.storeReturnData.cep_depot_id > 0) {
        const data = that.depotData.find(function (x) {
          return x.id == that.storeReturnData.cep_depot_id
        })
        that.storeReturnData.cep_depot_code = data.cd_code
        that.storeReturnData.cep_depot_name = data.cd_name
      }
    },

    createPurchaseData () {
      const obj = {
        ...this.storeReturnData
      }
      this.$store
        .dispatch('erpStoreReturn/createReturnStoreOrder', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '创建退货单成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })

            this.$nextTick(() => {
              this.$router.push({ name: 'addStoreReturn', query: { id: res.data.id } })
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
    },

    // 格式化数据
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

<style>
.erp-add-table .cell-span-erp-add {
  background: white !important;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
