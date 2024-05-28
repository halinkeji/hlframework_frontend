<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        基础信息
      </div>

      <div class="col-shrink q-pa-sm full-height bg-white ">
        <q-scroll-area class="fit full-height">
          <q-form ref="aliPayRef">
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="支付宝账户" :rules="[(val) => !!val || '必填项']" v-model="aliPayData.account_number" maxlength="100" placeholder="AccessKeyID">
                  <template v-slot:hint> 填写支付宝账户 </template></q-input
                >
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="合作伙伴身份（PID）" :rules="[(val) => !!val || '必填项']" v-model="aliPayData.pid" placeholder="合作伙伴身份（PID）" maxlength="100"
                  ><template v-slot:hint>
                    填写支付宝合作伙伴身份（PID）
                  </template></q-input
                >
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="合作伙伴MD5秘钥" :rules="[(val) => !!val || '必填项']" v-model="aliPayData.md5_key" maxlength="300" placeholder="合作伙伴MD5秘钥">
                  <template v-slot:hint> 填写支付宝合作伙伴MD5秘钥 </template>
                </q-input>
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="支付宝APPID" :rules="[(val) => !!val || '必填项']" v-model="aliPayData.app_id" maxlength="50" placeholder="支付宝APPID">
                  <template v-slot:hint> 填写支付宝APPID </template>
                </q-input>
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="签名类型" :rules="[(val) => !!val || '必填项']" v-model="aliPayData.sign_type" maxlength="50" placeholder="支付宝签名类型：RSA，RSA2(推荐RSA2)">
                  <template v-slot:hint> 填写支付宝签名类型 </template>
                </q-input>
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input
                  outlined
                  dense
                  label="支付宝公钥"
                  :rules="[(val) => !!val || '必填项']"
                  type="textarea"
                  v-model="aliPayData.public_key"
                  @input="aliPayData.rsa_public_key = aliPayData.public_key"
                  placeholder="重要：rsa2 的支付宝公钥(开放平台获取)内容粘贴到文本框内（去掉头-----BEGIN PUBLIC KEY-----）（去掉尾-----END PUBLIC KEY-----）"
                >
                  <template v-slot:hint>
                    填写支付宝公钥 ：rsa2 的支付宝公钥(开放平台获取)内容粘贴到文本框内（去掉头-----BEGIN PUBLIC KEY-----）（去掉尾-----END PUBLIC KEY-----）
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input
                  outlined
                  dense
                  label="支付宝RSA秘钥"
                  :rules="[(val) => !!val || '必填项']"
                  type="textarea"
                  v-model="aliPayData.private_key"
                  @input="aliPayData.rsa_private_key = aliPayData.private_key"
                  placeholder="重要：rsa与rsa2的私钥相同，将私钥内容粘贴到文本域内（去掉头-----BEGIN RSA PRIVATE KEY-----）（去掉尾-----END RSA PRIVATE KEY-----）"
                >
                  <template v-slot:hint> 填写支付宝RSA秘钥 ：rsa与rsa2的私钥相同，将私钥内容粘贴到文本域内（去掉头-----BEGIN RSA PRIVATE KEY-----）（去掉尾-----END RSA PRIVATE KEY-----）</template>
                </q-input>
              </div>
            </div>
          </q-form>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
        <q-btn class="q-px-xl" unelevated label="提交" v-if="authorityMeta('save')" @click="saveData" color="primary" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'alipay',
  components: {},
  data () {
    return {
      aliPayData: {
        account_number: '',
        pid: '',
        md5_key: '',
        app_id: '',
        sign_type: '',
        rsa_public_key: '',
        rsa_private_key: '',
        public_key: '',
        private_key: ''
      }
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
      this.$store.dispatch('aliPay/getItem').then((res) => {
        if (res.code == 200 && res.data) {
          res.data.public_key = '已隐藏'
          res.data.private_key = '已隐藏'

          this.aliPayData = res.data
        }
      })
    },
    // 提交
    saveData () {
      this.$refs.aliPayRef.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.aliPayData
          }
          this.$store
            .dispatch('aliPay/addData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: '修改信息成功',
                  color: 'green'
                })
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
