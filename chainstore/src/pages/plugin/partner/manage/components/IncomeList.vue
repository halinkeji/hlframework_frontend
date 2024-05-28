<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs row">
      <q-input class="col-12 col-md-3  " label="可搜索:卡号/会员昵称/会员姓名/手机号" outlined v-model="searchQuery" dense />
       <q-input class="col-12 col-md-3  " label="可搜索:消费单据号" outlined v-model="searchCode" dense />
      <q-btn color="primary" class=" " unelevated label="搜索" v-if="authorityMeta('search')" @click="getList" />
      <q-btn color="grey-6" class=" " unelevated label="重置" v-if="authorityMeta('reset')" @click="clean" />
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :defaultColDef="defaultColDef"
        :rowData="incomeData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        :context="context"
        :floatingFilter="false"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :enableCellTextSelection="true"
        :localeText="localeText"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-pb-md">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
      ></hl-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'IncomeList',
  components: {},
  props: ['partnerid'],
  data () {
    return {
      isDialogStatus: false,
      incomeData: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      columnDefs: [
        // 表格列数据
        {
          headerName: '消费单据号',
          field: 'pmi_invoice_code',
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'pmi_member_card_num',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员姓名',
          field: 'pmi_member_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '手机号',
          field: 'pmi_member_mobile',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '消费金额',
          field: 'pmi_real_consume_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '分红比率（%）',
          field: 'pmi_income_ratio',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '分红收益',
          field: 'pmi_income_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '添加时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD  HH:mm:ss')
          },
          width: this.nowpx(0.1) + 'px'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      context: null,
      gridOptions: {},
      searchQuery: '',
      searchCode: '',
      localeText: this.$ag_grid_localeText
    }
  },
  computed: {},
  created () {
    this.getList()
    this.context = this
  },
  mounted () {},
  methods: {
    getList () {
      const obj = {
        partner_id: this.partnerid,
        name: this.searchQuery,
        invoiceCode: this.searchCode,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('partner/getIncome', obj)
        .then((res) => {
          if (res.code == 200) {
            this.incomeData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
          }
        })
        .catch((error) => {})
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    clean () {
      this.searchQuery = ''
      this.searchCode = ''
      this.getList()
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
      return true
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
