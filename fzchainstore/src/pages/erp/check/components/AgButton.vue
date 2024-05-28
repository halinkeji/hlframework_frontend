<template>
  <div>
    <q-btn unelevated color="red" flat icon="delete_forever" @click="confirmDeleteRecord" v-if="params.data.ecd_archives_id">
      <q-tooltip>
        删除
      </q-tooltip>
    </q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgButton',
  data () {
    return {}
  },
  computed: {},
  created () {},
  mounted () {},
  methods: {
    confirmDeleteRecord () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `删除名称为 "${this.params.data.ecd_archives_name}"的商品吗？`,
          cancel: true
        })
        .onOk(() => {
          this.$store.dispatch('erpCheck/delData', this.params.data.id).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '删除成功!',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getList()
            }
          })
        })
        .onCancel(() => {})
        .onDismiss(() => {})
    }
  }
}
</script>
