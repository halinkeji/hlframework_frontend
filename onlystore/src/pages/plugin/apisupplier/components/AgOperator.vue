<template>
  <div class="q-gutter-sm">
    <q-btn color="primary" unelevated label="修改" @click="getGoodsNormalList()" />
    <q-btn color="red" unelevated label="删除" @click="confirmDeleteRecord()" />
    <q-btn color="warning" unelevated label="执行" @click="runApiRequest()" />
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

    runApiRequest () {
      this.$store
        .dispatch('apisupplier/runApiRequest', {
          apiId: this.dataId
        })
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '执行成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.params.context.getList()
          } else {
            this.$q.notify({
              message: '错误',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
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

    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除名称为 "${this.params.data.name}" 的供应商吗`,
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
        .dispatch('apisupplier/delData', [this.dataId])
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除供应商成功',
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
