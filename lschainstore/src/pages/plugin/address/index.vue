<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-pt-sm row q-gutter-xs">
        <q-input label="可搜索:会员卡号/手机号/真实姓名/昵称" outlined v-model="search" dense class="col-12 col-md-4 q-mt-sm" />
        <q-btn color="primary" class="col-12 col-md-1 q-mt-sm" unelevated label="搜索" @click="getList" />
        <q-btn color="warning" class="col-12 col-md-1 q-mt-sm" unelevated label="重置" @click="clearBut" />
      </div>
      <div class="col-shrink q-px-xs q-py-none full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :gridOptions="gridOptions"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="memberData"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :suppressCellSelection="true"
          :localeText="localeText"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="40"
          :context="context"
          @rowSelected="rowSelectedAg"
          :suppressRowClickSelection="true"
          :singleClickEdit="true"
          :stopEditingWhenGridLosesFocus="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center">
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
    </div>
    <member-address v-if="addressDialogStatus" @colseDialog="addressDialogStatus = false" ref="memberAddressRef" />
  </q-page>
</template>
<script>
import AgSeeAddress from './components/AgSeeAddress'
import MemberAddress from './components/MemberAddress'
export default {
  components: { AgSeeAddress, MemberAddress },
  data () {
    return {
      addressDialogStatus: false,
      search: '',
      memberData: [],
      gridOptions: {},
      columnDefs: [
        // 表格列数据
        {
          headerName: '卡号',
          field: 'mem_memberCardNum',
          filter: false
        },
        {
          headerName: '昵称',
          field: 'mem_memberName',
          filter: false
        },
        {
          headerName: '真实姓名',
          field: 'mem_memberRealName',
          filter: false
        },
        {
          headerName: '手机号',
          field: 'mem_memberMobile',
          filter: false
        },
        {
          headerName: '门店',
          field: 'store.name',
          filter: false
        },
        {
          headerName: '到期时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.mem_specifiedEndTime * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          filter: false
        },
        {
          headerName: '操作',
          field: 'make',
          filter: false,
          cellRendererFramework: 'AgSeeAddress',
          width: 180
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
        pSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      context: null
    }
  },

  mounted () {},
  created () {
    this.context = this
    this.getList()
  },
  computed: {},
  methods: {
    // 获取认证信息列表
    getList () {
      const obj = {
        text: this.search,
        state: 1,
        pSize: this.page.pSize,
        page: this.page.pageIndex
      }
      this.$store
        .dispatch('address/getMemberList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.memberData = res.data ? res.data.list : []
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
      this.search = ''
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
      this.page.pSize = val
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    openAddRessDialog (memberId) {
      this.addressDialogStatus = true
      this.$nextTick(() => {
        this.$refs.memberAddressRef.init(memberId)
      })
    }

  }
}
</script>
