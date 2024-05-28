<template>
  <div v-if="!params.data.show_status">
    <q-btn
      class="q-ma-xs"
      color="primary"
      unelevated
      icon="check"
      round
      size="sm"
      v-if="params.data.cep_status == 1 && authorityMeta('confirm')"
      :to="{ name: 'addPurchaseIn', query: { id: params.data.id } }"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">确定</q-tooltip>
    </q-btn>

    <q-btn
      class="q-ma-xs"
      color="red"
      unelevated
      icon="undo"
      round
      size="sm"
      v-if="params.data.cep_status == 2 && authorityMeta('save')"
      @click="cancelOrderConfirmData"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">取消确定</q-tooltip>
    </q-btn>

    <q-btn
      class="q-ma-xs"
      color="secondary"
      unelevated
      icon="check_box"
      round
      size="sm"
      v-if="params.data.cep_status == 2 && authorityMeta('audit')"
      :to="{ name: 'addPurchaseIn', query: { id: params.data.id } }"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">审核</q-tooltip>
    </q-btn>
    <q-btn
      class="q-ma-xs"
      color="positive"
      unelevated
      icon="check_box"
      round
      size="sm"
      v-if="params.data.cep_status == 5 && authorityMeta('hangup')"
      :to="{ name: 'addPurchaseIn', query: { id: params.data.id } }"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">恢复</q-tooltip>
    </q-btn>
    <q-btn
      class="q-ma-xs"
      color="red"
      unelevated
      icon="close"
      round
      size="sm"
      v-if="params.data.cep_status < 2 && authorityMeta('close')"
      @click="closeOrderData"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">关闭  </q-tooltip>
    </q-btn>
    <q-btn
      class="q-ma-xs"
      unelevated
      color="indigo"
      icon="las la-reply"
      round
      size="sm"
      v-if="params.data.cep_status == 3 && authorityMeta('revoke')"
      :to="{ name: 'addPurchaseIn', query: { id: params.data.id } }"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">取消审核</q-tooltip>
    </q-btn>
    <q-btn class=" q-ma-xs" color="info" v-if="authorityMeta('log')" unelevated icon="assignment" round size="sm" @click="showLog">
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">日志</q-tooltip>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'AgButton',
  data () {
    return {
      lowData: ''
    }
  },
  created () {
    this.lowData = this.params.data
  },
  mounted () {},
  computed: {},
  methods: {

    cancelOrderConfirmData () {
      this.saveDataOperate('取消确定', -2)
    },

    closeOrderData () {
      this.saveDataOperate('作废', 4)
    },

    saveDataOperate (text, cepStatus) {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          cancel: true,
          message: text + '采购单, 是否继续?'
        })
        .onOk(() => {
          const obj = {
            purchase_order_id: this.params.data.id,
            cepStatus
          }
          this.$store
            .dispatch('erpPurchase/setChangePurchaseOrder', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: text + '成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.params.context.getList()
                })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
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
        })
    },

    showLog () {
      this.params.context.showLogData(this.params.data.id)
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
