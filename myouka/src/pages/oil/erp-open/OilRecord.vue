<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: this.$q.screen.width * 0.8 + 'px',
        'min-width': this.$q.screen.width * 0.8 + 'px',
      }"
      class="q-pa-md fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md row">
          <div class="text-subtitle2 q-pr-lg text-right">选择单据</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>

        <div class="col-shrink bg-white q-px-xs q-pb-md row q-gutter-sm">
          <div class="col-2">
            <q-select
              outlined
              option-value="id"
              option-label="op_name"
              emit-value
              map-options
              dense
              v-model="oilId"
              :options="oilList"
              label="请选择油品"
            />
          </div>
           <q-btn unelevated color="primary" @click="getList()" label="搜索" />
        <q-btn unelevated color="amber" label="重置"   @click="clearnBut()" />
        </div>
        <div class="col-shrink q-px-xs full-height">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height oil-record-dialog"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="oilInvoiceListData"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            @first-data-rendered="adaptiveTable"
            @rowSelected="rowSelectedAg"
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
          <q-btn unelevated label="确定" @click="saveBut()" color="primary" class="q-px-xl" />
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
      selected: [],
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
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '单据号',
          field: 'poi_invoice_code',
          width: this.nowpx(0.14) + 'px'
        },
        {
          headerName: '方式',
          field: 'poi_invoice_type_text',
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '油品',
          field: 'oid_oil_name',
          width: this.nowpx(0.07) + 'px'
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
          },
          width: this.nowpx(0.05) + 'px'
        },
        // {
        //   headerName: '吨数',
        //   field: 'oid_ton_count',
        //   width: this.nowpx(0.08) + 'px'
        // },
        // {
        //   headerName: '升数',
        //   field: 'oid_liter_count',
        //   width: this.nowpx(0.09) + 'px'
        // },
        {
          headerName: '剩余吨数',
          field: 'oid_last_ton_count',
          width: this.nowpx(0.08) + 'px',
          cellClassRules: {
            'cell-span-color-red': function (p) {
              return true
            }
          }
        },
        {
          headerName: '剩余升数',
          field: 'oid_last_liter_count',
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '密度',
          field: 'oid_density',
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '单位单价',
          field: 'oid_price',
          width: this.nowpx(0.08) + 'px'
        },
        // {
        //   headerName: '小计金额',
        //   field: 'oid_total_price',
        //   width: this.nowpx(0.09) + 'px'
        // },
        {
          headerName: '剩余总额',
          field: 'oid_last_total_price',
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '备注',
          field: 'oid_note',
          width: this.nowpx(0.12) + 'px'
        }
      ],
      oilInvoiceListData: [],
      oilId: '',
      oilList: []
    }
  },
  created () {
    this.getOillist()
    this.getList()

    this.context = this
  },
  methods: {
    getOillist () {
      this.$store
        .dispatch('product/getCurrentAllOil')
        .then((res) => {
          if (res.code == 200) {
            this.oilList = res.data ? res.data : []
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
    getList () {
      this.isPoppupStatus = false
      const obj = {
        type: this.type ? this.type : 'open',
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        oilId: this.oilId
      }
      this.$store
        .dispatch('openoil/getOilOpenList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.oilInvoiceListData = res.data ? res.data.list : []
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
    clearnBut () {
      this.oilId = ''
      this.getList()
    },
    // 计算选中的ag表格行
    rowSelectedAg (p) {
      this.selected = p.api.getSelectedRows()
    },
    hideNowPage () {
      this.$emit('getRecord', [])
    },
    saveBut () {
      const selectedRows = this.gridOptions.api.getSelectedRows()
      this.$emit('getRecord', selectedRows)
    }
  }
}
</script>
<style>
.oil-record-dialog .cell-span-color-red {
  color: white !important;
  background-color: #fd6363 !important;
}
</style>
