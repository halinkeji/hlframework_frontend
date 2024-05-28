<template>
  <div class="q-gutter-x-sm">
    <q-btn unelevated  color="primary" label="修改" @click="openRuleDialog(params.data.id)"  v-if="authorityMeta('edit')" />
    <q-btn unelevated color="red" label="删除" @click="delRule" v-if="authorityMeta('del')" />
     <q-btn color="primary" unelevated label="活动链接" @click="copyClipboard" />
  </div>
</template>
<script>
import { copyToClipboard } from 'quasar'
export default {
  name: 'AgOperae',
  components: {},
  data () {
    return {}
  },
  created () {},
  mounted () {
    const accountInfo = this.$q.localStorage.getItem('oneyouka_account_info')
    const systemLocal = this.$q.localStorage.getItem('oneyouka_system_local')
    if (systemLocal && accountInfo) {
      this.noticeUrl = systemLocal.systemInfo.site_url + '/m/' + accountInfo.apply_id + '/plugins/hbyx/activity?id=' + accountInfo.lib_id + '&hbyxId=' + this.params.data.id
    }
  },
  computed: {},
  methods: {
    openRuleDialog (id) {
      this.params.context.openRuleDialog(id)
    },
    delRule () {
      this.$q
        .dialog({
          title: '确定',
          message: '删除当前的红包营销活动吗？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            id: this.params.data.id
          }
          this.$store.dispatch('hbyx/delActivityData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除活动',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.params.context.getList()
            }
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
