<template>
  <q-dialog @hide="closeUpload" v-model="imgPopupStatus">
    <q-card flat bordered class="bg-white" style="width: 900px; max-width: 80vw;">
      <q-card-section class="q-pa-none q-px-md">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-subtitle2">导入商品</div>
          </div>

          <div class="col-auto">
            <q-btn color="grey-7" class="q-pa-none" round flat v-close-popup icon="ion-close-circle-outline"> </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-uploader
        ref="qUploadedImgRef"
        color="white"
        text-color="black"
        :url="getUrl"
        style="width:100%;"
        flat
        bordered
        :field-name="'file'"
        @uploaded="uploadedSuccess"
        @failed="uploadedError"
      >
      </q-uploader>
      <q-banner inline-actions rounded class="bg-grey-1 text-black">
        <template v-slot:action>
          <q-btn
            unelevated
            outline
            v-if="type == 'purchase' || type == 'orderGoods' || type == 'order'"
            color="primary"
            label="下载导入模板"
            icon="get_app"
            href="https://cdn.halin.net/download/xlsx/服装版-采购订货补货导入模板.xlsx"
            target="_blank"
            type="a"
          />
          <q-btn
            unelevated
            outline
            v-if="type == 'check' || type == 'storeReturn' || type == 'transfer' || type == 'purchaseReturn'"
            color="primary"
            label="下载导入模板"
            icon="get_app"
            type="a"
            href="https://cdn.halin.net/download/xlsx/服装版-盘点导入模板.xlsx"
            target="_blank"
          />
        </template>
      </q-banner>
    </q-card>
  </q-dialog>
</template>

<script>
import { api } from 'boot/axios'
export default {
  name: 'tableGoods',
  props: [],
  components: {},
  data () {
    return {
      groupPopupStatus: false,
      drawerLeft: true,
      imgPopupStatus: true,

      selectedImgs: [],
      selectedImgUrl: [],
      groupList: [],
      newGroupId: '',
      search_time: '',
      goodsInfo: [],
      type: '',
      inviceId: '',
      check_id: ''
    }
  },
  watch: {},
  created () {},
  beforeMount () {},
  mounted () {},
  methods: {
    receiveType (type, id, checkId = null, depot = null) {
      this.type = type
      this.inviceId = id
      this.check_id = checkId || 0
      this.depot = depot || ''
    },
    getUrl () {
      return api.defaults.baseURL + '/v1/file/member'
    },
    uploadedSuccess (info) {
      this.$q.notify({
        message: '上传成功',
        color: 'blue',
        position: 'top'
      })
      this.goodsInfo = JSON.parse(info.xhr.response)

      if (this.type == 'purchase') {
        this.uploadedPurchase()
      }
      if (this.type == 'orderGoods') {
        this.uploadedOrderGoods()
      }
      if (this.type == 'order') {
        this.uploadedOrder()
      }
      if (this.type == 'check') {
        this.uploadedCheck()
      }
      if (this.type == 'purchaseReturn') {
        this.uploadedPurchaseReturn()
      }
      if (this.type == 'storeReturn') {
        this.uploadedStoreReturn()
      }
      if (this.type == 'transfer') {
        this.uploadedTransfer()
      }

      this.$refs.qUploadedImgRef.removeUploadedFiles()
    },
    uploadedError (info) {
      this.$q.notify({
        message: '上传文件失败，上传列表清空，请重新上传',
        color: 'blue',
        position: 'top'
      })
      this.$refs.qUploadedImgRef.removeUploadedFiles()
    },
    closeUpload () {
      this.$emit('closeUpload', false)
    },
    // 采购
    uploadedPurchase () {
      const obj = {
        rows: this.goodsInfo.data,
        purchase_id: this.inviceId
      }
      this.$store
        .dispatch('erpPurchase/uploadPurchase', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '成功导入 ' + res.data + ' 条商品！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },
    // 订货
    uploadedOrderGoods () {
      const obj = {
        rows: this.goodsInfo.data,
        purchase_id: this.inviceId
      }
      this.$store
        .dispatch('erpOrderGoods/upload', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '成功导入 ' + res.data + ' 条商品！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },
    // 补货
    uploadedOrder () {
      const obj = {
        rows: this.goodsInfo.data,
        purchase_id: this.inviceId
      }
      this.$store
        .dispatch('erpOrder/upload', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '成功导入 ' + res.data + ' 条商品！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },
    uploadedCheck () {
      const obj = {
        rows: this.goodsInfo.data,
        main_invoice_id: this.inviceId,
        check_id: this.check_id,
        depot: this.depot
      }
      this.$store
        .dispatch('erpCheck/upload', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '成功导入 ' + res.data + ' 条商品！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },
    uploadedPurchaseReturn () {
      const obj = {
        rows: this.goodsInfo.data,
        inviceId: this.inviceId,
        depot_id: this.check_id
      }
      this.$store
        .dispatch('erpPurchaseReturn/upload', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '成功导入 ' + res.data + ' 条商品！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },
    uploadedStoreReturn () {
      const obj = {
        rows: this.goodsInfo.data,
        inviceId: this.inviceId,
        store: this.check_id
      }
      this.$store
        .dispatch('erpStoreReturn/upload', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '成功导入 ' + res.data + ' 条商品！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },
    uploadedTransfer () {
      const obj = {
        rows: this.goodsInfo.data,
        invoice_id: this.inviceId,
        depot_id: this.check_id
      }
      this.$store
        .dispatch('erpTransfer/upload', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '成功导入 ' + res.data + ' 条商品！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    }
  }
}
</script>
