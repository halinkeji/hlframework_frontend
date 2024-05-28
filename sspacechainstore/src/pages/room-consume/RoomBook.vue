<template>
  <!-- 开单弹窗 -->
  <q-dialog v-model="openRoomConsumeDialog" persistent>
    <q-card
      :style="{
        width: parseInt(this.$q.screen.width * 0.8) + 'px',
        'max-width': parseInt(this.$q.screen.width * 0.8) + 'px',
        height: parseInt(this.$q.screen.height * 0.9) + 'px',
      }"
      class="fit column no-wrap"
    >
      <div class="row q-pa-sm items-center">
        预订记录
        <q-space />
        <q-btn color="grey" round flat dense icon="cancel" class="text-weight-bold" @click="closeOpenRoomDialog"></q-btn>
      </div>
      <q-separator />

      <div class="col-shrink bg-white q-px-xs q-pb-md q-mt-sm">
        <div class="row q-gutter-xs items-center">
          <div class="col-12 col-md-2">
            <q-input outlined dense label="到店时间" v-model="searchFrom.startTime" readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="searchFrom.startTime" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="searchFrom.startTime" @click="searchFrom.startTime = ''" name="cancel"></q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="searchFrom.startTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-2">
            <q-input outlined dense label="离店时间" v-model="searchFrom.endTime" readonly>
              <template v-slot:prepend>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-date minimal v-model="searchFrom.endTime" mask="YYYY-MM-DD HH:mm:ss">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>

              <template v-slot:append>
                <q-icon color="grey" v-if="searchFrom.endTime" @click="searchFrom.endTime = ''" name="cancel"></q-icon>
                <q-icon name="access_time" class="cursor-pointer">
                  <q-popup-proxy transition-show="scale" transition-hide="scale">
                    <q-time v-model="searchFrom.endTime" mask="YYYY-MM-DD HH:mm:ss" format24h>
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="确定" color="primary" flat />
                      </div>
                    </q-time>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-2">
            <q-input label="请输入会员卡号|电话号|姓名" clearable outlined v-model="searchFrom.memberText" dense />
          </div>

          <q-btn @click="getDatalist()" color="primary"  unelevated label="搜索" />
          <q-btn @click="resetBut()" color="warning" unelevated label="重置" />

        </div>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-3 ">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="deskListData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          @first-data-rendered="onFirstDataRendered"
          @rowSelected="rowSelectedAg"
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
    </q-card>
  </q-dialog>
</template>
<script>
import AgOperate from './AgOperate.vue'
export default {
  name: 'RoomBookRecord',
  components: {
    AgOperate
  },
  data () {
    return {
      currentRoomId: 0,
      openRoomConsumeDialog: false,
      context: '',
      gridOptions: {},
      columnDefs: [
        // {
        //   headerName: '',
        //   headerCheckboxSelectionFilteredOnly: true,
        //   headerCheckboxSelection: true,
        //   checkboxSelection: true,
        //   width: this.nowpx(0.04) + 'px'
        // },

        {
          headerName: '到店时间',
          field: 'srr_start_time',
          width: this.nowpx(0.15) + 'px',
          valueGetter: (p) => {
            if (!p.data.srr_start_time) {
              return ''
            } else {
              return this.$q_date.formatDate(p.data.srr_start_time * 1000, 'YYYY-MM-DD HH:mm')
            }
          }
        },
        {
          headerName: '离店时间',
          field: 'srr_end_time',
          width: this.nowpx(0.15) + 'px',
          valueGetter: (p) => {
            if (!p.data.srr_end_time) {
              return ''
            } else {
              return this.$q_date.formatDate(p.data.srr_end_time * 1000, 'YYYY-MM-DD HH:mm')
            }
          }
        },
        {
          headerName: '会员昵称',
          field: 'srr_member_nickname',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'srr_member_card_number',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员电话号',
          field: 'srr_member_phone_number',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '联系人',
          field: 'srr_contact_person',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '联系电话',
          field: 'srr_contact_phone',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '计费套餐',
          field: 'chargePackageInfo.scp_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '计费规则',
          field: 'chargeRuleInfo.qcr_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '实付金额',
          field: 'srr_room_total_amount',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '标准人数',
          field: 'srr_people_number',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作',
          width: this.nowpx(0.15) + 'px',
          pinned: 'right',
          cellRendererFramework: 'AgOperate'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      deskListData: [],
      localeText: this.$ag_grid_localeText,
      searchFrom: {
        memberText: '',
        endTime: '',
        startTime: ''
      }
    }
  },
  mounted () {},
  created () {},
  computed: {},

  methods: {
    init (currentRoomId) {
      this.context = this
      this.openRoomConsumeDialog = true
      if (parseInt(currentRoomId) > 0) {
        this.currentRoomId = currentRoomId

        this.$nextTick(() => {
          this.getList()
        })
      }
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        // params.api.sizeColumnsToFit()
      }
    },

    rowSelectedAg (p) {
      this.selectedDesk = p.api.getSelectedRows()
    },

    getList () {
      const params = {
        ...this.searchFrom,
        currentRoomId: this.currentRoomId,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('bookManage/getBookReocrdList', params)
        .then((res) => {
          if (res.code == 200) {
            this.deskListData = res.data ? res.data.list : []
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

    nowpx (px) {
      let nowWidth = this.$q.screen.width - 272
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },

    resetBut () {
      this.searchFrom = {
        memberText: '',
        endTime: '',
        startTime: ''
      }

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

    closeOpenRoomDialog () {
      this.openRoomConsumeDialog = false
      this.$emit('closeOpenRoomDialog')
    },

    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
