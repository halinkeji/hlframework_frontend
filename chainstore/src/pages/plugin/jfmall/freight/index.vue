<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm">
      <div class="row q-gutter-x-sm">
        <div class="col-12 col-md-2">
          <q-input label="请输入模板名称" outlined v-model="searchQuery" dense />
        </div>

        <div class="col-12 col-md-2">
          <q-select
            outlined
            option-value="value"
            option-label="label"
            emit-value
            map-options
            v-model="postageStatus"
            :options="status"
            dense
            label="邮寄方式"
          />
        </div>

        <q-btn @click="getList()" color="primary" unelevated label="搜索" />
        <q-btn @click="clearnButton()" color="warning" unelevated label="重置" />
        <q-btn @click="openAddDialog" color="primary"  unelevated label="新增" />
        <q-btn
          :disabled="dataListSelections.length > 0 ? false : true"
          @click="delAll()"
          color="red"
          unelevated
          label="批量删除"
        />
      </div>
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="freightList"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
        rowSelection="multiple"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :context="context"
        @rowSelected="rowSelectedAg"
        :localeText="localeText"
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
        :total="page.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>

    <add-freight ref="jfmallFreightRef" @closeDialog="getList" v-if="addDialogStatus" />
  </div>
</template>
<script>
import AgOperator from './components/AgOperator'

import AddFreight from './components/AddFreight'

export default {
  name: 'freight',
  components: {
    AgOperator,
    AddFreight
  },
  data () {
    return {
      postageStatus: '',
      status: [
        {
          value: 1,
          label: '包邮'
        },
        {
          value: 2,
          label: '自定义运费'
        }
      ],

      context: null,
      components: {
        AgOperator
      },
      gridOptions: {},
      freightList: [],
      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '运费模板名称',
          field: 'jft_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '发货地',
          field: 'psc_app_key',
          valueGetter: (p) => {
            return p.data.jft_delivery_province + p.data.jft_delivery_city + p.data.jft_delivery_district + p.data.jft_delivery_address
          },
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '是否包邮',
          field: 'jft_is_pay_postage',
          valueGetter: (p) => {
            if (p.data.jft_is_pay_postage == '1') {
              return '包邮'
            } else {
              return '自定义运费'
            }
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '运费规则',
          field: 'jft_is_pay_postage',
          valueGetter: (p) => {
            if (p.data.jft_is_pay_postage == '1') {
              return '包邮'
            } else {
              return (
                '默认运费' +
                p.data.jft_default_quantity +
                '件内' +
                p.data.jft_default_freight +
                this.$q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneyUnit +
                '，每增加' +
                p.data.jft_continue_quantity +
                '件，增加运费' +
                p.data.jft_continue_freight +
                this.$q.localStorage.getItem('chainstore_store_local').storeBaseConfig.consume_base_moneyUnit
              )
            }
          },
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '是否有指定区域',
          field: 'created_at',
          valueGetter: (p) => {
            if (p.data.detailFrom.length > 0) {
              return '是'
            } else {
              return '否'
            }
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: ' 操作',
          cellRendererFramework: 'AgOperator',
          width: this.nowpx(0.08) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,
      searchQuery: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      dataListSelections: [],
      addDialogStatus: false
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
      this.addDialogStatus = false
      const obj = {
        status: this.postageStatus,
        nameParams: this.searchQuery,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('jfFreight/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.freightList = res.data ? res.data.list : []
            this.dataListSelections = []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            caption: error.message,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    openAddDialog (id) {
      this.addDialogStatus = true
      this.$nextTick(() => {
        this.$refs.jfmallFreightRef.init(id)
      })
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
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条运费模板信息吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
    },
    deleteRecord () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.$store.dispatch('jfFreight/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条运费模板'
            })
            this.getList()
            this.dataListSelections = []
          }
        })
      }
    },
    clearnButton () {
      this.searchQuery = ''
      this.postageStatus = ''
      this.getList()
      this.dataListSelections = []
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
