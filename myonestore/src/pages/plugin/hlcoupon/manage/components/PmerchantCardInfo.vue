<template>
  <q-dialog @hide="closeCardInfoDialog" v-model="addStoreSidebar" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.6) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.6) + 'px',
        height: parseInt(this.$q.screen.width * 0.7) + 'px',
      }"
      class="q-pa-sm"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="row col-shrink bg-white q-px-xs q-py-xs q-gutter-sm">
          <div class="text-subtitle1">平台卡券推广记录</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup @click="closeCardInfoDialog" />
        </div>

        <div class="row col-shrink bg-white q-px-xs q-py-xs q-gutter-sm">
          <div class="col-12 col-md-2">
            <q-input label="核销码搜索" outlined v-model="code" dense />
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
        <div class="col-shrink q-px-xs full-height">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :defaultColDef="defaultColDef"
            :rowData="sendListData"
            rowSelection="multiple"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            :localeText="localeText"
            @gridReady="onFirstDataRendered"
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
    </q-card>
  </q-dialog>
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
      code: '',
      status: '',
      sendListData: [], // 默认数据源
      gridOptions: {},

      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      columnDefs: [
        // 表格列数据
        {
          headerName: '核销码', // 列标题
          field: 'cmd_verificationCode', // 列与数据源对应的字段
          filter: false, // 是否过滤
          checkboxSelection: false, // 是否展示复选框
          headerCheckboxSelectionFilteredOnly: false, // 标题复选框选择之后 false 选择所有行 true 选择筛选出来的行
          headerCheckboxSelection: false, // 标题复选框开关状态
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '互推商家会员昵称',
          field: 'cmd_pmer_member_nickname',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '互推商家会员卡号',
          field: 'cmd_pmer_member_card_number',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '互推商家会员手机号',
          field: 'cmd_phone_number',
          filter: false,
          width: this.nowpx(0.1) + 'px'
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
          headerName: '派发时间',
          field: 'created_at',
          filter: false,
          valueGetter: this.createdAt,
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '使用时间',
          field: 'cmd_memberusetime',
          filter: false,
          valueGetter: this.memberusetime,
          widthwidth: this.nowpx(0.2) + 'px'
        }
      ],
      components: {},
      localeText: this.$ag_grid_localeText,
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      addStoreSidebar: false
    }
  },

  mounted () {},
  created () {},
  computed: {},
  methods: {
    init (id) {
      this.id = id
      this.addStoreSidebar = true
      this.$nextTick(() => {
        this.getSendList()
      })
    },
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
    closeCardInfoDialog () {
      this.addStoreSidebar = false

      this.$emit('closeCardInfoDialog')
    },
    getSendList () {
      const obj = {
        cardId: this.id,
        status: this.status,
        code: this.code,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('hlCoupon/getCouponUseList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.sendListData = res.data ? res.data.list : []
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
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
    memberusetime (p) {
      if (!p.data.cmd_memberusetime) {
        return '未使用'
      } else {
        return this.$q_date.formatDate(p.data.cmd_memberusetime * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    clean () {
      this.code = ''
      this.status = ''
      this.getSendList()
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
