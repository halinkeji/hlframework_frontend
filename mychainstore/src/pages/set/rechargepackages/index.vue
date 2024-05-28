<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white " :class="{ 'q-pb-lg': parseInt(activeName) == 0 ? true : false }">
        <q-tabs
          v-model="activeName"
          class="bg-white"
          active-color="primary"
          indicator-color="primary"
          align="left"
          content-class="text-grey-9"
          narrow-indicator
          dense
        >
          <q-tab name="0">
            <span>
              充值套餐设置
            </span>
          </q-tab>
          <q-tab name="1">
            <span>
              分期上账记录
            </span>
          </q-tab>
        </q-tabs>
        <div class="row q-px-sm q-gutter-x-sm items-center" v-if="parseInt(activeName) == 0">
          <q-input class="col-12 col-md-2" clearable label="请输入套餐名称" outlined v-model="packageName" dense />
          <q-select
            class="col-12 col-md-2"
            outlined
            option-value="value"
            option-label="label"
            emit-value
            map-options
            v-model="packageStatus"
            :options="status"
            dense
            label="套餐状态"
            clearable
          />
          <div class="col-12 col-md-4" v-if="is_main_store">
            <q-select
              label="查询门店"
              v-model="selectStoreData"
              option-value="id"
              option-label="name"
              multiple
              emit-value
              map-options
              dense
              outlined
              clearable
              use-chips
              :options="libInStoreList"
            />
          </div>

          <q-btn @click="getList()" color="primary"  unelevated label="搜索" />
          <q-btn @click="clearButton" color="warning"  unelevated label="重置" />
          <q-btn @click="addRechargePackage()" color="primary"  unelevated v-if="authorityMeta('add')" label="新增" />
          <q-btn
            :disable="dataListSelections.length > 0 ? false : true"
            @click="delAll"
            color="red"
            unelevated
            v-if="authorityMeta('delAll')"
            label="批量删除"
          />
          <!-- <q-btn @click="testRecharge" color="primary" class="q-mt-sm" unelevated label="测试" /> -->
        </div>
      </div>

      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2" v-if="parseInt(activeName) == 0">
        <ag-grid-vue
          ref="agGridTable"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="packageData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="60"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          :localeText="localeText"
          :gridOptions="gridOptions"
          @rowSelected="rowSelectedAg"
          :singleClickEdit="true"
          :stopEditingWhenGridLosesFocus="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white full-height bg-grey-2" v-if="parseInt(activeName) == 1">
        <consumption-receipt></consumption-receipt>
      </div>

      <div class="col-shrink bg-white q-pb-md" v-if="parseInt(activeName) == 0">
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

      <add-recharge-packages
        ref="rechargePackagesRef"
        @saveSuccess="
          addDialog = false
          getList()
        "
        v-if="addDialog"
        @closeDialog="addDialog = false"
      ></add-recharge-packages>
    </div>
  </q-page>
</template>

<script>
import AgSwitch from './components/AgSwitch'
import Operating from './components/AgOperator'
import ConsumptionReceipt from './components/ConsumptionReceipt'
import AddRechargePackages from './components/AddRechargePackages'
export default {
  name: 'rechargePackages',
  components: { AgSwitch, Operating, ConsumptionReceipt, AddRechargePackages },
  data () {
    return {
      activeName: '0',
      localeText: this.$ag_grid_localeText,
      context: null,
      components: {
        AgSwitch,
        Operating
      },
      dataListSelections: {},
      packageData: [],
      columnDefs: [
        {
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.04) + 'px'
        },
        {
          headerName: '排序',
          field: 'rp_sort',
          editable: true,
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: ' 充值套餐名称',
          field: 'rp_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '充值金额', // 列标题
          field: 'rp_money', // 列与数据源对应的字段
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '赠送' + this.$q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_balanceUnit,
          field: 'rp_give_money',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '赠送' + this.$q.localStorage.getItem('mychainstore_store_local').storeBaseConfig.consume_base_integralUnit,
          field: 'rp_give_points',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '套餐开始时间',
          field: 'rp_start_time',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.rp_start_time * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '套餐结束时间',
          field: 'rp_end_time',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.rp_end_time * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.1) + 'px'
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
      packageStatus: '',
      status: [
        {
          value: 1,
          label: '开启'
        },
        {
          value: 2,
          label: '关闭'
        }
      ],
      packageName: '',
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      addDialog: false,
      selectStoreData: [],
      libInStoreList: []
    }
  },
  created () {
    this.context = this

    if (this.is_main_store) {
      this.getLibInStoreData()
    }
    const manageColumn = [
      {
        headerName: '状态',
        field: 'rp_status',
        cellRendererFramework: 'AgSwitch',
        width: this.nowpx(0.1) + 'px'
      },
      {
        headerName: ' 操作',
        cellRendererFramework: 'Operating',
        width: this.nowpx(0.16) + 'px'
      }
    ]
    const storeLocal = this.$q.localStorage.getItem('mychainstore_store_local')
    if (this.is_main_store || (storeLocal && storeLocal.supermodel && parseInt(storeLocal.supermodel.psc_private_recharge_package) == 1)) {
      for (let i = 0; i < manageColumn.length; i++) {
        this.columnDefs.push(manageColumn[i])
      }
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
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getList () {
      const obj = {
        packageStatus: this.packageStatus,
        packageName: this.packageName,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('rechargepackages/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.totalCount = res.data ? res.data.page.totalCount : 0
            this.packageData = res.data ? res.data.list : []
            this.dataListSelections = {}
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

    testRecharge () {
      const obj = {}
      this.$store
        .dispatch('rechargepackages/testRecharge', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'positive'
            })
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

    clearButton () {
      this.packageName = ''
      this.packageStatus = ''
      this.selectStoreData = []
      this.getList()
      this.dataListSelections = []
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },

    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条套餐信息吗`,
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
        this.$store.dispatch('rechargepackages/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条套餐信息'
            })
            this.getList()
            this.dataListSelections = {}
          }
        })
      }
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
        params.api.sizeColumnsToFit()
      }
    },
    // 排序
    changeNumber (p) {
      const data = p.data
      const regu = /^\+?[0-9][0-9]*$/
      if (!regu.test(data.rp_sort)) {
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
          rp_sort: data.rp_sort,
          id: data.id
        }
        this.$store
          .dispatch('rechargepackages/setData', obj)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '修改排序成功',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right',
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
        const new_arr = this.$route.meta.map((obj) => {
          return obj.id
        })
        if (new_arr.indexOf(key) >= 0) {
          return true
        }
      }
      return false
    },
    addRechargePackage (packageId) {
      this.addDialog = true
      this.$nextTick(() => {
        this.$refs.rechargePackagesRef.init(packageId)
      })
    }
  }
}
</script>
