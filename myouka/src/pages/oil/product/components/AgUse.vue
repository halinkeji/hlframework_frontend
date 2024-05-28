<template>
  <div>
    <div class="row q-gutter-sm">
      <q-btn
        unelevated
        color="primary"
        label="修改"
        v-if="authorityMeta('edit')"
        @click="addProduckDialog(dataId)"
      />
      <q-btn unelevated color="red" class="q-mt-sm" label="删除" v-if="authorityMeta('del') && delStatus(params.data)" @click="deleteData()" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'AgUse',
  data () {
    return {
      dataId: 0
    }
  },
  mounted () {},
  created () {
    this.dataId = this.params.data.id
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    delStatus (params) {
      // 判断当前是否总站  总站可编辑删除所有
      if (this.is_main_store) {
        return true
      }
      const accountInfo = this.$q.localStorage.getItem('myouka_account_info')
      if (accountInfo.store_id == params.store_id) {
        return true
      }

      return false
    },

    addProduckDialog (productId) {
      this.$nextTick(() => {
        this.params.context.addProduckDialog(productId)
      })
    },
    deleteData () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除名称为 "${this.params.data.op_name}" 的油品信息吗`,
          cancel: true
        })
        .onOk(() => {
          this.realDelete()
        })
    },
    realDelete () {
      this.$store
        .dispatch('product/delData', [this.dataId])
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除成功',
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
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return true
    }
  }
}
</script>
