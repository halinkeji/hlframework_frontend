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
        <div class="q-ml-md q-mt-md">
          <div>
            <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
            选择商品
          </div>
          <div class="row">
            <div class="col-2">
              <q-input outlined v-model="searchValue" label="名称/条码/助记码/简称" dense />
            </div>

            <q-btn color="primary" unelevated @click="getInquireType(goodsModel, supplierId)">搜索</q-btn>
            <q-btn color="grey-6" unelevated @click="handleFormReset">重置</q-btn>
          </div>
        </div>
        <div class="col-shrink full-height q-my-xs q-mx-md">
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
        <div class="col-shrink bg-white q-pb-md row q-gutter-md items-center q-px-md">
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
import XEUtils from 'xe-utils'
import PictureItem from './AgPictureItem'
export default {
  components: {
    PictureItem
  },
  data () {
    return {
      searchValue: '',
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
          field: 'goo_name',
          filter: false,
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
          headerName: '规格名称',
          field: 'specificationName',
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
          headerName: '封面图',
          field: 'mcl_cover_image',
          cellRendererFramework: 'PictureItem',
          width: 80
        },
        {
          headerName: '起订数',
          field: 'cg_minimum_order',
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
          field: 'goo_price',
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
      goodsModel: '',
      supplierId: ''
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
      this.$emit('getSelectedGoodsData', selectedRows)
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

    // 选择商品开启弹窗调取数据
    getInquireType (val, supplierId = null) {
      // vue 1实物服务 2套餐
      this.activePrompt = true
      this.goodsModel = val
      this.supplierId = supplierId
      const obj = {
        type: val,
        text: this.searchValue,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        supplierId: supplierId
      }
      this.$store
        .dispatch('erpDirect/getListErpData', obj)
        .then((res) => {
          if (res.code == 200) {
            // this.specificationNewsData = res.data.list;
            this.toColTreeData(res.data.list)
            this.page.pageIndex = res.data.page.pageIndex
            this.page.pageSize = res.data.page.pageSize
            this.page.pageTotal = parseInt(res.data.page.totalCount)
          }
        })
        .catch((error) => {})
    },
    // 转换横向树结构
    toColTreeData (specificationNewsData) {
      const options = { children: 'children' }
      const list = []
      const keyMap = {}
      XEUtils.eachTree(
        specificationNewsData,
        (item, index, result, paths, parent) => {
          keyMap[item.id] = item
          item.keys = parent ? parent.keys.concat([item.id]) : [item.id]
          item.keysId = ',' + item.id

          if (!item.children || !item.children.length) {
            const row = {}
            item.keys.forEach((key, index, v) => {
              const obj = keyMap[key]

              if (obj.goods_id > 0 || obj.goods_id) {
                row.id = obj.id
                row.goods_id = obj.goods_id
                row.specificationName = obj.sl_title
                row.goo_price = obj.sl_sellingPrice
                row.gn_number = obj.gn_number
                row.goo_code = obj.sl_barCode
                row.goo_type = 2
                row.totalCost = obj.sl_markedPrice
                row.storagePrice = obj.sl_warehousingPrice
                row.goodsTypeId = obj.goodsTypeId
              } else {
                row.id = 0
                row.goods_id = obj.id
                row.goo_name = obj.goo_name
                row.goo_pinYin = obj.goo_pinYin
                row.gt_name = obj.gt_name
                row.goo_code = obj.goo_code
                row.goo_nick = obj.goo_nick
                row.goo_cover_image = obj.goo_cover_image
                if (obj.goodsType) {
                  if (obj.goodsType.gt_name) {
                    row.gt_name = obj.goodsType.gt_name
                  }
                }
                row.goo_price = obj.goo_price
                row.gn_number = obj.gn_number
                row.goo_type = 1
                row.totalCost = obj.goo_price
                row.storagePrice = obj.goo_purchasePrice
                row.goodsTypeId = obj.goodsTypeId
                row.cg_minimum_order = obj.cg_minimum_order
                row.cg_direct_set = obj.cg_direct_set
              }

              row.frequency = row.cg_minimum_order
              row.edd_type = row.cg_direct_set
              row.limitTimes = 0
              row.limitStatus = true
              row.limitCycle = '1'
              row.originalPrice = row.totalCost
              row.quantity = 1
              row.discount = 100 // 折扣率
              row.discountAmount = row.storagePrice * row.frequency - row.storagePrice * (row.discount * 0.01) // 折扣金额
              row.quantity = row.storagePrice - row.storagePrice * (row.discount * 0.01) // 购货金额
              row.purchaseAmount = row.storagePrice * row.frequency // 折扣金额
            })
            list.push(row)
          }
        },
        options
      )

      this.specificationNewsData = list
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getInquireType(this.goodsModel, this.supplierId)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getInquireType(this.goodsModel, this.supplierId)
    },
    // 查询
    handleFormSearchSubmit () {
      this.getInquireType(this.goodsModel, this.supplierId)
    },
    // 重置
    handleFormReset () {
      this.searchValue = ''
      this.getInquireType(this.goodsModel, this.supplierId)
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
