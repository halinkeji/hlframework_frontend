<template>
  <q-dialog v-model="isSidebarActiveLocal">
    <q-card style="width: 1480px; max-width: 120vw" class="q-pa-sm"
      ><q-form ref="unitDataRef">
        <div class="row justify-between">
          <h5 class="q-pa-md no-margin">
            调拨详情
          </h5>
          <div align="right">
            <q-btn unelevated flat round dense class="q-ma-md" icon="close" v-close-popup />
          </div>
        </div>
        <div class="row justify-center">
          <h6 class="q-pa-md  no-margin" v-if="data.inStore">调入店铺:{{ data.inStore.name }}</h6>
        </div>
        <q-separator class="q-mx-lg q-mt-none" />

        <div class="q-ma-md" :style="`height:${gridOptions.rowHeight * 10}px`">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="dataFrom"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :localeText="localeText"
            :animateRows="false"
            :context="context"
            @first-data-rendered="onFirstDataRendered"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            rowHeight="50"
            rowSelection="multiple"
            @rowSelected="rowSelectedAg"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
          ></ag-grid-vue>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'DetailData',
  components: {},
  data () {
    return {
      isSidebarActiveLocal: true,
      context: '',
      data: {},
      gridOptions: {},
      dataFrom: [],
      dataListSelections: [],
      columnDefs: [
        {
          headerName: '商品名称',
          field: 'etd_goods_name'
        },
        {
          headerName: '规格名称',
          field: 'etd_spe_name'
        },
        {
          headerName: '调拨数量',
          field: 'etd_turn_number'
        },
        {
          headerName: '调拨状态',
          field: 'etd_status',
          valueGetter: (p) => {
            if (parseInt(p.data.etd_status) == 1) {
              return '成功调拨'
            }
            if (parseInt(p.data.etd_status) == 2) {
              return '等待确认'
            }
            if (parseInt(p.data.etd_status) == 3) {
              return '库存不足调拨失败'
            }
          }
        },
        {
          headerName: '商品单价',
          field: 'etd_goods_price'
        },
        {
          headerName: '小计',
          field: 'etd_total_price'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },
  computed: {},
  created () {
    this.context = this
  },
  mounted () {
    this.init()
  },
  methods: {
    init (goodsinventoryin_id) {
      this.isSidebarActiveLocal = true
      this.goodsinventoryin_id = goodsinventoryin_id // 赋值当前查询id

      if (goodsinventoryin_id > 0) {
        this.$store
          .dispatch('erpTransfer/getItemData', goodsinventoryin_id)
          .then((res) => {
            if (res.code == 200) {
              this.data = res.data
              this.dataFrom = res.data.erpTurnDetail
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
      console.log('dataListSelections', this.dataListSelections)
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
    } // 表格宽度自适应
  }
}
</script>
