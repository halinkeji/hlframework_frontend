<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md row q-gutter-xs">
        <q-tabs @input="getFixedmoneyList" class="bg-white q-mt-sm" active-color="primary" indicator-color="primary" align="left" content-class="text-grey-9" narrow-indicator dense v-model="activeTab">
          <q-tab name="1" :label="`增加/扣除${$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit}操作`" />
          <q-tab name="2" label="快速消费" />
          <q-tab name="3" label="会员充值" />
          <q-tab name="4" :label="`${$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_balanceUnit}扣费`" />
      <q-tab name="6" label="油品收银|自助加油" />
         </q-tabs>
        <q-space />
        <q-btn @click="showPopup()" color="primary" class="col-12 col-md-1  q-mt-sm" unelevated v-if="authorityMeta('add')" label="新增" />
        <q-btn @click="deleteAll()" :disable="dataListSelections.length > 0 ? false : true" color="red" class="col-12 col-md-1 q-mt-sm " unelevated v-if="authorityMeta('allDel')" label="批量删除" />
      </div>

      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table  hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :gridOptions="gridOptions"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="CreditOperateData"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :suppressCellSelection="true"
          :localeText="localeText"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
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
          :total="page.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
    </div>

    <add-money-poppup ref="addMoneyPoppupRef" :type="activeTab" v-if="addPoppupStatus" @dataList="getDataList" />
  </q-page>
</template>
<script>
import AddMoneyPoppup from './components/AddMoneyPoppup.vue'
import AgOperate from './components/AgOperate.vue'
export default {
  components: {
    AddMoneyPoppup,
    AgOperate
  },
  data () {
    return {
      activeTab: '1',
      dataListSelections: 0,
      addPoppupStatus: false,
      gridOptions: {},
      CreditOperateData: [],
      columnDefs: [
        {
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: false,
          headerCheckboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '排序',
          field: 'fm_order',
          filter: false,
          editable: true,
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.25) + 'px'
        },
        {
          headerName: '固定数值',
          field: 'fm_parameter',
          filter: false,
          width: this.nowpx(0.275) + 'px'
        },
        {
          headerName: '类型',
          field: 'fm_type',
          filter: false,
          valueGetter: (p) => {
            if (p.data.fm_type == 1) {
              return '增加/扣除' + this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit
            }
            if (p.data.fm_type == 2) {
              return '快速消费'
            }
            if (p.data.fm_type == 3) {
              return '会员充值'
            }
            if (p.data.fm_type == 4) {
              return this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_balanceUnit + '扣费'
            }
            if (p.data.fm_type == 6) {
              return '油品收银|自助加油'
            }
          },
          width: this.nowpx(0.25) + 'px'
        },
        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'AgOperate',
          width: this.nowpx(0.17) + 'px'
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
      type: ''
    }
  },
  mounted () {
    this.getFixedmoneyList(1)
  },
  created () {
    this.context = this
  },
  computed: {},
  methods: {
    getDataList (val) {
      this.addPoppupStatus = false
      this.activeTab = val
      this.getFixedmoneyList()
    },
    showPopup (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addMoneyPoppupRef.init(id, this.activeTab)
      })
    },
    // 批量删除
    deleteAll () {
      this.deleteBut()
    },
    // 批量删除是否可用
    deleteSelectBut (val) {
      this.dataListSelections = val
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getFixedmoneyList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getFixedmoneyList()
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

    // 获取列表
    getFixedmoneyList () {
      const obj = {
        type: this.activeTab,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('fixed/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.page.totalCount = res.data.page.totalCount
              this.CreditOperateData = res.data.list
            } else {
              this.page.totalCount = 0
              this.CreditOperateData = []
            }
          }
        })
        .catch((error) => {})
    },

    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^\+?[0-9][0-9]*$/
      if (!regu.test(data.fm_order)) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请输入正整数',
          color: 'red'
        })
        this.getFixedmoneyList()
      } else {
        const obj = {
          fm_order: data.fm_order,
          id: data.id
        }
        this.$store
          .dispatch('fixed/addData', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '修改排序成功',
                color: 'green'
              })
              this.getFixedmoneyList()
            }
          })
          .catch((error) => {})
      }
    },

    // 批量删除
    deleteBut () {
      if (this.dataListSelections.length > 0) {
        this.$q
          .dialog({
            type: 'confirm',
            color: 'primary',
            title: '是否确认',
            message: `确定批量删除 ${this.gridOptions.api.getSelectedRows().length} 条数据吗？`,
            cancel: true
          })
          .onOk(() => {
            const obj = this.dataListSelections.map((item) => {
              return item.id
            })
            this.$store
              .dispatch('fixed/delData', obj)
              .then((res) => {
                if (res.code == 200) {
                  this.$q.notify({
                    color: 'green',
                    message: '删除成功',
                    caption: '成功删除 ' + res.data + ' 条',
                    icon: 'ion-checkmark-circle-outline',
                    timeout: 500,
                    position: 'top-right'
                  })
                  this.getFixedmoneyList()
                }
              })
              .catch((error) => {})
          })
      }
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
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
