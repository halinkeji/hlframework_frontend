<template>
  <div>
    <q-btn
      flat
      rounded
      color="primary"
      class="q-mr-sm"
      icon="create"
      @click="showKzlsDetail()"
    />
    <q-btn flat rounded color="red" icon="delete_forever" @click="del" />
  </div>
</template>
<script>
export default {
  name: 'AgOperate',
  components: {},
  data () {
    return {
      dataId: ''
    }
  },
  methods: {
    showKzlsDetail () {
      this.dataId = this.params.data.id
      this.params.context.showAddDetail(this.dataId)
    },
    showPopup () {
      this.dataId = this.params.data.id
      this.params.context.showPopup(this.dataId)
    }, // 显示弹窗方法

    del () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${this.params.data.pki_name}"的开支项吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            id: this.params.data.id
          }
          this.$store.dispatch('commonKzls/delAll', obj).then(res => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除开支项!',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getList()
            }
          })
        })
    }
  }
}
</script>
