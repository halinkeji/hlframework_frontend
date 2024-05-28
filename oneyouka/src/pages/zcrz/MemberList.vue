<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs row q-pt-sm">
        <div class="col-12 col-md-2">
          <q-input outlined v-model="memberInfo" label="请输入姓名/昵称/手机号/车牌号" dense />
        </div>
        <div class="col-12 col-md-2">
          <q-select
            outlined
            option-value="id"
            option-label="zg_name"
            emit-value
            map-options
            v-model="carType"
            :options="carTypeList"
            dense
            label="请选择认证类型"
          />
        </div>
        <q-btn color="primary" unelevated label="搜索" @click="getList" />
        <q-btn color="warning" unelevated label="重置" @click="clearBut" />
        <q-btn color="primary" unelevated label="新增" @click="addNewData(0)" />
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :gridOptions="gridOptions"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="attestCarList"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :suppressCellSelection="true"
          :localeText="localeText"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="60"
          :context="context"
          @rowSelected="rowSelectedAg"
          :suppressRowClickSelection="true"
          :singleClickEdit="true"
          :stopEditingWhenGridLosesFocus="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pSize"
          :total="page.pageTotal"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
      <add-car-info v-if="isPoppupStatus" @getMethods="getList" ref="addInfoRef"></add-car-info>
      <verify v-if="isVerify" @getMethods="getList" ref="addVerifyRef"></verify>
    </div>
  </q-page>
</template>
<script>
import AddCarInfo from './AddCarInfo.vue'
import AgTypeBg from './components/AgTypeBg'
import AgAttestOperate from './components/AgAttestOperate'
import Verify from './MemberZcrzVerify'
export default {
  components: { AgAttestOperate, AddCarInfo, Verify, AgTypeBg },
  data () {
    return {
      isPoppupStatus: false,
      isVerify: false,
      memberInfo: '',
      carTypeList: [],
      gridOptions: {},
      attestCarList: [],
      columnDefs: [
        {
          headerName: '姓名',
          field: 'zi_name',
          filter: false,
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '昵称',
          field: 'zi_nick_name',
          filter: false
        },
        {
          headerName: '手机号',
          field: 'zi_mobile',
          filter: false
        },
        {
          headerName: '地址',
          filter: false,
          valueGetter: this.address,
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '车牌号',
          field: 'zi_number_plate',
          filter: false
        },
        {
          headerName: '车辆类型',
          filter: false,
          field: 'zcrzType.zg_name'
        },
        {
          headerName: '状态',
          field: 'zi_stasus',
          pinned: this.pinnedComputed('right'),
          filter: false,
          cellRendererFramework: 'AgTypeBg'
        },
        {
          headerName: '操作',
          filter: false,
          pinned: this.pinnedComputed('right'),
          cellRendererFramework: 'AgAttestOperate',
          width: this.nowpx(0.15) + 'px'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      context: null,
      carType: ''
    }
  },

  mounted () {},
  created () {
    this.context = this
    this.getTypeData()
    this.getList()
  },
  computed: {},
  methods: {
    // 获取认证信息列表
    getList () {
      this.isPoppupStatus = false
      this.isVerify = false
      const obj = {
        carType: this.carType,
        memberInfo: this.memberInfo,
        pSize: this.page.pageSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('zcrz/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data && res.data.page ? res.data.page.totalCount : 0
            this.attestCarList = res.data && res.data.list ? res.data.list : []
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
    // 获取专车分类列表
    getTypeData () {
      this.$store
        .dispatch('zcrz/getTypeData', { type: 2 })
        .then((res) => {
          if (res.code == 200) {
            this.carTypeList = res.data ? res.data : []
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
    // 重置
    clearBut () {
      this.carType = ''
      this.memberInfo = ''
      this.getList()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
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

    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getList(this.type)
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList(this.type)
    },

    address (p) {
      const addressDetail = p.data.zi_province + p.data.zi_city + p.data.zi_district + p.data.zi_detail_address
      return addressDetail || '----'
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
    },
    addNewData (id) {
      this.isPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addInfoRef.init(id)
      })
    },
    verifyAttest (val) {
      this.isVerify = true
      this.$nextTick(() => {
        this.$refs.addVerifyRef.init(val)
      })
    }
  }
}
</script>
