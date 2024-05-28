<template>
  <q-dialog @hide="closeUpload" v-model="imgPopupStatus">
    <q-card flat bordered class="bg-white" style="width: 900px; max-width: 80vw">
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
        style="width: 100%"
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
            color="primary"
            label="下载导入模板"
            icon="get_app"
            href="https://cdn.halin.net/download/xlsx/促销导入商品.xlsx"
            target="_blank"
          />
        </template>
      </q-banner>
    </q-card>
  </q-dialog>
</template>

<script>
import { api } from 'boot/axios';
export default {
  name: 'tableGoods',
  props: [],
  components: {},
  data() {
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
    };
  },
  watch: {},
  created() {},
  beforeMount() {},
  mounted() {},
  methods: {
    receiveType(type) {
      this.type = type;
    },
    getUrl() {
      return api.defaults.baseURL + '/v1/file/member';
    },
    uploadedSuccess(info) {
      this.$q.notify({
        message: '上传成功',
        color: 'blue',
        position: 'top',
      });
      this.goodsInfo = JSON.parse(info.xhr.response);
      this.uploadedGoods();
      this.$refs.qUploadedImgRef.removeUploadedFiles();
    },
    uploadedError(info) {
      this.$q.notify({
        message: '上传图片失败，上传列表清空，请重新上传',
        color: 'blue',
        position: 'top',
      });
      this.$refs.qUploadedImgRef.removeUploadedFiles();
    },
    closeUpload() {
      this.$emit('closeUpload', false);
    },
    uploadedGoods() {
      var data = this.goodsInfo.data.splice(0, 1);
      console.log('goodsInfo', this.goodsInfo.data);
      this.$emit('closeUpload', this.goodsInfo.data);
    },
  },
};
</script>
<style>
.selected_img_border {
  border-style: solid;
  border-width: 5px;

  border-color: #027be3;
}
</style>
