<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        基础信息
      </div>

      <div class="col-shrink full-height bg-grey-2">
        <q-scroll-area class="fit full-height bg-white">
          <q-card flat class=" q-pa-md">
            <q-form ref="typeDataRef">
              <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />短信服务是根据阿里云短信接口服务进行对接，配置信息请联系阿里云</div>
              <q-separator />
              <div class="row q-my-sm">
                <div class="col-8 col-md-6  q-ml-md">
                  <q-input outlined dense label="AccessKeyID" :rules="[(val) => !!val || '必填项']" v-model="dataForm.si_accessKeyID" placeholder="AccessKeyID">
                    <template v-slot:hint>
                      填写阿里云短信的AccessKeyID
                    </template></q-input
                  >
                </div>
              </div>
              <div class="row q-my-sm">
                <div class="col-8 col-md-6 q-ml-md">
                  <q-input outlined dense label="AccessKeySecret" :rules="[(val) => !!val || '必填项']" v-model="dataForm.si_accessKeySecret" placeholder="公众号帐号"
                    ><template v-slot:hint>
                      填写阿里云短信的AccessKeySecret
                    </template></q-input
                  >
                </div>
              </div>
              <div class="row q-my-sm">
                <div class="col-8 col-md-6 q-ml-md">
                  <q-input outlined dense label="签名名称" :rules="[(val) => !!val || '必填项']" v-model="dataForm.si_signName" placeholder="签名名称">
                    <template v-slot:hint> 签名名称，请谨慎填写 </template>
                  </q-input>
                </div>
              </div>
              <div class="row q-my-sm">
                <div class="col-8 col-md-6 q-ml-md">
                  <q-select
                    class="col-12 col-md-2"
                    outlined
                    label="短信设置开关"
                    bottom-slots
                    v-model="dataForm.si_status"
                    :options="[
                      { label: '开启', value: '1' },
                      { label: '关闭', value: '2' },
                    ]"
                    dense
                    emit-value
                    map-options
                  >
                    <template v-slot:hint> 短信设置开关 </template>
                  </q-select>
                </div>
              </div>
            </q-form>
          </q-card>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-py-sm text-center q-mt-xs">
        <q-btn unelevated color="primary" @click="saveBut()" :disable="addStoreSidebar" class="q-px-xl" label="提交" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'smsmarketIndex',
  data () {
    return {
      dataForm: {
        id: '',
        si_interFaceId: '1',
        si_accessKeyID: '',
        si_accessKeySecret: '',
        si_signName: '',
        si_appSecret: '',
        si_status: '1'
      },
      addStoreSidebar: false
    }
  },
  computed: {},
  created () {},
  mounted () {
    this.getSmsInfo()
  },
  methods: {
    getSmsInfo () {
      this.$store.dispatch('alSms/getItem', this.$route.params.id).then((res) => {
        if (res.code == 200) {
          this.dataForm = res.data ? res.data : {}
          this.dataForm.si_status = res.data.si_status.toString()
        }
      })
    },
    saveBut () {
      this.$refs.typeDataRef.validate().then((success) => {
        if (success) {
          this.addStoreSidebar = false
          const obj = {
            ...this.dataForm
          }
          this.$store
            .dispatch('alSms/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                if (this.dataForm.id > 0) {
                  this.$q.notify({
                    message: '成功',
                    caption: '修改短信配置信息成功',
                    icon: 'ion-checkmark-circle-outline',
                    color: 'green',
                    position: 'top-right'
                  })
                } else {
                  this.$q.notify({
                    message: '新增短信配置信息成功',
                    color: 'green',
                    icon: 'ion-checkmark-circle-outline',
                    timeout: 500,
                    position: 'top-right'
                  })
                }
                this.getSmsInfo()
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                position: 'top-right'
              })
            })
        }
      })
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
