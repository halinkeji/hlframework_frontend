<template>
  <div>
    <q-btn
      @click="showPopup()"
      color="primary"
      class="q-mr-sm"
      icon="create"
      rounded
      flat
    >
    </q-btn>
    <q-btn
      color="red"
      icon="delete_forever"
      flat
      rounded
      ref="buttonRefss"
      @click="confirmDeleteRecord()"
    ></q-btn>
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      params: [],
      dataId: '',
      delectPrompt: false
    }
  },

  mounted () {},
  created () {},
  computed: {},
  methods: {
    confirmDeleteRecord () {
      this.$q
        .dialog({
          title: '确定',
          message: `删除抬头名称为 "${this.params.data.prt_name}"的发票抬头吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
    },

    deleteRecord () {
      const obj = {
        id: this.params.data.id
      }
      this.$store.dispatch('receipt/delAll', obj).then(res => {
        if (res.code == 200) {
          this.$q.notify({
            message: '成功',
            caption: '成功删除发票抬头!',
            color: 'green',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
          this.params.context.getList()
        }
      })
    },

    showPopup () {
      this.dataId = this.params.data.id
      this.params.context.showPopup(this.dataId)
    }
  }
}
</script>
