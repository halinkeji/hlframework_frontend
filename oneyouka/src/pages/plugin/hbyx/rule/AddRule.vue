<template>
  <q-dialog @hide="hideNowPage" v-model="ruleDialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pa-sm text-subtitle2">
          <div class="text-subtitle1">{{ currentRuleId ? '修改' : '新增' }}规则</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <q-separator />
        <div class="col-shrink full-height bg-white">
          <q-form ref="ruleDataRef" class="row  q-pa-sm">
            <div class="col-12">
              <q-select
                outlined
                dense
                v-model="ruleData.phr_status"
                option-label="label"
                :options="statusOptions"
                label="状态"
                emit-value
                map-options
                bottom-slots
              />
            </div>
            <div class="col-12">
              <q-select
                outlined
                dense
                :rules="[(val) => !!val || '会员级别不能为空']"
                v-model="ruleData.phr_member_level_id"
                option-label="mcl_level_name"
                :options="memberLevelData"
                option-value="id"
                emit-value
                map-options
                label="会员级别"
              >
              </q-select>
            </div>
            <div class="col-12">
              <q-input
                outlined
                dense
                v-model="ruleData.phr_time_number"
                label="请输入周期"
                :rules="[(val) => parseInt(val) > 0 || '请输入正整数']"
                hint="请输入正整数"
              />
            </div>
            <div class="col-12">
              <q-select
                outlined
                dense
                v-model="ruleData.phr_time_cycle"
                :options="cycleOptions"
                label="周期类型"
                emit-value
                map-options
                bottom-slots
              >
              </q-select>
            </div>

            <div class="col-12">
              <q-input
                outlined
                dense
                v-model="ruleData.phr_random_amount_ratio"
                label="随机金额比例"
                hint="填写区间：0.01-100"
                :rules="[
                  (val) => (val > 0 && val <= 100) || '请输入正确的百分比格式',
                  (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的百分比格式',
                ]"
              >
                <template v-slot:append> % </template>
              </q-input>
            </div>
            <div class="col-12 ">
              【红包金额说明】示例：设置百分比为20，某会员本次交易应付金额100{{
                $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_moneyUnit
              }}， 则会员本次交易结束后，可获得0.01{{ $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_moneyUnit }}至 20{{
                $q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_moneyUnit
              }}（100 * 20%）的随机红包。
            </div>
          </q-form>
        </div>
        <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
          <q-btn unelevated label="确定" :disable="addButtonDisabled" class="q-px-xl" @click="saveData()" color="primary" />
          <q-btn unelevated label="关闭"  @click="hideNowPage" color="grey" class="q-px-xl" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'hyryxAddRule',
  components: {},
  data () {
    return {
      addButtonDisabled: false,
      ruleData: {
        phr_status: '1',
        phr_random_amount_ratio: '',
        phr_time_cycle: '1',
        phr_time_number: '',
        phr_member_level_id: ''
      },
      statusOptions: [
        { label: '开启', value: '1' },
        { label: '关闭', value: '-1' }
      ],
      cycleOptions: [
        { label: '年', value: '1' },
        { label: '季度', value: '2' },
        { label: '月', value: '3' },
        { label: '周', value: '4' },
        { label: '天', value: '5' },
        { label: '小时', value: '6' }
      ],
      memberLevelData: [],
      currentRuleId: '',
      ruleDialogStatus: false
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (id) {
      this.ruleDialogStatus = true
      this.getLevel()
      if (parseInt(id) > 0) {
        this.currentRuleId = id
        this.$nextTick(() => {
          this.getRuleItem()
        })
      }
    },
    getRuleItem () {
      this.$store
        .dispatch('hbyx/getRuleItem', this.currentRuleId)
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
    },
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
    hideNowPage () {
      this.ruleDialogStatus = false
      this.$emit('closeDialog')
    },

    saveData () {
      this.$refs.ruleDataRef.validate().then((success) => {
        if (success) {
          this.addButtonDisabled = true
          const obj = {
            ...this.ruleData
          }
          this.$store
            .dispatch('hbyx/setRuleData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  message: '成功',
                  caption: '新增规则成功',
                  color: 'green'
                })

                this.hideNowPage()
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
