<template>
  <q-dialog @hide="hideNowPage" v-model="dialogStatus" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.8) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.8) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
      class="bg-grey-2"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-sm q-gutter-xs q-pt-xs row items-center q-px-sm">
          <div class="text-subtitle1">财富列表</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>

        <div class="col-shrink q-px-xs full-height bg-grey-2">
          <ag-grid-vue
            ref="agGridTable"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="payRecordData"
            :gridOptions="gridOptions"
            :rowDragManaged="true"
            :animateRows="false"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            @first-data-rendered="onFirstDataRendered"
            rowHeight="40"
            :suppressRowTransform="true"
            rowSelection="multiple"
            :defaultColDef="defaultColDef"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
            :localeText="localeText"
          ></ag-grid-vue>
        </div>

        <div class="col-shrink bg-white q-pb-md">
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pSize"
            :total="page.totalCount"
          ></hl-pagination>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import AgStatusChip from './components/AgStatusChip'
import AgStoreStatusChipTwo from './components/AgStoreStatusChipTwo'
export default {
  name: 'record',
  components: {
    AgStatusChip,
    AgStoreStatusChipTwo
  },
  data () {
    return {
      localeText: this.$ag_grid_localeText,
      payRecordData: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      columnDefs: [
        {
          headerName: ' 推广单号',
          field: 'pmr_order_no',
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '状态',
          field: 'pmr_status',
          width: this.nowpx(0.08) + 'px',
          cellRendererFramework: 'AgStatusChip'
        },
        {
          headerName: ' 会员姓名',
          field: 'pmember.nick_name',
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'pmember.card_number',
          width: this.nowpx(0.08) + 'px'
        },

        {
          headerName: '手机号',
          field: 'pmr_pmerchant_mobile_number',
          width: this.nowpx(0.08) + 'px'
        },

        {
          headerName: '商家名称',
          field: 'pstore.name',
          width: this.nowpx(0.08) + 'px'
        },

        {
          headerName: ' 商家状态',
          field: 'pmr_status',
          width: this.nowpx(0.07) + 'px',
          cellRendererFramework: 'AgStoreStatusChipTwo'
        },

        {
          headerName: '商家开户状态',
          field: 'pmr_is_meet_one',
          width: this.nowpx(0.08) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.pmr_is_meet_one) == 1) {
              return '未达标'
            } else if (parseInt(p.data.pmr_is_meet_one) == 2) {
              return '已达标'
            }
            return ''
          }
        },
        {
          headerName: '商家发生一笔交易',
          field: 'pmr_is_meet_two',
          width: this.nowpx(0.08) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.pmr_is_meet_two) == 1) {
              return '未达标'
            } else if (parseInt(p.data.pmr_is_meet_two) == 2) {
              return '已达标'
            }
            return ''
          }
        },
        {
          headerName: '商家交易金额满',
          field: 'pmr_is_meet_three',
          width: this.nowpx(0.08) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.pmr_is_meet_three) == 1) {
              return '未达标'
            } else if (parseInt(p.data.pmr_is_meet_three) == 2) {
              return '已达标'
            }
            return ''
          }
        },

        {
          headerName: '收益',
          field: 'pmr_set_profit_amount',
          width: this.nowpx(0.08) + 'px',
          valueGetter: (p) => {
            return (
              this.$q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_moneySymbol + ' ' + p.data.pmr_set_profit_amount
            )
          }
        },

        {
          headerName: '【赠送】商家授权使用时间',
          field: 'pmr_set_store_delay_num',
          width: this.nowpx(0.08) + 'px',
          valueGetter: (p) => {
            return p.data.pmr_set_store_delay_num > 0
              ? p.data.pmr_set_store_delay_num + this.marketUserCycleItem[parseInt(p.data.pmr_set_store_delay_cycle)]
              : ''
          }
        },
        {
          headerName: '【赠送】商家操作员数量',
          field: 'pmr_set_store_account_num',
          width: this.nowpx(0.08) + 'px',
          valueGetter: (p) => {
            return p.data.pmr_set_store_account_num > 0 ? p.data.pmr_set_store_account_num : ''
          }
        },
        {
          headerName: '【赠送】商家可创建子店数量',
          field: 'pmr_set_store_son_num',
          width: this.nowpx(0.08) + 'px',
          valueGetter: (p) => {
            return p.data.pmr_set_store_son_num > 0 ? p.data.pmr_set_store_son_num : ''
          }
        },

        {
          headerName: '添加时间',
          field: 'created_at',
          filter: false,
          valueGetter: (p) => {
            if (!p.data.created_at) {
              return ''
            } else {
              return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm')
            }
          },
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '最近操作时间',
          field: 'updated_at',
          filter: false,
          valueGetter: (p) => {
            if (!p.data.updated_at) {
              return ''
            } else {
              return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD HH:mm')
            }
          },
          width: this.nowpx(0.1) + 'px'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: true,
        suppressMenu: false,
        rowDragManaged: true
      },
      gridOptions: {},
      searchQuery: '',
      startTime: '',
      endTime: '',

      dialogStatus: false,
      mUserId: 0,
      marketUserCycleItem: this.$store.state.marketingManage.marketUserCycleItem
    }
  },

  created () {},
  mounted () {},
  computed: {},
  methods: {
    init (mUserId) {
      this.dialogStatus = true
      if (mUserId > 0) {
        this.mUserId = mUserId
        this.getList()
      }
    },
    hideNowPage () {
      this.dialogStatus = false

      this.$emit('closeDialog')
    },

    getList () {
      const obj = {
        isOnlyUser: 1,
        marketingUserId: this.mUserId,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('marketingManage/getUserRewardRecord', obj)
        .then((res) => {
          if (res.code == 200) {
            this.payRecordData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
          }
        })
        .catch((error) => {})
    },
    createdAt (p) {
      if (!p.data.updated_at) {
        return ''
      } else {
        return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD HH:mm')
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

    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
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
        // params.api.sizeColumnsToFit()
      }
    },
    exportBut () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-业务消费记录'
      })
    }
  }
}
</script>

<style></style>
