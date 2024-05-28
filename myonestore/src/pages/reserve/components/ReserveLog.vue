<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: this.$q.screen.width * 0.63 + 'px',
        'min-width': this.$q.screen.width * 0.63 + 'px'
      }"
      class="q-pa-md"
    >
      <q-form ref="reserveLogRef">
        <q-card-section class="row items-center q-pa-none q-mb-xl">
          <div class="text-h6 q-pr-lg">预约明细</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <div style="height:436px">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="detailList"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            @first-data-rendered="onFirstDataRendered"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            rowHeight="40"
            :context="context"
            rowSelection="multiple"
            :localeText="localeText"
            :stopEditingWhenGridLosesFocus="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
          ></ag-grid-vue>
        </div>
        <div>
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pageSize"
            :total="page.pageTotal"
          ></hl-pagination>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
import AgMember from './AgMember'
import AgStatus from './AgStatus'
import DetailAgOperate from './DetailAgOperate'
export default {
  name: 'ReserveLog',
  components: { AgMember, AgStatus, DetailAgOperate },
  data () {
    return {
      id: '',
      showDialog: true,
      gridOptions: {},
      context: null,
      detailList: [],
      columnDefs: [
        {
          headerName: '会员姓名',
          width: this.nowpx(0.17) + 'px',
          cellRendererFramework: 'AgMember'
        },
        {
          headerName: '预约人数',
          field: 'prd_people_number',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '预约日期',
          valueGetter: p => {
            return this.$q_date.formatDate(
              p.data.prd_date * 1000,
              'YYYY-MM-DD'
            )
          },
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '预约时间',
          valueGetter: p => {
            return (
              this.$q_date.formatDate(p.data.prd_time_start * 1000, 'HH:mm') +
              '-' +
              this.$q_date.formatDate(p.data.prd_time_end * 1000, 'HH:mm')
            )
          },
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '状态',
          cellRendererFramework: 'AgStatus',
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '操作',
          cellRendererFramework: 'DetailAgOperate',
          width: this.nowpx(0.17) + 'px'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },
  mounted () {},
  created () {
    this.context = this
  },
  computed: {},
  methods: {
    // 查询预约详情
    getList (id) {
      if (id > 0) {
        this.id = id
        const obj = {
          projectId: id,
          payStatus: 1,
          page: this.page.pageIndex,
          pSize: this.page.pageSize
        }
        this.$store
          .dispatch('reserve/getReserveDetailData', obj)
          .then(res => {
            this.detailList = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          })
          .catch(err => {
            this.$q.notify({
              message: '失败',
              caption: '系统错误',
              color: 'red',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          })
      }
    },
    hideNowPage () {
      this.$emit('dataList')
    },
    // 计算窗口
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 742
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 隐藏滚动条
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    // 分页
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    }
  }
}
</script>
