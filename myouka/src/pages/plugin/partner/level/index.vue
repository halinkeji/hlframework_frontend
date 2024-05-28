<template>
  <q-page class="fit bg-grey-3">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white q-mb-sm">
        <q-card flat class="q-pa-sm row q-gutter-xs">
          <q-input outlined dense v-model="levelName" label="请输入等级名称" class="col-12 col-md-2" />
          <q-select
            outlined
            dense
            class="col-12 col-md-2"
            v-model="type"
            :options="typeOptions"
            label="级别类别"
            option-label="label"
            emit-value
            map-options
          />
          <q-select
            outlined
            dense
            v-model="status"
            :options="statusOptions"
            label="状态"
            class="col-12 col-md-2"
            option-label="label"
            emit-value
            map-options
          />
          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
          <q-btn unelevated color="grey-6 " dense label="重置" @click="clearButton" class="q-px-md" />
          <q-btn unelevated color="primary" dense label="新增" :to="{ name: 'partnerAddLevel' }" class="q-px-md" v-if="authorityMeta('addLevel')" />
          <q-btn
            color="red"
            class=""
            unelevated
            :disable="selectedLevel.length > 0 ? false : true"
            label="批量删除"
            v-if="authorityMeta('delAll')"
            @click="delAll()"
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
          :rowData="LevelList"
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
  </q-page>
</template>
<script>
import AgOperate from './components/AgOperate'
import AgStatus from './components/AgStatus'
export default {
  name: 'partnerLevel',
  components: {
    AgOperate,
    AgStatus
  },
  data () {
    return {
      addPoppupStatus: false,
      levelName: '',
      status: '',
      type: '',
      context: '',
      selectedLevel: [],
      LevelList: [],
      gridOptions: {},
      statusOptions: [
        {
          label: '开启',
          value: '1'
        },
        {
          label: '关闭',
          value: '-1'
        }
      ],
      typeOptions: [
        {
          label: '会员',
          value: '1'
        },
        {
          label: '员工',
          value: '2'
        },
        {
          label: '股东',
          value: '3'
        }
      ],
      columnDefs: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.04) + 'px'
        },
        {
          headerName: '等级名称',
          field: 'ppl_name',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '等级类型',
          valueGetter: (p) => {
            switch (parseInt(p.data.ppl_type)) {
              case 1:
                return '会员'
              case 2:
                return '员工'
              case 3:
                return '股东'
              default:
                return false
            }
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '状态',
          width: this.nowpx(0.1) + 'px',
          cellRendererFramework: 'AgStatus'
        },
        {
          headerName: '升级方式',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            switch (parseInt(p.data.ppl_upgrade_property)) {
              case 1:
                if (p.data.ppl_type == 3) {
                  return '固定级别'
                } else {
                  return '条件升级'
                }

              case 2:
                return '付费升级'
              default:
                return false
            }
          }
        },
        {
          headerName: '单次消费满金额',
          field: 'ppl_one_consume_full_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '单次充值满金额',
          field: 'ppl_one_recharge_full_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '推荐所有会员数',
          field: 'ppl_all_member_quantity',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '推荐付费会员累计数',
          field: 'ppl_pay_member_quantity',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '付费会员累计总额',
          field: 'ppl_member_pay_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '分红比率',
          field: 'ppl_partner_proportion',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.12) + 'px',
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
        status: this.status,
        type: this.type,
        levelName: this.levelName,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('partner/getListData', params)
        .then((res) => {
          if (res.code == 200) {
            this.LevelList = res.data ? res.data.list : []
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
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 274
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    clearButton () {
      this.levelName = ''
      this.status = ''
      this.type = ''
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
      this.selectedLevel = p.api.getSelectedRows()
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: '确定删除合伙人级别吗',
          cancel: true
        })
        .onOk(() => {
          const dataListSelections = this.gridOptions.api.getSelectedRows()
          if (dataListSelections.length > 0) {
            const obj = dataListSelections.map((item) => {
              return item.id
            })
            this.$store.dispatch('partner/delAll', obj).then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功删除 ' + res.data + ' 条！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.getList()
                this.selectedLevel = {}
              } else {
                this.$q.notify({
                  message: '删除失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  timeout: 500,
                  position: 'top-right'
                })
                this.getList()
                this.selectedLevel = {}
              }
            })
          }
        })
        .onCancel(() => {})
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    authorityMeta (key) {
      return true
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
