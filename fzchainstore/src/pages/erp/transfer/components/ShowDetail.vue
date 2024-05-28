<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm ">
        <q-form ref="addDataRef" class=" row q-gutter-md">
          <q-select
            outlined
            dense
            class="col-12 col-xs-6 col-sm-2 q-mr-md"
            v-model="turnData.cep_in_depot_id"
            :options="depotData"
            label="请选择调入仓库"
            option-value="id"
            option-label="cd_name"
            emit-value
            map-options
            :disable="turnData.cep_in_depot_id ? true : false"
          />
          <q-select
            outlined
            dense
            class="col-12 col-xs-6 col-sm-2 q-mr-md"
            v-model="turnData.cep_out_depot_id"
            :options="depotData"
            label="请选择调出仓库"
            option-value="id"
            option-label="cd_name"
            emit-value
            map-options
            :disable="turnData.cep_out_depot_id ? true : false"
          />
        </q-form>
        <div class="q-gutter-x-xs row q-pb-lg">
          <div class="col-12 col-md-2 q-pa-xs">
            <q-input dense disable v-model="turnData.cep_contract_number" label="调拨单据号" />
          </div>
          <div class="col-12 col-md-2 q-pa-xs">
            <q-input disable dense v-model="turnData.cep_total_amount" label="调拨金额" />
          </div>
          <div class="col-12 col-md-2 q-pa-xs">
            <q-input disable dense v-model="turnData.cep_total_quantity" label="调拨数量" />
          </div>
          <div class="col-12 col-md-2 q-pa-xs">
            <q-input disable dense v-model="turnData.number" label="调拨数量" />
          </div>
          <div class="col-12 col-md-2 q-pa-xs">
            <q-input dense v-model="turnData.cep_note" label="调拨备注" />
          </div>
        </div>
      </div>

      <div class="col-shrink q-px-xs q-py-none full-height bg-white">
        <ag-grid-vue
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center erp-turn-table full-height"
          ref="agGridTable"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="transferData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          :gridOptions="gridOptions"
          @first-data-rendered="onFirstDataRendered"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :context="context"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          :localeText="localeText"
        >
        </ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm">
        <q-btn label="返回" unelevated :to="{ name: 'erpTransfer' }" color="grey" class="q-px-xl" />
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'ShowDetail',
  components: {
  },
  data () {
    return {
      context: null,
      showGoodsList: false,
      addButtonDisabled: false,
      gridOptions: {},
      transferData: [],
      turnData: {
        cep_contract_number: '',
        cep_type: '',
        cep_status: 0,
        cep_in_depot_id: '',
        cep_out_depot_id: '',
        cep_total_amount: '',
        cep_total_quantity: '',
        cep_note: ''
      },
      searchValue: '',
      depotData: [],
      defaultColDef: {
        rowDragManaged: true
      },
      columnDefs: [
        {
          headerName: '商品条码',
          field: 'etd_skc_code',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '商品名称 ',
          field: 'etd_archives_name',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '颜色 ',
          field: 'etd_color_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '尺码 ',
          field: 'etd_size_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },

        {
          headerName: '现有库存',
          field: 'etd_turn_before_number',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '调拨数量',
          field: 'etd_turn_number',
          width: this.nowpx(0.08) + 'px'
        },

        {
          headerName: '商品单价',
          field: 'etd_price',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '小计',
          field: 'etd_total_price',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '备注',
          field: 'etd_note',
          width: this.nowpx(0.13) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,
      invoice_id: ''
    }
  },
  computed: {},
  created () {
    this.context = this
    this.context = this
    if (this.$route.query.id) {
      this.invoice_id = this.$route.query.id
      this.getItem()
    } else {
      this.getBufferList()
    }
  },
  mounted () {
    this.getDepotList()
  },
  methods: {
    getDepotList () {
      this.$store
        .dispatch('clothingDepot/getAllData')
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.depotData = res.data
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
    getItem () {
      const obj = {
        id: this.invoice_id
      }
      this.$store
        .dispatch('erpTransfer/getItem', obj)
        .then((res) => {
          if (res.code == 200) {
            this.turnData = res.data
            this.transferData = res.data.detail.length > 0 ? res.data.detail : []
            this.$nextTick(() => {
              this.getDataColumnSum()
            })
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
    getBufferList () {
      const obj = {
        id: this.invoice_id
      }
      this.$store
        .dispatch('erpTransfer/getBufferData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.transferData = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
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
<style>
.erp-turn-table .cell-span-erp-turn {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
