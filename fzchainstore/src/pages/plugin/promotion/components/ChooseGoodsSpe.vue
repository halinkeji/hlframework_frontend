<template>
  <q-dialog v-model="activePrompt" fullscreen persistent :maximized="maximizedToggle" transition-show="slide-up" transition-hide="slide-down">
    <q-card
      :style="{
        width: this.$q.screen.width * 0.1 + 'px',
        'min-width': this.$q.screen.width * 0.1 + 'px',
      }"
      class="fit"
    >
      <div
        class="
          fit
          column
          no-wrap
          justify-between
          items-stretch
          content-stretch
          no-scroll
        "
      >
        <q-card-section class="row items-center">
          <div class="text-h6">选择商品</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <div class="col-shrink bg-white q-px-xs q-pb-xl row q-gutter-xs">
          <q-input class="col-12 col-md-2 q-mt-sm" outlined v-model="searchValue" label="名称/编码/助记码/简称" dense />
          <q-select
            outlined
            dense
            v-model="queryCondition.type"
            :options="typeData"
            class="col-12 col-md-2 q-mt-sm"
            option-value="id"
            option-label="gt_name"
            emit-value
            map-options
            label="商品分类 "
          />
          <q-select
            outlined
            dense
            v-model="queryCondition.supplier"
            :options="supplierData"
            class="col-12 col-md-2 q-mt-sm"
            option-value="id"
            option-label="ces_name"
            emit-value
            map-options
            label="供货商 "
          />
          <q-select
            outlined
            dense
            v-model="queryCondition.brand"
            :options="brandList"
            class="col-12 col-md-2 q-mt-sm"
            option-value="id"
            option-label="cp_name"
            emit-value
            map-options
            label="品牌"
          />
          <q-select
            outlined
            dense
            v-model="queryCondition.years"
            :options="yearsList"
            option-value="id"
            option-label="cp_name"
            class="col-12 col-md-2 q-mt-sm"
            emit-value
            map-options
            label="年份 "
          />
          <q-select
            outlined
            dense
            v-model="queryCondition.season"
            :options="seasonList"
            option-value="id"
            option-label="cp_name"
            class="col-12 col-md-2 q-mt-sm"
            emit-value
            map-options
            label="季度 "
          />
          <q-select
            outlined
            dense
            v-model="queryCondition.priority"
            :options="priorityList"
            option-value="id"
            option-label="cp_name"
            class="col-12 col-md-2 q-mt-sm"
            emit-value
            map-options
            label="商品层"
          />
          <q-select
            outlined
            dense
            v-model="queryCondition.tag"
            :options="tagList"
            option-value="id"
            option-label="gt_name"
            class="col-12 col-md-2 q-mt-sm"
            multiple
            use-chips
            stack-label
            emit-value
            map-options
            label="商品标签 *"
          />
          <q-btn color="primary" class="q-mt-sm q-mx-md" unelevated @click="getInquireType(goodsModel)">搜索</q-btn>
          <q-btn color="grey-6" unelevated @click="handleFormReset" class="q-mt-sm q-mr-md">重置</q-btn>
        </div>
        <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table full-height hl_header_center hl_content_center goods-select-table"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :defaultColDef="defaultColDef"
            :rowData="specificationNewsData"
            rowSelection="multiple"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            :floatingFilter="false"
            :enableCharts="true"
            :enableRangeSelection="true"
            :enableCellTextSelection="true"
            :suppressRowTransform="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="false"
            :rowMultiSelectWithClick="true"
            :localeText="localeText"
            @first-data-rendered="onFirstDataRendered"
            rowHeight="45"
          ></ag-grid-vue>
        </div>
        <div class="col-shrink bg-white q-pb-lg row q-gutter-md items-center q-px-md">
          <q-btn class="q-px-xl" unelevated color="primary" @click="getSelectedTabel(true)" size="sm" label="选中" />
          <q-btn class="q-px-xl" unelevated color="green" @click="getSelectedTabel(false)" size="sm" label="选中并关闭" />
          <q-btn class="q-px-xl" unelevated color="grey" size="sm" @click="closeDialog" label="取消" />
          <q-space />
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
            :current-page="page.pageIndex"
            :page-size="page.pageSize"
            :total="page.pageTotal"
          ></hl-pagination>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'ChooseGoodsSpe',
  components: {},
  data () {
    return {
      searchValue: '',
      maximizedToggle: true,
      specificationNewsData: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '',
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: 50
        },
        {
          headerName: '商品名称',
          field: 'ca_name',
          filter: false,
          width: 237,
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-goods-select': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '颜色',
          field: 'cad_color_name',
          filter: false,
          width: 237
        },
        {
          headerName: '尺寸',
          field: 'cad_size_name',
          filter: false,
          width: 237
        },
        {
          headerName: '分类',
          field: 'ca_name',
          filter: false,
          width: 185,
          valueGetter: (p) => {
            if (p.data.type) {
              return p.data.type.gt_name
            } else {
              return ''
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-goods-select': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '品牌',
          field: 'ca_name',
          valueGetter: (p) => {
            if (p.data.brand) {
              return p.data.brand.cp_name
            } else {
              return ''
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-goods-select': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '年份',
          field: 'ca_name',
          valueGetter: (p) => {
            if (p.data.years) {
              return p.data.years.cp_name
            } else {
              return ''
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-goods-select': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '季度',
          field: 'ca_name',
          valueGetter: (p) => {
            if (p.data.season) {
              return p.data.season.cp_name
            } else {
              return ''
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-goods-select': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },

        {
          headerName: '层级',
          field: 'ca_name',
          valueGetter: (p) => {
            if (p.data.priority) {
              return p.data.priority.cp_name
            } else {
              return ''
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-goods-select': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },

        {
          headerName: '售价',
          field: 'cad_price',
          filter: false,
          width: 200
        },
        {
          headerName: '编码',
          field: 'cad_skc_code',
          filter: false,
          width: 200
        }
      ],
      queryCondition: {
        searchName: '',
        brand: '',
        season: '',
        years: '',
        band: '',
        priority: '',
        supplier: '',
        type: '',
        tag: []
      },
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      localeText: this.$ag_grid_localeText,
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      activePrompt: false,
      goodsModel: '',
      supplier: '',
      supplierData: [],
      typeData: [],
      brandList: [],
      yearsList: [],
      seasonList: [],
      priorityList: [],
      tagList: []
    }
  },

  mounted () {
    this.getSupplierList()
    this.getPropertyAll()
    this.getType()
  },
  created () {},
  computed: {},
  methods: {
    // 获取供应商
    getSupplierList () {
      this.$store
        .dispatch('clothingSupplier/getSupp')
        .then((res) => {
          if (res.code == 200) {
            this.supplierData = res.data ? res.data : []
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
    getPropertyAll () {
      this.$store
        .dispatch('clothingArchives/getLists')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.brandList = res.data.brand ? res.data.brand : []
              this.yearsList = res.data.years ? res.data.years : []
              this.seasonList = res.data.season ? res.data.season : []
              this.priorityList = res.data.priority ? res.data.priority : []
              this.tagList = res.data.tag ? res.data.tag : []
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
    getType () {
      this.$store
        .dispatch('clothingType/getTypeslistData')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.typeData = res.data
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
    closeDialog () {
      this.activePrompt = false
      this.$emit('closeDialog')
    },
    getSelectedTabel (val) {
      const selectedRows = this.gridOptions.api.getSelectedRows()
      this.activePrompt = val
      this.$emit('getSelectedGoodsData', selectedRows)
    },
    rowSpan (params) {
      const fields = ['ca_name', 'ca_name', 'ca_name', 'ca_name', 'ca_name']
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

    // 选择商品开启弹窗调取数据
    getInquireType (val, supplier) {
      // vue 1实物服务 2套餐
      this.activePrompt = true
      this.goodsModel = val
      this.supplier = supplier
      const obj = {
        type: val,
        ...this.queryCondition,
        supplier: supplier,
        text: this.searchValue,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('components/getListErpData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.specificationNewsData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? parseInt(res.data.page.totalCount) : 0
          }
        })
        .catch((error) => {})
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getInquireType(this.goodsModel)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getInquireType(this.goodsModel)
    },
    // 查询
    handleFormSearchSubmit () {
      this.getInquireType(this.goodsModel)
    },
    // 重置
    handleFormReset () {
      this.searchValue = ''
      this.queryCondition.searchName = ''
      this.queryCondition.brand = ''
      this.queryCondition.season = ''
      this.queryCondition.years = ''
      this.queryCondition.band = ''
      this.queryCondition.priority = ''
      this.queryCondition.supplier = ''
      this.queryCondition.type = ''
      this.queryCondition.tag = []
      this.getInquireType(this.goodsModel)
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    }
  }
}
</script>
<style>
.my-green-class {
  text-align: center;
}

.goods-select-table .cell-span-goods-select {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
