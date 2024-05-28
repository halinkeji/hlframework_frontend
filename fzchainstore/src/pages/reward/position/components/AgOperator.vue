<template>
  <div>
    <q-btn color="secondary" class=" q-mx-sm" unelevated v-if="authorityMeta('join')" label="生成绩效记录" @click="buttonShow" />
    <q-btn
      color="positive"
      class=" q-mx-sm"
      unelevated
      v-if="authorityMeta('join')"
      label="员工管理"
      :to="{ name: 'addUser', query: { id: dataId, storeId: params.data.store_id } }"
    />
    <q-btn color="primary" class="q-mx-sm" unelevated label="修改" v-if="authorityMeta('edit')" @click="editPotion" />
    <q-btn color="red" unelevated label="删除" v-if="authorityMeta('del')" @click="confirmDeleteRecord" />

    <q-dialog v-model="dialogShow" persistent @hide="clearFields">
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.4) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.4) + 'px',
        }"
      >
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">生成绩效记录</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @close="clearFields" />
        </q-card-section>
        <q-card-section>
          <q-form ref="itemDataRef" class="q-gutter-md">
            <div class="row items-center">
              <div class="col-3 col-md-2 q-mt-sm text-center">职位名称：</div>
              <div class="col-8 col-md-6 q-ml-md ">
                <div class="col-12 col-md-6 q-mt-sm q-px-sm text-h6">
                  {{ itemData.prp_name }}
                </div>
              </div>
            </div>
            <div class="row items-center">
              <div class="col-3 col-md-3 text-center">绩效记录开始时间：</div>
              <div class="col-8 q-pt-sm col-md-6 q-ml-md">
                <q-input outlined dense label="开始时间" v-model="startTime" readonly>
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date minimal v-model="startTime" mask="YYYY-MM-DD">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="确定" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
            <div class="row items-center">
              <div class="col-3 col-md-3 text-center">绩效记录结束时间：</div>
              <div class="col-8 q-pt-sm col-md-6 q-ml-md">
                <q-input outlined dense label="结束时间" v-model="endTime" readonly>
                  <template v-slot:prepend>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy transition-show="scale" transition-hide="scale">
                        <q-date minimal v-model="endTime" mask="YYYY-MM-DD ">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="确定" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </q-form>
        </q-card-section>

        <q-card-actions align="right" class="q-pb-md">
          <q-btn label="生成记录" @click="addUpdateReward()" color="primary" class="text-right q-px-md" unelevated />
          <q-btn label="取消" @click="clearFields()" class="text-right q-px-md" color="grey" unelevated />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: 'AgOperator',
  data() {
    return {
      dataId: 0,
      dialogShow: false,
      itemData: {},
      startTime: '',
      endTime: '',
    };
  },
  created() {
    this.dataId = this.params.data.id;
    this.itemData = this.params.data;
  },
  mounted() {},
  computed: {},
  methods: {
    editPotion() {
      this.dataId = this.params.data.id;
      this.params.context.addData(this.dataId);
    },
    confirmDeleteRecord() {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除名称为 "${this.params.data.prp_name}" 的职位吗`,
          cancel: true,
        })
        .onOk(() => {
          this.deleteRecord();
        })
        .onCancel(() => {});
    },
    deleteRecord() {
      this.$store
        .dispatch('rewardPosition/delData', [this.dataId])
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除职位成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green',
            });
            this.params.context.getList();
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red',
          });
        });
    },
    buttonShow() {
      this.dialogShow = true;
    },
    clearFields() {
      this.dialogShow = false;
    },
    addUpdateReward() {
      if (this.startTime == '' && this.endTime == '') {
        this.$q.notify({
          message: '注意',
          caption: '请选择开始和结束时间！',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right',
        });
        return false;
      }

      const startTime = this.$q_date.formatDate(this.startTime + ' 00:00:00', 'X');
      const endTime = this.$q_date.formatDate(this.endTime + '23:59:59', 'X');

      
      if (endTime < startTime) {
        this.$q.notify({
          message: '失败',
          caption: '结束时间不得大于开始时间,请重新选择',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right',
        });
        return false;
      }
      this.$refs.itemDataRef.validate().then((success) => {
        if (success) {
          this.$q
            .dialog({
              title: '确定',
              message: '确定生成绩效记录？',
              cancel: true,
              persistent: true,
            })
            .onOk(() => {
              const obj = {
                startTime,
                endTime,
                position_id: this.dataId,
                StoreId: this.params.data.store_id,
              };
              this.$store
                .dispatch('rewardPosition/setRecord', obj)
                .then((res) => {
                  if (res.code == 200) {
                    this.$q.notify({
                      icon: 'ion-checkmark-circle-outline',
                      timeout: 500,
                      position: 'top-right',
                      message: '成功',
                      caption: '生成成功',
                      color: 'green',
                    });
                    this.clearFields();
                    this.params.context.getList();
                  } else {
                    this.$q.notify({
                      icon: 'ion-close-circle-outline',
                      timeout: 500,
                      position: 'top-right',
                      message: '失败',
                      caption: res.message,
                      color: 'red',
                    });
                  }
                })
                .catch((error) => {
                  this.$q.notify({
                    icon: 'ion-close-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                    message: '失败',
                    caption: error.message,
                    color: 'red',
                  });
                });
            });
        }
      });
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
