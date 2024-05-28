<template>
  <div class="fit bg-grey-3">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="bg-white">
        <q-card flat class="q-py-sm q-px-xs row q-gutter-xs">

          <div class="col-12 col-md-2">
            <q-select
              outlined
              dense
              v-model="memberLevel"
              option-label="mcl_level_name"
              option-value="id"
              :options="memberLevelData"
              label="会员级别"
              emit-value
              map-options
            />
          </div>

          <div class="col-12 col-md-1">
            <q-select outlined dense v-model="ruleStatus" :options="statusOptions" label="规则状态" option-label="label" emit-value map-options />
          </div>
          <div class="col-12  col-md-4" v-if="is_main_store">
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
          <q-btn unelevated color="primary" dense label="查询" class="q-px-md" @click="getList" />
          <q-btn unelevated color="warning" dense label="重置" @click="clearButton" class="q-px-md" />
          <q-btn unelevated color="primary" dense label="新增" @click="openRuleDialog(0)" class="q-px-md" v-if="authorityMeta('add')" />
          <q-btn
            unelevated
            color="red"
            :disable="selectedRule.length > 0 ? false : true"
            dense
            label="批量删除"
            @click="delAllRule"
            class="q-px-md"
            v-if="authorityMeta('delRule')"
          />
        </q-card>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="ruleData"
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
      <add-rule v-if="addRuleDialogStatus" ref="addRuleDialogRef" @closeDialog="closeDialog" />
    </div>
  </div>
</template>
<script>
import AgOperate from './components/AgOperate'
import AgStatus from './components/AgStatus'
import AgCycle from './components/AgCycle'
import AddRule from './AddRule'
export default {
  name: 'hyryxRule',
  components: {
    AgOperate,
    AgStatus,
    AgCycle,
    AddRule
  },
  data () {
    return {
      memberLevel: '',
      ruleStatus: '',
      selectedRule: [],
      context: null,
      gridOptions: {},
      ruleData: [],
      typeOptions: [
        {
          label: '每周',
          value: 1
        },
        {
          label: '每月',
          value: 2
        }
      ],
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
      memberLevelData: [],
      columnDefs: [
        // {
        //   headerName: '',
        //   headerCheckboxSelectionFilteredOnly: true,
        //   headerCheckboxSelection: true,
        //   checkboxSelection: true,
        //   width: this.nowpx(0.03) + 'px'
        // },

        {
          headerName: '会员级别',
          field: 'level.mcl_level_name',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '规则周期',
          cellRendererFramework: 'AgCycle',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '随机金额比例',
          valueGetter: (p) => {
            return p.data.phr_random_amount_ratio + '%'
          },
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '状态',
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'AgStatus'
        },
        {
          headerName: '添加时间',
          field: 'created_at',
          width: this.nowpx(0.12) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          headerName: '门店',
          field: 'store.name',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.15) + 'px',
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
      libInStoreList: [],
      addRuleDialogStatus: false
    }
  },
  created () {
    this.context = this
    this.getLevel()
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  mounted () {
    this.getList()
  },
  methods: {
    openRuleDialog (ruleId) {
      this.addRuleDialogStatus = true
      this.$nextTick(() => {
        this.$refs.addRuleDialogRef.init(ruleId)
      })
    },
    closeDialog () {
      this.addRuleDialogStatus = false
      this.getList()
    },
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'all' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getLevel () {
      this.$store
        .dispatch('level/getAllData')
        .then((res) => {
          if (res.code == 200) {
            this.memberLevelData = res.data ? res.data : []
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: '操作失败',
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    getList () {
      const obj = {
        memberLevel: this.memberLevel,
        ruleStatus: this.ruleStatus,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('hbyx/getRuleData', obj)
        .then((res) => {
          this.ruleData = res.data ? res.data.list : []
          this.page.pageTotal = res.data ? res.data.page.totalCount : 0
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    delAllRule () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条营销规则吗`,
          cancel: true
        })
        .onOk(() => {
          const selectedRule = this.gridOptions.api.getSelectedRows()
          if (selectedRule.length > 0) {
            const obj = selectedRule.map((item) => {
              return item.id
            })
            this.$store.dispatch('hyryx/delRuleAll', obj).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 条营销规则',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.selectedRule = []
                this.getList()
              }
            })
          }
        })
        .onCancel(() => {})
    },
    rowSelectedAg (p) {
      this.selectedRule = p.api.getSelectedRows()
    },
    clearButton () {
      this.memberLevel = ''
      this.ruleStatus = ''
      this.selectStoreData = []
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
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 298
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
