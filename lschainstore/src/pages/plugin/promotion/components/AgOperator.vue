<template>
  <div>
    <q-btn
      color="primary"
      v-if="authorityMeta('edit')"
      class="q-mt-sm q-mx-sm"
      unelevated
      label="修改"
      :to="{ name: 'addPromotionConfig', query: { id: dataId } }"
    />
    <q-btn color="red" v-if="authorityMeta('del')" class="q-mt-sm" unelevated label="删除" @click="deleteConfig()" />
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
  mounted () {},
  computed: {},
  created () {
    this.dataId = this.params.data.id
  },
  methods: {
    deleteConfig () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除名称为 "${this.params.data.ppi_name}" 的模板吗`,
          cancel: true
        })
        .onOk(() => {
          this.realDelete()
        })
    },
    realDelete () {
      this.$store
        .dispatch('promotion/delData', [this.dataId])
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除运费模板',
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
      return true
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
