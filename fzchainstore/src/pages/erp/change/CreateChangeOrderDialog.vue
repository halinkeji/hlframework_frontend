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
            option-value="id"
            option-label="cd_name"
            emit-value
            map-options
            v-model="changeFormData.cep_depot_id"
            :disable="changeFormData.cep_depot_id ? true : false"
            :options="depotData"
            @input="selectDepot"
            dense
            label="请选择仓库"
            lazy-rules
            :rules="[(val) => !!val || '请选择仓库']"
          />
          <q-select
            outlined
            option-value="id"
            option-label="ect_name"
            emit-value
            map-options
            v-model="changeFormData.cep_change_type_id"
            :disable="changeFormData.cep_status < 2 ? false : true"
            :options="changeTypData"
            dense
            label="请选择调整状态"
            lazy-rules
            :rules="[(val) => !!val || '请选择调整状态']"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn unelevated label="确认" class="q-px-xl" :disable="saveDisable" color="primary" @click="createOrderData" />
        <q-btn unelevated label="关闭" class="q-ml-sm q-px-xl" color="grey" v-close-popup />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'CreateChangeOrderDialog',
  components: {},
  data () {
    return {
      changeFormData: {
        cep_depot_id: '',
        cep_change_type_id: '',
        cep_depot_code: '',
        cep_depot_name: '',
        cep_status: 1,
        cep_total_purchase_num: '',
        cep_total_shipments_quantity: '',
        cep_type: 13
      },

      context: null,
      showDialog: false,
      supplierData: [],
      depotData: [],
      changeTypData: [],
      saveDisable: false
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
      this.getChangeTypeList()
      if (this.is_main_store) {
        this.getDepotAllList()
      } else {
        this.getDepotList()
      }
    },
    hideNowPage () {
      this.showDialog = false
      this.$emit('colseDialog')
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
    getDepotAllList () {
      this.$store
        .dispatch('clothingDepot/getAllListData')
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
    getChangeTypeList () {
      this.$store
        .dispatch('erpChangeType/getAllData')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.changeTypData = res.data
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
      if (that.changeFormData.cep_depot_id > 0) {
        const data = that.depotData.find(function (x) {
          return x.id == that.changeFormData.cep_depot_id
        })
        that.changeFormData.cep_depot_code = data.cd_code
        that.changeFormData.cep_depot_name = data.cd_name
      }
    },

    createOrderData () {
      this.saveDisable = true
      const obj = {
        ...this.changeFormData
      }
      this.$store
        .dispatch('erpchange/createChangeOrderData', obj)
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
              this.$router.push({ name: 'addErpChange', query: { id: res.data.id } })
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
            this.saveDisable = false
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '添加失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
          this.saveDisable = false
        })
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
