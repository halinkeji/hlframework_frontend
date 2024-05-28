<template>
  <q-dialog @hide="hideNowPage" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt($q.screen.width * 0.4) + 'px',
        'max-width': parseInt($q.screen.width * 0.4) + 'px',
        height: parseInt($q.screen.height * 0.6) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white row q-px-md q-py-xs ">
          <div class="text-subtitle1">选择员工</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="hideNowPage" />
        </div>
        <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2 row q-mb-xs q-gutter-xs items-center">
          <div class="col-12 col-md-4">
            <q-input outlined v-model="searchValue" label="名称/电话" dense />
          </div>
          <div class="col-12 col-md-4">
            <q-select
              outlined
              label="职位"
              v-model="positionId"
              :options="positionDataList"
              dense
              option-label="prp_name"
              option-value="id"
              emit-value
              map-options
            >
            </q-select>
          </div>

          <q-btn color="primary"  unelevated @click="getUser">搜索</q-btn>
          <q-btn color="grey-6" unelevated @click="handleFormReset" >重置</q-btn>
        </div>

        <div class="col-shrink q-pa-sm full-height bg-white ">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham  ag-grid-table full-height hl_header_center hl_content_center goods-select-table"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="userData"
            rowSelection="multiple"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            :floatingFilter="false"
            :enableCharts="true"
            :enableRangeSelection="true"
            :enableCellTextSelection="true"
            :suppressRowTransform="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="false"
            @first-data-rendered="onFirstDataRendered"
            @gridReady="onFirstDataRendered"
            :rowMultiSelectWithClick="true"
            :localeText="localeText"
            rowHeight="45"
          ></ag-grid-vue>
        </div>
        <div class="col-shrink bg-white q-mt-xs row q-py-sm items-center q-gutter-sm q-pa-sm q-mb-sm">
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[ 20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pageSize"
            :total="page.pageTotal"
            layout="total, sizes, prev, pager, next, jumper"
          ></hl-pagination>
          <q-space />
          <q-btn unelevated color="primary" @click="getSelectedTabel(true)" label="选中" />
          <q-btn unelevated color="green" @click="getSelectedTabel(false)" label="选中并关闭" />
          <q-btn unelevated color="grey" @click="hideNowPage" label="取消" />
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  name: 'SelectUser',
  data () {
    return {
      addStoreSidebar: false,
      dataId: 0,
      searchValue: '',
      userData: [],
      gridOptions: {},
      columnDefs: [
        // 表格列数据
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: true, // 标题复选框开关状态
          checkboxSelection: true,
          width: 25
        },
        {
          headerName: '员工名称',
          field: 'pru_name'
        },
        {
          headerName: '职位',
          field: 'position.prp_name'
        }
      ],
      localeText: this.$ag_grid_localeText,
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      positionDataList: [],
      positionId: ''
    }
  },
  created () {},
  mounted () {},
  computed: {},

  methods: {
    getUser () {
      this.addStoreSidebar = true
      this.getAllUserPosition()
      const obj = {
        name: this.searchValue,
        pSize: this.page.pageSize,
        page: this.page.pageIndex,
        position_id: this.positionId
      }
      this.$store.dispatch('rewardPosition/getUserList', obj).then((res) => {
        if (res.code == 200) {
          this.userData = res.data ? res.data.list : []
          this.page.pageTotal = res.data ? res.data.page.totalCount : 0
        }
      })
    },
    getAllUserPosition () {
      this.$store.dispatch('rewardPosition/getAllPositionData').then((res) => {
        if (res.code == 200) {
          this.positionDataList = res.data ? res.data : []
        }
      })
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getDatalist()
    },

    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getDatalist()
    },

    getSelectedTabel (val) {
      const selectedRows = this.gridOptions.api.getSelectedRows()
      this.activePrompt = val
      this.$emit('getSelectedUserData', selectedRows, val)
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    hideNowPage () {
      this.addStoreSidebar = false
    },
    handleFormReset () {
      this.searchValue = ''
      this.positionId = ''
      this.getUser()
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
