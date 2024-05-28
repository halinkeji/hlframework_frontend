<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm">
      <div class="row q-gutter-sm items-center">
        <div class="col-12 col-md-2">
          <q-input clearable label="请输入名称" outlined v-model="searchQuery" dense />
        </div>

        <div class="col-12 col-md-2">
          <q-select
            outlined
            option-value="value"
            option-label="label"
            emit-value
            map-options
            clearable
            :options="$store.state.marketingManage.marketUserTypeData"
            v-model="pmt_type"
            dense
            label="类型"
          />
        </div>

        <q-btn @click="getList()" color="primary" unelevated label="搜索" />
        <q-btn @click="clearnBut()" color="warning" unelevated label="重置" />
        <q-btn @click="editTypeData(0)" color="primary" unelevated label="新增" />
      </div>
    </div>

    <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="marketTypeListData"
         :gridOptions="gridOptions"
        :rowDragManaged="true"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        :suppressRowTransform="true"
        rowSelection="multiple"
        :defaultColDef="defaultColDef"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :context="context"
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
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>

    <edit-type v-if="isPoppupStatus" @getMethods="getList" ref="addRef"></edit-type>
  </div>
</template>
<script>
import Operator from './components/AgOperator'
import Mode from './components/AgMode'
import EditType from './components/EditType.vue'

export default {
  name: 'marketingType',
  components: {
    Operator,
    Mode,
    EditType
  },
  data () {
    return {
      isPoppupStatus: false,
      context: null,
      components: {
        Operator,
        Mode
      },
      gridOptions: {},
      marketTypeListData: [],

      columnDefs: [

        {
          headerName: '名称',
          field: 'pmt_title',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '类型',
          field: 'pmt_type',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            return this.marketUserTypeItem[p.data.pmt_type]
          }
        },
        {
          headerName: '固定收益',
          field: 'pmt_profit_amount',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '收益比例',
          field: 'pmt_profit_ratio',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '【赠送】商家授权使用时间',
          field: 'pmt_store_delay_cycle',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            return p.data.pmt_store_delay_cycle ? (p.data.pmt_store_delay_num + this.marketUserCycleItem[p.data.pmt_store_delay_cycle]) : ''
          }
        },
        {
          headerName: '【赠送】商家操作员数量',
          field: 'pmt_store_account_num',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            return p.data.pmt_store_account_num > 0 ? p.data.pmt_store_account_num : ''
          }
        },

        {
          headerName: '【赠送】商家可创建子店数量',
          field: 'pmt_store_son_num',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            return p.data.pmt_store_son_num > 0 ? p.data.pmt_store_son_num : ''
          }
        },

        {
          headerName: '状态',
          field: 'pmt_status',
          cellRendererFramework: 'Mode',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '修改时间',
          field: 'updated_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '操作',
          field: 'created_at',
          cellRendererFramework: 'Operator',
          pinned: 'right',
          width: this.nowpx(0.2) + 'px'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: true,
        suppressMenu: false,
        rowDragManaged: true
      },
      localeText: this.$ag_grid_localeText,
      searchQuery: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      dataListSelections: [],
      marketUserCycleItem: this.$store.state.marketingManage.marketUserCycleItem,
      marketUserTypeItem: this.$store.state.marketingManage.marketUserTypeItem,
      pmt_type: ''
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.getList()
    this.context = this
  },
  methods: {
    getList () {
      this.isPoppupStatus = false
      const obj = {
        text: this.searchQuery,
        pmt_type: this.pmt_type,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('marketingManage/getTypeList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.page.totalCount = res.data.page.totalCount
              this.marketTypeListData = res.data.list
            } else {
              this.page.totalCount = 0
              this.marketTypeListData = []
            }
          }
        })
        .catch((error) => {})
    },
    editTypeData (id) {
      this.isPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addRef.init(id)
      })
    },

    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },

    clearnBut () {
      this.searchQuery = ''
      this.pmt_type = ''
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
        params.api.sizeColumnsToFit()
      }
    },

    authorityMeta (key) {
      if (this.$route.meta) {
        const new_arr = this.$route.meta.map((obj) => {
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
