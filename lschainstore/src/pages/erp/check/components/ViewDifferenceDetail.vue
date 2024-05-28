<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row q-pb-sm" v-if="invoiceData">
          <div class="col-12 col-md-2 q-pa-xs">
            <q-input dense disable v-model="invoiceData.cep_order_number" label="盘点表单据" />
          </div>
          <div class="col-12 col-md-1 q-pa-xs">
            <q-input disable dense v-model="invoiceData.cep_depot_name" label="盘点仓库" />
          </div>
          <div class="col-12 col-md-2 q-pa-xs q-mt-sm">
            盘点类型：
            <span v-if="invoiceData.cep_check_order_range == 1">全盘</span>
            <span v-if="invoiceData.cep_check_order_range == 2">抽盘</span>
            <span v-if="invoiceData.cep_check_order_range == 2">分类盘点</span>
          </div>
          <div class="col-12 col-md-3 q-pa-xs">
            <q-input disable dense v-model="invoiceData.cec_note" label="订货备注" />
          </div>
          <div class="col-12 col-md-3 q-pa-xs">
            <q-btn color="primary" class="q-px-xl" unelevated @click="submitData(3)" v-if="authorityMeta('audit')" label="审核" />
            <q-btn color="grey" class="q-px-xl q-ml-lg" unelevated :to="{ name: 'erpCheck' }" label="返回" />
          </div>
        </div>
      </div>

      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="
            ag-theme-balham ag-grid-table
            erp-change-table
            hl_header_center hl_content_center
            full-height
          "
          :suppressMovableColumns="true"
          :rowData="checkDataList"
          :columnDefs="columnData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
          :localeText="localeText"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <!-- <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :current-page="page.pageIndex"
          :page-size="page.pSize"
          :total="page.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination> -->
      </div>
    </div>
  </q-page>
</template>
<script>
export default {
  name: 'changeViewDetail',
  components: {},
  data () {
    return {
      gridOptions: {},
      context: null,
      checkDataList: [],
      columnData: [
        // {
        //   headerName: '盘点单号',
        //   field: 'check.cec_order_number',
        //   valueGetter: (p) => {
        //     // return p.data.cec_order_number

        //     if (p.data.check.cec_order_number) {
        //       return p.data.check.cec_order_number
        //     }
        //     // return p.data.cec_order_number
        //   },
        //   width: this.nowpx(0.15) + 'px'
        // },
        {
          headerName: '条码',
          field: 'ecd_skc_code',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '商品名称',
          field: 'ecd_archives_name',
          filter: false,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '货号',
          field: 'ecd_article_code',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '规格 ',
          field: 'ecd_spe_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },

        {
          headerName: '单价',
          field: 'ecd_price',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '原有库存',
          field: 'ecd_check_before_number',
          width: this.nowpx(0.08) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '盘点数量',
          field: 'ecd_check_number',
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '相差数量',
          field: 'ecd_difference_number',
          width: this.nowpx(0.06) + 'px',
          comparator: (a, b) => a - b
        },
        {
          headerName: '盘点状态',
          field: 'store.name',
          valueGetter: (p) => {
            if (p.data.ecd_status == 1) {
              return '盘盈'
            }
            if (p.data.ecd_status == 2) {
              return '盘亏'
            }
          },
          width: this.nowpx(0.12) + 'px'
        },

        {
          headerName: '原因',
          field: 'ecd_note',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        }
      ],
      invoiceData: {},
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      localeText: this.$ag_grid_localeText,
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      roleOptions: [
        { title: '盘盈', id: '1' },
        { title: '盘亏', id: '2' },
        { title: '领用', id: '3' },
        { title: '报废', id: '4' },
        { title: '其他', id: '5' }
      ]
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
      const obj = {
        id: this.$route.query.id
      }
      this.$store.dispatch('erpCheck/getCheckData', obj).then((res) => {
        if (res.data) {
          this.invoiceData = res.data ? res.data : {}
          const checkDetail = res.data.checkDetail
          this.checkDataList = checkDetail.checks

          // this.page.totalCount = parseInt(res.data.page.totalCount)
        }
      })
    },

    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    submitData (val) {
      if (this.checkDataList.length <= 0) {
        this.$q.notify({
          message: '注意',
          caption: '未选择商品!',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: '确定审核盘点清单吗？',
          cancel: true
        })
        .onOk(() => {
          const obj = {
            cec_status: val,
            id: this.$route.query.id
          }
          this.$store.dispatch('erpCheck/setData', obj).then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                color: 'green',
                message: '成功',
                caption: '确定盘点单成功',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.$router.push({ name: 'erpCheck' })
            } else {
              this.$q.notify({
                message: '盘点失败',
                caption: res.data.msg,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
            }
          })
        })
    },

    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
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
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
<style>
.erp-change-table .cell-span-erp-change {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
