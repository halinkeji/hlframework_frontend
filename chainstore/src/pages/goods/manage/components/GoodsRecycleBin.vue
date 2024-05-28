<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-lg">
      <!-- <div class=" row p-mt-sm">
        <q-chip square color="red" text-color="white" class=" q-mt-sm" icon="report_problem" label="回收站中删除商品后无法撤回，请谨慎操作。" />
      </div> -->
      <div class="row  q-gutter-sm items-start">
        <q-input class="col-12 col-md-4" clearable outlined v-model="searchValue" label="名称/条码/助记码/简称" dense />

        <div class="col-12 col-md-4">
          <hl-select-tree
            :list_width="400"
            @getItem="
              (item) => {
                goodsTypeId = item.id
              }
            "
            @resetValue="goodsTypeId = ''"
            :dataList="goodsTypeData"
            textName="请选择分类"
            :inputLabel="'gt_name'"
            :inputValue="'id'"
            :showValue="goodsTypeId"
            ref="selectTreeRef"
          />
        </div>
       <q-btn @click="exportBut" unelevated color="green"  v-if="authorityMeta('exportRecy')">全部导出</q-btn>
        <q-btn @click="batchRecovery()" unelevated color="green" v-if="authorityMeta('restoreAll')">批量恢复</q-btn>
        <q-btn color="red" :disable="dataListSelections.length > 0 ? false : true"  unelevated v-if="authorityMeta('delAllRecy')" @click="deleteBut()">批量删除</q-btn>
      </div>
      <div class="row q-mt-xs q-gutter-sm items-start">
         <div class="col-12 col-md-4">
          <q-select  outlined option-value="value" clearable option-label="label" emit-value map-options v-model="goodsOrService" :options="options" dense label="属性" />
        </div>
        <div class="col-12 col-md-4" v-if="is_main_store">
          <q-select
            label="查询门店"
            v-model="selectStoreData"
            option-value="id"
            option-label="name"
            multiple
            emit-value
            map-options
            dense
            outlined
            clearable
            use-chips
            :options="libInStoreList"
          />
        </div>
        <q-btn color="primary"  unelevated @click="getGoodsRecycleBin()">搜索</q-btn>
        <q-btn color="grey-6" unelevated @click="emptySeacher()">重置</q-btn>

      </div>
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table erp-table-number-view hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :components="components"
        :defaultColDef="defaultColDef"
        :suppressMovableColumns="true"
        rowSelection="multiple"
        :rowData="goodsListData"
        :gridOptions="gridOptions"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        :suppressRowTransform="true"
        :suppressCellSelection="true"
        :localeText="localeText"
        @rowSelected="rowSelectedAg"
        :stopEditingWhenGridLosesFocus="true"
         :suppressRowClickSelection="true"
        :rowMultiSelectWithClick="true"
        :singleClickEdit="true"
        :context="context"
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
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>
    <edit-store-params v-if="storeParamsStatus" @setSuccess="closeStoreParams"  @closePage="closeStoreParams" ref="editStoreParamsRef" />
  </div>
</template>
<script>
import AgGoodsOperating from './AgGoodsOperating.vue'
import EditStoreParams from './EditStoreParams.vue'
export default {
  name: 'GoodsNormalList',
  props: ['goodsTypeData'],
  components: {
    AgGoodsOperating,
    EditStoreParams
  },
  data () {
    return {
      context: null,
      searchValue: '',
      goodsListData: [], // 默认数据源
      gridOptions: {},
      dataListSelections: [],
      localeText: this.$ag_grid_localeText,
      components: {
        AgGoodsOperating: AgGoodsOperating
      },
      columnDefs: [
        // 表格列数据
        {
          checkboxSelection: true, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          width: 60,
          rowSpan: this.rowSpan,
          field: 'id',
          valueGetter: (p) => {
            return ' '
          },
          headerName: '',
          cellClassRules: {
            'cell-span-erp-number-view': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '名称', // 列标题
          width: 400,
          field: 'id',
          valueGetter: (p) => {
            return p.data.goo_name
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number-view': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '属性',
          field: 'id',
          width: 120,
          valueGetter: (p) => {
            switch (parseInt(p.data.goo_goodsOrService)) {
              case 1:
                return '实物'
              case 2:
                return '服务'
              case 3:
                return '套餐'
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number-view': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '规格',
          field: 'id',
          width: 180,
          valueGetter: (p) => {
            if (parseInt(p.data.goo_size) == 1) {
              return '启用'
            } else {
              return '关闭'
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number-view': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '称重',
          field: 'id',
          width: 120,
          valueGetter: (p) => {
            if (parseInt(p.data.goo_is_weigh) == 1) {
              return '开启'
            } else {
              return '关闭'
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number-view': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '分类',
          field: 'id',

          width: 237,
          valueGetter: (p) => {
            if (p.data.goodsType) {
              return p.data.goodsType.gt_name
            } else {
              return '无'
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number-view': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '条码',
          width: 237,
          field: 'id',
          valueGetter: (p) => {
            return p.data.goo_code
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number-view': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },

        {
          headerName: '入库价',
          field: 'goo_purchasePrice',
          width: 150
        },
        {
          headerName: '标价',
          field: 'goo_listPrice',
          width: 150
          // valueGetter: function (p) {
          //   if (p.data.goodsStore && p.data.goodsStore.id) {
          //     return p.data.goodsStore.gs_list_price
          //   }
          //   return p.data.goo_listPrice
          // }
        },
        {
          headerName: '售价',
          field: 'goo_price',
          width: 150
          // valueGetter: function (p) {
          //   if (p.data.goodsStore && p.data.goodsStore.id) {
          //     return p.data.goodsStore.gs_price
          //   }
          //   return p.data.goo_price
          // }
        },
        {
          headerName: '单位',
          field: 'id',
          width: 180,
          valueGetter: (p) => {
            if (p.data.goodsUnit) {
              return p.data.goodsUnit.gu_name
            } else {
              return '无'
            }
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number-view': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '助记码',

          width: 237,
          field: 'id',
          valueGetter: (p) => {
            return p.data.goo_pinYin
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number-view': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '简称',
          field: 'id',
          valueGetter: (p) => {
            return p.data.goo_nick
          },
          width: 237,
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number-view': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },

        {
          headerName: '操作',
          field: 'id',
          cellRendererFramework: 'AgGoodsOperating',
          pinned: 'right',
          width: 300,
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-number-view': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      goodsTypeId: '',
      options: [
        {
          label: '实物商品',
          value: 1
        },
        {
          label: '服务商品',
          value: 2
        }
      ],
      goodsOrService: '',
      storeParamsStatus: false,
      selectStoreData: [],
      libInStoreList: []
    }
  },
  mounted () {
    this.context = this
    this.getGoodsRecycleBin()
  },
  created () {
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    // 获取商品列表
    getGoodsRecycleBin () {
      const obj = {
        type: 2,
        text: this.searchValue,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        goodsTypeId: this.goodsTypeId,
        goodsOrService: this.goodsOrService,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('goods/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.goodsListData = res.data.list
          }
        })
        .catch((error) => {})
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getGoodsRecycleBin()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getGoodsRecycleBin()
    },

    // 导出
    exportBut () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-商品回收站记录'
      })
    },
    // 批量删除
    deleteBut () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.$store
          .dispatch('goods/delData', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功删除 ' + res.data + ' 条！',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
              this.dataListSelections = []
              this.$nextTick(() => {
                this.getGoodsRecycleBin()
              })
            }
          })
          .catch((error) => {})
      }
    },
    emptySeacher () {
      this.searchValue = ''
      this.goodsTypeId = ''
      this.goodsOrService = ''
      this.selectStoreData = []
      this.$refs.selectTreeRef.resetValueData()
      this.getGoodsRecycleBin()
    },
    // 批量恢复
    batchRecovery () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return { id: item.id, goo_status: 1 }
        })
        this.$store
          .dispatch('goods/allupdate', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功恢复 ' + res.data + ' 条！',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                timeout: 500,
                position: 'top-right'
              })
              this.getGoodsRecycleBin()
            }
          })
          .catch((error) => {})
      }
    },
    setStoreGoodsParams (mainGoodsId, parasmId, goodsSize) {
      this.storeParamsStatus = true
      this.$nextTick(() => {
        this.$refs.editStoreParamsRef.init(mainGoodsId, parasmId, goodsSize)
      })
    },
    closeStoreParams () {
      this.storeParamsStatus = false
      this.$nextTick(() => {
        this.getGoodsRecycleBin()
      })
    },
    rowSpan (params) {
      const fields = ['id']
      const data = this.goodsListData
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
<style>
.erp-table-number-view .cell-span-erp-number-view {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
