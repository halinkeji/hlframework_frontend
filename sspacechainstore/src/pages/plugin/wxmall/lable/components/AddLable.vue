<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.4) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.4) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pb-md">
          <div class="text-subtitle1">{{ dataId ? '修改' : '新增' }}{{ parseInt(lableData.wl_type) == 1 ? '标签' : '服务' }}</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink q-pa-sm full-height">
          <q-form ref="newsDataRef" class="q-gutter-md">
            <div class="row">
              <div class="col-12">
                <q-input
                  outlined
                  dense
                  v-model="lableData.wl_sort"
                  label="排序:数字越小，排序越靠前"
                  lazy-rules
                  :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '请输入正整数']"
                />
              </div>
              <div class="col-12">
                <q-select
                  outlined
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  v-model="lableData.wl_type"
                  :options="[
                    { value: '1', label: '标签' },
                    { value: '2', label: '服务' },
                  ]"
                  dense
                  label="请选择类型"
                  :error="false"
                />
              </div>
              <div class="col-12">
                <q-input
                  outlined
                  dense
                  v-model="lableData.wl_name"
                  :label="`${parseInt(lableData.wl_type) == 1 ? '标签' : '服务'}名称`"
                  maxlength="255"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || (parseInt(lableData.wl_type) == 1 ? '标签' : '服务' + '标题不能为空')]"
                />
                <q-btn-toggle
                  v-model="lableData.wl_status"
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

              <div class="col-12 q-mt-md" v-if="parseInt(lableData.wl_type) == 2">
                <q-input outlined v-model="lableData.wl_description" dense type="textarea" rows="2" label="服务介绍" />
              </div>

              <div class="col-12 q-mt-md" v-if="parseInt(lableData.wl_type) == 1">
                <q-input
                  outlined
                  v-model="lableData.wl_remark"
                  dense
                  type="textarea"
                  rows="2"
                  :label="`${parseInt(lableData.wl_type) == 1 ? '标签' : '服务'}简介`"
                />
              </div>
              <div class="col-12 q-mt-md" v-else>
                <hl-editor
                  class="q-px-sm"
                  @change="
                    (v) => {
                      lableData.wl_remark = v;
                    }
                  "
                  :content="lableData.wl_remark"
                  :titleText="`${parseInt(lableData.wl_type) == 1 ? '标签' : '服务'}简介`"
                  :minHeight="$q.screen.height * 0.4"
                >
                </hl-editor>
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
  name: 'AddLable',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0,
      lableData: {
        wl_sort: '',
        wl_name: '',
        wl_remark: '',
        wl_type: '',
        wl_status: '1',
        wl_description: ''
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
      console.log('aaa', id)
      if (id > 0) {
        this.$store.dispatch('wxMallLable/getItem', id).then((res) => {
          if (res.code == 200) {
            this.lableData = res.data
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
            ...this.lableData,
            id: this.dataId
          }
          this.$store
            .dispatch('wxMallLable/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + parseInt(this.lableData.wl_type) == 1 ? '标签' : '服务' + '成功',
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
    }
  }
}
</script>
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
  width: 50%
</style>
