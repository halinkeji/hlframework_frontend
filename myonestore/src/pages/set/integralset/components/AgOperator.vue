<template>
  <div>
    <q-btn color="primary" class="q-mx-sm" unelevated label="修改" v-if="authorityMeta('edit')" @click="buttonShow" />
    <q-btn color="red" unelevated label="删除" v-if="authorityMeta('del')" @click="confirmDeleteRecord" />
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      dataId: 0,
      dialogShow: false,
      integralData: {}
    }
  },
  created () {
    this.dataId = this.params.data.id
    this.integralData = this.params.data
  },
  mounted () {},
  computed: {},
  methods: {
    confirmDeleteRecord () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除名为 ${this.params.data.ic_name} 的规则吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },
    deleteRecord () {
      const obj = [this.dataId]
      this.$store
        .dispatch('integralset/delData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除成功',
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
    },
    buttonShow () {
      this.params.context.editIntegralRule(this.params.data)
    },

    closeDialog () {
      this.$refs.integralDataRef.resetValidation()
    },
    authorityMeta (key) {
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
