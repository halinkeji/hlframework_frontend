<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink full-height bg-grey-2">
      <div style="overflow-y: scroll" class="fit full-height bg-white">
        <q-form ref="addSettingRef">
          <div class="q-mt-sm row q-px-md q-col-gutter-sm">
            <div class="col-4">
              <q-card flat bordered>
                <q-card-section class="row items-center">
                  <div class="text-subtitle2">评价功能开关</div>
                  <q-space />

                  <q-radio v-model="commentStatus" :val="1" label="开启" />
                  <q-radio v-model="commentStatus" :val="0" label="关闭" />
                </q-card-section>
              </q-card>
            </div>

            <div class="col-4">
              <q-card flat bordered class="q-mt-sm">
                <q-card-section class="text-subtile2 row items-center">
                  自定义评分项 <q-space />
                  <q-btn color="primary" label="新增" unelevated @click="addServeStar" />
                </q-card-section>
                <q-separator />

                <q-card-section class="text-subtile2 row items-center">
                  <div class="full-width q-mb-md row q-col-gutter-sm" v-for="(item, key) in commentList">
                    <q-input outlined dense class="col" v-model="item.title" label="评分内容" :rules="[(val) => !!val || '请输入评分内容']">
                      <template v-slot:append>
                        <q-btn @click="delServeStar(key)" color="red" round icon="las la-trash" unelevated size="sm" />
                      </template>
                    </q-input>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-4">
              <q-card flat bordered>
                <q-card-section class="text-subtile2 row items-center">
                  快捷评价内容 <q-space />
                  <q-btn color="primary" label="新增" unelevated @click="fastAddServeStar" />
                </q-card-section>
                <q-separator />

                <q-card-section class="text-subtile2 row items-center">
                  <div class="full-width q-mb-md row q-col-gutter-sm" v-for="(item, key) in fastCommentList">
                    <q-input outlined dense class="col" v-model="item.title" label="评价内容" :rules="[(val) => !!val || '请输入评价内容']">
                      <template v-slot:append>
                        <q-btn @click="fastDelServeStar(key)" color="red" round icon="las la-trash" unelevated size="sm" />
                      </template>
                    </q-input>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-form>
      </div>
    </div>
    <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
      <q-btn class="q-px-xl" label="提交" :disable="submitDisable" @click="saveData()" color="primary" unelevated />
    </div>
  </div>
</template>
<script>
export default {
  name: 'wxmllSetting',
  components: {},
  data () {
    return {
      settingForm: {
        ws_name: '',
        ws_logo: '',
        ws_description: '',
        ws_contact_people: '',
        ws_contact_phone: '',
        ws_address: '',
        ws_evaluation_rules: '',
        ws_service_description: '',
        ws_qw_wechat_url: '',
        ws_qw_wxapp_url: '',
        ws_qw_wechat_corpId: '',
        ws_qw_wxapp_corpId: '',
        ws_hot_tags: [],
        ws_delivery_way: [],
        ws_is_auto_delivery: '',
        ws_send_set: {},
        ws_refund_set: {},
        ws_lng: '',
        ws_lat: '',
        ws_wechat_message_config: {},
        ws_comment_item: {},
        ws_refund_why: {},
        ws_pay_set: {
          pointSwitch: 0,
          pointRatio: '',
          levelSwitch: 0,
          moneyCashSwitch: 0,
          moneyCashRatio: '',
          moneyGivePointSwitch: 0,
          moneyGivePointRatio: '',
          pointCashSwitch: 0,
          pointCashRatio: '',
          pointUseCashSwitch: 0,
          pointUseCashSRatio: ''
        }
      },
      submitDisable: false,
      commentStatus: 0,
      commentList: [],
      fastCommentList: []
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
      this.$store.dispatch('wxMallSetting/getItem', null).then((res) => {
        if (parseInt(res.code) == 200) {
          if (res.data) {
            this.settingForm = res.data ? res.data : {}

            if (this.settingForm && this.settingForm.ws_comment_item) {
              this.commentStatus = this.settingForm.ws_comment_item.status ? this.settingForm.ws_comment_item.status : 0
              this.commentList = this.settingForm.ws_comment_item.commentList ? this.settingForm.ws_comment_item.commentList : []
              this.fastCommentList = this.settingForm.ws_comment_item.fastCommentList ? this.settingForm.ws_comment_item.fastCommentList : []
            }
          }
        }
      })
    },

    // 提交
    saveData () {
      this.$refs.addSettingRef.validate().then((success) => {
        if (success) {
          this.submitDisable = true
          this.settingForm.ws_comment_item = {
            status: this.commentStatus,
            commentList: this.commentList,
            fastCommentList: this.fastCommentList
          }
          const obj = {
            ...this.settingForm
          }
          this.$store
            .dispatch('wxMallSetting/setData', obj)
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
                this.submitDisable = false
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
                this.submitDisable = false
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
              this.submitDisable = false
            })
        }
      })
    },

    delServeStar (key) {
      if (this.commentConfigData && this.commentList && this.commentList.length > 0) {
        this.commentList.splice(key, 1)
      }
    },
    addServeStar () {
      this.commentList.push({
        title: '',
        value: '',
        field: this.randomString(6)
      })
    },

    fastDelServeStar (key) {
      if (this.commentConfigData && this.fastCommentList && this.fastCommentList.length > 0) {
        this.fastCommentList.splice(key, 1)
      }
    },
    fastAddServeStar () {
      this.fastCommentList.push({
        title: '',
        value: '',
        field: this.randomString(6)
      })
    },

    randomString (length) {
      const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
      let result = ''
      for (let i = length; i > 0; --i) {
        result += str[Math.floor(Math.random() * str.length)]
      }
      return result
    }
  }
}
</script>
