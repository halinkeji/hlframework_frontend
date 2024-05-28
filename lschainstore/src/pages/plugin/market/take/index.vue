<template>
  <div class="fit bg-grey-3">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white q-mb-sm">
        <q-card flat class="q-pa-sm row q-gutter-xs">
          <q-input outlined dense v-model="memberInfo" label="请输入会员卡号|手机号|姓名" class="col-12 col-md-2" />
          <q-select
            outlined
            dense
            v-model="marketLevel"
            :options="marketLevelList"
            label="请选择等级"
            class="col-12 col-md-2"
            option-value="pml_weights"
            option-label="pml_name"
            emit-value
            map-options
          />
          <q-select
            outlined
            dense
            v-model="takeMode"
            :options="takeModeOptions"
            label="请选择提现方式"
            class="col-12 col-md-2"
            emit-value
            map-options
          />
          <q-select
            outlined
            dense
            v-model="takeStatus"
            :options="takeStatusOptions"
            label="请选择状态"
            class="col-12 col-md-2"
            emit-value
            map-options
          />
          <q-input outlined readonly dense v-model="startTime" label="申请时间">
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
          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList" />
          <q-btn unelevated color="warning" dense label="重置" @click="clearButton" class="q-px-md" />
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
    <market-take-detail ref="takeDetaillRef" v-if="detailPoppupStatus" @dataList="hideDetailPoppup" />
  </div>
</template>
<script>
import TakeDetailAgOperate from './components/TakeDetailAgOperate'
import MarketTakeDetail from './TakeDetail'
export default {
  name: 'marketTakeList',
  components: {
    TakeDetailAgOperate,
    MarketTakeDetail
  },
  data () {
    return {
      detailPoppupStatus: false,
      marketLevel: '',
      memberInfo: '',
      takeMode: '',
      startTime: '',
      context: '',
      LevelList: [],
      marketLevelList: [],
      takeModeOptions: [
        { value: 'balance', label: this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit },
        { value: 'wxpay', label: '微信' },
        { value: 'alipay', label: '支付宝' }
      ],
      takeStatusOptions: [
        { value: 1, label: '待审核' },
        { value: 2, label: '待打款' },
        { value: 3, label: '已打款' },
        { value: 4, label: '无效' }
      ],
      takeStatus: '',
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
          headerName: '会员姓名',
          field: 'mem_memberName',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '分佣商级别',
          field: 'pml_name',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '提现方式',
          valueGetter: (p) => {
            if (p.data.mtr_take_mode == 'balance') {
              return this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit
            } else if (p.data.mtr_take_mode == 'wxpay') {
              return '微信'
            } else if (p.data.mtr_take_mode >= 'alipay') {
              return '支付宝'
            } else {
              return false
            }
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '佣金金额',
          field: 'mtr_amount',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '状态',
          field: 'mtr_status',
          width: this.nowpx(0.15) + 'px',
          valueGetter: (p) => {
            if (parseInt(p.data.mtr_status) == 1) {
              return '待审核'
            } else if (parseInt(p.data.mtr_status) == 2) {
              return '待打款'
            } else if (parseInt(p.data.mtr_status) == 3) {
              return '已打款'
            } else if (parseInt(p.data.mtr_status) == 4) {
              return '无效'
            }
            return ''
          }
        },
        {
          headerName: '申请时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.16) + 'px',
          cellRendererFramework: 'TakeDetailAgOperate'
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
    this.getLevelList()
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    getLevelList () {
      this.$store
        .dispatch('market/getLevelList')
        .then((res) => {
          if (res.code == 200) {
            this.marketLevelList = res.data ? res.data : []
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
    getList () {
      let marketLevel = ''
      if (this.marketLevel == '0') {
        marketLevel = 11
      } else {
        marketLevel = this.marketLevel
      }
      let startTime = null
      if (this.startTime) {
        startTime = new Date(this.startTime).getTime() / 1000
      }
      const params = {
        takeStatus: this.takeStatus ? this.takeStatus : [1, 2, 3, 4],
        memberInfo: this.memberInfo,
        marketLevel: marketLevel,
        takeMode: this.takeMode,
        startTime: startTime,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('market/getMarketTakeRecordList', params)
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
    showTakeDetail (id) {
      this.detailPoppupStatus = true
      this.$nextTick(() => {
        this.$refs.takeDetaillRef.init(id)
      })
    },
    hideDetailPoppup () {
      this.detailPoppupStatus = false
      this.getList()
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
      this.marketLevel = ''
      this.takeMode = ''
      this.takeStatus = ''
      this.startTime = ''
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
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    }
  }
}
</script>
