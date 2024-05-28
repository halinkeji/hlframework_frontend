<template>
  <q-page class="fit">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white q-mb-sm">
        <kmjh-add-package ref="addPackageRef" v-if="addPoppupStatus" @dataList="hidePackagePoppup" />
        <kmjh-lists ref="listsRef" v-if="listsPoppupStatus" @dataList="hideListsPoppup" />
        <q-card flat class="q-pa-sm row q-gutter-xs">
          <q-input outlined dense v-model="packageData.pkp_name" label="请输名称" class="col-12 col-md-2" />
          <q-select
            outlined
            dense
            v-model="packageData.pkp_type"
            :options="typeOptions"
            label="请选择类型"
            class="col-12 col-md-2"
            option-label="label"
            emit-value
            map-options
          />
          <q-select
            outlined
            dense
            v-model="packageData.pkp_status"
            :options="statusOptions"
            label="请选择状态"
            class="col-12 col-md-2"
            option-label="label"
            emit-value
            map-options
          />
          <div class="col-12 col-md-3" v-if="is_main_store">
            <q-select
              label="查询门店"
              clearable
              v-model="selectStoreData"
              use-chips
              option-value="id"
              option-label="name"
              multiple
              emit-value
              map-options
              dense
              outlined
              :options="libInStoreList"
            />
          </div>
          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
          <q-btn unelevated color="warning" dense label="重置" @click="clearBtn" class="q-px-md" />
          <q-btn unelevated color="primary" dense label="新增" @click="showAddPackage" class="q-px-md" v-if="authorityMeta('addPackage')" />
          <q-btn
            unelevated
            color="red"
            dense
            label="批量删除"
            :disable="selectedPackage.length > 0 ? false : true"
            @click="delAll"
            class="q-px-md"
            v-if="authorityMeta('delAllPackage')"
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
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
    </div>
  </q-page>
</template>
<script>
import AgOperate from './components/AgOperate'
import AgStatus from './components/AgStatus'
import KmjhAddPackage from './AddPackage'
import KmjhLists from './Lists'
export default {
  name: 'Kmjh',
  components: {
    AgOperate,
    AgStatus,
    KmjhAddPackage,
    KmjhLists
  },
  data () {
    return {
      addPoppupStatus: false,
      listsPoppupStatus: false,
      packageData: {
        pkp_name: '',
        pkp_status: ''
      },
      context: '',
      statusOptions: [
        {
          label: '开启',
          value: 1
        },
        {
          label: '关闭',
          value: -1
        }
      ],
      typeOptions: [
        {
          label: '卡密充值',
          value: 1
        },
        {
          label: '卡密激活',
          value: 2
        }
      ],
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
          headerName: '名称',
          field: 'pkp_name',
          width: this.nowpx(0.14) + 'px'
        },
        {
          headerName: '售价',
          field: 'pkp_selling_price',
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '类型',
          valueGetter: (p) => {
            if (parseInt(p.data.pkp_type) == 2) {
              return '卡密充值'
            } else {
              return '卡密激活'
            }
          },
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '赠送' + this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_balanceUnit,
          field: 'pkp_give_balance',
          width: this.nowpx(0.14) + 'px'
        },
        {
          headerName: '赠送' + this.$q.localStorage.getItem('myouka_store_local').storeBaseConfig.consume_base_integralUnit,
          field: 'pkp_give_integral',
          width: this.nowpx(0.14) + 'px'
        },
        {
          headerName: '状态',
          width: this.nowpx(0.12) + 'px',
          cellRendererFramework: 'AgStatus'
        },

        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.14) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.18) + 'px',
          cellRendererFramework: 'AgOperate'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      selectStoreData: [],
      libInStoreList: []
    }
  },
  created () {
    this.context = this

    if (this.is_main_store) {
      this.getLibInStoreData()
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
      const params = {
        packageName: this.packageData.pkp_name,
        packageType: this.packageData.pkp_type,
        packageStatus: this.packageData.pkp_status,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('kmjh/getListData', params)
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
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 套规则吗`,
          cancel: true
        })
        .onOk(() => {
          const selectedPackage = this.gridOptions.api.getSelectedRows()
          if (selectedPackage.length > 0) {
            const params = selectedPackage.map((item) => {
              return item.id
            })
            this.$store.dispatch('kmjh/delAll', params).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 套规则',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.selectedPackage = []
                this.getList()
              } else {
                this.$q.notify({
                  message: '删除失败',
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
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 274
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearBtn () {
      this.packageData = {}
      this.selectStoreData = []
      this.getList()
    },
    showAddPackage (id) {
      this.addPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addPackageRef.init(id)
      })
    },
    showLists (id, type, pkp_name) {
      this.listsPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.listsRef.getList(id, type, pkp_name)
      })
    },
    hidePackagePoppup () {
      this.addPoppupStatus = false
      this.getList()
    },
    hideListsPoppup () {
      this.listsPoppupStatus = false
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
