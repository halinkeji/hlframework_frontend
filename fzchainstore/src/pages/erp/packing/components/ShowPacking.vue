<template>
  <div class="centerx labelx">
    <q-dialog full-height v-model="visible"  persistent>
      <q-card
        :style="{
          width: $q.screen.width * 0.6 + 'px',
          'min-width': $q.screen.width * 0.6 + 'px',
        }"
        class="q-pa-sm full-height fit"
      >
        <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
          <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-xs row items-center">
            <div class="text-subtitle2">打包详情</div>
            <q-space />
            <q-btn icon="close" @click="closeDialog" flat round dense v-close-popup />
          </div>
          <div class="col-shrink q-px-xs q-py-none full-height ">
            <ag-grid-vue
              ref="agGridTable"
              :components="components"
              :gridOptions="gridOptions"
              class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
              :columnDefs="columnDefs"
              :suppressMovableColumns="true"
              :defaultColDef="defaultColDef"
              :rowData="invoiceData"
              :rowDragManaged="true"
              colResizeDefault="shift"
              :animateRows="false"
              rowHeight="50"
              :floatingFilter="false"
              :enableCellTextSelection="true"
              rowSelection="multiple"
              :suppressCellSelection="true"
              :suppressRowClickSelection="true"
              :localeText="localeText"
              :context="context"
              @first-data-rendered="onFirstDataRendered"
            ></ag-grid-vue>
          </div>
          <div class="col-shrink bg-white q-pb-md text-center">
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
          <show-detail ref="showDetailRef" v-if="showDetailStatus" @dataList="showDetailStatus = false" />
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import AgOperator from './AgOperator'
import ShowDetail from './ShowDetail'
export default {
  name: 'ShowPacking',
  components: {
    AgOperator,
    ShowDetail
  },
  data () {
    return {
      components: { AgOperator },
      memberListData: [],
      deleteAllIf: true,

      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      columnDefs: [

        {
          headerName: '单据号',
          field: 'cep_barcode',
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '打包编号',
          field: 'cep_code',
          width: this.nowpx(0.13) + 'px'
        },

        {
          headerName: '创建时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm')
          },
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '备注',
          field: 'cep_note',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'AgOperator',
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
      gridOptions: {},
      isInputDisabled: false,
      showDetailStatus: false,
      visible: false,
      invoiceData: [],
      searchQuery: '',
      localeText: this.$ag_grid_localeText,
      invoice: [],
      context: ''
    }
  },

  computed: {},
  created () {
    this.context = this
  },
  mounted () {},
  methods: {
    init (field, erpOrderId) {
      this.visible = true
      this.searchField = field
      this.erpOrderId = erpOrderId

      this.$nextTick(() => {
        this.getPacking()
      })
    },
    getPacking () {
      const obj = {
        searchField: this.searchField,
        erpOrderId: this.erpOrderId,
        pSize: this.page.pageSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('erpPacking/getPackageListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.invoiceData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },

    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getPacking()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getPacking()
    },
    splitBox (boxId) {
      if (boxId > 0) {
        const obj = {
          boxId
        }
        this.$store
          .dispatch('erpPacking/splitBoxData', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '拆箱成功',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 800,
                position: 'top-right'
              })
              this.$nextTick(() => {
                this.getPacking()
              })
            } else {
              this.$q.notify({
                message: '添加失败',
                caption: res.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            }
          })
          .catch((error) => {
            this.$q.notify({
              message: '添加失败',
              caption: error.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      } else {
        this.$q.notify({
          message: '添加失败',
          caption: '拆分错误，请刷新重试',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
      }
    },
    closeDialog () {
      this.visible = false
      this.$emit('closeChooseInvoice')
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearBut () {
      this.searchQuery = ''
      this.getPacking()
    },
    showDetail (val) {
      this.showDetailStatus = true
      this.$nextTick(() => {
        this.$refs.showDetailRef.init(val)
      })
    }
  }
}
</script>
