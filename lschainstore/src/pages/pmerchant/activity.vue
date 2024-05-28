<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
     ...
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'RechargeMoneySet',

  data () {
    return {
      activeName: '0',
      qrcodeDialog: false,
      currentLibId: 0,
      payConfig: {
        usePlatformBalance: 0,
        usePlatformPoints: 0,
        usePlatformCoupon: 0,
        payment: []
      },
      withdrawConfig: {
        withdrawCycle: 1, // 提现周期 0 T+0 1 T+1
        minWithdrawAmount: 0, // 最低提现金额
        serviceChargeRatio: 0, // 服务费或者交易分佣
        precedureFeeRatio: 0 // 手续费比例
      },
      accountInfo: {},
      pmerchantWithdrawConfig: {},
      merchantData: {},
      wxappQrcodeUrl: '',
      showApplyStatus: false,
      readDocumentRadio: [],
      blogViewStatus: false,
      currnetBlogData: {},
      currnetBlogTitle: {},
      yhxyBlog: {},
      yszcBlog: {}
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.getApplyJoinData()
    })
  },
  created () {
    if (this.$q.localStorage.getItem('lschainstore_account_info')) {
      this.accountInfo = this.$q.localStorage.getItem('lschainstore_account_info')
    }
  },
  computed: {},
  methods: {
    getApplyJoinData () {
      const obj = {}
      this.$store
        .dispatch('pmerchantManage/getApplyJoinData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.pmerchantWithdrawConfig = res.data ? res.data.pmerchantWithdrawConfig : {}
            this.merchantData = res.data ? res.data.merchantData : {}

            if (res.data.merchantExtendData && res.data.merchantExtendData.pay_config) {
              for (const x in res.data.merchantExtendData.pay_config) {
                this.payConfig[x] = res.data.merchantExtendData.pay_config[x]
              }
            }

            if (res.data.merchantExtendData && res.data.merchantExtendData.withdraw_config) {
              for (const x in res.data.merchantExtendData.withdraw_config) {
                this.withdrawConfig[x] = res.data.merchantExtendData.withdraw_config[x]
              }
            }

            if (this.merchantData && this.merchantData.pmm_wxapp_qrcode) {
              this.wxappQrcodeUrl = 'data:image/png;base64,' + this.merchantData.pmm_wxapp_qrcode
            }
            if (!(this.merchantData && this.merchantData.id)) {
              this.showApplyStatus = true
            } else if (this.merchantData && this.merchantData.id && parseInt(this.merchantData.pmm_status) == -2) {
              this.showApplyStatus = true
            }

            if (res.data.yhxyBlog && res.data.yhxyBlog.id) {
              this.yhxyBlog = res.data.yhxyBlog
            }

            if (res.data.yszcBlog && res.data.yszcBlog.id) {
              this.yszcBlog = res.data.yszcBlog
            }
          }
        })
        .catch((error) => {})
    },

    saveApplyData () {
      const obj = {
        payConfig: this.payConfig,
        withdrawConfig: this.withdrawConfig
      }
      this.$store
        .dispatch('pmerchantManage/merchantApplyJoinData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              message: '成功',
              caption: '申请成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.showApplyStatus = false
            this.getApplyJoinData()
          } else {
            this.$q.notify({
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '失败',
              caption: res.message,
              color: 'red'
            })
          }
        })
        .catch((error) => {})
    },
    closeDialog () {
      this.qrcodeDialog = false
      this.$emit('closeDialog')
    },
    setWxappQrcode () {
      this.$store
        .dispatch('merchantManage/setWxappQrcode', {
          merchant_id: this.params.data.merchantId
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              message: '成功',
              caption: '二维码生成成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.wxappQrcodeUrl = 'data:image/png;base64,' + res.data
          }
        })
        .catch((error) => {
          this.$q.notify({
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            message: '失败',
            caption: error.message,
            color: 'red'
          })
        })
    },

    downloadQrcode () {
      const blob = this.base64ToBlob(this.wxappQrcodeUrl) // 转码
      const filename = this.params.data.name
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      document.body.appendChild(a)
      a.href = url
      a.download = filename
      a.click()
    },
    base64ToBlob (code) {
      const parts = code.split(';base64,')
      const contentType = parts[0].split(':')[1]
      const raw = window.atob(parts[1])
      const rawLength = raw.length
      const uInt8Array = new Uint8Array(rawLength)
      for (let i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i)
      }
      return new window.Blob([uInt8Array], { type: contentType })
    },

    openBlogDialog (type) {
      this.blogViewStatus = true
      if (type == 'yszc') {
        this.currnetBlogData = this.yszcBlog
        this.currnetBlogTitle = '隐私政策'
      }

      if (type == 'yhxy') {
        this.currnetBlogData = this.yhxyBlog
        this.currnetBlogTitle = '用户协议'
      }
    }
  }
}
</script>

<style></style>
