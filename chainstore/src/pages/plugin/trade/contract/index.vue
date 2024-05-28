<template>
  <div>
    <div class="row q-col-gutter-md ">
      <div class="col-4">
        <q-card flat bordered class="text-white  q-mt-sm">
          <q-card-section class="bg-primary">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">总合同金额:</div>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <div class="text-h4 text-grey-8 text-center q-my-lg">
            {{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ formatAmount(contractTotal.contractCount) }}
          </div>
        </q-card>
      </div>
      <div class="col-4 ">
        <q-card flat bordered class="text-white  q-mt-sm">
          <q-card-section class="bg-red-5">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">总解冻金额:</div>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <div class="text-h4 text-grey-8 text-center q-my-lg">
            {{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{ formatAmount(contractTotal.thawMessageCount) }}
          </div>
        </q-card>
      </div>
      <div class="col-4">
        <q-card flat bordered class="text-white  q-mt-sm">
          <q-card-section class="bg-positive">
            <div class="row items-center no-wrap">
              <div class="col">
                <div class="text-h6">总剩余解冻金额:</div>
              </div>
            </div>
          </q-card-section>
          <q-separator />
          <div class="text-h4 text-grey-8 text-center q-my-lg">
            {{ $q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}{{
              formatAmount(
                formatAmount(contractTotal.contractCount) -
                  formatAmount(contractTotal.thawMessageCount)
              )
            }}
          </div>
        </q-card>
      </div>
    </div>
    <q-card flat class=" q-pa-md q-mt-sm">
      <div class="q-gutter-xs row q-mb-sm">
        <q-input
          outlined
          dense
          class="col-12 col-md-2 q-mt-sm"
          v-model="seacherFrom.contractNumber"
          label="合同编号"
        />
        <q-input
          outlined
          dense
          class="col-12 col-md-2 q-mt-sm"
          v-model="seacherFrom.clientCompany"
          label="公司名称"
        />
        <q-select
          dense
          outlined
          class="col-12 col-md-2 q-mt-sm"
          v-model="seacherFrom.payType"
          :options="statusData"
          label="缴纳类型"
          emit-value
          map-options
        />

        <q-input
          outlined
          dense
          class="col-12 col-md-3 q-mt-sm"
          v-model="seacherFrom.queryConditions"
          label="客户姓名/客户手机号/会员姓名/会员卡号"
        />
        <q-input
          outlined
          dense
          class="col-12 col-md-2 q-mt-sm"
          v-model="seacherFrom.salesName"
          label="销售姓名"
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
          @click="getContractList"
          label="查询"
        />
        <q-btn
          color="warning"
          class="col-12 col-md-1 q-mt-sm"
          unelevated
          @click="clearBut"
          label="重置"
        />
        <q-btn
          color="blue"
          class="col-12 col-md-1 q-mt-sm"
          unelevated
          dense
          v-if="authorityMeta('contractAdd')"
          :to="{ name: 'addContract' }"
          label="新增"
        />
      </div>
    </q-card>
    <hl-auto-height class="q-mt-sm">
      <template slot="body">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="contractListData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :localeText="localeText"
          :context="context"
          @first-data-rendered="adaptiveTable"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="40"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
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
  </div>
</template>
<script>
import AgButton from './components/AgButton.vue'
export default {
  name: 'tradeContract',
  components: {
    AgButton
  },
  data () {
    return {
      addPoppupStatus: false,
      seacherFrom: {
        queryConditions: '',
        contractNumber: '',
        salesName: '',
        payType: '',
        clientCompany: '',
        type: 1
      },
      context: '',
      startTime: '',
      endTime: '',
      gridOptions: {},
      dataListSelections: [],
      contractListData: [],
      statusData: this.$store.state.tradeContract.statusData,
      columnDefs: [
        {
          headerName: '合同编号',
          field: 'ptc_contract_number',
          tooltipField: 'ptc_contract_number',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '合同金额(' + this.$q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneySymbol + ')',
          field: 'ptc_contract_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '信息费',
          field: 'ptc_info_cost',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '公司名称',
          field: 'ptc_client_company',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '类型',
          field: 'ptc_pay_type',
          valueGetter: p => {
            switch (parseInt(p.data.ptc_pay_type)) {
              case 1:
                return '全部缴纳'
              case 2:
                return '批次缴纳'
            }
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '会员姓名',
          field: 'mem_memberName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'mem_memberCardNum',
          width: this.nowpx(0.09) + 'px'
        },

        {
          headerName: '客户手机号',
          field: 'ptc_client_phone',
          width: this.nowpx(0.09) + 'px'
        },
        {
          headerName: '客户姓名',
          field: 'ptc_client_name',
          width: this.nowpx(0.08) + 'px'
        },

        {
          headerName: '销售姓名',
          field: 'ptc_sales_name',
          width: this.nowpx(0.08) + 'px'
        },
        // {
        //   headerName: "货物信息",
        //   field: "ptc_goods_content",
        //   width: this.nowpx(0.1) + "px"
        // },
        {
          headerName: '备注',
          field: 'ptc_remarks',

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
        },

        {
          headerName: '操作',
          field: 'id',
          cellRendererFramework: 'AgButton',
          width: this.nowpx(0.12) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      contractTotal: {}
    }
  },
  created () {
    this.context = this
  },
  mounted () {
    this.getContractList()
    this.getListTotal()
  },
  computed: {},
  methods: {
    clearBut () {
      this.seacherFrom.queryConditions = ''
      this.seacherFrom.contractNumber = ''
      this.seacherFrom.clientCompany = ''
      this.seacherFrom.salesName = ''
      this.seacherFrom.payType = ''
      this.startTime = ''
      this.endTime = ''
      this.getContractList()
    },
    getContractList () {
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
      const params = {
        ...this.seacherFrom,
        endTime,
        startTime,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }

      this.$store
        .dispatch('tradeContract/getListData', params)
        .then(res => {
          if (res.code == 200) {
            this.contractListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.dataListSelections = {}
          }
        })
        .catch(res => {})
    },
    getListTotal () {
      this.$store
        .dispatch('tradeInfo/getListTotal')
        .then(res => {
          if (res.code == 200) {
            this.contractTotal = res.data ? res.data : {}
          }
        })
        .catch(res => {})
    },

    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getContractList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getContractList()
    },

    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 550
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
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
