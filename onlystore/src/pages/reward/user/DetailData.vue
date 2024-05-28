<template>
  <q-dialog v-model="isSidebarActiveLocal" full-height full-width>
    <q-card class="q-pa-sm">
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <div class="row justify-center">
            <h6 class="no-margin">员工姓名: {{ userData.pru_name }}</h6>
            <q-space />
            <q-btn flat round dense icon="close" v-close-popup />
          </div>

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
          <q-separator class="q-mx-lg q-mt-none" />
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
      activeName: 'member'
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
    }
  }
}
</script>
