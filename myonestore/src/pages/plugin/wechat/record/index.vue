<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <div class="q-gutter-x-xs row q-pl-xs q-px-sm">
          <q-input class="col-10 col-md-2 q-mt-sm" outlined v-model="name" label="输入会员卡号" dense />

          <q-btn color="primary" class="q-mt-sm" unelevated label="查询" @click="getList" />
          <q-btn color="grey-6" class="q-mt-sm" unelevated label="重置" @click="cleanBtn" />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :localeText="localeText"
          class="ag-theme-balham ag-grid-table  hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="cardRecord"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :components="components"
          rowHeight="50"
          :context="context"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :stopEditingWhenGridLosesFocus="true"
          :singleClickEdit="true"
          @first-data-rendered="onFirstDataRendered"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[ 20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pageSize"
          :total="page.pageTotal"
        ></hl-pagination>
      </div>
    </div>

  </q-page>
</template>

<script>
import AgMeasureOperate from './components/AgMeasureOperate.vue'
export default {
  components: {
    AgMeasureOperate
  },
  data () {
    return {
      type: '',
      name: '',

      gridOptions: {},
      context: null,
      components: {
        AgMeasureOperate
      },
      cardRecord: [],
      columnDefs: [
        {
          headerName: '卡包编号',
          field: 'mcr_card_id',
          filter: false
        },
        {
          headerName: '会员卡编号',
          field: 'mcr_code',
          filter: false
        },
        {
          headerName: '会员openid',
          field: 'mcr_openid',
          filter: false
        },
        {
          headerName: '会员卡号',
          field: 'mcr_card_number',
          filter: false
        },

        {
          headerName: '添加时间',
          field: 'created_at',
          filter: false,
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
        },
        {
          headerName: '操作',
          field: 'measure_operate',
          filter: false,
          cellRendererFramework: 'AgMeasureOperate',
          width: 120
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
  computed: {},
  created () {},
  mounted () {
    this.getList()
    this.context = this
  },
  methods: {
    getList () {
      const obj = {
        name: this.name,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('wechatCard/getWechatCardRecord', obj)
        .then((res) => {
          if (res.code == 200) {
            this.cardRecord = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    cleanBtn () {
      this.name = ''
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
        params.api.sizeColumnsToFit()
      }
    },
    // 获取当前每页显示数量
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getList()
    },
    // 当前页数
    currentChangeHandle (val) {
      this.page.pageIndex = val
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
