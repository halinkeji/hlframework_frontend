<template>
  <q-page class="fit">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white q-mb-sm">
        <q-card flat class="q-pa-sm row q-gutter-xs">
          <q-input outlined dense v-model="invoiceCode" label="单据号" class="col-12 col-md-2" />

          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
          <q-btn unelevated color="warning" dense label="重置" @click="clearButton" class="q-px-md" />
        </q-card>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="recordList"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
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
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
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
  </q-page>
</template>
<script>
export default {
  name: 'zfkRecord',
  components: {},
  data () {
    return {
      memberInfo: '',
      sonMemberInfo: '',
      startTime: '',
      endTime: '',
      context: '',
      recordList: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '单据号',
          field: 'prz_invoice_code',
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '商品',
          field: 'invoiceDetail.cid_goo_name',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '服务费说明',
          field: 'prz_serve_title',
          width: this.nowpx(0.11) + 'px'
        },

        {
          headerName: '商品数量',
          field: 'prz_goods_quantity',
          width: this.nowpx(0.11) + 'px'
        },
        {
          headerName: '服务费',
          field: 'prz_service_fee',
          width: this.nowpx(0.11) + 'px',
          valueGetter: (p) => {
            return this.$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol + p.data.prz_service_fee
          }
        },
        {
          headerName: '小计金额',
          field: 'prz_goods_subtotal',
          width: this.nowpx(0.11) + 'px',
          valueGetter: (p) => {
            return this.$q.localStorage.getItem('onlystore_store_local').storeBaseConfig.consume_base_moneySymbol + p.data.prz_goods_subtotal
          }
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      invoiceCode: ''
    }
  },
  created () {
    this.getList()
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    getList () {
      // if (this.startTime) {
      //   var startTime = new Date(this.startTime).getTime() / 1000
      // }
      // if (this.endTime) {
      //   var endTime = new Date(this.endTime).getTime() / 1000
      // }
      const params = {
        invoiceCode: this.invoiceCode,
        // startTime: startTime,
        // endTime: endTime,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('zzfwf/getRecordData', params)
        .then((res) => {
          if (res.code == 200) {
            this.recordList = res.data ? res.data.list : []

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

    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 274
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearButton () {
      this.invoiceCode = ''

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
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    }
  }
}
</script>
