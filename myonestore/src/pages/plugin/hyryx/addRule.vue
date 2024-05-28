<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-mb-xs">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        规则信息
      </div>
      <div class="col-shrink full-height bg-white">
        <q-scroll-area class="fit full-height">
          <q-form ref="ruleDataRef" class="q-gutter-md">
            <q-card flat square class="q-pa-md">
              <div class="text-subtitle2 q-mb-xs"><q-icon name="las la-square-full" class="text-primary" />规则类型设置</div>
              <q-separator />
              <div class="row">
                <div class="col-7 q-px-sm q-mt-sm">
                  <q-input
                    outlined
                    dense
                    class=""
                    v-model="ruleData.phr_name"
                    label="规则名称"
                    lazy-rules
                    maxlength="255"
                    :rules="[(val) => (val && val.length > 0) || '规则名称不能为空']"
                  />
                </div>
                <div class="col-7 q-px-sm q-mt-xs">
                  <q-select
                    outlined
                    dense
                    v-model="ruleData.phr_status"
                    option-label="label"
                    :options="statusOptions"
                    label="状态"
                    emit-value
                    map-options
                  />
                </div>
                <div class="col-7 q-px-sm q-mt-lg">
                  <q-select
                    outlined
                    dense
                    :rules="[(val) => !!val || '会员级别不能为空']"
                    v-model="ruleData.phr_level_name"
                    option-label="mcl_level_name"
                    :options="memberLevelData"
                    @input="levelChange($event)"
                    label="会员级别"
                  >
                  </q-select>
                </div>
                <div class="col-7 q-mt-xs q-px-sm">
                  <q-select
                    outlined
                    dense
                    v-model="ruleData.phr_type"
                    :options="cycleOptions"
                    @input="cycleChange"
                    label="规则周期"
                    emit-value
                    map-options
                  >
                  </q-select>
                </div>
                <div class="col-7 q-px-sm q-mt-lg" v-if="parseInt(ruleData.phr_type) == 1">
                  <q-input
                    outlined
                    dense
                    v-model="ruleData.phr_day"
                    label="请输入周几"
                    :rules="[(val) => (val > 0 && val <= 7) || '请输入正确的日期', (val) => /^\d+$/.test(val) || '请输入1-7的正整数']"
                    hint="请输入1-7的正整数"
                  />
                </div>
                <div class="col-7 q-px-sm q-mt-lg" v-if="parseInt(ruleData.phr_type) == 2">
                  <q-input
                    outlined
                    dense
                    v-model="ruleData.phr_day"
                    label="请输入每月几号"
                    :rules="[(val) => (val > 0 && val <= 31) || '请输入正确的日期', (val) => /^\d+$/.test(val) || '请输入正确的日期']"
                  />
                </div>
              </div>
            </q-card>
            <q-card flat square class="q-pa-md">
              <div class="text-subtitle2 q-mb-xs"><q-icon name="las la-square-full" class="text-primary" />折扣设置</div>
              <q-separator />
              <div class="row">
                <div class="col-7">
                  <q-input
                    outlined
                    dense
                    class="col-12 col-md-6 q-mt-sm q-px-sm"
                    v-model="ruleData.phr_discount_proportion"
                    label="折扣百分比"
                    :rules="[
                      (val) => (val > 0 && val <= 100) || '请输入正确的折扣百分比格式',
                      (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的折扣百分比格式',
                    ]"
                  >
                    <template v-slot:append>
                      %
                    </template>
                  </q-input>
                </div>
                <div class="col-7">
                  <q-input
                    outlined
                    dense
                    class="col-12 col-md-6 q-mt-sm q-px-sm"
                    v-model="ruleData.phr_integral_multiple"
                    :label="`${$q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit}` + '倍数'"
                    :error="false"
                    lazy-rules
                    :rules="[(val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的数字']"
                  >
                  </q-input>
                </div>
              </div>
              <div class="row p-mt-sm text-red">
                【折扣百分比】示例：设置折扣百分比为80，某会员本次交易应付金额100{{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneyUnit }}，则会员本次交易实付金额80{{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneyUnit }}（100×80%=80{{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneyUnit }}）。
              </div>
              <div class="row p-mt-sm text-red">
              【{{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit }}倍数】（会员实付金额 × {{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit }}换算比例）* {{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit }}倍数 。示例：设置{{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit }}倍数为2，某会员本次交易实付100{{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_moneyUnit }}，{{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit }}换算比例1元 = 3{{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit }}，（100 * 3） * 2 = 600{{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit }}。则会员本次交易实获赠600{{ $q.localStorage.getItem('myonestore_store_local').storeBaseConfig.consume_base_integralUnit }}。
              </div>
            </q-card>
          </q-form>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
        <q-btn
          unelevated
          label="确定"
          :disable="addButtonDisabled"
          class="q-px-xl"
          @click="saveData()"
          color="primary"
        />
        <q-btn unelevated label="返回" type="reset" :to="{ name: 'hyryxRule' }" color="grey" class="q-px-xl" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'hyryxAddRule',
  components: {},
  data () {
    return {
      addButtonDisabled: false,
      ruleData: {
        phr_name: '',
        phr_status: '1',
        phr_type: '1',
        phr_day: '',
        phr_discount_proportion: '',
        phr_integral_multiple: '',
        phr_level_id: '',
        phr_level_name: ''
      },
      statusOptions: [
        { label: '开启', value: '1' },
        { label: '关闭', value: '-1' }
      ],
      cycleOptions: [
        { label: '每周', value: '1' },
        { label: '每月', value: '2' }
      ],
      memberLevelData: []
    }
  },
  created () {
    this.getLevel()
  },
  mounted () {
    if (parseInt(this.$route.query.ruleId) > 0) {
      this.init(this.$route.query.ruleId)
    }
  },
  computed: {},
  methods: {
    getLevel () {
      this.$store
        .dispatch('level/getAllData')
        .then((res) => {
          if (res.code == 200) {
            this.memberLevelData = res.data ? res.data : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
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

    init (id) {
      if (id > 0) {
        this.$store
          .dispatch('hyryx/getRuleItemData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.ruleData = res.data ? res.data : {}
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            }
          })
          .catch((err) => {
            this.$q.notify({
              message: '失败',
              caption: err.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    saveData () {
      this.$refs.ruleDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          const obj = {
            ...this.ruleData
          }
          this.$store
            .dispatch('hyryx/setRuleData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: '新增会员日营销规则成功',
                  color: 'green'
                })

                this.$router.push({ name: 'hyryxRule' })
              } else {
                this.$q.notify({
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '失败',
                  caption: res.message,
                  color: 'red'
                })
                this.addButtonDisabled = false
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
    levelChange ($event) {
      this.ruleData.phr_level_id = $event.id
      this.ruleData.phr_level_name = $event.mcl_level_name
    },
    cycleChange () {
      this.ruleData.phr_day = ''
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

<style scoped></style>
