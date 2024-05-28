<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-card flat class="q-pa-sm">
          <div class="row q-gutter-x-sm">
            <div class="col-12 col-md-2">
              <q-input clearable label="请输入优惠券名称" outlined v-model="searchQuery" dense />
            </div>

            <q-btn @click="getList()" color="primary" unelevated label="搜索" />
            <q-btn @click="clearnBut()" color="warning" unelevated label="重置" />
            <q-btn @click="addCouponData(0)" color="primary" unelevated v-if="authorityMeta('add')" label="新增" />
            <q-btn
              :disable="dataListSelections.length > 0 ? false : true"
              @click="delAll()"
              color="red"
              unelevated
              v-if="authorityMeta('delAll')"
              label="批量删除"
            />
          </div>
        </q-card>
      </div>

      <div class="col-shrink bg-white q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="couponDataList"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          rowSelection="multiple"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :context="context"
          @rowSelected="rowSelectedAg"
          :localeText="localeText"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :current-page="page.pageIndex"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :page-size="page.pSize"
          :total="page.totalCount"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
    </div>

    <edit-data v-if="couponDialogStatus" @getMethods="getList" ref="editCouponRef"></edit-data>
  </q-page>
</template>
<script>

import Operator from './AgOperator'

import EditData from './EditData.vue'

export default {
  name: 'cdyyCouponManage',
  components: {
    Operator,
    EditData
  },
  data () {
    return {
      couponDialogStatus: false,
      context: null,
      components: {
        Operator

      },
      gridOptions: {},
      couponDataList: [],

      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.03) + 'px'
        },
        {
          headerName: '名称',
          field: 'cc_title'
        },
        {
          headerName: '类型',
          field: 'cc_type',
          valueGetter: (p) => {
            return this.$store.state.cdyy.couponTypeObject[parseInt(p.data.cc_type)]
          }
        },
        {
          headerName: '说明',
          field: 'cc_amount',
          valueGetter: (p) => {
            let text = ''
            switch (parseInt(p.data.cc_type)) {
              case 1:
                text = '单次免费'
                break
              case 2:
                text = '单次免除' + p.data.cc_amount + '分钟'
                break
              case 3:
                text = '单次免除' + p.data.cc_amount + '元'
                break
              case 4:
                text = p.data.cc_amount + '次免费'
                break
            }
            return text
          }
        },

        {
          headerName: '发送属性',
          field: 'cc_attribute',
          valueGetter: (p) => {
            return this.$store.state.cdyy.attributeTypeObject[parseInt(p.data.cc_attribute)]
          }
        },

        {
          headerName: '发送张数',
          field: 'cc_number'
        },
        {
          headerName: '时间规则',
          field: 'cc_time_type',
          valueGetter: (p) => {
            if (parseInt(p.data.cc_time_type) == 1) {
              return '即日起' + p.data.cc_time_one + this.$store.state.cdyy.roleOptions[p.data.cc_time_two] + '内有效'
            } else {
              return this.$q_date.formatDate(p.data.cc_time_one * 1000, 'YYYY-MM-DD HH:mm:ss') + '至' + this.$q_date.formatDate(p.data.cc_time_two * 1000, 'YYYY-MM-DD HH:mm:ss')
            }
          },
          width: this.nowpx(0.2) + 'px'
        },

        {
          headerName: '操作',
          field: 'id',
          cellRendererFramework: 'Operator'
        }
      ],
      localeText: this.$ag_grid_localeText,
      searchQuery: '',
      storeNewsData: {
        sn_title: '',
        sn_content: '',
        sn_picture: '',
        sn_status: 1
      },
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      stop: false,
      dataListSelections: []
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.getList()
    this.context = this
  },
  methods: {
    getList () {
      this.couponDialogStatus = false
      const obj = {
        text: this.searchQuery,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex
      }
      this.$store
        .dispatch('cdyy/getCouponListData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.page.totalCount = res.data.page.totalCount
              this.couponDataList = res.data.list
            } else {
              this.page.totalCount = 0
              this.couponDataList = []
            }

            this.dataListSelections = []
          }
        })
        .catch((error) => {})
    },
    addCouponData (id) {
      this.couponDialogStatus = true
      this.$nextTick(() => {
        this.$refs.editCouponRef.init(id)
      })
    },

    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    delAll () {
      this.$q
        .dialog({
          title: '是否确认',
          message: `确定删除 ${this.gridOptions.api.getSelectedRows().length} 条优惠券信息吗`,
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
        this.$store.dispatch('cdyy/delCouponData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条优惠券信息'
            })
            this.getList()
            this.dataListSelections = {}
          }
        })
      }
    },
    clearnBut () {
      this.searchQuery = ''
      this.getList()
      this.dataListSelections = {}
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
