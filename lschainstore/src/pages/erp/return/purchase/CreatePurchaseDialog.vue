<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card>
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2">新增采购单</div>

        <q-space />
        <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-py-sm">
        <q-form ref="erpInRef">
          <q-select
            outlined
            v-model="erpReturnData.cep_supplier_id"
            :options="supplierData"
            option-value="id"
            option-label="ces_name"
            option-disable="inactive"
            @input="selectSupplier"
            emit-value
            map-options
            dense
            label="- - - 请选择供货商 - - -"
            :disable="erpReturnData.cep_supplier_id ? true : false"
            lazy-rules
            :rules="[(val) => !!val || '请选择供货商']"
          />

          <q-select
            outlined
            option-value="id"
            option-label="cd_name"
            emit-value
            map-options
            v-model="erpReturnData.cep_depot_id"
            :options="depotData"
            :disable="erpReturnData.cep_depot_id ? true : false"
            @input="selectDepot"
            dense
            label="- - -请选择退货仓库 - - -"
            lazy-rules
            :rules="[(val) => !!val || '请选择仓库']"
          />
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
  name: 'CreatePurchaseDialog',
  components: {},
  data () {
    return {
      erpReturnData: {
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
        cep_depot_code: '',
        cep_depot_name: '',
        cep_if_pack: '2',
        cep_status: 1,
        cep_type: 9
      },

      context: null,
      showDialog: false,
      supplierData: [],
      depotData: [],
      buyerData: []
    }
  },

  computed: {},
  created () {},
  mounted () {},
  methods: {
    init () {
      this.showDialog = true
      this.getSupplierList()
      this.getDepotList()
    },
    hideNowPage () {
      this.showDialog = false
      this.$emit('colseDialog')
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
    getSupplierList () {
      this.$store
        .dispatch('supplier/getSupp')
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
      if (that.erpReturnData.cep_supplier_id > 0) {
        const data = that.supplierData.find(function (x) {
          return x.id == that.erpReturnData.cep_supplier_id
        })
        that.erpReturnData.cep_supplier_code = data.ces_number
        that.erpReturnData.cep_supplier_name = data.ces_name
        that.erpReturnData.cep_pay_type = data.ces_pay_type
      }
    },
    selectDepot () {
      const that = this
      if (that.erpReturnData.cep_depot_id > 0) {
        const data = that.depotData.find(function (x) {
          return x.id == that.erpReturnData.cep_depot_id
        })
        that.erpReturnData.cep_depot_code = data.cd_code
        that.erpReturnData.cep_depot_name = data.cd_name
      }
    },

    createPurchaseData () {
      const obj = {
        ...this.erpReturnData
      }
      this.$store
        .dispatch('erpPurchaseReturn/createReturnPurchaseOrder', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '创建采购退货单成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })

            this.$nextTick(() => {
              this.$router.push({ name: 'addPurchaseReturn', query: { id: res.data.id } })
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
    },

    authorityMeta (key) {
      // if (this.$route.meta) {
      //   const new_arr = this.$route.meta.map((obj) => {
      //     return obj.id;
      //   });
      //   if (new_arr.indexOf(key) >= 0) {
      //     return true;
      //   }
      // }
      // return false;
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
