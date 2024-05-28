<template>
  <q-dialog @hide="hideNowPage" v-model="isSidebarActiveLocal">
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.8) + 'px',
        'max-width': parseInt($q.screen.width * 0.8) + 'px',
      }"
      class="q-pa-sm fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <div class="text-h6">
            开油详情
          </div>
          <div align="right">
            <q-btn flat round dense icon="close" v-close-popup />
          </div>
          <div class="row justify-center">
            <div class="text-h6">供油商：{{ erpSupplier.es_name }}</div>
          </div>
        </div>

        <div class="col-shrink q-px-xs full-height ">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="oilListData"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :localeText="localeText"
            :animateRows="false"
            :context="context"
            @first-data-rendered="onFirstDataRendered"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            rowHeight="40"
            rowSelection="multiple"
            @rowSelected="rowSelectedAg"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
          ></ag-grid-vue>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import AgBadge from './AgBadge'
export default {
  name: 'ItemOil',
  components: {
    AgBadge
  },
  data () {
    return {
      isSidebarActiveLocal: true,
      localeText: this.$ag_grid_localeText,
      dialogWidth: '1000px',
      context: '',
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      gridOptions: {},
      dataListSelections: [],
      oilTypeList: { est_name: '' },
      columnDefs: [
        {
          headerName: '油品',
          field: 'oid_oilName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '单位（升/吨）',
          field: 'oid_unit',

          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '吨数',
          field: 'oid_tonCount',

          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '升数',
          field: 'oid_literCount',

          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '剩余吨数',
          field: 'oid_lastTonCount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '类型',
          field: 'oid_status',
          width: this.nowpx(0.125) + 'px',
          valueGetter: (p) => {
            switch (p.data.oid_type) {
              case 'open':
                return '开油'
                break
              case 'take':
                return '取油'
                break
              case 'bakcan':
                return '回罐'
                break
              case 'turnIn':
                return '调入'
                break
              default:
                return '调出'
            }
          }
        },
        {
          headerName: '剩余升数',
          field: 'oid_lastLiterCount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '密度',
          field: 'oid_density',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '单位单价',
          field: 'oid_price',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '小计金额',
          field: 'oid_totalPrice',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '备注',
          field: 'oid_note',
          width: this.nowpx(0.15) + 'px'
        }
      ],
      oilListData: [],
      erpSupplier: {}
    }
  },
  created () {
    this.init()
    this.context = this
  },
  methods: {
    init (invoiceId) {
      this.isSidebarActiveLocal = true
      this.oid_invoiceId = invoiceId
      if (invoiceId > 0) {
        this.$store
          .dispatch('openoil/getItemData', invoiceId)
          .then((res) => {
            if (res.code == 200) {
              this.erpSupplier = res.data.erpSupplier
              this.oilListData = res.data.detail
            } else {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '操作失败',
                color: 'red'
              })
            }
          })

          .catch((err) => {})
      }
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 550
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
    hideNowPage () {
      this.$emit('dataList')
    }
  }
}
</script>
