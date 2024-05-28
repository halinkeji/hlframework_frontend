<template>
  <q-dialog v-model="isSidebarActiveLocal" persistent>
    <q-card
      class="q-pa-sm fit"
      :style="{
        width: this.$q.screen.width * 0.6 + 'px',
        'min-width': this.$q.screen.width * 0.6 + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <div class="row justify-center">
            <h6 class="no-margin">绑定物流单</h6>
            <q-space />
            <q-btn flat round dense icon="close" v-close-popup />
          </div>
        </div>
        <div class="col-shrink full-height bg-white">
          <div class="col-shrink bg-white q-pa-sm full-height">
            <q-form ref="dataFormRef">
              <div v-if="wuliuDataList.length > 0">
                <div class="row q-gutter-sm" v-for="(item, normIndex) in wuliuDataList" :key="normIndex">
                  <div class="col">
                    <q-input v-model="item.cep_barcode" outlined bottom-slots dense readonly label="装箱单据号" />
                  </div>
                  <div class="col">
                    <q-input v-model="item.cep_code" outlined bottom-slots dense readonly label="打包编号" />
                  </div>
                  <div class="col">
                    <q-input
                      v-model="item.cep_wuliu_name"
                      outlined
                      bottom-slots
                      dense
                      label="物流名称"
                      placeholder="请输入物流名称"
                      lazy-rules
                      :rules="[(val) => (val && val.length > 0) || '请输入物流名称']"
                    />
                  </div>
                  <div class="col">
                    <q-input
                      v-model="item.cep_wuliu_order"
                      outlined
                      bottom-slots
                      dense
                      label="物流单号"
                      lazy-rules
                      :rules="[(val) => (val && val.length > 0) || '请输入物流单号']"
                    />
                  </div>
                  <div class="col-5">
                    <q-input v-model="item.cep_wuliu_note" outlined bottom-slots dense label="物流备注" />
                  </div>
                </div>
              </div>
            </q-form>
          </div>
        </div>
        <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
          <q-btn label="保存" unelevated @click="saveDataSubmit" color="primary" class="q-px-xl" />
          <q-btn label="关闭" unelevated @click="isSidebarActiveLocal = false" color="grey" class="q-px-xl" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'ShowWuliuData',
  data () {
    return {
      isSidebarActiveLocal: true,
      logDataList: [],
      wuliuDataList: [],

      order_id: ''
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (orderId, outOrderId, field) {
      if (outOrderId > 0) {
        this.isSidebarActiveLocal = true

        this.outOrderId = outOrderId
        this.orderId = orderId
        this.field = field

        const obj = {
          outOrderId,
          orderId,
          field
        }
        this.$store
          .dispatch('erpPacking/getWuliuData', obj)
          .then((res) => {
            if (res.code == 200) {
              this.wuliuDataList = res.data ? res.data : []
            } else {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '操作失败',
                color: 'red'
              })
            }
          })
          .catch((err) => {
            this.$q.notify({
              message: '失败',
              caption: err.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
          })
      } else {
        this.$q.notify({
          message: '失败',
          caption: '获取包裹信息失败',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
      }
    },
    saveDataSubmit () {
      this.$refs.dataFormRef.validate().then(success => {
        if (success) {
          this.$store
            .dispatch('erpPacking/setWuliuData', {
              wuliuDataList: this.wuliuDataList,
              outOrderId: this.outOrderId
            })
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功关联' + (res.data || 0) + '条数据',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.closeDialog()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: '更新失败',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
              }
            })
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      })
    },
    closeDialog () {
      this.wuliuDataList = []

      this.isSidebarActiveLocal = false

      this.$emit('closeDialog')
    }

  }
}
</script>
