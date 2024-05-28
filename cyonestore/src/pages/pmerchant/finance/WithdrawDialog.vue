<template>
  <q-dialog v-model="qrcodeDialog" persistent>
    <q-card
      flat
      :style="{
        width: $q.screen.width * 0.8 + 'px',
        'min-width': $q.screen.width * 0.8 + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="row col-shrink bg-white q-px-xs q-py-xs q-gutter-sm">
          <div class="text-subtitle1">提现单据</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="closeDialog" />
        </div>

        <div class="row col-shrink bg-white q-px-xs q-pb-md q-gutter-sm">
          <div class="col">
            <q-item class="bg-grey-2">
              <q-item-section>
                <q-item-label>结算单据数</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold text-primary text-right">{{ formatAmount(withdrawCount) }}</q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item class="bg-grey-2">
              <q-item-section>
                <q-item-label>提现费率</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold text-primary text-right">{{ formatAmount(precedureFeeRatio) }} % </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item class="bg-grey-2">
              <q-item-section>
                <q-item-label>最低提现金额</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold text-primary text-right">{{ formatAmount(minWithdrawAmount) }}<span class="text-caption text-black">{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span> </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item class="bg-grey-2">
              <q-item-section>
                <q-item-label>可提现金额</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold text-primary text-right">{{ formatAmount(handleWithdrawAmount) }}<span class="text-caption text-black">{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span> </q-item-label>
              </q-item-section>
            </q-item>
          </div>

           <div class="col">
            <q-item class="bg-grey-2">
              <q-item-section>
                <q-item-label>提现金额</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold text-primary text-right">{{ formatAmount(withdrawForm.pdw_arrival_amount) }}<span class="text-caption text-black">{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span> </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item class="bg-grey-2">
              <q-item-section>
                <q-item-label>手续费</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold text-primary text-right">{{
                  formatAmount(withdrawForm.pdw_service_fee)
                }}<span class="text-caption text-black">{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span> </q-item-label>
              </q-item-section>
            </q-item>
          </div>

          <div class="col">
            <q-item class="bg-grey-2">
              <q-item-section>
                <q-item-label>实到账金额</q-item-label>
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-subtitle1 text-weight-bold text-primary text-right">{{
                  formatAmount(withdrawForm.pdw_arrival_amount)
                }} <span class="text-caption text-black">{{ $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneyUnit }}</span>  </q-item-label>
              </q-item-section>
            </q-item>
          </div>
        </div>
        <div class="col-shrink q-px-xs full-height">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="notSettleRecord"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          :localeText="localeText"
          :gridOptions="gridOptions"
          @rowSelected="rowSelectedAg"
        ></ag-grid-vue>
        </div>

        <div class="col-shrink bg-white q-py-sm text-center">
          <q-btn
            @click="saveWithdrawData"
            :disable="withdrawForm.pdw_arrival_amount > minWithdrawAmount ? false : true"
            color="primary"
            class="q-px-xl"
            unelevated
            >提现</q-btn
          >
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'WithdrawDialog',
  data () {
    return {
      qrcodeDialog: false,
      currentLibId: 0,
      withdrawForm: {
        pdw_amount: 0,
        pdw_transfer_method: 0,
        pdw_status: 1,
        pdw_withdraw_lib_id: 0,
        pdw_withdraw_lib_name: '',
        pdw_service_fee: 0,
        pdw_arrival_amount: 0
      },
      minWithdrawAmount: 0,
      precedureFeeRatio: 0,
      withdrawCount: 0,
      handleWithdrawAmount: 0,
      notSettleRecord: [],
      columnDefs: [
        // 表格列数据
        {
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        // {
        //   headerName: '平台',
        //   field: 'platform.name'
        // },
        // {
        //   headerName: '收入方',
        //   field: 'expendStore.name'
        // },
        {
          headerName: '状态',
          field: 'dr_finance_status',
          valueGetter: (p) => {
            return this.financeStatusItem[p.data.dr_finance_status]
          }
        },

        // {
        //   headerName: '商家',
        //   field: 'incomeStore.name'
        // },
        {
          headerName: '金额',
          field: 'dr_amount'
        },
        {
          headerName: '退款金额',
          field: 'dr_refund_amount'
        },
        {
          headerName: '收入类型',
          field: 'dr_finance_type',
          valueGetter: (p) => {
            return this.financeTypeItem[p.data.dr_finance_type]
          }
        },
        {
          headerName: '结算状态',
          field: 'dr_settle_status',
          valueGetter: (p) => {
            return this.settleStatusItem[p.data.dr_settle_status]
          }
        },
        {
          headerName: '时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        }

        // {
        //   headerName: '操作',
        //   field: 'id',
        //   cellRendererFramework: 'Operating'
        // }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      gridOptions: {},
      settleStatusItem: this.$store.state.pmerchantManage.settleStatusItem,
      financeTypeItem: this.$store.state.pmerchantManage.financeTypeItem,
      financeStatusItem: this.$store.state.pmerchantManage.financeStatusItem,
      dataListSelections: [],
      context: null,
      localeText: this.$ag_grid_localeText

    }
  },
  mounted () {},
  created () {},
  computed: {},
  methods: {
    init (libId, name) {
      this.context = this
      this.qrcodeDialog = true
      this.currentLibId = libId
      this.withdrawForm.pdw_withdraw_lib_id = libId
      this.withdrawForm.pdw_withdraw_lib_name = name

      this.$nextTick(() => {
        this.getWithdrawCount()
      })
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    rowSelectedAg (p) {
      const that = this
      this.dataListSelections = p.api.getSelectedRows()
      const dataListSelections = this.dataListSelections
      this.withdrawCount = dataListSelections.length
      if (dataListSelections && dataListSelections.length > 0) {
        let taotalAmount = 0
        dataListSelections.forEach(item => {
          taotalAmount += that.formatAmount(that.formatAmount(item.dr_amount) - that.formatAmount(item.dr_refund_amount))
        })

        this.$nextTick(() => {
          this.withdrawForm.pdw_amount = taotalAmount
          this.withdrawForm.pdw_service_fee = that.formatAmount(taotalAmount * (this.formatAmount(this.precedureFeeRatio) * 0.01))
          this.withdrawForm.pdw_arrival_amount = that.formatAmount(taotalAmount - this.withdrawForm.pdw_service_fee)
        })
      } else {
        this.withdrawForm.pdw_service_fee = 0
        this.withdrawForm.pdw_amount = 0
        this.withdrawForm.pdw_arrival_amount = 0
      }
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    getWithdrawCount () {
      const that = this
      const obj = {
        relation_lib_id: this.currentLibId
      }
      this.$store
        .dispatch('pmerchantManage/getMechantWithdrawCount', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            const resultData = res.data
            this.minWithdrawAmount = resultData.minWithdrawAmount
            this.precedureFeeRatio = resultData.precedureFeeRatio
            this.notSettleRecord = resultData.notSettleRecord
            that.handleWithdrawAmount = 0
            if (resultData.notSettleRecord && resultData.notSettleRecord.length > 0) {
              resultData.notSettleRecord.forEach(item => {
                that.handleWithdrawAmount += that.formatAmount(that.formatAmount(item.dr_amount) - that.formatAmount(item.dr_refund_amount))
              })
            }
          }
        })
        .catch((error) => {})
    },
    saveWithdrawData () {
      const checkOrderArr = this.dataListSelections.map(item => {
        return item.id
      })
      const obj = {
        ...this.withdrawForm,
        checkOrderArr
      }
      this.$store
        .dispatch('pmerchantManage/setMechantWithdrawData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              message: '成功',
              caption: '申请成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.closeDialog()
          } else {
            this.$q.notify({
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '失败',
              caption: res.message,
              color: 'red'
            })
          }
        })
        .catch((error) => {})
    },

    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    closeDialog () {
      this.qrcodeDialog = false
      this.$emit('closeDialog')
    }
  }
}
</script>

<style></style>
