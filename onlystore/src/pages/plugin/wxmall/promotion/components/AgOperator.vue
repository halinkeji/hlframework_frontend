<template>
  <div>
    <q-btn color="primary" class="q-mt-sm q-mx-sm" unelevated label="修改" v-if="authorityMeta('edit')" @click="getGoodsNormalList()" />
    <q-btn color="red" class="q-mt-sm" unelevated label="删除" v-if="authorityMeta('del')" @click="confirmDeleteRecord()" />
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
  computed: {},
  created () {
    this.dataId = this.params.data.id
  },
  methods: {
    getGoodsNormalList () {
      this.dataId = this.params.data.id
      this.params.context.addNewData(this.dataId)
    },
    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除标题为 "${this.params.data.wpi_name}" 的促销规则吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },
    deleteRecord () {
      this.$store
        .dispatch('wxMallPromotion/delData', this.dataId)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除促销规则成功',
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
