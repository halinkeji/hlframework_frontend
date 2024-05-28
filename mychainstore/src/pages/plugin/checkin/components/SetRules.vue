div<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-sm q-pb-md row q-gutter-x-sm">
      <div class="col-4" v-if="is_main_store">
        <q-select label="查询门店" use-chips  clearable v-model="selectStoreData" option-value="id" option-label="name" multiple emit-value map-options dense outlined :options="libInStoreList" />
      </div>
      <q-select
        class="col-12 col-md-2"
        outlined
        option-value="value"
        option-label="label"
        emit-value
        map-options
        v-model="ruleType"
        :options="rulesType"
        dense
        label="请选择规则类型"
      />
      <q-btn @click="getList" color="primary"  unelevated label="搜索" />
      <q-btn @click="clearnButton" color="warning"  unelevated label="重置" />
      <q-btn @click="addChechinRules(0)" color="primary"  unelevated label="新增" v-if="authorityMeta('add')" />
      <q-btn
        :disable="dataListSelections.length > 0 ? false : true"
        @click="delAll"
        color="red"
        unelevated
        v-if="authorityMeta('delAll')"
        label="批量删除"
      />
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="checkinRulesList"
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
        :page-sizes="[ 20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pSize"
        :total="page.totalCount"
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>
    <add-rules v-if="isPoppupStatus" @getMethods="getList" ref="addRulesRef"></add-rules>
  </div>
</template>
<script>
import AgOperator from './AgOperate'
import AddRules from './AddRules'
import AgChip from './AgChip'

export default {
  name: 'SetRules',
  components: { AgOperator, AddRules, AgChip },
  data () {
    return {
      rulesType: this.$store.state.checkin.rulesType,
      isPoppupStatus: false,
      context: null,
      components: { AgOperator, AgChip },
      gridOptions: {},
      checkinRulesList: [],
      columnDefs: [
        {
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '排序',
          field: 'cr_sort',
          editable: true,
          onCellValueChanged: this.changeSort,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '规则类型',
          cellRendererFramework: 'AgChip',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '连续/累计天数',
          valueGetter: (p) => {
            if (p.data.cr_type == 1 || p.data.cr_type == 2) {
              return 0
            } else {
              return p.data.cr_day
            }
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '赠送' + this.$q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_integralUnit,
          field: 'cr_give_points',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '赠送' + this.$q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
          field: 'cr_give_money',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '操作',
          cellRendererFramework: 'AgOperator',
          width: this.nowpx(0.2) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,
      ruleType: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      dataListSelections: [],
      selectStoreData: [],
      libInStoreList: []
    }
  },
  mounted () {
    this.getList()
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
    this.context = this
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getList () {
      this.isPoppupStatus = false
      const obj = {
        text: this.ruleType,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('checkin/getList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.checkinRulesList = res.data ? res.data.list : []
            this.dataListSelections = []
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
    addChechinRules (id) {
      this.isPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addRulesRef.getItem(id)
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
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条规则吗`,
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
        this.$store.dispatch('checkin/delRule', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条规则'
            })
            this.getList()
            this.dataListSelections = []
          }
        })
      }
    },
    clearnButton () {
      this.ruleType = ''
      this.selectStoreData = []
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
    changeSort (p) {
      const data = p.data
      const regu = /^\+?[0-9][0-9]*$/
      if (!regu.test(data.cr_sort)) {
        this.$q.notify({
          message: '错误',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          caption: '请输入正整数',
          color: 'red'
        })
        this.getList()
      } else {
        const obj = {
          cr_sort: data.cr_sort,
          id: data.id
        }
        this.$store
          .dispatch('checkin/setRule', obj)
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
              this.getList()
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
