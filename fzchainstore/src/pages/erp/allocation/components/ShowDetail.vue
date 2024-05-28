<template>
  <q-dialog v-model="isSidebarActiveLocal" persistent>
    <q-card
      class="q-pa-sm fit"
      :style="{
        width: this.$q.screen.width * 0.9 + 'px',
        'min-width': this.$q.screen.width * 0.9 + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs ">
          <div class="row justify-center">
            <h6 class="no-margin">订货单据信息</h6>
            <q-space />
            <q-btn unelevated flat round dense icon="close" v-close-popup />
          </div>
          <div class="row">
            <div class="col-auto" v-if="allocationData.cep_if_pack == '1'">
              <q-btn
                class="q-mt-sm q-mx-sm"
                color="secondary"
                unelevated
                label="装箱信息"
                :disable="goodsInData.length > 1 ? false : true"
                @click="showPackingData"
              />
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-2 q-pa-xs">
              <q-input dense disable v-model="allocationData.cep_contract_number" label="配货单据号" />
            </div>
            <div class="col-12 col-md-1 q-pa-xs">
              <q-input disable dense v-model="allocationData.cep_buyer_name" label="配货员" />
            </div>
            <div class="col-12 col-md-1 q-pa-xs">
              <q-input disable dense v-model="allocationData.cep_supplier_name" label="供应商" />
            </div>
            <div class="col-12 col-md-2 q-pa-xs">
              <q-input disable dense v-model="allocationData.cep_total_purchase_amount" label="配货实付款" />
            </div>
            <div class="col-12 col-md-2 q-pa-xs">
              <q-input disable dense v-model="allocationData.cep_total_purchase_num" label="发货总数量" />
            </div>
            <div class="col-12 col-md-2 q-pa-xs">
              <q-input disable dense v-model="allocationData.cep_note" label="配货备注" />
            </div>
          </div>
        </div>

        <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
          <ag-grid-vue
            ref="agGridTable"
            class="ag-theme-balham ag-grid-table full-height hl_header_center hl_content_center"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :defaultColDef="defaultColDef"
            :rowData="goodsInData"
            :rowDragManaged="true"
            :gridOptions="gridOptions"
            colResizeDefault="shift"
            :animateRows="false"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            :components="components"
            :suppressRowTransform="true"
            :suppressCellSelection="true"
            @first-data-rendered="onFirstDataRendered"
            rowHeight="50"
            :context="context"
            :stopEditingWhenGridLosesFocus="true"
            :suppressRowDeselection="true"
            :localeText="localeText"
          >
          </ag-grid-vue>
        </div>
        <div class="col-shrink bg-white q-pa-md q-pb-xl">
          <q-form ref="erpInRef">
            <div class="row ">
              <div class="col-12 q-px-xs">
                <q-input type="textarea" outlined v-model="allocationData.cep_note" label="备注" dense :rows="2" />
              </div>
            </div>
            <div class="row q-gutter-sm q-mt-xs q-pb-lg">
              <div class="col-auto">
                账单小计:<span class="text-primary  text-h6"> {{ allocationData.cep_total_purchase_amount }}</span>
              </div>
              <div class="col-auto">
                应配货数量:<span class="text-primary text-h6">{{ allocationData.cep_total_shipments_quantity }}</span>
              </div>
              <div class="col-auto">
                配货数量:<span class="text-primary text-h6">{{ allocationData.cep_total_shipments_quantity }}</span>
              </div>
              <div class="col-auto">
                未配货数量:<span class="text-primary text-h6">{{ allocationData.cep_total_noallocation_quantity }}</span>
              </div>

              <q-space />
              <div class="col-auto text-h5" v-if="allocationData.cep_status > 0">
                单据状态:
                <span v-if="allocationData.cep_status == 1" class="text-primary">已保存</span>
                <span v-if="allocationData.cep_status == 2" class="text-primary">已确定</span>
                <span v-if="allocationData.cep_status == 3" class="text-positive">已审核</span>
                <span v-if="allocationData.cep_status == 4" class="text-red">已作废</span>
                <span v-if="allocationData.cep_status == 5" class="">挂起</span>
                <span v-if="allocationData.cep_status == 6" class="">已分配</span>
                <span v-if="allocationData.cep_status == 7" class="">出库完毕</span>
              </div>
            </div>
          </q-form>
        </div>
      </div>
      <show-packing ref="showDataRef" v-if="showPackingStatus" @dataList="showPackingStatus = false" />
    </q-card>
  </q-dialog>
</template>

<script>
import ShowPacking from 'pages/erp/packing/components/ShowPacking'
export default {
  name: 'ShowDetail',
  components: { ShowPacking },
  data () {
    return {
      gridOptions: {},
      isSidebarActiveLocal: true,
      chooseInvoiceVisible: false,
      allocationData: {
        cep_total_shipments_quantity: 0,
        cep_total_purchase_amount: 0,
        cep_total_noallocation_quantity: 0,
        cep_supplier_id: '',
        cep_note: '',
        cep_pay_type: '',
        cep_supplier_name: '',
        cep_supplier_code: '',
        cep_depot_code: '',
        cep_depot_name: '',
        cep_buyer_id: '',
        cep_buyer_name: '',
        cep_if_pack: '2',
        cep_status: 0,
        cep_type: 3
      },
      context: null,
      searchValue: '',
      components: {},
      supplierData: [],
      goodsInData: [],
      columnDefs: [
        {
          headerName: '条码',
          field: 'ead_skc_code',
          filter: false,
          width: this.nowpx(0.08) + 'px',
          pinned: this.pinnedComputed('left')
        },
        {
          headerName: '商品名称',
          field: 'ead_archives_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '货号',
          field: 'ead_article_code',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '颜色 ',
          field: 'ead_color_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '尺码 ',
          field: 'ead_size_name',
          filter: false,
          pinned: this.pinnedComputed('left'),
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '订货数量',
          field: 'ead_quantity',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '折后单价',
          field: 'ead_discount_after_amount',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '配货金额',
          field: 'ead_cash_amount',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '配货数量',
          field: 'ead_shipments_quantity',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.ead_archives_id > 0 && this.allocationData.cep_allocation_type == 2
          },
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '未配货数量',
          field: 'ead_discrepancy_quantity',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '备注',
          field: 'ead_note',
          filter: false,
          singleClickEdit: true,
          editable: (p) => {
            return p.data.ead_archives_id > 0
          },
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.08) + 'px',
          pinned: this.pinnedComputed('right')
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      showPackingStatus: false,
      showGoodsList: false,
      localeText: this.$ag_grid_localeText,
      purchase_id: '',
      invoiceData: {},
      packingInfo: []
    }
  },

  created () {
    this.context = this
    // if (this.$route.query.id) {
    //   this.purchase_id = this.$route.query.id
    //   this.getItem()
    // }
  },
  mounted () {},
  computed: {},
  methods: {
    getItem (val) {
      this.isSidebarActiveLocal = true
      const obj = {
        id: val
      }
      this.$store
        .dispatch('erpAllocation/getItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.allocationData = res.data
            this.goodsInData = res.data.allocation.length > 0 ? res.data.allocation : []
            this.invoiceData = res.data.invoice ? res.data.invoice : {}
            if (res.data.allocationPacking.length > 0) {
              this.packingInfo = res.data.allocationPacking.map((item) => {
                return item.id
              })
            }
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
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },

    getPacking () {
      this.goodsInData.forEach((item) => {
        if (item.epd_packing_id > 0) {
          if (this.packingInfo.indexOf(item.epd_packing_id) < 0) {
            this.packingInfo.push(item.epd_packing_id)
          }
        }
      })
    },

    showPackingData () {
      this.showPackingStatus = true
      this.$nextTick(() => {
        this.$refs.showDataRef.getPacking(this.packingInfo)
      })
    },
    // 格式化数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
