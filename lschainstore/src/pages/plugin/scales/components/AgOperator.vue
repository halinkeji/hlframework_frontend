<template>
  <div>
    <q-btn
      color="primary"
      class=" q-mt-sm q-mx-sm"
      unelevated
      label="修改"
      v-if="authorityMeta('edit')"
      @click="showAdd"
    />
    <q-btn color="red" class=" q-mt-sm" unelevated label="删除" v-if="authorityMeta('del')" @click="confirmDeleteRecord" />
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
          message: `确定删除波特率为 ${this.params.data.psc_baud_rate} 的电子秤吗`,
          cancel: true
        })
        .onOk(() => {
          const obj = [this.dataId]
          this.$store
            .dispatch('scales/delData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '删除电子秤成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.params.context.getList()
              } else {
                this.$q.notify({
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '失败',
                  caption: '删除失败',
                  color: 'red'
                })
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
        })
        .onCancel(() => {})
    },
    showAdd () {
      this.params.context.showAdd(this.dataId)
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
