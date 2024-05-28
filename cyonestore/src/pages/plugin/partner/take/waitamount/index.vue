<template>
  <div class="fit bg-grey-3">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink  bg-white q-px-xs q-pb-md">
        <q-card flat class=" row q-gutter-xs">
          <div class="col-12 col-md-2" v-if="is_main_store">
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
          <q-input outlined dense v-model="memberInfo" label="可搜索：合伙人姓名/合伙人手机号/会员卡号/会员姓名" class="col-12 col-md-2" />
          <q-select
            outlined
            dense
            v-model="partnerLevel"
            :options="partnerLevelList"
            label="请选择等级"
            class="col-12 col-md-2"
            option-value="id"
            option-label="ppl_name"
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
          <q-input outlined readonly dense v-model="startTime" label="申请时间">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="startTime" minimal mask="YYYY-MM-DD HH:mm">
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
                  <q-time v-model="startTime" mask="YYYY-MM-DD HH:mm" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <div class="col-12 col-md-1">
            <q-btn unelevated  color="primary" label="搜索" @click="getList" />
            <q-btn unelevated  color="grey-6" label="重置" @click="clearButton" class="q-ml-sm" />
          </div>
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
          :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
    </div>
    <take-detail ref="takeDetaillRef" v-if="detailPoppupStatus" @dataList="hideDetailPoppup" />
  </div>
</template>
<script>
import TakeDetail from '../TakeDetail'
import TakeWaitAmountAgOperate from '../components/TakeWaitAmountAgOperate'
export default {
  name: 'partnerTakeWaitAmount',
  components: {
    TakeDetail,
    TakeWaitAmountAgOperate
  },
  data () {
    return {
      detailPoppupStatus: false,
      partnerLevel: '',
      memberInfo: '',
      takeMode: '',
      startTime: '',
      context: '',
      LevelList: [],
      partnerLevelList: [],
      takeModeOptions: [
        { value: 'balance', label: '余额' },
        { value: 'wxpay', label: '微信' },
        { value: 'alipay', label: '支付宝' }
      ],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '合伙人姓名',
          field: 'ppi_partner_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '合伙人手机号',
          field: 'ppi_member_mobile',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '绑定会员姓名',
          field: 'mem_memberName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '绑定会员卡号',
          field: 'mem_memberCardNum',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '合伙人级别',
          field: 'ppl_name',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '提现方式',
          valueGetter: (p) => {
            if (p.data.ptr_take_mode == 'balance') {
              return '余额'
            } else if (p.data.ptr_take_mode == 'wxpay') {
              return '微信'
            } else if (p.data.ptr_take_mode >= 'alipay') {
              return '支付宝'
            } else {
              return false
            }
          },
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '提现金额',
          field: 'ptr_amount',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '申请时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '审核时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.12) + 'px'
        },
        {
          headerName: '门店',
          field: 'store.name',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.18) + 'px',
          cellRendererFramework: 'TakeWaitAmountAgOperate'
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
    this.getList()
    this.getLevelList()
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
    this.context = this
  },
  mounted () {},
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'all' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getLevelList () {
      this.$store
        .dispatch('partner/getLevelList')
        .then((res) => {
          if (res.code == 200) {
            this.partnerLevelList = res.data ? res.data : []
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
      const partnerLevel = this.partnerLevel

      let startTime = null
      if (this.startTime) {
        startTime = new Date(this.startTime).getTime() / 1000
      }
      const params = {
        takeStatus: 2,
        memberInfo: this.memberInfo,
        partnerLevel: partnerLevel,
        takeMode: this.takeMode,
        startTime: startTime,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('partner/getPartnerTakeRecordList', params)
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
      this.selectStoreData = []
      this.memberInfo = ''
      this.partnerLevel = ''
      this.takeMode = ''
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
