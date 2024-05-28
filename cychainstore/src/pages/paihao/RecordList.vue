<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink q-px-xs full-height bg-white row">
      <div class="col-2 full-height ">
        <q-scroller
          v-model="currentDate"
          view="date"
          no-footer
          text-color="white"
          color="#006241"
          inner-text-color="white"
          inner-color="#006241"
          style="height: 200px;"
          locale="zh-hans"
          @input ="getList"
        ></q-scroller>
        <div class="q-mt-sm" v-for="(item,key) in timePeriod">
           <q-btn
           rounded
           color="green-10"
           :label="item.title + '（' + item.start + '-' + item.end  + '）'"
           :outline="!(item.start == currnetTimePeriod.start && item.end == currnetTimePeriod.end)"
           :unelevated="item.start == currnetTimePeriod.start && item.end == currnetTimePeriod.end"
           class="full-width"
           @click="changeTimePeriod(item)"
           />
        </div>

      </div>
      <div class="col-10 full-height" style="overflow-x: scroll;">
        <div class="row q-gutter-sm no-wrap fit q-pa-xs">
          <div class="col-3 bg-grey-2 full-height" :key="'item' + key" v-for="(item, key) in paihaoList">
            <q-card square flat bordered class="full-height">

              <q-scroll-area class="full-height bg-grey-2">
                <q-item clickable v-ripple class="bg-white">
                <q-item-section>
                  <q-item-label class="text-subtitle1 text-weight-bold">
                    {{ item.title }}
                  </q-item-label>

                  <q-item-label caption> 容纳人数： {{ item.min }}~{{ item.max }} </q-item-label>
                </q-item-section>
              </q-item>
              <q-separator color="green-10" />
              <q-item clickable v-ripple class="bg-white">
                <q-item-section @click="addRecord(item, 0, 1)">
                  <q-item-label class="text-center bg-white q-pt-sm">
                    <q-icon name="las la-plus-circle" size="70px" color="green-10"></q-icon>
                  </q-item-label>
                </q-item-section>
              </q-item>
                <q-list separator  v-if="item.recordList && item.recordList.length > 0">
                  <q-item clickable v-ripple :key="'record' + k" v-for="(i, k) in item.recordList">

                    <q-item-section>
                      <q-item-label class="text-h6">
                        {{ i.fpr_member_id > 0 ? '会员' : '散客' }}
                      </q-item-label>
                      <q-item-label>
                        编号：{{ i.fpr_number }}
                          <q-badge v-if="parseInt(i.fpr_status) == 1" color="orange" label="排队中" />
                          <q-badge v-if="parseInt(i.fpr_status) == 2" color="positive" label="已完成" />
                          <q-badge v-if="parseInt(i.fpr_status) == 3" color="grey" label="已取消" />
                      </q-item-label>
                      <q-item-label caption>时间：{{ $q_date.formatDate(i.created_at * 1000, 'YYYY-MM-DD HH:mm') }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                       <q-btn round v-if="parseInt(i.fpr_status) == 1" @click="sendPrintBill(i)" unelevated dense color="primary" icon="las la-print" />
                    </q-item-section>

                    <q-item-section side>
                       <q-btn round v-if="parseInt(i.fpr_status) == 1" unelevated dense color="positive"  @click="addRecord(item, i.id, 2)" icon="las la-check-circle" />
                    </q-item-section>

                    <q-item-section side>
                       <q-btn round v-if="parseInt(i.fpr_status) == 1" unelevated dense color="negative"  @click="addRecord(item, i.id, 3)" icon="las la-minus-circle" />
                    </q-item-section>

                  </q-item>
                </q-list>
              </q-scroll-area>
            </q-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RecordList',
  components: {},
  data () {
    return {
      reserveDetailStatus: false,
      deskId: '',
      typeId: '',
      statusId: '',
      queryInfo: '',
      queryText: '',
      startTime: '',
      endTime: '',
      context: null,
      gridOptions: {},
      deskData: [],
      paihaoList: [],

      reserveEditStatus: false,
      currentDate: '',
      paihaoConfigData: {},
      timePeriod: [],
      currnetTimePeriod: {}
    }
  },
  created () {
    const timeStamp = Date.now()
    // this.planDate = this.$q_date.formatDate(timeStamp, 'YYYY-MM-DD')
    this.currentDate = this.$q_date.formatDate(timeStamp, 'YYYY-MM-DD')
  },
  mounted () {
    this.getReserveConfigData()
  },
  computed: {},
  methods: {
    getReserveConfigData () {
      this.$store
        .dispatch('foodPaihao/getConfig')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.paihaoConfigData = res.data ? res.data : {}
            this.timePeriod = this.paihaoConfigData && this.paihaoConfigData.fpc_time_period ? this.paihaoConfigData.fpc_time_period : []

            this.currnetTimePeriod = this.timePeriod && this.timePeriod.length > 0 ? this.timePeriod[0] : {}
            this.$nextTick(() => {
              this.getList()
            })
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    getList () {
      const obj = {
        currentDate: this.currentDate,
        ...this.currnetTimePeriod
      }
      this.$store
        .dispatch('foodPaihao/getListData', obj)
        .then((res) => {
          this.paihaoList = res.data ? res.data : []
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    addRecord (item, id = 0, status = 1) {
      const obj = {
        fpr_item_title: item.title,
        fpr_item_key: item.key,
        fpr_status: status,
        prefix: item.prefix,
        id,
        ...this.currnetTimePeriod
      }
      this.$store
        .dispatch('foodPaihao/setData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              message: `${status > 1 ? '更新成功' : '排队成功'}`,
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.getList()
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    sendPrintBill (item) {
      const obj = {
        recordId: item.id,

        ...this.currnetTimePeriod
      }
      this.$store
        .dispatch('foodPaihao/sendPrintBill', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              message: `${status > 1 ? '更新成功' : '排队成功'}`,
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.getList()
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              color: 'red',
              icon: 'ion-checkmark-circle-outline',
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
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    showReserveDetail (id) {
      this.reserveDetailStatus = true
      this.$nextTick(() => {
        this.$refs.reserveDetailRef.init(id)
      })
    },

    addReserveDialog () {
      this.reserveEditStatus = true
      this.$nextTick(() => {
        this.$refs.reserveEditRef.init()
      })
    },
    changeTimePeriod (item) {
      this.currnetTimePeriod = item
      this.$nextTick(() => {
        this.getList()
      })
    }
  }
}
</script>
