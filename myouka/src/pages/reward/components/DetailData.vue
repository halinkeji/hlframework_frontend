<template>
  <q-dialog v-model="isSidebarActiveLocal" maximized full-height full-width persistent>
    <q-card class="q-pa-xs">
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <div class="row">
            <div class="text-subtitle1">查看绩效</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </div>
          <q-item class="text-center">
            <q-item-section>
              <q-item-label>{{ userData.pru_name }}</q-item-label>
              <q-item-label caption lines="2">员工姓名</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-h6 text-weight-bold text-orange">
                {{ rewardCountInfo.totalConsumeHandle }}
              </q-item-label>
              <q-item-label caption lines="2">应收金额</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-h6 text-weight-bold text-orange">
                {{ rewardCountInfo.tConsumeCount }}
              </q-item-label>
              <q-item-label caption lines="2">实收金额</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-h6 text-weight-bold text-orange">
                {{ rewardCountInfo.discountCount }}
              </q-item-label>
              <q-item-label caption lines="2">优惠金额</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-h6 text-weight-bold text-orange">
                {{ rewardCountInfo.tOpenCardReward }}
              </q-item-label>
              <q-item-label caption lines="2">开卡绩效</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-h6 text-weight-bold text-orange">
                {{ rewardCountInfo.tOpenCardCount }}
              </q-item-label>
              <q-item-label caption lines="2">总开卡人数</q-item-label>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-h6 text-weight-bold text-orange">
                {{ rewardCountInfo.tConsumeReward }}
              </q-item-label>
              <q-item-label caption lines="2">总绩效</q-item-label>
            </q-item-section>
          </q-item>

          <q-separator />
        </div>
        <div class="col-shrink bg-white q-px-xs q-pb-md">
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
            <q-tab name="member">
              <span> 开卡绩效 </span>
            </q-tab>

            <q-tab name="consume">
              <span> 消费绩效 </span>
            </q-tab>
          </q-tabs>
        </div>

        <div class="col-shrink full-height bg-grey-2" v-if="activeName == 'member'">
          <open-card-record :reward_user_id="userData.id" ref="memberRef"> </open-card-record>
        </div>
        <div class="col-shrink full-height bg-grey-2" v-if="activeName == 'consume'">
          <consum-record :reward_user_id="userData.id" ref="consumeRef"> </consum-record>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import OpenCardRecord from './OpenCardRecord.vue'
import ConsumRecord from './ConsumRecord.vue'
export default {
  name: 'DetailData',
  components: { OpenCardRecord, ConsumRecord },
  data () {
    return {
      isSidebarActiveLocal: true,
      context: '',
      data: {},
      userData: {},
      activeName: 'member',
      rewardCountInfo: {}
    }
  },
  watch: {
    tab () {
      this.searchBut()
    }
  },
  computed: {},
  created () {
    this.context = this
  },
  mounted () {},
  methods: {
    init (data) {
      this.isSidebarActiveLocal = true
      this.userData = data
      this.getUserReward(data)
      this.$nextTick(() => {
        this.$refs.memberRef.getList()
      })
    },
    searchBut () {
      switch (this.activeName) {
        case 'member':
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.memberRef.getList()
            })
          }, 100)
          break
        case 'consume':
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.consumeRef.getList()
            })
          }, 100)
          break
        case 'oilConsume':
          setTimeout(() => {
            this.$nextTick(() => {
              this.$refs.oilConsumeRef.getList()
            })
          }, 100)
          break
      }
    },
    getUserReward (data) {
      const obj = {
        user_id: data.id
      }
      this.$store
        .dispatch('rewardPosition/getRewardCount', obj)
        .then((res) => {
          if (res.code == 200) {
            this.rewardCountInfo = res.data ? res.data : {}
          }
        })

        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    }
  }
}
</script>
