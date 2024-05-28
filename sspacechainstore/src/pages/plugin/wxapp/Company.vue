<template>
    <q-dialog persistent v-model="editDialogStatus">
      <q-card
        :style="{
          width: parseInt($q.screen.width * 0.3) + 'px',
          'max-width': parseInt($q.screen.width * 0.3) + 'px',
        }"
        class="q-pa-sm"
      >
        <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
          <div class="col-shrink bg-white row q-px-xs q-pb-md">
            <div class="text-subtitle2">填写注册信息</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="closeDialog" />
          </div>
          <div class="col-shrink q-pa-sm full-height bg-white">

              <q-form ref="companyFormRef">
                <q-input outlined bottom-slots dense v-model="companyForm.company_name" label="企业名称" :rules="[(val) => !!val || '请输入企业名称']"></q-input>

                <q-select
                  dense
                  outlined
                  map-options
                  emit-value
                  option-label="label"
                  option-value="value"
                  v-model="companyForm.company_code_type"
                  :options="companyCodeTypeData"
                  label="代码类型"
                  class="q-mb-md"
                />

                <q-input outlined bottom-slots dense v-model="companyForm.company_code" label="企业代码" :rules="[(val) => !!val || '请输入企业代码']">
                </q-input>

                <q-input
                  outlined
                  bottom-slots
                  dense
                  v-model="companyForm.company_lega_person_name"
                  label="法人姓名"
                  :rules="[(val) => !!val || '请输入法人姓名']"
                >
                </q-input>

                <q-input
                  outlined
                  bottom-slots
                  dense
                  v-model="companyForm.company_lega_person_wechat"
                  label="法人微信"
                  :rules="[(val) => !!val || '请输入法人微信']"
                >
                </q-input>
              </q-form>
          </div>
          <div class="col-shrink bg-white q-pb-sm row q-gutter-sm text-center justify-center">
            <q-btn unelevated class="q-px-xl" label="提交" @click="saveCompany" color="primary" />
            <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="closeDialog" />
          </div>
        </div>
      </q-card>
    </q-dialog>
</template>
<script>
export default {
  name: 'Company',
  components: {},
  data () {
    return {

      companyForm: {
        id: '',
        company_name: '',
        company_code_type: '1',
        company_code: '',
        company_lega_person_name: '',
        company_lega_person_wechat: '',
        wf_status: 1
      },
      companyCodeTypeObject: this.$store.state.wxapp.companyCodeTypeObject,
      editDialogStatus: false,
      companyCodeTypeData: this.$store.state.wxapp.companyCodeTypeData,
      currentCompanyId: 0,
      companyStatusObject: this.$store.state.wxapp.companyStatusObject
    }
  },

  mounted () {

  },
  created () {},
  computed: {},
  methods: {
    init () {
      this.editDialogStatus = true
      this.$nextTick(() => {
        this.getCompanyInfo()
      })
    },

    saveCompany () {
      this.$refs.companyFormRef.validate().then(success => {
        if (success) {
          this.$store
            .dispatch('wxapp/setCompanyData', {
              ...this.companyForm
            })
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '添加成功',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.closeDialog()
                })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
            })
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      })
    },

    deleteSecretKey (item) {
      this.$q
        .dialog({
          title: '删除',
          message: `确认删除企业名称为 ${item.company_name} 的企业信息吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.$store
            .dispatch('wxapp/deleteCompanyData', item.id)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '删除成功',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.closeDialog()
                })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 500,
                position: 'top-right'
              })
            })
        })
        .onOk(() => {
          // console.log('>>>> second OK catcher')
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        })
    },
    setCompanyData (companyId) {
      this.editDialogStatus = true
      this.currentCompanyId = companyId
      if (this.currentCompanyId > 0) {
        this.$nextTick(() => {
          this.getCompanyInfo()
        })
      }
    },
    getCompanyInfo () {
      this.$store
        .dispatch('wxapp/getCompanyData')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.companyForm = res.data ? res.data : {}
          }
        })
        .catch((error) => {})
    },
    closeDialog () {
      this.editDialogStatus = false
      this.$emit('closeDialog')
    }

  }
}
</script>
