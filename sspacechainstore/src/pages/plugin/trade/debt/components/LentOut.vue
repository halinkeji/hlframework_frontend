<template>
  <div>
    <q-card flat class="q-pb-sm">
      <div class="q-gutter-xs row q-mb-sm">
        <q-btn
          color="blue"
          class="col-12 col-md-1 q-mt-sm"
          unelevated
          dense
          v-if="authorityMeta('debtReturn')"
          :disable="dataListSelections.length > 0 ? false : true"
          @click="addRepayData"
          label="生成还账记录"
        />
        <q-input
          outlined
          dense
          class="col-12 col-md-2 q-mt-sm"
          v-model="invoiceCode"
          label="单据号"
        />
        <q-input
          outlined
          dense
          class="col-12 col-md-2 q-mt-sm"
          v-model="queryConditions"
          label="会员姓名/会员卡号"
        />
        <q-input
          outlined
          dense
          class="col-12 col-md-2 q-mt-sm"
          label="开始时间"
          v-model="startTime"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="startTime" mask="YYYY-MM-DD HH:mm:ss">
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

        <q-input
          outlined
          dense
          class="col-12 col-md-2 q-mt-sm"
          label="结束时间"
          v-model="endTime"
          readonly
        >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="endTime" mask="YYYY-MM-DD HH:mm:ss">
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
        <q-btn
          color="primary"
          unelevated
          class="col-12 col-md-1 q-mt-sm"
          @click="getLentList"
          label="查询"
        />
        <q-btn
          color="warning"
          class="col-12 col-md-1 q-mt-sm"
          unelevated
          @click="clearButton"
          label="重置"
        />
      </div>
    </q-card>
    <hl-auto-height class="q-mt-sm">
      <template slot="body">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="lendListData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="40"
          @first-data-rendered="onFirstDataRendered"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          :localeText="localeText"
          :gridOptions="gridOptions"
          @rowSelected="rowSelectedAg"
          :singleClickEdit="true"
          :stopEditingWhenGridLosesFocus="true"
        ></ag-grid-vue>
      </template>
    </hl-auto-height>
    <div class="flex flex-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pageSize"
        :total="page.pageTotal"
      ></hl-pagination>
    </div>
    <debt-info
      ref="debtRef"
      v-if="debtStatus"
      @getMethods="getLentList"
    ></debt-info>
  </div>
</template>
<script>
import DebtInfo from './DebtInfo.vue'
export default {
  name: 'LentOut',
  components: { DebtInfo },
  data () {
    return {
      queryConditions: '',
      invoiceCode: '',
      debtStatus: false,
      startTime: '',
      endTime: '',
      context: '',
      gridOptions: {},
      lendListData: [],
      columnDefs: [
        {
          filter: false,
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: this.nowpx(0.02) + 'px'
        },
        {
          headerName: '单据号',
          field: 'tsd_invoice_code',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员姓名',
          field: 'tsd_member_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'tsd_member_card_number',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '借出' + this.$q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
          field: 'tsd_lend_money_count',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '当前门店',
          field: 'inStore.name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员所属',
          field: 'outStore.name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '时间',
          field: 'created_at',
          valueGetter: p => {
            return this.$q_date.formatDate(
              p.data.created_at * 1000,
              'YYYY-MM-DD HH:mm:ss'
            )
          },
          width: this.nowpx(0.1) + 'px'
        }
      ],
      dataListSelections: [],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.context = this
  },
  mounted () {
    this.getLentList()
  },
  computed: {},
  methods: {
    getLentList () {
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
      const obj = {
        endTime,
        startTime,
        invoiceCode: this.invoiceCode,
        queryConditions: this.queryConditions,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        type: 1
      }
      this.$store
        .dispatch('tradeDebt/getListData', obj)
        .then(res => {
          if (res.code == 200) {
            this.lendListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch(error => {
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
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    clearButton () {
      this.queryConditions = ''
      this.startTime = ''
      this.endTime = ''
      this.invoiceCode = ''
      this.getLentList()
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getLentList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getLentList()
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 550
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    addRepayData () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      this.debtStatus = true
      this.$nextTick(() => {
        this.$refs.debtRef.showData(dataListSelections)
      })
    },
    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map(obj => {
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
