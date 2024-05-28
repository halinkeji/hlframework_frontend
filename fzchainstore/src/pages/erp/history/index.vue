<template>
  <q-page class="fit">
    <div class=" fit column no-wrap justify-between items-stretch content-stretch no-scroll  ">
      <div class="col-shrink bg-white q-px-sm q-pb-lg q-gutter-x-xs row">
        <div class="col-12 col-md-2">
          <q-input outlined v-model="searchNumber" label="商品名称/编码/助记码/简称" dense />
        </div>
        <div class="col-12 col-md-2" v-if="is_main_store">
          <q-select
            outlined
            option-value="id"
            option-label="cd_name"
            emit-value
            map-options
            v-model="depot_id"
            :options="depotData"
            dense
            label="仓库"
          />
        </div>
        <div class="col-12 col-md-2">
          <hl-select-tree
          :list_width="400"
          @getItem="changeGoodsType"
          @resetValue="goodsTypeId = ''"
          :dataList="goodsTypedata"
          textName="请选择分类"
          :inputLabel="'gt_name'"
          :inputValue="'id'"
          :showValue="goodsTypeId"
          ref="goodsTypeRef"
          :bottomSlots="1"
        />
        </div>

        <div class="col-12 col-md-2">
          <q-input outlined readonly dense v-model="warningTime" label="选择日期">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="warningTime" mask="YYYY-MM-DD">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat @click="getList()" />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-btn color="primary" unelevated label="搜索" @click="getList" />
        <q-btn color="warning" @click="resetCondition" unelevated label="重置" />
        <q-btn color="primary" unelevated @click="countExport" label="导出Xsl文件" :disable="specificationNewsData.length == 0" />
      </div>
      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table erp-number-table hl_header_center hl_content_center full-height "
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
export default {
  name: 'history',
  components: {
    AgButton
  },
  data () {
    return {
      activeName: '0',
      goodsTypedata: [],
      components: { AgButton },
      gridOptions: {},
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
          headerName: '尺寸',
          field: 'cad_size_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '吊牌价',
          field: 'cad_price',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '库存',
          field: 'edn_number',
          filter: false,
          width: this.nowpx(0.07) + 'px'
        },

        {
          headerName: '可用',
          field: 'edn_number',
          filter: false,
          width: this.nowpx(0.05) + 'px'
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
        }
        // {
        //   headerName: '操作',
        //   filter: false,
        //   cellRendererFramework: 'AgButton',
        //   rowSpan: this.rowSpan,
        //   width: this.nowpx(0.04) + 'px',
        //   cellClassRules: {
        //     'cell-span-erp-number': function(p) {
        //       if (p.value) {
        //         return true;
        //       }
        //     },
        //   },
        // },
      ],
      specificationNewsData: [], // 默认数据源
      selected: [],
      searchNumber: '',
      goodsTypeId: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      localeText: this.$ag_grid_localeText,
      context: null,
      warningTime: '',
      dataListSelections: [],
      depot_id: ''
    }
  },

  mounted () {
    this.getList()
  },
  created () {
    this.context = this
    this.getDepotList()
    this.getGoodsType()
    // if (this.is_main_store) {
    //   this.getLibInStoreData()
    // }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
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
    getWarning () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return {
            main_goods_id: item.main_goods_id,
            main_spe_id: item.main_spe_id
          }
        })
        this.$refs.child.setWarning(obj)
      }
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
      let startTime = ''
      startTime = this.$q_date.formatDate(this.warningTime, 'X')
      console.log('aa', startTime)
      this.dataListSelections = []
      const obj = {
        inType: 1,
        startTime: startTime,
        type: this.goodsTypeId,
        text: this.searchNumber,
        depot_id: this.depot_id,
        ...this.page
      }
      this.$store
        .dispatch('erphistory/getListDataHeng', obj)
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
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    resetCondition () {
      this.searchNumber = ''
      this.depot_id = ''
      this.goodsTypeId = ''
      this.warningTime = ''
      this.$refs.goodsTypeRef.resetValueData()
      this.$nextTick(() => {
        this.getList()
      })
    },

    countExport () {
      this.$q
        .dialog({
          title: '设置导出范围',
          message: '导出范围示例：1-1000',
          prompt: {
            model: '',
            outlined: true,
            isValid: (val) => !!val,
            type: 'text'
          },
          cancel: true,
          persistent: true
        })
        .onOk((data) => {
          let startTime = ''
          startTime = this.$q_date.formatDate(this.warningTime, 'X')
          this.dataListSelections = []
          const obj = {
            inType: 1,
            limit: data,
            startTime: startTime,
            type: this.goodsTypeId,
            text: this.searchNumber,
            depot_id: this.depot_id
          }

          this.$store
            .dispatch('exports/getHistoryExport', obj)
            .then((res) => {
              if (res.code == 200) {
                window.location.href = res.data
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
            .catch((error) => {})
        })
        .onCancel(() => {})
    },

    changeGoodsType (item) {
      this.goodsTypeId = item.id
    },

    authorityMeta (key) {
      return true
      // if (this.$route.meta) {
      //   const newArr = this.$route.meta.map((obj) => {
      //     return obj.id
      //   })
      //   if (newArr.indexOf(key) >= 0) {
      //     return true
      //   }
      // }
      // return false
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
