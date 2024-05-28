<template>
  <div class="fit bg-grey-3">
    <div class="fit column  no-wrap justify-between items-stretch content-stretch no-scroll">
      <q-card flat class="q-py-sm q-px-xs row q-gutter-xs">
        <div class="col-12 col-md-2">
          <q-input outlined dense v-model="memberInfo" label="请输入赠送会员卡号|手机号|姓名" />
        </div>
        <div class="col-12 col-md-2">
          <q-input outlined dense v-model="receiveMemberInfo" label="请输入领取会员卡号|手机号|姓名" />
        </div>
        <div class="col-12 col-md-2">
          <q-select outlined dense v-model="zzyxType" :options="typeOptions" label="请选择类型" emit-value map-options />
        </div>
        <div class="col-12 col-md-2">
          <q-input outlined readonly dense v-model="startTime" label="开始时间">
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
        </div>
        <div class="col-md-2 col-12">
          <q-input outlined readonly dense label="结束时间" v-model="endTime">
            <template v-slot:prepend>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy transition-show="scale" transition-hide="scale">
                  <q-date v-model="endTime" minimal mask="YYYY-MM-DD HH:mm:ss">
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
        <q-btn unelevated color="primary" dense label="查询" class="q-px-md" @click="getList" />
        <q-btn unelevated color="warning" dense label="重置" @click="clearButton" class="q-px-md" />
      </q-card>
      <div class="col-shrink q-px-xs full-height bg-grey-3">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="recordData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          rowHeight="50"
          :context="context"
          rowSelection="multiple"
          :localeText="localeText"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
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
  </div>
</template>
<script>
export default {
  name: 'zzyxRecord',
  components: {},
  data () {
    return {
      memberInfo: '',
      receiveMemberInfo: '',
      zzyxType: '',
      startTime: '',
      endTime: '',
      context: null,
      gridOptions: {},
      recordData: [],
      typeOptions: [
        {
          label: '计次',
          value: 'count'
        },
        {
          label: '计时',
          value: 'timing'
        },
        {
          label: '优惠券',
          value: 'coupon'
        }
      ],
      columnDefs: [
        {
          headerName: '赠送会员名称',
          field: 'mem_memberName',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '赠送会员卡号',
          field: 'mem_memberCardNum',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '赠送会员手机号',
          field: 'mem_memberMobile',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '领取会员名称',
          field: 'newMemberName',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '领取会员卡号',
          field: 'newMemberCardNum',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '领取会员手机号',
          field: 'newMemberMobile',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '商品名称/优惠券名称(类型)',
          field: 'zzyxName',
          width: this.nowpx(0.15) + 'px'
        },
        {
          headerName: '赠送类型',
          valueGetter: (p) => {
            if (p.data.pzr_type == 'count') {
              return '计次'
            } else if (p.data.pzr_type == 'timing') {
              return '计时'
            } else if (p.data.pzr_type == 'coupon') {
              return '优惠券'
            } else {
              return '未知'
            }
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '赠送时间',
          width: this.nowpx(0.15) + 'px',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm:ss')
          }
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
    this.context = this
  },
  mounted () {},
  methods: {
    getList () {
      if (this.startTime) {
        var startTime = new Date(this.startTime).getTime() / 1000
      }
      if (this.endTime) {
        var endTime = new Date(this.endTime).getTime() / 1000
      }
      const obj = {
        memberInfo: this.memberInfo,
        receiveMemberInfo: this.receiveMemberInfo,
        zzyxType: this.zzyxType,
        startTime: startTime,
        endTime: endTime,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('zzyx/getRecordListData', obj)
        .then((res) => {
          this.recordData = res.data ? res.data.list : []
          this.page.pageTotal = res.data ? res.data.page.totalCount : 0
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },
    clearButton () {
      this.memberInfo = ''
      this.receiveMemberInfo = ''
      this.zzyxType = ''
      this.startTime = ''
      this.endTime = ''
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
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 298
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
    }
  }
}
</script>
