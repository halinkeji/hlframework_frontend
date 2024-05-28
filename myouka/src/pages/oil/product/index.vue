<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row q-pa-sm q-gutter-sm">
          <div class="col-md-2 col-12 q-pt-none">
            <q-input outlined bottom-slots v-model="search" dense class="q-py-none" label="请输入油品名称"> </q-input>
          </div>
          <div class="col-12 col-md-4 q-mt-sm" v-if="is_main_store">
            <q-select
              label="查询油站"
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
          <q-btn unelevated color="primary" @click="getList()" label="搜索" class="q-px-lg" />
          <q-btn unelevated color="amber" label="重置" class="q-px-lg" @click="clearnBut()" />
          <q-btn unelevated color="primary" label="新增" v-if="authorityMeta('add')" class="q-px-lg" @click="addProduckDialog(0)" />
          <q-btn
            unelevated
            color="red"
            v-if="authorityMeta('delAll')"
            label="批量删除"
            :disabled="dataListSelections.length > 0 ? false : true"
            class="q-px-md"
            @click="delAll()"
          />
        </div>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :defaultColDef="defaultColDef"
          @first-data-rendered="adaptiveTable"
          :rowData="oilProductlList"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          rowHeight="40"
          :floatingFilter="false"
          @rowSelected="rowSelectedAg"
          :enableCellTextSelection="true"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :suppressRowTransform="true"
          :localeText="localeText"
          :context="context"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pSize"
          :total="page.totalCount"
        ></hl-pagination>
      </div>
    </div>
    <add-oil-product ref="editDialogRef" @colseDialog="colsePriductDialog" v-if="editDialogStatus" />
  </q-page>
</template>

<script>
import AgUse from './components/AgUse'
import AddOilProduct from './components/AddOilProduct'
export default {
  name: 'oil',
  components: { AgUse, AddOilProduct },
  data () {
    return {
      dataListSelections: [],
      search: '',
      defaultColDef: {},
      context: null,
      localeText: this.$ag_grid_localeText,
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      columnDefs: [
        // 表格列数据
        {
          checkboxSelection: true, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '油品名称', // 列标题
          field: 'op_name', // 列与数据源对应的字段
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '状态',
          field: 'storeConfig.osc_status',
          filter: false,
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            if (p.data && p.data.storeConfig && parseInt(p.data.storeConfig.osc_status) == 1) {
              return '开启'
            }
            if (p.data && p.data.storeConfig && parseInt(p.data.storeConfig.osc_status) == 0) {
              return '关闭'
            }
            return p.data.storeConfig
          }
        },
        {
          headerName: '会员价',
          field: 'storeConfig.osc_is_member_price',
          filter: false,
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            if (p.data && p.data.storeConfig && parseInt(p.data.storeConfig.osc_is_member_price) == 1) {
              return '开启'
            }
            if (p.data && p.data.storeConfig && parseInt(p.data.storeConfig.osc_is_member_price) == 2) {
              return '关闭'
            }
            return '未设置'
          }
        },
        {
          headerName: '会员价模式',
          field: 'storeConfig.osc_member_price_type',
          filter: false,
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            if (p.data && p.data.storeConfig && parseInt(p.data.storeConfig.osc_is_member_price) == 1) {
              if (p.data && p.data.storeConfig && parseInt(p.data.storeConfig.osc_member_price_type) == 1) {
                return '等级折扣/积分比例'
              } else {
                return '会员价/积分换算'
              }
            }
            return '未设置'
          }
        },

        {
          headerName: '当前库存/升',
          field: 'storeConfig.osc_stock',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '创建油站',
          field: 'store.name',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'AgUse',
          width: this.nowpx(0.2) + 'px'
        }
      ],
      gridOptions: {},
      oilProductlList: [],
      editDialogStatus: false,
      selectStoreData: [],
      libInStoreList: []
    }
  },
  mounted () {
    this.getList()
  },
  created () {
    this.context = this
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
    addProduckDialog (productId) {
      this.editDialogStatus = true

      this.$nextTick(() => {
        this.$refs.editDialogRef.init(productId)
      })
    },
    colsePriductDialog () {
      this.editDialogStatus = false

      this.$nextTick(() => {
        this.getList()
      })
    },

    getList () {
      this.dataListSelections = []
      const obj = {
        search: this.search,
        selectStoreData: this.selectStoreData,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('product/getData', obj)
        .then((res) => {
          if (parseInt(res.code) == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.oilProductlList = res.data ? res.data.list : []
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
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 个油品信息吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
    },
    deleteRecord () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.$store.dispatch('product/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 个油品信息'
            })
            this.getList()
          }
        })
      }
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
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    clearnBut () {
      this.search = ''
      this.selectStoreData = []
      this.getList()
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

<style></style>
