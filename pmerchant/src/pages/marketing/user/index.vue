<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-xs">
      <div class="row q-gutter-sm items-center">
        <div class="col-12 col-md-2">
          <q-input clearable label="请输入会员卡号" outlined v-model="searchQuery" dense />
        </div>

        <div class="col-12 col-md-2">
          <q-select
            outlined
            option-value="value"
            option-label="label"
            emit-value
            map-options
            clearable
            :options="$store.state.marketingManage.marketUserTypeData"
            v-model="pmu_type"
            dense
            label="类型"
          />
        </div>

        <q-btn @click="getList()" color="primary" unelevated label="搜索" />
        <q-btn @click="clearnBut()" color="warning" unelevated label="重置" />
        <q-btn @click="editTypeData(0)" color="primary" unelevated label="新增" />
      </div>
    </div>

    <div class="col-shrink bg-white q-px-xs q-py-md row q-col-gutter-sm" v-if="countDataList && countDataList.length > 0">
      <div class="col text-center" v-for="(item, key) in countDataList">
        <q-card flat bordered>
          <q-card-section class="q-pa-xs q-pl-md row items-center">
            <div class="col text-left">
              <div class="text-subtitle2">{{ item.label }}</div>
            </div>

            <div class="col text-right q-pr-sm">
              <span v-if="item.unit" class="text-caption">
                {{ $q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_moneySymbol }}
              </span>
              <span class="text-primary text-h5 text-weight-bold"> {{ formatAmount(item.value) }}</span>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="marketTypeListData"
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
        :localeText="localeText"
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

    <edit-user v-if="isPoppupStatus" @getMethods="getList" ref="addRef"></edit-user>
    <relation-record v-if="detailDialogStatus" @closeDialog="getList" ref="detailDialogRef"></relation-record>
    <reward-record v-if="rewardDialogStatus" @closeDialog="getList" ref="rewardDialogRef"></reward-record>
  </div>
</template>
<script>
import Operator from './components/AgOperator'
import Mode from './components/AgMode'
import EditUser from './components/EditUser.vue'
import RelationRecord from './RelationRecord.vue'
import RewardRecord from './RewardRecord.vue'

export default {
  name: 'marketingType',
  components: {
    Operator,
    Mode,
    EditUser,
    RelationRecord,
    RewardRecord
  },
  data () {
    return {
      isPoppupStatus: false,
      context: null,
      components: {
        Operator,
        Mode
      },
      gridOptions: {},
      marketTypeListData: [],

      columnDefs: [
        {
          headerName: '推广员昵称',
          field: 'nick_name'
        },
        {
          headerName: '推广员卡号',
          field: 'card_number'
        },
        {
          headerName: '推广员手机号',
          field: 'card_number',
          valueGetter: (p) => {
            if (p.data.relationMobile && p.data.relationMobile.length > 0) {
              let text = '  '
              p.data.relationMobile.forEach((item, key) => {
                if (key > 0) {
                  text += '，'
                }
                text += item.phone_number
              })
              text += '  '

              return text
            }
            return '  '
          }
        },
        {
          headerName: '类型',
          field: 'pmu_type',
          valueGetter: (p) => {
            return this.marketUserTypeItem[p.data.pmu_type]
          }
        },
        {
          headerName: '收益方案',
          field: 'marketingType.pmt_title'
        },

        {
          headerName: '推商总数',
          field: 'marketingStoreCount',
          valueGetter: (p) => {
            return p.data.marketingStoreCount
          }
        },

        {
          headerName: '推商收益',
          field: 'getRewardCount',
          valueGetter: (p) => {
            return this.$q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_moneySymbol + ' ' + p.data.getRewardCount
          }
        },

        {
          headerName: '已获得',
          field: 'pmu_withdraw_amount',
          valueGetter: (p) => {
            return this.$q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_moneySymbol + ' ' + p.data.pmu_withdraw_amount
          }
        },

        {
          headerName: '在途中',
          field: 'notGetRewardCount',
          valueGetter: (p) => {
            return this.$q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_moneySymbol + ' ' + p.data.notGetRewardCount
          }
        },

        {
          headerName: '总提现',
          field: 'takeRewardCount',
          valueGetter: (p) => {
            return this.$q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_moneySymbol + ' ' + p.data.takeRewardCount
          }
        },

        {
          headerName: '用户状态',
          field: 'pmu_status',
          cellRendererFramework: 'Mode'
        },

        {
          headerName: '申请时间',
          field: 'created_at',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          headerName: '操作',
          field: 'created_at',
          cellRendererFramework: 'Operator',
          pinned: 'right',
          width: this.nowpx(0.2) + 'px'
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
      marketUserCycleItem: this.$store.state.marketingManage.marketUserCycleItem,
      marketUserTypeItem: this.$store.state.marketingManage.marketUserTypeItem,
      pmu_type: '',
      detailDialogStatus: false,
      rewardDialogStatus: false,
      countDataList: []
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.getUserAmountCount()
    this.getList()
    this.context = this
  },
  methods: {
    getUserAmountCount () {
      this.$store
        .dispatch('marketingManage/getUserAmountCount')
        .then((res) => {
          if (res.code == 200) {
            this.countDataList = res.data ? res.data : []
          }
        })
        .catch((error) => {})
    },
    showDetailView (mUserId) {
      this.detailDialogStatus = true
      this.$nextTick(() => {
        this.$refs.detailDialogRef.init(mUserId)
      })
    },
    showRewardView (mUserId) {
      this.rewardDialogStatus = true
      this.$nextTick(() => {
        this.$refs.rewardDialogRef.init(mUserId)
      })
    },
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    getList () {
      this.detailDialogStatus = false
      this.isPoppupStatus = false
      this.rewardDialogStatus = false
      const obj = {
        text: this.searchQuery,
        pmu_type: this.pmu_type,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('marketingManage/getUserList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.page.totalCount = res.data.page.totalCount
              this.marketTypeListData = res.data.list
            } else {
              this.page.totalCount = 0
              this.marketTypeListData = []
            }
          }
        })
        .catch((error) => {})
    },
    editTypeData (id) {
      this.isPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.addRef.init(id)
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

    clearnBut () {
      this.searchQuery = ''
      this.pmu_type = ''
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
        // params.api.sizeColumnsToFit()
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
