<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-pb-md row q-gutter-sm">
        <div class="col-12 col-md-2">
          <q-input outlined dense v-model="typeData.qrg_name" label="请输入名称" />
        </div>

        <q-btn unelevated color="primary"  label="搜索" @click="getList" />
        <q-btn unelevated color="grey"  label="重置" @click="clearBtn" />

        <q-btn unelevated color="primary"  label="新增" @click="editChargeRule" />

      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center goods-count-table hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="sortListData"
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

    <edit-rule ref="editRuleRef" v-if="editRulePoppupStatus" @dataList="getList()" />
  </q-page>
</template>
<script>
import EditRule from './EditRule'
import TypeAgOperate from './TypeAgOperate'
import Mode from './AgMode'
import AgType from './AgType'
import AgTimeType from './AgTimeType'

export default {
  name: 'DeskType',
  components: {
    EditRule,
    TypeAgOperate,
    Mode,
    AgType,
    AgTimeType
  },
  data () {
    return {
      showDialog: true,
      editRulePoppupStatus: false,
      typeData: {
        qrg_name: ''
      },
      context: null,
      gridOptions: {},
      selectedDeskType: [],
      sortListData: [],
      columnDefs: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: 10
        },

        {
          headerName: '名称',
          field: 'scp_name',
          width: this.nowpx(0.15) + 'px'
        },
        // {
        //   headerName: '是否启用会员价',
        //   field: 'scp_is_member_price',
        //   width: this.nowpx(0.15) + 'px',
        //   cellRendererFramework: 'AgType'

        // },

        {
          headerName: '售价',
          field: 'scp_sell_price',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '时间规则',
          field: 'scp_time_type',
          width: this.nowpx(0.15) + 'px',
          cellRendererFramework: 'AgTimeType'
        },
        {
          headerName: '状态',
          field: 'scp_status',
          width: this.nowpx(0.15) + 'px',
          cellRendererFramework: 'Mode'
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.17) + 'px'
        },

        {
          headerName: '操作',
          width: this.nowpx(0.15) + 'px',
          cellRendererFramework: 'TypeAgOperate'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      fortyEightHourText: {}
    }
  },
  created () {
    this.getList()

    for (var i = 0; i < 24; i++) {
      this.fortyEightHourText[i] = i + '点'
    }

    for (var i = 0; i < 24; i++) {
      this.fortyEightHourText[i + 24] = '次日' + i + '点'
    }
    this.context = this
  },
  methods: {
    getList () {
      this.editRulePoppupStatus = false
      const params = {
        name: this.typeData.qrg_name,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('chargePackage/getChargePackageList', params)
        .then((res) => {
          if (res.code == 200) {
            this.sortListData = res.data ? res.data.list : []
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

    nowpx (px) {
      let nowWidth = this.$q.screen.width - 814
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
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    clearBtn () {
      this.typeData.qrg_name = ''
      this.getList()
    },
    editChargeRule (id) {
      this.editRulePoppupStatus = true
      this.$nextTick(() => {
        this.$refs.editRuleRef.init(id)
      })
    },
    rowSelectedAg (p) {
      this.selectedDeskType = p.api.getSelectedRows()
    },
    // 修改排序的逻辑部分
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
      const regu = /^\d+$/
      if (!regu.test(data.qrg_sort)) {
        data.qrg_sort = 1
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })
        this.$q.notify({
          message: '注意',
          caption: '请输入正整数！',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          color: 'red'
        })

        return false
      }

      this.$store
        .dispatch('roomManage/saveRoomGroup', {
          id: data.id,
          qrg_sort: data.qrg_sort
        })
        .then((res) => {
          if (res.code == 200) {
            this.getList()
            this.$q.notify({
              message: '成功',
              caption: '修改排序成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((err) => {
          this.getList()
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
    hideNowPage () {
      this.$emit('dataList')
    }
  }
}
</script>
