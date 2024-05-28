<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md row q-gutter-x-sm">
        <q-input class="col-12 col-md-2 q-mt-sm" label="请输入职位名称" outlined v-model="searchQuery" dense />
        <q-btn @click="getList" color="primary" class="col-12 col-md-1 q-mt-sm" unelevated label="搜索" />
        <q-btn @click="clearnBut" color="warning" class=" col-12 col-md-1 q-mt-sm" unelevated  label="重置" />
        <q-btn @click="addData" color="primary" class=" col-12 col-md-1 q-mt-sm" unelevated v-if="authorityMeta('add')" label="新增" />
        <q-btn :disable="dataListSelections.length > 0 ? false : true" @click="delAll" color="red" class="col-12 col-md-1 q-mt-sm" unelevated v-if="authorityMeta('delAll')" label="批量删除" />
      </div>

      <add-position v-if="isDialogStatus" @getMethods="getList" ref="addRef"></add-position>
      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="positionData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="40"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          @rowSelected="rowSelectedAg"
          :localeText="localeText"
          @gridReady="onFirstDataRendered"
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
  </q-page>
</template>
<script>
import Operator from './components/AgOperator'
import AgMode from './components/AgMode'
import AddPosition from './components/AddPosition.vue'
export default {
  name: 'PositionRecord',
  components: {
    Operator,
    AgMode,
    AddPosition
  },
  data () {
    return {
      isDialogStatus: false,
      context: null,
      components: {
        Operator,
        AgMode
      },
      gridOptions: {},
      positionData: [],
      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: ' 职位名称',
          field: 'prp_name'
        },
        {
          headerName: '开卡绩效/位',
          field: 'prp_open_card_reward'
        },
        {
          headerName: '销售奖励/%',
          field: 'prp_consume_reward'
        },

        {
          headerName: '状态',
          field: 'prp_status',
          cellRendererFramework: 'AgMode'
        },
        {
          headerName: '添加时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          headerName: ' 操作',
          field: 'created_at',
          cellRendererFramework: 'Operator',
          width: this.nowpx(0.3) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,
      searchQuery: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      dataListSelections: {}
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
      this.isDialogStatus = false
      const obj = {
        name: this.searchQuery,
        pSize: this.page.pSize,
        page: this.page.pageIndex
      }
      this.$store
        .dispatch('reward/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.positionData = res.data ? res.data.list : []

            this.dataListSelections = {}
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
    addData (id) {
      this.isDialogStatus = true
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
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条职位吗`,
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
        this.$store.dispatch('reward/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条职位'
            })
            this.getList()
            this.dataListSelections = {}
          }
        })
      }
    },
    clearnBut () {
      this.searchQuery = ''
      this.getList()
      this.dataListSelections = {}
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
        const newArr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (newArr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    }
  }
}
</script>
<style></style>
