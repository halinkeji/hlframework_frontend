<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
      <div class="row q-gutter-sm">
        <div class="col-12 col-md-2">
          <q-input outlined clearable v-model="phoneNumber" label="请输入接收手机号" dense />
        </div>
        <div class="col-12 col-md-2">
          <q-select
            outlined
            v-model="sendStatus"
            :options="[
              { label: '发送成功', value: 1 },
              { label: '发送中', value: 2 },
              { label: '发送异常', value: 3 },
              { label: '发送失败', value: 4 },
            ]"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            dense
            clearable
            label="请选择发送状态"
          />
        </div>

        <div class="col-12 col-md-2">
          <q-select
            outlined
            v-model="type"
            :options="[
              { label: '生日关怀', value: 'SmsUserBrithday' },
            ]"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            dense
            clearable
            label="请选择短信模板"
          />
        </div>

        <q-btn color="primary" unelevated label="搜索" @click="getSendRecordList" />
        <q-btn color="warning" unelevated label="重置" @click="resetSearch" />
      </div>
    </div>
    <div class="col-shrink q-px-xs full-height">
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
    <div class="col-shrink bg-white q-py-sm text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.page"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.pageTotal"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>
  </div>
</template>

<script>
import JsonShow from '../send-record/JsonShow.vue'
export default {
  name: 'smsMarketBirthdaySendRecord',
  components: {
    JsonShow
  },
  data () {
    return {
      brithdayMemberData: [],
      currentLibId: 0,
      tab: 'today',
      localeText: this.$ag_grid_localeText,
      gridOptions: {},
      context: null,
      page: {
        page: 1,
        pageSize: 20,
        pageTotal: 0
      },
      sendStatus: '',
      phoneNumber: '',
      columnDefs: [
        {
          headerName: '短信模板',
          field: 'ssr_template_name',
          filter: false // 是否过滤.
        },
        {
          headerName: '内容',
          field: 'ssr_send_content',
          filter: false,
          cellRendererFramework: 'JsonShow'
        },
        {
          headerName: '接收手机号',
          field: 'ssr_phone_number',
          filter: false,
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '发送状态',
          field: 'ssr_status',
          filter: false,
          valueGetter: (p) => {
            if (parseInt(p.data.ssr_status) == 1) {
              return '发送成功'
            } else if (parseInt(p.data.ssr_status) == 2) {
              return '发送中'
            } else if (parseInt(p.data.ssr_status) == 3) {
              return '发送异常'
            } else if (parseInt(p.data.ssr_status) == 4) {
              return '发送失败'
            }
            return ''
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: ' 发送时间',
          field: 'created_at',
          filter: false,
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.08) + 'px'
        }
      ],
      type: ''
    }
  },
  created () {},
  computed: {},
  beforeMount () {},
  mounted () {
    this.context = this
    this.getSendRecordList()
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
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getSendRecordList()
    },

    currentChangeHandle (val) {
      this.page.page = val
      this.getSendRecordList()
    },
    resetSearch () {
      this.sendStatus = ''
      this.phoneNumber = ''
      this.type = ''

      this.$nextTick(() => {
        this.getSendRecordList()
      })
    },
    getSendRecordList () {
      const obj = {
        page: this.page.page,
        pSize: this.page.pageSize,
        sendStatus: this.sendStatus,
        phoneNumber: this.phoneNumber,
        templateType: this.type ? this.type : 'SmsUserBrithday'
      }
      this.$store
        .dispatch('smsMarket/getSendRecordList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.brithdayMemberData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    }
  }
}
</script>
