<template>
  <div>
    <q-btn
      unelevated
      color="primary"
      v-if="authorityMeta('edit') && editStatus"
      @click="editData"
      >修改</q-btn
    >
    <q-btn
      unelevated
      @click="confirmDeleteRecord"
      v-if="authorityMeta('del') && editStatus"
      color="red"
      class="q-ml-sm"
      >删除</q-btn
    >
  </div>
</template>
<script>
export default {
  name: 'AgErpOperate',
  components: {},
  data () {
    return {
      dataId: '',
      editStatus: false
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {
    if (!this.is_main_store) {
      const accountInfo = this.$q.localStorage.getItem('myouka_account_info')
      if (accountInfo && accountInfo.lib_id && accountInfo.store_id) {
        if (parseInt(accountInfo.store_id) == parseInt(this.params.data.store_id)) {
          this.editStatus = true
        }
      }
    } else {
      this.editStatus = true
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
          message: `删除名称为 "${this.params.data.ecp_name}"的客户吗？`,
          cancel: true
        })
        .onOk(() => {
          const obj = [this.params.data.id]
          this.$store.dispatch('erpCustomer/delData', obj).then(res => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除客户！',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getErpClientList()
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
