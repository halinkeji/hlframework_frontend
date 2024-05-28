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
          <div class="text-subtitle1">{{ dataId ? '修改' : '新增' }}信息</div>
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
                    v-model="messageData.wm_sort"
                    label="排序:数字越小，排序越靠前"
                    lazy-rules
                    :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '请输入正整数']"
                  />
                </div>
                <div class="col-12 col-md-9">
                  <q-select
                    outlined
                    option-value="type"
                    option-label="name"
                    emit-value
                    map-options
                    v-model="messageData.wm_type"
                    @input="selectBuyer"
                    :options="typeData"
                    dense
                    label="请选择类型"
                    :error="false"
                  />
                </div>
              </div>
              <div class="col-12 col-md-9">
                <q-btn-toggle
                  v-model="messageData.wm_status"
                  spread
                  class="my-custom-toggle q-mx-sm"
                  no-caps
                  rounded
                  unelevated
                  toggle-color="primary"
                  color="white"
                  text-color="primary"
                  :options="[
                    { label: '开启', value: '1' },
                    { label: '关闭', value: '0' },
                  ]"
                />
              </div>
              <div class="q-gutter-sm">
                <hl-editor
                  @change="
                    (v) => {
                      messageData.wm_content = v;
                    }
                  "
                  :content="messageData.wm_content"
                  class="fit"
                  titleText="详情"
                  :minHeight="$q.screen.height * 0.4"
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
  name: 'AddMessage',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0,
      messageData: {
        wm_sort: '',
        wm_name: '',
        wm_type: '',
        wm_status: '1',
        wm_content: ''
      },
      typeData: [],
      stop: false,
      multiple: false,
      uploadImgStatus: false
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.getTypeList()
  },
  methods: {
    getTypeList () {
      this.$store.dispatch('wxMallMessage/getType').then((res) => {
        if (res.code == 200) {
          this.typeData = res.data ? res.data : []
        }
      })
    },
    selectBuyer () {
      const that = this
      if (that.messageData.wm_type) {
        const data = that.typeData.find(function (x) {
          return x.type == that.messageData.wm_type
        })
        that.messageData.wm_name = data.name
      }
    },
    init (id) {
      this.dataId = id
      this.addStoreSidebar = true
      if (id > 0) {
        this.$store.dispatch('wxMallMessage/getItem', id).then((res) => {
          if (res.code == 200) {
            this.messageData = res.data
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
            ...this.messageData,
            id: this.dataId
          }
          this.$store
            .dispatch('wxMallMessage/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + '信息成功',
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
