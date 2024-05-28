<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink row q-gutter-sm q-pa-sm q-pb-md bg-white">
      <div class="col-12 col-md-2  ">
        <q-input clearable outlined v-model="queryCondition.code" label="货号:" dense />
      </div>
      <div class="col-12 col-md-2  ">
        <q-input clearable outlined v-model="queryCondition.searchName" label="商品名称:" dense />
      </div>

      <div class="col-12 col-md-2  " v-show="showQuery">
        <q-input clearable outlined v-model="queryCondition.callCount" label="输入店仓:" dense />
      </div>
      <div class="col-12 col-md-2  " v-show="showQuery">
        <q-input clearable outlined v-model="queryCondition.skcCode" label="SKU码/条形码，多个逗号隔开:" dense />
      </div>
      <div class="col-12 col-md-2  " v-show="showQuery">
        <q-input clearable outlined v-model="queryCondition.colorName" label="请输入颜色:" dense />
      </div>
      <div class="col-12 col-md-2  " v-show="showQuery">
        <q-input clearable outlined v-model="queryCondition.sizeName" label="请输入尺码:" dense />
      </div>
      <div class="col-12 col-md-2  " v-show="showQuery">
        <q-input clearable outlined v-model="queryCondition.articleCode" label="请输入原始货号:" dense />
      </div>

      <div class="col-12 col-md-2  " v-show="showQuery">
        <q-input clearable outlined v-model="queryCondition.onlyCode" label="请输入唯一码:" dense />
      </div>
      <div class="col-12 col-md-2  " v-show="showQuery">
        <q-select
          outlined
          clearable
          dense
          v-model="queryCondition.brand"
          :options="brandList"
          option-value="id"
          option-label="cp_name"
          emit-value
          map-options
          label="品牌"
        />
      </div>
      <div class="col-12 col-md-2  " v-show="showQuery">
        <hl-select-tree
        :list_width="400"
        @getItem="changeGoodsType"
        @resetValue="queryCondition.type = ''"
        :dataList="goodsTypedata"
        textName="请选择分类"
        :inputLabel="'gt_name'"
        :inputValue="'id'"
        :showValue="queryCondition.type"
        ref="typeSelectTreeRef"
        :bottomSlots="1"
      />
      </div>
      <div class="col-12 col-md-2  " v-show="showQuery">
        <q-select
          outlined
          clearable
          dense
          v-model="queryCondition.years"
          :options="yearsList"
          option-value="id"
          option-label="cp_name"
          emit-value
          map-options
          label="年份 "
        />
      </div>
      <div class="col-12 col-md-2  " v-show="showQuery">
        <q-select
          outlined
          clearable
          dense
          v-model="queryCondition.season"
          :options="seasonList"
          option-value="id"
          option-label="cp_name"
          emit-value
          map-options
          label="季度 "
        />
      </div>
      <div class="col-12 col-md-2  " v-show="showQuery">
        <q-select
          outlined
          clearable
          dense
          v-model="queryCondition.band"
          :options="bandList"
          option-value="id"
          option-label="cp_name"
          emit-value
          map-options
          label="波段 *"
        />
      </div>
      <div class="col-12 col-md-2  " v-show="showQuery">
        <q-select
          outlined
          clearable
          dense
          v-model="queryCondition.series"
          :options="bandList"
          option-value="id"
          option-label="cp_name"
          emit-value
          map-options
          label="系列 "
        />
      </div>
      <div class="col-12 col-md-2  " v-show="showQuery">
        <q-select
          outlined
          clearable
          dense
          v-model="queryCondition.style"
          :options="styleList"
          option-value="id"
          option-label="cp_name"
          emit-value
          map-options
          label="风格 *"
        />
      </div>
      <div class="col-12 col-md-2  " v-show="showQuery">
        <q-select
          outlined
          clearable
          dense
          v-model="queryCondition.priority"
          :options="priorityList"
          option-value="id"
          option-label="cp_name"
          emit-value
          map-options
          label="商品层"
        />
      </div>
      <div class="col-12 col-md-2  " v-show="showQuery">
        <q-select
          outlined
          clearable
          dense
          v-model="queryCondition.tag"
          :options="tagList"
          option-value="id"
          option-label="gt_name"
          multiple
          use-chips
          emit-value
          map-options
          label="商品标签 *"
        />
      </div>
      <div class="col-12 col-md-2  " v-show="showQuery">
        <q-select
          outlined
          clearable
          dense
          v-model="queryCondition.group"
          :options="groupList"
          option-value="id"
          option-label="cgi_name"
          emit-value
          map-options
          label="商品分组 "
        />
      </div>
      <div class="col-12 col-md-2  " v-show="showQuery">
        <q-select
          outlined
          clearable
          dense
          v-model="queryCondition.standard"
          :options="standardList"
          option-value="id"
          option-label="cs_name"
          emit-value
          map-options
          label="执行标准 "
        />
      </div>
      <div class="col-12 col-md-2  " v-show="showQuery">
        <q-select
          outlined
          clearable
          dense
          v-model="queryCondition.supplier"
          :options="supplierData"
          option-value="id"
          option-label="ces_name"
          emit-value
          map-options
          label="供货商 "
        />
      </div>

      <q-btn unelevated label="重置" color="warning" @click="resetCondition" />
      <q-btn unelevated label="查询" color="primary" :loading="queryLoad" @click="getList">
        <template v-slot:loading>
          <q-spinner-ios class="on-center" />
        </template>
      </q-btn>
      <q-btn-dropdown v-model="showQuery" persistent dense flat color="primary" :label="tableLabel" @before-show="showCondition" @before-hide="hideCondition">
      </q-btn-dropdown>

      <q-btn color="primary" unelevated label="横版展示" :to="{ name: 'erpNumber' }" />
    </div>

      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham  ag-grid-table erp-number-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="specificationNewsData"
          rowSelection="multiple"
          :defaultColDef="defaultColDef"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="100"
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

      <div class="col-shrink bg-white q-pb-md text-center">
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
  </q-page>
</template>
<script>
import AgButton from './components/AgButton'
import AgShowBuy from './components/AgShowBuy'
import AgShowWay from './components/AgShowWay'
import AgShowNumber from './components/AgShowNumber'
import AgShowNumberWay from './components/AgShowNumberWay'
import AgShowNumberBuy from './components/AgShowNumberBuy'

export default {
  name: 'NumberVertical',
  components: {
    AgButton,
    AgShowBuy,
    AgShowWay,
    AgShowNumber,
    AgShowNumberBuy,
    AgShowNumberWay
  },
  data () {
    return {
      activeName: '0',
      components: { AgButton, AgShowBuy },
      gridOptions: {},
      defaultColDef: {
        sortable: true
      },
      depotData: [],
      columnDefs: [
        {
          headerName: '商品名称',
          field: 'goo_name',
          filter: false, // 是否过滤
          width: this.nowpx(0.18) + 'px',
          onCellValueChanged: function (p) {
            const itemsToUpdate = []
            const data = p.data
            data.goo_name = Math.floor(Math.random() * 20000 + 20000)
            itemsToUpdate.push(data)
            const res = p.api.applyTransaction({ update: itemsToUpdate })
          },
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
          headerName: '分类',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          valueGetter: (p) => {
            if (p.data.type) {
              return p.data.type.gt_name
            } else {
              return ''
            }
          }
        },
        {
          headerName: '颜色',
          field: 'cad_color_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '库存',
          field: 'edn_number',
          filter: false,
          cellRendererFramework: 'AgShowNumber',
          width: this.nowpx(0.12) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '在购',
          field: 'buy_number',
          cellRendererFramework: 'AgShowNumberBuy',
          filter: false,
          width: this.nowpx(0.12) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '在途',
          field: 'way_number',
          cellRendererFramework: 'AgShowNumberWay',
          filter: false,
          width: this.nowpx(0.12) + 'px',
          comparator: (a, b) => a - b
        },
        // {
        //   headerName: '可用',
        //   field: 'edn_number',
        //   filter: false,
        //   width: this.nowpx(0.12) + 'px'
        // },
        {
          headerName: '吊牌价',
          field: 'cad_price',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '助记码',
          field: 'goo_pinYin',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '编码',
          field: 'cad_skc_code',
          filter: false,
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'AgButton',
          rowSpan: this.rowSpan,
          width: this.nowpx(0.04) + 'px',
          cellClassRules: {
            'cell-span-erp-number': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        }
      ],
      specificationNewsData: [], // 默认数据源
      selected: [],
      searchNumber: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      localeText: this.$ag_grid_localeText,
      context: null,
      goodsTypedata: [],
      queryCondition: {
        code: '',
        skcCode: '',
        searchName: '',
        onlyCode: '',
        articleCode: '',
        brand: '',
        season: '',
        years: '',
        band: '',
        series: '',
        style: '',
        priority: '',
        group: '',
        standard: '',
        supplier: '',
        tag: [],
        colorName: '',
        sizeName: '',
        type: ''
      },
      fabricList: [],
      safetyTypeList: [],
      brandList: [],
      yearsList: [],
      seasonList: [],
      bandList: [],
      seriesList: [],
      styleList: [],
      priorityList: [],
      groupList: [],
      standardList: [],
      tagData: [],
      formatList: [],
      format: [],
      depotList: [],
      shelfList: [],
      locationList: [],
      sizeData: [],
      colorData: [],
      sizeLayoutData: [],
      colorLayoutData: [],
      customizeDetail: [],
      customizeData: '',
      supplierData: [],
      tagList: [],
      addPoppupStatus: false,
      showStatus: false,
      configShowData: [],
      showQuery: false,
      tableListData: [{}],
      queryLoad: false,
      tableLabel: '展开',
      archivesData: []
    }
  },

  mounted () {
    this.getList()
  },
  created () {
    this.context = this
    this.getGoodsType()

    this.getDepotList()

    this.getPropertyAll()
    this.getSupplierList()
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    showCondition () {
      this.showQuery = true
      this.tableLabel = '收起'
    },
    hideCondition () {
      this.showQuery = false
      this.tableLabel = '展开'
    },
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
              this.fabricList = res.data.fabric ? res.data.fabric : []
              this.safetyTypeList = res.data.safetytype ? res.data.safetytype : []
              this.brandList = res.data.brand ? res.data.brand : []
              this.yearsList = res.data.years ? res.data.years : []
              this.seasonList = res.data.season ? res.data.season : []
              this.bandList = res.data.band ? res.data.band : []
              this.styleList = res.data.style ? res.data.style : []
              this.seriesList = res.data.series ? res.data.series : []
              this.standardList = res.data.standard ? res.data.standard : []
              this.depotList = res.data.depot ? res.data.depot : []
              this.locationList = res.data.location ? res.data.location : []
              this.supplierList = res.data.supplier ? res.data.supplier : []
              this.priorityList = res.data.priority ? res.data.priority : []
              this.groupList = res.data.group ? res.data.group : []
              this.formatList = res.data.format ? res.data.format : []
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
    getDepotList () {
      this.$store
        .dispatch('clothingDepot/getAllListData')
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
    getGoodsType () {
      this.$store
        .dispatch('clothingType/getTreeList')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.goodsTypedata = res.data
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
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-商品库存管理记录'
      })
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
    getList () {
      const obj = {
        inType: 1,
        ...this.queryCondition,
        ...this.page
      }
      this.$store
        .dispatch('erpNumber/getListDataHeng', obj)
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
    selfAdaption (params) {
      params.api.sizeColumnsToFit()
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

    resetCondition () {
      this.queryCondition.searchName = ''
      this.queryCondition.code = ''
      this.queryCondition.skcCode = ''
      this.queryCondition.onlyCode = ''
      this.queryCondition.articleCode = ''
      this.queryCondition.brand = ''
      this.queryCondition.season = ''
      this.queryCondition.years = ''
      this.queryCondition.band = ''
      this.queryCondition.series = ''
      this.queryCondition.style = ''
      this.queryCondition.priority = ''
      this.queryCondition.group = ''
      this.queryCondition.supplier = ''
      this.queryCondition.standard = ''
      this.queryCondition.tag = []
      this.queryCondition.colorName = ''
      this.queryCondition.sizeName = ''
      this.queryCondition.type = ''
      this.$refs.typeSelectTreeRef.resetValueData()
      this.getList()
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    },
    changeGoodsType (item) {
      this.queryCondition.type = item.id
    }
  }
}
</script>
<style>
.erp-number-table .cell-span-erp-number {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
