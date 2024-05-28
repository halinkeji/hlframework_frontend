<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" >
    <q-card
      :style="{
        width: this.$q.screen.width * 0.8 + 'px',
        'min-width': this.$q.screen.width * 0.8 + 'px',
      }"
      class="q-pa-md fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md row items-center">
          <div class="text-subtitle2 q-pr-lg text-right">油罐进出记录</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="col-shrink q-px-xs full-height">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height "
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="oilListData"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            @first-data-rendered="adaptiveTable"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            rowHeight="40"
            :context="context"
            rowSelection="multiple"
            :suppressCellSelection="true"
            :stopEditingWhenGridLosesFocus="true"
            :suppressRowDeselection="true"
            :suppressRowTransform="true"
            :rowMultiSelectWithClick="true"
            :suppressRowClickSelection="false"
            :localeText="localeText"
            domLayout="autoHeight"
          ></ag-grid-vue>
        </div>
        <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
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
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'OilRecord',
  props: ['type'],
  data () {
    return {
      localeText: this.$ag_grid_localeText,

      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      context: null,
      gridOptions: {},
      showDialog: true,
      columnDefs: [

        {
          headerName: '单据号',
          field: 'poi_invoice_code',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '变更类型',
          field: 'poi_invoice_type_text'
        },
        {
          headerName: '油品',
          field: 'oid_oil_name'
        },
        {
          headerName: '单位',
          field: 'oid_unit',
          valueGetter: (p) => {
            if (p.data.oid_unit == 1) {
              return '吨'
            } else if (p.data.oid_unit == 2) {
              return '升'
            } else {
              return '其他'
            }
          }
        },

        {
          headerName: '升数',
          field: 'oid_liter_count'
        },
        {
          headerName: '吨数',
          field: 'oid_ton_count'
        },
        {
          headerName: '密度',
          field: 'oid_density'
        },
        {
          headerName: '单价',
          field: 'oid_price'
        },
        {
          headerName: '总计',
          field: 'oid_total_price'
        },
        {
          headerName: '时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.15) + 'px'
        }
      ],
      oilListData: [],
      openInvoiceId: ''
    }
  },
  created () {
    this.context = this
  },
  methods: {
    init (openInvoiceId) {
      this.showDialog = true
      this.openInvoiceId = openInvoiceId
      this.$nextTick(() => {
        this.getList()
      })
    },

    getList () {
      const obj = {
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        openInvoiceId: this.openInvoiceId
      }
      this.$store
        .dispatch('openoil/getOpenInvoiceDetail', obj)
        .then((res) => {
          if (res.code == 200) {
            this.oilListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    // 计算窗口大小
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 262
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 隐藏滚动条
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },

    hideNowPage () {
      this.showDialog = false
      this.$emit('getMethods')
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    }
  }
}
</script>
