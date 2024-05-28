<template>
  <div class="row q-gutter-sm">
    <q-btn color="primary"  unelevated label="修改"  @click="getDataItem()" />
    <q-btn color="red" unelevated label="删除"  @click="confirmDeleteRecord()" />
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0

    }
  },
  mounted () {},
  computed: {

  },
  created () {

  },
  methods: {
    getDataItem () {
      this.params.context.setRuleData(this.params.data.id)
    },
    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除名称为 "${this.params.data.cr_name}" 的规则吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
          // console.log("到啦");
        })
        .onCancel(() => {})
    },
    deleteRecord () {
      this.$store
        .dispatch('clbank/deleteRuleData', [this.params.data.id])
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除规则成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.params.context.getList()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '错误',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
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
