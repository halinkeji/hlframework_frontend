<template>
  <q-form method="post" ref="dataForm" class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs ">
      <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
      配置信息
    </div>

    <div class="col-shrink q-pa-sm full-height bg-white" v-show="step == 1">
      <q-scroll-area class="fit">
        <div class="row q-my-sm">
          <div class="col-8 col-md-6  q-ml-md">
            <q-input outlined dense :rules="[(val) => !!val || '必填项']" v-model="dataFrom.name" label="公众号名称" placeholder="公众号名称"> <template v-slot:hint> 填写公众号的账号名称 </template></q-input>
          </div>
        </div>

        <div class="row q-my-sm">
          <div class="col-8 col-md-6 q-ml-md">
            <q-input outlined dense :rules="[(val) => !!val || '必填项']" v-model="dataFrom.account" label="公众号帐号" placeholder="公众号帐号"
              ><template v-slot:hint>
                填写公众号的账号,一般为英文账号
              </template></q-input
            >
          </div>
        </div>

        <div class="row q-my-sm">
          <div class="col-8 col-md-6 q-ml-md">
            <q-input outlined dense :rules="[(val) => !!val || '必填项']" v-model="dataFrom.original" label="原始ID" placeholder="原始ID">
              <template v-slot:hint> 原始ID不能修改,请谨慎填写 </template>
            </q-input>
          </div>
        </div>

        <div class="row q-my-sm">
          <div class="col-8 col-md-6 q-ml-md">
            <q-select class="col-12 col-md-2" outlined bottom-slots v-model="dataFrom.level" label="类型" :options="attribute" dense emit-value map-options>
              <template v-slot:hint>
                注意:即使公众平台显示为“未认证”, 但只要【公众号设置】/【账号详情】下【认证情况】显示资质审核通过, 即可认定为认证号.
              </template>
            </q-select>
          </div>
        </div>
        <div class="row q-my-sm">
          <div class="col-8 col-md-6  q-ml-md">
            <q-input outlined dense :rules="[(val) => !!val || 'AppId是必填项']" label="AppId" v-model="dataFrom.app_key" placeholder="AppId"> </q-input>
          </div>
        </div>

        <div class="row q-my-sm">
          <div class="col-8 col-md-6  q-ml-md">
            <q-input outlined dense :rules="[(val) => !!val || 'AppSecret是必填项']" label="AppSecret" v-model="dataFrom.app_secret" placeholder="AppSecret"> </q-input>
          </div>
        </div>
        <div class="row q-my-sm">
          <div class="col-8 col-md-6">
           <hl-upload
            :multiple="false"
            :currentAttach="dataFrom.avatarImage"
            @input="(val)=>{ $nextTick(()=>{ dataForm.avatar = val })}"
            currentTitle="公众号Logo"
            currentDescription="建议尺寸比例1:1"
            />
          </div>
          <div class="col-8 col-md-6">
           <hl-upload
            :multiple="false"
            :currentAttach="dataFrom.qrcodeImage"
            @input="(val)=>{ $nextTick(()=>{ dataForm.qrcode = val })}"
            currentTitle="公众号二维码"
            currentDescription="建议尺寸比例1:1"
            />
          </div>
        </div>

      </q-scroll-area>
    </div>
    <div class="col-shrink q-pa-sm full-height bg-white" v-show="step == 2">
      <div class="row q-my-sm">
        <div class="col-3 col-md-2 q-mt-sm  text-center">
          URL (服务器地址)
        </div>
        <div class="col-8 col-md-6 q-ml-md">
          <q-input outlined dense v-model="notice_url" disable :rules="[(val) => !!val || 'URL是必填项']" placeholder="URL(服务器地址)"> </q-input>
        </div>
      </div>

      <div class="row q-my-sm">
        <div class="col-3 col-md-2 q-mt-sm  text-center">Token (令牌)</div>
        <div class="col-8 col-md-6 q-ml-md">
          <q-input outlined dense :rules="[(val) => !!val || 'Token是必填项']" v-model="dataFrom.token" disable placeholder="Token (令牌)"> </q-input>
        </div>
        <div class="col-12 col-md-2 q-ml-md text-center">
          <q-btn outline color="primary" label="修改" class="q-mx-sm" @click="tokenStatus = true" />
          <q-btn outline class="q-mx-sm" color="primary" label="生成新的" @click="newKey('token')" />
        </div>
      </div>

      <div class="row q-my-sm">
        <div class="col-3 col-md-2 q-mt-sm  text-center">
          EncodingAESKey (消息加解密密钥)
        </div>
        <div class="col-8 col-md-6 q-ml-md">
          <q-input outlined dense disable :rules="[(val) => !!val || 'EncodingAESKey是必填项']" v-model="dataFrom.aeskey" placeholder=" EncodingAESKey (消息加解密密钥)"> </q-input>
        </div>
        <div class="col-12 col-md-2 q-ml-md  text-center">
          <q-btn outline color="primary" label="修改" class="q-mx-sm" @click="aeskeyStatus = true" />
          <q-btn outline class="q-mx-sm" color="primary" label="生成新的" @click="newKey('aeskey')" />
        </div>
      </div>
    </div>

    <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
      <q-btn v-if="step === 2" @click="saveBut()" unelevated color="green" class="q-px-xl" label=" 提交" />
      <q-btn v-if="step === 1" @click="step = 2" unelevated color="primary" class="q-px-xl" label="下一步" />
      <q-btn v-if="step > 1" unelevated color="primary" @click="step = 1" class="q-px-xl" label="上一步" />
    </div>

    <q-dialog @hide="hideNowPage" v-model="tokenStatus" persistent>
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.5) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
        }"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">修改token</div>

          <q-space />
          <q-btn icon="close" @click="tokenStatus = false" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-input outlined dense bottom-slots v-model="dataFrom.token" placeholder="请填写新的公众号消息校验Token">
            <template v-slot:hint>
              与公众号接入设置值一致，必须为英文或者数字，长度为3到32个字符. 请妥善保管, Token 泄露将可能被窃取或篡改平台的操作数据.
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md">
          <q-btn label="确定" unelevated @click="tokenStatus = false" color="primary" class="text-right" />
          <q-btn label="取消" color="grey" unelevated @click="hideNowPage()" class="text-right" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog @hide="hideNowPage" v-model="aeskeyStatus" persistent>
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.5) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.5) + 'px',
        }"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">修改EncodingAESKey</div>

          <q-space />
          <q-btn icon="close" @click="aeskeyStatus = false" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section>
          <q-input outlined bottom-slots dense v-model="dataFrom.aeskey" placeholder="请填写新的公众号消息加密Key">
            <template v-slot:hint>
              与公众号接入设置值一致，必须为英文或者数字，长度为43个字符. 请妥善保管, EncodingAESKey 泄露将可能被窃取或篡改平台的操作数据.
            </template>
          </q-input>
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md">
          <q-btn label="确定" unelevated @click="aeskeyStatus = false" color="primary"  class="text-right" />
          <q-btn label="取消" color="grey"  unelevated @click="hideNowPage()" class="text-right" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-form>
</template>
<script>
export default {
  data () {
    return {
      step: 1,
      dataFrom: {
        avatar: '/',
        qrcode: '/',
        name: '',
        account: '',
        original: '',
        token: '',
        aeskey: '',
        level: '4',
        app_key: '',
        app_secret: '',
        styleid: 1,
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
      aeskeyStatus: false,
      tokenStatus: false
    }
  },
  computed: {},
  created () {},
  mounted () {
    this.getNoticeUrl()
  },
  methods: {
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

                this.$emit('getInfo')
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
            type: val
          }

          this.$store
            .dispatch('wechatSet/newkey', obj)
            .then((res) => {
              if (res.code == 200) {
                this.dataFrom[val] = res.data[val]
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
    getNoticeUrl () {
      const account_info = this.$q.localStorage.getItem('cyonestore_account_info')
      const system_local = this.$q.localStorage.getItem('cyonestore_system_local')
      if (account_info && system_local) {
        this.notice_url = system_local.systemInfo.site_url + '/cyonestore/wechat/default/wechat-event?id=' + account_info.lib_id
      }
    }
  }
}
</script>
