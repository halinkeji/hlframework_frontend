<template>
  <q-dialog v-model="activePrompt" full-height full-width>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.8 + 'px',
        'min-width': this.$q.screen.width * 0.8 + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="  q-ml-md q-mt-md">
          <div>
            <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
            选择菜品
          </div>
          <div class="row q-gutter-sm">
            <q-input class="col-12 col-md-2 " outlined v-model="searchValue" label="名称/条码/助记码/简称" dense />

            <q-btn color="primary" unelevated @click="getInquireType(goodsModel)">搜索</q-btn>
            <q-btn color="grey-6" unelevated @click="handleFormReset">重置</q-btn>
          </div>
        </div>
        <div class="col-shrink  full-height q-my-xs q-mx-md">
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
        <div class="col-shrink bg-white q-pb-md row q-gutter-md items-center  q-px-md">
          <q-btn class="q-px-xl" unelevated color="primary" @click="getSelectedTabel(true)" label="确认" />
          <q-btn class="q-px-xl" unelevated color="green" @click="getSelectedTabel(false)" label="确认并关闭" />
          <q-btn class="q-px-xl" unelevated color="grey" @click="closeDialog" label="关闭" />
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
        // {
        //   headerName: '总库存',
        //   field: 'gn_number',
        //   filter: false,
        //   width: 158
        // },
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

  mounted () {},
  created () {},
  computed: {},
  methods: {
    closeDialog () {
      this.activePrompt = false

      this.$emit('closeDialog')
    },

    getSelectedTabel (val) {
      const selectedRows = this.gridOptions.api.getSelectedRows()

      this.activePrompt = val

      this.$emit('getSelectedFoodsData', selectedRows, val)
      if (val) {
        this.getInquireType(this.goodsModel)
      }
    },

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
    getInquireType (val) {
      // vue 1实物服务 2套餐
      this.activePrompt = true
      this.goodsModel = val
      const obj = {
        type: val,
        text: this.searchValue,
        page: this.page.pageIndex,
        pageSize: this.page.pageSize
      }
      this.$store
        .dispatch('components/getListData', obj)
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

    // 选择商品后返回数据
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
