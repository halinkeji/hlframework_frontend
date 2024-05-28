<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pb-md">
          <div class="text-subtitle1">{{ dataId ? '修改' : '新增' }}广告</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink q-pa-sm full-height">
          <q-form ref="newsDataRef" class="q-gutter-sm q-pa-md">
              <div class="row">
                <div class="col-12">
                  <q-input
                    outlined
                    dense
                    v-model="adData.title"
                    label="广告标题"
                    maxlength="255"
                    lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '广告标题不能为空']"
                  />
                </div>

                <div class="col-12">
                  <q-input
                    outlined
                    dense
                    v-model="adData.description"
                    label="广告描述"
                    maxlength="255"
                    lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '广告描述不能为空']"
                  />
                </div>
                <div class="col-12">
                  <q-select
                    outlined
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    :options="urlOptions"
                    v-model="adData.url_type"
                    dense
                    bottom-slots
                    label="链接类型"
                  />
                </div>
                <div class="col-12">
                  <q-input
                    outlined
                    dense
                    v-model="adData.url"
                    label="广告链接"
                    maxlength="255"
                    lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '广告链接不能为空']"
                  />
                </div>
                <div class="col-12">
                  <q-select
                    outlined
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    :options="statusOptions"
                    v-model="adData.status"
                    dense
                    bottom-slots
                    label="状态"
                  />
                </div>
                <div class="col-12">
                  <q-select
                    outlined
                    option-value="value"
                    option-label="label"
                    emit-value
                    map-options
                    :options="positionData"
                    v-model="adData.position"
                    dense
                    label="选择模板类型"
                  />
                </div>
                <div class="col-12">
                  <hl-upload
                    :multiple="false"
                    :currentAttach="adData.coverImage"
                    @input="
                      (val) => {
                        $nextTick(() => {
                          adData.cover_image = val;
                        });
                      }
                    "
                    currentTitle="封面图"
                    urrentDescription="建议尺寸比例4:3"
                  />
                </div>
              </div>
            </q-form>
        </div>
        <div class="col-shrink bg-white q-pb-sm row q-gutter-sm text-center justify-center">
          <q-btn unelevated class="q-px-xl" label="提交" @click="saveData()" color="primary" />
          <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage()" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'BlogManage',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0,
      adData: {
        title: '',
        cover_image: '',
        status: '1',
        position: '1',
        url: '',
        description: '',
        url_type: '1'
      },
      stop: false,
      multiple: false,
      uploadImgStatus: false,

      positionData: [
        { label: '首页轮播', value: '1' },
        { label: '首页推荐', value: '2' },
        { label: '我的推荐', value: '3' },
        { label: '商户分类', value: '4' },
        { label: '账单推荐', value: '5' },
        { label: '智慧开店', value: '6' }
      ],
      statusOptions: [
        { label: '显示', value: '1' },
        { label: '隐藏', value: '0' }
      ],
      urlOptions: [
        { label: '小程序页面', value: '1' }
        // { label: '跳转网页', value: '2' }
      ]
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init (id) {
      this.dataId = id
      this.addStoreSidebar = true
      if (id > 0) {
        this.$store.dispatch('ad/getItem', id).then((res) => {
          if (res.code == 200) {
            this.adData = res.data ? res.data : {}
          }
        })
      }
    },

    saveData () {
      this.$refs.newsDataRef.validate().then((success) => {
        if (success) {
          this.stop = true
          this.addStoreSidebar = false
          const obj = {
            ...this.adData,
            id: this.dataId
          }
          this.$store
            .dispatch('ad/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + '广告成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.hideNowPage()
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '错误',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red'
              })
              this.stop = false
            })
        }
      })
    },

    hideNowPage () {
      this.$emit('getMethods')
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
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
  width: 50%
</style>
