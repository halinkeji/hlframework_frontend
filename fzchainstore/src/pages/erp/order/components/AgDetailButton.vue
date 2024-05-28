<template>
  <div v-if="!params.data.show_status">
    <q-btn
      class="q-ma-xs"
      color="primary"
      unelevated
      icon="check"
      round
      size="sm"
      v-if="params.data.id > 0 && params.data.cep_status == 1 && authorityMeta('detailConfirm')"
      :to="{ name: 'addOrderGoods', query: { id: params.data.id } }"
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
      v-if="params.data.id > 0 && params.data.cep_status == 2 && authorityMeta('detailCancel')"
      @click="updated"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">取消</q-tooltip>
    </q-btn>

    <q-btn
      class=" q-ma-xs"
      color="secondary"
      unelevated
      icon="check_box"
      round
      size="sm"
      v-if="params.data.id > 0 && params.data.cep_status == 2 && authorityMeta('detailAudit')"
      :to="{ name: 'addOrderGoods', query: { id: params.data.id } }"
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
      v-if="params.data.id > 0 && params.data.cep_status == 5 && authorityMeta('detailHangup')"
      :to="{ name: 'addOrderGoods', query: { id: params.data.id } }"
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
      v-if="params.data.cep_status < 2 && authorityMeta('detailClose')"
      @click="close"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">作废</q-tooltip>
    </q-btn>

    <q-btn class=" q-ma-xs" color="info" v-if="authorityMeta('detailLog')" unelevated icon="assignment" round size="sm" @click="showLog">
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">日志</q-tooltip>
    </q-btn>
    <q-btn
      class="q-ma-xs"
      color="info"
      unelevated
      icon="las la-link"
      round
      size="sm"
      v-if="params.data.patchGoodsOrderData  && authorityMeta('linkView')"
      :to="{ name: 'erpShowOrderDiffer', query: { order: params.data.id } }"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">差异单</q-tooltip>
    </q-btn>
  </div>
</template>

<script>
export default {
  name: 'AgDetailButton',
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
    updated () {
      const obj = {
        cep_status: 1,
        id: this.params.data.id
      }
      this.$store
        .dispatch('erpOrder/addData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '取消确定成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.params.context.getList()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    close () {
      this.$q
        .dialog({
          title: '确定',
          message: '确定关闭补货单吗？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            cep_status: 4,
            id: this.params.data.id
          }
          this.$store
            .dispatch('erpOrder/addData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '关闭补货单成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.params.context.getList()
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: error.message,
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
