<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog" persistent>
    <q-card
      :style="{
        width: this.$q.screen.width * 0.8 + 'px',
        'min-width': this.$q.screen.width * 0.8 + 'px',
      }"
      class="q-pa-md "
    >
      <div style="height: 536px">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="couponList"
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
      <div class="q-mt-sm">
        <q-btn unelevated label="关闭" class="q-ml-sm q-px-lg" color="grey" v-close-popup />
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
import CouponAgOperate from './components/CouponAgOperate'
export default {
  name: 'Coupon',
  components: {
    CouponAgOperate
  },
  data () {
    return {
      showDialog: true,
      context: '',
      couponList: [],
      gridOptions: {},
      selectedCouponData: {},
      columnDefs: [
        {
          headerName: '卡券标题',
          field: 'cou_title',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '卡券类型',
          field: 'cou_type',
          valueGetter: (p) => {
            if (p.data.cou_type == 1) {
              return '折扣券'
            } else if (p.data.cou_type == 2) {
              return '代金券'
            } else if (p.data.cou_type == 3) {
              return '礼品券'
            } else if (p.data.cou_type == 4) {
              return '团购券'
            } else if (p.data.cou_type == 5) {
              return '优惠券'
            } else {
              return ''
            }
          },
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '卡券有效期',
          valueGetter: (p) => {
            if (p.data.cou_dateType == 1) {
              return (
                this.$q_date.formatDate(p.data.cou_startTime * 1000, 'YYYY-MM-DD') +
                ' 至 ' +
                this.$q_date.formatDate(p.data.cou_endTime * 1000, 'YYYY-MM-DD') +
                ' 有效'
              )
            } else if (p.data.cou_dateType == 2) {
              let endText = ''
              switch (parseInt(p.data.cou_endDay)) {
                case 1:
                  endText = '年'
                  break
                case 2:
                  endText = '季'
                  break
                case 3:
                  endText = '月'
                  break
                case 4:
                  endText = '周'
                  break
                case 5:
                  endText = '天'
                  break
              }

              return '领取后' + p.data.cou_startDay + endText + '内有效'
            } else {
              return ''
            }
          },
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '库存',
          field: 'cou_quantity',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '限领数/发送数',
          valueGetter: (p) => {
            return p.data.cou_totalLimit + '/' + p.data.cou_get_limit
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.2) + 'px',
          cellRendererFramework: 'CouponAgOperate'
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
    this.getList()
  },
  mounted () {},
  computed: {},
  methods: {
    getList () {
      const params = {
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('coupon/getCouponList', params)
        .then((res) => {
          if (res.code == 200) {
            this.couponList = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 274
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
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
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    hideNowPage () {
      if (this.selectedCouponData.id > 0) {
        this.$emit('dataList', this.selectedCouponData)
      } else {
        this.$emit('dataList')
      }
    }
  }
}
</script>
