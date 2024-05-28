<template>
  <q-dialog @hide="hideNowPage" v-model="goodsStatus" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.8 + 'px',
        'min-width': this.$q.screen.width * 0.8 + 'px',
      }"
    >
      <q-card-section class="row items-center">
        <div class="text-h6">选择商品</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <div class="row  q-ml-md">
        <q-input class="col-12 col-md-2 q-mt-sm" outlined v-model="searchValue" label="名称/条码/助记码/简称" dense />

        <q-btn color="primary" class=" q-mt-sm q-mx-md" unelevated @click="getInquireType()">搜索</q-btn>
        <q-btn color="grey-6" unelevated @click="handleFormReset" class="q-mt-sm q-mr-md">重置</q-btn>
      </div>
      <div style="height:518px" class="q-pa-md">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="specificationNewsData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          @first-data-rendered="onFirstDataRendered"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="45"
          :context="context"
          :localeText="localeText"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :suppressRowTransform="true"
        ></ag-grid-vue>
      </div>
      <div class="q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import AgOperate from './AgOperate'
export default {
  components: {
    AgOperate
  },
  data () {
    return {
      searchValue: '',
      context: '',
      specificationNewsData: [], // 默认数据源
      gridOptions: {},
      selectedGoodsData: {},
      columnDefs: [
        // 表格列数据
        {
          headerName: '商品名称', // 列标题
          field: 'goo_name', // 列与数据源对应的字段
          filter: false, // 是否过滤
          width: this.nowpx(0.2) + 'px',
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
          width: this.nowpx(0.14) + 'px',
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
          field: 'goo_price',
          filter: false,
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '助记码',
          field: 'goo_pinYin',
          filter: false,
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '分类',
          field: 'gt_name',
          filter: false,
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '条码',
          field: 'goo_code',
          filter: false,
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '简称',
          field: 'goo_nick',
          filter: false,
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '操作',
          cellRendererFramework: 'AgOperate',
          width: this.nowpx(0.11) + 'px'
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
        pageSize: 10,
        pageTotal: 0
      },
      goodsStatus: false,
      goodsModel: ''
    }
  },
  created () {
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
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
    getInquireType () {
      this.goodsStatus = true
      this.goodsModel = 2
      const obj = {
        type: 2,
        text: this.searchValue,
        page: this.page.pageIndex,
        pageSize: this.page.pageSize
      }
      this.$store
        .dispatch('components/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.specificationNewsData = res.data.list
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getInquireType()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getInquireType()
    },
    // 重置
    handleFormReset () {
      this.searchValue = ''
      this.getInquireType()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 274
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
    hideNowPage () {
      if (this.selectedGoodsData.id > 0) {
        this.$emit('dataList', this.selectedGoodsData)
      } else {
        this.$emit('dataList')
      }
    }
  }
}
</script>
