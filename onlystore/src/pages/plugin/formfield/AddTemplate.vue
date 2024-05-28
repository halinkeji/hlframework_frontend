<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.4 + 'px',
        'min-width': this.$q.screen.width * 0.4 + 'px',
      }"
      class="q-pa-md fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md row">
          <div class="text-subtitle2">
            {{ fieldTemplateData.id > 0 ? '修改' : '新增' }}
          </div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>

        <div class="col-shrink q-pa-sm full-height bg-grey-2">
          <q-scroll-area class="fit full-height">
            <q-form ref="addTemplateRef">
              <div v-if="fieldData">
                <div v-for="(item, key) in fieldData" :key="key">
                  <div v-if="item.pff_field_attribute == 'input'" class="q-mb-sm">
                    <q-input
                      outlined
                      dense
                      v-model="fieldTemplateData[item.pff_field_name]"
                      :label="item.pff_field_label"
                      :placeholder="item.pff_field_placeholder"
                      :rules="[(val) => (parseInt(item.pff_is_required) != 1 ? true : !!val && parseInt(item.pff_is_required) == 1 ? true : false) || item.pff_field_label + '为必填项']"
                    />
                  </div>
                  <div v-if="item.pff_field_attribute == 'textarea'" class="q-mb-sm">
                    <q-input outlined dense v-model="fieldTemplateData[item.pff_field_name]" :label="item.pff_field_label" :placeholder="item.pff_field_placeholder" type="textarea" :rows="3" />
                  </div>
                  <div v-if="item.pff_field_attribute == 'select'" class="q-mb-sm">
                    <q-select
                      outlined
                      dense
                      v-model="fieldTemplateData[item.pff_field_name]"
                      :options="item.pff_field_param"
                      :label="item.pff_field_label"
                      clearable
                      emit-value
                      map-options
                      :rules="[(val) => (parseInt(item.pff_is_required) != 1 ? true : !!val && parseInt(item.pff_is_required) == 1 ? true : false) || item.pff_field_label + '为必填项']"
                    />
                  </div>

                  <div v-if="item.pff_field_attribute == 'checkbox'" class="q-mb-sm">
                    <q-field
                      outlined
                      v-model="fieldTemplateData[item.pff_field_name]"
                      :label="item.pff_field_label"
                      stack-label
                      :rules="[(val) => (parseInt(item.pff_is_required) != 1 ? true : val.length > 0 && parseInt(item.pff_is_required) == 1 ? true : false) || item.pff_field_label + '为必填项']"
                    >
                      <template v-slot:control>
                        <q-checkbox v-model="fieldTemplateData[item.pff_field_name]" :val="i" :label="i" v-for="(i, k) in item.pff_field_param" :key="k" />
                      </template>
                    </q-field>
                  </div>
                  <div v-if="item.pff_field_attribute == 'radio'" class="q-mb-sm">
                    <q-field
                      outlined
                      v-model="fieldTemplateData[item.pff_field_name]"
                      :label="item.pff_field_label"
                      stack-label
                      :rules="[(val) => (parseInt(item.pff_is_required) != 1 ? true : !!val && parseInt(item.pff_is_required) == 1 ? true : false) || item.pff_field_label + '为必填项']"
                    >
                      <template v-slot:control>
                        <q-radio v-model="fieldTemplateData[item.pff_field_name]" :val="i" :label="i" v-for="(i, k) in item.pff_field_param" :key="k" />
                      </template>
                    </q-field>
                  </div>
                </div>
              </div>
            </q-form>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-pb-sm q-gutter-sm text-center ">
          <q-btn unelevated color="primary" label="保存" @click="setData" class="q-px-xl"  />
          <q-btn unelevated label="关闭" class="q-px-xl" color="grey" v-close-popup  />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddTemplate',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      formId: '',
      tableName: {
        name: ''
      },
      fieldTemplateData: {},
      fieldData: []
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    getList (idData) {
      const params = idData
      this.$store
        .dispatch('formfield/getFormFieldList', params)
        .then((res) => {
          if (res.code == 200) {
            this.tableName.name = res.data.formField.pff_table_name
            this.fieldData = res.data.formField.field
            this.fieldTemplateData = res.data.formData ? res.data.formData : {}
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
    },
    setData () {
      this.$refs.addTemplateRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          const params = {
            ...this.tableName,
            fieldTemplateData: this.fieldTemplateData
          }
          this.$store
            .dispatch('formfield/setFormData', params)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.fieldTemplateData.id > 0 ? '修改' : '新增'}` + '成功',
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
