<template>
  <div class="fit bg-grey-3">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <q-card flat class="col-shrinkq-py-sm q-px-xs row q-gutter-sm items-center">
        <div class="col-12 col-md-2">
          <q-input outlined dense v-model="memberInfo" label="请输入会员卡号|手机号|昵称|真实姓名" />
        </div>
        <div class="col-12 col-md-2">
          <q-select
            outlined
            dense
            v-model="cr_unit_id"
            option-value="id"
            option-label="cu_name"
            :options="unitDataList"
            label="请选择材料"
            emit-value
            map-options
          />
        </div>
        <div class="col-12 col-md-2">
          <q-select
            outlined
            dense
            v-model="cr_rule_id"
            option-value="id"
            option-label="cr_name"
            :options="ruleDataList"
            label="请选择利息规则"
            emit-value
            map-options
          >
            <template v-slot:option="scope">
              <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                <q-item-section>
                  <q-item-label>{{ scope.opt.cr_name }}</q-item-label>
                  <q-item-label caption>
                    {{
                      '每' +
                      scope.opt.cu_return_period_time +
                      (parseInt(scope.opt.cu_return_period_property) == 2 || parseInt(scope.opt.cu_return_period_property) == 3 ? '个' : '') +
                      periodTimeObject[scope.opt.cu_return_period_property]
                    }}

                    {{
                      parseInt(scope.opt.cu_interest_type) == 1
                        ? '产生固定利息' + scope.opt.cu_interest_fixed_amount
                        : '产生首存重量的' + scope.opt.cu_interest_proportion + '%的利息'
                    }}
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-12 col-md-2">
          <q-input outlined readonly dense v-model="startTime" label="开始时间">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="startTime" minimal mask="YYYY-MM-DD HH:mm:ss">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-md-2 col-12">
          <q-input outlined readonly dense label="结束时间" v-model="endTime">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="endTime" minimal mask="YYYY-MM-DD HH:mm:ss">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
            <template v-slot:append>
              <q-icon name="access_time" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-time v-model="endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-2">
          <q-input outlined dense v-model="order_no" label="请输入单据号|序列号" />
        </div>

        <div class="col-12 col-md-4" v-if="is_main_store">
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
        <q-btn unelevated color="primary" label="查询" @click="getList" />
        <q-btn unelevated color="warning" label="重置" @click="clearButton" />
        <q-btn unelevated color="primary" label="新增" @click="showAddRecord" v-if="authorityMeta('addRecord')" />
      </q-card>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="recordData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
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
      <hyjc-add-record ref="addRecordRef" v-if="addRecordStatus" @dataList="getDataList" />
      <hyjc-detail ref="detailRef" v-if="detailStatus" @dataList="getDataList" />
    </div>
  </div>
</template>
<script>
import AgOperate from './components/AgOperate'
import hyjcAddRecord from './AddRecord'
import hyjcDetail from './Detail'
export default {
  name: 'clbankRecord',
  components: { AgOperate, hyjcAddRecord, hyjcDetail },
  data () {
    return {
      addRecordStatus: false,
      detailStatus: false,
      typeOptions: [],
      memberInfo: '',
      startTime: '',
      endTime: '',
      selectedRecord: [],
      context: null,
      gridOptions: {},
      recordData: [],
      columnDefs: [
        {
          headerName: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.04) + 'px',
          pinned: 'left'
        },

        {
          headerName: '利息返回模式',
          field: 'cr_operate_type',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return this.operateTypeObject[p.data.cr_operate_type]
          }
        },
        {
          headerName: '单据号',
          field: 'cr_order_no',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '序列号',
          field: 'cr_order_number',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'cr_member_card_number',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '会员昵称',
          field: 'cr_member_name',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '会员真实姓名',
          field: 'cr_member_real_name',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '会员手机号',
          field: 'cr_member_mobile',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '利息规则',
          field: 'rule.cr_name',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '材料',
          field: 'unit.cu_name',
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '首存重量',
          field: 'cr_init_weight',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作重量',
          field: 'cr_change_weight',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '锁定截止时间',
          field: 'cr_lock_end_time',
          width: this.nowpx(0.12) + 'px',

          valueGetter: (p) => {
            if (p.data.cr_lock_end_time) {
              return this.$q_date.formatDate(p.data.cr_lock_end_time * 1000, 'YYYY-MM-DD HH:mm:ss')
            } else {
              return ''
            }
          }
        },

        {
          headerName: '操作员',
          valueGetter: (p) => {
            if (p.data.user && p.data.user.username) {
              return p.data.user.username
            } else {
              return '未知'
            }
          },
          width: this.nowpx(0.12) + 'px'
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
          headerName: '操作',
          width: this.nowpx(0.18) + 'px',
          cellRendererFramework: 'AgOperate',
          pinned: 'right'
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

      operateTypeObject: this.$store.state.clbank.operateTypeObject,
      unitDataList: [],
      ruleDataList: [],
      cr_unit_id: '',
      cr_rule_id: '',
      order_no: '',
      periodTimeObject: this.$store.state.clbank.periodTimeObject,
      interestTypeObject: this.$store.state.clbank.interestTypeObject
    }
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  created () {
    this.getBaseConfigData()
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
    this.context = this
  },
  mounted () {
    this.getList()
  },
  methods: {
    getBaseConfigData () {
      this.$store
        .dispatch('clbank/getBaseConfig')
        .then((res) => {
          if (res.code == 200) {
            this.unitDataList = res.data && res.data.unitDataList ? res.data.unitDataList : []
            this.ruleDataList = res.data && res.data.ruleDataList ? res.data.ruleDataList : []
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
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'all' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },

    getList () {
      const obj = {
        order_no: this.order_no,
        memberInfo: this.memberInfo,
        cr_unit_id: this.cr_unit_id,
        cr_rule_id: this.cr_rule_id,
        startTime: this.startTime,
        endTime: this.endTime,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('clbank/getRecordData', obj)
        .then((res) => {
          this.recordData = res.data ? res.data.list : []
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
    rowSelectedAg (p) {
      this.selectedRecord = p.api.getSelectedRows()
    },

    clearButton () {
      this.memberInfo = ''

      this.startTime = ''
      this.endTime = ''
      this.cr_rule_id = ''
      this.cr_unit_id = ''
      this.order_no = ''
      this.selectStoreData = []
      this.getList()
    },
    showAddRecord (id) {
      this.addRecordStatus = true
      this.$nextTick(() => {
        this.$refs.addRecordRef.init(id)
      })
    },
    showDetail (id) {
      this.detailStatus = true
      this.$nextTick(() => {
        this.$refs.detailRef.init(id)
      })
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
    getDataList () {
      this.addRecordStatus = false
      this.detailStatus = false
      this.getList()
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
