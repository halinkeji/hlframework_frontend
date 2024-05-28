<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink full-height bg-grey-2">
      <div style="overflow-y: scroll" class="fit full-height">
        <q-card flat class="q-pa-sm">
          <q-form ref="dataFrom" class="row q-gutter-sm">
            <!-- <div
              class="col-12"
              v-if="companyForm && companyForm.id && (parseInt(companyForm.wf_status) == 1 || parseInt(companyForm.wf_status) == 3)"
            >
              <div class="row full-width q-gutter-sm">
                <div class="col-6">
                  <q-banner inline-actions rounded class="text-white bg-primary">
                    认证中...
                    <template v-slot:action>
                      <q-btn @click="openDialog" unelevated color="orange" label="修改企业信息" />
                    </template>
                  </q-banner>
                </div>
                <div class="col-6">
                  <q-input
                    outlined
                    bottom-slots
                    readonly
                    dense
                    v-model="companyForm.company_name"
                    label="企业名称"
                    :rules="[(val) => !!val || '请输入企业名称']"
                  ></q-input>
                </div>
                <div class="col-6">
                  <q-select
                    dense
                    outlined
                    map-options
                    emit-value
                    readonly
                    option-label="label"
                    option-value="value"
                    v-model="companyForm.company_code_type"
                    :options="companyCodeTypeData"
                    label="代码类型"
                    bottom-slots
                  />
                </div>
                <div class="col-6">
                  <q-input
                    outlined
                    bottom-slots
                    dense
                    v-model="companyForm.company_code"
                    label="企业代码"
                    :rules="[(val) => !!val || '请输入企业代码']"
                  >
                  </q-input>
                </div>
                <div class="col-6">
                  <q-input
                    outlined
                    bottom-slots
                    dense
                    readonly
                    v-model="companyForm.company_lega_person_name"
                    label="法人姓名"
                    :rules="[(val) => !!val || '请输入法人姓名']"
                  >
                  </q-input>
                </div>
                <div class="col-6">
                  <q-input
                    outlined
                    bottom-slots
                    dense
                    readonly
                    v-model="companyForm.company_lega_person_wechat"
                    label="法人微信"
                    :rules="[(val) => !!val || '请输入法人微信']"
                  >
                  </q-input>
                </div>
              </div>
            </div> -->

            <div class="col-12" >
              <q-banner inline-actions rounded class="text-white bg-positive">
                还没有微信小程序？快速注册认证微信小程序。
                无需300元认证费,只需提供法人姓名、法人微信、企业名称、企业代码，采用法人人脸识别方式替代小额打款等认证流程。
                <q-btn round color="warning" flat icon="las la-question-circle" target="_blank" type="a" href="https://developers.weixin.qq.com/doc/oplatform/Third-party_Platforms/2.0/product/Register_Mini_Programs/Fast_Registration_Interface_document.html">
                <q-tooltip>
                  【快速注册企业小程序介绍】
                </q-tooltip>
                </q-btn>
                <template v-slot:action>
                  <q-btn @click="openDialog" unelevated color="orange" label="申请注册" />
                </template>
              </q-banner>
            </div>

            <div class="col-12">
              <q-icon name="las la-square-full" class="text-primary" />
              一、填写小程序信息
            </div>
            <div class="col-12">
              <q-separator />
            </div>
            <div class="col-6">
              <q-input
                outlined
                dense
                label="微信小程序名称"
                :rules="[(val) => !!val || '必填项']"
                v-model="dataFrom.pwa_name"
                placeholder="请输入微信小程序名称"
              >
                <template v-slot:hint> 填写微信小程序名称 </template></q-input
              >
            </div>

            <div class="col-6">
              <q-input
                outlined
                dense
                label="AppId"
                :rules="[(val) => !!val || 'AppId必填项']"
                v-model="dataFrom.pwa_app_id"
                placeholder="请输入AppId"
              >
                <template v-slot:hint> 填写AppId </template></q-input
              >
            </div>

            <div class="col-6">
              <q-input
                outlined
                dense
                label="AppSecret"
                :rules="[(val) => !!val || 'AppSecret必填项']"
                v-model="dataFrom.pwa_app_secret"
                placeholder="请输入AppSecret"
              >
                <template v-slot:hint> 填写AppSecret </template>
              </q-input>
            </div>

            <div class="col-6">
              <q-input
                outlined
                dense
                label="微信小程序帐号"
                :rules="[(val) => !!val || '必填项']"
                v-model="dataFrom.pwa_account"
                placeholder="请输入微信小程序帐号"
              >
                <template v-slot:hint> 填写微信小程序帐号 </template></q-input
              >
            </div>

            <div class="col-6">
              <q-input outlined dense label="原始ID" :rules="[(val) => !!val || '必填项']" v-model="dataFrom.pwa_original" placeholder="请输入原始ID">
                <template v-slot:hint> 填写原始ID </template></q-input
              >
            </div>

            <div class="col-6">
              <hl-upload
                :multiple="false"
                :currentAttach="dataFrom.avatarImage"
                @input="
                  (val) => {
                    $nextTick(() => {
                      dataFrom.pwa_avatar = val;
                    });
                  }
                "
                currentTitle="小程序logo"
                currentDescription="建议尺寸比例1:1"
              />
            </div>
            <div class="col-6">
              <hl-upload
                :multiple="false"
                :currentAttach="dataFrom.qrcodeImage"
                @input="
                  (val) => {
                    $nextTick(() => {
                      dataFrom.pwa_qrcode = val;
                    });
                  }
                "
                currentTitle="小程序二维码"
                currentDescription="建议尺寸比例1:1"
              />
            </div>

            <div class="col-12 q-mt-lg">
              <q-icon name="las la-square-full" class="text-primary" />
              二、配置服务器域名
              <div class="text-caption text-grey-8">
                登录小程序公众平台(mp.weixin.qq.com)在[开发]-[开发管理]-[开发设置]-[服务器域名]，配置以下信息：
              </div>
            </div>
            <div class="col-12">
              <q-separator />
            </div>

            <div class="col-6">
              <q-input outlined dense readonly label="request合法域名" v-model="defaultData.request_url">
                <template v-slot:after>
                  <q-btn unelevated color="primary" @click="copyData(defaultData.request_url)" label="复制"></q-btn>
                </template>
              </q-input>
            </div>

            <div class="col-6">
              <q-input outlined dense readonly label="socket合法域名" v-model="defaultData.socket_url">
                <template v-slot:after>
                  <q-btn unelevated color="primary" @click="copyData(defaultData.socket_url)" label="复制"></q-btn>
                </template>
              </q-input>
            </div>

            <div class="col-6">
              <q-input outlined dense readonly label="uploadFile合法域名" v-model="defaultData.uploadFile_url">
                <template v-slot:after>
                  <q-btn unelevated color="primary" @click="copyData(defaultData.uploadFile_url)" label="复制"></q-btn>
                </template>
              </q-input>
            </div>

            <div class="col-6">
              <q-input outlined dense readonly label="downloadFile合法域名" v-model="defaultData.downloadFile_url">
                <template v-slot:after>
                  <q-btn unelevated color="primary" @click="copyData(defaultData.serves_url)" label="复制"></q-btn>
                </template>
              </q-input>
            </div>

            <div class="col-12 q-mt-lg">
              <q-icon name="las la-square-full" class="text-primary" />
              三、配置消息推送
              <div class="text-caption text-grey-8">
                登录微信小程序后台(mp.weixin.qq.com)在[开发]-[开发管理]-[开发设置]-[消息推送]，点击启用，配置以下信息：
              </div>
              <div class="text-caption text-red">注意：填写完成以下信息后需先点击下方保存按钮，再在小程序后台点击提交按钮，否则会校验失败。</div>
            </div>
            <div class="col-12">
              <q-separator />
            </div>

            <div class="col-6">
              <q-input outlined dense readonly label="URL(服务器地址)" v-model="defaultData.serves_url">
                <template v-slot:after>
                  <q-btn unelevated color="primary" @click="copyData(defaultData.serves_url)" label="复制"></q-btn>
                </template>
              </q-input>
            </div>

            <div class="col-6">
              <q-input outlined dense label="Token(令牌)：" v-model="dataFrom.pwa_token">
                <template v-slot:after>
                  <q-btn unelevated color="primary" @click="createTokenString" label="一键生成"></q-btn>
                </template>
              </q-input>
            </div>

            <div class="col-6">
              <q-input outlined dense label="EncodingAESKey(消息加密密钥)：" v-model="dataFrom.pwa_encoding_aes_key">
                <template v-slot:after>
                  <q-btn unelevated color="primary" @click="createKeyString" label="一键生成"></q-btn>
                </template>
              </q-input>
            </div>

            <div class="col-6">
              <q-input outlined dense readonly label="消息加密方式" v-model="defaultData.signType"> </q-input>
            </div>
            <div class="col-6">
              <q-input outlined dense readonly label="数据格式" v-model="defaultData.dataFormat"> </q-input>
            </div>

            <div class="col-12 q-mt-lg">
              <q-icon name="las la-square-full" class="text-primary" />
              四、配置服务条款与隐私政策
            </div>
            <div class="col-12">
              <q-separator />
            </div>

            <div class="col-12 row q-col-gutter-sm">
              <div class="col-6">
                <hl-editor
                  @change="
                    (v) => {
                      dataFrom.pwa_service_terms = v;
                    }
                  "
                  :content="dataFrom.pwa_service_terms"
                  titleText="服务条款"
                  :minHeight="$q.screen.height * 0.4"
                ></hl-editor>
              </div>

              <div class="col-6">
                <hl-editor
                  @change="
                    (v) => {
                      dataFrom.pwa_privacy_policy = v;
                    }
                  "
                  :content="dataFrom.pwa_privacy_policy"
                  titleText="隐私政策"
                  :minHeight="$q.screen.height * 0.4"
                ></hl-editor>
              </div>
            </div>
          </q-form>
        </q-card>
      </div>
    </div>
    <company-manage ref="companyManageRef" v-if="companyDialogStatus" @closeDialog="closeDialog" />
    <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
      <q-btn unelevated color="primary" label="保存" class="q-px-xl" :disable="addSidebar" @click="saveBut()" />
    </div>
  </div>
</template>

<script>
import CompanyManage from './Company.vue'
import { copyToClipboard } from 'quasar'
export default {
  name: 'wxapp',
  components: {
    CompanyManage
  },
  data () {
    return {
      dataFrom: {
        pwa_name: '',
        pwa_description: '',
        pwa_account: '',
        pwa_original: '',
        pwa_app_id: '',
        pwa_app_secret: '',
        pwa_avatar: '',
        pwa_qrcode: '',
        pwa_service_terms: '',
        pwa_privacy_policy: '',
        pwa_token: '',
        pwa_encoding_aes_key: ''
      },
      addSidebar: false,

      defaultData: {
        signType: '安全模式',
        dataFormat: 'JSON',
        request_url: '',
        socket_url: '',
        uploadFile_url: '',
        downloadFile_url: '',
        serves_url: ''
      },
      companyDialogStatus: false,
      companyForm: {},
      companyCodeTypeData: this.$store.state.wxapp.companyCodeTypeData
    }
  },
  created () {
    this.setConfig()
  },
  mounted () {
    this.getCompanyInfo()
    this.getItemData()
  },

  computed: {},
  methods: {
    setConfig () {
      const systemLocal = this.$q.localStorage.getItem('myouka_system_local')
      if (systemLocal.systemInfo) {
        const wurl = require('wurl')
        const systemInfo = systemLocal.systemInfo
        const hostname = wurl('hostname', systemInfo.site_url)
        this.defaultData.request_url = 'https://' + hostname
        this.defaultData.socket_url = 'wss://' + hostname
        this.defaultData.uploadFile_url = 'https://' + hostname
        this.defaultData.downloadFile_url = 'https://' + hostname
        this.defaultData.serves_url = 'https://' + hostname
      }
    },
    getItemData () {
      this.$store
        .dispatch('wxapp/getItemData', this.dataFrom.id)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.dataFrom = res.data ? res.data : {}
          }
        })
        .catch((error) => {})
    },
    saveBut () {
      this.$refs.dataFrom.validate().then((success) => {
        if (success) {
          this.addSidebar = true
          const obj = {
            ...this.dataFrom
          }
          this.$store
            .dispatch('wxapp/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataFrom.id > 0 ? '修改' : '新增'}` + '小程序配置信息成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.addSidebar = false
              } else {
                this.addSidebar = false
              }
            })
            .catch((error) => {
              this.addSidebar = false
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
    copyData (val) {
      if (val) {
        copyToClipboard(val)
          .then(() => {
            this.$q.notify({
              message: '成功',
              caption: '复制成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
          })
          .catch(() => {
            this.$q.notify({
              message: '失败',
              caption: '复制失败',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    openDialog () {
      this.companyDialogStatus = true

      this.$nextTick(() => {
        this.$refs.companyManageRef.init()
      })
    },
    closeDialog () {
      this.companyDialogStatus = false
    },
    randomString (len) {
      len = len || 6
      const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678' /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
      const maxPos = $chars.length
      let stringData = ''
      for (let i = 0; i < len; i++) {
        stringData += $chars.charAt(Math.floor(Math.random() * maxPos))
      }
      return stringData
    },
    createTokenString () {
      this.dataFrom.pwa_token = this.randomString(18)
    },

    createKeyString () {
      this.dataFrom.pwa_encoding_aes_key = this.randomString(43)
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
