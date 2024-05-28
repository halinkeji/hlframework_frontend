<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row q-gutter-xs ">
          <div class="col-12 col-md-2">
            <q-input clearable outlined dense  v-model="groupForm.groupName" label="名称" />
          </div>

           <div class="col-12 col-md-2">
            <q-select clearable outlined dense  v-model="groupForm.groupStatus" :options="groupStatus" label="状态" option-label="label" map-options emit-value />
          </div>

          <q-btn color="primary" unelevated  @click="getTimingList" label="查询" />
          <q-btn color="warning"  unelevated @click="clearBut" label="重置" />
          <q-btn color="primary" unelevated :to="{ name: 'addTiming' }" label="新增" />
          <q-btn color="red" unelevated  :disable="dataListSelections.length > 0 ? false : true" @click="deleteTiming" label="批量删除" />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="timingListData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :context="context"
          :localeText="localeText"
          @first-data-rendered="adaptiveTable"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="40"
          rowSelection="multiple"
          @rowSelected="rowSelectedAg"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center">
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
  </q-page>
</template>
<script>
import AgButton from './components/AgButton.vue'
import AgStatus from './components/AgStatus.vue'
export default {
  components: { AgButton, AgStatus },
  data () {
    return {
      context: '',
      groupStatus: [
        {
          label: '正常',
          value: 1
        },
        {
          label: '停售',
          value: 2
        }
      ],
      groupForm: {
        groupName: '',
        groupStatus: ''
      },
      gridOptions: {},
      timingListData: [],
      dataListSelections: [],
      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '套餐名称',
          field: 'gtg_name',
          width: this.nowpx(0.19) + 'px'
        },
        {
          headerName: '套餐价格',
          field: 'gtg_selling_price',
          width: this.nowpx(0.19) + 'px'
        },
        {
          headerName: '套餐状态',
          cellRendererFramework: 'AgStatus',
          width: this.nowpx(0.19) + 'px'
        },
        {
          headerName: '添加时间',
          field: 'created_at',
          valueGetter: this.timeShow,
          width: this.nowpx(0.19) + 'px'
        },
        {
          headerName: '操作',
          cellRendererFramework: 'AgButton',
          width: this.nowpx(0.19) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },
  mounted () {
    this.getTimingList()
  },
  created () {
    this.context = this
  },
  computed: {},
  methods: {
    timeShow (p) {
      return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
    },

    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getTimingList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getTimingList()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 550
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearBut () {
      this.groupForm.groupName = ''
      this.groupForm.groupStatus = ''
      this.getTimingList()
    },
    getTimingList () {
      const obj = {
        ...this.groupForm,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store.dispatch('goodsTiming/getListData', obj).then((res) => {
        if (res.code == 200) {
          this.timingListData = res.data ? res.data.list : []
          this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          this.dataListSelections = []
        } else {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: '操作失败',
            color: 'red'
          })
        }
      })
    },
    deleteTiming () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除 ${this.dataListSelections.length} 条吗`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          const dataListSelections = this.dataListSelections
          if (dataListSelections.length > 0) {
            const obj = dataListSelections.map((item) => {
              return item.id
            })
            this.$store.dispatch('goodsTiming/deleteAll', obj).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green',
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 条'
                })
                this.getTimingList()
                this.dataListSelections = []
              } else {
                this.$q.notify({
                  message: '注意',
                  caption: '失败！',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
              }
            })
          }
        })
    }
  }
}
</script>
