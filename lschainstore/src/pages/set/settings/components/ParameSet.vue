<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white full-height">
      <q-scroll-area class="fit full-height">
        <q-form ref="paramsForm" class="q-gutter-md row">
          <q-card flat class="bg-white q-pa-md col-6">
            <q-list separator bordered padding>
              <q-item>
                <q-item-section>
                  <q-item-label
                    >{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}消费是否需要密码</q-item-label
                  >
                  <q-item-label caption
                    >默认关闭，开启后收银台{{
                      $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit
                    }}消费时需要密码进行验证</q-item-label
                  >
                </q-item-section>
                <q-item-section side top>
                  <q-toggle
                    color="green"
                    @input="handleSwitchChange(baseConfigData.consume_base_integralPayVerify, 'consume_base_integralPayVerify')"
                    v-model="baseConfigData.consume_base_integralPayVerify"
                    true-value="1"
                    false-value="0"
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label
                    >{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}消费是否需要密码</q-item-label
                  >
                  <q-item-label caption
                    >默认关闭，开启后收银台{{
                      $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit
                    }}消费时需要密码进行验证</q-item-label
                  >
                </q-item-section>
                <q-item-section side top>
                  <q-toggle
                    color="green"
                    @input="handleSwitchChange(baseConfigData.consume_base_balancePayVerify, 'consume_base_balancePayVerify')"
                    v-model="baseConfigData.consume_base_balancePayVerify"
                    true-value="1"
                    false-value="0"
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label
                    >{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}换算比例</q-item-label
                  >
                  <q-item-label caption
                    >默认：1 {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }} = 1
                    {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}。（示例：输入 3 ，则 1
                    {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }} = 3
                    {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}）
                  </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="baseConfigData.consume_base_integralConvert"
                    dense
                    :rules="[(val) => (val ? /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 0 : true) || '请输入正确的数值']"
                    @change="handleSwitchChange(baseConfigData.consume_base_integralConvert, 'consume_base_integralConvert')"
                  >
                  </q-input>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label
                    >{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}消费免密支付额度</q-item-label
                  >
                  <q-item-label caption
                    >默认‘0’，当时开启{{
                      $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit
                    }}消费使用密码时，判断使用金额是否免密</q-item-label
                  >
                </q-item-section>
                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="baseConfigData.consume_base_balanceNoSecret"
                    dense
                    @change="handleSwitchChange(baseConfigData.consume_base_balanceNoSecret, 'consume_base_balanceNoSecret')"
                  >
                  </q-input>
                </q-item-section>
              </q-item>

              <!-- <q-item>
                <q-item-section>
                  <q-item-label>计次功能相关单位</q-item-label>
                  <q-item-label caption>默认‘次’，开启后计次功能相关单位会改为对应单位</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input outlined bottom-slots v-model="baseConfigData.consume_base_countUnit" dense @change="handleSwitchChange(baseConfigData.consume_base_countUnit, 'consume_base_countUnit')">
                  </q-input>
                </q-item-section>
              </q-item> -->

              <q-item>
                <q-item-section>
                  <q-item-label>积分单位</q-item-label>
                  <q-item-label caption>默认‘积分’，开启后积分单位会改为对应单位</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="baseConfigData.consume_base_integralUnit"
                    dense
                    @change="handleSwitchChange(baseConfigData.consume_base_integralUnit, 'consume_base_integralUnit')"
                  >
                  </q-input>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>储值单位</q-item-label>
                  <q-item-label caption>默认‘储值’，开启后储值单位会改为对应单位</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="baseConfigData.consume_base_balanceUnit"
                    dense
                    @change="handleSwitchChange(baseConfigData.consume_base_balanceUnit, 'consume_base_balanceUnit')"
                  >
                  </q-input>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>货币单位</q-item-label>
                  <q-item-label caption>默认‘元’，开启后所有货币单位会改为对应单位</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="baseConfigData.consume_base_moneyUnit"
                    dense
                    @change="handleSwitchChange(baseConfigData.consume_base_moneyUnit, 'consume_base_moneyUnit')"
                  >
                  </q-input>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>货币单位符号</q-item-label>
                  <q-item-label caption>默认‘￥’，开启后所有货币单位符号会改为对应单位符号</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="baseConfigData.consume_base_moneySymbol"
                    dense
                    @change="handleSwitchChange(baseConfigData.consume_base_moneySymbol, 'consume_base_moneySymbol')"
                  >
                  </q-input>
                </q-item-section>
              </q-item>

              <!-- <q-item>
                <q-item-section>
                  <q-item-label>默认初始密码</q-item-label>
                  <q-item-label caption>默认‘888888’，开启后会员默认初始密码将会更新</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="baseConfigData.consume_base_memberCardPassword"
                    dense
                    @change="handleSwitchChange(baseConfigData.consume_base_memberCardPassword, 'consume_base_memberCardPassword')"
                  >
                  </q-input>
                </q-item-section>
              </q-item> -->

              <!-- <q-item>
                <q-item-section>
                  <q-item-label>是否共享素材</q-item-label>
                  <q-item-label caption>默认关闭，各门店可使用自有图片、视频等素材。启用后，总部与各门店均可使用全部图片、视频等素材。</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle
                    color="green"
                    @input="handleSwitchChange(baseConfigData.consume_base_attachmentShare, 'consume_base_attachmentShare')"
                    v-model="baseConfigData.consume_base_attachmentShare"
                    true-value="1"
                    false-value="0"
                  />
                </q-item-section>
              </q-item>

              <q-item v-if="openPlugins && openPlugins.indexOf('Fxzx') > -1">
                <q-item-section>
                  <q-item-label>设置会员关联表单</q-item-label>
                  <q-item-label caption>默认为空，设置后，会员注册后需填写表单内容，会员列表同步展示</q-item-label>
                </q-item-section>
                <q-item-section>
                  <q-select
                    outlined
                    v-model="baseConfigData.consume_base_regBindFormField"
                    label="请选择表单"
                    clearable
                    @input="handleSwitchChange(baseConfigData.consume_base_regBindFormField, 'consume_base_regBindFormField')"
                    class="full-width"
                    :options="formFieldOptions"
                    option-value="id"
                    option-label="pff_form_name"
                    emit-value
                    map-options
                    dense
                  />
                </q-item-section>
              </q-item> -->
            </q-list>
          </q-card>
        </q-form>
      </q-scroll-area>
    </div>
  </div>
</template>
<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'ParameSet',
  data () {
    return {
      baseConfigData: {
        consume_base_countUnit: '次',
        consume_base_balanceUnit: '元',
        consume_base_integralUnit: '积分',
        consume_base_moneyUnit: '元',
        consume_base_moneySymbol: '￥',
        consume_base_memberCardPassword: '888888',
        consume_base_balancePayVerify: '0',
        consume_base_balanceNoSecret: '0',
        consume_base_integralPayVerify: '0',
        consume_base_integralConvert: '1',
        consume_base_attachmentShare: '0',
        consume_base_regBindFormField: ''
      },
      formFieldOptions: []
    }
  },
  components: {},
  mounted () {
    this.getConsumeSet()
  },
  created () {
    this.openPlugins = LocalStorage.getItem('lschainstore_store_local').openPlugins
    if (this.openPlugins.indexOf('Barcode') > -1) {
      this.getFormFieldList()
    }
  },

  computed: {},
  methods: {
    getFormFieldList () {
      this.$store
        .dispatch('formfield/getFormFieldFormList')
        .then((res) => {
          if (res.code == 200) {
            this.formFieldOptions = res.data ? res.data : []
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    getConsumeSet () {
      const obj = {
        name: 'base'
      }
      this.$store
        .dispatch('settings/getConsumeSet', obj)
        .then((res) => {
          if (res.code == 200) {
            this.baseConfigData = res.data ? res.data : {}
          }
        })
        .catch((error) => {})
    },
    handleSwitchChange (val, keyName) {
      this.$refs.paramsForm.validate().then((success) => {
        if (success) {
          const obj = {}
          obj[keyName] = val
          this.$store
            .dispatch('settings/addSet', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '添加成功',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  position: 'top-right',
                  timeout: 500
                })
                this.getConsumeSet()
              }
            })
            .catch((error) => {})
        }
      })
    }
  }
}
</script>
