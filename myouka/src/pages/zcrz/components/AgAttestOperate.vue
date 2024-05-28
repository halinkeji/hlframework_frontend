<template>
  <div class="q-gutter-sm">
    <q-btn color="primary" @click="editData" unelevated label="编辑" />
    <q-btn color="primary" unelevated label="审核" @click="verifyData" />
    <q-btn color="red" unelevated label="删除" @click="confirmDeleteRecord" />
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
          message: `确定删除名姓名为 ${this.params.data.zi_name} 的认证信息吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },
    deleteRecord () {
      this.$store
        .dispatch('zcrz/delInfoData', this.dataId)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除信息成功',
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
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    verifyData () {
      this.$nextTick(() => {
        this.params.context.verifyAttest(this.params.data)
      })
    },

    editData () {
      this.$nextTick(() => {
        this.params.context.addNewData(this.params.data.id)
      })
    }
  }
}
</script>
