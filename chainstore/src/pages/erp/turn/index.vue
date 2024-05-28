<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm">
        <div class="q-gutter-xs row ">
          <q-input outlined dense class="col-12 col-sm-2" clearable v-model="text" label="调拨单据号" />
          <div class=" col-12 col-md-4 ">
            <q-select label="查询调入门店" use-chips clearable v-model="selectStoreData" option-value="id" option-label="name" multiple emit-value map-options dense outlined :options="libInStoreList" />
          </div>
          <div class=" col-12 col-md-4 ">
            <q-select label="查询调出门店" use-chips clearable v-model="selectInStoreData" option-value="id" option-label="name" multiple emit-value map-options dense outlined :options="libInStoreList" />
          </div>
          <q-btn color="primary"  unelevated  @click="getStockList" label="搜索" />
          <q-btn color="warning" @click="clearBut()"   unelevated label="重置" />
          <q-btn color="primary"  :to="{ name: 'addTurn' }" unelevated v-if="authorityMeta('add')" label="新增" />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="inListData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :context="context"
          :localeText="localeText"
          @first-data-rendered="adaptiveTable"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="60"
          rowSelection="multiple"
          @rowSelected="rowSelectedAg"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
    </div>
    <detail-data ref="itemDataRef" @colseDetailDialog="colseDetailDialog" v-if="addStockStatus" @dataList="getStockList" />
  </q-page>
</template>
<script>
import DetailData from './components/DetailData.vue'
import AgButton from './components/AgButton.vue'
export default {
  name: 'erpTurn',
  components: {
    AgButton,
    DetailData
  },
  data () {
    return {
      addStockStatus: false,
      text: '',
      current: 1,
      context: '',
      gridOptions: {},
      dataListSelections: [],
      inListData: [],
      columnDefs: [
        {
          headerName: '调拨单据号',
          field: 'gii_inventoryInCode',
          width: this.nowpx(0.22) + 'px'
        },
        {
          headerName: '调入门店',
          field: 'inStore.name',
          width: this.nowpx(0.22) + 'px'
        },
        {
          headerName: '调出门店',
          field: 'store.name',
          width: this.nowpx(0.22) + 'px'
        },
        {
          headerName: '状态',
          field: 'gii_status',
          valueGetter: (p) => {
            if (parseInt(p.data.gii_status) == 1) {
              return '已完成'
            } else if (parseInt(p.data.gii_status) == 2) {
              return '待入库'
            } else {
              return '错误'
            }
          },
          width: this.nowpx(0.22) + 'px'
        },
        {
          headerName: '调拨时间',
          field: 'gg_addTime',
          valueGetter: this.timeShow,
          width: this.nowpx(0.22) + 'px'
        },
        {
          headerName: '操作员',
          field: 'user.username',
          width: this.nowpx(0.22) + 'px'
        },

        {
          headerName: '操作',
          cellRendererFramework: 'AgButton',
          width: this.nowpx(0.22) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      libInStoreList: [],
      selectStoreData: [],
      selectInStoreData: []
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {
    this.context = this
    this.getLibInStoreData()
  },
  mounted () {
    this.getStockList()
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'otherAll' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    timeShow (p) {
      return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
    },
    getStockList () {
      const obj = {
        code: this.text,
        selectStoreData: this.selectStoreData,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        selectInStoreData: this.selectInStoreData
      }
      this.$store
        .dispatch('erpTurn/getTurnData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.inListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.dataListSelections = []
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
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getStockList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getStockList()
    },

    clearBut () {
      this.text = ''
      this.selectStoreData = []
      this.selectInStoreData = []
      this.getStockList()
    }, // 重置按钮方法
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    showPopup (id) {
      this.addStockStatus = true
      this.$nextTick(() => {
        this.$refs.itemDataRef.init(id)
      })
    }, // 显示弹窗方法
    getDataList () {
      this.addStockStatus = false
      this.getStockList()
    }, // 隐藏弹窗方法
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 550
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    colseDetailDialog () {
      this.addStockStatus = false
      this.getStockList()
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
