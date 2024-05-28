<template>
  <q-dialog v-model="isSidebarActiveLocal" full-height full-width>
    <q-card class="q-pa-sm">
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <div class="row justify-center">
            <h6 class="no-margin">绩效详情</h6>
            <q-space />
            <q-btn flat round dense icon="close" v-close-popup />
          </div>
          <div class="row justify-center">
            <div class="col q-ml-lg">
              <h6 class="no-margin">员工姓名: {{ userData.prr_reward_user_name }}</h6>
            </div>
            <div class="col">
              <h6 class="no-margin">开卡绩效: {{ userData.prr_open_card_reward_amount }}</h6>
            </div>
            <div class="col">
              <h6 class="no-margin">开卡总人数: {{ userData.prr_open_card_number }}</h6>
            </div>
            <div class="col">
              <h6 class="no-margin">消费绩效: {{ userData.prr_consume_reward_amount }}</h6>
            </div>
          </div>
          <q-separator class="q-mx-lg q-mt-none" />
          <q-tabs
            v-model="activeName"
            class="bg-white"
            active-color="primary"
            indicator-color="primary"
            align="left"
            content-class="text-grey-9"
            narrow-indicator
            dense
          >
            <q-tab name="consume"> 消费绩效 </q-tab>
            <q-tab name="member"> 开卡绩效 </q-tab>
          </q-tabs>
        </div>

        <div class="col-shrink full-height bg-grey-2" v-if="activeName == 'member'">
          <open-card-detail :rewardData="userData" ref="memberRef"> </open-card-detail>
        </div>
        <div class="col-shrink full-height bg-grey-2" v-if="activeName == 'consume'">
          <consum-detail :rewardData="userData" ref="consumeRef"> </consum-detail>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import OpenCardDetail from './OpenCardDetail.vue';
import ConsumDetail from './ConsumDetail.vue';
export default {
  name: 'DetailData',
  components: { OpenCardDetail, ConsumDetail },
  data() {
    return {
      isSidebarActiveLocal: true,
      context: '',
      userData: {},
      activeName: 'consume',
    };
  },
  watch: {
    tab() {
      this.searchBut();
    },
  },
  computed: {},
  created() {
    this.context = this;
  },
  mounted() {},
  methods: {
    getUser(data) {
      this.isSidebarActiveLocal = true;
      this.userData = data;
      this.$nextTick(() => {
        this.$refs.consumeRef.getList();
      });
    },
    searchBut() {
      switch (this.activeName) {
        case 'member':
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.memberRef.getList();
            });
          }, 100);
          break;
        case 'consume':
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.consumeRef.getList();
            });
          }, 100);
          break;
      }
    },
  },
};
</script>
