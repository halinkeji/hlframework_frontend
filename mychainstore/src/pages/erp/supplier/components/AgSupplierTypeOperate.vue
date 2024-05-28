<template>
  <div>
    <q-btn
      color="primary"
      unelevated
      @click="editData"
      v-if="authorityMeta('editType')"
      >修改</q-btn
    >
    <q-btn
      @click="confirmDeleteRecord"
      unelevated
      color="red"
      v-if="authorityMeta('delType')"
      class="q-ml-sm"
      >删除</q-btn
    >
  </div>
</template>
<script>
export default {
  name: 'AgGoodsOperate',
  data () {
    return {
      dataId: ''
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {

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
          message: `删除名称为 "${this.params.data.gst_name}"的供货商分类吗？`,
          cancel: true
        })
        .onOk(() => {
          const obj = [this.params.data.id]
          this.$store.dispatch('supplierType/delData', obj).then(res => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除供货商分类！',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getGoodsSupplierTypeList()
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
