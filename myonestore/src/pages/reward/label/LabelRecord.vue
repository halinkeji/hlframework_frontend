<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pt-sm q-pb-md text-subtitle2 q-gutter-x-sm row">
      <div class="col-12 col-xs-6 col-sm-2">
        <q-input outlined dense v-model="name" label="操作员姓名/电话" />
      </div>
      <div class="col-12 col-md-2">
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

      <q-btn color="primary" unelevated @click="getLabelList" label="查询" />
      <q-btn color="warning" unelevated @click="clearBut" label="重置" />
      <q-btn color="positive" unelevated @click="exportCsv" label="导出Csv文件" :disable="labelListData.length == 0" />
    </div>

    <div class="col-shrink q-px-xs full-height bg-white ">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="labelListData"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :context="context"
        :localeText="localeText"
        @first-data-rendered="onFirstDataRendered"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        rowHeight="40"
        rowSelection="multiple"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pageSize"
        :total="page.pageTotal"
      ></hl-pagination>
    </div>
    <detail-data ref="itemDataRef" v-if="viewDetailStatus" />
  </div>
</template>
<script>
import AgLabelRecordButton from './AgLabelRecordButton.vue'
import DetailData from './DetailData'
export default {
  name: 'LabelRecord',
  props: ['positionDataList'],
  components: {
    AgLabelRecordButton,
    DetailData
  },
  data () {
    return {
      name: '',

      context: '',
      labelstatus: false,
      viewDetailStatus: false,
      gridOptions: {},
      labelListData: [],
      columnDefs: [
        {
          headerName: '员工姓名',
          field: 'pru_name',
          width: this.nowpx(0.24) + 'px'
        },
        {
          headerName: '员工电话',
          field: 'pru_telephone',
          width: this.nowpx(0.24) + 'px'
        },
        {
          headerName: '职位',
          field: 'position.prp_name',
          width: this.nowpx(0.24) + 'px'
        },
        {
          headerName: '总绩效',
          field: 'labelTotalPrice',
          width: this.nowpx(0.24) + 'px'
        },
        {
          headerName: '未结算',
          field: 'notSettleAmount',
          width: this.nowpx(0.24) + 'px'
        },
        {
          headerName: '已结算',
          field: 'alreadyAmount',
          width: this.nowpx(0.24) + 'px'
        },
        {
          headerName: '最近一次结算日期',
          field: 'lastSettleTime',
          width: this.nowpx(0.24) + 'px',
          valueGetter: (p) => {
            if (p.data.lastSettleTime) {
              return this.$q_date.formatDate(p.data.lastSettleTime * 1000, 'YYYY-MM-DD HH:mm:ss')
            }
            return '暂未结算'
          }
        },

        {
          headerName: '操作',
          cellRendererFramework: 'AgLabelRecordButton',
          width: this.nowpx(0.24) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      positionId: ''
    }
  },
  created () {
    this.context = this
  },
  mounted () {
    this.getLabelList()
  },
  computed: {},
  methods: {
    getLabelList () {
      const obj = {
        name: this.name,
        pSize: this.page.pageSize,
        page: this.page.pageIndex,
        position_id: this.positionId
      }
      this.$store
        .dispatch('rewardLabel/getUserLabelList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.labelListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getLabelList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getLabelList()
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 550
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
    clearBut () {
      this.name = ''
      this.positionId = ''
      this.getLabelList()
    },

    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-标签绩效记录'
      })
    },
    viewRecord (data) {
      this.viewDetailStatus = true
      this.$nextTick(() => {
        this.$refs.itemDataRef.init(data)
      })
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
