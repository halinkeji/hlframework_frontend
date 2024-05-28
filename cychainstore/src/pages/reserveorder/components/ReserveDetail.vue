<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: this.$q.screen.width * 0.8 + 'px',
        'min-width': this.$q.screen.width * 0.8 + 'px',
      }"
      class="q-pa-md"
    >
      <q-form ref="reserveDetailRef">
        <q-card-section class="row items-center q-pa-none q-mb-xl">
          <div class="text-h6 q-pr-lg">查看详细</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>
        <div style="height:76px">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :rowData="detailList"
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
            :stopEditingWhenGridLosesFocus="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
          ></ag-grid-vue>
        </div>
        <div :style="agHeight" class="q-mt-xl" v-if="this.dishesList.length>0">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptionsDishes"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefsDishes"
            :suppressMovableColumns="true"
            :rowData="dishesList"
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
            :stopEditingWhenGridLosesFocus="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
          ></ag-grid-vue>
        </div>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
import AgType from './AgType'
import AgDeposit from './AgDeposit'
export default {
  name: 'ReserveDetail',
  components: { AgType, AgDeposit },
  data () {
    return {
      agHeight: 'height:76px',
      showDialog: true,
      gridOptions: {},
      gridOptionsDishes: {},
      context: null,
      detailList: [],
      dishesList: [],
      columnDefs: [
        {
          headerName: '就餐餐桌',
          field: 'desk.dp_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '到店时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.drr_date * 1000, 'YYYY-MM-DD HH:mm')
          },
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '预约人姓名',
          field: 'drr_people_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '预约人手机号',
          field: 'drr_people_mobile',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '预约人数',
          field: 'drr_people_quantity',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员姓名',
          field: 'member.mem_memberName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员卡号',
          field: 'member.mem_memberCardNum',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '会员手机号',
          field: 'member.mem_memberMobile',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '预约类型',
          cellRendererFramework: 'AgType',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '预约押金',
          cellRendererFramework: 'AgDeposit',
          width: this.nowpx(0.1) + 'px'
        }
      ],
      columnDefsDishes: [
        {
          headerName: '菜品名称',
          field: 'food.fl_name',
          width: this.nowpx(0.25) + 'px'
        },
        {
          headerName: '数量',
          field: 'drc_quantity',
          width: this.nowpx(0.25) + 'px'
        },
        {
          headerName: '标价',
          field: 'food.fl_list_price',
          width: this.nowpx(0.25) + 'px'
        },
        {
          headerName: '小计金额',
          field: 'drc_subtotal_amount',
          width: this.nowpx(0.25) + 'px'
        }
      ],
      localeText: this.$ag_grid_localeText
    }
  },
  mounted () {},
  created () {
    this.context = this
  },
  computed: {},
  methods: {
    // 查询预约详情
    init (id) {
      this.showDialog = true
      if (id > 0) {
        this.$store
          .dispatch('reserveorder/getItemData', id)
          .then((res) => {
            if (res.code == 200) {
              this.detailList = res.data ? [res.data] : []
              if (res.data.car && res.data.car.length > 0) {
                this.dishesList = res.data.car
                const agHeight = this.dishesList.length * 40 + 36
                this.agHeight = 'height' + ':' + agHeight + 'px'
              } else if (res.data.carRecord && res.data.carRecord.length > 0) {
                this.dishesList = res.data.carRecord.map((item) => {
                  return {
                    id: item.id,
                    food: item.food,
                    drc_quantity: item.rcr_quantity,
                    drc_subtotal_amount: item.rcr_subtotal_amount
                  }
                })
                const agHeight = this.dishesList.length * 40 + 36
                this.agHeight = 'height' + ':' + agHeight + 'px'
              } else {
                this.dishesList = []
                this.agHeight = 'height:76px'
              }
            } else {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '操作失败',
                color: 'red'
              })
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
      }
    },
    hideNowPage () {
      this.$emit('dataList')
    },
    nowpx (px) {
      let nowWidth = this.$q.screen.width - 420
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
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    }
  }
}
</script>
