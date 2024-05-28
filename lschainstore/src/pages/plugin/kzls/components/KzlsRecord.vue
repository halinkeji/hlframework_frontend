<template>
  <div>
    <q-card flat>
      <add-kzls-record
        ref="addRef"
        v-if="addPoppupStatus"
        @dataList="getList"
      />
      <div class="row q-gutter-xs ">
        <q-input
          square
          outlined
          dense
          v-model="recordData.pkr_invoice_code"
          label="请输入单据号"
          class="col-12 col-md-3"
        />
        <q-btn
          unelevated
          color="primary"
          dense
          label="搜索"
          class="q-px-md"
          @click="getList()"
        />
        <q-btn
          unelevated
          color="warning"
          dense
          label="重置"
          @click="clearBut()"
          class="q-px-md"
        />
        <q-btn
          unelevated
          color="primary"
          dense
          label="新增"
          @click="showPopup()"
          class="q-px-md"
        />
      </div>
    </q-card>
    <hl-auto-height class="q-mt-md q-gutter-x-sm">
      <template slot="body">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham h-full ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="recordListData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          @first-data-rendered="onFirstDataRendered"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="40"
          :context="context"
          :localeText="localeText"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :stopEditingWhenGridLosesFocus="true"
        ></ag-grid-vue>
      </template>
    </hl-auto-height>

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
  </div>
</template>
<script>
import RecordAgChip from '../components/RecordAgChip'
import RecordAgOperate from '../components/RecordAgOperate'
import AddKzlsRecord from './AddKzlsRecord'
export default {
  name: 'KzlsRecord',
  components: {
    RecordAgChip,
    RecordAgOperate,
    AddKzlsRecord
  },
  data () {
    return {
      addPoppupStatus: false,
      recordData: {
        pkr_invoice_code: ''
      },
      context: '',
      recordListData: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '单据号',
          field: 'pkr_invoice_code',
          width: this.nowpx(0.16) + 'px'
        },
        {
          headerName: '类型名称',
          field: 'pkr_group_name',
          width: this.nowpx(0.14) + 'px'
        },
        {
          headerName: '开支项',
          field: 'pkr_item_name',
          width: this.nowpx(0.14) + 'px'
        },
        {
          headerName: '类型',
          width: this.nowpx(0.14) + 'px',
          cellRendererFramework: 'RecordAgChip'
        },
        {
          headerName: '开支金额',
          field: 'pkr_price',
          width: this.nowpx(0.14) + 'px'
        },
        {
          headerName: '时间',
          field: 'created_at',
          valueGetter: p =>
            this.$q_date.formatDate(
              p.data.created_at * 1000,
              'YYYY-MM-DD HH:mm:ss'
            ),
          width: this.nowpx(0.14) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.14) + 'px',
          cellRendererFramework: 'RecordAgOperate'
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
  created () {
    this.getList()
    this.context = this
  },
  methods: {
    // 查询开支记录
    getList () {
      this.addPoppupStatus = false
      const obj = {
        text: this.recordData.pkr_invoice_code,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('kzls/getRecordListData', obj)
        .then(res => {
          if (res.code == 200) {
            this.recordListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch(error => {
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
    // 计算窗口
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 280
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 重置按钮方法
    clearBut () {
      this.recordData.pkr_invoice_code = ''
      this.getList()
    },
    // 显示弹窗方法
    showPopup (id) {
      this.addPoppupStatus = true
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
