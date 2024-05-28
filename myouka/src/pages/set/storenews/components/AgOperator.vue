<template>
  <div>
    <q-btn color="primary" class="q-mt-sm q-mx-sm" unelevated label="修改" v-if="authorityMeta('edit')  && editStatus" @click="getGoodsNormalList()" />
    <q-btn color="red" class="q-mt-sm" unelevated label="删除" v-if="authorityMeta('del')  && editStatus" @click="confirmDeleteRecord()" />
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0,
      editStatus: false

    }
  },
  mounted () {},
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {
    this.dataId = this.params.data.id
    if (!this.is_main_store) {
      const accountInfo = this.$q.localStorage.getItem('myouka_account_info')
      if (accountInfo && accountInfo.lib_id && accountInfo.store_id) {
        if (parseInt(accountInfo.store_id) == parseInt(this.params.data.store_id)) {
          this.editStatus = true
        }
      }
    } else {
      this.editStatus = true
    }
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
          message: `确定删除标题为 "${this.params.data.sn_title}" 的公告吗`,
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
        .dispatch('storenews/delData', [this.dataId])
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除公告成功',
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
