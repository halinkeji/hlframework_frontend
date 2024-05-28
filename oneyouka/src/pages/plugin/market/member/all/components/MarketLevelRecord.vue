<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: this.$q.screen.width * 0.6 + 'px',
        'min-width': this.$q.screen.width * 0.6 + 'px'
      }"
      class="q-pa-md"
    >
      <q-form ref="listsRef">
        <q-card-section class="row items-center q-pa-none q-mb-xl">
          <div class="text-h6">分佣商等级变更记录</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <div style="height: 536px">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="marketLevelRecordData"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            @first-data-rendered="onFirstDataRendered"
            @gridReady="onFirstDataRendered"
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
          <q-btn unelevated color="grey" label="返回" v-close-popup />
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'MarketLevelRecord',
  components: { },
  data () {
    return {
      showDialog: true,
      context: null,
      gridOptions: {},
      marketLevelRecordData: [],
      columnDefs: [
        {
          headerName: '变更前等级名称',
          field: 'mlr_after_name',
          width: this.nowpx(0.16) + 'px'
        },
        {
          headerName: '变更前等级权重',
          valueGetter: (p) => {
            switch (parseInt(p.data.mlr_after_weights)) {
              case 0:
                return '默认'
              case 1:
                return '一级'
              case 2:
                return '二级'
              case 3:
                return '三级'
              case 4:
                return '四级'
              case 5:
                return '五级'
              case 6:
                return '六级'
              case 7:
                return '七级'
              case 8:
                return '八级'
              case 9:
                return '九级'
              case 10:
                return '十级'
              default:
                return false
            }
          },
          width: this.nowpx(0.16) + 'px'
        },
        {
          headerName: '变更后等级名称',
          field: 'mlr_before_name',
          width: this.nowpx(0.16) + 'px'
        },
        {
          headerName: '变更后等级权重',
          valueGetter: (p) => {
            switch (parseInt(p.data.mlr_before_weights)) {
              case 0:
                return '默认'
              case 1:
                return '一级'
              case 2:
                return '二级'
              case 3:
                return '三级'
              case 4:
                return '四级'
              case 5:
                return '五级'
              case 6:
                return '六级'
              case 7:
                return '七级'
              case 8:
                return '八级'
              case 9:
                return '九级'
              case 10:
                return '十级'
              default:
                return false
            }
          },
          width: this.nowpx(0.16) + 'px'
        },
        {
          headerName: '变更方式',
          valueGetter: (p) => {
            switch (parseInt(p.data.mlr_mode)) {
              case 1:
                return '手动变更'
              case 2:
                return '自动变更'
              default:
                return ''
            }
          },
          width: this.nowpx(0.16) + 'px'
        },
        {
          headerName: '变更时间',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
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
    getList (id) {
      if (id > 0) {
        const params = {
          marketId: id,
          page: this.page.pageIndex,
          pSize: this.page.pageSize
        }
        this.$store
          .dispatch('market/getLevelRecordListData', params)
          .then(res => {
            if (res.code == 200) {
              this.marketLevelRecordData = res.data ? res.data.list : []
              this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            }
          })
          .catch(err => {
            this.$q.notify({
              message: '失败',
              caption: err.message,
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
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
    hideNowPage () {
      this.$emit('dataList')
    }
  }
}
</script>
