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
        <div class="  q-ml-md q-mt-md">
          <div>
            <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
            选择原料
          </div>
          <div class="row q-gutter-sm">
            <div class="col-12 col-md-2 ">
              <q-input  outlined v-model="cm_name" label="名称" dense />
            </div>

            <q-btn color="primary" unelevated @click="getList">搜索</q-btn>
            <q-btn color="grey-6" unelevated @click="handleFormReset">重置</q-btn>
          </div>
        </div>
        <div class="col-shrink  full-height q-my-xs q-mx-md">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham  ag-grid-table full-height hl_header_center hl_content_center goods-select-table"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :defaultColDef="defaultColDef"
            :rowData="materialListData"
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
        <div class="col-shrink bg-white q-pb-md row q-gutter-md items-center  q-px-md">
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

export default {
  components: {},
  data () {
    return {
      materialListData: [], // 默认数据源
      gridOptions: {},
      columnDefs: [
        {
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true
        },
        {
          headerName: '名称',
          field: 'cm_name'
        },
        {
          headerName: '单位',
          field: 'cm_unit'
        },
        {
          headerName: '默认保质期天数',
          field: 'cm_exp_day'
        },
        {
          headerName: '入库价',
          field: 'cm_in_depot_price'
        },

        {
          headerName: '描述',
          field: 'cm_description'
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
      cm_name: ''
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

      this.$emit('getSelectedData', selectedRows, val)
      if (val) {
        this.getList()
      }
    },

    // 选择商品开启弹窗调取数据
    getList () {
      this.activePrompt = true
      const params = {
        cm_name: this.cm_name,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('materialManage/getListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.materialListData = res.data ? res.data.list : []
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

    // 每页数
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    // 查询
    handleFormSearchSubmit () {
      this.getList()
    },
    // 重置
    handleFormReset () {
      this.cm_name = ''
      this.getList()
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    }

    // 选择商品后返回数据
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
