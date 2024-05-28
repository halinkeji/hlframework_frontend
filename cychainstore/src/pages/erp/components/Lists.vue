<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: this.$q.screen.width * 0.7 + 'px',
        'min-width': this.$q.screen.width * 0.7 + 'px',
      }"
      class="q-pa-md"
    >
      <q-form ref="listsRef">
        <q-card-section class="row items-center q-pa-none q-mb-xl">
          <div class="text-h6">菜品列表</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <div class="row q-gutter-xs q-mb-md">
          <q-input outlined dense v-model="queryText" label="请输入名称|简称|编码|助记码" class="col-12 col-md-2" />
          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
          <q-btn unelevated color="grey" dense label="重置" @click="clearBtn" class="q-px-md" />
        </div>
        <div style="height: 436px">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="listsListData"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            @first-data-rendered="onFirstDataRendered"
            @rowSelected="rowSelectedAg"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            rowHeight="50"
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
        <div>
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pageSize"
            :total="page.pageTotal"
          ></hl-pagination>
        </div>
        <div class="text-center q-gutter-sm q-mt-lg">
          <q-btn unelevated color="grey" label="取消" v-close-popup />
          <q-btn unelevated color="primary" :disable="addButtonDisabled" label="添加" @click="saveBtn" />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'FoodsLists',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,
      queryText: '',
      context: null,
      gridOptions: {},
      selected: [],
      listsListData: [],
      columnDefs: [
        {
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '名称',
          field: 'fl_name',
          width: this.nowpx(0.18) + 'px'
        },
        {
          headerName: '简称',
          field: 'fl_nick_name',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '编码',
          field: 'fl_code',
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '助记码',
          field: 'fl_pinYin',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '标价',
          field: 'fl_list_price',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '库存',
          field: 'fl_stock_quantity',
          width: this.nowpx(0.15) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.getList()
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    getList () {
      const params = {
        queryText: this.queryText,
        packages: '0',
        stockStatus: 1,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('dishes/getListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.listsListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 802
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
    // 分页变化
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    clearBtn () {
      this.queryText = ''
      this.getList()
    },
    rowSelectedAg (p) {
      this.selected = p.api.getSelectedRows()
    },
    saveBtn () {
      this.addButtonDisabled = true
      this.$emit('dataList', this.selected)
    },
    hideNowPage () {
      this.$emit('dataList', [])
    }
  }
}
</script>
