<template>
  <q-dialog  v-model="imgPopupStatus">
    <q-card flat bordered class="bg-white" style="width: 900px; max-width: 80vw;">
      <q-card-section class="q-pa-none q-px-md">
        <div class="row items-center no-wrap">
          <div class="col">
            <div class="text-subtitle2">导入数据</div>
          </div>

          <div class="col-auto">
            <q-btn color="grey-7" class="q-pa-none" round flat @click="closeUpload" icon="ion-close-circle-outline"> </q-btn>
          </div>
        </div>
      </q-card-section>

      <q-uploader
        ref="qUploadedImgRef"
        color="white"
        text-color="black"
        :url="getUrl"
        accept=".xlsx"
        style="width:100%;"
        flat
        bordered
        :field-name="'file'"
        @uploaded="uploadedSuccess"
        @failed="uploadedError"
        :headers="headersData"
      >
      </q-uploader>
    </q-card>
  </q-dialog>
</template>

<script>
import { Cookies, LocalStorage } from 'quasar'
import { api } from 'boot/axios'
export default {
  name: 'tableGoods',
  props: [],
  components: {},
  data () {
    return {
      groupPopupStatus: false,
      drawerLeft: true,
      imgPopupStatus: false,

      selectedImgs: [],
      selectedImgUrl: [],
      groupList: [],
      newGroupId: '',
      search_time: '',
      goodsInfo: [],
      typeData: '',
      headersData: []
    }
  },
  watch: {},
  created () {},
  beforeMount () {},
  mounted () {},
  methods: {
    uploadInit (typeData) {
      if (typeData) {
        this.imgPopupStatus = true
        this.typeData = typeData
        const headersData = []
        if (Cookies.get('loggedIn')) {
          const accessToken = Cookies.get('access_token')

          headersData.push({
            name: 'Authorization',
            value: `Bearer ${accessToken}`
          })

          headersData.push({
            name: 'StoreId',
            value: LocalStorage.getItem('mychainstore_account_info').store_id
          })
          headersData.push({
            name: 'UserId',
            value: LocalStorage.getItem('mychainstore_account_info').user_id
          })
          headersData.push({
            name: 'Authorization',
            value: `Bearer ${accessToken}`
          })
          headersData.push({
            name: 'ApplyId',
            value: LocalStorage.getItem('mychainstore_account_info').apply_id
          })
          headersData.push({
            name: 'LibId',
            value: LocalStorage.getItem('mychainstore_account_info').lib_id
          })

          this.headersData = headersData
        }
      }
    },
    getUrl () {
      return api.defaults.baseURL + '/v3/file/upload-in-file?typeData=' + this.typeData
    },
    uploadedSuccess (info) {
      this.$q.notify({
        message: '上传成功',
        color: 'blue',
        position: 'top'
      })

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
      this.imgPopupStatus = false
      this.$emit('closeUpload', false)
    }

  }
}
</script>
<style>
.selected_img_border {
  border-style: solid;
  border-width: 5px;

  border-color: #027be3;
}
</style>
