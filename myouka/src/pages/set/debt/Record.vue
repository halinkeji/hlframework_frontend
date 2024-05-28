<template>
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 ">
        <div class="row q-gutter-xs q-mb-md">
          <q-input outlined dense v-model="name" label="可搜索:会员卡号/手机号/昵称/姓名" class="col-12 col-md-2" />
          <q-select
            class="col-12 col-md-2"
            outlined
            option-value="value"
            option-label="label"
            emit-value
            map-options
            v-model="type"
            :options="options"
            dense
            label="类型"
          />
          <q-btn unelevated color="primary" dense label="查询" class="q-px-md" @click="getRecordList()" />
          <q-btn unelevated color="grey" dense label="重置" @click="clearButton()" class="q-px-md" />
        </div>
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
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white  q-py-sm text-center">
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
</template>
<script>
import AgTypeBg from './components/AgTypeBg'
import AgOperator from './components/AgOperator'
export default {
  name: 'DebtRecord',
  components: { AgTypeBg, AgOperator },
  data () {
    return {
      name: '',
      type: '',
      components: { AgTypeBg, AgOperator },
      localeText: this.$ag_grid_localeText,
      context: '',
      options: [
        {
          label: '欠账',
          value: 1
        },
        {
          label: '已还账',
          value: 2
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      gridOptions: {},
      columnDefs: [

        {
          headerName: '单据号',
          field: 'odr_invoice_code'
        },
        {
          headerName: '姓名',
          field: 'odr_member_real_name'
        },
        {
          headerName: '昵称',
          field: 'odr_member_name'
        },

        {
          headerName: '卡号',
          field: 'odr_member_card_num'
        },
        {
          headerName: '手机号',
          field: 'odr_member_mobile'
        },
        {
          headerName: '类型',
          field: 'odr_consume_type_name'
        },
        {
          headerName: '类型',
          field: 'odr_debt_type',
          cellRendererFramework: 'AgTypeBg'
        },
        {
          headerName: '金额',
          field: 'odr_debt_amount'
        },
        {
          headerName: '欠款时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm')
          }
        },
        {
          headerName: '还款时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.odr_repayment_time * 1000, 'YYYY-MM-DD HH:mm')
          }
        },
        {
          headerName: '操作员',
          field: 'user.username'
        }
      ],
      debtRecordData: [],
      openCheckoutPageIf: false,
      dabtCheckOutId: 0
    }
  },
  created () {
    this.getRecordList()
    this.context = this
  },
  methods: {
    getRecordList () {
      const obj = {
        name: this.name,
        type: this.type,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('debt/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.debtRecordData = res.data ? res.data.list : [] // 三元运算赋值
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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
    // 计算窗口
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 295
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 重置按钮方法
    clearButton () {
      this.name = ''
      this.type = ''
      this.getRecordList()
    },
    // 隐藏滚动条
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    // 分页
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getRecordList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getRecordList()
    },
    checkoutWindow (type, amountsPayable, memberId, return_param, id) {
      this.dabtCheckOutId = id
      this.openCheckoutPageIf = true
      this.$nextTick(() => {
        this.$refs.openCheckoutCounterPage.checkoutPageReceive(type, amountsPayable, parseInt(memberId), return_param)
      })
    },
    closeCheckoutPopup () {
      this.openCheckoutPageIf = false
    },
    paySuccessCallBack (v) {
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
            this.getRecordList()
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
    }
  }
}
</script>
