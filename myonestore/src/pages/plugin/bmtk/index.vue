<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="row  q-gutter-x-sm">
          <q-input class="col-12 col-md-2 q-mt-sm" label="请输入活动名称" outlined v-model="expandActiveName" dense />
          <q-btn @click="getList()" color="primary" class="col-12 col-md-1 q-mt-sm" unelevated label="搜索" />
          <q-btn @click="clearBut()" color="warning" class="col-12 col-md-1 q-mt-sm" unelevated label="重置" />
          <q-btn :to="{ name: 'addActive' }" color="primary" class="col-12 col-md-1 q-mt-sm" unelevated label="添加活动" v-if="authorityMeta('add')" />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="bmtkDataList"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          :localeText="localeText"
          :gridOptions="gridOptions"
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
import Operating from './components/AgOperator'
import AgSwitch from './components/AgSwitch'

export default {
  name: 'bmtk',
  components: {
    Operating,
    AgSwitch
  },
  data () {
    return {
      localeText: this.$ag_grid_localeText,
      context: null,
      components: {
        Operating,
        AgSwitch
      },
      bmtkDataList: [],
      columnDefs: [
        {
          headerName: '活动名称',
          field: 'bmt_name',
          width: this.nowpx(0.15) + 'px',
          pinned: this.pinnedComputed('left')
        },
        {
          headerName: '活动时间',
          width: this.nowpx(0.2) + 'px',
          valueGetter: this.expireDate
        },
        {
          headerName: '购买价格',
          field: 'bmt_price',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '限购次数',
          field: 'bmt_limit_buy_count',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '伪购数量',
          field: 'bmt_fake_buy_count',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '伪浏览量',
          field: 'bmt_fake_look',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '浏览量',
          field: 'bmt_real_look',
          width: this.nowpx(0.08) + 'px'
        },

        {
          headerName: '活动状态',
          field: 'bmt_status',
          cellRendererFramework: 'AgSwitch',
          width: this.nowpx(0.08) + 'px',
          pinned: this.pinnedComputed('right')
        },
        {
          headerName: ' 操作',
          cellRendererFramework: 'Operating',
          width: this.nowpx(0.23) + 'px',
          pinned: this.pinnedComputed('right')
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      gridOptions: {},
      expandActiveName: '',
      selected: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      }
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
      const obj = {
        text: this.expandActiveName,
        ...this.page
      }
      this.$store
        .dispatch('bmtk/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.bmtkDataList = res.data ? res.data.list : []
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

    clearBut () {
      this.expandActiveName = ''
      this.getList()
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
        // params.api.sizeColumnsToFit();
      }
    },
    expireDate (p) {
      return this.$q_date.formatDate(p.data.bmt_start_time * 1000, 'YYYY-MM-DD HH:mm:ss') + ' 至 ' + this.$q_date.formatDate(p.data.bmt_end_time * 1000, 'YYYY-MM-DD HH:mm:ss') + ' 有效'
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
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
