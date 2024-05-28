<template>
  <div>
    <q-btn
      unelevated
      color="primary"
      class="q-mr-sm"
      label="修改"
      v-if="authorityMeta('edit') && editStatus"
      :to="{ name: 'addTiming', query: { id: params.data.id } }"
    />
    <q-btn unelevated color="red" label="删除"  v-if="authorityMeta('del') && editStatus" @click="deleteData" />
  </div>
</template>
<script>
export default {
  name: 'AgButton',
  data () {
    return {
      editStatus: false
    }
  },
  created () {
    this.dataId = this.params.data.id
    if (!this.is_main_store) {
      const accountInfo = this.$q.localStorage.getItem('mychainstore_account_info')
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
    deleteData () {
      this.$q
        .dialog({
          title: '确定',
          message: '删除吗？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            id: this.params.data.id
          }
          this.$store.dispatch('goodsTiming/deleteAll', obj).then(res => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除!',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getTimingList()
            } else {
              this.$q.notify({
                message: '注意',
                caption: '失败！',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            }
          })
        })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map(obj => {
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
