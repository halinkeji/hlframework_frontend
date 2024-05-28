<template>
  <div>

    <q-btn
      class="q-ma-xs"
      unelevated
      color="primary"
      icon="check"
      round
      size="sm"
      v-if="params.data.cep_status == 1 && authorityMeta('confirm')"
      :to="{ name: 'addErpcheck', query: { id: params.data.id } }"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">确定</q-tooltip>
    </q-btn>

    <q-btn
      class="q-ma-xs"
      unelevated
      color="primary"
      icon="add_to_queue"
      round
      size="sm"
      v-if="params.data.cep_status == 6 && authorityMeta('difference')"
      :to="{ name: 'addErpcheck', query: { id: params.data.id } }"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">生成差异表</q-tooltip>
    </q-btn>

    <q-btn
      class="q-ma-xs"
      unelevated
      color="red"
      icon="undo"
      round
      size="sm"
      v-if="params.data.cep_status == 2 && authorityMeta('cancel')"
      @click="cancelOrderConfirmData"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">取消</q-tooltip>
    </q-btn>

    <q-btn
      class="q-ma-xs"
      unelevated
      color="secondary"
      icon="check_box"
      round
      size="sm"
      v-if="params.data.cep_status == 2 && authorityMeta('audit')"
      :to="{ name: 'addErpcheck', query: { id: params.data.id } }"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">审核</q-tooltip>
    </q-btn>

    <q-btn
      class="q-ma-xs"
      unelevated
      color="positive"
      icon="check_box"
      round
      size="sm"
      v-if="params.data.cep_status == 5 && authorityMeta('hangup')"
      :to="{ name: 'addErpcheck', query: { id: params.data.id } }"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">挂起</q-tooltip>
    </q-btn>

    <q-btn class="q-ma-xs" unelevated color="info" v-if="authorityMeta('log')" icon="assignment" round size="sm" @click="showLog">
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">日志</q-tooltip>
    </q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgPdOperate',
  data () {
    return {}
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    // 取消确定 1
    cancelOrderConfirmData () {
      this.saveDataOperate('取消确定', -2)
    },

    // 作废  4
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
          message: text + '采购入库单, 是否继续?'
        })
        .onOk(() => {
          const obj = {
            check_order_id: this.params.data.id,
            cepStatus
          }
          this.$store
            .dispatch('erpCheck/changeCheckOrder', obj)
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
      return true
    }
  }
}
</script>
