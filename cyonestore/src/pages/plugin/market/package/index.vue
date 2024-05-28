<template>
  <div class="fit bg-grey-3">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white q-mb-sm">
        <q-card flat class="q-pa-sm row q-gutter-xs">
          <q-input outlined dense v-model="packageName" label="请输入权益名称" class="col-12 col-md-2" />
          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
          <q-btn unelevated color="warning" dense label="重置" @click="clearButton" class="q-px-md" />
          <q-btn unelevated color="primary" dense label="新增" @click="showAddPackage" class="q-px-md" v-if="authorityMeta('addPackage')" />
            <q-btn
            unelevated
            color="red"
            dense
            label="批量删除"
            :disable="selectedPackage.length > 0 ? false : true"
            @click="delAll"
            class="q-px-md"
            v-if="authorityMeta('delPackage')"
          />
        </q-card>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="packageList"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
          @rowSelected="rowSelectedAg"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          :context="context"
          :localeText="localeText"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :stopEditingWhenGridLosesFocus="true"
          :suppressRowDeselection="true"
          :suppressRowTransform="true"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
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
    <market-add-package ref="addPackageRef" v-if="addPoppupStatus" @dataList="hidePackagePoppup" />
  </div>
</template>
<script>
import MarketAddPackage from './AddPackage'
import AgOperate from './components/AgOperate'
export default {
  name: 'MarketLevel',
  components: {
    AgOperate,
    MarketAddPackage
  },
  data () {
    return {
      addPoppupStatus: false,
      packageName: '',
      context: '',
      selectedPackage: [],
      packageList: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.04) + 'px'
        },
        {
          headerName: '排序',
          field: 'pmp_sort',
          width: this.nowpx(0.05) + 'px',
          editable: (p) => {
            return !p.data.showEdit
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber
        },
        {
          headerName: '权益名称',
          field: 'pmp_name',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '佣金比例',
          valueGetter: (p) => {
            return p.data.pmp_market_proportion + '%'
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '佣金',
          field: 'pmp_market_amount',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '赠送' + this.$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_balanceUnit,
          field: 'pmp_give_balance',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '赠送' + this.$q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_integralUnit,
          field: 'pmp_give_integral',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.16) + 'px',
          cellRendererFramework: 'AgOperate'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText
    }
  },
  created () {
    this.getList()
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    getList () {
      const params = {
        packageName: this.packageName,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('market/getPackageListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.packageList = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确定',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 个分佣权益吗`,
          cancel: true
        })
        .onOk(() => {
          const selectedPackage = this.gridOptions.api.getSelectedRows()
          if (selectedPackage.length > 0) {
            const params = selectedPackage.map((item) => {
              return item.id
            })
            this.$store.dispatch('market/delPackageAll', params).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 个分佣权益',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.selectedPackage = []
                this.getList()
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  color: 'red',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right'
                })
              }
            })
          }
        })
        .onCancel(() => {})
    },
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^\d+$/
      if (!regu.test(data.pmp_sort)) {
        this.getList()
        this.$q.notify({
          message: '注意',
          caption: '请输入正整数！',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })
      } else {
        itemsToUpdate.push(data)
        this.$store
          .dispatch('market/setPackageData', data)
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                message: '成功',
                caption: '修改排序成功',
                color: 'green',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.getList()
            }
          })
          .catch((err) => {
            this.$q.notify({
              message: '失败',
              caption: err.message,
              color: 'red',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.getList()
          })
      }
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 274
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearButton () {
      this.packageName = ''
      this.getList()
    },
    showAddPackage (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addPackageRef.init(id)
      })
    },
    hidePackagePoppup () {
      this.addPoppupStatus = false
      this.getList()
    },
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    rowSelectedAg (p) {
      this.selectedPackage = p.api.getSelectedRows()
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
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
    }
  }
}
</script>
