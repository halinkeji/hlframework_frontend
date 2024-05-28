<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <div class="row q-gutter-sm">
        <div class="col-12 col-md-2" v-if="is_main_store">
          <q-select
            label="查询店铺"
            use-chips
            v-model="selectStoreData"
            option-value="id"
            clearable
            option-label="name"
            multiple
            emit-value
            map-options
            dense
            outlined
            :options="libInStoreList"
          />
        </div>

        <div class="col-12 col-md-2">
          <q-input label="请输入单据号" clearable outlined v-model="searchFrom.searchSerm" dense />
        </div>

        <div class="col-12 col-md-2" v-if="!memberId">
          <q-input clearable label="请输入会员卡号|电话号|姓名" outlined v-model="searchFrom.memberText" dense />
        </div>

        <div class="col-12 col-md-2 ">
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
              <q-icon color="grey" v-if="startTime" @click="startTime = ''" name="cancel"></q-icon>
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
        <div class="col-12 col-md-2">
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
              <q-icon color="grey" v-if="endTime" @click="endTime = ''" name="cancel"></q-icon>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="endTime" mask="YYYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-btn @click="getDatalist()" color="primary" unelevated label="搜索" />
        <q-btn @click="resetBut()" color="warning" unelevated label="重置" />
        <q-btn @click="countExport()" v-if="searchFrom.member_id == 0" color="red" unelevated label="导出" />
      </div>
    </div>
    <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table  full-height hl_header_center hl_content_center"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :defaultColDef="defaultColDef"
        :rowData="invoiceListData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :suppressCellSelection="true"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :localeText="localeText"
        @first-data-rendered="onFirstDataRendered"
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
        :total="page.pageTotal"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>
  </div>
</template>
<script>
export default {
  name: 'BalanceDetails',
  components: {},
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  props: ['memberId'],
  data () {
    return {
      defaultColDef: {
        sortable: true,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      invoiceListData: [], // 默认数据源
      gridOptions: {},
      columnDefs: [
        // 表格列数据
        {
          headerName: '#',
          width: this.nowpx(0.04) + 'px',
          pinned: 'left',
          valueGetter: function (params) {
            return params.node ? params.node.rowIndex + 1 : null
          }
        },
        {
          headerName: '消费单据号',
          field: 'mcr_invoiceCode',
          filter: false,
          checkboxSelection: false,
          headerCheckboxSelectionFilteredOnly: false,
          headerCheckboxSelection: false,
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '会员姓名', // 列标题
          field: 'mem_memberName', // 列与数据源对应的字段
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '会员卡号',
          field: 'mem_memberCardNum',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '变更' + this.$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
          field: 'mcr_moneyCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          comparator: (a, b) => a - b,
          valueGetter: (p) => {
            if (!p.data.show_status) {
              return p.data.mcr_moneyCountStatus == 1 ? '+' + p.data.mcr_moneyCount : '-' + p.data.mcr_moneyCount
            } else {
              return p.data.mcr_moneyCount
            }
          }
        },

        {
          headerName: this.$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit + '来源',
          field: 'mcr_moneyCountSource',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: this.$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit + '状态',
          field: 'mcr_moneyCountStatus',
          filter: false,
          width: this.nowpx(0.08) + 'px',

          valueGetter: (p) => {
            if (!p.data.show_status) {
              return p.data.mcr_moneyCountStatus == 1 ? '增加' : '减少'
            }
          }
        },
        {
          headerName: '操作行为',
          field: 'mcr_operatingBehavior',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '操作员',
          field: 'user.username',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.1) + 'px',
          pinned: this.pinnedComputed('right')
        },
        {
          headerName: '时间',
          field: 'created_at',
          filter: false,
          width: this.nowpx(0.15) + 'px',
          valueGetter: this.createdAt,
          pinned: 'right'
        }
      ],
      localeText: this.$ag_grid_localeText,
      page: {
        pageIndex: 1,
        pSize: 20,
        pageTotal: 0
      },
      startTime: '',
      endTime: '',
      searchFrom: {
        userId: '',
        searchSerm: '',
        member_id: 0,
        created_at: '',
        updated_at: '',
        memberText: ''
      },
      libInStoreList: [],
      selectStoreData: []
    }
  },

  created () {
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  mounted () {},
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    // 列表自适应
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
    getDatalist () {
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
        .dispatch('invoice/getMoneyInvoiceList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data.list) {
              this.invoiceListData = res.data.list
              this.page.pageTotal = res.data.page.totalCount
            } else {
              this.invoiceListData = []
              this.page.pageTotal = 0
            }
            setTimeout(() => {
              this.setTopTabel(res.data.list)
            }, 200)
          }
        })
        .catch((error) => {})
    },
    countExport () {
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
        member_id: this.memberId,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('exports/getMoneyExport', obj)
        .then((res) => {
          if (res.code == 200) {
            window.location.href = res.data
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
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
          mcr_invoiceCode: '数据合计',
          mcr_moneyCount: '',
          show_status: true
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
          let plusNum = 0
          let lowerNum = 0
          for (var j in i) {
            oneRowData[j] = 0
            if (!i[j]) {
              data.forEach((value, key) => {
                if (parseInt(value.mcr_moneyCountStatus) == 1) {
                  plusNum += this.formatAmount(value[j])
                } else {
                  lowerNum += this.formatAmount(value[j])
                }
              })

              oneRowData[j] = '+' + this.formatAmount(plusNum) + '/-' + this.formatAmount(lowerNum)
            } else {
              oneRowData[j] = i[j]
            }
          }
          rowData.push(oneRowData)
        })
        return rowData
      }
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    createdAt (p) {
      if (!p.data.created_at) {
        return ''
      } else {
        return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm')
      }
    },
    // 重置
    resetBut () {
      this.searchFrom = {
        userId: '',
        searchSerm: '',
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
    exportBut () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-' + this.$q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_balanceUnit + '记录'
      })
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    }
  }
}
</script>
