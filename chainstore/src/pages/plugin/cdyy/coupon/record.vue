<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-py-sm text-subtitle2">
      <div class="row q-gutter-xs q-mb-md">
        <div class="col-12 col-md-2">
          <q-input outlined readonly dense v-model="reserveData.prd_time_start" label="开始日期">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="reserveData.prd_time_start" minimal mask="YYYY-MM-DD HH:mm:ss">
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
                  <q-time v-model="reserveData.prd_time_start" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class="col-md-2 col-12">
          <q-input outlined readonly dense label="结束日期" v-model="reserveData.prd_time_end">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="reserveData.prd_time_end" minimal mask="YYYY-MM-DD HH:mm:ss">
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
                  <q-time v-model="reserveData.prd_time_end" mask="YYYY-MM-DD HH:mm:ss" format24h>
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="确定" color="primary" flat />
                    </div>
                  </q-time>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-btn unelevated color="primary" dense label="查询" class="q-px-md" @click="getList" />
        <q-btn unelevated color="grey" dense label="重置" @click="clearBut" class="q-px-md" />
      </div>
    </div>

    <div class="col-shrink q-px-xs full-height">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :rowData="couponSendList"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        @first-data-rendered="onFirstDataRendered"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        rowHeight="40"
        :context="context"
        rowSelection="multiple"
        :localeText="localeText"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :stopEditingWhenGridLosesFocus="true"
      ></ag-grid-vue>
    </div>

    <div class="col-shrink bg-white q-mt-xs q-py-sm text-center">
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
</template>
<script>
import { date } from 'quasar'

export default {
  name: 'cdyyCouponRecord',
  components: { },
  data () {
    return {
      components: { },
      addReserveStatus: false,
      reserveData: {
        prp_name: '',
        prd_time_start: '',
        prd_time_end: '',
        prd_status: ''
      },

      context: null,
      gridOptions: {},
      couponSendList: [],
      columnDefs: [
        {
          headerName: '会员',
          width: this.nowpx(0.1) + 'px',
          field: 'member.mem_memberName'
        },
        {
          headerName: '会员卡号',
          width: this.nowpx(0.1) + 'px',
          field: 'member.mem_memberCardNum'
        },

        {
          headerName: '电话号',
          field: 'cr_phone_number',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '类型',
          field: 'cr_type',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return this.$store.state.cdyy.couponTypeObject[parseInt(p.data.cr_type)]
          }
        },

        {
          headerName: '发送状态',
          field: 'cr_status',
          width: this.nowpx(0.1) + 'px',
          valueGetter: (p) => {
            return parseInt(p.data.cr_status) == 1 ? '发送中' : '发送成功'
          }
        },

        {
          headerName: '说明',
          field: 'cr_type',
          width: this.nowpx(0.2) + 'px',
          valueGetter: (p) => {
            let text = ''
            switch (parseInt(p.data.cr_type)) {
              case 1:
                text = '单次免费'
                break
              case 2:
                text = '单次免除' + p.data.cr_type + '分钟'
                break
              case 3:
                text = '单次免除' + p.data.cr_type + '元'
                break
              case 4:
                text = p.data.cr_type + '次免费'
                break
            }
            return text
          }
        },
        {
          headerName: '属性',
          field: 'cr_attribute_text',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '有效期',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.cr_start_time * 1000, 'YYYY-MM-DD HH:mm:ss') + ' 至 ' + this.$q_date.formatDate(p.data.cr_end_time * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '发送时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.updated_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          },
          width: this.nowpx(0.1) + 'px'
        }

      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      timePeriodStatus: false
    }
  },
  created () {
    this.getList()
    this.context = this
  },
  mounted () {},
  methods: {

    getList () {
      const obj = {
        timeStart: this.reserveData.prd_time_start,
        timeEnd: this.reserveData.prd_time_end,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('cdyy/getCouponRecordData', obj)
        .then((res) => {
          this.couponSendList = res.data ? res.data.list : []
          this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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
    clearBut () {
      this.reserveData.prp_name = ''
      this.reserveData.prd_time_start = ''
      this.reserveData.prd_time_end = ''
      this.reserveData.prd_status = ''
      this.getList()
    },
    showAddReserve (id) {
      this.addReserveStatus = true
      this.$nextTick(() => {
        this.$refs.addReserveRef.init(id)
      })
    },
    changeTimePeriod (id) {
      this.timePeriodStatus = true
      this.$nextTick(() => {
        this.$refs.timePeriodRef.init(id)
      })
    },
    // 分页
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    // 计算窗口
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 298
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    // 隐藏滚动条
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    // 关闭弹窗执行
    getDataList () {
      this.addReserveStatus = false
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
