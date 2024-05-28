<template>
  <q-page class="fit">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink  bg-white q-pa-sm row q-gutter-sm">
          <div  class="col-12 col-md-2 ">

          <q-input outlined v-model="searchValue" label="名称/条码/助记码/简称" dense />
          </div>

          <q-btn color="primary" unelevated @click="getInquireType(goodsModel)">搜索</q-btn>
          <q-btn color="grey-6" unelevated @click="handleFormReset">重置</q-btn>
        </div>
        <div class="col-shrink q-px-xs full-height bg-grey-3">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham  ag-grid-table full-height hl_header_center hl_content_center goods-select-table"
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
        <div class="col-shrink bg-white q-pb-md">
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
  </q-page>
</template>
<script>

export default {
  components: {},
  data () {
    return {
      searchValue: '',
      specificationNewsData: [], // 默认数据源
      gridOptions: {},
      columnDefs: [
        {
          headerName: '',
          checkboxSelection: true, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          width: 50
        },
        // 表格列数据
        {
          headerName: '商品名称', // 列标题
          field: 'goo_name', // 列与数据源对应的字段
          filter: false, // 是否过滤
          width: 237,
          editable: true,
          onCellValueChanged: function (p) {
            const itemsToUpdate = []
            const data = p.data
            data.goo_name = Math.floor(Math.random() * 20000 + 20000)
            itemsToUpdate.push(data)

            const res = p.api.applyTransaction({ update: itemsToUpdate })
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
          headerName: '主规格',
          field: 'spec_main_name',
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
          headerName: '子规格',
          field: 'spec_son_name',
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
          headerName: '总库存',
          field: 'fss_quantity',
          filter: false,
          width: 158
        },
        {
          headerName: '分类',
          field: 'gt_name',
          filter: false,
          width: 185
        },

        {
          headerName: '售价',
          field: 'goo_listPrice',
          filter: false,
          width: 200
        },
        {
          headerName: '入库价',
          field: 'goo_purchasePrice',
          filter: false,
          width: 200
        },
        {
          headerName: '助记码',
          field: 'goo_pinYin',
          // cellRenderer: "showCellRenderer",
          filter: false,
          width: 200
        },
        {
          headerName: '条码',
          field: 'goo_code',
          filter: false,
          width: 200
        },
        {
          headerName: '简称',
          field: 'goo_nick',
          filter: false,
          width: 200
        }
      ],
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
      goodsModel: ''
    }
  },

  mounted () {
    this.getInquireType()
  },
  created () {

  },
  computed: {},
  methods: {

    rowSpan (params) {
      const fields = ['goo_name', 'spec_main_name']
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
    getInquireType () {
      const obj = {
        type: 1,
        text: this.searchValue,
        page: this.page.pageIndex,
        pageSize: this.page.pageSize
      }
      this.$store
        .dispatch('fooderp/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.specificationNewsData = res.data.list
            this.page.pageIndex = res.data.page.pageIndex
            this.page.pageSize = res.data.page.pageSize
            this.page.pageTotal = parseInt(res.data.page.totalCount)
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
