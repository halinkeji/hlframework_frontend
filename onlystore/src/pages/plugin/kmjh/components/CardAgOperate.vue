<template>
  <div>
    {{ params.data.pkl_card_secret }}
    <q-btn flat round color="blue-grey" size="sm" icon="las las la-copy" @click="getCopy">
      <q-tooltip>
       复制
      </q-tooltip>
    </q-btn>
    <q-btn flat round color="primary" size="sm" icon="las la-qrcode" @click="showQrcode">
      <q-tooltip>
        二维码
      </q-tooltip>
    </q-btn>
  </div>
</template>
<script>
import { copyToClipboard } from 'quasar'
export default {
  name: 'CardAgOperate',
  components: {},
  data () {
    return {
      dataId: ''
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    showQrcode () {
      this.params.context.creatQrCode(this.params.data.pkl_card_secret)
    },
    // 复制卡密
    getCopy () {
      copyToClipboard(this.params.data.pkl_card_secret)
        .then(() => {
          this.$q.notify({
            message: '复制成功',
            color: 'green',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    }
  }
}
</script>
