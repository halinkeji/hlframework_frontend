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
          <div v-if="is_main_store">
            <q-select
              outlined
              option-value="id"
              option-label="name"
              emit-value
              map-options
              v-model="orderData.cep_order_store_id"
              :options="libInStoreList"
              dense
              @input="getStoreCredit"
              label="订货店铺"
              lazy-rules
              :disable="orderData.cep_order_store_id ? true : false"
              :rules="[(val) => !!val || '请选择订货店铺']"
            />
          </div>

          <q-select
            outlined
            option-value="id"
            option-label="cd_name"
            emit-value
            map-options
            v-model="orderData.cep_depot_id"
            :options="depotData"
            @input="selectDepot"
            dense
            :disable="orderData.cep_depot_id ? true : false"
            label="请选择仓库"
            lazy-rules
            :rules="[(val) => !!val || '请选择仓库']"
          />

        </q-form>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn unelevated label="确认" class="q-px-xl" color="primary" @click="createorderData" />
        <q-btn unelevated label="关闭" class="q-ml-sm q-px-xl" color="grey" v-close-popup />
      </q-card-actions>

    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: 'CreateOrderDialog',
  components: {

  },
  data () {
    return {
      orderData: {
        cep_depot_id: '',
        cep_note: '',
        cep_depot_code: '',
        cep_depot_name: '',
        cep_status: 1,
        cep_type: 21,
        cep_order_store_id: ''
      },
      storeCreditData: {},

      showDialog: false,
      depotData: [],
      libInStoreList: [],
      chooseInvoiceVisible: false,
      typeData: []
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
          this.orderData.cep_order_store_id = accountInfo.store_id
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
      if (that.orderData.cep_depot_id > 0) {
        const data = that.depotData.find(function (x) {
          return x.id == that.orderData.cep_depot_id
        })
        that.orderData.cep_depot_code = data.cd_code
        that.orderData.cep_depot_name = data.cd_name
      }
    },

    getStoreCredit () {
      // const obj = {
      //   store: this.orderData.store_id
      // }
      this.$store
        .dispatch('storeCredit/getItemData', this.orderData.cep_order_store_id)
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

    createorderData () {
      this.$refs.erpInRef.validate().then(success => {
        if (success) {
          const obj = {
            ...this.orderData
          }
          this.$store
            .dispatch('erpOrder/createDetailOrderData', obj)
            .then((res) => {
              if (res.code == 200 && res.data) {
                this.$q.notify({
                  color: 'green',
                  message: '成功',
                  caption: '创建补货单成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })

                this.$router.push({ name: 'addOrderGoods', query: { id: res.data.id } })

                // this.hideNowPage()
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
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      })
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
