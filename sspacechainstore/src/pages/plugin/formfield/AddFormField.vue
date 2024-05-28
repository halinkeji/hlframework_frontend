<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.6 + 'px',
        'min-width': this.$q.screen.width * 0.6 + 'px',
      }"
      class="q-pa-md fit"
    >
      <q-form class="fit" ref="fieldDataRef">
        <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
          <div class="col-shrink bg-white q-px-xs">
            <q-card-section class="row items-center q-pa-none">
              <div class="text-h6">{{ formFieldData.id > 0 ? '修改' : '新增' }}字段</div>
              <q-space />
              <q-btn icon="close" flat round dense v-close-popup />
            </q-card-section>
          </div>

          <div class="col-shrink q-pa-sm full-height">
            <q-scroll-area class="fit full-height">
              <div class="row">
                <div class="col-12 col-md-7">
                  <q-input outlined dense v-model="formFieldData.pff_form_name" label="表单标题" lazy-rules :rules="[(val) => !!val || '请输入表单标题']" />
                </div>
                <div class="col-12 col-md-7">
                  <q-input outlined dense v-model="formFieldData.pff_form_remarks" label="备注" type="textarea" :rows="3" />
                </div>
              </div>
              <div class="row q-mt-md">
                <div class="col-12 col-md-5">
                  <q-select outlined dense v-model="typeId" :options="fieldTypeData" label="请选择类型" clearable emit-value map-options />
                </div>
                <div class="col-12 col-md-7">
                  <div class="q-pl-lg full-height">
                    <q-btn unelevated label="添加一个字段" :disable="parseInt(typeId) > 0 ? false : true" color="primary" class="full-height" @click="setField" />
                  </div>
                </div>
              </div>
              <div class="row q-mt-md">
                <div class="col-3">
                  字段名
                </div>
                <div class="col-1">
                  类型
                </div>
                <div class="col-1">
                  是否必填
                </div>
                <div class="col-7">
                  字段值
                </div>
              </div>
              <div flat bordered class="row q-mt-md items-center" v-for="(item, key) in fieldData" :key="key">
                <div class="col-3 row items-center q-pr-md">
                  <q-input outlined class="full-width" dense label="默认值" v-model="item.pff_field_label" :rules="[(val) => !!val || '请输入默认值']" />
                </div>

                <div class="col-1 q-pb-md">
                  <span v-if="item.pff_field_attribute == 'input'">单行文本</span>
                  <span v-else-if="item.pff_field_attribute == 'textarea'">多行文本</span>
                  <span v-else-if="item.pff_field_attribute == 'select'">下拉框</span>
                  <span v-else-if="item.pff_field_attribute == 'checkbox'">多选框</span>
                  <span v-else-if="item.pff_field_attribute == 'radio'">单选框</span>
                  <span v-else-if="item.pff_field_attribute == 'coverImage'">单图</span>
                  <span v-else-if="item.pff_field_attribute == 'loopImage'">多图</span>
                </div>
                <div class="col-1 q-pb-md">
                  <q-checkbox v-model="item.pff_is_required" true-value="1" false-value="0" />
                </div>

                <div class="col-7 row items-center">
                  <q-input
                    outlined
                    v-if="item.pff_field_attribute == 'input' || item.pff_field_attribute == 'textarea'"
                    class="col-8 q-ml-sm"
                    label="提示语"
                    dense
                    v-model="item.pff_field_placeholder"
                    :rules="[(val) => !!val || '请输入提示语']"
                  />
                  <q-input
                    outlined
                    v-if="item.pff_field_attribute == 'select' || item.pff_field_attribute == 'checkbox' || item.pff_field_attribute == 'radio'"
                    class="col-8 q-ml-sm"
                    label="一行一个选项"
                    dense
                    type="textarea"
                    :rows="4"
                    v-model="item.pff_field_param"
                    :rules="[(val) => !!val || '请输入选项']"
                  />
                  <div class="hull-height q-pb-md">
                    <q-btn unelevated color="red" dense @click="deleteField(item, key)" label="删除" class="q-ml-sm q-px-md" />
                  </div>
                </div>
              </div>
            </q-scroll-area>
          </div>

          <div class="col-shrink bg-white q-pb-sm q-gutter-sm text-center">
            <q-btn unelevated label="确定" class="q-px-xl" :disable="addButtonDisabled" color="primary" @click="setData" />
            <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup />
          </div>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddFormField',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      formFieldData: {
        pff_form_name: '',
        pff_form_remarks: ''
      },
      typeId: '',
      fieldData: [],
      fieldTypeData: [
        { value: 1, label: '单行文本' },
        { value: 2, label: '多行文本' },
        { value: 3, label: '下拉框' },
        { value: 4, label: '多选框' },
        { value: 5, label: '单选框' }
      ]
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    // 添加字段
    setField () {
      switch (this.typeId) {
        case 1:
          this.fieldData.push({
            pff_field_attribute: 'input',
            pff_is_required: '1',
            pff_field_label: '',
            pff_field_placeholder: ''
          })
          break
        case 2:
          this.fieldData.push({
            pff_field_attribute: 'textarea',
            pff_is_required: '1',
            pff_field_label: '',
            pff_field_placeholder: ''
          })
          break
        case 3:
          this.fieldData.push({
            pff_field_attribute: 'select',
            pff_is_required: '1',
            pff_field_label: '',
            pff_field_param: ''
          })
          break
        case 4:
          this.fieldData.push({
            pff_field_attribute: 'checkbox',
            pff_is_required: '1',
            pff_field_label: '',
            pff_field_param: ''
          })
          break
        case 5:
          this.fieldData.push({
            pff_field_attribute: 'radio',
            pff_is_required: '1',
            pff_field_label: '',
            pff_field_param: ''
          })
          break
      }
    },
    deleteField (item, key) {
      this.fieldData.splice(key, 1)
      this.$q.notify({
        message: '成功',
        caption: '删除成功！',
        icon: 'ion-checkmark-circle-outline',
        color: 'green',
        timeout: 500,
        position: 'top-right'
      })
      if (item.id > 0) {
        const params = {
          id: item.id
        }
        this.$store
          .dispatch('formfield/delField', params)
          .then((res) => {})
          .catch((err) => {
            this.$q.notify({
              message: '失败',
              caption: err.message,
              color: 'red',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.$store
          .dispatch('formfield/getItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.formFieldData = res.data ? res.data : {}
              if (res.data.field.length > 0) {
                this.fieldData = res.data.field.map((item) => {
                  return {
                    id: item.id,
                    pff_field_attribute: item.pff_field_attribute,
                    pff_is_required: item.pff_is_required,
                    pff_field_label: item.pff_field_label,
                    pff_field_placeholder: item.pff_field_placeholder,
                    pff_field_param: item.pff_field_param.replace(/,/g, '\n')
                  }
                })
              }
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            }
          })
          .catch((err) => {
            this.$q.notify({
              message: '失败',
              caption: err.message,
              color: 'red',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    setData () {
      this.$refs.fieldDataRef.validate().then((success) => {
        if (success) {
          if (this.fieldData.length <= 0) {
            this.$q.notify({
              message: '失败',
              caption: '请添加字段',
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            return false
          }
          this.addButtonDisabled = true
          const params = {
            ...this.formFieldData,
            fieldData: this.fieldData
          }
          this.$store
            .dispatch('formfield/setData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.formFieldData.id > 0 ? '修改' : '新增'}` + '自定义表单成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.showDialog = false
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.addButtonDisabled = false
              }
            })
            .catch((err) => {
              this.$q.notify({
                message: '失败',
                caption: err.message,
                color: 'red',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },
    hideNowPage () {
      this.$emit('dataList')
      this.addButtonDisabled = false
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
