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
        <div class="col-shrink bg-white q-px-xs q-pb-sm q-gutter-xs q-pt-xs row items-center q-px-sm items-center">
          <div class="text-subtitle1">推广列表</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>

        <div class="col-shrink q-px-xs  full-height bg-grey-2">
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
import AgStoreStatusChip from './components/AgStoreStatusChip'
import AgOperatorRelation from './components/AgOperatorRelation'

export default {
  name: 'record',

  components: {
    AgStoreStatusChip,
    AgOperatorRelation
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
          field: 'pmr_son_phone_number',
          width: this.nowpx(0.08) + 'px'
        },

        {
          headerName: '绑定时间',
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
          headerName: '商家名称',
          field: 'pstore.name',
          width: this.nowpx(0.08) + 'px'
        },

        {
          headerName: '商家状态',
          field: 'pmr_status',
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'AgStoreStatusChip'
        },

        {
          headerName: '商家申请时间',
          field: 'createdTime',
          filter: false,
          valueGetter: (p) => {
            if (!p.data.createdTime) {
              return ''
            } else {
              return this.$q_date.formatDate(p.data.createdTime * 1000, 'YYYY-MM-DD HH:mm')
            }
          },
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '最近操作时间',
          field: 'updatedTime',
          filter: false,
          valueGetter: (p) => {
            if (!p.data.updatedTime) {
              return ''
            } else {
              return this.$q_date.formatDate(p.data.updatedTime * 1000, 'YYYY-MM-DD HH:mm')
            }
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: ' 操作',
          field: 'id',
          width: this.nowpx(0.15) + 'px',
          pinned: 'right',
          cellRendererFramework: 'AgOperatorRelation'
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
      searchFrom: {
        userId: '',
        searchSerm: '',
        payStatus: '',
        created_at: '',
        updated_at: ''
      },
      dialogStatus: false,
      mUserId: 0
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
    resetButton () {
      this.searchFrom = {
        userId: '',
        searchSerm: '',
        payStatus: '',
        created_at: '',
        updated_at: '',
        memberText: ''
      }
      this.startTime = ''
      this.endTime = ''
      this.getList()
    },
    getList () {
      const obj = {
        isOnlyUser: 1,
        marketingUserId: this.mUserId,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('marketingManage/getUserRelationRecord', obj)
        .then((res) => {
          if (res.code == 200) {
            this.payRecordData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
          }
        })
        .catch((error) => {})
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
