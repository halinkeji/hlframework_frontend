<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row q-gutter-sm items-start q-mt-sm">
          <div class="col-3">
            <q-select
              outlined
              option-value="id"
              option-label="ecp_name"
              emit-value
              map-options
              v-model="formData.client_id"
              :options="clientList"
              dense
              label="请选择客户"
              :rules="[(val) => !!val || '请选择客户']"
            />
          </div>

          <q-btn color="primary" unelevated @click="chooseInvoice(5)" label="选择单据" />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="invoiceData"
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
          :singleClickEdit="true"
          :stopEditingWhenGridLosesFocus="true"
        ></ag-grid-vue>
      </div>

      <div class="q-gutter-x-xs  col-shrink bg-white q-px-xs q-pt-sm q-pb-lg">
        <div class="row q-gutter-sm q-px-xs">
          <div class="col-2">
            <q-input
              class="col-6 q-px-xs"
              outlined
              @input="moneyCalculation()"
              v-model="formData.err_discount_rate"
              label="折扣率"
              dense
              :rules="[(val) => /^([1-9][0-9]{0,1}|100)$/.test(val) || '请输入正确的折扣率']"
            />
          </div>

          <div class="col-2">
            <q-input outlined v-model="formData.err_discount_money" label="折扣额" disable dense :error="false" />
          </div>
          <div class="col">
            <q-input outlined  v-model="formData.err_description" label="备注" dense  :error="false" />
          </div>
        </div>

        <div class="row q-gutter-sm q-px-xs">
          <q-btn color="green" class="q-px-xl" unelevated> 本次收款：{{ formData.err_money }} </q-btn>
          <q-space />
          <q-btn color="primary" class="q-px-xl" unelevated :disable="formData.err_money == 0" @click="saveData()" label="确认收款" />
          <q-btn color="grey" class="q-px-xl" unelevated :to="{ name: 'erpRepayment' }" label="返回" />
        </div>
      </div>

      <hl-choose-invoice
        v-if="chooseInvoiceVisible"
        ref="chooseInvoiceList"
        @getChooseInvoiceData="receivingAdministrator"
        @closeChooseInvoice="closeChooseInvoice"
      ></hl-choose-invoice>
    </div>
  </q-page>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      payBack: 0,
      chooseInvoiceVisible: false,
      clientList: [], // 客户列表
      formData: {
        client_id: '',
        err_type: 1,
        err_discount_rate: 100,
        err_discount_money: 0,
        err_description: '',
        err_receivable: '',
        err_money: 0
      },
      // Ag
      context: null,
      gridOptions: {},
      invoiceData: [],
      columnDefs: [
        {
          headerName: '单据号',
          field: 'gii_inventoryInCode',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '折扣率',
          field: 'gii_discountRate',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '折扣额',
          field: 'gii_discountAmount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '剩余欠款',
          field: 'gii_foldClause',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '本次还款金额',
          editable: true,
          field: 'err_pay_back',
          onCellValueChanged: this.changePayBack,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '订单添加时间',
          field: 'receipt_code',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText
    }
  },
  mounted () {},
  created () {
    this.getClientList()
  },
  computed: {},
  methods: {
    // 获取列表,搜索
    getClientList () {
      this.$store
        .dispatch('repayment/getClient')
        .then((res) => {
          if (res.code == 200) {
            this.clientList = res.data ? res.data : []
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
    // 选择单据
    chooseInvoice (val) {
      if (!this.formData.client_id) {
        this.$q.notify({
          message: '失败',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请先选择客户',
          color: 'red'
        })
      } else {
        const transport = {
          type: val,
          clientId: this.formData.client_id
        }
        this.chooseInvoiceVisible = true
        this.$nextTick(() => {
          this.$refs.chooseInvoiceList.getInvoice(transport)
        })
      }
    },
    // 选择返回的数据
    receivingAdministrator (val) {
      this.invoiceData = val
    },
    // 计算欠款还款
    changePayBack (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^[0-9]+(.[0-9]{1,2})?$/
      if (!regu.test(data.err_pay_back)) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请输入正确的还款金额  ',
          color: 'red'
        })
        data.err_pay_back = 0
        data.err_remainder = -1
      } else if (parseFloat(data.err_pay_back) > parseFloat(data.gii_foldClause)) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请输入正确的还款金额',
          color: 'red'
        })
        data.err_pay_back = 0
        data.err_remainder = -1
      } else {
        data.err_remainder = parseFloat(data.gii_foldClause) - parseFloat(data.err_pay_back)
        if (!data.err_remainder) {
          data.err_remainder = '0'
        }
      }
      itemsToUpdate.push(data)
      p.api.applyTransaction({ update: itemsToUpdate })
      this.totilMoney()
    },

    totilMoney () {
      this.formData.err_receivable = 0
      this.invoiceData.forEach((item) => {
        if (item.err_pay_back) {
          this.formData.err_receivable = parseFloat(this.formData.err_receivable) + parseFloat(item.err_pay_back)
        }
      })
      this.moneyCalculation()
    },
    moneyCalculation () {
      const payMoney = (this.formData.err_receivable * (100 - this.formData.err_discount_rate)) / 100
      this.formData.err_discount_money = Math.round(payMoney * 100) / 100
      const money = (this.formData.err_receivable * this.formData.err_discount_rate) / 100
      this.formData.err_money = Math.round(money * 100) / 100
    },
    saveData () {
      const obj = {
        receipt: this.formData,
        record: this.invoiceData
      }
      this.$store
        .dispatch('repayment/addData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '收款成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.$router.push({ name: 'erpRepayment' })
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
    // 关闭
    closeChooseInvoice () {
      this.chooseInvoiceVisible = false
    },
    // Ag
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
    }
  }
}
</script>
