<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="addAdDialogStatus" persistent>
      <q-card
        :style="{
          width: dialogWidth,
          'max-width': dialogWidth,
        }"
        class="q-pa-sm "
      >
        <q-card-section class="row items-center ">
          <div class="text-h6">
            {{ dataId > 0 ? '修改广告' : '新增广告' }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </q-card-section>

        <q-form ref="adDataRef" class="q-gutter-md">

          <div class="row q-px-sm">
            <div class="col-12 col-md-8 q-pr-xl">
              <q-input
              outlined
              dense
              v-model="adData.ja_sort"
              label="排序:数字越小，排序越靠前"
              lazy-rules
              :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '请输入正整数']"
            />

            <q-select
              outlined
              option-value="value"
              option-label="label"
              emit-value
              map-options
              v-model="adData.ja_status"
              :options="
              [
                { label: '开启', value: '1' },
                { label: '关闭', value: '2' },
               ]"
              dense
              label="请选择广告类型"
              :error="false"
            />

            <q-input outlined dense  v-model="adData.ja_title" label="广告标题" lazy-rules :rules="[(val) => !!val || '广告标题不能为空']" />
               <q-select outlined option-value="value" option-label="label" emit-value map-options v-model="adData.ja_position" :options="position" dense label="广告位置" :error="false" />

              <q-select outlined option-value="value" option-label="label" emit-value map-options v-model="adData.ja_type" :options="adType" dense label="请选择广告类型" :error="false" />
              <div>
                <q-input v-if="adData.ja_type == '2'" outlined dense v-model="adData.ja_url" label="广告链接" lazy-rules :rules="[(val) => !!val || '广告链接不能为空']" />
              </div>
              <div class="row q-mb-md" v-if="adData.ja_type == '1'">
                <q-input class="col-10 q-pr-sm" outlined dense disable v-model="wxGoodsData.wg_name" label="关联商品" />
                <q-space />
                <q-btn class="col-2" unelevated label="选择商品" color="primary" @click="chooseWxgoods" />
              </div>

            </div>
            <div class="col-12 col-md-4 q-px-sm text-center">

              <hl-upload
                  :multiple="false"
                  :currentAttach="adData.coverImage"
                  @input="(val)=>{ $nextTick(()=>{ adData.ja_cover_image = val })}"
                  currentTitle="广告图"
                 currentDescription="首页轮播广告建议尺寸比例4:3、其他广告位置建议尺寸比例2:1"
               />
               </div>
          </div>
          <div class="row">
            <q-input outlined dense class="col-12 q-px-sm" v-model="adData.ja_description" type="textarea" label="简介" />
          </div>
        </q-form>

        <q-card-actions align="center">
          <q-btn unelevated class="q-px-xl" :disable="disableButton" label="提交" @click="saveData()" color="primary" />
          <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage()" />
        </q-card-actions>
      </q-card>
      <choose-jfmall-goods v-if="chooseVisible" ref="chooseWxgoodsList" @getChooseGoods="receivingAdministrator" @closeChooseGoods="closeChooseGoods"></choose-jfmall-goods>
    </q-dialog>
  </div>
</template>

<script>
import ChooseJfmallGoods from './ChooseJfmallGoods.vue'
export default {
  name: 'AddAd',
  components: {
    ChooseJfmallGoods
  },
  data () {
    return {
      wxGoodsData: {},
      chooseVisible: false,
      dialogWidth: '1000px',
      addAdDialogStatus: false,
      dataId: 0,
      adData: {
        ja_title: '',
        ja_sort: 0,
        ja_type: '1',
        ja_cover_image: '',
        ja_status: '1',
        ja_url: '',
        ja_position: '1'
      },
      disableButton: false,
      position: [
        { value: '1', label: '首页轮播广告' },
        { value: '2', label: '首页展示广告' },
        { value: '3', label: '商品详情广告' },
        { value: '4', label: '全部商品广告' },
        { value: '5', label: '我的页面广告' }
      ],
      adType: [
        {
          value: '1',
          label: '关联商品广告'
        },
        {
          value: '2',
          label: '外部链接广告'
        }
      ],
      multiple: false,
      uploadImgStatus: false
    }
  },
  mounted () {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.5) + 'px'
    }
  },
  computed: {},
  created () {},
  methods: {
    getItem (id) {
      this.dataId = id
      this.addAdDialogStatus = true
      if (id > 0) {
        this.$store.dispatch('jfAd/getItem', id).then((res) => {
          if (res.code == 200) {
            this.adData = res.data ? res.data : {}
            this.wxGoodsData = res.data && parseInt(res.data.ja_type) == 1 && res.data.goods ? res.data.goods : {}
          }
        })
      }
    },
    saveData () {
      this.$refs.adDataRef.validate().then((success) => {
        if (success) {
          if (this.adData.ja_type == 1 && !this.wxGoodsData.id) {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '请选择商品',
              color: 'red'
            })
            return false
          }
          this.disableButton = true
          this.addAdDialogStatus = false
          if (this.adData.ja_type == 1) {
            this.adData.goods_id = this.wxGoodsData.id
          }
          const obj = {
            ...this.adData,
            id: this.dataId
          }
          this.$store
            .dispatch('jfAd/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}广告成功`,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.disableButton = false
                this.$nextTick(() => {
                  this.hideNowPage()
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
              this.disableButton = false
            })
        }
      })
    },
    // 选择商品
    chooseWxgoods () {
      this.chooseVisible = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.chooseWxgoodsList.getGoodsData()
        }, 500)
      })
    },
    // 选择返回的数据
    receivingAdministrator (val) {
      this.wxGoodsData = val[0]
    },
    // 关闭
    closeChooseGoods () {
      this.chooseVisible = false
    },

    // 图片上传
    getImageData (v) {
      this.uploadImgStatus = false
      const that = this
      _.forEach(v, function (value, key) {
        that.adData.ja_cover_image = value.path
      })
    },
    closeUpload (v) {
      this.uploadImgStatus = false
    },
    clickImage () {
      this.$nextTick(() => {
        this.uploadImgStatus = true
      })
    },

    hideNowPage () {
      this.$emit('getMethods')
    }
  }
}
</script>
