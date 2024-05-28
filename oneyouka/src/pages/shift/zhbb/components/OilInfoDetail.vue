<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md text-subtitle2">
      <shift-date @getPeriod="init" />
      <div class="row q-gutter-xs q-mt-xs">
        <div class="col-12 col-md-2">
          <q-select
            outlined
            option-value="id"
            option-label="op_name"
            emit-value
            map-options
            :options="oilList"
            v-model="oilId"
            dense
            label="请选择油品"
          />
        </div>
        <div class="col-12 col-md-2">
          <q-select
            outlined
            option-value="id"
            option-label="og_name"
            emit-value
            map-options
            :options="oilGunData"
            v-model="oilGunId"
            dense
            label="请选择油枪"
          />
        </div>

         <div class="col-12 col-md-2">
          <q-select
            outlined
            option-value="id"
            option-label="oc_name"
            emit-value
            map-options
            :options="oilCanList"
            v-model="oilCanId"
            dense
            label="请选择油罐"
          />
        </div>

         <div class="col-12 col-md-2">
          <q-select
            outlined
            option-value="id"
            option-label="om_name"
            emit-value
            map-options
            :options="oilMachineData"
            v-model="oilMachineId"
            dense
            label="请选择加油机"
          />
        </div>

        <q-btn @click="getSummaryList()" color="primary" unelevated label="搜索" />
        <q-btn @click="resetBut()" color="warning" unelevated label="重置" />
      </div>
    </div>
    <div class="col-shrink q-px-xs full-height bg-white">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :stopEditingWhenGridLosesFocus="true"
        :suppressRowDeselection="true"
        :defaultColDef="defaultColDef"
        :rowData="oilInfoData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        rowHeight="40"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :suppressRowTransform="true"
        :localeText="localeText"
        @first-data-rendered="onFirstDataRendered"
        :context="context"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
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
</template>

<script>
import ShiftDate from '../../time.vue'
export default {
  name: 'OilInfoDetail',
  components: {
    ShiftDate
  },
  data () {
    return {
      oilGunData: [],
      oilList: [],
      oilMachineData: [],
      oilCanList: [],
      oilCanId: '',
      startTime: '',
      endTime: '',
      oilGunId: '',
      oilId: '',

      oilMachineId: '',
      defaultColDef: {},
      context: null,
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      gridOptions: {},
      oilInfoData: [],
      dataListSelections: [],
      columnDefs: [
        // 表格列数据
        {
          headerName: '油品',
          field: 'rcid_oilName',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '油枪',
          field: 'rcid_oilGunName',
          filter: false,
          checkboxSelection: false,
          headerCheckboxSelectionFilteredOnly: false,
          headerCheckboxSelection: false,
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '加油机',
          field: 'can.oc_name',
          filter: false,
          checkboxSelection: false,
          headerCheckboxSelectionFilteredOnly: false,
          headerCheckboxSelection: false,
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '油罐',
          field: 'machine.om_name',
          filter: false,
          checkboxSelection: false,
          headerCheckboxSelectionFilteredOnly: false,
          headerCheckboxSelection: false,
          width: this.nowpx(0.12) + 'px'
        },

        {
          headerName: '出油/升',
          field: 'rcid_consumeOilRise',
          filter: false,
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '金额',
          field: 'rcid_rechargeMoneyCount',
          filter: false,
          valueGetter: (p) => {
            return this.formatAmount(p.data.rcid_rechargeMoneyCount)
          },
          width: this.nowpx(0.08) + 'px'
        },

        {
          headerName: '操作员',
          field: 'user.username',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '时间',
          field: 'created_at',
          filter: false,
          width: this.nowpx(0.08) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        }
      ],
      localeText: this.$ag_grid_localeText
    }
  },
  created () {},
  computed: {},
  mounted () {
    this.getBasis()
  },
  methods: {
    init (startTime, endTime) {
      this.startTime = startTime
      this.endTime = endTime
      this.$nextTick(() => {
        this.getSummaryList()
      })
    },

    getBasis () {
      this.$store
        .dispatch('shift/getOilConfigData')
        .then((res) => {
          if (res.code == 200) {
            this.oilList = res.data.oil ? res.data.oil : []
            this.oilCanList = res.data.can ? res.data.can : []
            this.oilGunData = res.data.guns ? res.data.guns : []
            this.oilMachineData = res.data.machine ? res.data.machine : []
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
    // 获取汇总数据
    getSummaryList () {
      const obj = {
        page: this.page.pageIndex,
        pSize: this.page.pSize,
        oilGunId: this.oilGunId,
        oilId: this.oilId,
        startTime: this.startTime,
        endTime: this.endTime,
        oilCanId: this.oilCanId,
        oilMachineId: this.oilMachineId
      }
      this.$store
        .dispatch('shift/getOilInfoList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.oilInfoData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
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
    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getSummaryList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getSummaryList()
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
    resetBut () {
      this.oilGunId = ''
      this.oilId = ''
      this.oilCanId = ''
      this.oilMachineId = ''
      this.getSummaryList()
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>

<style></style>
