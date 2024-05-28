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
        <div class="text-h6">员工月指标设置</div>
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
                label="设置员工"
                bottom-slots
                option-value="id"
                option-label="pru_name"
                v-model="dataForm.rui_reward_user_id"
                :options="userList"
                @input="selsceUser"
                :disable="dataId > 0"
                dense
                emit-value
                map-options
              >
              </q-select>
            </div>
            <div class="col-8 col-md-5 q-ml-md">
              <q-input outlined readonly dense label="设置月份" v-model="endTime" disable>
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
          <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />销售指标</div>
          <q-separator />
          <div class="row q-my-sm">
            <div class="col-8 col-md-6 q-ml-md">
              <q-input outlined dense label="销售目标金额" v-model="dataForm.rui_consume_target_amount" @change="exponentSum">
                <template slot="append">{{
                  $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit
                }}</template></q-input
              >
            </div>
            <div class="col-8 col-md-5 q-ml-md">
              <q-input outlined dense label="分解指数" v-model="dataForm.rui_resolve_exponent" @change="exponentSum" disable> </q-input>
            </div>
            <div class="col-8 col-md-6 q-ml-md q-mt-sm">
              <q-input outlined dense label="每1指数" v-model="dataForm.rui_one_exponent" disable
                ><template slot="append">{{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</template>
              </q-input>
            </div>
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
        rui_reward_user_id: '',
        rui_reward_user_name: '',
        rui_store_indicators_id: '',
        rui_set_store_id: '',
        rui_store_name: '',
        rui_resolve_exponent: '100',
        rui_one_exponent: '',
        rui_consume_target_amount: '',
        rui_start_time: '',
        rui_end_time: '',
      },
      saveStopData: false,
      endTime: '',
      noTargetTamount: '',
      userList: [],
    };
  },
  created() {},
  mounted() {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.7) + 'px';
    }
  },
  computed: {},
  methods: {
    getUserDatas() {
      this.$store.dispatch('rewardIndicators/getUserData', { storeId: this.dataForm.rui_set_store_id }).then((res) => {
        if (res.code == 200) {
          this.userList = res.data ? res.data : [];
        }
      });
    },
    optionEndDate(nowDate) {
      const newDate = new Date();
      return nowDate >= date.formatDate(date.subtractFromDate(newDate, { day: 1 }), 'YYYY/MM/DD');
    },
    getSettleWage() {
      if (this.dataForm.rui_set_store_id > 0 && this.endTime) {
        var obj = {
          reward_user_id: this.dataForm.rui_reward_user_id,
          time: this.endTime,
        };
        this.$store.dispatch('rewardIndicators/chaeckUserData', obj).then((res) => {
          if (res.code == 200 && res.data) {
            this.saveStopData = false;
          } else {
            this.$q.notify({
              message: '操作失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: res.message,
              color: 'red',
            });
            this.saveStopData = true;
          }
        });
      }
    },
    selsceUser() {
      const that = this;
      if (that.dataForm.rui_reward_user_id > 0) {
        const data = that.userList.find(function (x) {
          return x.id == that.dataForm.rui_reward_user_id;
        });
        that.dataForm.rui_reward_user_name = data.pru_name;
        that.getSettleWage()
      }
    },
    getUser(id, data, number) {
      this.addStoreSidebar = true;
      if (data) {
        this.noTargetTamount = number;
        this.dataForm.rui_set_store_id = data.rsi_set_store_id;
        this.dataForm.rui_store_name = data.rsi_store_name;
        this.dataForm.rui_start_time = data.rsi_start_time;
        this.dataForm.rui_end_time = data.rsi_end_time;
        this.dataForm.rui_store_indicators_id = data.id;
        this.endTime = this.$q_date.formatDate(data.rsi_start_time * 1000, 'YYYY-MM');

        this.$nextTick(() => {
          this.getUserDatas();
        });
      }
      if (id > 0) {
        this.dataId = id;
        this.$store.dispatch('rewardIndicators/getItem', id).then((res) => {
          if (res.code == 200) {
            this.dataForm = res.data ? res.data : {};
            this.endTime = this.$q_date.formatDate(res.data.rsi_start_time * 1000, 'YYYY-MM');
          }
        });
      }
    },
    saveData() {
      this.$refs.newsDataRef.validate().then((success) => {
        if (success) {
          this.saveStopData = true;
          this.addStoreSidebar = false;
          const obj = {
            ...this.dataForm,
            id: this.dataId,
          };
          this.$store
            .dispatch('rewardIndicators/setUserData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + '员工月指标成功！',
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
    exponentSum() {
      if (this.dataForm.rui_consume_target_amount > 0 && this.dataForm.rui_resolve_exponent) {
        this.dataForm.rui_one_exponent = this.formatAmount(this.dataForm.rui_consume_target_amount / this.dataForm.rui_resolve_exponent);
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
      this.endTime = '';
      this.dataForm = {
        rui_set_store_id: '',
        rui_store_name: '',
        rui_resolve_exponent: '100',
        rui_one_exponent: '',
        rui_consume_target_amount: '',
        rui_start_time: '',
        rui_end_time: '',
      };
      this.$emit('getMethods');
    },
  },
};
</script>
