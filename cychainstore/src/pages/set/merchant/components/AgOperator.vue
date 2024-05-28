<template>
  <div>
    <q-btn color="primary"  unelevated label="修改" @click="openEditDialog" />
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      dataId: 0
    }
  },
  created () {
    this.dataId = this.params.data.id
  },
  mounted () {},
  computed: {},
  methods: {
    confirmDeleteRecord () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除名称为 ${this.params.data.name} 的商户吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },
    openEditDialog () {
      this.params.context.openEditDialog(this.params.data.id)
    },
    deleteRecord () {
      const obj = [this.dataId]
      this.$store
        .dispatch('merchant/delData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除商户成功',
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
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            message: '失败',
            caption: error.message,
            color: 'red'
          })
        })
    }
  }
}
</script>
