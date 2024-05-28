<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md row">
      <div class="col-12 col-md-3 q-mt-sm q-mr-sm" v-if="is_main_store">
        <q-select
          label="查询店铺"
          v-model="selectStoreData"
          option-value="id"
          option-label="name"
          multiple
          emit-value
          map-options
          dense
          outlined
          :options="libInStoreList"
        />
      </div>
      <div class="col-12 col-md-2 q-mr-sm q-mt-sm">
        <q-input label="可搜索：发票单据号|发票代码|发票号码" outlined v-model="searchFrom.searchSerm" dense />
      </div>
      <div class="col-12 col-md-2 q-mt-sm q-mr-sm">
        <q-input label="可搜索：发票抬头|邮箱|联系电话" outlined v-model="searchFrom.memberText" dense />
      </div>
      <div class="col-12 col-md-2 q-pt-sm q-mr-sm">
        <q-input outlined dense label="开始时间" v-model="startTime" readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="startTime" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-12 col-md-2 q-pt-sm q-mr-sm">
        <q-input outlined dense label="结束时间" v-model="endTime" readonly>
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="endTime" mask="YYYY-MM-DD HH:mm">
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>

          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>

      <q-btn @click="getDatalist()" color="primary" class="q-mt-sm col-12 col-md-1 q-mr-sm" unelevated label="搜索" />
      <q-btn @click="resetBut()" color="warning" class="q-mt-sm col-12 col-md-1 q-mr-sm" unelevated label="重置" />
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height "
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :defaultColDef="defaultColDef"
        :rowData="invoiceListData"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="false"
        :localeText="localeText"
        :context="context"
        :singleClickEdit="true"
        rowHeight="40"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-pb-md">
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
    <view-details ref="viewDetails" v-if="showDetail"></view-details>
  </div>
</template>
<script>
import ViewDetails from './ViewDetails.vue'
import AgTypeChip from './AgTypeChip'
import AgRecOperator from './AgRecOperator.vue'
export default {
  name: 'ReceiptRecord',
  props: ['memberId'],
  components: { AgTypeChip, AgRecOperator, ViewDetails },
  data () {
    return {
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      components: { AgTypeChip, AgRecOperator },
      showDetail: false,
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      invoiceListData: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '发票单据号',
          field: 'pr_invoice_code',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '发票代码',
          field: 'pr_invoice_code_info',
          filter: false,
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '发票号码',
          field: 'pr_invoice_number',
          filter: false,
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '发票抬头',
          field: 'pr_title_name',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '纳税人识别号',
          field: 'pr_identification_number',
          filter: false,
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '邮箱',
          field: 'pr_email',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '发票总金额',
          field: 'pr_invoice_amount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.pr_invoice_amount > 0 ? p.data.pr_invoice_amount : 0
          }
        },
        {
          headerName: '开具发票金额',
          field: 'pr_total_amount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.pr_total_amount > 0 ? p.data.pr_total_amount : 0
          }
        },
        {
          headerName: '联系电话',
          field: 'pr_phone',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '银行',
          field: 'pr_bank',
          filter: false,
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '时间',
          field: 'created_at',
          filter: false,
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm')
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '开票状态',
          field: 'user.username',
          filter: false,
          pinned: 'right',
          cellRendererFramework: 'AgTypeChip',
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '操作员',
          field: 'user.username',
          filter: false,
          pinned: 'right',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '所属店铺',
          field: 'store.name',
          pinned: 'right',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '操作',
          filter: false,
          pinned: 'right',
          cellRendererFramework: 'AgRecOperator',
          width: this.nowpx(0.09) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,
      startTime: '',
      endTime: '',
      searchFrom: {
        consumePayType: '',
        userId: '',
        searchSerm: '',
        payStatus: '',
        member_id: 0,
        created_at: '',
        updated_at: ''
      },
      context: '',
      libInStoreList: [],
      selectStoreData: [],
      dataListSelections: [],
      is_main_store: ''
    }
  },
  // computed: {
  //   is_main_store () {
  //     return this.$store.getters['merchant/is_main_store']
  //   }
  // },
  created () {
    this.getDatalist()
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
    this.context = this
  },
  methods: {
    // 计算窗口
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 295
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 隐藏滚动条
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    getDatalist () {
      this.dataListSelections = []
      const startTime = this.$q_date.formatDate(this.startTime, 'X')
      const endTime = this.$q_date.formatDate(this.endTime, 'X')
      if (endTime < startTime) {
        this.$q.notify({
          message: '失败',
          caption: '结束时间不得大于开始时间,请重新选择',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      this.searchFrom.created_at = startTime
      this.searchFrom.updated_at = endTime
      const obj = {
        ...this.searchFrom,
        page: this.page.pageIndex,
        pSize: this.page.pSize,
        member_id: this.memberId,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('receipt/getReceiptList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data.list) {
              this.invoiceListData = res.data.list
              this.page.totalCount = res.data.page.totalCount
            } else {
              this.invoiceListData = []
              this.page.totalCount = 0
            }
            // if (this.invoiceListData.length > 0) {
            //   setTimeout(() => {
            //     this.setTopTabel(res.data.list)
            //   }, 200)
            // }
          }
        })
        .catch((error) => {})
    },

    sizeChangeHandle (val) {
      this.page.pSize = val
      this.getDatalist()
    },

    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getDatalist()
    },

    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          sc_memberName: '数据合计',
          show_status: true,
          pr_total_amount: '',
          pr_invoice_amount: ''
        }
      ])
      setTimeout(() => {
        this.gridOptions.api.setPinnedBottomRowData(newRows) // 底部汇总
      }, 200)
    },

    countColumnData (data = [], condition = []) {
      if (data.length > 0 && condition.length > 0) {
        const rowData = []
        condition.forEach((i, k) => {
          const oneRowData = {}

          for (var j in i) {
            oneRowData[j] = 0
            if (!i[j]) {
              data.forEach((value, key) => {
                oneRowData[j] += this.formatAmount(value[j])
                oneRowData[j] = this.formatAmount(oneRowData[j])
              })
            } else {
              oneRowData[j] = i[j]
            }
          }

          rowData.push(oneRowData)
        })
        return rowData
      }
    },
    // 重置
    resetBut () {
      this.searchFrom = {
        consumePayType: '',
        userId: '',
        searchSerm: '',
        payStatus: '',
        member_id: 0,
        created_at: '',
        updated_at: '',
        memberText: ''
      }
      this.selectStoreData = []
      this.startTime = ''
      this.endTime = ''
      this.getDatalist()
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    showPopup (val) {
      this.showDetail = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.viewDetails.getViewData(val)
        }, 200)
      })
    }
  }
}
</script>
