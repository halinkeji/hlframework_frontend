<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="q-gutter-sm row col-shrink bg-white q-px-xs q-pb-md">
        <div class="col-12 col-md-2">
          <q-input outlined v-model="receipt" label="收款单据号/销货单据号" dense />
        </div>
        <div class="col-12 col-md-2">
          <q-select
            outlined
            option-value="id"
            option-label="ecp_name"
            emit-value
            map-options
            v-model="clientId"
            :options="clientList"
            dense
            label="客户"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-select
            outlined
            option-value="id"
            option-label="type"
            emit-value
            map-options
            v-model="payTypeId"
            :options="payType"
            dense
            label="付款类型"
          />
        </div>

        <div class="col-12 col-md-2">
          <q-input outlined v-model="startTime" label="开始时间" dense square readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" today-btn minimal>
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
                  <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
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
          <q-input outlined v-model="endTime" label="结束时间" dense square readonly>
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" today-btn minimal>
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
                  <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-btn color="primary" unelevated label="搜索" @click="getReceiptList()" />
        <q-btn color="warning" unelevated label="重置" @click="clearBut()" />
        <q-btn-dropdown color="primary" unelevated label="新增收款">
          <q-list>
            <q-item clickable v-close-popup :to="{ name: 'addErpRepayment', query: { typeId: 1 } }">
              <q-item-section>
                <q-item-label>销货收款</q-item-label>
              </q-item-section>
            </q-item>

            <q-item clickable v-close-popup @click="AddOtherRepay(2)">
              <q-item-section>
                <q-item-label>其他收款</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
        <q-btn color="primary" unelevated @click="exprotCsv" label="导出Csv文件" :disable="receiptList.length == 0" />
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table erp-repayment-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :gridOptions="gridOptions"
          :rowData="receiptList"
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

      <div class="col-shrink bg-white q-pb-md text-center">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
      <add-other-repay ref="addOtherRepayRef" v-if="isDialogStatus" @dataList="getReceiptList" />
    </div>
  </q-page>
</template>

<script>
import AddOtherRepay from './AddOtherRepay'
export default {
  name: 'repayment',
  components: { AddOtherRepay },
  data () {
    return {
      clientList: [],
      clientId: '',
      startTime: '',
      endTime: '',
      payTypeId: '',
      payType: [
        {
          id: 1,
          type: '销货收款'
        },
        {
          id: 2,
          type: '其他收款'
        }
      ],

      isDialogStatus: false,
      gridOptions: {},
      context: null,
      receiptList: [],
      columnDefs: [
        {
          headerName: '收款单据号',
          field: 'receipt_code',
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-repayment': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '客户名称',
          field: 'receipt_code',
          width: this.nowpx(0.08) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-repayment': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          valueGetter: (p) => {
            return p.data.ecp_name
          }
        },
        {
          headerName: '销货单据号',
          field: 'gii_inventoryInCode',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '业务类型',
          valueGetter: (p) => {
            if (p.data.err_type == 1) {
              return '销货收款'
            } else if (p.data.err_type == 2) {
              return '其他收款'
            }
          },
          field: 'receipt_code',
          width: this.nowpx(0.1) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-repayment': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '本次还款',
          field: 'err_pay_back',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '剩余金额',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.err_last_remainder - p.data.err_pay_back
          }
        },
        {
          headerName: '应收金额',
          field: 'receipt_code',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.err_receivable
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-repayment': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '折扣率',
          field: 'receipt_code',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.err_discount_rate
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-repayment': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '实收金额',
          field: 'receipt_code',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.err_money
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-repayment': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '收款备注',
          field: 'receipt_code',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.err_description
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span-erp-repayment': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '添加时间',
          field: 'receipt_code',
          pinned: this.pinnedComputed('right'),
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.11) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      receipt: ''
    }
  },

  mounted () {},
  created () {
    this.getReceiptList()
    this.getClientList()
  },
  computed: {},
  methods: {
    getClientList () {
      this.$store
        .dispatch('erpCustomer/getClient')
        .then((res) => {
          if (res.code == 200) {
            this.clientList = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    exprotCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-收款单记录'
      })
    },
    // 获取列表,搜索
    getReceiptList () {
      let startTime = 0
      let endTime = 0
      startTime = this.$q_date.formatDate(this.startTime, 'X')
      endTime = this.$q_date.formatDate(this.endTime, 'X')

      this.isDialogStatus = false
      const obj = {
        receipt: this.receipt,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize,
        clientId: this.clientId,
        payTypeId: this.payTypeId,
        startTime: startTime,
        endTime: endTime
      }
      this.$store
        .dispatch('repayment/getReceiptList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.receiptList = res.data ? res.data.list : []

            this.setTopTabel(this.receiptList)
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    AddOtherRepay (val) {
      this.isDialogStatus = true
      this.$nextTick(() => {
        this.$refs.addOtherRepayRef.init(val)
      })
    },
    clearBut () {
      this.receipt = ''
      this.endTime = ''
      this.startTime = ''
      this.payTypeId = ''
      this.clientId = ''
      this.getReceiptList()
    },

    // 获取当前每页显示数量
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getReceiptList()
    },
    // 当前页数
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getReceiptList()
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
        // params.api.sizeColumnsToFit();
      }
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },
    rowSpan (params) {
      const fields = [
        'receipt_code',
        'ecp_name'

        // "gii_note",
        // "gii_returnAmount",
        // "gii_returnQuantity",
        // "gii_total"
      ]
      const data = this.receiptList
      const row = params.data
      const rowIndex = params.node.rowIndex
      const property = params.colDef.field
      const cellValue = row[property]

      if (cellValue && fields.includes(property)) {
        const prevRow = data[rowIndex - 1]
        let nextRow = data[rowIndex + 1]
        let countRowspan = 0
        if (prevRow && prevRow[property] === cellValue) {
          return countRowspan
        } else {
          countRowspan = 1
          while (nextRow && nextRow[property] === cellValue) {
            nextRow = data[++countRowspan + rowIndex]
          }

          if (countRowspan > 1) {
            return countRowspan
          }
        }
      }
    },
    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          receipt_code: '数据合计',
          err_receivable: '',
          err_money: '',
          err_pay_back: '',
          err_last_remainder: '',
          bid: ''
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
            let bid
            if (!i[j]) {
              data.forEach((value, key) => {
                if ((j == 'err_money' && value.bid != bid) || (j == 'err_receivable' && value.bid != bid)) {
                  oneRowData[j] += this.formatAmount(value[j])
                } else if (!(j == 'err_money' || j == 'err_receivable')) {
                  oneRowData[j] += this.formatAmount(value[j])
                }
                bid = value.bid
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
    // 限制保留小数
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>

<style>
.erp-repayment-table .cell-span-erp-repayment {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
