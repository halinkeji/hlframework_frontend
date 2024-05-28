<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white full-height ">
      <q-scroll-area class="fit full-height">
        <q-form ref="invoiceDataRef" class="q-gutter-md row">
          <q-card flat class="bg-white q-pa-md col-6">
            <q-list separator bordered padding>
              <q-item>
                <q-item-section>
                  <q-item-label>开启ERP仓库功能</q-item-label>
                  <q-item-label caption>默认关闭，开启后，在操作ERP相关功能内可以进行仓库选择。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle
                    color="green"
                    @input="handleSwitchChange(baseConfigData.erp_erp_depotStatus, 'erp_erp_depotStatus')"
                    v-model="baseConfigData.erp_erp_depotStatus"
                    true-value="1"
                    false-value="0"
                  />
                </q-item-section>
              </q-item>

              <q-item v-if="baseConfigData.erp_erp_depotStatus">
                <q-item-section>
                  <q-item-label>设置零售默认仓</q-item-label>
                  <q-item-label caption>默认为空，设置后，在零售出库时默认扣除所选仓库内的库存</q-item-label>
                </q-item-section>
                <q-item-section >
                  <q-select outlined :disable="parseInt(baseConfigData.erp_erp_depotStatus) == 1 ? false : true" v-model="baseConfigData.erp_erp_defaultDepot" label="请选择默认仓" clearable @input="handleSwitchChange(baseConfigData.erp_erp_defaultDepot, 'erp_erp_defaultDepot')" class="full-width" :options="depotData" option-value="id" option-label="ed_name" emit-value map-options dense />
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </q-form>
      </q-scroll-area>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ErpSet',
  data () {
    return {
      baseConfigData: {
        erp_erp_depotStatus: '0',
        erp_erp_defaultDepot: ''
      },
      depotData: []
    }
  },
  components: {},
  mounted () {
    this.getDepotList()
    this.getConsumeSet()
  },

  computed: {},
  methods: {
    getDepotList () {
      this.$store
        .dispatch('erpdepot/getAllData')
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
    getConsumeSet () {
      const obj = {
        name: 'erp'
      }
      this.$store
        .dispatch('settings/getErpSet', obj)
        .then((res) => {
          if (res.code == 200) {
            this.baseConfigData = res.data ? res.data : {}
          }
        })
        .catch((error) => {})
    },
    handleSwitchChange (val, keyName) {
      const obj = {}
      obj[keyName] = val
      if (keyName == 'erp_erp_depotStatus' && parseInt(val) == 0) {
        obj.erp_erp_defaultDepot = ''
      }

      this.$store
        .dispatch('settings/addErpSet', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '保存成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right',
              timeout: 500
            })
            this.getConsumeSet()
          }
        })
        .catch((error) => {})
    }
  }
}
</script>
