<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
      <hl-card-reading ref="memberCardReading" navType="horizontal" @refreshDataList="getMemberInfo"></hl-card-reading>
    </div>

    <div class="col-shrink q-px-xs full-height">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="debtRecordData"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        @first-data-rendered="adaptiveTable"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        rowHeight="40"
        :context="context"
        :components="components"
        rowSelection="multiple"
        :localeText="localeText"
        @rowSelected="rowSelectedAg"
        :suppressCellSelection="true"
        :suppressRowClickSelection="false"
        :rowMultiSelectWithClick="true"
      ></ag-grid-vue>
    </div>

    <div class="col-shrink bg-white q-pb-md q-gutter-md q-mt-xs text-center">
      <q-item>
        <q-item-section>
          <q-item-label class="text-h5 text-orange text-weight-bold">{{ calculateAmount }}</q-item-label>
          <q-item-label caption lines="1">本次还款金额汇总</q-item-label>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-h5 text-orange text-weight-bold">
            <q-btn color="primary" size="lg" @click="settleDebtData" unelevated label="结算" />
          </q-item-label>
        </q-item-section>
      </q-item>
    </div>
  </div>
</template>
<script>
import AgTypeBg from './components/AgTypeBg'
import AgOperator from './components/AgOperator'
export default {
  name: 'DebtRepayment',
  components: { AgTypeBg, AgOperator },
  data () {
    return {
      name: '',
      type: '',
      components: { AgTypeBg, AgOperator },
      localeText: this.$ag_grid_localeText,
      context: '',

      gridOptions: {},
      columnDefs: [
        {
          headerName: '',
          checkboxSelection: true, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          width: 50
        },
        {
          headerName: '单据号',
          field: 'odr_invoice_code'
        },

        {
          headerName: '类型',
          field: 'odr_consume_type_name'
        },

        {
          headerName: '金额',
          field: 'odr_debt_amount'
        },
        {
          headerName: '时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm')
          }
        }
      ],
      debtRecordData: [],
      openCheckoutPageIf: false,
      dabtCheckOutId: 0,
      memberId: '',
      selectDebtData: []
    }
  },
  computed: {
    calculateAmount () {
      const that = this
      return _.sumBy(that.selectDebtData, function (o) {
        return that.formatAmount(o.odr_debt_amount)
      })
    }
  },
  created () {},
  methods: {
    settleDebtData () {
      this.$q.dialog({
        title: '确认还款？',
        message: '请核对消费信息，确认无误后点击确认按钮?',
        cancel: true,
        persistent: true
      }).onOk(() => {
        const obj = {
          selectDebtData: this.selectDebtData
        }
        this.$store
          .dispatch('debt/setSettleInvoice', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '成功还款' + res.data + '条欠款单据。',
                icon: 'ion-checkmark-circle-outline',
                color: 'green',
                position: 'top-right'
              })
              this.selectDebtData = []
              this.debtRecordData = []
              this.memberId = 0
              this.$refs.memberCardReading.emptyMemberCardInfo()
            }
          })
          .catch((error) => {
            this.$q.notify({
              message: '失败',
              caption: error.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
          })
      }).onOk(() => {
        // console.log('>>>> second OK catcher')
      }).onCancel(() => {
        // console.log('>>>> Cancel')
      }).onDismiss(() => {
        // console.log('I am triggered on both OK and Cancel')
      })
    },
    rowSelectedAg (p) {
      this.selectDebtData = p.api.getSelectedRows()
    },
    getRecordList () {
      const obj = {
        memberId: this.memberId
      }
      this.$store
        .dispatch('debt/getMemberArrearsData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.debtRecordData = res.data ? res.data : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    getMemberInfo (val) {
      if (val) {
        if (val.id) {
          this.memberId = val.id
          this.$nextTick(() => {
            this.getRecordList()
          })
        }
      }
    },
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
