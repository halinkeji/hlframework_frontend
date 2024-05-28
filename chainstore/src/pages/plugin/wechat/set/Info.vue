<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs ">
      <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
      配置信息
    </div>
    <div class="col-shrink  full-height ">
      <q-scroll-area class="fit full-height">
        <q-form method="post" ref="dataForm">
          <q-card flat square class=" q-pa-md">
            <div class="text-subtitle2 q-mb-xs">移动端配置</div>
            <q-separator />

            <div class="row q-mt-sm" v-if="dataFrom.id > 0">
              <div class="col-12 col-md-8 q-ml-md">
                <q-input outlined dense v-model="entranceUrl" label="移动端会员入口" disable>
                  <template v-slot:after>
                    <q-btn unelevated color="primary" label="复制" @click="copyClipboard(entranceUrl)" />
                  </template>
                </q-input>
              </div>

              <div class="col-12 col-md-8 q-ml-md q-mt-sm">
                <q-input outlined dense v-model="manageEntranceUrl" label="移动端商家管理入口" disable>
                  <template v-slot:after>
                    <q-btn unelevated color="primary" label="复制" @click="copyClipboard(manageEntranceUrl)" />
                  </template>
                </q-input>
              </div>
            </div>
          </q-card>
          <q-card flat square class="q-mt-xs q-pa-md">
            <div class="text-subtitle2 q-mb-xs">基本信息</div>
            <q-separator />
            <div class="row q-my-sm">
              <div class="col-8 col-md-6  q-ml-md">
                <q-input outlined dense label="公众号名称" :rules="[(val) => !!val || '必填项']" v-model="dataFrom.name" placeholder="公众号名称">
                  <template v-slot:hint> 填写公众号的账号名称 </template></q-input
                >
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="公众号帐号" :rules="[(val) => !!val || '必填项']" v-model="dataFrom.account" placeholder="公众号帐号"
                  ><template v-slot:hint>
                    填写公众号的账号,一般为英文账号
                  </template></q-input
                >
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="原始ID" :rules="[(val) => !!val || '必填项']" v-model="dataFrom.original" placeholder="原始ID">
                  <template v-slot:hint> 原始ID不能修改,请谨慎填写 </template>
                </q-input>
              </div>
            </div>
            <div class="row q-my-sm">
              <div class="col-8 col-md-6 q-ml-md">
                <q-select class="col-12 col-md-2" outlined label="类型" bottom-slots v-model="dataFrom.level" :options="attribute" dense emit-value map-options>
                  <template v-slot:hint>
                    注意:即使公众平台显示为“未认证”, 但只要【公众号设置】/【账号详情】下【认证情况】显示资质审核通过, 即可认定为认证号.
                  </template>
                </q-select>
              </div>
            </div>
            <div class="row q-my-sm q-mt-md">
              <div class="col-8 col-md-3 q-ml-md">
             <hl-upload
                  :multiple="false"
                  :currentAttach="dataFrom.avatarImage"
                  @input="(val)=>{ $nextTick(()=>{ dataForm.avatar = val })}"
                  currentTitle="公众号Logo"
                  currentDescription="建议尺寸比例1:1"
                  />
              </div>
              <div class="col-8 col-md-6 q-ml-md">
              <hl-upload
                  :multiple="false"
                  :currentAttach="dataFrom.qrcodeImage"
                  @input="(val)=>{ $nextTick(()=>{ dataForm.qrcode = val })}"
                  currentTitle="公众号二维码"
                  currentDescription="建议尺寸比例1:1"
                  />
              </div>
            </div>
          </q-card>

          <q-card flat square class="q-mt-xs q-pa-md">
            <div class="text-subtitle2 q-mb-xs"><q-icon name="las la-square-full" class="text-primary" />自定义菜单通讯设置</div>
            <q-separator />
            <div class="row q-my-sm">
              <div class="col-8 col-md-6  q-ml-md">
                <q-input outlined dense label="AppId" :rules="[(val) => !!val || 'AppId是必填项']" v-model="dataFrom.app_key" placeholder="请输入AppId"> </q-input>
              </div>
            </div>

            <div class="row q-my-sm">
              <div class="col-8 col-md-6  q-ml-md">
                <q-input outlined dense label="AppSecret" :rules="[(val) => !!val || 'AppSecret是必填项']" v-model="dataFrom.app_secret" placeholder="请输入AppSecret"> </q-input>
              </div>
            </div>
          </q-card>

          <q-card flat square class="q-mt-xs q-pa-md">
            <div class="text-subtitle2 q-mb-xs"><q-icon name="las la-square-full" class="text-primary" />公众号通信</div>
            <q-separator />

            <div class="row q-mt-sm" v-if="dataFrom.id > 0">
              <div class="col-12 col-md-8 q-ml-md">
                <q-input outlined dense v-model="notice_url" label="URL (服务器地址)" disable :rules="[(val) => !!val || 'AppSecret是必填项']">
                  <template v-slot:after>
                    <q-btn unelevated color="primary" label="复制" @click="copyClipboard(notice_url)" />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row" v-if="dataFrom.id > 0">
              <div class="col-12 col-md-8 q-ml-md">
                <q-input outlined dense label="Token (令牌)" :rules="[(val) => !!val || 'Token是必填项']" v-model="dataFrom.token" disable>
                  <template v-slot:after>
                    <q-btn unelevated color="primary" label="复制" @click="copyClipboard(dataFrom.token)" />
                    <q-btn flat color="primary" label="修改" @click="tokenStatus = true" />
                    <q-btn flat color="primary" label="生成新的" @click="newKey('token')" />
                  </template>
                </q-input>
              </div>
            </div>

            <div class="row" v-if="dataFrom.id > 0">
              <div class="col-12 col-md-8 q-ml-md">
                <q-input outlined dense disable label="EncodingAESKey (消息加解密密钥)" :rules="[(val) => !!val || 'EncodingAESKey是必填项']" v-model="dataFrom.aeskey">
                  <template v-slot:after
                    ><q-btn unelevated color="primary" label="复制" @click="copyClipboard(dataFrom.aeskey)"/>
                    <q-btn flat color="primary" label="修改" @click="aeskeyStatus = true"/>
                    <q-btn flat color="primary" label="生成新的" @click="newKey('aeskey')"
                  /></template>
                </q-input>
              </div>
            </div>
          </q-card>
        </q-form>
      </q-scroll-area>
    </div>

      <div class="col-shrink bg-white q-pb-md text-center q-mt-xs">
           <q-btn unelevated color="primary" label="保存" class="q-px-xl" @click="saveBut()" />
      </div>

    <q-dialog @hide="hideNowPage" v-model="tokenStatus" persistent>
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.3) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
        }"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">修改token</div>

          <q-space />
          <q-btn icon="close" @click="tokenStatus = false" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form ref="dataForm">
            <q-input outlined dense bottom-slots v-model="token" placeholder="请填写新的公众号消息校验Token">
              <template v-slot:hint>
                与公众号接入设置值一致，必须为英文或者数字，长度为3到32个字符. 请妥善保管, Token 泄露将可能被窃取或篡改平台的操作数据.
              </template>
            </q-input>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md">
          <q-btn label="确定" unelevated @click="changeValue(token, 'token')" color="primary" class="text-right" />
          <q-btn label="取消" color="grey" unelevated @click="hideNowPage()" class="text-right" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog @hide="hideNowPage" v-model="aeskeyStatus" persistent>
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.3) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
        }"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">修改EncodingAESKey</div>

          <q-space />
          <q-btn icon="close" @click="aeskeyStatus = false" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-form ref="dataForm">
            <q-input outlined bottom-slots dense v-model="aeskey" placeholder="请填写新的公众号消息加密Key">
              <template v-slot:hint>
                与公众号接入设置值一致，必须为英文或者数字，长度为43个字符. 请妥善保管, EncodingAESKey 泄露将可能被窃取或篡改平台的操作数据.
              </template>
            </q-input>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md">
          <q-btn label="确定" unelevated @click="changeValue(aeskey, 'aeskey')" color="primary"  class="text-right" />
          <q-btn label="取消" color="grey"  unelevated @click="hideNowPage()" class="text-right" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { copyToClipboard } from 'quasar'

export default {
  data () {
    return {
      tab: 'mails',
      splitterModel: 20,
      tokenStatus: false,
      aeskey: '',
      token: '',
      aeskeyStatus: false,
      dataFrom: {
        avatar: '/',
        qrcode: '/',
        name: '',
        account: '',
        original: '',
        token: '',
        aeskey: '',
        level: '',
        app_key: '',
        app_secret: '',
        styleid: '',
        auth_refresh_token: ''
      },
      attribute: [
        {
          label: '普通订阅号',
          value: '1'
        },
        {
          label: '普通服务号',
          value: '2'
        },
        {
          label: '认证订阅号',
          value: '3'
        },
        {
          label: '认证服务号/认证媒体/政府订阅号',
          value: '4'
        }
      ],
      imageType: '',
      notice_url: '',
      multiple: false,
      uploadImgStatus: false
    }
  },
  computed: {
    entranceUrl () {
      const account_info = this.$q.localStorage.getItem('chainstore_account_info')
      const system_local = this.$q.localStorage.getItem('chainstore_system_local')
      if (account_info && system_local) {
        let url = system_local.systemInfo.site_url + '/m/chainstore/?id=' + account_info.lib_id
        if (account_info.lib_id != account_info.store_id) {
          url += '&StoreId=' + account_info.store_id
        }
        return url
      }
      return ''
    },

    manageEntranceUrl () {
      const account_info = this.$q.localStorage.getItem('chainstore_account_info')
      const system_local = this.$q.localStorage.getItem('chainstore_system_local')
      if (account_info && system_local) {
        return system_local.systemInfo.site_url + '/m/chainstore/manage/index?id=' + account_info.lib_id
      }
      return ''
    }
  },
  created () {},
  mounted () {
    this.getWechatInfo()
  },
  methods: {
    getWechatInfo () {
      this.$store.dispatch('wechatSet/getItem').then((res) => {
        if (res.code == 200) {
          this.dataFrom = res.data ? res.data : []
          this.dataFrom.level = res.data ? res.data.level.toString() : 1

          this.getNoticeUrl()
        }
      })
    },

    saveBut () {
      this.$refs.dataForm.validate().then((success) => {
        if (success) {
          const obj = {
            ...this.dataFrom
          }
          this.$store
            .dispatch('wechatSet/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                if (this.dataFrom.id > 0) {
                  this.$q.notify({
                    message: '修改微信公众号信息成功',
                    icon: 'ion-checkmark-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                    color: 'green'
                  })
                } else {
                  this.$q.notify({
                    message: '新增微信公众号信息成功',
                    color: 'green',
                    icon: 'ion-checkmark-circle-outline',
                    timeout: 500,
                    position: 'top-right'
                  })
                }
                this.getWechatInfo()
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
        }
      })
    },

    hideNowPage () {
      this.tokenStatus = false
      this.aeskeyStatus = false
    },
    newKey (val) {
      this.$q
        .dialog({
          title: '确定',
          message: '确定要生成新的吗？',
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const obj = {
            id: this.dataFrom.id,
            type: val
          }

          this.$store
            .dispatch('wechatSet/newkey', obj)
            .then((res) => {
              if (res.code == 200) {
                if (this.dataFrom.id > 0) {
                  this.$q.notify({
                    message: '重新生成成功',
                    icon: 'ion-checkmark-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                    color: 'green'
                  })
                }
                this.getWechatInfo()
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '失败',
                caption: error.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            })
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
    },
    changeValue (value, keyName) {
      const obj = {
        id: this.dataFrom.id
      }
      obj[keyName] = value
      this.$store
        .dispatch('wechatSet/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (this.dataFrom.id > 0) {
              this.$q.notify({
                message: '修改成功',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'green'
              })
              this.hideNowPage()
            } else {
              this.$q.notify({
                message: '新增成功',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            }
            this.getWechatInfo()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    copyClipboard (val) {
      copyToClipboard(val)
        .then((res) => {
          this.$q.notify({
            message: '成功',
            caption: '复制剪贴板成功',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'green'
          })
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'negative',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    getNoticeUrl () {
      const account_info = this.$q.localStorage.getItem('chainstore_account_info')
      const system_local = this.$q.localStorage.getItem('chainstore_system_local')
      if (account_info && system_local) {
        this.notice_url = system_local.systemInfo.site_url + '/chainstore/wechat/default/wechat-event?id=' + account_info.lib_id
      }
    }
  }
}
</script>
