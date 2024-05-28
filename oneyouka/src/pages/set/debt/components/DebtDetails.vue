<template>
  <div class="flex flex-wrap">
    <q-dialog v-model="debtDetails">
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * 1) + 'px',
          'max-width': parseInt(this.$q.screen.width * 1) + 'px',
        }"
      >
        <q-toolbar>
          <q-toolbar-title class="text-center"> 挂账详情</q-toolbar-title>
          <q-btn flat round dense icon="close" v-close-popup />
        </q-toolbar>
        <div class="q-ma-sm">
          <div class="row">
            <div class="col-12 col-md-2 q-mr-sm q-mt-sm">
              <q-input label="请输入单据号" outlined v-model="searchFrom.searchSerm" dense />
            </div>
            <div class="col-12 col-md-2 q-mt-sm q-mr-sm">
              <q-input label="请输入会员卡号|电话号|姓名" outlined v-model="searchFrom.memberText" dense />
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

            <q-btn @click="debtDetailsBut" color="primary" class="q-mt-sm col-12 col-md-1 q-mr-sm" unelevated label="搜索" />
            <q-btn @click="resetBut" color="warning" class="q-mt-sm col-12 col-md-1 q-mr-sm" unelevated label="重置" />
          </div>
          <hl-auto-height class="q-mt-sm">
            <template slot="body">
              <ag-grid-vue
                ref="shoppingAgGridTable"
                :components="components"
                :gridOptions="gridOptions"
                class="ag-theme-balham ag-grid-table full-height hl_header_center hl_content_center"
                :columnDefs="columnDefs"
                :suppressMovableColumns="true"
                :defaultColDef="defaultColDef"
                :rowData="debtList"
                rowSelection="multiple"
                :rowDragManaged="true"
                colResizeDefault="shift"
                :animateRows="false"
                :floatingFilter="false"
                :enableCellTextSelection="true"
                :suppressCellSelection="true"
                :suppressRowClickSelection="true"
                :rowMultiSelectWithClick="true"
                @first-data-rendered="onFirstDataRendered"
                rowHeight="40"
                :context="context"
                :stopEditingWhenGridLosesFocus="true"
                :singleClickEdit="true"
                :localeText="localeText"
              ></ag-grid-vue>
            </template>
          </hl-auto-height>
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
        </div>
        <q-card-actions align="right" class="q-pb-md">
          <q-btn unelevated label="取消" @click="debtDetails = false" class="text-right" />
        </q-card-actions>
      </q-card>
      <hl-checkout
        @closeCheckoutPopup="closeCheckoutPopup"
        @paySuccessCallBack="paySuccessCallBack"
        ref="openCheckoutCounterPage"
        v-if="openCheckoutPageIf"
      ></hl-checkout>
    </q-dialog>
  </div>
</template>
<script>
import AgDebtOperator from './AgDebtOperator'
export default {
  name: 'DebtDetails',
  props: ['type', 'memberId'],
  components: { AgDebtOperator },
  data () {
    return {
      debtDetails: false,
      debtList: [],
      gridOptions: [],
      components: { AgDebtOperator },
      columnDefs: [
        {
          headerName: '消费单据号',
          field: 'sc_invoiceCode',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员姓名',
          field: 'sc_memberName',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '会员卡号',
          field: 'sc_memberCardNum',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '实收金额',
          field: 'sc_realMoneyCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_realMoneyCount > 0 ? p.data.sc_realMoneyCount : 0
          }
        },
        {
          headerName: '应付总金额',
          field: 'sc_handleMoneyCount',
          filter: false,
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return p.data.sc_handleMoneyCount > 0 ? p.data.sc_handleMoneyCount : 0
          }
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
          headerName: '备注',
          field: 'sc_note',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作',
          field: '',
          cellRendererFramework: 'AgDebtOperator',
          width: this.nowpx(0.1) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      startTime: '',
      endTime: '',
      searchFrom: {
        searchSerm: '',
        created_at: '',
        updated_at: ''
      },
      context: null,
      openCheckoutPageIf: false,
      dabtCheckOutId: 0,
      localeText: this.$ag_grid_localeText
    }
  },

  mounted () {},
  created () {
    this.context = this
  },
  computed: {},
  methods: {
    debtDetailsBut () {
      const obj = {
        ...this.searchFrom,
        member_id: this.memberId,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        sc_consumeType: this.type
      }
      this.$store
        .dispatch('debt/getConsumeList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.debtDetails = true
            this.debtList = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          } else {
            this.hangDataList = []
          }
        })
        .catch((error) => {})
    },

    // 自适应列宽
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    // 分页
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.debtDetailsBut()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.debtDetailsBut()
    },
    checkoutWindow (type, amountsPayable, memberId, id) {
      this.dabtCheckOutId = id
      this.openCheckoutPageIf = true
      this.$nextTick(() => {
        this.$refs.openCheckoutCounterPage.checkoutPageReceive(type, amountsPayable, parseInt(memberId))
      })
    },
    resetBut () {
      this.searchFrom = {
        searchSerm: '',
        created_at: '',
        updated_at: '',
        memberText: ''
      }
      this.startTime = ''
      this.endTime = ''
      this.debtDetailsBut()
    },
    closeCheckoutPopup () {
      this.openCheckoutPageIf = false
    },
    paySuccessCallBack (v) {
      console.log('v', v)
      const params = {
        id: this.dabtCheckOutId,
        pay: v
      }
      this.openCheckoutPageIf = false
      this.$store
        .dispatch('debt/debtSetData', params)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '结账成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
            this.debtDetailsBut()
          } else {
            this.$q.notify({
              message: '失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
          }
        })
        .catch((error) => {})
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    }
  }
}
</script>
