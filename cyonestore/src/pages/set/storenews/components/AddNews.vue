<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.5) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pb-md">
          <div class="text-subtitle1">{{ dataId ? '修改' : '新增' }}公告</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink q-pa-sm full-height">
          <div style="overflow-y: scroll;" class="fit full-height">
            <q-form ref="newsDataRef" class="q-gutter-md">
              <div class="row">
                <div class="col-12 col-md-9">
                  <q-input
                    outlined
                    dense
                    class="col-12 col-md-6 q-mt-sm q-px-sm"
                    v-model="storeNewsData.sn_title"
                    label="公告标题"
                    maxlength="255"
                    lazy-rules
                    :rules="[(val) => (val && val.length > 0) || '公告标题不能为空']"
                  />

                  <q-btn-toggle
                    v-model="storeNewsData.sn_status"
                    spread
                    class="my-custom-toggle q-mx-sm"
                    no-caps
                    rounded
                    unelevated
                    toggle-color="primary"
                    color="white"
                    text-color="primary"
                    :options="[
                      { label: '显示', value: '1' },
                      { label: '隐藏', value: '0' },
                    ]"
                  />
                </div>
                <div class="col-12 col-md-3 text-center">
                  <hl-upload
                    :multiple="false"
                    :currentAttach="storeNewsData.coverImage"
                    @input="(val)=>{ $nextTick(()=>{ storeNewsData.sn_picture = val })}"
                    currentTitle="公告封面图"
                    urrentDescription="建议尺寸比例4:3"
                />
                </div>
              </div>
              <div class="q-gutter-sm">
                <hl-editor
                  @change="
                    (v) => {
                      storeNewsData.sn_content = v
                    }
                  "
                  :content="storeNewsData.sn_content"
                  class="fit"
                  :minHeight="$q.screen.height * 0.4"
                  titleText="详情"
                ></hl-editor>
              </div>
            </q-form>
          </div>
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
  name: 'AddNews',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0,
      storeNewsData: {
        sn_title: '',
        sn_content: '',
        sn_picture: '',
        sn_status: '1'
      },
      stop: false,
      multiple: false,
      uploadImgStatus: false
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
        this.$store.dispatch('storenews/getItem', id).then((res) => {
          if (res.code == 200) {
            this.storeNewsData = res.data
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
            ...this.storeNewsData,
            id: this.dataId
          }
          this.$store
            .dispatch('storenews/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + '公告成功',
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
                message: 'Error',
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
