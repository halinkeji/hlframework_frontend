<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.9) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.9) + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <q-card-section class="row items-center q-pa-sm">
            <div class="text-h6">库存详情</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
          </q-card-section>
          <div class="col-shrink bg-white q-px-xs q-pb-lg q-gutter-x-xs row">
            <q-input class=" col-12 col-md-2 q-mt-xs" clearable outlined v-model="text" label="商品名称/条码/助记码/简称" dense />
              <q-btn color="primary" class=" q-mt-xs" unelevated label="搜索" @click="getList" />
               <q-btn color="warning" @click="resetCondition" class=" q-mt-xs" unelevated  label="重置" />
          </div>
        </div>

        <div class="col-shrink full-height bg-grey-2 q-px-xs">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham  ag-grid-table erp-number-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="specificationNewsData"
            rowSelection="multiple"
            @first-data-rendered="onFirstDataRendered"
            rowHeight="40"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            :floatingFilter="false"
            :enableCharts="true"
            :enableRangeSelection="true"
            :enableCellTextSelection="true"
            :suppressRowTransform="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
            :rowMultiSelectWithClick="true"
            :localeText="localeText"
            :context="context"
            @rowSelected="rowSelectedAg"
          ></ag-grid-vue>
        </div>
        <div class="col-shrink bg-white q-pb-md">
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
            :current-page="page.pageIndex"
            :page-size="page.pSize"
            :total="page.totalCount"
            layout="total, sizes, prev, pager, next, jumper"
          ></hl-pagination>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'depotDetail',
  data () {
    return {
      depotId: 0,
      addStoreSidebar: false,
      columnDefs: [
        {
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '商品名称',
          field: 'goo_name',
          filter: false, // 是否过滤
          width: this.nowpx(0.24) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '条码',
          field: 'goo_code',
          filter: false,
          valueGetter: (p) => {
            if (p.data.main_spe_id) {
              return p.data.sl_barCode
            } else {
              return p.data.goo_code
            }
          },
          width: this.nowpx(0.09) + 'px'
        },

        {
          headerName: '规格名称',
          field: 'sl_title',
          filter: false,
          width: this.nowpx(0.09) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },

        {
          headerName: '库存',
          field: 'edn_number',
          filter: false,
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '助记码',
          field: 'goo_pinYin',
          filter: false,
          width: this.nowpx(0.09) + 'px'
        },

        {
          headerName: '简称',
          field: 'goo_nick',
          filter: false,
          width: this.nowpx(0.09) + 'px'
        }
      ],
      specificationNewsData: [], // 默认数据源
      selected: [],
      text: '',
      goodsTypeId: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      localeText: this.$ag_grid_localeText,
      context: null,
      dataListSelections: [],
      gridOptions: {}
    }
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {
    init (id) {
      this.depotId = id
      this.addStoreSidebar = true
      if (id > 0) {
        this.getList()
      }
    },

    getList () {
      const obj = {
        depotId: this.depotId,
        text: this.text,
        ...this.page
      }
      this.$store
        .dispatch('erpnumber/getDepotGoodsData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.specificationNewsData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
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

    hideNowPage () {
      this.$emit('getMethods')
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
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
    },
    rowSpan (params) {
      const fields = ['goo_name']
      const data = this.specificationNewsData
      const row = params.data
      const rowIndex = params.node.rowIndex
      const property = params.colDef.field
      const cellValue = row[property]

      if (cellValue && fields.includes(property)) {
        const prevRow = data[rowIndex - 1]
        let nextRow = data[rowIndex + 1]
        let countRowspan = 0
        if (prevRow && prevRow[property] === cellValue) {
          return countRowspan
        } else {
          countRowspan = 1
          while (nextRow && nextRow[property] === cellValue) {
            nextRow = data[++countRowspan + rowIndex]
          }

          if (countRowspan > 1) {
            return countRowspan
          }
        }
      }
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    resetCondition () {
      this.text = ''

      this.$nextTick(() => {
        this.getList()
      })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
  width: 50%
</style>
<style>
.erp-number-table .cell-span-erp-number {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
