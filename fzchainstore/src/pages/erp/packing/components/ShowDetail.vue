<template>
  <div class="centerx labelx">
    <q-dialog full-height v-model="visible"  persistent>
      <q-card
        :style="{
          width: $q.screen.width * 0.8 + 'px',
          'min-width': $q.screen.width * 0.8 + 'px',
        }"
        class="q-pa-sm full-height fit"
      >
        <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
            <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-xs row items-center">
            <div class="text-subtitle2">包裹详情</div>
            <q-space />
            <q-btn icon="close" @click="closeDialog" flat round dense v-close-popup />
          </div>
          <div class="col-shrink q-px-xs q-py-none full-height ">
            <ag-grid-vue
              ref="agGridTable"
              :components="components"
              :gridOptions="gridOptions"
              class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
              :columnDefs="columnDefs"
              :suppressMovableColumns="true"
              :defaultColDef="defaultColDef"
              :rowData="invoiceData"
              :rowDragManaged="true"
              colResizeDefault="shift"
              :animateRows="false"
              rowHeight="50"
              :floatingFilter="false"
              :enableCellTextSelection="true"
              rowSelection="multiple"
              :suppressCellSelection="true"
              :suppressRowClickSelection="true"
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
              :page-size="page.pageSize"
              :total="page.pageTotal"
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
  name: 'ShowDetail',
  components: {},
  data () {
    return {
      components: {},
      memberListData: [],
      deleteAllIf: true,

      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      columnDefs: [
        {
          headerName: '条码',
          field: 'epd_skc_code',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '商品名称',
          field: 'epd_archives_name',
          filter: false,
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '货号',
          field: 'epd_article_code',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '颜色 ',
          field: 'epd_color_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '尺码 ',
          field: 'epd_size_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '装箱数量',
          field: 'epd_quantity',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '计量单位',
          field: 'epd_unit_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },

        {
          headerName: '创建时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm')
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '备注',
          field: 'epd_note',
          width: this.nowpx(0.08) + 'px'
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
      invoiceData: [],
      searchQuery: '',
      localeText: this.$ag_grid_localeText,
      packingId: {}
    }
  },

  computed: {},
  created () {},
  mounted () {},
  methods: {
    init (val) {
      this.visible = true
      this.packingId = val

      this.$nextTick(() => {
        this.getDetail()
      })
    },
    getDetail () {
      const obj = {
        packingId: this.packingId,
        pSize: this.page.pageSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('erpPacking/getDetailData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.invoiceData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getDetail()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getDetail()
    },
    addDate (p) {
      return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
    },
    closeDialog () {
      this.$emit('dataList')
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
    }

  }
}
</script>
