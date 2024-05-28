<template>
  <div>
    <q-btn round color="primary" dense flat icon="las la-qrcode">
      <q-menu>
        <q-card class="q-pa-md">
          <qrcode-vue id="mobileRegUrlRef" :value="regUrl" foreground="#027be3" :size="'200'" level="H" />
          <div class="text-center">
            <q-btn color="primary" unelevated dense @click="downloadMobileRegCode" label="下载二维码" icon="las la-download" />
          </div>
        </q-card>
      </q-menu>
    </q-btn>
  </div>
</template>

<script>
import { copyToClipboard } from 'quasar'
export default {
  name: 'AgUrl',
  data () {
    return {
      regUrl: ''
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.regUrl = this.getRegUrl(this.params.data.piu_number)
  },
  methods: {
    getRegUrl (uCode) {
      return 'http://q.otlichina.com/show' + '?uCode=' + uCode
    },
    copyRegUrl (val) {
      copyToClipboard(val)
        .then(() => {
          this.$q.notify({
            message: '成功',
            caption: '复制成功',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'green'
          })
        })
        .catch(() => {
          // fail
        })
    },
    downloadMobileRegCode () {
      const canvas = document.getElementById('mobileRegUrlRef').getElementsByTagName('canvas')
      const a = document.createElement('a')
      a.href = canvas[0].toDataURL('img/png')
      a.download = this.params.data.piu_number
      a.click()
    }
  }
}
</script>
