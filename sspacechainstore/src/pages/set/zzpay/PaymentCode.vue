<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md q-pt-xs">
      <q-input outlined dense v-model="noticeUrl" label="支付码入口" disable>
        <template v-slot:after>
          <q-btn unelevated color="primary" label="复制" @click="copyClipboard(noticeUrl)" />
        </template>
      </q-input>
    </div>

    <div class="col-shrink q-pa-sm full-height bg-white">
      <q-scroll-area class="fit full-height row">
        <div class="text-red">
          鼠标右键点击图片，另存为图像保存
        </div>
        <div class="row q-mt-md q-gutter-sm">
          <div class="col-auto">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6">150px <span class="text-grey">×</span> 150px</div>
              </q-card-section>
              <q-separator dark inset class="q-mb-xs" />
              <q-card-actions>
                <qrcode-vue :value="noticeUrl" :size="'150'" level="H" />
              </q-card-actions>
            </q-card>
          </div>
          <div class="col-auto">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6">200px <span class="text-grey">×</span> 200px</div>
              </q-card-section>

              <q-separator dark inset class="q-mb-xs" />
              <q-card-actions>
                <qrcode-vue :value="noticeUrl" :size="'200'" level="H" />
              </q-card-actions>
            </q-card>
          </div>
          <div class="col-auto">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6">400px <span class="text-grey">×</span> 400px</div>
              </q-card-section>

              <q-separator dark inset class="q-mb-xs" />
              <q-card-actions>
                <qrcode-vue :value="noticeUrl" :size="'400'" level="H" />
              </q-card-actions>
            </q-card>
          </div>
          <div class="col-auto">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6">600px <span class="text-grey">×</span> 600px</div>
              </q-card-section>

              <q-separator dark inset class="q-mb-xs" />
              <q-card-actions>
                <qrcode-vue :value="noticeUrl" :size="'600'" level="H" />
              </q-card-actions>
            </q-card>
          </div>
        </div>
      </q-scroll-area>
    </div>
  </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue'
import { copyToClipboard } from 'quasar'
export default {
  name: 'PaymentCode',
  components: {
    QrcodeVue
  },
  data () {
    return {
      noticeUrl: ''
    }
  },
  created () {},
  mounted () {
    const accountInfo = this.$q.localStorage.getItem('sspacechainstore_account_info')
    const systemLocal = this.$q.localStorage.getItem('sspacechainstore_system_local')
    if (systemLocal && accountInfo) {
      this.noticeUrl = systemLocal.systemInfo.site_url + '/m/' + accountInfo.apply_id + '/zzpay/pay-page?id=' + accountInfo.lib_id
    }
  },
  computed: {},
  methods: {
    copyClipboard (val) {
      copyToClipboard(val)
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
    }
  }
}
</script>

<style>
.maxww {
  max-width: 100px;
}
</style>
