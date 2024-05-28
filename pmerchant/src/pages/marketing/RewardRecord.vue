<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-xs q-gutter-xs q-pt-xs">
      <div class="row q-gutter-sm items-center row q-pt-sm">
        <div class="col-12 col-md-2">
          <q-input clearable label="请输入推广单号" outlined v-model="searchQuery" dense />
        </div>
        <div class="col-12 col-md-2">
          <q-input clearable label="请输入推广员卡号|昵称" outlined v-model="userText" dense />
        </div>
        <div class="col-12 col-md-2">
          <q-input clearable label="请输入会员卡号|昵称" outlined v-model="memberText" dense />
        </div>

        <div class="col-12 col-md-2">
            <q-input outlined dense label="最近操作开始时间" v-model="startTime" readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="startTime" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="startTime" @click="startTime = ''" name="cancel"></q-icon>
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
          <div class="col-12 col-md-2">
            <q-input outlined dense label="最近操作结束时间" v-model="endTime" readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="endTime" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="endTime" @click="endTime = ''" name="cancel"></q-icon>
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

        <q-btn @click="getList()" color="primary" unelevated label="搜索" />
        <q-btn @click="clearnBut()" color="warning" unelevated label="重置" />
      </div>
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="payRecordData"
        :gridOptions="gridOptions"
        :rowDragManaged="true"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="40"
        :suppressRowTransform="true"
        rowSelection="multiple"
        :defaultColDef="defaultColDef"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
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
      ></hl-pagination>
    </div>
  </div>
</template>

<script>
import AgStatusChip from './user/components/AgStatusChip'
import AgStoreStatusChipTwo from './user/components/AgStoreStatusChipTwo'
export default {
  name: 'record',
  components: {
    AgStatusChip,
    AgStoreStatusChipTwo
  },
  data () {
    return {
      localeText: this.$ag_grid_localeText,
      payRecordData: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      columnDefs: [
        {
          headerName: ' 推广单号',
          field: 'pmr_order_no',
          width: this.nowpx(0.1) + 'px',
          pinned: 'left'
        },
        {
          headerName: '推广员昵称',
          field: 'parentmember.nick_name',
          width: this.nowpx(0.1) + 'px',
          pinned: 'left'
        },
        {
          headerName: '推广员卡号',
          field: 'parentmember.card_number',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '状态',
          field: 'pmr_status',
          width: this.nowpx(0.08) + 'px',
          cellRendererFramework: 'AgStatusChip'
        },
        {
          headerName: '会员姓名',
          field: 'pmember.nick_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'pmember.card_number',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '手机号',
          field: 'pmr_pmerchant_mobile_number',
          width: this.nowpx(0.08) + 'px'
        },

        {
          headerName: '商家名称',
          field: 'pstore.name',
          width: this.nowpx(0.08) + 'px'
        },

        {
          headerName: ' 商家状态',
          field: 'pmr_status',
          width: this.nowpx(0.07) + 'px',
          cellRendererFramework: 'AgStoreStatusChipTwo'
        },

        {
          headerName: '商家开户状态',
          field: 'pmr_is_meet_one',
          width: this.nowpx(0.08) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.pmr_is_meet_one) == 1) {
              return '未达标'
            } else if (parseInt(p.data.pmr_is_meet_one) == 2) {
              return '已达标'
            }
            return ''
          }
        },
        {
          headerName: '商家发生一笔交易',
          field: 'pmr_is_meet_two',
          width: this.nowpx(0.08) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.pmr_is_meet_two) == 1) {
              return '未达标'
            } else if (parseInt(p.data.pmr_is_meet_two) == 2) {
              return '已达标'
            }
            return ''
          }
        },
        {
          headerName: '商家交易金额满',
          field: 'pmr_is_meet_three',
          width: this.nowpx(0.08) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.pmr_is_meet_three) == 1) {
              return '未达标'
            } else if (parseInt(p.data.pmr_is_meet_three) == 2) {
              return '已达标'
            }
            return ''
          }
        },

        {
          headerName: '收益',
          field: 'pmr_set_profit_amount',
          width: this.nowpx(0.08) + 'px',
          valueGetter: (p) => {
            return (
              this.$q.localStorage.getItem('pmerchant_store_local').storeBaseConfig.consume_base_moneySymbol + ' ' + p.data.pmr_set_profit_amount
            )
          }
        },

        {
          headerName: '【赠送】商家授权使用时间',
          field: 'pmr_set_store_delay_num',
          width: this.nowpx(0.08) + 'px',
          valueGetter: (p) => {
            return p.data.pmr_set_store_delay_num > 0
              ? p.data.pmr_set_store_delay_num + this.marketUserCycleItem[parseInt(p.data.pmr_set_store_delay_cycle)]
              : ''
          }
        },
        {
          headerName: '【赠送】商家操作员数量',
          field: 'pmr_set_store_account_num',
          width: this.nowpx(0.08) + 'px',
          valueGetter: (p) => {
            return p.data.pmr_set_store_account_num > 0 ? p.data.pmr_set_store_account_num : ''
          }
        },
        {
          headerName: '【赠送】商家可创建子店数量',
          field: 'pmr_set_store_son_num',
          width: this.nowpx(0.08) + 'px',
          valueGetter: (p) => {
            return p.data.pmr_set_store_son_num > 0 ? p.data.pmr_set_store_son_num : ''
          }
        },

        {
          headerName: '添加时间',
          field: 'created_at',
          filter: false,
          valueGetter: (p) => {
            if (!p.data.created_at) {
              return ''
            } else {
              return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm')
            }
          },
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '最近操作时间',
          field: 'updated_at',
          filter: false,
          valueGetter: (p) => {
            if (!p.data.updated_at) {
              return ''
            } else {
              return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD HH:mm')
            }
          },
          width: this.nowpx(0.1) + 'px'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: true,
        suppressMenu: false,
        rowDragManaged: true
      },
      gridOptions: {},

      dialogStatus: false,
      mUserId: 0,
      marketUserCycleItem: this.$store.state.marketingManage.marketUserCycleItem,
      pmu_type: '',
      countDataList: [],
      userText: '',
      memberText: '',
      searchQuery: '',
      startTime: '',
      endTime: ''

    }
  },

  created () {},
  mounted () {
    this.getList()
  },
  computed: {},
  methods: {

    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    getList () {
      const obj = {
        orderNo: this.searchQuery,
        startTime: this.startTime,
        endTime: this.endTime,
        userText: this.userText,
        memberText: this.memberText,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('marketingManage/getUserRewardRecord', obj)
        .then((res) => {
          if (res.code == 200) {
            this.payRecordData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
          }
        })
        .catch((error) => {})
    },
    createdAt (p) {
      if (!p.data.updated_at) {
        return ''
      } else {
        return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD HH:mm')
      }
    },

    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
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
        // params.api.sizeColumnsToFit()
      }
    },
    clearnBut () {
      this.searchQuery = ''
      this.pmu_type = ''

      this.userText = ''
      this.memberText = ''
      this.searchQuery = ''
      this.startTime = ''
      this.endTime = ''
      this.getList()
    }
  }
}
</script>

<style></style>
