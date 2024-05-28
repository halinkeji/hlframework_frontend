<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md row q-gutter-xs">
      <q-input outlined dense v-model="name" label="可搜索:会员卡号/手机号/昵称" class="col-12 col-md-2" />
      <q-select class=" col-12 col-md-2" outlined option-value="value" option-label="label" emit-value map-options v-model="type" :options="options" dense label="类型" />
      <q-input outlined dense v-model="nameParams" label="可搜索:发票抬头/邮箱" class="col-12 col-md-2" />
      <q-btn unelevated color="primary" dense label="查询" class="q-px-md" @click="getList()" />
      <q-btn unelevated color="warning" dense label="重置" @click="clearButton()" class="q-px-md" />
      <q-btn unelevated color="primary" dense label="新增发票抬头" @click="showPopup()" class="q-px-md" />
    </div>
    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham  ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="debtRecordData"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        rowHeight="40"
        :context="context"
        :components="components"
        rowSelection="multiple"
        :localeText="localeText"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
      ></ag-grid-vue>
    </div>
    <div class="col-shrink bg-white q-pb-md">
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pageSize"
        :total="page.pageTotal"
      ></hl-pagination>
    </div>
    <add-title ref="addRef" v-if="addPoppupStatus" @dataList="getList"></add-title>
  </div>
</template>
<script>
import AddTitle from './components/AddTitle.vue'
import AgTypeBg from './components/AgTypeBg'
import AgOperator from './components/AgOperator'
export default {
  name: 'ReceiptTitle',
  components: { AddTitle, AgTypeBg, AgOperator },
  data () {
    return {
      name: '',
      type: '',
      nameParams: '',
      components: { AgTypeBg, AgOperator },
      addPoppupStatus: false,
      localeText: this.$ag_grid_localeText,
      context: '',
      options: [
        {
          label: '个人',
          value: 1
        },
        {
          label: '单位',
          value: 2
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      gridOptions: {},
      columnDefs: [
        {
          headerName: '会员卡号',
          field: 'mem_memberCardNum',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员昵称',
          field: 'mem_memberName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员手机号',
          field: 'mem_memberMobile',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '发票类型',
          field: 'prt_type',
          cellRendererFramework: 'AgTypeBg',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '抬头名称',
          field: 'prt_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '联系电话',
          field: 'prt_phone',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '纳税人识别号',
          field: 'prt_identification_number',
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '邮箱',
          field: 'prt_email',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '开户银行',
          field: 'prt_bank',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '时间',
          field: 'created_at',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm')
          }
        },
        {
          headerName: '操作',
          field: 'user.username',
          pinned: 'right',
          cellRendererFramework: 'AgOperator',
          width: this.nowpx(0.08) + 'px'
        }
      ],
      debtRecordData: [],
      dabtCheckOutId: 0
    }
  },
  created () {
    this.getList()
    this.context = this
  },
  methods: {
    getList () {
      const obj = {
        name: this.name,
        nameParams: this.nameParams,
        type: this.type,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('receipt/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.debtRecordData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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
    showPopup (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addRef.init(id)
      })
    },
    // 计算窗口
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 295
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 重置按钮方法
    clearButton () {
      this.name = ''
      this.type = ''
      this.nameParams = ''
      this.getList()
    },
    // 隐藏滚动条
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
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
