<template>
  <q-dialog v-model="dialogStatus" maximized>
    <q-card
      :style="{
        width: $q.screen.width + 'px',
        'min-width': $q.screen.width  + 'px',
        height: $q.screen.height + 'px',
      }"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-sm q-pb-md row items-center ">
          <div class="text-subtitle1">延期记录</div>
          <q-space />
          <q-btn icon="close" flat round dense   @click="hideNowPage" />
        </div>

        <q-separator />

        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <div class="row">
            <q-input
              class="col-12 col-md-2 q-mt-sm q-mr-sm"
              v-if="!memberId"
              label="请输入会员卡号|电话号|姓名"
              outlined
              v-model="searchFrom.memberText"
              dense
            />
            <div class="col-12 col-md-2 q-pt-sm q-mr-sm">
              <q-input outlined dense label="开始时间" v-model="startTime" readonly>
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
            <div class="col-12 col-md-2 q-pt-sm q-mr-sm">
              <q-input outlined dense label="结束时间" v-model="endTime" readonly>
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
            <q-btn @click="getDatalist()" color="primary" class="q-mt-sm col-12 col-md-1 q-mr-sm" unelevated label="搜索" />
            <q-btn @click="resetButton()" color="warning" class="q-mt-sm col-12 col-md-1 q-mr-sm" unelevated label="重置" />
            <q-btn
              @click="exportButton()"
              v-if="searchFrom.member_id == 0"
              color="red"
              class="q-mt-sm col-12 col-md-1 q-mr-sm"
              unelevated
              label="导出"
            />
          </div>
        </div>
        <div class="col-shrink q-px-xs full-height bg-grey-2">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table  full-height hl_header_center hl_content_center"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :defaultColDef="defaultColDef"
            :rowData="invoiceListData"
            rowSelection="multiple"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            :suppressCellSelection="true"
            :localeText="localeText"
            @first-data-rendered="onFirstDataRendered"
            rowHeight="40"
          ></ag-grid-vue>
        </div>
        <div class="col-shrink bg-white q-pb-md">
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pSize"
            :total="page.pageTotal"
            layout="total, sizes, prev, pager, next, jumper"
          ></hl-pagination>
        </div>
      </div>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'CountDelayRecord',
  components: {},
  data () {
    return {
      defaultColDef: {
        rowDragManaged: true
      },
      invoiceListData: [],
      gridOptions: {},
      columnDefs: [
        {
          headerName: '会员姓名',
          field: 'mem_memberName',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'mem_memberCardNum',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '消费项目',
          field: 'cdr_goods_name',
          filter: false,
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '规格名称',
          field: 'cdr_spe_name',
          filter: false,
          width: this.nowpx(0.14) + 'px'
        },
        {
          headerName: '次数',
          field: 'cdr_count',
          filter: false,
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '原到期时间',
          field: 'created_at',
          filter: false,
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.cdr_old_end_time * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '现到期时间',
          field: 'user.username',
          filter: false,
          valueGetter: (p) => {
            if (parseInt(p.data.cdr_end_time) >= 2147457847) {
              return '永久有效'
            } else {
              return this.$q_date.formatDate(p.data.cdr_end_time * 1000, 'YYYY-MM-DD HH:mm:ss')
            }
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '延期时间',
          field: 'created_at',
          filter: false,
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '备注',
          field: 'cdr_remarks',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作员',
          field: 'user.username',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText,
      page: {
        pageIndex: 1,
        pSize: 20,
        pageTotal: 0
      },
      startTime: '',
      endTime: '',
      searchFrom: {
        userId: '',
        goodsText: '',
        member_id: 0,
        created_at: '',
        updated_at: '',
        memberText: ''
      },
      dialogStatus: false,
      memberId: 0
    }
  },

  created () {

  },
  mounted () {},
  computed: {},
  methods: {
    init (memberId) {
      this.dialogStatus = true

      if (memberId > 0) {
        this.memberId = memberId
        this.getDatalist()
      }
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
    getDatalist () {
      const startTime = this.$q_date.formatDate(this.startTime, 'X')
      const endTime = this.$q_date.formatDate(this.endTime, 'X')
      if (endTime < startTime) {
        this.$q.notify({
          message: '失败',
          caption: '结束时间不得大于开始时间,请重新选择',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      this.searchFrom.created_at = startTime
      this.searchFrom.updated_at = endTime
      const obj = {
        ...this.searchFrom,
        page: this.page.pageIndex,
        pSize: this.page.pSize,
        member_id: this.memberId
      }
      this.$store
        .dispatch('deductCount/getDelaylist', obj)
        .then((res) => {
          if (res.code == 200) {
            this.invoiceListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.getDatalist()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getDatalist()
    },
    createdAt (p) {
      if (!p.data.created_at) {
        return ''
      } else {
        return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
      }
    },
    hideNowPage () {
      this.dialogStatus = false
      this.$emit('closeDelayDialog')
    },
    // 重置
    resetButton () {
      this.searchFrom = {
        userId: '',
        payStatus: '',
        member_id: 0,
        created_at: '',
        updated_at: '',
        memberText: '',
        goodsText: ''
      }
      this.startTime = ''
      this.endTime = ''
      this.getDatalist()
    },
    exportButton () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({ fileName: date + '-次卡延期记录' })
    }
  }
}
</script>
