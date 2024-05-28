<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card>
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2">新增调拨单</div>

        <q-space />
        <q-btn icon="close" @click="hideNowPage()" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section class="q-py-sm">
        <q-form ref="erpInRef" >
          <q-select
            outlined
            option-value="value"
            option-label="label"
            emit-value
            map-options
            v-model="turnData.cep_transfer_type"
            v-if="is_main_store"
            :disable="turnData.cep_transfer_in_depot_id ? true : false"
            @input="getDepotList"
            :options="options"
            dense
            label="调拨类型"
            bottom-slots
          />
          <q-select
            outlined
            dense
            v-model="turnData.cep_transfer_in_depot_id"
            :options="depotData"
            label="请选择调入仓库"
            option-value="id"
            option-label="cd_name"
            @input="selectDepot(turnData.cep_transfer_in_depot_id)"
            emit-value
            map-options
            :disable="turnData.cep_transfer_in_depot_id ? true : false"
            bottom-slots
          />
          <q-select
            outlined
            dense
            v-model="turnData.cep_transfer_out_depot_id"
            :options="depotData"
            label="请选择调出仓库"
            option-value="id"
            option-label="cd_name"
            @input="selectDepot(turnData.cep_transfer_out_depot_id)"
            emit-value
            map-options
            :disable="turnData.cep_transfer_out_depot_id ? true : false"
            v-if="is_main_store"
            bottom-slots
          />

          <q-select
            v-else
            outlined
            dense
            v-model="turnData.cep_transfer_out_depot_id"
            :options="depotOutData"
            label="请选择调出仓库"
            option-value="id"
            option-label="cd_name"
            @input="selectDepot(turnData.cep_transfer_out_depot_id)"
            emit-value
            map-options
            :disable="turnData.cep_transfer_out_depot_id ? true : false"
            bottom-slots
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
  name: 'CreateTransferDialog',
  components: {},
  data () {
    return {
      turnData: {
        cep_contract_number: '',
        cep_transfer_type: 1,
        cep_order_type: 1,
        cep_transfer_in_depot_id: '',
        cep_transfer_out_depot_id: '',
        cep_total_amount: '',
        cep_total_quantity: '',
        cep_note: '',
        cep_status: 1,
        cep_type: 18
      },
      options: [
        { label: '总仓', value: 1 },
        { label: '店仓', value: 2 }
      ],
      context: null,
      showDialog: false,
      supplierData: [],
      depotData: [],
      buyerData: []
    }
  },

  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {

  },
  mounted () {},
  methods: {
    init () {
      this.showDialog = true
      if (this.is_main_store) {
        this.turnData.cep_transfer_type = 1
      } else {
        this.turnData.cep_transfer_type = 2
      }
      this.getDepotList()
    },
    hideNowPage () {
      this.showDialog = false
      this.$emit('colseDialog')
    },

    getDepotList () {
      const obj = {
        type: this.turnData.cep_type
      }
      this.$store
        .dispatch('erpTransfer/getAllData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.depotData = res.data ? res.data : []
          } else {
            this.depotData = []
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

    selectDepot (val) {
      const data = this.depotData.findIndex(function (x) {
        return x.id == val
      })
      if (data > -1) {
        this.depotData[data].disable = true
      }
    },

    createPurchaseData () {
      const obj = {
        ...this.turnData
      }
      this.$store
        .dispatch('erpTransfer/createTransferOrder', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '创建调拨单成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })

            this.$nextTick(() => {
              this.$router.push({ name: 'addErpTransfer', query: { id: res.data.id } })
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
