<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-lg">
      <!-- <div class=" row p-mt-sm">
        <q-chip square color="red" text-color="white" icon="report_problem" label="商品删除时商品套餐详情、充次套餐详情、库存数量也会随之删除，删除时请谨慎操作。" />
      </div> -->
      <div class="row q-gutter-xs items-center">
        <div class="col-12 col-md-4">
          <q-input outlined v-model="searchValue" label="名称/条码/助记码/简称" clearable dense />
        </div>
        <div class="col-12 col-md-4">
          <q-select
            class="col-12 col-md-2"
            outlined
            option-value="value"
            clearable
            option-label="label"
            emit-value
            map-options
            v-model="goodsOrService"
            :options="options"
            dense
            label="属性"
          />
        </div>

        <q-btn :to="{ name: 'addGoods' }" color="primary" unelevated v-if="authorityMeta('add')">添加商品</q-btn>
        <q-btn color="green" @click="batchImport()" unelevated v-if="authorityMeta('import')">Xlxs 文件批量导入</q-btn>
        <q-btn @click="exportBut" unelevated color="green" v-if="authorityMeta('export')">全部导出</q-btn>
        <q-btn @click="openCloudGoodsDialog" color="primary" unelevated>云商品库</q-btn>

        <q-btn color="red" :disable="dataListSelections.length > 0 ? false : true" unelevated @click="deleteBut()" v-if="authorityMeta('delAll')">批量删除</q-btn>
      </div>
      <div class="row q-gutter-xs q-mt-xs items-start">
        <div class="col-12 col-md-4">
          <hl-select-tree
            :list_width="400"
            @getItem="
              (item) => {
                goodsTypeId = item.id;
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
        <q-btn color="primary" unelevated @click="getGoodsNormalList()">搜索</q-btn>
        <q-btn color="grey-6" unelevated @click="emptySeacher()">重置</q-btn>
        <q-btn color="primary" class="q-mr-sm" unelevated label="属性字段设置" @click="showConfig" />
        <q-btn color="info" :disable="dataListSelections.length > 0 ? false : true" unelevated @click="printerBut()">批量打印</q-btn>
        <!-- <q-btn color="amber " :disable="dataListSelections.length > 0 ? false : true" unelevated @click="sendWxmall">批量发布到微信商城</q-btn> -->
      </div>
    </div>
    <upload-table-goods v-if="goodsUploadStatus" ref="returnTypes" @closeUpload="uploadTable"></upload-table-goods>
    <hl-cloud-goods-table ref="cloudGoodsDialogRef" v-if="cloudGoodsTableStatus" @closeDialog="closeCloudGoodsdDialog"></hl-cloud-goods-table>

    <show-config ref="addRef" v-if="addPoppupStatus" @closePoppup="getConfig"></show-config>
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
    <hl-local-printer ref="localPrinterRef" />
    <!-- <send-wxmall ref="sendGoodsRef" v-if="sendGoodsStatus" @getMethods="getGoodsNormalList"></send-wxmall> -->
    <edit-store-params v-if="storeParamsStatus" @setSuccess="closeStoreParams" @closePage="closeStoreParams" ref="editStoreParamsRef" />
  </div>
</template>
<script>
import AgGoodsOperating from './AgGoodsOperating.vue'
// import SendWxmall from 'pages/plugin/wxmall/goods/SendWxmall';
import EditStoreParams from './EditStoreParams.vue'
import ShowConfig from './ShowConfig.vue'
export default {
  name: 'GoodsNormalList',
  props: ['goodsTypeData'],
  components: {
    AgGoodsOperating,
    // SendWxmall,
    EditStoreParams,
    ShowConfig
  },
  data () {
    return {
      context: null,
      goodsUploadStatus: false,
      searchValue: '',
      goodsListData: [], // 默认数据源
      gridOptions: {},
      localeText: this.$ag_grid_localeText,
      components: {
        AgGoodsOperating: AgGoodsOperating
      },
      sendGoodsStatus: false,
      columnDefs: [
        // 表格列数据
        {
          checkboxSelection: true, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          width: 60,
          pinned: 'left',
          rowSpan: this.rowSpan,
          valueGetter: (p) => {
            return ' '
          },
          headerName: '',
          field: 'id',
          cellClassRules: {
            'cell-span-erp-number-view': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '#',
          width: 60,
          pinned: 'left',
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null
          }
        },
        {
          headerName: '排序',
          field: 'id',
          valueGetter: (p) => {
            return p.data.goo_sort
          },
          width: 100,
          editable: true,
          onCellValueChanged: this.changeSort,
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
          headerName: '名称', // 列标题
          width: 400,
          field: 'goo_name',
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
          field: 'goo_goodsOrService',
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
          field: 'goo_size',
          width: 150,
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
          field: 'goo_is_weigh',
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
          field: 'goodsType',
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
          field: 'goo_code',
          valueGetter: (p) => {
            return p.data.goo_code
          }
        },
        {
          headerName: '品牌',
          width: 237,
          field: 'band',
          valueGetter: (p) => {
            if (p.data.band) {
              return p.data.band.cp_name
            }
          }
        },
        {
          headerName: '商品层次',
          width: 237,
          field: 'priority',
          valueGetter: (p) => {
            if (p.data.priority) {
              return p.data.priority.cp_name
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
        },
        {
          headerName: '售价',
          field: 'goo_price',
          width: 150
        },
        {
          headerName: '采购成本利率',
          field: 'cg_gross_profit',
          width: 150
        },
        {
          headerName: '批发价',
          field: 'cg_wholesale_price',
          width: 150
        },
        {
          headerName: '二级成本利率',
          field: 'cg_secondary_gross_profit',
          width: 150
        },
        {
          headerName: '单位',
          field: 'goodsUnit',
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
          field: 'goo_pinYin',
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
          field: 'goo_nick',
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
          headerName: '保质期',
          field: 'cg_shelf_life_days',
          valueGetter: (p) => {
            return p.data.cg_shelf_life_days
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
          headerName: '主供货商',
          field: 'cgc_supplier_id',
          valueGetter: (p) => {
            return (
              p.data.goodsCode &&
              p.data.goodsCode.id &&
              p.data.goodsCode.erpSupplier &&
              p.data.goodsCode.erpSupplier.id &&
              p.data.goodsCode.erpSupplier.ces_name
            )
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
          headerName: '状态',
          field: 'id',
          pinned: 'right',
          width: 100,
          valueGetter: function (p) {
            // if (p.data.goodsStore && p.data.goodsStore.id) {
            //   return parseInt(p.data.goodsStore.gs_status) == 1 ? '上架' : '下架'
            // }
            return parseInt(p.data.goo_status) == 1 ? '上架' : '下架'
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
      addPoppupStatus: false,
      showGoodsList: false,
      dataListSelections: [],
      goodsUnitList: [],
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
      libInStoreList: [],
      configShowData: [],
      cloudGoodsTableStatus: false
    }
  },
  mounted () {
    this.context = this
    this.getGoodsNormalList()
  },
  created () {
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
    this.getConfig()
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    openCloudGoodsDialog () {
      this.cloudGoodsTableStatus = true
      this.$nextTick(() => {
        this.$refs.cloudGoodsDialogRef.init()
      })
    },
    closeCloudGoodsdDialog () {
      this.cloudGoodsTableStatus = false
      this.$nextTick(() => {
        this.getGoodsNormalList()
      })
    },
    getConfig () {
      this.$store
        .dispatch('goods/getConfig')
        .then((res) => {
          if (res.code == 200) {
            if (res.data.configData && res.data.configData.length > 0) {
              this.configShowData = res.data.configData
              this.gridOptions.api.setColumnDefs([])
              this.$nextTick(() => {
                const columnDefs = this.columnDefs
                const configShowData = this.configShowData.map((x) => {
                  return x.headerName
                })
                const newAgColumnDefs = [
                  {
                    checkboxSelection: true,
                    headerCheckboxSelectionFilteredOnly: true,
                    headerCheckboxSelection: true,
                    width: 60,
                    rowSpan: this.rowSpan,
                    valueGetter: (p) => {
                      return ' '
                    },
                    headerName: '',
                    field: 'id',
                    cellClassRules: {
                      'cell-span-erp-number-view': function (p) {
                        if (p.value) {
                          return true
                        }
                      }
                    }
                  }
                ]
                columnDefs.forEach(function (value) {
                  if (_.indexOf(configShowData, value.headerName) >= 0) {
                    newAgColumnDefs.push(value)
                  }
                })

                newAgColumnDefs.push({
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
                })

                this.gridOptions.api.setColumnDefs(newAgColumnDefs)
              })
            } else {
              this.gridOptions.api.setColumnDefs([])
              this.gridOptions.api.setColumnDefs(this.columnDefs)
            }
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    showConfig () {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addRef.showConfig()
      })
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },

    // 获取商品列表
    getGoodsNormalList () {
      this.dataListSelections = {}
      const obj = {
        type: 1,
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
      this.getGoodsNormalList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getGoodsNormalList()
    },
    // 批量导入
    batchImport () {
      this.goodsUploadStatus = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.returnTypes.receiveType('goods')
        }, 500)
      })
    },
    uploadTable () {
      this.goodsUploadStatus = false
      this.getGoodsNormalList()
    },
    // 导出
    exportBut () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-商品信息'
      })
    },
    // 批量删除
    deleteBut () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return { id: item.id, goo_status: 2 }
        })
        this.$store
          .dispatch('goods/allupdate', obj)
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
              this.getGoodsNormalList()
            }
          })
          .catch((error) => {})
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
    },
    emptySeacher () {
      this.searchValue = ''
      this.goodsTypeId = ''
      this.goodsOrService = ''
      this.selectStoreData = []
      this.$refs.selectTreeRef.resetValueData()
      this.getGoodsNormalList()
    },

    // 排序并加限制
    changeSort (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^\+?[0-9][0-9]*$/

      if (!regu.test(data.goo_sort)) {
        this.$q.notify({
          message: '错误',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        data.goo_sort = p.oldValue
        itemsToUpdate.push(data)
        const res = p.api.applyTransaction({ update: itemsToUpdate })
        return false
      }
      const obj = {
        goo_sort: data.goo_sort,
        id: data.id
      }
      this.$store.dispatch('goods/addData', obj).then((res) => {
        if (res.code == 200) {
          this.$q.notify({
            message: '成功',
            caption: '修改排序成功',
            color: 'green',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
          this.getGoodsNormalList()
        }
      })
    },
    sendWxmall () {
      this.sendGoodsStatus = true
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.$nextTick(() => {
          this.$refs.sendGoodsRef.getGoods(obj)
        })
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
        this.getGoodsNormalList()
      })
    },
    rowSpan (params) {
      const fields = ['id', 'goo_name', 'goodsType', 'goo_code', 'goodsUnit', 'goo_pinYin', 'goo_nick', 'goo_status']
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
    printerBut () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.printerGoods({ goodsData: obj })
      }
    },
    printerGoods (goodsData) {
      const that = this
      that.$store.dispatch('cloudprinter/getGoodsLableTemple', goodsData).then((res) => {
        if (res.code == 200 && res.data && res.data.length > 0) {
          const goodsLabel = res.data
          _.forEach(goodsLabel, function (value, key) {
            console.log('aa', value)
            setTimeout(() => {
              that.$refs.localPrinterRef.startPrinter(value)
            }, 50)
          })
        }
      })
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
