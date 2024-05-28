<template>
  <div>
    <q-btn
      unelevated
      color="primary"
      @click="editData"
      v-if="authorityMeta('editGroup')"
      >修改</q-btn
    >
    <q-btn
      unelevated
      @click="confirmDeleteRecord"
      color="red"
      v-if="authorityMeta('delGroup')"
      class="q-ml-sm"
      >删除</q-btn
    >
  </div>
</template>
<script>
export default {
  name: 'AgErpOperate',
  data () {
    return {
      dataId: ''
    }
  },
  methods: {
    editData () {
      this.dataId = this.params.data.id
      this.$nextTick(() => {
        this.params.context.editData(this.dataId)
      })
    },
    confirmDeleteRecord () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `删除名称为 "${this.params.data.ecg_name}"的客户分组吗？`,
          cancel: true
        })
        .onOk(() => {
          const obj = [this.params.data.id]
          this.$store.dispatch('erpCustomerGroup/delData', obj).then(res => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除客户分组！',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getErpClientGroupList()
            }
          })
        })
        .onCancel(() => {})
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map(obj => {
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
