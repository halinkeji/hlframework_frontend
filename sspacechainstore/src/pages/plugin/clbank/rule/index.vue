<template>
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
       <edit-rule v-if="isPoppupStatus" @getMethods="getList" ref="editRuleRef"></edit-rule>
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-card flat class="q-pa-sm">
          <div class="row q-gutter-x-sm">
            <div class="col-12 col-md-2">
              <q-input clearable label="请输入规则名称" outlined v-model="searchQuery" dense />
            </div>

            <q-btn @click="getList()" color="primary" unelevated label="搜索" />
            <q-btn @click="clearnBut()" color="warning" unelevated label="重置" />
            <q-btn @click="setRuleData(0)" color="primary" unelevated label="新增" />
            <q-btn :disable="dataListSelections.length > 0 ? false : true" @click="delAll()" color="red" unelevated label="批量删除" />
          </div>
        </q-card>
      </div>

      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="ruleListData"
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
          @rowSelected="rowSelectedAg"
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
    </div>
</template>
<script>
import Operator from './AgOperator'
import EditRule from './EditRule.vue'

export default {
  name: 'clbankRuleIndex',
  components: {
    Operator,
    EditRule
  },
  data () {
    return {
      isPoppupStatus: false,
      context: null,
      components: {
        Operator
      },
      gridOptions: {},
      ruleListData: [],

      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '规则名称',
          field: 'cr_name',
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '利息返回模式',
          field: 'cu_interest_type',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            return this.operateTypeObject[p.data.cu_interest_type]
          }
        },

        {
          headerName: '固定额度',
          field: 'cu_interest_fixed_amount',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            return this.formatAmount(p.data.cu_interest_fixed_amount)
          }
        },

        {
          headerName: '比例额度',
          field: 'cu_interest_proportion',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            return this.formatAmount(p.data.cu_interest_proportion) + '%'
          }
        },
        {
          headerName: '返回利息周期',
          field: 'cu_return_period_time',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            return '每' + p.data.cu_return_period_time + ((parseInt(p.data.cu_return_period_property) == 2 || parseInt(p.data.cu_return_period_property) == 3) ? '个' : '') + this.periodTimeObject[p.data.cu_return_period_property]
          }
        },

        {
          headerName: '新增时间',
          field: 'created_at',
          valueGetter: (p) => {
            if (p.data.created_at) {
              return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
            } else {
              return ''
            }
          },
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: ' 操作',
          field: 'created_at',
          cellRendererFramework: 'Operator',
          width: this.nowpx(0.17) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,
      searchQuery: '',

      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },

      dataListSelections: {},
      selectStoreData: [],
      libInStoreList: [],
      periodTimeObject: this.$store.state.clbank.periodTimeObject,
      operateTypeObject: this.$store.state.clbank.operateTypeObject

    }
  },
  mounted () {
    this.getList()
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {
    this.context = this
  },
  methods: {
    getList () {
      this.isPoppupStatus = false
      const obj = {
        text: this.searchQuery,
        pSize: this.page.pSize,
        page: this.page.pageIndex
      }
      this.$store
        .dispatch('clbank/getRuleDataList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.dataListSelections = []
            if (res.data) {
              this.page.totalCount = res.data.page.totalCount
              this.ruleListData = res.data.list
            } else {
              this.page.totalCount = 0
              this.ruleListData = []
            }
          }
        })
        .catch((error) => {})
    },
    setRuleData (id) {
      this.isPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.editRuleRef.init(id)
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
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条规则吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
    },
    deleteRecord () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.$store.dispatch('clbank/deleteRuleData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条规则'
            })
            this.getList()
            this.dataListSelections = []
          }
        })
      }
    },
    clearnBut () {
      this.searchQuery = ''
      this.selectStoreData = []
      this.getList()
      this.dataListSelections = []
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
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
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
