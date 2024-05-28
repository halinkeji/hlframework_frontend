<template>
  <q-page class="fit bg-grey-3">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        基础设置
      </div>
      <div class="col-shrink  full-height bg-white">
        <q-scroll-area class="fit full-height">
          <q-card flat class="q-pa-md ">
            <q-form ref="configRef">
              <div class="row">

                <div class="q-pl-md col-5">

                  <div class="q-mt-sm">
                    <q-select
                      outlined
                      dense
                      clearable
                      v-model="configData.ppc_form_id"
                      :options="formFieldOptions"
                      label="请选择申请合伙人关联表单"
                      option-value="id"
                      option-label="pff_form_name"
                      emit-value
                      map-options
                    />
                  </div>
                  <div class="q-mt-sm">
                    <q-select outlined dense v-model="configData.ppc_is_check" :options="checkOptions" label="是否需要审核" emit-value map-options />
                  </div>
                  <div class="q-mt-sm">
                    <q-select outlined dense v-model="configData.ppc_is_bind" :options="buyStatusOptions" label="是否主动绑定会员合伙人" emit-value map-options />
                  </div>
                  <div class="q-mt-sm">
                    <q-select outlined dense v-model="configData.ppc_is_apply" :options="buyStatusOptions" label="是否可以申请会员合伙人" emit-value map-options />
                  </div>
                  <div class="q-mt-sm">
                    <hl-upload
                      :multiple="false"
                      :currentAttach="configData.coverImage"
                      @input="(val)=>{ $nextTick(()=>{ configData.ppc_cover_image = val })}"
                      currentTitle="合伙人页面展示的图片"
                      currentDescription="尺寸建议宽度为750*250"
                      />

                  </div>
                    <div class="q-mt-sm">
                    <hl-upload
                      :multiple="false"
                      :currentAttach="configData.posterImage"
                      @input="(val)=>{ $nextTick(()=>{ configData.ppc_poster = val })}"
                      currentTitle="推广二维码的海报"
                      currentDescription="尺寸建议宽度为600*800"
                      />
                  </div>
                </div>
              </div>
            </q-form>
          </q-card>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-py-sm text-center q-mt-xs">
        <q-btn unelevated label="保存" class="q-px-lg" color="primary" @click="setData" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'partnerConfig',
  components: {},
  data () {
    return {
      configData: {
        ppc_form_id: '',
        ppc_is_check: '-1',
        ppc_is_bind: '-1',
        ppc_is_apply: '-1',
        ppc_cover_image: '',
        ppc_poster: ''
      },
      formFieldOptions: [],
      checkOptions: [
        { label: '需要审核', value: '-1' },
        { label: '不需要审核', value: '1' }
      ],
      buyStatusOptions: [
        { label: '否', value: '-1' },
        { label: '是', value: '1' }
      ]
    }
  },
  created () {
    this.getFormFieldList()
    this.getList()
  },
  mounted () {},
  computed: {},
  methods: {
    getFormFieldList () {
      this.$store
        .dispatch('formfield/getFormFieldFormList')
        .then((res) => {
          if (res.code == 200) {
            this.formFieldOptions = res.data ? res.data : []
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
    getList () {
      this.$store
        .dispatch('partner/getData')
        .then((res) => {
          if (res.code == 200) {
            this.configData = res.data ? res.data : this.configData
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
      this.$refs.configRef.validate().then((success) => {
        if (success) {
          // if (!this.configData.ppc_cover_image) {
          //   this.$q.notify({
          //     message: '提示',
          //     caption: '请设置申请合伙人页面展示的图片',
          //     color: 'red',
          //     icon: 'ion-close-circle-outline',
          //     timeout: 500,
          //     position: 'top-right'
          //   })
          //   return false
          // }
          // if (!this.configData.ppc_poster) {
          //   this.$q.notify({
          //     message: '提示',
          //     caption: '请设置推广二维码的海报',
          //     color: 'red',
          //     icon: 'ion-close-circle-outline',
          //     timeout: 500,
          //     position: 'top-right'
          //   })
          //   return false
          // }
          const data = {
            ...this.configData
          }
          this.$store
            .dispatch('partner/setConfigData', data)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '保存成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
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
      })
    }

  }
}
</script>
