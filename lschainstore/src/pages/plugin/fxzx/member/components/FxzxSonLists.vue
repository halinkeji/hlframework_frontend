<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: $q.screen.width * 0.8 + 'px',
        'min-width': $q.screen.width * 0.8 + 'px',
      }"
      class="q-pa-md fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll bg-white">
        <div class="col-shrink bg-white q-px-xs q-pa-sm row q-mb-md items-center">
          <div class="text-subtitle2">分销商下级列表</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </div>
        <div class="row q-gutter-xs q-mb-md">
          <q-input outlined dense v-model="memberInfo" label="请输入会员卡号|手机号|姓名" class="col-12 col-md-3" />
          <q-select
            outlined
            dense
            v-model="memberLink"
            :options="linkOptions"
            label="请选择分销关系"
            class="col-12 col-md-2"
            emit-value
            map-options
          />
          <q-btn unelevated color="primary" dense label="搜索" class="q-px-md" @click="getList()" />
          <q-btn unelevated color="grey" dense label="重置" @click="clearButton" class="q-px-md" />
           <q-btn unelevated color="primary" dense label="绑定下级" class="q-px-md" @click="showMemberList" />
        </div>
        <div class="col-shrink q-px-xs full-height">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center goods-count-table hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="fxzxListData"
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
        <div class="col-shrink q-pb-md">
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
      <hl-choose-manager ref="chooseManagerList" v-if="memberListDialogStatus" @getChooseManageData="receivingAdministrator"></hl-choose-manager>

    </q-card>
  </q-dialog>
</template>
<script>
import SonAgOperate from './SonAgOperate.vue'
export default {
  name: 'FxzxSonLists',
  components: {
    SonAgOperate
  },
  data () {
    return {
      showDialog: true,
      memberInfo: '',
      memberId: '',
      memberLink: '',
      context: null,
      gridOptions: {},
      fxzxListData: [],
      linkOptions: [
        { value: '1', label: '一级分销商' },
        { value: '2', label: '二级分销商' },
        { value: '3', label: '三级分销商' }
      ],
      columnDefs: [
        {
          headerName: '会员姓名',
          field: 'mem_memberName',
          width: this.nowpx(0.17) + 'px'
        },
        {
          headerName: '分销商等级',
          field: 'pfl_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '分销关系',
          valueGetter: (p) => {
            if (parseInt(p.data.fml_level) == 1) {
              return '一级分销商'
            } else if (parseInt(p.data.fml_level) == 2) {
              return '二级分销商'
            } else if (parseInt(p.data.fml_level) == 3) {
              return '三级分销商'
            } else {
              return ''
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
          headerName: '下线总数',
          field: 'sonSonCount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '订单总数',
          field: 'sonOrderCount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '订单总额',
          field: 'sonOrderAmount',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '成为分销商时间',
          valueGetter: (p) => {
            if (parseInt(p.data.pfm_become_time) > 0) {
              return this.$q_date.formatDate(p.data.pfm_become_time * 1000, 'YYYY-MM-DD HH:mm:ss')
            } else {
              return ''
            }
          },
          width: this.nowpx(0.13) + 'px'
        },
        {
          headerName: '操作',
          field: 'created_at',
          cellRendererFramework: 'SonAgOperate',
          width: this.nowpx(0.17) + 'px'
        }

      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      memberListDialogStatus: false
    }
  },
  created () {
    this.context = this
  },
  mounted () {},
  computed: {},
  methods: {
    getList (id) {
      if (id > 0) {
        this.memberId = id
      }
      const params = {
        fxzxMemberId: this.memberId,
        memberInfo: this.memberInfo,
        fxzxLinkLevel: this.memberLink,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('fxzx/getFxzxSonMemberData', params)
        .then((res) => {
          if (res.code == 200) {
            this.fxzxListData = res.data ? res.data.list : []
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
      let nowWidth = this.$q.screen.width - 802
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
    // 分页变化
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    clearButton () {
      this.memberInfo = ''
      this.memberLink = ''
      this.getList()
    },
    hideNowPage () {
      this.$emit('dataList')
    },

    showMemberList () {
      this.memberListDialogStatus = true
      this.$nextTick(() => {
        this.$refs.chooseManagerList.getMemberListData()
      })
    },
    receivingAdministrator (val) {
      this.memberListDialogStatus = false
      if (val && val.length > 0) {
        this.bindMember(val[0].id)
      }
    },
    bindMember (sonMemberId) {
      const obj = {
        memberId: sonMemberId,
        parentMemberId: this.memberId
      }

      this.$store
        .dispatch('fxzx/marketBindMember', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '绑定成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.$nextTick(() => {
              this.getList()
            })
          } else {
            this.$q.notify({
              message: '错误',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: res.message,
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '错误',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    }
  }
}
</script>
