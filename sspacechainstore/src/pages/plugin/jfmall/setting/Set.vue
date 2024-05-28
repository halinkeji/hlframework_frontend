<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink full-height bg-grey-2 q-mt-xs">
      <div style="overflow-y: scroll" class="fit full-height bg-white">
        <q-form ref="addSettingRef">
          <!-- 网站名称 -->
          <div class="row q-mt-sm">
            <div class="col-10 row">
              <div class="col-6 q-px-sm">
                <q-input outlined label="商户名称" dense v-model="settingForm.js_name" lazy-rules :rules="[(val) => !!val || '请输入商户名称']" />
              </div>
              <div class="col-6 q-px-sm">
                <q-input
                  outlined
                  label="联系人"
                  dense
                  v-model="settingForm.js_contact_people"
                  lazy-rules
                  :rules="[(val) => !!val || '请输入联系人名称']"
                />
              </div>
              <div class="col-6 q-px-sm">
                <q-input outlined label="联系电话" dense v-model="settingForm.js_contact_phone" lazy-rules />
                <!-- :rules="[(val) => /^1[3|4|5|7|8][0-9]{9}$/.test(val) || '请输入正确的联系电话']" -->
              </div>
              <div class="col-6 q-px-sm">
                <q-input outlined label="地址" dense lazy-rules v-model="settingForm.js_address" :rules="[(val) => !!val || '请输入地址']" />
              </div>

              <div class="col-6 q-px-sm">
                <q-input outlined bottom-slots label="经度" v-model="settingForm.js_lng" dense> </q-input>
              </div>
              <div class="col-6 q-px-sm">
                <q-input outlined bottom-slots label="纬度" v-model="settingForm.js_lat" dense>
                  <template v-slot:after>
                    <q-btn v-if="!addressMap" unelevated @click="showQqMap" color="blue-6" label="选择坐标" class="full-width q-pt-xs"></q-btn>
                    <q-btn v-if="addressMap" unelevated @click="addressMap = false" color="red" label="关闭选择" class="full-width q-pt-xs"
                  /></template>
                </q-input>
              </div>
              <div class="col-6 q-px-sm">
                <hl-qq-map @getAddressInfo="getAddressInfo" v-if="addressMap" ref="qqMap"></hl-qq-map>
              </div>
            </div>
            <div class="col-2 q-px-sm row text-center flex flex-center">
              <hl-upload
                :multiple="false"
                :currentAttach="settingForm.logoImage"
                @input="
                  (val) => {
                    $nextTick(() => {
                      settingForm.js_logo = val;
                    });
                  }
                "
                currentTitle="商户logo"
                currentDescription="建议尺寸比例1:1"
              />
            </div>
            <div class="col-10 q-px-sm">
              <hl-editor
                @change="
                  (v) => {
                    settingForm.js_description = v;
                  }
                "
                :content="settingForm.js_description"
                titleText="商户简介"
                :minHeight="$q.screen.height * 0.4"
              ></hl-editor>
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
  name: 'jfmallSetting',
  components: {},
  data () {
    return {
      settingForm: {
        js_name: '',
        js_logo: '',
        js_description: '',
        js_contact_people: '',
        js_contact_phone: '',
        js_address: '',
        js_evaluation_rules: '',
        js_service_description: '',
        js_qw_wechat_url: '',
        js_qw_wxapp_url: '',
        js_qw_wechat_corpId: '',
        js_qw_wxapp_corpId: '',
        js_hot_tags: [],
        js_delivery_way: [],
        js_is_auto_delivery: '',
        js_send_set: {},
        js_refund_set: {},

        js_lng: '',
        js_lat: '',

        js_wechat_message_config: {},
        js_comment_item: {},
        js_refund_why: {},
        js_pay_set: {
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
      multiple: false,
      uploadImgStatus: false,
      addressMap: false,
      currentTag: '',
      messageConfig: {
        orderTemp: '',
        orderState: '0',
        storeOrderTemp: '',
        storeOrderState: '0'
      },
      commentItem: {
        one: '',
        two: '',
        three: ''
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
      this.$store.dispatch('jfSetting/getItem', null).then((res) => {
        if (parseInt(res.code) == 200) {
          if (res.data) {
            this.settingForm = res.data ? res.data : {}
          }
          this.$nextTick(() => {
            this.setWechatMessage(res.data.js_wechat_message_config || {})
          })
        }
      })
    },

    setWechatMessage (messageConfig) {
      const wechatMessageConfig = {}
      for (const key in this.messageConfig) {
        const item = messageConfig && messageConfig[key]
        wechatMessageConfig[key] = item || this.messageConfig[key]
      }

      this.settingForm.js_wechat_message_config = wechatMessageConfig
    },
    // 提交
    saveData () {
      this.$refs.addSettingRef.validate().then((success) => {
        if (success) {
          this.submitDisable = true
          const obj = {
            ...this.settingForm
          }
          this.$store
            .dispatch('jfSetting/setData', obj)
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
    showQqMap () {
      this.addressMap = true
      this.$nextTick(() => {
        this.$refs.qqMap.modelMap(this.settingForm.js_lat, this.settingForm.js_lng)
      })
    },
    getAddressInfo (val) {
      if (val.address) {
        this.settingForm.js_address = val.address
      }
      if (val.lat) {
        this.settingForm.js_lat = val.lat
      }
      if (val.lng) {
        this.settingForm.js_lng = val.lng
      }
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
