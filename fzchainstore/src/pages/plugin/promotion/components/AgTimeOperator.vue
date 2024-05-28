<template>
  <div>
    <q-btn color="primary" v-if="authorityMeta('edit')" class="q-mt-sm q-mx-sm" unelevated label="修改" @click="updateConfig()" />
    <q-btn color="red" v-if="authorityMeta('del')" class="q-mt-sm" unelevated label="删除" @click="deleteConfig()" />
  </div>
</template>

<script>
export default {
  name: 'AgTimeOperator',
  data () {
    return {
      dataId: 0
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.dataId = this.params.data.id
  },
  methods: {
    updateConfig () {
      this.dataId = this.params.data.id
      this.params.context.addTime(this.dataId)
    },
    deleteConfig () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除名称为 "${this.params.data.ppt_name}" 的模板吗`,
          cancel: true
        })
        .onOk(() => {
          this.realDelete()
        })
    },
    realDelete () {
      this.$store
        .dispatch('promotion/delTimeData', [this.dataId])
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除促销档期',
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
            message: '失败',
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
