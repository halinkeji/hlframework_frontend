<template>
  <div class="fit bg-grey-3">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <q-card flat class="q-py-sm q-px-xs row q-gutter-xs">
        <div class="col-12 col-md-2">
          <q-input outlined dense v-model="goodsInfo" label="商品名称|条码|助记码|简称" />
        </div>
        <div class="col-12 col-md-2">
          <q-select
            outlined
            dense
            v-model="goodsType"
            :options="goodsTypeOptions"
            label="类型"
            class="col-12 col-md-2"
            option-label="label"
            emit-value
            map-options
          />
        </div>
        <q-btn unelevated color="primary" dense label="查询" class="q-px-md" @click="getList" />
        <q-btn unelevated color="warning" dense label="重置" @click="clearButton" class="q-px-md" />
      </q-card>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="countData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          :context="context"
          rowSelection="multiple"
          :localeText="localeText"
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
  </div>
</template>
<script>
import CountAgOperate from './components/CountAgOperate'
export default {
  name: 'zzyxCount',
  components: {
    CountAgOperate
  },
  data () {
    return {
      goodsInfo: '',
      goodsType: '',
      context: null,
      gridOptions: {},
      countData: [],
      goodsTypeOptions: [
        {
          label: '实物商品',
          value: '1'
        },
        {
          label: '服务商品',
          value: '2'
        }
      ],
      columnDefs: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '商品名称',
          field: 'goo_name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '条码',
          field: 'goo_code',
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '助记码',
          field: 'goo_pinYin',
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '简称',
          field: 'goo_nick',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '类型',
          valueGetter: (p) => {
            if (p.data.goo_goodsOrService == 1) {
              return '实物'
            } else if (p.data.goo_goodsOrService == 2) {
              return '服务'
            } else {
              return '未知'
            }
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '分类',
          field: 'goodsType.gt_name',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.15) + 'px',
          cellRendererFramework: 'CountAgOperate'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
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
  methods: {
    getList () {
      const obj = {
        goodsInfo: this.goodsInfo,
        goodsType: this.goodsType,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('zzyx/getCountListData', obj)
        .then((res) => {
          this.countData = res.data ? res.data.list : []
          this.page.pageTotal = res.data ? res.data.page.totalCount : 0
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    clearButton () {
      this.goodsInfo = ''
      this.goodsType = ''
      this.getList()
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 298
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
    }
  }
}
</script>
