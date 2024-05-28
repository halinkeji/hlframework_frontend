<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white full-height ">
      <q-scroll-area class="fit full-height">
        <q-form ref="paramsForm" class="q-gutter-md row">
          <q-card flat class="bg-white q-pa-md col-6">
            <q-list separator bordered padding>

              <q-item>
                <q-item-section>
                  <q-item-label>是否开启自动升级</q-item-label>
                  <q-item-label caption>默认关闭，开启会员根据成长值自动升级至对应等级</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle
                    color="green"
                    @input="handleSwitchChange(configData.member_level_upgradeStatus, 'member_level_upgradeStatus')"
                    v-model="configData.member_level_upgradeStatus"
                    true-value="1"
                    false-value="0"
                  />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>成长值换算比例</q-item-label>
                  <q-item-label caption>默认消费：1 {{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneyUnit }} = 1 成长值。（示例：输入 3 ，则 1 {{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneyUnit }} = 3 成长值） </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="configData.member_level_growRate"
                    dense
                    :rules="[(val) =>  (val ?  /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 0  : true) || '请输入正确的数值']"
                    @change="handleSwitchChange(configData.member_level_growRate, 'member_level_growRate')"
                  >
                  </q-input>
                </q-item-section>
              </q-item>

               <q-item>
                <q-item-section>
                  <q-item-label>默认密码</q-item-label>
                  <q-item-label caption>会员卡号时默认密码为‘888888’，后续可以在会员信息功能下修改。</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                    v-model="configData.member_level_defaultPassword"
                    dense
                    :rules="[(val) =>  !!val || '默认密码不能为空']"
                    @change="handleSwitchChange(configData.member_level_defaultPassword, 'member_level_defaultPassword')"
                  >
                  </q-input>
                </q-item-section>
              </q-item>

               <q-item>
                <q-item-section>
                  <q-item-label>是否将注册手机号设置为卡号</q-item-label>
                  <q-item-label caption>默认关闭，开启后会员在登记时默认将手机号设置为卡号</q-item-label>
                </q-item-section>
                <q-item-section side top>
                  <q-toggle
                    color="green"
                    @input="handleSwitchChange(configData.member_level_defaultMobile, 'member_level_defaultMobile')"
                    v-model="configData.member_level_defaultMobile"
                    true-value="1"
                    false-value="0"
                  />
                </q-item-section>
              </q-item>

               <q-item>
                <q-item-section>
                  <q-item-label>自定义卡号长度</q-item-label>
                  <q-item-label caption> 默认11位，修改后卡号默认长度更改（不包括卡号前缀与卡号后缀）</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                     :disable="parseInt(configData.member_level_defaultMobile) == 1 ? true : false"
                    v-model="configData.member_level_cardNumberLength"
                    dense
                     :rules="[(val) =>  (val ?  /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) && val >= 0 && val <= 20  : true) || '请输入正确的数值']"
                    @change="handleSwitchChange(configData.member_level_cardNumberLength, 'member_level_cardNumberLength')"
                  >
                  </q-input>
                </q-item-section>
              </q-item>

               <q-item>
                <q-item-section>
                  <q-item-label>自定义卡号前缀</q-item-label>
                  <q-item-label caption>默认空，修改后新注册会员卡号会附加前缀 </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input
                    outlined
                    bottom-slots
                     :disable="parseInt(configData.member_level_defaultMobile) == 1 ? true : false"
                    v-model="configData.member_level_cardNumberPrefix"
                    dense
                    @change="handleSwitchChange(configData.member_level_cardNumberPrefix, 'member_level_cardNumberPrefix')"
                  >
                  </q-input>
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section>
                  <q-item-label>自定义卡号后缀</q-item-label>
                  <q-item-label caption>默认空，修改后新注册会员卡号会附加后缀 </q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-input
                    outlined
                    :disable="parseInt(configData.member_level_defaultMobile) == 1 ? true : false"
                    bottom-slots
                    v-model="configData.member_level_cardNumberSuffix"
                    dense
                    @change="handleSwitchChange(configData.member_level_cardNumberSuffix, 'member_level_cardNumberSuffix')"
                  >
                  </q-input>
                </q-item-section>
              </q-item>

            </q-list>
          </q-card>
        </q-form>
      </q-scroll-area>
    </div>
  </div>
</template>
<script>
export default {
  name: 'MemberSet',
  data () {
    return {
      configData: {
        member_level_growRate: '',
        member_level_upgradeStatus: '0',
        member_level_defaultPassword: '888888',
        member_level_defaultMobile: '0',
        member_level_cardNumberLength: '11',
        member_level_cardNumberPrefix: '',
        member_level_cardNumberSuffix: ''
      }
    }
  },
  components: {},
  mounted () {
    this.getConsumeSet()
  },

  computed: {},
  methods: {
    getConsumeSet () {
      const obj = {
        name: 'level',
        group: 'member'
      }
      this.$store
        .dispatch('settings/getParams', obj)
        .then((res) => {
          if (res.code == 200) {
            this.configData = res.data ? res.data : {}
          }
        })
        .catch((error) => {})
    },
    handleSwitchChange (val, keyName) {
      this.$refs.paramsForm.validate().then(success => {
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
