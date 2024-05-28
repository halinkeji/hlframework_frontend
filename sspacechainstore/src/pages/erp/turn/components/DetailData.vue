<template>
  <q-dialog persistent maximized v-model="isSidebarActiveLocal" @hide="colseDetailDialog">
    <q-card class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white row q-px-xs q-pb-md">
        <div class="row full-width q-pa-sm">
          <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
          调拨详情
        </div>
        <div class="row full-width q-pl-md">
          <div class="col-3 q-mr-lg">
            <q-input v-model="inStoreName" dense disable label="调入门店" />
          </div>
          <div class="col-3">
            <q-input v-model="outStoreName" dense disable label="调出门店" />
          </div>
        </div>
      </div>
      <div class="col-shrink q-pa-sm full-height">
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
      <div class="col-shrink bg-white q-pb-md  text-center q-gutter-sm q-px-md">
        <q-btn
          color="primary"
          class="q-px-xl"
          v-if="
            parseInt(data.gii_status) == 2 && parseInt(data.gii_inStoreId) == parseInt($q.localStorage.getItem('sspacechainstore_account_info').store_id)
          "
          @click="confirmTurnStock"
          unelevated
          label="入库"
        />
        <q-btn class="q-px-xl" unelevated v-close-popup color="grey" label="关闭" />
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import AgDepotSelect from './AgDepotSelect'
import AgOutDepotSelect from './AgOutDepotSelect'

export default {
  name: 'DetailData',
  components: {
    AgDepotSelect,
    AgOutDepotSelect,
  },
  data() {
    return {
      isSidebarActiveLocal: false,
      context: '',
      data: {},
      gridOptions: {},
      dataFrom: [],
      dataListSelections: [],
      columnDefs: [
        {
          headerName: '商品编码',
          field: 'etd_goods_code',
        },
        {
          headerName: '商品名称',
          field: 'etd_goods_name',
        },

        {
          headerName: '规格名称',
          field: 'etd_spe_name',
        },
        {
          headerName: '调拨数量',
          field: 'etd_turn_number',
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
          },
        },
        {
          headerName: '商品单价',
          field: 'etd_goods_price',
        },
        {
          headerName: '小计',
          field: 'etd_total_price',
        },
        {
          headerName: '调出仓库',
          field: 'etd_out_depot_id',
          filter: false,
          valueGetter: (params) => {
            return params.data && params.data.outDepot && params.data.outDepot.ed_name ? params.data.outDepot.ed_name : ''
          },
        },
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0,
      },
      localeText: this.$ag_grid_localeText,
      depotData: [],
      inStoreName: '',
      outStoreName: '',
    }
  },
  computed: {},
  created() {},
  mounted() {
    this.context = this
  },
  methods: {
    init(goodsinventoryin_id) {
      this.getDepotList()
      this.isSidebarActiveLocal = true
      this.goodsinventoryin_id = goodsinventoryin_id // 赋值当前查询id

      if (goodsinventoryin_id > 0) {
        this.$store
          .dispatch('erpTurn/getItemData', goodsinventoryin_id)
          .then((res) => {
            if (res.code == 200) {
              this.data = res.data
              this.dataFrom = res.data.erpTurnDetail
              if (this.data && this.data.inStore && this.data.inStore.name) {
                this.inStoreName = this.data.inStore.name
              }

              if (this.data && this.data.store && this.data.store.name) {
                this.outStoreName = this.data.store.name
              }

              if (
                parseInt(this.data.gii_status) != 2 ||
                parseInt(this.data.gii_inStoreId) == parseInt(this.$q.localStorage.getItem('sspacechainstore_account_info').store_id)
              ) {
                this.columnDefs.push({
                  headerName: '调入仓库-库存',
                  field: 'etd_in_depot_id',
                  filter: false,
                  singleClickEdit: true,
                  cellRendererFramework: 'AgDepotSelect',
                  // width: this.nowpx(0.25) + 'px',
                })
              }
            } else {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '操作失败',
                color: 'red',
              })
            }
          })

          .catch((err) => {})
      }
    },
    rowSelectedAg(p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    confirmTurnStock() {
      const that = this

      this.$q
        .dialog({
          title: '确定签收本次调拨单据?',
          message: '签收之后库存自动进入当前商户',
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          const params = {
            turnInvoiceId: this.data.id,
          }
          that.$store
            .dispatch('erpTurn/confirmTurn', params)
            .then((res) => {
              // 后台返回
              if (res.code == 200) {
                that.$q.notify({
                  message: '成功',
                  caption: '确认成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right',
                })
                that.colseDetailDialog()
              }
            })
            .catch((error) => {
              that.$q.notify({
                message: '失败',
                caption: error.message,
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red',
              })
            })
        })
    },
    colseDetailDialog() {
      this.isSidebarActiveLocal = false
      this.$emit('colseDetailDialog')
    },
    nowpx(px) {
      let nowWidth = this.$q.screen.width - 550
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    getDepotList() {
      this.$store
        .dispatch('erpdepot/getAllData')
        .then((res) => {
          if (res.code == 200) {
            this.depotData = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red',
          })
        })
    },
    onFirstDataRendered(params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    }, // 表格宽度自适应
  },
}
</script>
