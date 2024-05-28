<template>
  <div>
    <q-btn unelevated color="primary" @click="editData" v-if="authorityMeta('edit')">修改</q-btn>
    <q-btn unelevated @click="confirmDeleteRecord" color="red" v-if="authorityMeta('del')" class="q-ml-sm">删除</q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgGoodsOperate',
  components: {},
  data () {
    return {
      dataId: '',
      disabledStatus: false
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
          message: `删除名称为 "${this.params.data.ces_name}"的供货商吗？`,
          cancel: true
        })
        .onOk(() => {
          const obj = [this.params.data.id]
          this.$store.dispatch('supplier/delData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除供货商!',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getSupplierList()
            }
          })
        })
        .onCancel(() => {})
    },
    authorityMeta (key) {
      return true
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
