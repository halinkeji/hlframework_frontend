<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.8) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.8) + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pb-md">
          <div class="text-subtitle1">{{ apiSupplierId ? '修改' : '新增' }}api供应商</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink q-pa-sm full-height">
          <q-scroll-area class="fit full-height">
            <q-form ref="apiSupplierRef" class="row q-col-gutter-sm">
               <div class="col-3">
                <q-input outlined dense label="接口名称" :rules="[(val) => !!val || '必填项']" v-model="apiSupplierForm.name" />
              </div>
              <div class="col-6">
                <q-input outlined dense label="请求链接" :rules="[(val) => !!val || '必填项']" v-model="apiSupplierForm.api_url" />
              </div>
              <div class="col-3">
                <q-select
                  outlined
                  dense
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  v-model="apiSupplierForm.status"
                  :options="[
                    {
                      label: '开启',
                      value: '1',
                    },
                    {
                      label: '关闭',
                      value: '0',
                    },
                  ]"
                  label="状态"
                />
              </div>
              <div class="col-3">
                <q-select
                  outlined
                  dense
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  v-model="apiSupplierForm.api_group"
                  :options="enumData.groupData"
                  label="接口类型"
                  @input="changeGroup"
                  :disable="apiSupplierId > 0"
                />
              </div>

              <div class="col-3">
                <q-select
                  outlined
                  dense
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  v-model="apiSupplierForm.method"
                  :options="enumData.methodList"
                  label="请求方式"
                />
              </div>

              <div class="col-3">
                <q-select
                  outlined
                  dense
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  v-model="apiSupplierForm.request_format"
                  :options="enumData.protocolData"
                  label="请求数据格式"
                />
              </div>

              <div class="col-3">
                <q-select
                  outlined
                  dense
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  v-model="apiSupplierForm.response_format"
                  :options="enumData.protocolData"
                  label="响应数据格式"
                />
              </div>

              <div class="col-12">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle2">header数据</div>
                  </q-card-section>
                  <q-separator  />
                  <q-card-section class="q-pa-none">
                    <q-item :key="`${key}-header`" v-for="(item, key) in apiSupplierForm.header">
                      <q-item-section>
                        <q-select
                          outlined
                          dense
                          option-value="value"
                          option-label="label"
                          emit-value
                          map-options
                          v-model="item.type"
                          :options="enumData.groupTypeData"
                          label="类型"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input outlined v-model="item.key" dense label="参数名" />
                      </q-item-section>
                      <q-item-section v-if="item.type == 'custom'">
                        <q-input outlined v-model="item.value" dense label="参数值" />
                      </q-item-section>
                      <q-item-section v-else-if="item.type == 'local'">
                        <q-select
                          outlined
                          dense
                          option-value="key"
                          option-label="label"
                          emit-value
                          map-options
                          v-model="item.value"
                          :options="groupParamsData"
                          label="选择预定义参数"
                        />
                      </q-item-section>

                      <q-item-section>
                        <q-input outlined v-model="item.label" dense label="描述" />
                      </q-item-section>
                      <q-item-section side>
                        <q-btn unelevated color="negative" size="sm" round icon="las la-trash" :disable="item.value == 'local'" @click="removeHeaderData(key)"></q-btn>
                      </q-item-section>
                    </q-item>
                  </q-card-section>
                  <q-card-actions align="center">
                    <q-btn unelevated color="primary" class="q-px-md" @click="addHeaderData">新增</q-btn>
                  </q-card-actions>
                </q-card>
              </div>

              <div class="col-12">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle2">body数据</div>
                  </q-card-section>
                  <q-separator dark />
                  <q-card-section class="q-pa-none">
                    <q-item :key="`${key}-body`" v-for="(item, key) in apiSupplierForm.body">
                      <q-item-section>
                        <q-select
                          outlined
                          dense
                          option-value="value"
                          option-label="label"
                          emit-value
                          map-options
                          v-model="item.type"
                          :options="enumData.groupTypeData"
                          label="类型"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input outlined v-model="item.key" dense label="参数名" />
                      </q-item-section>
                      <q-item-section v-if="item.type == 'custom'">
                        <q-input outlined v-model="item.value" dense label="参数值" />
                      </q-item-section>
                      <q-item-section v-else-if="item.type == 'local'">

                        <q-select
                          outlined
                          dense
                          option-value="key"
                          option-label="label"
                          emit-value
                          map-options
                          v-model="item.value"
                          :options="groupParamsData"
                          label="选择预定义参数"
                        />
                      </q-item-section>

                      <q-item-section>
                        <q-input outlined v-model="item.label" dense label="描述" />
                      </q-item-section>
                      <q-item-section side>
                        <q-btn unelevated color="negative" size="sm" round icon="las la-trash" :disable="item.value == 'local'" @click="removeBodyData(key)"></q-btn>
                      </q-item-section>
                    </q-item>
                  </q-card-section>

                  <q-card-actions align="center">
                    <q-btn unelevated color="primary" @click="addBodyData" class="q-px-md">新增</q-btn>
                  </q-card-actions>
                </q-card>
              </div>

              <div class="col-12">
                <q-card flat bordered>
                  <q-card-section>
                    <div class="text-subtitle2">结果数据</div>
                  </q-card-section>
                  <q-separator dark />
                 <q-card-section class="q-pa-none">
                    <q-item :key="`${key}-result`" v-for="(item, key) in apiSupplierForm.result">
                      <q-item-section>
                        <q-select
                          outlined
                          dense
                          option-value="value"
                          option-label="label"
                          emit-value
                          map-options
                          v-model="item.type"
                          :options="enumData.groupTypeData"
                          label="类型"
                          :disable="item.type == 'local'"
                        />
                      </q-item-section>
                      <q-item-section>
                        <q-input :disable="item.type == 'local'" outlined v-model="item.key" dense label="参数名" />
                      </q-item-section>
                      <q-item-section v-if="item.type == 'custom'">
                        <q-input :disable="item.type == 'local'" outlined v-model="item.value" dense label="参数值" />
                      </q-item-section>
                      <q-item-section v-else-if="item.type == 'local'">

                        <q-select
                          outlined
                          dense
                          option-value="key"
                          option-label="label"
                          emit-value
                          map-options
                          v-model="item.value"
                          :options="groupParamsData"
                          :disable="item.type == 'local'"
                          label="选择预定义参数"
                        />
                      </q-item-section>

                      <q-item-section>
                        <q-input outlined v-model="item.label" :disable="item.type == 'local'" dense label="描述" />
                      </q-item-section>
                      <q-item-section side>
                        <q-btn unelevated color="negative" size="sm" round icon="las la-trash" :disable="item.type == 'local'" @click="removeBodyData(key)"></q-btn>
                      </q-item-section>
                    </q-item>
                  </q-card-section>

                  <q-card-actions align="center">
                    <q-btn unelevated color="primary" @click="setResultParams" class="q-px-md">新增</q-btn>
                  </q-card-actions>
                </q-card>
              </div>
            </q-form>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-pb-sm row q-gutter-sm text-center justify-center">
          <q-btn unelevated class="q-px-xl" label="保存" @click="saveData()" color="primary" />
          <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage()" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'EditSupplier',
  data () {
    return {
      addStoreSidebar: false,
      apiSupplierId: 0,
      apiSupplierForm: {
        name: '',
        api_group: '',
        api_url: '',
        method: 'POST',
        header: [],
        status: '1',
        body: [],
        result: [],
        request_format: '',
        response_format: '',
        response_success: [],
        response_fail: [],
        response_error: []
      },
      multiple: false,
      uploadImgStatus: false,
      enumData: {},
      groupParamsData: []
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init (id) {
      this.apiSupplierId = id
      this.addStoreSidebar = true
      this.getEmnuData()
      if (id > 0) {
        this.getItem()
      }
    },
    getItem () {
      this.$store.dispatch('apisupplier/getItem', this.apiSupplierId).then((res) => {
        if (res.code == 200 && res.data) {
          this.apiSupplierForm = res.data
          this.$nextTick(() => {
            this.changeGroup()
          })
        } else {
          this.$q.notify({
            message: '错误',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: res.message,
            color: 'red'
          })
        }
      })
    },
    changeGroup () {
      if (this.enumData) {
        if (this.enumData.groupParamsData) {
          this.groupParamsData = this.enumData.groupParamsData[this.apiSupplierForm.api_group]
        }

        this.setBodyParams()
        this.setResultParams()
      }
    },

    getEmnuData () {
      this.$store.dispatch('apisupplier/getEnumData').then((res) => {
        if (res.code == 200) {
          this.enumData = res.data
        }
      })
    },
    addHeaderData () {
      this.apiSupplierForm.header.push({
        label: '',
        key: '',
        value: '',
        type: 'custom',
        source: ''
      })
    },
    removeHeaderData (key) {
      this.apiSupplierForm.header.splice(key, 1)
    },

    setBodyParams () {
      const that = this
      if (this.enumData && this.enumData.groupRequestData && this.apiSupplierForm && this.apiSupplierForm.api_group) {
        const groupRequestData = this.enumData.groupRequestData[this.apiSupplierForm.api_group]
        if (groupRequestData && groupRequestData.length > 0) {
          groupRequestData.forEach(function (item, key) {
            that.apiSupplierForm.body.push(item)
          })
        }
      }
    },

    addBodyData () {
      this.apiSupplierForm.body.push({
        label: '',
        key: '',
        value: '',
        type: 'custom',
        source: ''
      })
    },

    removeBodyData (key) {
      this.apiSupplierForm.body.splice(key, 1)
    },

    setResultParams () {
      const that = this
      if (this.enumData && this.enumData.groupResponseData && this.apiSupplierForm && this.apiSupplierForm.api_group) {
        const groupResponseData = this.enumData.groupResponseData[this.apiSupplierForm.api_group]

        if (groupResponseData && groupResponseData.length > 0) {
          groupResponseData.forEach(function (item, key) {
            that.apiSupplierForm.result.push(item)
          })
        }
      }
    },

    addResultData () {
      this.apiSupplierForm.result.push({
        label: '',
        key: '',
        value: '',
        type: 'custom',
        source: ''
      })
    },

    removeResultData (key) {
      this.apiSupplierForm.result.splice(key, 1)
    },

    saveData () {
      this.$refs.apiSupplierRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.apiSupplierForm,
            id: this.apiSupplierId
          }
          this.$store
            .dispatch('apisupplier/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.addStoreSidebar = false
                this.$q.notify({
                  message: '成功',
                  caption: `${this.apiSupplierId > 0 ? '修改' : '新增'}` + '成功',
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
