<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white full-height">
      <q-scroll-area class="fit full-height">
        <q-form ref="paramsForm" class="row q-col-gutter-sm q-pa-sm">
          <div class="col-4">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2">固定支付方式</div>
                <div class="text-caption">默认开启所有支付方式</div>
              </q-card-section>
              <q-list separator bordered padding v-if="localPaymentMethod && localPaymentMethod.length > 0">
                <q-item :key="'channel-' + key" v-for="(item, key) in localPaymentMethod">
                  <q-item-section>
                    <q-input outlined v-model="item.name" disable dense label="支付方式名称" />
                  </q-item-section>

                  <q-item-section>
                    <hl-upload
                      :multiple="false"
                      :key="`${key}-local`"
                      :currentAttach="item.iconImage"
                      @input="(val)=>{ $nextTick(()=>{ item.icon = val })}"
                    />
                  </q-item-section>
                  <q-item-section>
                    <q-input outlined v-model="item.fast" dense label="快捷键" />
                  </q-item-section>

                  <q-item-section side top>
                    <q-toggle v-model="item.status" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>

          <div class="col-4">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2">数字支付</div>
                <div class="text-caption text-primary">关联商户：{{ payMchRelation.mch_name }}</div>
                <div class="text-caption text-primary">APPID:{{ payMchRelation.app_id }}</div>
              </q-card-section>
              <q-list separator bordered padding>
                <q-item :key="'extend-' + key" v-for="(item, key) in hlpayChannel">
                  <q-item-section>
                    <q-input outlined v-model="item.name" disable dense label="支付方式名称" />
                  </q-item-section>

                  <q-item-section>
                    <q-input outlined v-model="item.fast" dense label="快捷键" />
                  </q-item-section>
                  <q-item-section>
                    <div class="row justify-center">
                      <q-img :src="item.icon" ratio="1" width="40px">
                        <template v-slot:error>
                          <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                            <q-icon name="wallpaper" color="grey" size="20px"> </q-icon>
                          </div>
                        </template>
                      </q-img>
                    </div>
                  </q-item-section>

                  <q-item-section side top>
                    <q-toggle v-model="item.status" @input="closeLocalPay" />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>

          <div class="col-4">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-subtitle2">自定义支付方式</div>
                <div class="text-caption">
                  默认为空，设置后会在收银台与单据列表、详情等相关位置进行展示。注：在启用后，不建议删除自定义支付项，会导致支付单据，统计数据等相关功能信息缺失。
                </div>
              </q-card-section>
              <q-list separator bordered padding>
                <q-item :key="'extend-' + key" v-for="(item, key) in extendPaymentMethod">
                  <q-item-section>
                    <q-input outlined v-model="item.name" dense label="支付方式名称" />
                  </q-item-section>

                  <q-item-section>

                    <hl-upload
                      :multiple="false"
                      :currentAttach="item.iconImage"
                      @input="(val)=>{ $nextTick(()=>{ item.icon = val })}"
                    />
                  </q-item-section>

                  <q-item-section>
                    <q-input outlined v-model="item.fast" dense label="快捷键" />
                  </q-item-section>

                  <q-item-section side top>
                    <q-toggle v-model="item.status" />
                  </q-item-section>
                </q-item>
              </q-list>

              <q-card-actions align="center">
                <q-btn flat color="primary" @click="addExtendPaymentMethod">新增</q-btn>
              </q-card-actions>
            </q-card>
          </div>
        </q-form>
      </q-scroll-area>
    </div>
    <div class="col-shrink bg-white q-py-sm text-center q-mt-xs">
      <q-btn class="q-px-xl" unelevated color="blue-6" label="保存" @click="saveBut()" />
    </div>
  </div>
</template>
<script>
export default {
  name: 'PaySet',
  data () {
    return {
      localPay: [],
      payChannelConfig: {
        local_pay: [],
        extend_pay: [],
        hlpay_channel: []
      },
      localPaymentMethod: [],
      extendPaymentMethod: [],
      hlpayChannel: [],
      payMchRelation: {},
      imageData: false,
      imageGroup: '',
      imageKey: ''
    }
  },
  components: {},
  mounted () {
    this.getPaySet()
  },

  computed: {},
  methods: {
    getPaySet () {
      this.$store
        .dispatch('settings/getPayChannel')
        .then((res) => {
          if (res.code == 200) {
            this.payMchRelation = res.data && res.data.payMchRelation ? res.data.payMchRelation : {}

            this.setExtendChannel(res.data.payChannelConfig)
            this.setHllpayChannel(res.data.hlpayChannel, res.data.payChannelConfig)

            this.setLocalChannel(res.data.localPaymentMethod, res.data.payChannelConfig)
          }
        })
        .catch((error) => {})
    },
    saveBut () {
      const obj = {
        ...this.payChannelConfig,
        localPaymentMethod: this.localPaymentMethod,
        extendPaymentMethod: this.extendPaymentMethod,
        hlpayChannel: this.hlpayChannel
      }
      this.$store
        .dispatch('settings/setPayChannel', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '保存支付渠道设置成功！',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right',
              timeout: 500
            })
            this.getPaySet()
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
    },

    setExtendChannel (payChannelConfig) {
      if (payChannelConfig && payChannelConfig.extend_pay) {
        this.extendPaymentMethod = JSON.parse(payChannelConfig.extend_pay)
      }
    },

    setHllpayChannel (hlpayChannel, payChannelConfig) {
      if (hlpayChannel) {
        for (const i in hlpayChannel) {
          if (payChannelConfig && payChannelConfig.hlpay_channel) {
            const localPay = JSON.parse(payChannelConfig.hlpay_channel)

            if (localPay[i]) {
              const item = localPay[i]
              // hlpayChannel[i].name = item.name
              // hlpayChannel[i].icon = item.icon
              // hlpayChannel[i].fast = item.fast
              hlpayChannel[i].status = item.status
            }
          }
        }

        this.hlpayChannel = hlpayChannel
      }
    },

    setLocalChannel (localPaymentMethod, payChannelConfig) {
      const that = this
      if (localPaymentMethod) {
        for (const i in localPaymentMethod) {
          if (payChannelConfig && payChannelConfig.local_pay) {
            const localPay = JSON.parse(payChannelConfig.local_pay)

            if (localPay[i]) {
              const item = localPay[i]
              localPaymentMethod[i].name = item.name
              localPaymentMethod[i].iconImage = item.iconImage
              localPaymentMethod[i].fast = item.fast
              localPaymentMethod[i].icon = item.icon
              if (
                _.findIndex(that.hlpayChannel, function (o) {
                  return o.status
                }) > -1 &&
                (item.key == 'wxPay' || item.key == 'aliPay')
              ) {
                localPaymentMethod[i].status = false
              } else {
                localPaymentMethod[i].status = item.status
              }
            }
          }
        }

        this.$nextTick(() => {
          this.localPaymentMethod = localPaymentMethod
        })
      }
    },
    randomString (length) {
      const str = 'abcdefghijklmnopqrstuvwxyz'
      let result = ''
      for (let i = length; i > 0; --i) {
        result += str[Math.floor(Math.random() * str.length)]
      }
      return result
    },

    deletePayment (key) {
      if (key > -1) {
        this.extendPaymentMethod.splice(key, 1)
      }
    },
    addExtendPaymentMethod () {
      const key = 'pay_' + this.randomString(5)
      this.extendPaymentMethod.push({
        name: '',
        key: key,
        field: key,
        icon: '',
        fast: '',
        selectStatus: false,
        pay_code: '',
        status: false,
        channel: 'extend'
      })
    },
    openImageDialog (group, key) {
      if (group) {
        this.imageData = true
        this.imageGroup = group
        this.imageKey = key
      }
    },

    getImageData (v) {
      if (this.imageGroup == 'local') {
        this.localPaymentMethod[this.imageKey].icon = v[0].path
      }
      if (this.imageGroup == 'extend') {
        this.extendPaymentMethod[this.imageKey].icon = v[0].path
      }

      if (this.imageGroup == 'hlpay') {
        this.hlpayChannel[this.imageKey].icon = v[0].path
      }
      this.imageData = false
    },

    closeLocalPay () {
      if (this.hlpayChannel && this.hlpayChannel.length > 0) {
        const openStatus = _.findIndex(this.hlpayChannel, function (o) {
          return o.status
        })

        if (openStatus > -1) {
          if (this.localPaymentMethod && this.localPaymentMethod.length > 0) {
            this.localPaymentMethod.forEach(function (item, index) {
              if (item.key == 'wxPay') {
                item.status = false
              }
              if (item.key == 'aliPay') {
                item.status = false
              }
            })
          }
        }
      }
    }
  }
}
</script>
