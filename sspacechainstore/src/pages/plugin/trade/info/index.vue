<template>
  <div class="q-pa-sm">
    <q-card flat class=" q-pa-md ">
      <div class="q-gutter-xs row q-mb-sm">
        <q-input
          outlined
          dense
          class="col-12 col-md-2 q-mt-sm"
          v-model="contractNumber"
          label="合同编号"
        />
        <q-btn
          color="primary"
          unelevated
          class="col-12 col-md-1 q-mt-sm"
          @click="getInfoList"
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
          v-if="authorityMeta('infoAdd')"
          :to="{ name: 'addTradeInfo' }"
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
          rowHeight="60"
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
export default {
  name: 'tradeInfo',
  components: {},
  data () {
    return {
      contractNumber: '',
      context: '',
      gridOptions: {},
      contractListData: [],
      columnDefs: [
        {
          headerName: '合同编号',
          field: 'ptc_contract_number',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '货物金额',
          field: 'ptc_contract_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '信息费',
          field: 'ptc_info_cost',
          width: this.nowpx(0.1) + 'px'
        },
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
        }
      ],
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
    this.getInfoList()
  },
  computed: {},
  methods: {
    clearBut () {
      this.contractNumber = ''
      this.getInfoList()
    },
    getInfoList () {
      const obj = {
        contractNumber: this.contractNumber,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        type: 2
      }
      this.$store
        .dispatch('tradeContract/getListData', obj)
        .then(res => {
          if (res.code == 200) {
            this.contractListData = res.data ? res.data.list : []
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

    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getInfoList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getInfoList()
    },
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
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
