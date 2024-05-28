<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-sm q-pb-sm">
      <div class="row q-mb-sm q-gutter-sm">
        <div class="col-12 col-md-2">
          <q-input label="请输入卡券标题" outlined v-model="searchValue" dense />
        </div>

        <div class="col-12 col-md-2">
          <q-select
            outlined
            option-value="value"
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
            v-model="couponsProperty"
            :options="couProp"
            dense
            label="请选择卡券属性"
          />
        </div>

        <q-btn @click="getCouponsList()" color="primary" unelevated label="搜索" />
        <q-btn @click="clean" color="warning" unelevated label="重置" />
        <q-btn :to="{ name: 'addCouponsIndex' }" color="primary" v-if="authorityMeta('add')" unelevated label="添加卡券" />
        <q-btn
          @click="delAll()"
          color="red"
          v-if="authorityMeta('delAll')"
          :disable="dataListSelections.length > 0 ? false : true"
          unelevated
          label="批量删除"
        />
        <q-btn
          @click="groupBut()"
          color="primary"
          v-if="authorityMeta('send')"
          :disable="dataListSelections.length > 0 ? false : true"
          unelevated
          label="批量群发"
        />
      </div>
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :defaultColDef="defaultColDef"
        :rowData="couponsListData"
        rowSelection="multiple"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        rowHeight="50"
        :suppressCellSelection="true"
        :suppressRowClickSelection="true"
        :context="context"
        :stopEditingWhenGridLosesFocus="true"
        :singleClickEdit="true"
        :localeText="localeText"
        @rowSelected="rowSelectedAg"
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

import AgStatusSwitch from './AgStatusSwitch.vue'
export default {
  name: 'CouponsList',
  props: ['couponStatus'],
  components: {
    AgOperating,
    AgStatusSwitch
  },
  data () {
    return {
      couProp: this.$store.state.hlCoupon.propertyData,
      couType: this.$store.state.hlCoupon.typeData,
      searchValue: '',
      couponsType: '',
      couponsProperty: '',

      couponsListData: [],
      columnDefs: [
        {
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '排序',
          field: 'cou_sort',
          filter: false,
          editable: true,
          width: this.nowpx(0.1) + 'px',
          onCellValueChanged: this.changeSortValue
        },

        {
          headerName: '卡券标题',
          field: 'cou_title',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '卡券类型',
          field: 'cou_type',
          filter: false,
          valueGetter: this.rulesUse,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '卡券属性',
          field: 'cou_couponProperty',
          filter: false,
          valueGetter: this.propertyType,
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '卡券有效期',
          field: 'time_type',
          filter: false,
          width: this.nowpx(0.19) + 'px',
          valueGetter: this.expireDate
        },
        {
          headerName: '库存',
          field: 'cou_quantity',
          filter: false,
          editable: true,
          onCellValueChanged: this.changeQuantityValue,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '限领数量',
          field: 'cou_get_limit',
          filter: false,
          width: this.nowpx(0.07) + 'px'
        },
        {
          headerName: '上架状态',
          field: 'cou_status',
          filter: false,
          pinned: this.pinnedComputed('right'),
          cellRendererFramework: 'AgStatusSwitch',
          width: this.nowpx(0.05) + 'px'
        },
        {
          headerName: '操作',
          field: '',
          pinned: this.pinnedComputed('right'),
          filter: false,
          cellRendererFramework: 'AgOperating',
          width: this.nowpx(0.2) + 'px'
        }
      ],
      components: {},
      gridOptions: {},

      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },
      couponType: this.$store.state.hlCoupon.typeItem,
      couponProp: this.$store.state.hlCoupon.propertyItem,
      context: null,
      localeText: this.$ag_grid_localeText,
      dataListSelections: []
    }
  },

  mounted () {
    this.context = this
    this.getCouponsList()
  },
  created () {},
  computed: {},
  methods: {
    // 获取卡券列表
    getCouponsList () {
      this.dataListSelections = []
      const obj = {
        text: this.searchValue,
        type: this.couponsType,
        property: this.couponsProperty,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        status: this.couponStatus
      }
      this.$store
        .dispatch('hlCoupon/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
            this.couponsListData = res.data ? res.data.list : []
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
      this.getCouponsList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getCouponsList()
    },

    // 群发
    groupBut (data) {
      let sendCouponsData = []
      if (data && data.length > 0) {
        sendCouponsData = data
      } else {
        sendCouponsData = this.dataListSelections
      }
      if (sendCouponsData.length > 0) {
        const sendCouponsList = sendCouponsData.filter((item) => {
          return item.cou_couponProperty == '7'
        })
        sendCouponsList.forEach((item) => {
          item.cmd_type_name = this.couponType[item.cou_type]

          const timestamp = Math.round(new Date().getTime() / 1000).toString()

          if (item.cou_dateType == 2) {
            item.cou_endTime = parseInt(item.cou_endDay * 86400 + parseInt(timestamp)).toString()
          }
        })
        this.$router.push({
          name: 'sendCouponsIndex',
          params: { sendCouponsData: sendCouponsList }
        })
      }
    },
    clean () {
      this.searchValue = ''
      this.couponsType = ''
      this.couponsProperty = ''
      this.dataListSelections = []
      this.getCouponsList()
    },

    propertyType (p) {
      return this.couponProp[p.data.cou_couponProperty]
    },
    // 卡券类型
    rulesUse (p) {
      return this.couponType[p.data.cou_type]
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

    expireDate (p) {
      if (parseInt(p.data.cou_dateType) == 1) {
        return (
          this.$q_date.formatDate(p.data.cou_startTime * 1000, 'YYYY-MM-DD  HH:mm:ss') +
          ' 至 ' +
          this.$q_date.formatDate(p.data.cou_endTime * 1000, 'YYYY-MM-DD  HH:mm:ss') +
          ' 有效'
        )
      } else {
        let endText = ''
        switch (parseInt(p.data.cou_endDay)) {
          case 1:
            endText = '年'
            break
          case 2:
            endText = '季'
            break
          case 3:
            endText = '月'
            break
          case 4:
            endText = '周'
            break
          case 5:
            endText = '天'
            break
          case 6:
            endText = '小时'
            break
        }

        return '领取后' + p.data.cou_startDay + endText + '内有效'
      }
    },
    // 批量删除
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条卡券吗`,
          cancel: true
        })
        .onOk(() => {
          this.deleteRecord()
        })
    },
    deleteRecord () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.$store
          .dispatch('hlCoupon/setStatus', {
            ids: obj,
            status: -1
          })
          .then((res) => {
            if (res.code == 200) {
              this.$q.notify({
                color: 'green',
                message: '删除成功',
                caption: '成功删除 ' + res.data + ' 条',
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right'
              })
              this.getCouponsList()
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
      }
    },
    // 修改库存
    changeQuantityValue (p) {
      const re = /^[0-9]*[0-9][0-9]*$/
      if (!re.test(p.data.cou_quantity)) {
        this.$q.notify({
          message: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        this.getCouponsList()
      } else {
        const obj = {
          id: p.data.id,
          cou_quantity: p.data.cou_quantity
        }
        this.updateCouponData(obj)
      }
    },
    changeSortValue (p) {
      const re = /^[0-9]*[0-9][0-9]*$/
      if (!re.test(p.data.cou_quantity)) {
        this.$q.notify({
          message: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        this.getCouponsList()
      } else {
        const obj = {
          id: p.data.id,
          cou_sort: p.data.cou_sort
        }
        this.updateCouponData(obj)
      }
    },
    updateCouponData (obj) {
      this.$store
        .dispatch('hlCoupon/addData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              caption: '修改成功！',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.getCouponsList()
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

    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    pinnedComputed (val) {
      const nowWidth = this.$q.screen.width
      let pinned = val
      if (nowWidth <= this.$q.screen.sizes.md) {
        pinned = ''
      }
      return pinned
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
