<template>
  <div class="row q-gutter-sm">
    <q-btn color="primary" unelevated v-if="authorityMeta('edit')" label="修改" @click="editRechargePackage" />
    <q-btn color="red" unelevated v-if="authorityMeta('del')" label="删除" @click="confirmDeleteRecord" />
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
  created () {},
  mounted () {},
  computed: {},
  methods: {
    confirmDeleteRecord () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除名称为 ${this.params.data.rp_name} 的充值套餐吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },
    deleteRecord () {
      const obj = [this.params.data.id]
      this.$store
        .dispatch('rechargepackages/delData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除充值套餐成功',
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
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    editRechargePackage () {
      this.params.context.addRechargePackage(this.params.data.id)
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
