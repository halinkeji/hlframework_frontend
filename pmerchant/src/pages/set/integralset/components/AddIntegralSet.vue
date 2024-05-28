<template>
  <q-dialog @hide="hideNowPage" v-model="dialogShow" persistent class="fit">
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.5) + 'px',
        'max-width': parseInt($q.screen.width * 0.5) + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-pa-sm row">
          新增{{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit }}折扣设置
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <q-separator />
        <div class="col-shrink full-height bg-white">
          <q-form ref="integralDataRef" class="q-gutter-md">
            <div class="row">
              <div class="col-6">
                <q-input outlined dense class="q-mt-sm q-px-sm" v-model="integralData.ic_sort" label="排序" maxlength="9" lazy-rules :rules="[(val) => /^\d+$/.test(val) || '请输入正确的排序']" />
              </div>
              <div class="col-6">
                <q-input
                  outlined
                  dense
                  class="q-mt-sm q-px-sm"
                  v-model="integralData.ic_name"
                  label="规则名称"
                  lazy-rules
                  maxlength="255"
                  :rules="[(val) => (val && val.length > 0) || '规则名称不能为空']"
                />
              </div>
              <div class="col-6">
                <q-select
                  class="q-mt-sm q-px-sm"
                  outlined
                  dense
                  lazy-rules
                  :rules="[(val) => !!val || '业务类型不能为空']"
                  option-label="lable"
                  option-value="value"
                  v-model="scenes_type"
                  :options="scenesTypeOptions"
                  @input="scenesChange($event)"
                  label="业务类型"
                >
                </q-select>
              </div>
              <div class="col-6">
                <q-select
                  class="q-mt-sm q-px-sm"
                  outlined
                  dense
                  lazy-rules
                  :rules="[(val) => !!val || '会员(级别)不能为空']"
                  v-model="level"
                  :options="memberCardLevelDatas"
                  @input="levelChange($event)"
                  label="会员(级别)"
                >
                </q-select>
              </div>
              <div class="col-6">
                <q-select
                  class="q-mt-sm q-px-sm"
                  outlined
                  dense
                  lazy-rules
                  :rules="[(val) => !!val || '会员(生日)不能为空']"
                  v-model="birthday_type"
                  :options="birthdayOptions"
                  @input="birthdaySChange($event)"
                  label="会员(生日)"
                >
                </q-select>
              </div>
              <div class="col-6">
                <q-select class="q-mt-sm q-px-sm" outlined label="状态" bottom-slots v-model="integralData.ic_status" :options="statusOptions" dense emit-value map-options> </q-select>
              </div>
            </div>

            <q-card flat square>
              <div class="text-subtitle2 q-mb-xs"><q-icon name="las la-square-full" class="text-primary" />折扣设置</div>
              <q-separator />

              <div class="row">
                <div class="col-6">
                  <q-input
                    outlined
                    dense
                    class="col-12 col-md-6 q-mt-sm q-px-sm"
                    v-model="integralData.ic_discount_ratio"
                    label="折扣百分比"
                    lazy-rules
                    :rules="[(val) => (val > -1 && val <= 100) || '请输入正确的折扣百分比格式', (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的折扣百分比格式']"
                  >
                    <template v-slot:append>
                      %
                    </template>
                    <template v-slot:hint>
                      范围：1~100
                    </template>
                  </q-input>
                </div>
                <div class="col-6">
                  <q-input
                    outlined
                    dense
                    class="col-12 col-md-6 q-mt-sm q-px-sm"
                    v-model="integralData.ic_integral_ratio"
                    :label="`${$q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit}换算比例`"
                    :error="false"
                    lazy-rules
                    :rules="[
                      (val) => (val > -1 && val <= 100) || '请输入正确的' + $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit + '换算比例',
                      (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的' + $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit + '换算比例',
                    ]"
                  >
                    <template v-slot:hint>
                     范围：大于等于0
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="q-pa-sm">
                <div class="row q-mt-sm text-red">
                  <q-icon name="las la-question-circle" color="red" size="sm"></q-icon> 【业务类型+会员级别+会员生日】每套组合只能添加一套规则，消费符合多种规则取折扣百分比最低规则进行计算
                </div>
                <div class=" q-mt-sm text-red">
                  <q-icon name="las la-question-circle" color="red" size="sm"></q-icon>
                  启用后，在收银台结账时，消费金额会按照设置折扣百分比自动计算。示例：单笔消费应付金额 100{{
                    $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_moneyUnit
                  }}，选择平台优惠规则 8折（折扣百分比填 80），则该笔消费实际支付金额 80 {{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_moneyUnit }}，优惠金额 20
                  {{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_moneyUnit }}（ 100 - 100 × 80% = 20 ）
                </div>

                <div class=" q-mt-sm text-red">
                  <q-icon name="las la-question-circle" color="red" size="sm"></q-icon>

                  启用后，在收银台结账时，赠送{{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit }}会按照该换算比例自动计算。示例：单笔消费实付金额 100 {{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_moneyUnit }}，选择平台优惠规则 1 {{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_moneyUnit }} = 2 {{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit }} （{{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit }}换算比例填 2 ），则该笔消费实付金额 100 {{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_moneyUnit }}，赠送 200 {{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit }} （ 100 ×（1×2 ） = 200 ）

                </div>
              </div>
            </q-card>
          </q-form>
        </div>
        <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
          <q-btn unelevated label="提交" class="q-px-xl" @click="saveData()" color="primary" />
          <q-btn unelevated label="关闭" type="reset" v-close-popup color="grey" class="q-px-xl" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import { LocalStorage } from 'quasar'
export default {
  name: 'AddIntegralSet',
  components: {},
  data () {
    return {
      stop: false,
      level: '',
      birthday_type: '',
      scenes_type: '',
      integralData: {
        ic_sort: '0',
        ic_name: '',
        ic_scenes_type: 'all',
        ic_scenes_name: '',
        ic_level: '',
        ic_level_id: '',
        ic_level_name: '',
        ic_discount_ratio: '',
        ic_integral_ratio: '',
        ic_birthday_type: 'all',
        ic_birthday_sign: '不限',
        ic_status: '1'
      },
      birthdayOptions: [
        {
          value: 'all',
          label: '不限'
        },
        {
          value: 'today',
          label: '当天生日的会员'
        },
        {
          value: 'week',
          label: '本周生日的会员'
        },
        {
          value: 'month',
          label: '本月生日的会员'
        }
      ],
      scenesTypeOptions: [],
      memberCardLevelDatas: [
        {
          value: 'all',
          label: '所有（散客及会员）',
          id: 0
        },
        {
          value: 'guest',
          label: '所有散客',
          id: 0
        },
        {
          value: 'member',
          label: '所有会员',
          id: 0
        }
      ],
      dialogShow: false,
      statusOptions: [
        { label: '开启', value: '1' },
        { label: '关闭', value: '0' }
      ],
      pluginsScenesType: [
        {
          lable: '自助买单',
          value: 'Zzpay',
          pluginName: 'Zzpay'
        }
      ]
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init () {
      this.dialogShow = true
      this.getItem()
      this.getLevel()
    },
    saveData () {
      this.$refs.integralDataRef.validate().then((success) => {
        if (success) {
          this.stop = true
          const obj = {
            ...this.integralData
          }
          this.$store
            .dispatch('integralset/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: '新增' + this.$q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit + '折扣设置成功',
                  color: 'green'
                })

                this.dialogShow = false
                this.$emit('setSuccess')
              } else {
                this.$q.notify({
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '失败',
                  caption: res.message,
                  color: 'red'
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                message: '失败',
                caption: error.message,
                color: 'red'
              })
            })
        }
      })
    },
    getItem () {
      this.$store.dispatch('integralset/getScene').then((res) => {
        if (res.code == 200) {
          const scenesTypeOptions = res.data
          const openPlugins = LocalStorage.getItem('pmerchant_plugins_local').openPlugins
          if (this.pluginsScenesType) {
            this.pluginsScenesType.forEach((item) => {
              if (openPlugins.indexOf(item.pluginName) > -1) {
                scenesTypeOptions.push(item)
              }
            })
          }
          this.scenesTypeOptions = scenesTypeOptions
        }
      })
    },
    getLevel () {
      this.$store.dispatch('level/getAllData').then((res) => {
        if (res.code == 200) {
          const data = res.data

          if (data) {
            if (data.length > 0) {
              this.specNewsDataBak = []
              for (let i = 0; i < data.length; i++) {
                const person = {
                  value: '',
                  label: '',
                  id: ''
                }
                person.label = data[i].mcl_level_name
                person.value = 'level_' + data[i].id
                person.id = data[i].id
                this.specNewsDataBak.push(person)
              }
              this.memberCardLevelDatas = this.memberCardLevelDatas.concat(this.specNewsDataBak)
            }
          }
        }
      })
    },

    levelChange ($event) {
      this.integralData.ic_level = $event.value
      this.integralData.ic_level_id = $event.id
      this.integralData.ic_level_name = $event.label
    },

    birthdaySChange ($event) {
      this.integralData.ic_birthday_sign = $event.value
      this.integralData.ic_birthday_type = $event.label
    },
    scenesChange ($event) {
      this.integralData.ic_scenes_type = $event.value
      this.integralData.ic_scenes_name = $event.lable
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
    hideNowPage () {
      this.$emit('closePage')
    }
  }
}
</script>

<style scoped></style>
