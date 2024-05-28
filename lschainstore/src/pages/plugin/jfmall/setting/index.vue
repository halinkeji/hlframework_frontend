<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        基础设置
      </div>
      <div class="col-shrink  full-height bg-grey-2 q-mt-xs">
        <div style="overflow-y: scroll;" class="fit full-height bg-white">
          <q-card flat class="q-pa-sm">
            <q-form ref="addSettingRef">
              <div class="row">
                <div class="col-6 q-mt-sm row">
                  <div class="col-12">
                    <q-input outlined label="商户名称" class="q-pr-sm" dense v-model="settingForm.js_name" lazy-rules :rules="[(val) => !!val || '请输入商户名称']" />
                  </div>

                  <div class="col-6">
                    <q-input outlined label="联系人" class="q-pr-sm" dense v-model="settingForm.js_contact_person" lazy-rules :rules="[(val) => !!val || '请输入联系人名称']" />
                  </div>

                  <div class="col-6">
                    <q-input
                      outlined
                      label="联系电话"
                      class="q-pr-sm"
                      dense
                      v-model="settingForm.js_contact_phone"
                      lazy-rules
                      :rules="[(val) => /^1[3|4|5|7|8][0-9]{9}$/.test(val) || '请输入正确的联系电话']"
                    />
                  </div>

                  <div class="col-12 q-pr-sm">
                    <q-input outlined label="地址" dense lazy-rules v-model="settingForm.js_address" :rules="[(val) => !!val || '请输入地址']" />
                  </div>

                  <div class="col-12  q-pr-sm">
                    <q-select
                      v-model="settingForm.js_is_share"
                      outlined
                      dense
                      :label="`${$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit}商城和${$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit}兑换购物车是否共享`"
                      :options="activeStatus"
                      option-value="value"
                      option-label="label"
                      :error="false"
                      emit-value
                      map-options
                    />
                  </div>
                </div>
                <div class="col-1 q-pr-sm text-center">

                  <hl-upload
                    :multiple="false"
                    :currentAttach="settingForm.logoImage"
                    @input="(val)=>{ $nextTick(()=>{ settingForm.js_logo = val })}"
                    currentTitle="商户logo"
                    currentDescription="建议尺寸比例1:1"
                  />

                </div>
              </div>
              <div class="row">
                <div class="col-12 col-md-6 q-pr-sm">
                  <q-input outlined label="评价规则" dense type="textarea" lazy-rules :rows="2" v-model="settingForm.js_evaluation_rules" :rules="[(val) => !!val || '请输入评价规则']" />
                </div>
                <div class="col-12 col-md-6 q-pr-sm">
                  <q-input outlined label="服务说明" dense type="textarea" :rows="2" v-model="settingForm.js_service_description" lazy-rules :rules="[(val) => !!val || '请输入服务说明']" />
                </div>
                <div class="col-12 q-mr-sm">
                  <hl-editor
                    @change="
                      (v) => {
                        settingForm.js_description = v
                      }
                    "
                    :content="settingForm.js_description"
                    :minHeight="$q.screen.height * 0.4"
                    titleText="商户简介"
                  ></hl-editor>
                </div>
              </div>
            </q-form>
          </q-card>
        </div>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
        <q-btn class="q-px-xl" label="提交" :disable="submitDisable" @click="saveData()" color="primary" unelevated />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'AddColumn',
  components: {},
  data () {
    return {
      sign: 0,
      settingForm: {
        js_name: '',
        js_logo: '',
        js_description: '',
        js_contact_person: '',
        js_contact_phone: '',
        js_address: '',
        js_evaluation_rules: '',
        js_service_description: '',
        js_is_share: 0
      },
      activeStatus: [
        {
          value: 1,
          label: '开启'
        },
        {
          value: 0,
          label: '关闭'
        }
      ],
      stop: false
    }
  },
  mounted () {},
  created () {
    this.getItem()
  },
  computed: {},
  methods: {
    // 获取单条
    getItem () {
      this.$store.dispatch('jfsetting/getItem', null).then((res) => {
        if (parseInt(res.code) == 200) {
          this.settingForm = res.data ? res.data : this.settingForm
        }
      })
    },
    // 提交
    saveData () {
      this.$refs.addSettingRef.validate().then((success) => {
        if (success) {
          this.stop = true
          const obj = {
            ...this.settingForm
          }
          this.$store
            .dispatch('jfsetting/setData', obj)
            .then((res) => {
              if (parseInt(res.code) == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '修改成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.stop = false
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
              this.stop = false
            })
        }
      })
    }
  }
}
</script>
