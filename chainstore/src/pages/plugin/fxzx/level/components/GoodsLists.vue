<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.6 + 'px',
        'min-width': this.$q.screen.width * 0.6 + 'px',
      }"
      class="q-pa-md"
    >
      <q-form ref="listsRef">
        <q-card-section class="row items-center q-pa-none q-mb-lg">
          <div class="text-h6">商品列表</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <div class="row q-gutter-xs q-mb-md">
          <q-input outlined dense v-model="goodsName" label="请输入商品名称" class="col-12 col-md-3" />
          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
          <q-btn unelevated color="grey" dense label="重置" @click="clearButton" class="q-px-md" />
        </div>
        <div style="height: 480px">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="fxzxListData"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            @first-data-rendered="onFirstDataRendered"
            @gridReady="onFirstDataRendered"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            rowHeight="60"
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
        <div class="q-mt-sm">
          <q-btn unelevated color="grey" class="q-px-lg" label="关闭" v-close-popup />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
import GoodsImage from './GoodsImage'
import GoodsListsAgOperate from './GoodsListsAgOperate'
export default {
  name: 'GoodsLists',
  components: {
    GoodsImage,
    GoodsListsAgOperate
  },
  data () {
    return {
      showDialog: true,
      goodsName: '',
      goodsData: [],
      context: null,
      gridOptions: {},
      fxzxListData: [],
      columnDefs: [
        {
          headerName: '商品名称',
          field: 'goo_name',
          width: this.nowpx(0.3) + 'px'
        },

        {
          headerName: '商品图片',
          cellRendererFramework: 'GoodsImage',
          width: this.nowpx(0.24) + 'px'
        },
        {
          headerName: '商品价格',
          field: 'goo_listPrice',
          width: this.nowpx(0.23) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.23) + 'px',
          cellRendererFramework: 'GoodsListsAgOperate'
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
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    getList () {
      const params = {
        goodsName: this.goodsName,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('fxzx/getGoodsListsData', params)
        .then((res) => {
          if (res.code == 200) {
            this.fxzxListData = res.data ? res.data.list : []
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
    clearButton () {
      this.goodsName = ''
      this.getList()
    },
    hideNowPage () {
      if (this.goodsData.id > 0) {
        this.$emit('dataList', this.goodsData)
      } else {
        this.$emit('dataList')
      }
    }
  }
}
</script>
