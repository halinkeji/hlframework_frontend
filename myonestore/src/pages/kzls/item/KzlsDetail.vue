<template>
  <div>
    <q-dialog @hide="hideNowPage" v-model="showDialog">
      <q-card style="width: 1152px; max-width: 90vw" class="q-pa-md">
        <q-card-section class="row q-pa-none">
          <span style="font-size: 18px">开支明细</span>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <div style="height: 437px" class="q-mt-md">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham  ag-grid-table hl_header_center goods-count-table hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="detailData"
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
            :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pageSize"
            :total="page.pageTotal"
          ></hl-pagination>
        </div>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import AgChip from './AgChip.vue'
import DetailAgOperate from './DetailAgOperate'
import AddKzlsDetail from './AddKzlsDetail'
export default {
  name: 'AddUnit',
  components: {
    AgChip,
    DetailAgOperate,
    AddKzlsDetail
  },
  data () {
    return {
      groupId: '',
      detailData: [],
      typeData: [],
      InData: [],
      payDetailData: [],
      SupplierTypeData: [
        { label: '开支', value: '1' },
        { label: '收入', value: '2' }
      ],
      secondModel: '1',
      recordData: {
        pkr_invoice: '',
        pkr_typeId: '',
        pkr_typeName: '',
        pkr_nameId: '',
        pkr_name: '',
        pkr_status: '1',
        pkr_price: '',
        pkr_note: ''
      },
      showDialog: true,
      addButtonDisabled: false,
      context: null,
      gridOptions: {},
      oilReturnData: [],
      columnDefs: [
        {
          headerName: '开支明细',
          field: 'pki_name',
          width: this.nowpx(0.25) + 'px'
        },
        {
          headerName: '类型',
          width: this.nowpx(0.25) + 'px',
          cellRendererFramework: 'AgChip'
        },
        {
          headerName: '开支明细描述',
          field: 'pki_detail',
          width: this.nowpx(0.25) + 'px'
        },
        {
          headerName: '操作',
          field: 'supName',
          width: this.nowpx(0.25) + 'px',
          cellRendererFramework: 'DetailAgOperate'
        }
      ],
      localeText: this.$ag_grid_localeText,
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      }
    }
  },
  created () {},
  methods: {
    // 查询开支明细单条
    getList (id, context) {
      this.context = context
      this.groupId = id
      const obj = {
        group: this.groupId,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('commonKzls/getListData', obj)
        .then(res => {
          if (res.code == 200) {
            this.detailData = res.data ? res.data.list : [] // 三元运算赋值
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch(error => {
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
    hideNowPage () {
      this.$emit('dataList')
      this.groupId = ''
    },
    // 计算窗口
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 801
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
