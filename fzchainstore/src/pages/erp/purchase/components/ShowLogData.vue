<template>
  <q-dialog v-model="isSidebarActiveLocal" persistent>
    <q-card
      class="q-pa-sm fit"
      :style="{
        width: this.$q.screen.width * 0.6 + 'px',
        'min-width': this.$q.screen.width * 0.4 + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <div class="row justify-center items-center">
            <div class="text-subtitle2">操作日志</div>
            <q-space />
            <q-btn unelevated flat round dense icon="close" v-close-popup />
          </div>
        </div>

        <div class="col-shrink  q-py-none full-height ">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="logDataList"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :localeText="localeText"
            :animateRows="false"
            :context="context"
            @first-data-rendered="onFirstDataRendered"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            rowHeight="40"
            rowSelection="multiple"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
          ></ag-grid-vue>
        </div>
        <div class="col-shrink bg-white q-pb-md">
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
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
  name: 'ShowLogData',
  data () {
    return {
      isSidebarActiveLocal: true,
      context: '',
      gridOptions: {},
      logDataList: [],
      columnDefs: [
        {
          headerName: '操作时间',
          field: 'omr_member_card_num',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm')
          },
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '操作人',
          field: 'user.username',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '操作内容',
          field: 'cel_description',
          width: this.nowpx(0.2) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      order_id: '',
      type: ''
    }
  },

  created () {
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    init (data, type) {
      this.isSidebarActiveLocal = true
      this.order_id = data
      this.type = type
      const obj = {
        order_id: data,
        type: type,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('erpPurchase/getLogData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.logDataList = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
          }
        })

        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    }, // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.init(this.data, this.type)
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.init(this.data, this.type)
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    } // 表格宽度自适应
  }
}
</script>
