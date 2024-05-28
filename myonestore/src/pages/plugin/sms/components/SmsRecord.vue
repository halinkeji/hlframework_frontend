<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm">
        <div class="q-gutter-x-xs row ">
          <q-input class="col-12 col-md-2 q-mt-sm" outlined v-model="searchQuery" label="请输入接收手机号" dense />
          <q-select class="col-12 col-md-2 q-mt-sm" outlined v-model="sendStatus" :options="mode" option-value="value" option-label="label" emit-value map-options dense label="请选择发送状态" />

          <q-btn color="primary" class="q-mt-sm" unelevated label="搜索" @click="getListData" />
          <q-btn color="warning" class="q-mt-sm" unelevated label="重置"  @click="resetSearch" />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table  hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="smsRecord"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          rowHeight="50"
          :context="context"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :stopEditingWhenGridLosesFocus="true"
          :singleClickEdit="true"
          @first-data-rendered="onFirstDataRendered"
          :localeText="localeText"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          :total="page.pageTotal"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
    </div>
  </q-page>
</template>
<script>
import Operator from './Operator'
export default {
  name: 'SmsBirthdayCare',
  components: { Operator },
  data () {
    return {
      components: { Operator },
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      searchQuery: '',
      sendStatus: '',
      mode: [
        { label: '已发送', value: 1 },
        { label: '未发送', value: 2 }
      ],
      localeText: this.$ag_grid_localeText,
      smsRecord: [],
      context: null,
      columnDefs: [
        {
          headerName: '模板名称', // 列标题
          field: 'ssr_templateName', // 列与数据源对应的字段
          filter: false, // 是否过滤.
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '内容',
          field: 'ssr_sendContent',
          filter: false,
          width: this.nowpx(0.4) + 'px'
        },
        {
          headerName: '接收手机号',
          field: 'ssr_sendPhoneNumber',
          filter: false,
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '发送状态',
          field: 'ssr_sendStatus',
          filter: false,
          valueGetter: (p) => {
            if (p.data.ssr_sendStatus == 1) {
              var mag = '已发送'
            } else {
              var mag = '未发送'
            }
            return mag
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
        },
        {
          headerName: ' 操作',
          field: 'title1',
          filter: false,
          cellRendererFramework: 'Operator',
          width: this.nowpx(0.05) + 'px'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      }
    }
  },
  computed: {},
  created () {},
  mounted () {
    this.getListData()
    this.context = this
  },
  methods: {
    getListData () {
      const obj = {
        text: this.searchQuery,
        status: this.sendStatus,
        pSize: this.page.pageSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('alSms/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.page.pageTotal = res.data.page.totalCount
              this.smsRecord = res.data.list
            } else {
              this.page.pageTotal = 0
              this.smsRecord = []
            }
          }
        })
        .catch((error) => {})
    },
    resetSearch () {
      this.searchQuery = ''
      this.sendStatus = ''
      this.getListData()
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getListData()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getListData()
    },

    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
