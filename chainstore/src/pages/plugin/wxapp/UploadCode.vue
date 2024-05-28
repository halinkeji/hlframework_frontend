<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-pa-sm full-height bg-white">
      <q-scroll-area class="fit full-height">
        <q-form ref="dataFrom" class="q-px-xl q-pt-sm">
          <q-banner class="bg-grey-1 text-grey-7 full-width q-mb-md">
            <template v-slot:avatar>
              <q-icon size="sm" name="las la-question-circle" color="green" />
            </template>

            小程序上传审核前需要在小程序后台[开发]-[开发管理]-[接口设置]中开通以下接<br />
            1、获取用户收货地址(wx.chooseAddress接口) 用于用户下单时获取用户的收货地址<br />
            2、打开地图选择位置（wx.chooseLocation接口）用于获取用户的坐标位置<br />
            3、获取当前的地理位置、速度（wx.getLocation接口）用于实时展示配送员的地理位置及展示门店和商户的距离<br />
            注：如wx.getLocation接口审核无法通过可在下方开启getLocation替换<br />
          </q-banner>

          <div class="row">
            <div class="col">当前程序版本：{{ dataFrom.version ? dataFrom.version : topVersionData.version }}</div>
            <div class="col">最新版本：{{ topVersionData.version }}</div>
          </div>
          <q-stepper v-model="step" ref="stepper" color="primary" flat bordered animated>
            <q-step :name="1" title="填写信息" icon="las la-edit" :done="step > 1">
              <div class="full-width row" v-if="currentStatus == 0">
                <div class="col-12 text-center">
                  <q-icon name="las la-info-circle" color="red" size="120px" class=""></q-icon>
                </div>
                <div class="col-12 text-center">请先完善微信小程序基础设置</div>
              </div>
              <div class="full-width row" v-if="currentStatus == 1">
                <div class="col-12">
                  <q-input outlined dense readonly label="版本号" :rules="[(val) => !!val || '必填项']" v-model="topVersionData.version"> </q-input>
                </div>
                <div class="col-12">
                  <q-input
                    outlined
                    dense
                    type="textarea"
                    :rows="2"
                    label="版本描述"
                    :rules="[(val) => !!val || '必填项']"
                    v-model="topVersionData.remark"
                  >
                  </q-input>
                </div>

                <div class="col-12">
                  <q-separator />
                </div>
                <div class="col-12 row justify-center q-mt-md">
                  <!-- $refs.stepper.previous() -->
                  <q-btn @click="getUserQrcode" unelevated class="q-px-xl" color="primary" label="确认" />
                </div>
              </div>
              <div class="full-width row" v-if="currentStatus == 2">
                <div class="col-12 text-center">
                  <q-icon name="las la-share-alt" color="positive" size="120px" class=""></q-icon>
                </div>
                <div class="col-12 text-center">您当前版本为最新版！</div>
              </div>

              <div class="full-width row" v-if="currentStatus == 5">
                <div class="col-12 text-center">
                  <q-icon name="las la-share-alt" color="positive" size="120px" class=""></q-icon>
                </div>
                <div class="col-12 text-center">未开放上传代码功能，请联系管理员！</div>
              </div>
            </q-step>

            <q-step :name="2" title="扫码并上传代码" icon="las la-code" :done="step > 2">
              <div class="full-width row">
                <div class="col-12">
                  <q-separator />
                </div>
                <div class="col-12 text-center">
                  <q-img width="300px" ratio="1" :src="loginQrcodeUrl">
                    <div class="absolute-full text-subtitle2 flex flex-center text-subtitle2 text-weight-bolder text-center" v-if="loginStatus">
                      <div class="row">
                        <div class="col-12">
                          <q-icon name="las la-check-circle" size="100px" color="positive"> </q-icon>
                        </div>
                        <div class="col-12">登录成功</div>
                      </div>
                    </div>
                  </q-img>
                </div>
                <div class="col-12 text-center">请微信小程序管理员扫描二维码，确认后将直接上传代码</div>
                <div class="col-12 row justify-center q-mt-md q-gutter-sm">
                  <!-- $refs.stepper.previous() -->
                  <!-- <q-btn @click="clickUploadCode" unelevated class="q-px-xl" color="primary" label="下一步" /> -->
                  <!-- <q-btn @click="$refs.stepper.previous()" unelevated class="q-px-xl" color="grey" label="上一步" /> -->
                </div>
              </div>
            </q-step>

            <q-step :name="3" title="上传成功" icon="las la-check-circle">
              <div class="full-width row" v-if="currentStatus == 3">
                <div class="col-12 text-center">
                  <q-icon name="las la-check-circle" color="positive" size="120px" class=""></q-icon>
                </div>
                <div class="col-12 text-center">
                  请登录微信公众平台：https://mp.weixin.qq.com/ <br />
                  进入“开发管理”菜单，找到刚才上传的开发版，即可提交审核
                </div>
              </div>

              <div class="full-width row" v-if="currentStatus == 4">
                <div class="col-12 text-center">
                  <q-icon name="las la-times-circle" color="red" size="120px" class=""></q-icon>
                </div>
                <div class="col-12 text-center">上传代码超时，请重新提交上传</div>
                <div class="col-12 row justify-center q-mt-md q-gutter-sm">
                  <q-btn @click="resetPageData" unelevated class="q-px-xl" color="red" label="重新提交" />
                </div>
              </div>
            </q-step>
          </q-stepper>
        </q-form>
      </q-scroll-area>
    </div>
  </div>
</template>

<script>
import { QSpinnerHourglass } from 'quasar'
export default {
  name: 'UploadCode',
  data () {
    return {
      step: 1,
      dataFrom: {
        client_id: '',
        apply_id: '',
        lib_id: '',
        site_url: '',
        store_name: '',
        wechatmini_name: '',
        wechatmini_app_id: '',
        current_version: '',
        version: '',
        version_code: '',
        desc: '',
        status: ''
      },
      currentStatus: 0,
      accountInfo: {},
      topVersionData: {},
      loginQrcodeUrl: '',
      loginStatus: false,
      systemLocal: {},
      storeLocal: {},
      site_app_id: ''
    }
  },
  created () {},
  mounted () {},

  computed: {},
  methods: {
    init () {
      const systemLocal = this.$q.localStorage.getItem('chainstore_system_local')
      if (systemLocal) {
        const systemInfo = systemLocal.systemInfo
        if (systemInfo && systemInfo.site_url) {
          this.systemLocal = systemInfo
        }
      }
      const storeLocal = this.$q.localStorage.getItem('chainstore_store_local')
      if (storeLocal && storeLocal.storeInfo) {
        this.storeLocal = storeLocal.storeInfo
      }
      const accountInfo = this.$q.localStorage.getItem('chainstore_account_info')
      if (accountInfo && accountInfo.apply_id && accountInfo.lib_id) {
        this.accountInfo = accountInfo

        this.getItemData()
      }
    },
    getItemData () {
      this.$store
        .dispatch('wxapp/getItemData')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.dataFrom = res.data ? res.data : {}
            this.dataFrom.version = this.dataFrom.version ? this.dataFrom.version : 0
            this.dataFrom.version_code = this.dataFrom.version_code ? this.dataFrom.version_code : 0
            if (this.dataFrom && this.dataFrom.id && this.dataFrom.pwa_app_id && this.dataFrom.pwa_app_secret) {
              this.getNewVersion()
            }
          }
        })
        .catch((error) => {})
    },
    getNewVersion () {
      this.$store
        .dispatch('wxapp/getNewVersion', {
          apply_id: this.accountInfo.apply_id,
          lib_id: this.accountInfo.lib_id,
          wechatmini_app_id: this.dataFrom.pwa_app_id
        })
        .then((res) => {
          if (res.code == 200) {
            this.topVersionData = res.data ? res.data : {}
            // this.site_app_id = res.data && res.data.site_app_id ? res.data.site_app_id : ''
            if (this.topVersionData && this.topVersionData.version_data) {
              if (parseInt(this.topVersionData.version_data) > parseInt(this.dataFrom.version_code)) {
                this.currentStatus = 1
              } else {
                this.currentStatus = 2
              }
            } else {
              this.currentStatus = 5
            }
          }
        })
        .catch((error) => {})
    },

    getUserQrcode () {
      this.$q.loading.show({
        message: '获取登录二维码中，请稍后...'
      })

      this.$store
        .dispatch('wxapp/getLoginQr', {
          // site_app_id: this.site_app_id,
          site_url: this.systemLocal.site_url,
          apply_id: this.accountInfo.apply_id,
          lib_id: this.accountInfo.lib_id,
          wechatmini_app_id: this.dataFrom.pwa_app_id,
          store_name: this.storeLocal.name,
          wechatmini_name: this.dataFrom.pwa_name,

          current_version: this.dataFrom.version ? this.dataFrom.version : this.topVersionData.version,
          version: this.topVersionData.version,
          version_code: this.topVersionData.version_data,
          desc: this.topVersionData.remark
        })
        .then((res) => {
          if (res.code == 200 && res.data && res.data.qrcode) {
            this.$q.loading.hide()
            this.loginQrcodeUrl = res.data.qrcode
            this.$refs.stepper.next()
            setTimeout(() => {
              this.getIsLoginStatus()
            }, 2000)
          } else if (res.code == 200 && res.data && res.data == 'queue') {
            setTimeout(() => {
              this.getUserQrcode()
            }, 5000)
          } else {
            this.$q.loading.hide()
            this.$q.notify({
              message: '失败',
              caption: '获取授权二维码失败',
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'top-right'
            })
          }
        })
        .catch((error) => {})
    },
    getIsLoginStatus () {
      const that = this
      this.$store
        .dispatch('wxapp/getIsLoginStatus', {
          lib_id: this.accountInfo.lib_id,
          wechatmini_app_id: this.dataFrom.pwa_app_id
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            const loginStatusData = res.data
            if (loginStatusData && loginStatusData.login) {
              that.loginStatus = true
              setTimeout(() => {
                that.clickUploadCode()
              }, 3000)
            } else {
              setTimeout(() => {
                that.getIsLoginStatus()
              }, 3000)
            }
          } else {
            setTimeout(() => {
              that.getIsLoginStatus()
            }, 3000)
          }
        })
        .catch((error) => {})
    },

    clickUploadCode () {
      this.$q.loading.show({
        spinner: QSpinnerHourglass,
        spinnerColor: 'positive',
        message: '授权成功，上传中，请稍后...'
      })

      this.$store
        .dispatch('wxapp/setUploadCode', {
          wechatmini_app_id: this.dataFrom.pwa_app_id,
          site_url: this.systemLocal.site_url,
          lib_id: this.accountInfo.lib_id,
          apply_id: this.accountInfo.apply_id,
          version: this.topVersionData.version,
          desc: this.topVersionData.remark
        })
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.currentStatus = 3
            this.$q.loading.hide()
            this.$refs.stepper.next()
            this.saveBut({
              version: this.topVersionData.version,
              version_code: this.topVersionData.version_data,
              id: this.dataFrom.id
            })
            // const resultData = res.data
            // if ((resultData.info && resultData.info.size && resultData.info.size.total) || (resultData && resultData.size && resultData.size.total)) {

            // } else {
            //   this.currentStatus = 4
            //   this.$q.loading.hide()
            //   this.$refs.stepper.next()
            // }
          } else {
            this.currentStatus = 4
            this.$q.loading.hide()
            this.$refs.stepper.next()
          }
        })
        .catch((error) => {})
    },

    saveBut (obj) {
      this.$store
        .dispatch('wxapp/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            // this.resetPageData()
            this.$q.notify({
              message: '成功',
              caption: '小程序上传成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
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
    },
    resetPageData () {
      this.step = 1
      this.currentStatus = 0
      this.loginQrcodeUrl = ''
      this.loginStatus = false
      this.accountInfo = {}
      this.topVersionData = {}

      this.$nextTick(() => {
        this.init()
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
