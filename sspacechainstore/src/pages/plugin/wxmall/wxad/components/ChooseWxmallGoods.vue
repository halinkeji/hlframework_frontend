<template>
  <div class="centerx labelx">
    <q-dialog full-height v-model="visible" @close="closeDialog" persistent>
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 0.8) + 'px',
          'max-width': parseInt(this.$q.screen.width * 0.8) + 'px',
        }"
        class="q-pa-sm full-height"
      >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white  q-px-sm q-pb-md">
          <div class="row">
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
            <q-btn  unelevated label="搜索" color="primary" @click="getGoodsData()" />
            <q-btn  unelevated label="重置" color="warning" @click="clearBut()" />
            <q-space />
            <q-btn
               unelevated
              label="确认"
              color="primary"
              :disabled="dataListSelections.length > 0 ? false : true"
              @click="selectAdministrator()"
              class="q-px-xl"
            />
          </div>
        </div>
        <div class="col-shrink q-pa-sm full-height">
         <ag-grid-vue
            ref="agGridTable"
            :components="components"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :defaultColDef="defaultColDef"
            :rowData="wxmallGoodsData"
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

        <div class="col-shrink bg-white q-pb-md text-center">
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
  name: 'ChooseWxmallGoods',
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
        {
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: false,
          width: 50
        },
        {
          headerName: '商品名称',
          field: 'wg_name'
        },
        {
          headerName: '售价',
          field: 'wg_price',
          filter: false
        },
        {
          headerName: '标价', // 列标题
          field: 'wg_list_price', // 列与数据源对应的字段
          filter: false // 是否过滤
        },

        {
          headerName: '总限购',
          field: 'wg_total_limit_number',
          filter: false
        },
        {
          headerName: '单人限购',
          field: 'wg_one_limit_number',
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
      wxmallGoodsData: [],
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
        .dispatch('wxMallGoods/getData', obj)
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
      this.getGoodsData(this.invoice)
    }
  }
}
</script>
