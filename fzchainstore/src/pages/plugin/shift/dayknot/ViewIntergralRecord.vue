<template>
  <q-dialog v-model="dialogStatus" class="q-pa-sm">
    <q-card
      flat
      class="fit"
      :style="{
        width: this.$q.screen.width * 0.7 + 'px',
        'min-width': this.$q.screen.width * 0.7 + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink q-pa-sm full-height bg-grey-2">
          <ag-grid-vue
            ref="agGridTable"
            class="ag-theme-balham ag-grid-table  hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :gridOptions="gridOptions"
            :suppressMovableColumns="true"
            :defaultColDef="defaultColDef"
            :rowData="integralRecordData"
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
            :context="context"
            @rowSelected="rowSelectedAg"
            :suppressRowClickSelection="true"
            :singleClickEdit="true"
            :stopEditingWhenGridLosesFocus="true"
          ></ag-grid-vue>
        </div>
        <div class="col-shrink bg-white q-pb-md">
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pSize"
            :total="page.pageTotal"
            layout="total, sizes, prev, pager, next, jumper"
          ></hl-pagination>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import AgIntegralOperating from './AgIntegralOperating'
export default {
  name: 'ViewIntergralRecord',
  components: { AgIntegralOperating },
  data () {
    return {
      dialogStatus: false,
      integralRecordData: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '会员姓名',
          field: 'consumeInvoice.sc_memberName',
          filter: false
        },
        {
          headerName: '会员卡号',
          field: 'consumeInvoice.sc_memberCardNum'
        },
        {
          headerName: '消费时间',
          field: 'psr_down_spare_money',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.consumeInvoice.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          headerName: '实付金额',
          field: 'consumeInvoice.sc_realMoneyCount'
        },
        {
          headerName: '纯利润',
          field: 'psi_pure_profit',
          filter: false
        },
        {
          headerName: '积分',
          field: 'psi_give_integral',
          filter: false
        },
        {
          headerName: '操作',
          cellRendererFramework: 'AgIntegralOperating',
          filter: false,
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
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      context: null,
      dayknot_id: 0
    }
  },

  mounted () {},
  created () {
    this.context = this
  },
  computed: {},
  methods: {
    init (dayknot_id) {
      if (dayknot_id) {
        this.dayknot_id = dayknot_id
        this.dialogStatus = true
        this.getList()
      }
    },
    // 获取认证信息列表
    getList () {
      const obj = {
        dayknot_id: this.dayknot_id,
        pSize: this.page.pageSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('shift/getIntegralList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.integralRecordData = res.data ? res.data.list : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: '操作失败',
            color: 'red'
          })
        })
    },
    // 重置
    clearBut () {
      this.getList()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
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

    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getList(this.type)
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList(this.type)
    }
  }
}
</script>
