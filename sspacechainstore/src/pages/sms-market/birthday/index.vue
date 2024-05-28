<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" align="left" indicator-color="primary" narrow-indicator>
        <q-tab name="today" label="生日关怀" />
        <q-tab name="record" label="发送记录" />
        <q-tab name="set" label="设置" />
      </q-tabs>
    </div>

    <div class="col-shrink bg-white q-py-sm text-center row items-center q-gutter-sm q-px-sm q-pb-md" v-if="tab == 'today'">
      <div class="col-12 col-md-2">
        <q-input outlined dense label="日期" v-model="searchDate" readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="searchDate" mask="YYYY-MM-DD">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <q-btn unelevated label="搜索" @click="getTodayMemberBrithday" color="primary" />
      <q-space />
      <q-btn
        class="q-px-sm"
        :disable="brithdayMemberData.length > 0 ? false : true"
        unelevated
        label="一键群发"
        @click="sendUserBrithday"
        color="warning"
      />
    </div>
    <div class="col-shrink q-px-xs full-height" v-if="tab == 'today'">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="brithdayMemberData"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        rowSelection="multiple"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :stopEditingWhenGridLosesFocus="true"
        :singleClickEdit="true"
        :context="context"
        :localeText="localeText"
      ></ag-grid-vue>
    </div>

    <div class="col-shrink full-height" v-if="tab == 'record'">
      <send-record />
    </div>

    <div class="col-shrink full-height" v-if="tab == 'set'">
      <send-set />
    </div>
  </div>
</template>

<script>
import SendRecord from './SendRecord.vue'
import SendSet from './SendSet.vue'
export default {
  name: 'smsMarketBirthdayCare',
  components: {
    SendRecord,
    SendSet
  },
  data () {
    return {
      brithdayMemberData: [],
      currentLibId: 0,
      tab: 'today',
      localeText: this.$ag_grid_localeText,
      gridOptions: {},
      context: null,
      columnDefs: [
        {
          headerName: '会员昵称',
          field: 'mem_memberName',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '会员姓名',
          field: 'mem_memberRealName',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '会员手机号',
          field: 'mem_memberMobile',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '会员卡号',
          field: 'mem_memberCardNum',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        }
      ],
      lastSmsCount: 0,
      searchDate: ''
    }
  },
  created () {
    this.searchDate = this.$q_date.formatDate(new Date(), 'YYYY-MM-DD')
  },
  computed: {},
  beforeMount () {},
  mounted () {
    this.context = this
    this.getTodayMemberBrithday()
  },
  methods: {
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    getTodayMemberBrithday () {
      const obj = {
        searchDate: this.searchDate
      }
      this.$store
        .dispatch('smsMarket/getTodayMemberBrithday', obj)
        .then((res) => {
          if (res.code == 200) {
            this.brithdayMemberData = res.data && res.data.memberList ? res.data.memberList : []
            this.lastSmsCount = res.data && res.data.lastSmsCount ? res.data.lastSmsCount : 0
          }
        })
        .catch((error) => {})
    },
    sendUserBrithday () {
      const obj = {
        searchDate: this.searchDate
      }
      this.$store
        .dispatch('smsMarket/sendUserBrithday', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: res.message,
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'center',
              timeout: 3000
            })
          } else {
            this.$q.notify({
              message: '操作失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              position: 'center',
              timeout: 3000
            })
          }
        })
        .catch((error) => {})
    }
  }
}
</script>
