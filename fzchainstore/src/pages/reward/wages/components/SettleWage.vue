<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: dialogWidth,
        'max-width': dialogWidth,
      }"
      class="q-pa-sm"
    >
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">结算薪资</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
      </q-card-section>

      <q-form ref="newsDataRef" class="q-gutter-md">
        <div class="q-ml-lg">
          <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />基础信息</div>
          <q-separator />
          <div class="row q-my-sm">
            <div class="col-8 col-md-6 q-ml-md">
              <q-select
                outlined
                label="结算员工"
                bottom-slots
                option-value="id"
                option-label="pru_name"
                v-model="dataForm.rwr_reward_user_id"
                :options="userInfo"
                dense
                emit-value
                map-options
              >
              </q-select>
            </div>
            <div class="col-8 col-md-5 q-ml-md">
              <q-input outlined readonly dense label="结算月份" v-model="endTime">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy transition-show="scale" transition-hide="scale">
                      <q-date v-model="endTime" :options="optionEndDate" mask="YYYY-MM">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="确定" color="primary" flat @click="getSettleWage()" />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
          <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />统计</div>
          <q-separator />
          <div class="row q-my-sm">
            <div class="col-8 col-md-11 q-ml-md">
              <q-input outlined dense label="基础工资" v-model="dataForm.rwr_base_salary" disable>
                <template slot="append">{{
                  $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit
                }}</template></q-input
              >
            </div>
            <div class="col-8 col-md-6 q-ml-md q-mt-sm">
              <q-input outlined dense label="引导开卡数" v-model="dataForm.rwr_open_card_number" disable> </q-input>
            </div>
            <div class="col-8 col-md-5 q-ml-md q-mt-sm">
              <q-input outlined dense label="引导开卡金额" v-model="dataForm.rwr_open_card_reward_amount" disable>
                <template slot="append">{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</template>
              </q-input>
            </div>
            <div class="col-8 col-md-6 q-ml-md q-mt-sm">
              <q-input outlined dense label="引导消费金额" v-model="dataForm.rwr_total_reward_amount" disable>
                <template slot="append">{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</template>
              </q-input>
            </div>
            <div class="col-8 col-md-5 q-ml-md q-mt-sm">
              <q-input outlined dense label="引导消费绩效" v-model="dataForm.rwr_consume_reward_amount" disable>
                <template slot="append">{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</template>
              </q-input>
            </div>
          </div>
          <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />指标统计</div>
          <q-separator />
          <div class="row q-my-sm">
            <div class="col-8 col-md-6 q-ml-md q-mt-sm">
              <q-input outlined dense label="总质指标" v-model="dataForm.rwr_target_amount" disable>
                <template slot="append">{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</template>
              </q-input>
            </div>
            <div class="col-8 col-md-5 q-ml-md q-mt-sm">
              <q-input outlined dense label="完成指标" v-model="dataForm.rwr_realy_amount" disable>
                <template slot="append">{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</template>
              </q-input>
            </div>
            <div class="col-8 col-md-6 q-ml-md q-mt-sm">
              <q-input outlined dense label="指标完成率" v-model="dataForm.rwr_complete_ratio" disable>
                <template slot="append">{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</template>
              </q-input>
            </div>
          </div>
          <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />提成统计</div>
          <q-separator />
          <div class="row q-my-sm">
            <div class="col-8 col-md-5 q-ml-md q-mt-sm">
              <q-input outlined dense label="总业绩" v-model="dataForm.rwr_performance_total_amount" disable>
                <template slot="append">{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</template>
              </q-input>
            </div>
            <div class="col-8 col-md-6 q-ml-md q-mt-sm">
              <q-input outlined dense label="实际业绩" v-model="dataForm.rwr_performance_amount" disable>
                <template slot="append">{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</template>
              </q-input>
            </div>
            <div class="col-8 col-md-5 q-ml-md q-mt-sm">
              <q-input outlined dense label="非提成业绩" v-model="dataForm.rwr_no_performance_amount" disable>
                <template slot="append">{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</template>
              </q-input>
            </div>
            <div class="col-8 col-md-6 q-ml-md q-mt-sm">
              <q-input outlined dense label="提成工资" v-model="dataForm.rwr_performance_wage" disable>
                <template slot="append">{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</template>
              </q-input>
            </div>
          </div>
          <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />薪资补贴</div>
          <q-separator />
          <div class="row q-my-sm">
            <div class="col-8 col-md-11 q-ml-md">
              <q-btn-group unelevated>
                <q-btn color="primary" label="添加补贴" @click="addSubsidy" unelevated icon="las la-plus-square" />
              </q-btn-group>
            </div>
          </div>
          <div v-for="(item, normIndex) in subsidyData" :key="normIndex">
            <div class="row q-mt-xs" v-if="item.crs_type == 1">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="补贴项" v-model="item.crs_name"> </q-input>
              </div>
              <div class="col-8 col-md-4 q-ml-md">
                <q-input
                  outlined
                  dense
                  label="补贴金额"
                  v-model="item.crs_amount"
                  :rules="[(val) => !!val || '必填项', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '补贴金额为非负两位以内小数']"
                >
                  <template slot="append">{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</template>
                </q-input>
              </div>
              <div class="col-md-1">
                <div class="q-ml-md q-mt-md">
                  <q-icon @click="deleteSubsidy(normIndex)" color="red" class="text-h5" name="delete "> </q-icon>
                </div>
              </div>
            </div>
          </div>
          <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />薪资扣除</div>
          <q-separator />
          <div class="row q-my-sm">
            <div class="col-8 col-md-11 q-ml-md">
              <q-btn-group unelevated>
                <q-btn color="primary" label="添加扣除" @click="deductSubsidy" unelevated icon="las la-plus-square" />
              </q-btn-group>
            </div>
          </div>
          <div v-for="(item, normIndex) in subsidyData" :key="normIndex">
            <div class="row q-mt-xs" v-if="item.crs_type == 2">
              <div class="col-8 col-md-6 q-ml-md">
                <q-input outlined dense label="扣除项" v-model="item.crs_name"> </q-input>
              </div>
              <div class="col-8 col-md-4 q-ml-md">
                <q-input
                  outlined
                  dense
                  label="扣除金额"
                  v-model="item.crs_amount"
                  :rules="[(val) => !!val || '必填项', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '扣除金额为非负两位以内小数']"
                >
                  <template slot="append">{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</template>
                </q-input>
              </div>
              <div class="col-md-1">
                <div class="q-ml-md q-mt-md">
                  <q-icon @click="deleteSubsidy(normIndex)" color="red" class="text-h5" name="delete "> </q-icon>
                </div>
              </div>
            </div>
          </div>
          <div class="q-mt-xs">
            <q-chip outline square color="red" text-color="white">
              实发工资{{ realWage }} {{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</q-chip
            >
          </div>
        </div>
      </q-form>
      <div class="row q-gutter-sm text-center justify-center">
        <q-btn unelevated class="q-px-xl" label="提交" @click="saveData" :disable="saveStopData" color="primary" />
        <q-btn unelevated class="q-px-xl" label="关闭" color="grey" @click="hideNowPage" />
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from 'quasar';
export default {
  name: 'SettleWage',
  components: {},
  data() {
    return {
      dialogWidth: '1000px',
      addStoreSidebar: false,
      dataId: 0,
      dataForm: {
        rwr_position_id: '',
        rwr_reward_user_id: '',
        rwr_reward_user_name: '',
        rwr_base_salary: '',
        rwr_open_card_reward_amount: '',
        rwr_open_card_number: '',
        rwr_consume_reward_amount: '',
        rwr_total_reward_amount: '',
        rwr_performance_amount: '',
        rwr_subsidy__amount: '',
        rwr_start_time: '',
        rwr_end_time: '',
        rwr_subsidy_amount: '',
        rwr_deduct_amount: '',
        rwr_real_wage: '',
      },
      subsidyData: [],
      userInfo: [],
      saveStopData: false,
      endTime: '',
      userName: '',
      member: '',
    };
  },
  created() {},
  mounted() {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.7) + 'px';
    }
  },
  computed: {
    realWage() {
      const that = this;
      let addAmount = 0;
      let decutAmount = 0;

      that.subsidyData.forEach(function (item) {
        if (item.crs_type == 1) {
          addAmount += that.formatAmount(item.crs_amount);
        }
        if (item.crs_type == 2) {
          decutAmount += that.formatAmount(item.crs_amount);
        }
      });
      console.log(
        'asasd',
        that.dataForm.rwr_base_salary,
        addAmount,
        decutAmount,
        that.dataForm.rwr_performance_wage,
        that.dataForm.rwr_consume_reward_amount
      );
      return (
        that.formatAmount(
          that.formatAmount(that.dataForm.rwr_base_salary) +
            that.formatAmount(addAmount) +
            that.formatAmount(that.dataForm.rwr_open_card_reward_amount) +
            that.formatAmount(that.dataForm.rwr_consume_reward_amount) +
            that.formatAmount(that.dataForm.rwr_performance_wage)
        ) - that.formatAmount(decutAmount)
      );
    },
  },
  methods: {
    optionEndDate(nowDate) {
      const newDate = new Date();
      return nowDate <= date.formatDate(date.subtractFromDate(newDate, { day: 1 }), 'YYYY/MM/DD');
    },
    getSettleWage() {
      if (this.dataForm.rwr_reward_user_id > 0 && this.endTime) {
        var obj = {
          user_id: this.dataForm.rwr_reward_user_id,
          time: this.endTime,
        };
        this.$store.dispatch('rewardWages/getUserData', obj).then((res) => {
          if (res.code == 200 && res.data) {
            this.dataForm = res.data ? res.data : {};
          } else {
            this.addStoreSidebar = false;
          }
        });
      }
    },
    getUser() {
      this.addStoreSidebar = true;
      this.$store.dispatch('rewardPerformance/getUserLists').then((res) => {
        if (res.code == 200 && res.data) {
          this.userInfo = res.data ? res.data : [];
        }
      });
      //
    },
    saveData() {
      this.$refs.newsDataRef.validate().then((success) => {
        if (success) {
          this.saveStopData = true;
          this.addStoreSidebar = false;
          if (this.subsidyData.length > 0) {
            const that = this;
            let amount = 0;
            let deductAmount = 0;
            this.subsidyData.forEach(function (item) {
              if (item.crs_type == 1) {
                amount += that.formatAmount(item.crs_amount);
              }
              if (item.crs_type == 2) {
                deductAmount += that.formatAmount(item.crs_amount);
              }
            });
            this.dataForm.rwr_subsidy_amount = amount;
            this.dataForm.rwr_deduct_amount = deductAmount;
            this.dataForm.rwr_real_wage = this.realWage;
          }
          const obj = {
            ...this.dataForm,
            id: this.dataId,
            subsidyData: this.subsidyData,
          };
          this.$store
            .dispatch('rewardWages/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + '员工工资成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right',
                });
                this.$nextTick(() => {
                  this.hideNowPage();
                });
              }
            })
            .catch((error) => {
              this.$q.notify({
                message: '操作失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: error.message,
                color: 'red',
              });
              this.saveStopData = false;
            });
        }
      });
    },
    getUserData(val) {
      this.userStatus = false;
      if (val.length > 0) {
        this.dataForm.pru_user_id = parseInt(val[0].id);
        this.userName = val[0].username;
      }
    },
    // 格式化保留小数点后两位数据
    formatAmount(value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0;
      } else {
        return Math.round(parseFloat(value) * 100) / 100;
      }
    },
    hideNowPage() {
      this.addStoreSidebar = false;
      this.saveStopData = false;
      this.dataId = 0;
      this.dataForm = {
        pru_name: '',
        pru_telephone: '',
        pru_status: '1',
        pru_member_id: '',
        pru_user_id: '',
      };
      this.member = '';
      this.userName = '';
      this.$emit('getMethods');
    },
    addSubsidy() {
      const layoutArray = this.subsidyData;
      const newlayout = {
        crs_name: '',
        crs_type: 1,
        crs_amount: '',
      };
      layoutArray.push(newlayout);
    },
    deductSubsidy() {
      const layoutArray = this.subsidyData;
      const newlayout = {
        crs_name: '',
        crs_type: 2,
        crs_amount: '',
      };
      layoutArray.push(newlayout);
    },
    // 删除
    deleteSubsidy(mainKey) {
      setTimeout(() => {
        this.subsidyData.splice(mainKey, 1);
      }, 100);
    },
  },
};
</script>
