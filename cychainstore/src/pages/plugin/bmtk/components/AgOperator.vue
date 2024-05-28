<template>
  <div>
    <q-btn color="primary" :to="{ name: 'activeDetail', query: { id: dataId } }" class=" q-mt-sm" unelevated label="活动明细" v-if="authorityMeta('view')" />
    <q-btn color="primary" class=" q-mt-sm q-mx-sm" unelevated label="编辑" :to="{ name: 'addActive', query: { id: dataId } }"  v-if="authorityMeta('edit')"/>
    <q-btn color="red" class=" q-mt-sm" unelevated label="删除" @click="confirmDeleteRecord" v-if="authorityMeta('del')" />
    <q-btn color="primary" class=" q-mt-sm q-mx-sm" unelevated label="活动链接" @click="copyClipboard" />
  </div>
</template>

<script>
import { copyToClipboard } from 'quasar'
export default {
  name: 'AgOperator',
  data () {
    return {
      dataId: 0,
      noticeUrl: ''
    }
  },
  created () {
    this.dataId = this.params.data.id
  },
  mounted () {
    const accountInfo = this.$q.localStorage.getItem('cychainstore_account_info')
    const systemLocal = this.$q.localStorage.getItem('cychainstore_system_local')
    if (systemLocal && accountInfo) {
      this.noticeUrl = systemLocal.systemInfo.site_url + '/m/' + accountInfo.apply_id + '/plugins/bmtk?id=' + accountInfo.lib_id + '&bmtkId=' + this.dataId
    }
  },
  computed: {},
  methods: {
    confirmDeleteRecord () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除名称为 ${this.params.data.bmt_name} 的活动吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },
    deleteRecord () {
      this.$store
        .dispatch('bmtk/delData', this.dataId)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除活动成功',
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
    copyClipboard () {
      copyToClipboard(this.noticeUrl)
        .then((res) => {
          this.$q.notify({
            message: '成功',
            caption: '复制剪贴板成功',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'green'
          })
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'negative',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map(obj => {
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
