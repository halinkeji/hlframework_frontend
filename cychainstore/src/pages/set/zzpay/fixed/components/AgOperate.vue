<template>
  <div class="row q-gutter-sm">
    <q-btn label="修改" color="primary" unelevated @click="editData()" />
    <q-btn label="删除" color="red" unelevated @click="confirmDeleteRecord()" />

    <q-btn label="二维码" color="positive" icon="las la-qrcode" unelevated>
      <q-popup-proxy :breakpoint="600">
        <div class="q-pa-md">

          <qrcode-vue id="mobileRegUrlRef" :value="noticeUrl" foreground="#027be3" :size="'200'" level="H" />

          <div class="q-pa-sm">
            <q-btn unelevated color="blue-9" label="下载" @click="downloadMobileRegCode" v-close-popup class="full-width" />
          </div>
        </div>
      </q-popup-proxy>
    </q-btn>
  </div>
</template>
<script>
export default {
  name: 'AgOperate',
  components: {},
  data () {
    return {}
  },
  mounted () {},
  created () {},
  computed: {
    noticeUrl () {
      const accountInfo = this.$q.localStorage.getItem('cychainstore_account_info')
      const systemLocal = this.$q.localStorage.getItem('cychainstore_system_local')
      if (systemLocal && accountInfo) {
        return systemLocal.systemInfo.site_url + '/m/' + accountInfo.apply_id + '/zzpay/pay-page?id=' + accountInfo.lib_id + '&pid=' + this.params.data.id
      }
      return ''
    }
  },
  methods: {
    editData () {
      this.$nextTick(() => {
        this.params.context.showPopup(this.params.data.id)
      })
    },

    confirmDeleteRecord () {
      this.$q
        .dialog({
          type: 'confirm',
          title: '是否确认',
          message: '确认删除此数值吗？',
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
    },
    deleteRecord () {
      const obj = {
        id: [this.params.data.id]
      }
      this.$store
        .dispatch('fixed/delData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '成功删除固定金额',
              color: 'green'
            })
            this.params.context.getFixedmoneyList(this.params.data.fm_type)
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: 'Error',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    downloadMobileRegCode () {
      const canvas = document.getElementById('mobileRegUrlRef').getElementsByTagName('canvas')
      const a = document.createElement('a')
      a.href = canvas[0].toDataURL('img/png')
      a.download = this.params.data.fm_parameter
      a.click()
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
