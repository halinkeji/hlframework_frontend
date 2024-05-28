<template>
  <div>
    <q-btn flat rounded color="primary" icon="create" @click="showPopup" v-if="authorityMeta('editLink') && editStatus">
      <q-tooltip>
        编辑
      </q-tooltip>
    </q-btn>
    <q-btn flat rounded color="red" icon="las la-unlink" @click="delLink" v-if="authorityMeta('delLink') && editStatus">
      <q-tooltip>
        解绑
      </q-tooltip>
    </q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgOperate',
  components: {},
  data () {
    return {
      dataId: '',
      editStatus: false
    }
  },
  created () {
    if (!this.is_main_store) {
      const accountInfo = this.$q.localStorage.getItem('sspacechainstore_account_info')
      if (accountInfo && accountInfo.lib_id && accountInfo.store_id) {
        if (parseInt(accountInfo.store_id) == parseInt(this.params.data.store_id)) {
          this.editStatus = true
        }
      }
    } else {
      this.editStatus = true
    }
  },
  mounted () {},
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    showPopup () {
      this.dataId = this.params.data.id
      this.params.context.showEditLink(this.dataId)
    },
    delLink () {
      this.$q
        .dialog({
          title: '确定',
          message: `解绑 "${this.params.data.mem_memberName}" 与 "${this.params.data.sonName}"的关联吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const params = {
            id: this.params.data.id
          }
          this.$store.dispatch('zfk/delAll', params).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功解绑关联',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getList()
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            }
          })
        })
    },
    authorityMeta (key) {
      // return true
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
