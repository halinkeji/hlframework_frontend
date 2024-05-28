<template>
  <q-dialog v-model="dialogShow" @hide="hideNowPage" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.5) + 'px',
        'max-width': parseInt($q.screen.width * 0.5) + 'px',
      }"

    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 q-pa-sm row">
          {{ packageId > 0 ? '修改' : '新增' }}套餐
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs">
          <q-form ref="rechargeDataRef" class="row">
            <div class="col-8 col-md-6 q-px-xs">
              <q-input
                outlined
                dense
                label="排序:数字越小，排序越靠前"
                :rules="[(val) => /^[0-9]*[0-9][0-9]*$/.test(val) || '请输入正整数']"
                v-model="rechargeFrom.rp_sort"
                maxlength="9"
                placeholder="排序:数字越小，排序越靠前"
              >
              </q-input>
            </div>
            <div class="col-8 col-md-6 q-px-xs">
              <q-select  outlined label="充值套餐状态" bottom-slots v-model="rechargeFrom.rp_status" :options="rechargePackageData" dense emit-value map-options> </q-select>
            </div>
            <div class="col-8 col-md-6 q-px-xs">
              <q-input outlined dense label="充值套餐名称" :rules="[(val) => !!val || '必填项']" v-model="rechargeFrom.rp_name" placeholder="请输入充值套餐名称" maxlength="255"></q-input>
            </div>
            <div class="col-8 col-md-6 q-px-xs">
              <q-input
                outlined
                dense
                label="充值金额"
                :rules="[(val) => /^([1-9]\d*(\.\d{1,2})?|([0](\.([0][1-9]|[1-9]\d{0,1}))))$/.test(val) || '请输入正确的金额']"
                v-model="rechargeFrom.rp_money"
                maxlength="9"
                placeholder="请输入充值金额"
                @input="getConclusion()"
              >
              </q-input>
            </div>

            <div class="col-8 col-md-3 q-px-xs">
              <q-input
                outlined
                dense
                @input="getConclusion()"
                :label="`赠送${$q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_balanceUnit}`"
                maxlength="9"
                :rules="[(val) => /^[0-9]+(.[0-9]{1,2})?$/.test(val) || '请输入正确的金额']"
                v-model="rechargeFrom.rp_give_money"
              >
              </q-input>
            </div>
            <div class="col-8 col-md-3 q-px-xs">
              <q-input
                outlined
                dense
                @input="getConclusion()"
                label="分期上账期数"
                maxlength="9"
                :rules="[(val) => /^\d+$/.test(val) || '请输入正确的期数']"
                v-model="rechargeFrom.rp_return_give_money_phase"
                placeholder="请输入分期上账期数"
              >
                <template v-slot:append>
                  <q-separator dark color="grey" class="q-mx-sm" vertical />
                  <span style="font-size: 14px">{{ returnRecharge }}{{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_balanceUnit }}/期</span>
                </template>
              </q-input>
            </div>
           <div class="col-8 col-md-3 q-px-xs">
              <q-input
                outlined
                dense
                @input="getConclusion()"
                label="分期上账规则"
                v-model="rechargeFrom.rp_give_money_rule_number"
              >
              </q-input>
            </div>
            <div class="col-8 col-md-3 q-px-xs">
            <q-select
                outlined
                dense
                emit-value
                map-options
                v-model="rechargeFrom.rp_give_money_rule_cycle"
                :options="timeOptions"
                label="上账时间"
              ></q-select>
            </div>

            <div class="col-8 col-md-3 q-px-xs">
              <q-input
                outlined
                dense
                @input="getConclusion()"
                :label="`赠送${$q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit}`"
                maxlength="9"
                :rules="[(val) => /^[0-9]+(.[0-9]{1,2})?$/.test(val) || '请输入正确的数目']"
                v-model="rechargeFrom.rp_give_points"
              >
              </q-input>
            </div>
            <div class="col-8 col-md-3 q-px-xs">
              <q-input
                outlined
                dense
                @input="getConclusion()"
                label="分期上账期数"
                maxlength="9"
                :rules="[(val) => /^\d+$/.test(val) || '请输入正确的期数']"
                v-model="rechargeFrom.rp_return_give_points_phase"
                placeholder="请输入分期上账期数"
              >
                <template v-slot:append>
                  <q-separator dark color="grey" class="q-mx-sm" vertical />
                  <span style="font-size: 14px">{{ returnPoint }}{{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit }}/期</span>
                </template>
              </q-input>
            </div>

              <div class="col-8 col-md-3 q-px-xs">
              <q-input
                outlined
                dense
                @input="getConclusion()"
                label="分期上账规则"
                v-model="rechargeFrom.rp_give_points_rule_number"
              >
              </q-input>
            </div>
            <div class="col-8 col-md-3 q-px-xs">
            <q-select
              outlined
              dense
              emit-value
              map-options
              v-model="rechargeFrom.rp_give_points_rule_cycle"
              :options="timeOptions"
              label="上账时间"
            ></q-select>
            </div>

            <div class="col-8 col-md-6 q-px-xs">
              <q-input outlined v-model="startTime" label="开始时间" dense readonly>
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                      <q-date minimal v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" today-btn>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="关闭" color="primary" flat />
                        </div>
                      </q-date>
                    </q-menu>
                  </q-icon>
                </template>
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="确定" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
                <template v-slot:hint> 选择套餐开始时间 </template>
              </q-input>
            </div>
            <div class="col-8 col-md-6 q-px-xs">
              <q-input outlined v-model="endTime" label="结束时间" dense readonly>
                <template v-slot:prepend>
                  <q-icon name="event" class="cursor-pointer">
                    <q-menu square :offset="[12, 10]" transition-show="jump-down" transition-hide="jump-up">
                      <q-date minimal v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" today-btn>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="关闭" color="primary" flat />
                        </div>
                      </q-date>
                    </q-menu>
                  </q-icon>
                </template>
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="确定" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
                <template v-slot:hint> 选择套餐结束时间 </template>
              </q-input>
            </div>

            <div class="q-mt-lg">
              合 计 : <span class="text-h6 text-negative"> {{ rechargeSum }} </span> {{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_balanceUnit }}，赠 送
              <span class="text-h6 text-negative"> {{ rechargeFrom.rp_give_points }} </span>{{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_integralUnit }}
            </div>
          </q-form>
        </div>
        <div class="col-shrink bg-white q-pb-sm q-mt-xs q-gutter-sm text-center">
          <q-btn label="提交" @click="saveData()" unelevated :disable="buttonDisable" class="q-px-xl" color="primary" />
          <q-btn label="关闭" type="reset" v-close-popup unelevated color="grey" class="q-px-xl" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'AddRechargePackages',
  data () {
    return {
      rechargeSum: 0,
      returnMoney: 0,
      returnRecharge: 0,
      returnPoint: 0,
      startTime: '',
      endTime: '',
      rechargeFrom: {
        rp_sort: 0,
        rp_name: '',
        rp_status: 1,
        rp_money: '',
        rp_return_phase: 1,
        rp_give_money: 0,
        rp_return_give_money_phase: 0,
        rp_give_points: 0,
        rp_return_give_points_phase: 0,
        rp_give_points_rule_number: '0',
        rp_give_points_rule_cycle: 'day',
        rp_give_money_rule_number: '0',
        rp_give_money_rule_cycle: 'day'
      },
      rechargePackageData: [
        { label: '开启', value: 1 },
        { label: '关闭', value: 0 }
      ],
      buttonDisable: false,
      dialogShow: false,
      packageId: 0,
      timeOptions: [
        {
          value: 'day',
          label: '天'
        },
        {
          value: 'week',
          label: '周'
        },
        {
          value: 'moth',
          label: '月'
        },
        {
          value: 'season',
          label: '季度'
        },
        {
          value: 'year',
          label: '年'
        }

      ]
    }
  },
  created () {
    this.id = this.$route.params.id
    if (this.$route.params.id > 0) {
      this.getItem()
    }
  },
  mounted () {},
  computed: {},
  methods: {
    init (packageId) {
      this.dialogShow = true
      if (packageId > 0) {
        this.packageId = packageId
        this.$nextTick(() => {
          this.getItem()
        })
      }
    },

    // 获取单条
    getItem () {
      this.$store.dispatch('rechargepackages/getItem', this.packageId).then((res) => {
        if (res.code == 200) {
          const data = res.data
          this.startTime = this.$q_date.formatDate(data.rp_start_time * 1000, 'YYYY-MM-DD')
          this.endTime = this.$q_date.formatDate(data.rp_end_time * 1000, 'YYYY-MM-DD')
          this.rechargeFrom = data
          this.getConclusion()
        }
      })
    },

    // 提交
    saveData () {
      this.$refs.rechargeDataRef.validate().then((success) => {
        if (success) {
          this.buttonDisable = true
          const rechargeFrom = this.rechargeFrom
          if (this.startTime) {
            rechargeFrom.rp_start_time = this.$q_date.formatDate(this.startTime, 'X')
          } else {
            rechargeFrom.rp_start_time = this.$q_date.formatDate(new Date(), 'X')
          }
          if (this.endTime) {
            rechargeFrom.rp_end_time = this.$q_date.formatDate(this.endTime, 'X')
          } else {
            rechargeFrom.rp_end_time = this.$q_date.formatDate(new Date(), 'X')
          }

          if (rechargeFrom.rp_end_time <= rechargeFrom.rp_start_time) {
            this.$q.notify({
              message: '失败',
              caption: '结束时间不得大于等于开始时间,请重新选择',
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            this.buttonDisable = false
            return false
          }
          const obj = {
            id: this.$route.params.id,
            ...rechargeFrom
          }
          this.$store
            .dispatch('rechargepackages/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.$route.params.id > 0 ? '编辑' : '新增'}充值套餐信息成功`,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })

                this.buttonDisable = false
                this.dialogShow = false

                this.$emit('saveSuccess')
              }
            })
            .catch((error) => {
              this.buttonDisable = false
              this.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            })
        }
      })
    },

    getConclusion () {
      // 充值
      if (this.rechargeFrom.rp_money >= 0 && this.rechargeFrom.rp_return_phase > 0) {
        this.returnMoney = this.rechargeFrom.rp_money / this.rechargeFrom.rp_return_phase
        this.returnMoney = Math.round(parseFloat(this.returnMoney) * 100) / 100
      } else {
        this.returnMoney = 0
      }
      //   赠送
      if (this.rechargeFrom.rp_give_money >= 0 && this.rechargeFrom.rp_return_give_money_phase > 0) {
        this.returnRecharge = this.rechargeFrom.rp_give_money / this.rechargeFrom.rp_return_give_money_phase
        this.returnRecharge = Math.round(parseFloat(this.returnRecharge) * 100) / 100
      } else {
        this.returnRecharge = 0
      }
      if (this.rechargeFrom.rp_give_points >= 0 && this.rechargeFrom.rp_return_give_points_phase > 0) {
        this.returnPoint = this.rechargeFrom.rp_give_points / this.rechargeFrom.rp_return_give_points_phase
        this.returnPoint = Math.round(parseFloat(this.returnPoint) * 100) / 100
      } else {
        this.returnPoint = 0
      }
      //   合计
      this.rechargeSum = parseFloat(this.rechargeFrom.rp_money) + parseFloat(this.rechargeFrom.rp_give_money)
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
      this.$emit('closeDialog')
    }
  }
}
</script>
