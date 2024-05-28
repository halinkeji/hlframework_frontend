<template>
  <div class="fit bg-grey-3">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <q-card flat class="q-py-sm q-px-xs row q-gutter-xs">
        <div class="col-12 col-md-2">
          <q-input outlined dense v-model="couponTitle" label="请输入卡券标题" />
        </div>
        <div class="col-12 col-md-2">
          <q-select
            outlined
            dense
            v-model="couponType"
            :options="couponTypeOptions"
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
          :rowData="couponData"
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
import CouponAgOperate from './components/CouponAgOperate'
export default {
  name: 'zzyxCoupon',
  components: {
    CouponAgOperate
  },
  data () {
    return {
      couponTitle: '',
      couponType: '',
      context: null,
      gridOptions: {},
      couponData: [],
      couponProp: {
        1: '免费领取',
        2: '储值购买',
        3: '积分兑换',
        4: '主动购买',
        5: '混合领取',
        6: '其他属性',
        7: '主动群发'
      },
      couponTypeData: {
        1: '折扣券',
        2: '代金券',
        3: '礼品券',
        4: '团购券',
        5: '优惠券',
        6: '积分券',
        7: '储值券'
      },
      couponTypeOptions: [
        { value: 1, label: '折扣券' },
        { value: 2, label: '代金券' },
        { value: 3, label: '礼品券' },
        { value: 4, label: '团购券' },
        { value: 5, label: '优惠券' },
        { value: 6, label: '积分券' },
        { value: 7, label: '储值券' }
      ],
      columnDefs: [
        {
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '卡券标题',
          field: 'cou_title',
          filter: false,
          width: this.nowpx(0.22) + 'px'
        },
        {
          headerName: '卡券类型',
          field: 'cou_type',
          filter: false,
          valueGetter: this.rulesUse,
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '卡券属性',
          field: 'cou_couponProperty',
          filter: false,
          valueGetter: this.propertyType,
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '卡券状态',
          field: 'cou_status',
          filter: false,
          valueGetter: (p) => {
            if (parseInt(p.data.cou_status) == 1) {
              return '上架中'
            }
            return '已下架'
          },
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '卡券有效期',
          field: 'time_type',
          filter: false,
          width: this.nowpx(0.22) + 'px',
          valueGetter: this.expireDate
        },
        {
          headerName: '操作',
          cellRendererFramework: 'CouponAgOperate',
          width: this.nowpx(0.19) + 'px'
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
        couponTitle: this.couponTitle,
        couponType: this.couponType,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('zzyx/getCouponListData', obj)
        .then((res) => {
          this.couponData = res.data ? res.data.list : []
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
    propertyType (p) {
      return this.couponProp[p.data.cou_couponProperty]
    },
    // 卡券类型
    rulesUse (p) {
      return this.couponTypeData[p.data.cou_type]
    },
    expireDate (p) {
      if (parseInt(p.data.cou_dateType) == 1) {
        return (
          this.$q_date.formatDate(p.data.cou_startTime * 1000, 'YYYY-MM-DD') +
          ' 至 ' +
          this.$q_date.formatDate(p.data.cou_endTime * 1000, 'YYYY-MM-DD') +
          ' 有效'
        )
      } else {
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
      }
    },
    clearButton () {
      this.couponTitle = ''
      this.couponType = ''
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
