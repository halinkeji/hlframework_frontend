<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs row">
      <q-input class="col-12 col-md-3 q-mt-sm " label="可搜索:卡号/股东昵称/股东姓名/手机号" outlined v-model="searchQuery" dense />
      <q-btn color="primary" class=" q-mt-sm" unelevated label="搜索" v-if="authorityMeta('search')" @click="getList" />
      <q-btn color="warning" class=" q-mt-sm" unelevated label="重置" v-if="authorityMeta('reset')" @click="clean" />
      <q-btn @click="addData()" color="primary" class=" col-12 col-md-1 q-mt-sm" unelevated v-if="authorityMeta('add')" label="新增" />
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :defaultColDef="defaultColDef"
        :rowData="partnerData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        :context="context"
        :floatingFilter="false"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :enableCellTextSelection="true"
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
    <add-partner ref="addRef" v-if="isDialogStatus" @getMethods="getList"></add-partner>
  </div>
</template>
<script>
import AddPartner from './AddPartner.vue'
import Operator from './AgOperator'
import TypeChip from './AgTypeChip'
export default {
  name: 'PartnerList',
  components: {
    AddPartner,
    Operator,
    TypeChip
  },
  data () {
    return {
      isDialogStatus: false,
      partnerData: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      columnDefs: [
        // 表格列数据
        {
          headerName: '股东合伙人',
          field: 'ppi_partner_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '手机号',
          field: 'ppi_member_mobile',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员姓名',
          field: 'ppi_member_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '股金',
          field: 'config.ppc_partner_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '到期时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.ppi_partner_end_time * 1000, 'YYYY-MM-DD  HH:mm:ss')
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '股东状态',
          field: 'gt_goods_type',
          cellRendererFramework: 'TypeChip',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '添加时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD  HH:mm:ss')
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作',
          field: 'user_id',
          cellRendererFramework: 'Operator',
          width: this.nowpx(0.18) + 'px'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      context: null,
      gridOptions: {},
      searchQuery: '',
      localeText: this.$ag_grid_localeText
    }
  },
  computed: {},
  created () {
    this.getList()
    this.context = this
  },
  mounted () {},
  methods: {
    getList () {
      const obj = {
        name: this.searchQuery,
        type: 'partner',
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('partner/getMember', obj)
        .then((res) => {
          if (res.code == 200) {
            this.partnerData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
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
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    clean () {
      this.searchQuery = ''
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
