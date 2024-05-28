<template>
  <q-dialog
    v-model="visible"
    @close="closeDialog"
    fullscreen
    persistent
    :maximized="maximizedToggle"
    transition-show="slide-up"
    transition-hide="slide-down"
  >
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 1) + 'px',
        'max-width': parseInt(this.$q.screen.width * 1) + 'px',
      }"
      class="fit q-pa-sm full-height"
    >
      <div class="fit column no-wrap justify-between items-stretch  content-stretch no-scroll  ">
        <q-card-section class="row items-center ">
          <div class="text-h6">选择商品</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <div class="col-shrink bg-white q-px-xs q-pb-xl row q-gutter-xs">
          <q-input outlined class="col-12 col-md-2 q-mr-sm" dense v-model="searchQuery" label="商品名称" />
          <q-select
            outlined
            dense
            v-model="queryCondition.type"
            :options="typeData"
            class="col-12 col-md-2 q-mt-sm"
            option-value="id"
            option-label="gt_name"
            emit-value
            map-options
            label="商品分类 "
          />
          <q-select
            outlined
            dense
            v-model="queryCondition.supplier"
            :options="supplierData"
            class="col-12 col-md-2 q-mt-sm"
            option-value="id"
            option-label="ces_name"
            emit-value
            map-options
            label="供货商 "
          />
          <q-select
            outlined
            dense
            v-model="queryCondition.brand"
            :options="brandList"
            class="col-12 col-md-2 q-mt-sm"
            option-value="id"
            option-label="cp_name"
            emit-value
            map-options
            label="品牌"
          />
          <q-select
            outlined
            dense
            v-model="queryCondition.years"
            :options="yearsList"
            option-value="id"
            option-label="cp_name"
            class="col-12 col-md-2 q-mt-sm"
            emit-value
            map-options
            label="年份 "
          />
          <q-select
            outlined
            dense
            v-model="queryCondition.season"
            :options="seasonList"
            option-value="id"
            option-label="cp_name"
            class="col-12 col-md-2 q-mt-sm"
            emit-value
            map-options
            label="季度 "
          />

          <q-select
            outlined
            dense
            v-model="queryCondition.priority"
            :options="priorityList"
            option-value="id"
            option-label="cp_name"
            class="col-12 col-md-2 q-mt-sm"
            emit-value
            map-options
            label="商品层"
          />
          <q-select
            outlined
            dense
            v-model="queryCondition.tag"
            :options="tagList"
            option-value="id"
            option-label="gt_name"
            class="col-12 col-md-2 q-mt-sm"
            multiple
            use-chips
            stack-label
            emit-value
            map-options
            label="商品标签 *"
          />
          <q-btn class="col-12 col-md-1 q-mr-sm" unelevated label="搜索" color="primary" @click="getGoodsData()" />
          <q-btn class="col-12 col-md-1 q-mr-sm" unelevated label="重置" color="warning" @click="clearBut()" />
          <q-btn
            unelevated
            class="col-12 col-md-1 q-mr-sm"
            label="确认"
            color="primary"
            :disabled="dataListSelections.length > 0 ? false : true"
            @click="selectAdministrator()"
          />
          <q-btn unelevated class="col-12 col-md-1" label="关闭" color="grey" @click="visible = false" />
        </div>
        <div class="col-shrink bg-white q-px-xs q-py-none full-height bg-grey-2">
          <ag-grid-vue
            ref="agGridTable"
            :components="components"
            :gridOptions="gridOptions"
            class="
              ag-theme-balham ag-grid-table
              hl_header_center hl_content_center
              full-height
            "
            rowSelection="multiple"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :defaultColDef="defaultColDef"
            :rowData="wxmallGoodsData"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            rowHeight="50"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
            @rowSelected="rowSelectedAg"
            :localeText="localeText"
            @first-data-rendered="onFirstDataRendered"
          ></ag-grid-vue>
        </div>
        <div class="col-shrink bg-white q-pb-md">
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pSize"
            :total="page.totalCount"
            layout="total, sizes, prev, pager, next, jumper"
          ></hl-pagination>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'ChooseGoods',
  components: {},
  data () {
    return {
      components: {},
      memberListData: [],
      maximizedToggle: true,
      deleteAllIf: true,
      dataListSelections: [],
      page: {
        pageIndex: 1,
        pSize: 10,
        totalCount: 0
      },
      columnDefs: [
        {
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: false,
          width: 50
        },
        {
          headerName: '商品名称',
          field: 'ca_name'
        },
        {
          headerName: '类别',
          field: 'type.gt_name'
        },
        {
          headerName: '品牌',
          field: 'brand.cp_name'
        },
        {
          headerName: '年份',
          field: 'years.cp_name'
        },
        {
          headerName: '季度',
          field: 'season.cp_name'
        },

        {
          headerName: '层级',
          field: 'priority.cp_name'
        },
        {
          headerName: '货号',
          field: 'ca_article_code'
        },
        {
          headerName: '售价',
          field: 'ca_price',
          filter: false
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      queryCondition: {
        searchName: '',
        brand: '',
        season: '',
        years: '',
        band: '',
        priority: '',
        supplier: '',
        type: ''
      },
      gridOptions: {},
      isInputDisabled: false,
      visible: false,
      wxmallGoodsData: [],
      searchQuery: '',
      localeText: this.$ag_grid_localeText,
      invoice: {},
      supplierData: [],
      brandList: [],
      yearsList: [],
      seasonList: [],
      priorityList: [],
      tagList: [],
      typeData: []
    }
  },

  computed: {},
  created () {},
  mounted () {
    this.getSupplierList()
    this.getPropertyAll()
    this.getType()
  },
  methods: {
    getSupplierList () {
      this.$store
        .dispatch('clothingSupplier/getSupp')
        .then((res) => {
          if (res.code == 200) {
            this.supplierData = res.data ? res.data : []
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
    getPropertyAll () {
      this.$store
        .dispatch('clothingArchives/getLists')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.brandList = res.data.brand ? res.data.brand : []
              this.yearsList = res.data.years ? res.data.years : []
              this.seasonList = res.data.season ? res.data.season : []
              this.priorityList = res.data.priority ? res.data.priority : []
              this.tagList = res.data.tag ? res.data.tag : []
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
    getType () {
      this.$store
        .dispatch('clothingType/getTypeslistData')
        .then((res) => {
          if (res.code == 200) {
            this.typeData = res.data ? res.data : []
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
    getGoodsData () {
      this.dataListSelections = []
      this.visible = true
      const obj = {
        ...this.queryCondition,
        search: this.searchQuery,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('clothingArchives/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.wxmallGoodsData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },

    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },

    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getGoodsData()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getGoodsData()
    },

    selectAdministrator () {
      this.$nextTick(() => {
        this.$emit('getChooseGoods', this.dataListSelections)
      })
      this.visible = false
    },

    closeDialog () {
      this.$emit('closeChooseGoods')
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearBut () {
      this.searchQuery = ''
      this.queryCondition.searchName = ''
      this.queryCondition.brand = ''
      this.queryCondition.season = ''
      this.queryCondition.years = ''
      this.queryCondition.band = ''
      this.queryCondition.priority = ''
      this.queryCondition.supplier = ''
      this.queryCondition.tag = []
      this.queryCondition.type = ''
      this.getGoodsData(this.invoice)
    }
  }
}
</script>
