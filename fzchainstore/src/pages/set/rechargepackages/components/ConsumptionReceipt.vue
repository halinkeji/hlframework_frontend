<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md row q-px-md">
      <q-input class="col-12 col-md-2 q-mt-sm q-mr-sm" clearable label="单据号" outlined v-model="receiptNum" dense />
      <q-input class="col-12 col-md-2 q-mt-sm q-mr-sm" clearable label="卡号" outlined v-model="cardNum" dense />
      <q-btn @click="getDatalist()" color="primary" class="col-12 col-md-1 q-mt-sm q-mr-sm" unelevated label="搜索" />
      <q-btn @click="restButton" color="warning" class="col-12 col-md-1 q-mt-sm" unelevated label="重置" />
    </div>
    <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table full-height hl_header_center hl_content_center"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :defaultColDef="defaultColDef"
        :rowData="receiptData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :localeText="localeText"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="40"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-pb-md">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pageSize"
        :total="page.pageTotal"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>
  </div>
</template>
<script>
import AgInvoiceOperating from './AgInvoiceOperating.vue'
export default {
  name: 'MemberRecharge',
  components: {
    AgInvoiceOperating
  },

  data () {
    return {
      receiptNum: '',
      cardNum: '',
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      receiptData: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '单据号',
          field: 'sc_invoiceCode',
          filter: false,
          checkboxSelection: false,
          headerCheckboxSelectionFilteredOnly: false,
          headerCheckboxSelection: false
        },

        {
          headerName: '会员卡号',
          field: 'sc_memberCardNum',
          filter: false,
          width: 170
        },

        {
          headerName: '充值金额',
          field: 'pcd_rechargeMoney',
          filter: false
        },
        {
          headerName: '充值金额期数',
          field: 'rpd_rechargeMoneyPeriod',
          filter: false,
          width: 150
        },

        {
          headerName: '赠送金额',
          field: 'rpd_giveMoney',
          filter: false,
          width: 150
        },

        {
          headerName: '赠送金额期数',
          field: 'rpd_giveMoneyPeriod',
          filter: false,
          width: 150
        },
        {
          headerName: '赠送' + this.$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit,
          field: 'rpd_givePoints',
          filter: false,
          width: 150
        },
        {
          headerName: '赠送' + this.$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_integralUnit + '期数',
          field: 'rpd_givePointsPeriod',
          filter: false,
          width: 150
        },
        {
          headerName: '支付状态',
          field: 'sc_pay_status_label',
          filter: false,
          width: 150
        },
        {
          headerName: '支付方式',
          field: 'sc_consumePayType',
          filter: false,
          width: 150
        },
        {
          headerName: '备注',
          field: 'sc_note',
          filter: false
        },

        {
          headerName: '时间',
          field: 'created_at',
          filter: false,
          valueGetter: this.createdAt
        },
        {
          headerName: '操作',
          filter: false,
          pinned: 'right',
          cellRendererFramework: 'AgInvoiceOperating',
          width: 180
        }
      ],
      localeText: this.$ag_grid_localeText,
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      }
    }
  },

  mounted () {},
  created () {
    this.getDatalist()
  },
  computed: {},
  methods: {
    getDatalist () {
      const obj = {
        receiptNum: this.receiptNum,
        cardNum: this.cardNum,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('rechargepackages/getList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.receiptData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getDatalist()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getDatalist()
    },
    restButton () {
      this.receiptNum = ''
      this.cardNum = ''
      this.getDatalist()
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    createdAt (p) {
      if (!p.data.created_at) {
        return ''
      } else {
        return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm')
      }
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
        // params.api.sizeColumnsToFit();
      }
    }
  }
}
</script>
