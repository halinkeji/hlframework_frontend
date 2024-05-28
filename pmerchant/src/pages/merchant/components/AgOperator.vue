<template>
  <div class="q-gutter-xs">
    <q-btn-dropdown unelevated color="primary" label="操作">
      <q-list>
        <q-item clickable v-close-popup v-if="(parseInt(params.data.pmm_is_main) == 0 || params.data.manage_type == 'only') && parseInt(params.data.pmm_status) == 1">
          <q-item-section class="q-pa-none">
            <q-btn color="warning" unelevated label="微信小程序商家码" @click="getMerchantQrcode" />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup v-if="parseInt(params.data.pmm_status) == -1">
          <q-item-section class="q-pa-none">
            <q-btn color="orange" unelevated label="查看" @click="viewStoreData" />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup v-if="(parseInt(params.data.pmm_status) == 1 || parseInt(params.data.pmm_status) == -1 ) && (parseInt(params.data.pmm_is_main) == 1 || params.data.manage_type == 'only')">
          <q-item-section class="q-pa-none">
            <q-btn color="primary" unelevated label="身份认证" @click="checkMechantData" />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup>
          <q-item-section class="q-pa-none">
            <q-btn color="primary" unelevated label="修改" @click="editStoreData" />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup v-if="parseInt(params.data.pmm_status) == 1 && (parseInt(params.data.pmm_is_main) == 1 || params.data.manage_type == 'only')">
          <q-item-section class="q-pa-none">
            <q-btn color="green" unelevated label="消费设置" @click="openStorePayDoalog" />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup v-if="parseInt(params.data.pmm_status) == 1 && (parseInt(params.data.pmm_is_main) == 1 || params.data.manage_type == 'only')">
          <q-item-section class="q-pa-none">
            <q-btn color="green" unelevated label="结算设置" @click="openStoreWithdrawDoalog" />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup v-if="parseInt(params.data.pmm_status) == 1 && (parseInt(params.data.pmm_is_main) == 1 || params.data.manage_type == 'only')">
          <q-item-section class="q-pa-none">
            <q-btn color="orange" unelevated label="转账用户设置" @click="openTransferSetRefListDoalog" />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup v-if="parseInt(params.data.pmm_status) == 1 && (parseInt(params.data.pmm_is_main) == 1 || params.data.manage_type == 'only')">
          <q-item-section class="q-pa-none">
            <q-btn color="info" unelevated label="账号管理" @click="updatePassword" />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup v-if="parseInt(params.data.pmm_status) == 1">
          <q-item-section class="q-pa-none">
            <q-btn color="warning" unelevated label="收入记录" @click="openfinanceListDoalog" />
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup v-if="parseInt(params.data.pmm_status) == 1">
          <q-item-section class="q-pa-none">
            <q-btn color="warning" unelevated label="提现记录" @click="openWithdrawListDoalog" />
          </q-item-section>
        </q-item>

        <!-- <q-item clickable v-close-popup>
          <q-item-section class="q-pa-none">
            <q-btn color="positive" unelevated label="提现" @click="openMerchantWithdrawDoalog" />
          </q-item-section>
        </q-item> -->
      </q-list>
    </q-btn-dropdown>

    <q-dialog v-model="qrcodeDialog" full-height persistent>
      <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.9) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.9) + 'px',
      }">
        <q-card-section class="row q-gutter-sm q-py-sm p-px-sm items-center">
          <div class="text-subtitle2 text-center">{{ params.data.name }}</div>
          <q-space />
            <q-btn unelevated label="生成二维码" color="warning" @click="setWxappQrcode" />
          <q-btn unelevated label="关闭" color="grey" @click="closeQrcodeDialog" />
        </q-card-section>

        <q-separator />

        <q-card-section class="q-pt-xs row q-gutter-xs" v-if="wxappQrcodeUrl && wxappQrcodeUrl.one" >
          <div class="col-2" v-if="wxappQrcodeUrl && wxappQrcodeUrl.one">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 text-center">微信小程序商家码（280px）</div>
              </q-card-section>

              <q-separator />

              <q-card-section class="q-pt-none text-center" >
                <q-img :src="`data:image/png;base64,${wxappQrcodeUrl.one}`" style="width:140px" width="140" />
              </q-card-section>
              <q-separator />

              <q-card-actions align="center">
                <!-- <q-btn unelevated label="生成二维码" color="warning" @click="setWxappQrcode" /> -->
                <q-btn unelevated label="下载" color="primary" @click="downloadQrcode(wxappQrcodeUrl.one,'280 * 280')" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col-3" v-if="wxappQrcodeUrl && wxappQrcodeUrl.two">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 text-center">微信小程序商家码（640px）</div>
              </q-card-section>

              <q-separator />

              <q-card-section class="q-pt-none text-center" >
                <q-img :src="`data:image/png;base64,${wxappQrcodeUrl.two}`" style="width:320px" width="320" />
              </q-card-section>
              <q-separator />

              <q-card-actions align="center">
                <!-- <q-btn unelevated label="生成二维码" color="warning" @click="setWxappQrcode" /> -->
                <q-btn unelevated label="下载" color="primary" @click="downloadQrcode(wxappQrcodeUrl.two,'320 * 320')" />
              </q-card-actions>
            </q-card>
          </div>

          <div class="col" v-if="wxappQrcodeUrl && wxappQrcodeUrl.three">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2 text-center">微信小程序商家码（1280px）</div>
              </q-card-section>

              <q-separator />

              <q-card-section class="q-pt-none text-center" >
                <q-img :src="`data:image/png;base64,${wxappQrcodeUrl.three}`" style="width:640px" width="640" />
              </q-card-section>
              <q-separator />

              <q-card-actions align="center">
                <!-- <q-btn unelevated label="生成二维码" color="warning" @click="setWxappQrcode" /> -->
                <q-btn unelevated label="下载" color="primary" @click="downloadQrcode(wxappQrcodeUrl.three,'1280 * 1280')" />
              </q-card-actions>
            </q-card>
          </div>
        </q-card-section>
        <q-card-section class="text-center" v-else> 请点击生成二维码 </q-card-section>

      </q-card>
    </q-dialog>
    <withdraw-set ref="withdrawSetDialogRef" @closeDialog="closeWithdrawDialog" v-if="withdrawSetStatus" />

    <pay-set ref="paySetDialogRef" @closeDialog="closeWithdrawDialog" v-if="paySetStatus" />

    <withdraw-dialog ref="mechantWithdrawDialogRef" @closeDialog="closeWithdrawDialog" v-if="mechantWithdrawDialogStatus" />

    <upate-password ref="passwordDialogRef" @closeDialog="closeUpdateDialog" v-if="passwordDialogStatus" />

    <finance-list ref="financeListRef" @closeDialog="closeFinanceListDialog" v-if="financeListStatus" />

    <withdraw-list ref="withdrawListRef" @closeDialog="closeWithdrawListDialog" v-if="withdrawListStatus" />

    <transfer-set ref="transferSetRef" @closeDialog="closeTransferSetDialog" v-if="wtransferSetStatus" />
  </div>
</template>

<script>
import WithdrawSet from './WithdrawSet.vue'
import PaySet from './PaySet.vue'
import WithdrawDialog from './WithdrawDialog.vue'
import UpatePassword from './Password.vue'
import FinanceList from '../finance/FinanceList.vue'
import WithdrawList from '../finance/WithdrawList.vue'
import TransferSet from './TransferSet.vue'

export default {
  name: 'AgOperator',
  components: {
    WithdrawSet,
    WithdrawDialog,
    PaySet,
    UpatePassword,
    FinanceList,
    WithdrawList,
    TransferSet
  },
  data () {
    return {
      dataId: 0,
      qrcodeDialog: false,
      wxappQrcodeUrl: '',
      withdrawSetStatus: false,
      mechantWithdrawDialogStatus: false,
      paySetStatus: false,
      passwordDialogStatus: false,
      financeListStatus: false,
      withdrawListStatus: false,
      wtransferSetStatus: false
    }
  },
  created () {
    this.dataId = this.params.data.id
  },
  mounted () {},
  computed: {},
  methods: {
    confirmDeleteRecord () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除名称为 ${this.params.data.name} 的商户吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
        .onCancel(() => {})
    },
    deleteRecord () {
      const obj = [this.dataId]
      this.$store
        .dispatch('merchant/delData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除商户成功',
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
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            message: '失败',
            caption: error.message,
            color: 'red'
          })
        })
    },
    closeUpdateDialog () {
      this.passwordDialogStatus = false
    },
    updatePassword () {
      this.passwordDialogStatus = true

      this.$nextTick(() => {
        this.$refs.passwordDialogRef.updatePassword(this.params.data.contact_moblie)
      })
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
            this.wxappQrcodeUrl = res.data
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

    downloadQrcode (url_code, img_name) {
      const blob = this.base64ToBlob('data:image/png;base64,' + url_code) // 转码
      const filename = this.params.data.name + '--' + img_name
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

    editStoreData () {
      this.params.context.editStoreData(this.params.data.pmm_relation_store_id)
    },
    checkMechantData () {
      this.params.context.checkMechantData(this.params.data.pmm_relation_store_id)
    },
    openStoreWithdrawDoalog () {
      this.withdrawSetStatus = true
      this.$nextTick(() => {
        this.$refs.withdrawSetDialogRef.init(this.params.data.pmm_relation_lib_id)
      })
    },
    openStorePayDoalog () {
      this.paySetStatus = true
      this.$nextTick(() => {
        this.$refs.paySetDialogRef.init(this.params.data.pmm_relation_lib_id)
      })
    },
    closeWithdrawDialog () {
      this.mechantWithdrawDialogStatus = false
      this.withdrawSetStatus = false
      this.paySetStatus = false
    },
    openMerchantWithdrawDoalog () {
      this.mechantWithdrawDialogStatus = true
      this.$nextTick(() => {
        this.$refs.mechantWithdrawDialogRef.init(this.params.data.pmm_relation_lib_id, this.params.data.name)
      })
    },
    closeFinanceListDialog () {
      this.financeListStatus = false
    },
    closeWithdrawListDialog () {
      this.withdrawListStatus = false
    },
    closeTransferSetDialog () {
      this.wtransferSetStatus = false
    },

    openfinanceListDoalog () {
      this.financeListStatus = true
      this.$nextTick(() => {
        this.$refs.financeListRef.init(this.params.data.pmm_relation_lib_id)
      })
    },

    openWithdrawListDoalog () {
      this.withdrawListStatus = true

      this.$nextTick(() => {
        this.$refs.withdrawListRef.init(this.params.data.pmm_relation_lib_id)
      })
    },

    viewStoreData () {
      this.params.context.viewStoreData(this.params.data.pmm_relation_store_id)
    },

    openTransferSetRefListDoalog () {
      this.wtransferSetStatus = true

      this.$nextTick(() => {
        this.$refs.transferSetRef.init(this.params.data.pmm_relation_store_id)
      })
    },
    closeQrcodeDialog () {
      this.qrcodeDialog = false
      this.wxappQrcodeUrl = {}
    },
    getMerchantQrcode () {
      const obj = {
        merchantId: this.params.data.merchantId
      }
      this.$store
        .dispatch('merchantManage/getMerchantQrcode', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.qrcodeDialog = true
            if (res.data.pmm_wxapp_qrcode) {
              this.wxappQrcodeUrl = res.data.pmm_wxapp_qrcode
            }
          }
        })
        .catch((error) => {})
    }
  }
}
</script>
