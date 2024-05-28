<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card>
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2">新增采购单</div>

        <q-space />
        <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-py-sm">
        <q-form ref="erpInRef" >
          <q-select
            outlined
            v-model="erpInFormData.cep_buyer_id"
            :options="buyerData"
            option-value="id"
            option-label="ceb_name"
            option-disable="inactive"
            emit-value
            map-options
            dense
            label="请选择采购员"
            @input="selectBuyer"
            lazy-rules
            :rules="[(val) => !!val || '请选择采购员']"
          />
          <q-select
            outlined
            v-model="erpInFormData.cep_supplier_id"
            :options="supplierData"
            option-value="id"
            option-label="ces_name"
            option-disable="inactive"
            @input="selectSupplier"
            emit-value
            map-options
            dense
            label="请选择供货商"
            lazy-rules
            :rules="[(val) => !!val || '请选择供货商']"
          />
          <q-select
            outlined
            option-value="value"
            option-label="label"
            emit-value
            map-options
            v-model="erpInFormData.cep_pay_type"
            :options="options"
            dense
            label="结算方式"
            :rules="[(val) => !!val || '请选择结算方式']"
          />
          <q-select
            outlined
            option-value="id"
            option-label="cd_name"
            emit-value
            map-options
            v-model="erpInFormData.cep_depot_id"
            :options="depotData"
            @input="selectDepot"
            dense
            label="请选择仓库"
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
      erpInFormData: {
        cep_fold_clause: 0,
        cep_real_pay_amount: 0,
        cep_discount_amount: 0,
        cep_total_purchase_num: 0,
        cep_total_purchase_amount: 0,
        cep_supplier_id: '',
        cep_note: '',
        cep_pay_type: '1',
        cep_supplier_name: '',
        cep_supplier_code: '',
        cep_depot_code: '',
        cep_depot_name: '',
        cep_buyer_id: '',
        cep_buyer_name: '',
        cep_if_pack: '2',
        cep_status: 1,
        cep_type: 1
      },
      options: [
        {
          label: '账期',
          value: '1'
        },
        {
          label: '现结',
          value: '2'
        }
      ],
      context: null,
      showDialog: false,
      supplierData: [],
      depotData: [],
      buyerData: []
    }
  },

  computed: {},
  created () {

  },
  mounted () {},
  methods: {
    init () {
      this.showDialog = true
      this.getBuyerList()
      this.getSupplierList()
      this.getDepotList()
    },
    hideNowPage () {
      this.showDialog = false
      this.$emit('colseDialog')
    },

    getBuyerList () {
      const obj = {
        status: 1
      }
      this.$store
        .dispatch('erpBuyer/getAllData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.buyerData = res.data
            }
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

    selectBuyer () {
      const that = this
      if (that.erpInFormData.cep_buyer_id > 0) {
        const data = that.buyerData.find(function (x) {
          return x.id == that.erpInFormData.cep_buyer_id
        })
        that.erpInFormData.cep_buyer_name = data.ceb_name
      }
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
      if (that.erpInFormData.cep_supplier_id > 0) {
        const data = that.supplierData.find(function (x) {
          return x.id == that.erpInFormData.cep_supplier_id
        })
        that.erpInFormData.cep_supplier_code = data.ces_number
        that.erpInFormData.cep_supplier_name = data.ces_name
        that.erpInFormData.cep_pay_type = data.ces_pay_type
      }
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
      if (that.erpInFormData.cep_depot_id > 0) {
        const data = that.depotData.find(function (x) {
          return x.id == that.erpInFormData.cep_depot_id
        })
        that.erpInFormData.cep_depot_code = data.cd_code
        that.erpInFormData.cep_depot_name = data.cd_name
      }
    },

    createPurchaseData () {
      const obj = {
        ...this.erpInFormData
      }
      this.$store
        .dispatch('erpPurchase/createPurchaseOrder', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '创建采购单成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })

            this.$nextTick(() => {
              this.$router.push({ name: 'addPurchaseIn', query: { id: res.data.id } })
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
