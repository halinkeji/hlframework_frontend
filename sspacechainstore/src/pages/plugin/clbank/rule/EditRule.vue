<template>
  <q-dialog @hide="hideNowPage" v-model="showDialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.3) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.3) + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-xs q-pb-md">
          <div class="text-subtitle1">{{ dataId ? '修改' : '新增' }}利息规则信息</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink q-pa-sm full-height">
          <q-form ref="newsDataRef" class="q-gutter-md">
            <div class="row">
              <div class="col-12">
                <q-input
                  outlined
                  dense
                  v-model="ruleDataForm.cr_name"
                  label="规则名称"
                  maxlength="255"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || '规则名称不能为空']"
                />
              </div>

              <div class="col-12">
                <q-select
                  outlined
                  dense
                  emit-value
                  map-options
                  v-model="ruleDataForm.cu_interest_type"
                  :options="interestTypeData"
                  label="利息返还模式"
                  :rules="[(val) => !!val || '利息返还模式']"
                >
                </q-select>
              </div>

              <div class="col-12" v-if="parseInt(ruleDataForm.cu_interest_type) == 1">
                <q-input
                  outlined
                  dense
                  v-model="ruleDataForm.cu_interest_fixed_amount"
                  label="固定额度"
                  maxlength="255"
                  lazy-rules
                  :rules="[(val) => (val && val.length > 0) || '固定额度不能为空']"
                />
              </div>

              <div class="col-12" v-if="parseInt(ruleDataForm.cu_interest_type) == 2">
                <q-input
                  outlined
                  dense
                  v-model="ruleDataForm.cu_interest_proportion"
                  label="利息比例0-100"
                  lazy-rules
                  :rules="[(val) => (parseInt(val) > 0 && parseInt(val) < 100) || '请输入0-100的整数']"
                >
                  <template v-slot:append>
                    <div class="tex-dark">%</div>
                  </template>
                </q-input>
              </div>

              <div class="col-12">
                <q-input
                  outlined
                  dense
                  v-model="ruleDataForm.cu_return_period_time"
                  label="返回利息周期"
                  lazy-rules
                  :rules="[(val) => parseInt(val) > 0 || '请输入大于0的整数']"
                />
              </div>

              <div class="col-12">
                <q-select
                  outlined
                  dense
                  emit-value
                  map-options
                  v-model="ruleDataForm.cu_return_period_property"
                  :options="periodTimeData"
                  label="返回利息周期属性"
                  placeholder="选择范围"
                >
                </q-select>
              </div>
            </div>
          </q-form>
        </div>
        <div class="col-shrink bg-white q-pb-sm row q-gutter-sm text-center justify-center">
          <q-btn unelevated class="q-px-xl" label="提交" @click="saveData()" color="primary" />
          <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage()" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'ClbankEditRule',
  data () {
    return {
      showDialogStatus: false,
      dataId: 0,
      ruleDataForm: {
        cu_name: '',
        cu_interest_type: '1',
        cu_interest_fixed_amount: '',
        cu_interest_proportion: '',
        cu_return_period_time: '',
        cu_return_period_property: '5'
      },
      stop: false,
      multiple: false,
      periodTimeData: this.$store.state.clbank.periodTimeData,
      interestTypeData: this.$store.state.clbank.interestTypeData
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init (id) {
      this.dataId = id
      this.showDialogStatus = true
      if (id > 0) {
        this.$store
          .dispatch('clbank/getRuleItemData', {
            id
          })
          .then((res) => {
            if (res.code == 200) {
              this.ruleDataForm = res.data ? res.data : {}
            }
          })
      }
    },

    saveData () {
      this.$refs.newsDataRef.validate().then((success) => {
        if (success) {
          this.stop = true

          const obj = {
            ...this.ruleDataForm,
            id: this.dataId
          }
          this.$store
            .dispatch('clbank/setRuleData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.showDialogStatus = false
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + '规则成功',
                  color: 'green',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
                this.$nextTick(() => {
                  this.hideNowPage()
                })
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '错误',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red'
              })
              this.stop = false
            })
        }
      })
    },

    hideNowPage () {
      this.$emit('getMethods')
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
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
  width: 50%
</style>
