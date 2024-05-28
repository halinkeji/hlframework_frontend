<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row q-gutter-x-sm">
          <q-input class=" col-12 col-md-3 q-mt-sm" clearable label="可搜索套餐名称\简称\条码\助记码" outlined v-model="goodsPackageorm.text" dense />
          <q-select
            class="col-12 col-md-2 q-mt-sm"
            outlined
            option-value="id"
            option-label="gt_name"
            emit-value
            map-options
            v-model="goodsPackageorm.type"
            :options="goodsTypeData"
            dense
            label="请选择商品套餐分类"
            clearable
          />

          <q-btn @click="getGoodsPackageList()" color="primary" class=" q-mt-sm" unelevated  label="搜索" />
          <q-btn @click="clearBut()" color="warning" class=" q-mt-sm"  unelevated label="重置" />
          <q-btn :to="{ name: 'AddPackage' }" color="primary" class=" q-mt-sm" unelevated v-if="authorityMeta('add')" label="新增" />
          <q-btn :disable="dataListSelections.length > 0 ? false : true" @click="delAll()" v-if="authorityMeta('delAll')" color="red" class=" q-mt-sm" unelevated label="批量删除" />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="goodsListData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          :localeText="localeText"
          :gridOptions="gridOptions"
          @rowSelected="rowSelectedAg"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.page"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pSize"
          :total="page.pageTotal"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
    </div>
  </q-page>
</template>
<script>
import AgPackageOperating from './components/AgPackageOperating.vue'

export default {
  name: 'GoodsNormalList',
  components: {
    AgPackageOperating
  },
  data () {
    return {
      context: null,
      activeName: 0,
      searchValue: '',
      goodsListData: [], // 默认数据源
      gridOptions: {},
      components: {},
      columnDefs: [
        // 表格列数据
        {
          filter: false, // 是否过滤
          checkboxSelection: true, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '套餐名称', // 列标题
          field: 'goo_name', // 列与数据源对应的字段
          filter: false, // 是否过滤
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '套餐分类',
          field: 'goodsType.gt_name',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '套餐简称',
          field: 'goo_nick',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        },

        {
          headerName: '套餐条码',
          field: 'goo_code',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '套餐助记码',
          field: 'goo_pinYin',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '价格',
          field: 'goo_price',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '操作',
          field: 'goo_price',
          filter: false,
          cellRendererFramework: 'AgPackageOperating',
          pinned: 'right',
          width: this.nowpx(0.17) + 'px'
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
        page: 1,
        pSize: 20,
        pageTotal: 0
      },
      goodsPackageorm: {
        text: '',
        type: ''
      },
      goodsTypeData: [],
      localeText: this.$ag_grid_localeText,
      dataListSelections: []
    }
  },

  mounted () {
    this.context = this
    this.getTypeData()
    this.getGoodsPackageList()
  },
  created () {},
  computed: {},
  methods: {
    // 获取商品列表
    getGoodsPackageList () {
      this.dataListSelections = []
      const obj = {
        ...this.goodsPackageorm,
        ...this.page
      }
      this.$store
        .dispatch('goodspackage/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.goodsListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },

    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getGoodsPackageList()
    },

    currentChangeHandle (val) {
      this.page.page = val
      this.getGoodsPackageList()
    },
    // 获取分类
    getTypeData () {
      const obj = {
        goodsType: 3
      }
      this.$store
        .dispatch('goodstype/getTreeList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.goodsTypeData = res.data
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
    // 批量删除
    delAll () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条套餐商品信息吗`,
          cancel: true
        })
        .onOk(() => {
          this.confirmDeleteRecord()
        })
    },
    confirmDeleteRecord () {
      this.dataListSelections = this.gridOptions.api.getSelectedRows()

      if (this.dataListSelections.length > 0) {
        const obj = this.dataListSelections.map((item) => {
          return item.id
        })

        this.$store
          .dispatch('goodspackage/delData', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                color: 'green',
                message: '删除成功',
                caption: '成功删除 ' + res.data + ' 条',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.getGoodsPackageList()
            }
          })
          .catch((error) => {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: error.message,
              color: 'red'
            })
          })
      }
    },
    clearBut () {
      this.goodsPackageorm.text = ''
      this.goodsPackageorm.type = ''
      this.getGoodsPackageList()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
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
