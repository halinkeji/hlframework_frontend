<template>
  <div class="fit bg-grey-3">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white q-mb-sm">
        <q-card flat class="q-pa-sm row q-gutter-xs">
          <q-input outlined dense v-model="memberInfo" label="请输入会员卡号|昵称|手机号|姓名" class="col-12 col-md-2" />
          <q-select
            outlined
            dense
            v-model="fxzxLevel"
            :options="fxzxLevelList"
            label="请选择分销商等级"
            class="col-12 col-md-2"
            option-value="pfl_weights"
            option-label="pfl_name"
            emit-value
            map-options
          />
          <q-input outlined readonly dense v-model="becomeTime" label="成为时间">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="becomeTime" minimal mask="YYYY-MM-DD HH:mm:ss">
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
                  <q-time v-model="becomeTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
          <q-btn unelevated color="warning" dense label="重置" @click="clearButton" class="q-px-md" />
          <q-btn unelevated color="primary" dense label="新增" class="q-px-md" @click="addMarket" />
        </q-card>
      </div>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="memberList"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          @first-data-rendered="onFirstDataRendered"
          @gridReady="onFirstDataRendered"
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
    <fxzx-member-detail ref="memberDetaillRef" v-if="detailPoppupStatus" @dataList="hideDetailPoppup" />
    <fxzx-son-lists ref="fxzxSonListsRef" v-if="fxzxSonListsPoppupStatus" @dataList="hideFxzxSonListsPoppup" />
    <add-market-member ref="addMrketDialogRef" @closeDialog="closeAddMarketDialog" v-if="marketDialogStatus" />
  </div>
</template>
<script>
import AgOperate from './components/AgOperate'
import FxzxMemberDetail from './MemberDetail'
import FxzxSonLists from './components/FxzxSonLists'

import AddMarketMember from './AddMarketMember.vue'
export default {
  name: 'fxzxAllMember',
  components: {
    AgOperate,
    FxzxMemberDetail,
    FxzxSonLists,
    AddMarketMember
  },
  data () {
    return {
      detailPoppupStatus: false,
      fxzxSonListsPoppupStatus: false,
      formId: 0,
      memberInfo: '',
      fxzxLevel: '',
      becomeTime: '',
      context: '',
      memberList: [],
      fxzxLevelList: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '卡号',
          field: 'mem_memberCardNum',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '昵称',
          field: 'mem_memberName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '姓名',
          field: 'mem_memberRealName',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '会员手机号',
          field: 'mem_memberMobile',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '分销商级别',
          valueGetter: (p) => {
            if (p.data.level) {
              return p.data.level.pfl_name
            }
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '累计佣金',
          field: 'pfm_total_fxzx_amount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '已提现佣金',
          field: 'pfm_take_fxzx_amount',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '上级',
          field: 'parentName',
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '下线总数',
          field: 'sonAllCount',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '成为分销商时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.pfm_become_time * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.14) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.22) + 'px',
          cellRendererFramework: 'AgOperate'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      marketDialogStatus: false
    }
  },
  created () {
    this.getLevelList()
    this.context = this
  },
  mounted () {
    this.getList()
  },
  computed: {},
  methods: {
    getLevelList () {
      this.$store
        .dispatch('fxzx/getLevelList')
        .then((res) => {
          if (res.code == 200) {
            this.fxzxLevelList = res.data ? res.data : []
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    getList () {
      let fxzxLevel = ''
      if (this.fxzxLevel == '0') {
        fxzxLevel = 11
      } else {
        fxzxLevel = this.fxzxLevel
      }
      let becomeTime = null
      if (this.becomeTime) {
        becomeTime = new Date(this.becomeTime).getTime() / 1000
      }
      const params = {
        memberInfo: this.memberInfo,
        fxzxLevel: fxzxLevel,
        becomeTime: becomeTime,
        fxzxMemberStatus: 1,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('fxzx/getMemberData', params)
        .then((res) => {
          if (res.code == 200) {
            this.memberList = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
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
      this.memberInfo = ''
      this.fxzxLevel = ''
      this.becomeTime = ''
      this.getList()
    },
    showMemberDetail (id, data) {
      this.detailPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.memberDetaillRef.init(id, data)
      })
    },
    showFxzxSonLists (id) {
      this.fxzxSonListsPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.fxzxSonListsRef.getList(id)
      })
    },
    hideDetailPoppup () {
      this.detailPoppupStatus = false
      this.getList()
    },
    hideFxzxSonListsPoppup () {
      this.fxzxSonListsPoppupStatus = false
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
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    closeAddMarketDialog () {
      this.marketDialogStatus = false
      this.$nextTick(() => {
        this.getList()
      })
    },
    addMarket () {
      this.marketDialogStatus = true
      this.$nextTick(() => {
        this.$refs.addMrketDialogRef.init()
      })
    }
  }
}
</script>
