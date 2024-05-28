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
        <div class="text-h6">{{ dataId ? '修改' : '新增' }}职位</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
      </q-card-section>

      <q-form ref="newsDataRef" class="q-gutter-md">
        <div class="q-ml-lg">
          <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />基础信息</div>
          <q-separator />
          <div class="row q-my-sm">
            <div class="col-8 col-md-6 q-ml-md">
              <q-input outlined dense label="职位名称" :rules="[(val) => !!val || '必填项']" v-model="dataForm.prp_name" placeholder="请输入职位">
                <template v-slot:hint>
                  填写职位名称
                </template></q-input
              >
            </div>
            <div class="col-4 col-md-4 q-ml-md" v-if="is_main_store">
              <!-- <q-select
                label="选择门店"
                v-model="StoreId"
                option-value="id"
                option-label="name"
                emit-value
                map-options
                dense
                outlined
                :options="libInStoreList"
              /> -->
              <q-select
                outlined
                option-value="id"
                option-label="name"
                emit-value
                map-options
                v-model="StoreId"
                :options="libInStoreList"
                dense
                label="选择门店"
              />
            </div>
          </div>
          <div class="row q-my-sm">
            <div class="col-8 col-md-6 q-ml-md">
              <q-select
                class="col-12 col-md-2"
                outlined
                label="职位状态"
                bottom-slots
                v-model="dataForm.prp_status"
                :options="[
                  { label: '开启', value: 1 },
                  { label: '关闭', value: 0 },
                ]"
                dense
                emit-value
                map-options
              >
                <template v-slot:hint> 职位状态 </template>
              </q-select>
            </div>
          </div>
          <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />基础工资</div>
          <q-separator />
          <div class="row q-my-sm">
            <div class="col-8 col-md-6  q-ml-md">
              <q-input
                outlined
                dense
                label="基础工资"
                maxlength="9"
                :rules="[(val) => !!val || '必填项', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '基础工资为非负两位以内小数']"
                v-model="dataForm.prp_base_salary"
                placeholder="请输入基础工资"
              >
                <template v-slot:hint>
                  填写职位基础工资
                </template>
                <template slot="append">{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</template>
              </q-input>
            </div>
          </div>
          <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />开卡设置</div>
          <q-separator />
          <div class="row q-my-sm">
            <div class="col-8 col-md-6  q-ml-md">
              <q-input
                outlined
                dense
                label="开卡奖励"
                maxlength="9"
                :rules="[(val) => !!val || '必填项', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '开卡奖励为非负两位以内小数']"
                v-model="dataForm.prp_open_card_reward"
                placeholder="请输入开卡奖励"
              >
                <template v-slot:hint>
                  填写开卡奖励(/位)
                </template>
                <template slot="append">{{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit }}</template>
              </q-input>
            </div>
          </div>
          <div class="text-subtitle2"><q-icon name="las la-square-full" class="text-primary" />引导消费绩效设置</div>
          <q-separator />
          <div class="row q-my-sm">
            <div class="col-8 col-md-6  q-ml-md">
              <q-input
                outlined
                dense
                label="消费分红百分比"
                :rules="[(val) => !!val || '必填项', , (val) => (/^(0|[1-9]\d*)(.\d{1,2})?$/.test(val) && val <= 100) || '请输入正确的折扣系数格式']"
                v-model="dataForm.prp_consume_reward"
                placeholder="请输入消费分红百分比"
              >
                <template v-slot:hint>
                  填写消费分红百分比
                </template>
                <template slot="append">%</template>
              </q-input>
            </div>
            <!-- <div class="col-8 col-md-6  q-ml-md">
              <q-input
                outlined
                dense
                label="充值分红百分比"
                :rules="[(val) => !!val || '必填项', , (val) => /^(0|[1-9]\d*)(.\d{1,2})?$/.test(val) && val <= 100 || '请输入正确的折扣系数格式']"
                v-model="dataForm.prp_consume_reward"
                placeholder="请输入消费分红百分比"
              >
                <template v-slot:hint>
                  填写消费分红百分比
                </template>
                <template slot="append">%</template>
              </q-input>
            </div> -->
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
export default {
  name: 'AddPosition',
  data() {
    return {
      dialogWidth: '1000px',
      addStoreSidebar: false,
      dataId: 0,
      dataForm: {
        prp_name: '',
        prp_status: 1,
        prp_open_card_reward: '',
        prp_base_salary: '',
        prp_consume_reward: '',
      },
      libInStoreList: [],
      StoreId: '',
      saveStopData: false,
    };
  },
  created() {
    if (this.is_main_store) {
      this.getLibInStoreData();
    }
  },
  mounted() {
    if (this.$q.screen.width) {
      this.dialogWidth = parseInt(this.$q.screen.width * 0.5) + 'px';
    }
  },
  computed: {
    is_main_store() {
      return this.$store.getters['merchant/is_main_store'];
    },
  },
  methods: {
    getLibInStoreData() {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : [];
        }
      });
    },
    init(id) {
      this.addStoreSidebar = true;
      if (id > 0) {
        this.dataId = id;
        this.$store.dispatch('rewardPosition/getItem', id).then((res) => {
          if (res.code == 200) {
            this.dataForm = res.data ? res.data : {};
            if (res.data) {
              this.StoreId = res.data.store_id.toString();
            }
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
            StoreId: this.StoreId,
          };
          this.$store
            .dispatch('rewardPosition/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}` + '职位成功！',
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

    hideNowPage() {
      this.$emit('getMethods');
    },
    authorityMeta(key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id;
        });
        if (newArr.indexOf(key) >= 0) {
          return true;
        }
      }
      return false;
    },
  },
};
</script>
