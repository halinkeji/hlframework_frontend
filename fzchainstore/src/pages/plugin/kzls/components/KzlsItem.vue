<template>
  <div>
    <q-card flat>
      <add-kzls-item ref="addRef" v-if="addPoppupStatus" @dataList="getList" />
      <add-kzls-detail
        ref="addDetailRef"
        v-if="addDetailStatus"
        @dataList="getList"
      ></add-kzls-detail>
      <kzls-detail
        ref="DetailRef"
        v-if="DetailStatus"
        @dataList="getList"
      ></kzls-detail>
      <div class="row q-gutter-xs ">
        <q-input
          square
          outlined
          dense
          v-model="itemData.pki_name"
          label="请输入开支项"
          class="col-12 col-md-2"
        />
        <q-select
          square
          outlined
          dense
          v-model="itemData.pki_status"
          :options="typeOptions"
          label="类型"
          class="col-12 col-md-2"
          option-label="label"
          emit-value
          map-options
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
          label="新增开支项"
          @click="showPopup()"
          class="q-px-md"
        />
        <q-btn
          unelevated
          color="primary"
          dense
          label="新增开支明细"
          @click="showAddDetail()"
          class="q-px-md"
        />
      </div>
    </q-card>

    <hl-auto-height class="q-mt-md q-gutter-x-sm">
      <template slot="body">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="itemListData"
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
import AgChip from '../components/AgChip'
import AgOperate from '../components/AgOperate'
import AddKzlsDetail from './AddKzlsDetail'
import AddKzlsItem from './AddKzlsItem'
import KzlsDetail from './KzlsDetail.vue'
export default {
  name: 'KzlsItem',
  components: {
    AgChip,
    AgOperate,
    AddKzlsDetail,
    AddKzlsItem,
    KzlsDetail
  },
  data () {
    return {
      addDetailStatus: false,
      addPoppupStatus: false,
      DetailStatus: false,
      typeOptions: [
        {
          label: '开支',
          value: '1'
        },
        {
          label: '收入',
          value: '2'
        }
      ],
      itemData: {
        pki_name: '',
        pki_status: ''
      },
      context: '',
      gridOptions: {},
      itemListData: [],
      columnDefs: [
        {
          headerName: '开支项',
          field: 'pki_name',
          width: this.nowpx(0.27) + 'px'
        },
        {
          headerName: '类型',
          field: 'pki_status',
          width: this.nowpx(0.27) + 'px',
          cellRendererFramework: 'AgChip'
        },
        {
          headerName: '开支明细',
          field: 'pki_detail',
          width: this.nowpx(0.27) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.19) + 'px',
          cellRendererFramework: 'AgOperate'
        }
      ],
      columns: [
        {
          name: '开支项',
          label: '开支项',
          align: 'center',
          field: row => row.pki_name,
          format: val => `${val}`
        },
        {
          name: '类型',
          align: 'center',
          label: '类型',
          field: row => row.pki_status
        },
        {
          name: '开支明细',
          label: '开支明细',
          align: 'center',
          field: row => row.pki_detail
        },
        {
          name: '操作',
          align: 'center',
          label: '操作',
          field: AgOperate
        }
      ],
      localeText: this.$ag_grid_localeText,
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      }
    }
  },
  created () {
    this.getList()
    this.context = this
  },
  methods: {
    // 查询开支项列表
    getList () {
      this.addDetailStatus = false
      this.addPoppupStatus = false
      this.DetailStatus = false

      const obj = {
        type: 1,
        text: this.itemData.pki_name,
        status: this.itemData.pki_status,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('kzls/getListData', obj)
        .then(res => {
          if (res.code == 200) {
            this.itemListData = res.data ? res.data.list : [] // 三元运算赋值
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch(error => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: '系统错误',
            color: 'red'
          })
        })
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 280
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 重置按钮方法
    clearBut () {
      this.itemData.pki_name = ''
      this.itemData.pki_status = ''
      this.getList()
    },
    // 显示开支项弹窗方法
    showPopup (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addRef.init(id)
      })
    },
    // 显示明细弹窗方法
    showAddDetail (id) {
      this.addDetailStatus = true
      this.$nextTick(() => {
        this.$refs.addDetailRef.init(id)
      })
    },
    showKzlsDetail (id, context) {
      this.DetailStatus = true
      this.$nextTick(() => {
        this.$refs.DetailRef.getList(id, context)
      })
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
