<template>
  <div>
    <q-btn color="red" class="q-mt-sm" unelevated label="删除" @click="confirmDeleteRecord()" />
  </div>
</template>

<script>
export default {
  name: 'Operator',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0
    }
  },
  created () {
    this.dataId = this.params.data.id
  },
  methods: {
    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: '确定删除此条发送记录吗',
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },
    deleteRecord () {
      this.$store
        .dispatch('alSms/delData', { id: this.dataId })
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.params.context.getListData()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: 'Error',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    }
  }
}
</script>
