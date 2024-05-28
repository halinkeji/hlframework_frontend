<template>
  <div>
    <q-btn class="q-ma-xs" color="primary" unelevated icon="ion-eye" round size="sm" @click="typeDetail" v-if="authorityMeta('typeView')">
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">查看明细</q-tooltip>
    </q-btn>
    <q-btn
      class=" q-ma-xs"
      color="secondary"
      unelevated
      icon="check_box"
      round
      size="sm"
      v-if="params.data.id > 0 && params.data.cep_status == 1 && authorityMeta('typeAudit')"

      :to="{ name: 'addOrderType', query: { id: params.data.id } }"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">审核</q-tooltip>
    </q-btn>
    <q-btn
      class="q-ma-xs"
      color="red"
      unelevated
      icon="close"
      round
      size="sm"
      v-if="params.data.id > 0 && params.data.cep_status == 1 && authorityMeta('typeClose')"
      @click="close"
    >
      <q-tooltip anchor="top middle" self="bottom middle" :offset="[10, 10]">作废</q-tooltip>
    </q-btn>
    <q-btn class=" q-ma-xs" color="info" v-if="authorityMeta('typeLog')" unelevated icon="assignment" round size="sm" @click="showLog">
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
    updated () {
      this.$q
        .dialog({
          title: '确定',
          message: '确定审核订货单吗？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            cep_status: 3,
            id: this.params.data.id
          }
          this.$store
            .dispatch('erpOrder/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '审核补货单成功',
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
    close () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: '确定关闭补货单吗',
          cancel: true
        })
        .onOk(() => {
          const obj = {
            cep_status: 4,
            id: this.params.data.id
          }
          this.$store
            .dispatch('erpOrder/setData', obj)
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
      this.params.context.showLogData(this.lowData.id)
    },
    typeDetail () {
      this.params.context.typeDetailData(this.lowData.id)
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
