<template>
  <div class="centerx labelx">
    <q-dialog full-height v-model="visible" @close="closeDialog">
      <q-card
        :style="{
          width: $q.screen.width * 0.8 + 'px',
          'min-width': $q.screen.width * 0.8 + 'px',
        }"
        class="fit"
      >
        <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
          <div class="col-shrink bg-white  q-px-sm q-pb-md">
            <div class="row q-pa-xs">
            <div class="text-subtitle1">选择商品</div>
              <q-space />
              <q-btn
                icon="close"
                flat
                round
                dense
                v-close-popup
                @click="visible = false"
              />

          </div>
            <div class="row q-gutter-sm q-mt-xs">
              <q-input outlined class="col-12 col-md-5 q-mr-sm" dense v-model="searchQuery" label="商品名称" />
              <q-btn  label="搜索" unelevated color="primary" @click="getGoodsData()" />
              <q-btn  label="重置" unelevated color="warning" @click="clearBut()" />
              <q-space />
              <q-btn class="q-px-xl" label="确认" unelevated color="primary" :disabled="dataListSelections.length > 0 ? false : true" @click="selectAdministrator()" />

            </div>
          </div>
          <div class="col-shrink q-pa-sm full-height">
            <ag-grid-vue
              ref="agGridTable"
              :components="components"
              :gridOptions="gridOptions"
              class="ag-theme-balham ag-grid-table  hl_header_center hl_content_center full-height"
              :columnDefs="columnDefs"
              :suppressMovableColumns="true"
              :defaultColDef="defaultColDef"
              :rowData="jfmallGoodsData"
              rowSelection="single"
              :rowDragManaged="true"
              colResizeDefault="shift"
              :animateRows="false"
              rowHeight="50"
              :floatingFilter="false"
              :enableCellTextSelection="true"
              :suppressCellSelection="true"
              :suppressRowClickSelection="false"
              @rowSelected="rowSelectedAg"
              :localeText="localeText"
              @first-data-rendered="onFirstDataRendered"
            ></ag-grid-vue>
          </div>
          <div class="col-shrink q-pb-md text-center">
            <hl-pagination
              @size-change="sizeChangeHandle"
              @current-change="currentChangeHandle"
              :current-page="page.pageIndex"
              :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
              :page-size="page.pSize"
              :total="page.totalCount"
              layout="total, sizes, prev, pager, next, jumper"
            ></hl-pagination>
          </div>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'ChooseJfgoods',
  components: {},
  data () {
    return {
      components: {},
      memberListData: [],
      deleteAllIf: true,
      dataListSelections: [],
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
          headerCheckboxSelection: true, // 标题复选框开关状态
          width: 50
        },
        {
          headerName: '商品名称',
          field: 'jg_name'
        },
        {
          headerName: '售价',
          field: 'jg_price',
          filter: false
        },
        {
          headerName: '标价', // 列标题
          field: 'jg_list_price', // 列与数据源对应的字段
          filter: false // 是否过滤
        },

        {
          headerName: '总限购',
          field: 'jg_total_limit_number',
          filter: false
        },
        {
          headerName: '单人限购',
          field: 'jg_one_limit_number',
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
      gridOptions: {},
      isInputDisabled: false,
      visible: false,
      jfmallGoodsData: [],
      searchQuery: '',

      localeText: this.$ag_grid_localeText,
      invoice: {}
    }
  },

  computed: {},
  created () {},
  mounted () {},
  methods: {
    getGoodsData () {
      this.dataListSelections = []
      this.visible = true
      const obj = {
        search: this.searchQuery,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('jfgoods/getGoodsList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.jfmallGoodsData = res.data ? res.data.list : []
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
      this.visible = false
      this.$emit('getChooseJfgoodsData', this.dataListSelections)
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
      this.getGoodsData(this.invoice)
    }
  }
}
</script>
