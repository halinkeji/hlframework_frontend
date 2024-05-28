<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-sm q-pb-sm">
      <div class="row q-mb-sm">
        <div class="col-12 col-md-2">
          <q-input label="核销码搜索" outlined v-model="code" dense />
        </div>

        <div class="col-12 col-md-2">
          <q-select
            outlined
            option-value="label"
            option-label="label"
            emit-value
            map-options
            v-model="couponsType"
            :options="couType"
            dense
            label="请选择卡券类型"
          />
        </div>

        <div class="col-12 col-md-2">
          <q-select
            outlined
            option-value="value"
            option-label="label"
            emit-value
            map-options
            v-model="status"
            :options="statusData"
            dense
            label="请选择卡券状态"
          />
        </div>

        <q-btn @click="getSendList()" color="primary" unelevated label="搜索" />
        <q-btn @click="clean" color="warning" unelevated label="重置" />
      </div>
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="sendListData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :singleClickEdit="true"
        :stopEditingWhenGridLosesFocus="true"
        :localeText="localeText"
        @first-data-rendered="onFirstDataRendered"
        rowHeight="50"
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
        layout="total, sizes, prev, pager, next, jumper"
      ></hl-pagination>
    </div>
  </div>
</template>
<script>
import AgOperating from './AgOperating.vue'

export default {
  name: 'ReceiveList',
  components: {
    AgOperating
  },
  data () {
    return {
      statusData: [
        { value: 2, label: '未使用' },
        { value: 3, label: '已使用' },
        { value: 4, label: '已过期' }
      ],
      couType: this.$store.state.hlCoupon.typeData,
      code: '',
      couponsType: '',
      status: '',
      sendListData: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '核销码',
          field: 'cmd_verificationCode',
          filter: false,
          checkboxSelection: false,
          headerCheckboxSelectionFilteredOnly: false,
          headerCheckboxSelection: false,
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '优惠券名称',
          field: 'coupon.cou_title',
          filter: false,
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '优惠券类型',
          field: 'cmd_type_name',
          filter: false,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '会员昵称',
          field: 'member.mem_memberName',
          filter: false,
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '会员姓名',
          field: 'member.mem_memberRealName',
          filter: false,
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'member.mem_memberCardNum',
          filter: false,
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '电话',
          field: 'member.mem_memberMobile',
          filter: false,
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '状态',
          field: 'cmd_status',
          filter: false,
          width: this.nowpx(0.06) + 'px',
          valueGetter: (p) => {
            if (p.data.cmd_status == 1) {
              return '未领取'
            }
            if (p.data.cmd_status == 2) {
              return '未使用'
            }

            if (p.data.cmd_status == 3) {
              return '已使用'
            }
          }
        },
        {
          headerName: '生效时间',
          field: 'cmd_memberreceivetime',
          filter: false,
          valueGetter: this.memberreceivetime,
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '使用时间',
          field: 'cmd_memberusetime',
          filter: false,
          valueGetter: this.memberusetime,
          widthwidth: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '到期时间',
          field: 'cmd_activityendtime',
          filter: false,
          valueGetter: this.activityendtime,
          width: this.nowpx(0.08) + 'px'
        }
      ],
      components: {},
      localeText: this.$ag_grid_localeText,
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      }
    }
  },

  mounted () {
    this.getSendList()
  },
  created () {},
  computed: {},
  methods: {
    // 列表自适应
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
        params.api.sizeColumnsToFit()
      }
    },
    getSendList () {
      const obj = {
        status: this.status,
        code: this.code,
        couponsType: this.couponsType,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('hlCoupon/getSendList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.sendListData = res.data ? res.data.list : []
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
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getSendList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getSendList()
    },
    createdAt (p) {
      if (!p.data.created_at) {
        return ''
      } else {
        return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    memberreceivetime (p) {
      if (!p.data.cmd_memberreceivetime) {
        return ''
      } else {
        return this.$q_date.formatDate(p.data.cmd_memberreceivetime * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    memberusetime (p) {
      if (!p.data.cmd_memberusetime) {
        return ''
      } else {
        return this.$q_date.formatDate(p.data.cmd_memberusetime * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    clean () {
      this.code = ''
      this.couponsType = ''
      this.status = ''
      this.getSendList()
    },
    activityendtime (p) {
      if (!p.data.cmd_activityendtime) {
        return ''
      } else {
        return this.$q_date.formatDate(p.data.cmd_activityendtime * 1000, 'YYYY-MM-DD HH:mm:ss')
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
