<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll ">
    <div class="col-shrink bg-white q-px-xs q-pb-md q-gutter-x-xs row">
      <div class="col-12 col-md-2" v-if="is_main_store">
        <q-select
          label="查询门店"
          clearable
          v-model="selectStoreData"
          use-chips
          option-value="id"
          option-label="name"
          multiple
          emit-value
          map-options
          dense
          outlined
          :options="libInStoreList"
        />
      </div>
      <q-input class="col-12 col-md-2 " label="可搜索:股东电话/股东姓名/会员卡号/会员姓名" outlined v-model="searchQuery" dense />
      <q-select
        outlined
        dense
        label="选择合伙人级别"
        v-model="level"
        :options="levelList"
        class="col-12 col-md-2"
        option-value="id"
        option-label="ppl_name"
        emit-value
        map-options
      />
      <q-input outlined readonly dense v-model="endTime" label="到期时间">
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
      </q-input>

      <q-select
        outlined
        dense
        v-model="status"
        :options="statusOptions"
        label="状态"
        class="col-12 col-md-2"
        option-label="label"
        emit-value
        map-options
      />
      <div class="col-12 col-md-2">
        <q-btn unelevated color="primary" label="搜索"  @click="getList" />
        <q-btn unelevated color="grey-6" label="重置"  class="q-mx-sm" @click="clean" />
        <q-btn @click="addData()" color="primary" unelevated v-if="authorityMeta('add')" label="新增" />
      </div>
    </div>

    <div class="col-shrink q-px-xs full-height bg-grey-2">
      <ag-grid-vue
        ref="agGridTable"
        :gridOptions="gridOptions"
        class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height "
        :columnDefs="columnDefs"
        :suppressMovableColumns="true"
        :defaultColDef="defaultColDef"
        :rowData="partnerData"
        rowSelection="single"
        :rowDragManaged="true"
        colResizeDefault="shift"
        :animateRows="false"
        :floatingFilter="false"
        :enableCellTextSelection="true"
        :suppressCellSelection="true"
        :suppressRowClickSelection="false"
        :localeText="localeText"
        :context="context"
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
        :page-size="page.pSize"
        :total="page.totalCount"
      ></hl-pagination>
    </div>
    <add-partner ref="addRef" v-if="isDialogStatus" @getMethods="getList"></add-partner>
  </div>
</template>
<script>
import AddPartner from './AddPartner.vue'
import Operator from './AgOperator'
import TypeChip from './AgTypeChip'
export default {
  name: 'PartnerList',
  components: {
    AddPartner,
    Operator,
    TypeChip
  },
  data () {
    return {
      isDialogStatus: false,
      partnerData: [],
      page: {
        pageIndex: 1,
        pSize: 20,
        totalCount: 0
      },
      statusOptions: [
        {
          label: '现有股东',
          value: '1'
        },
        {
          label: '历史股东',
          value: '-1'
        }
      ],
      endTime: '',
      status: '',
      columnDefs: [
        // 表格列数据
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      context: null,
      gridOptions: {},
      configData: {},
      searchQuery: '',
      level: '',
      levelList: [],
      localeText: this.$ag_grid_localeText,
      selectStoreData: [],
      libInStoreList: []
    }
  },

  created () {
    this.getConfigList()
    this.getList()
    this.getLevelList()
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
    this.context = this
  },
  mounted () {},
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData', { getType: 'all' }).then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getLevelList () {
      const params = {
        type: 3
      }
      this.$store
        .dispatch('partner/getLevelList', params)
        .then((res) => {
          if (res.code == 200) {
            this.levelList = res.data ? res.data : []
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
    getConfigList () {
      this.$store
        .dispatch('partner/getData')
        .then((res) => {
          if (res.code == 200) {
            this.configData = res.data ? res.data : {}

            if (parseInt(this.configData.ppc_form_id) > 0) {
              this.getColumn(this.configData.ppc_form_id)
            } else {
              this.restColumnData()
            }
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
    getColumn (id) {
      if (id > 0) {
        this.$store
          .dispatch('formfield/getColumnDefs', id)
          .then((res) => {
            if (res.code == 200) {
              this.columnDefsForm = res.data
              this.restColumnData()
            } else {
              this.$q.notify({
                message: '失败',
                caption: res.message,
                color: 'red',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right'
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
    restColumnData () {
      this.gridOptions.api.setColumnDefs([])
      const columnData = [
        {
          headerName: '股东姓名',
          field: 'ppi_partner_name',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '股东手机号',
          field: 'ppi_member_mobile',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '绑定会员卡号',
          field: 'mem_memberCardNum',
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '绑定会员姓名',
          field: 'mem_memberName',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '合伙人级别',
          field: 'level.ppl_name',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '到期时间',
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.ppi_partner_end_time * 1000, 'YYYY-MM-DD')
          },
          width: this.nowpx(0.08) + 'px'
        },
        {
          headerName: '股东状态',
          field: 'gt_goods_type',
          cellRendererFramework: 'TypeChip',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        }
      ]
      if (this.columnDefsForm) {
        this.columnDefsForm.forEach(function (item) {
          columnData.push(item)
        })
      }

      const addTime = {
        headerName: '添加时间',
        valueGetter: (p) => {
          return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD  HH:mm:ss')
        },
        width: this.nowpx(0.1) + 'px'
      }

      columnData.push(addTime)

      const store = {
        headerName: '门店',
        field: 'store.name',
        filter: false,
        pinned: 'right',
        width: this.nowpx(0.1) + 'px'
      }
      columnData.push(store)

      const operateAg = {
        headerName: '操作',
        field: 'user_id',
        pinned: 'right',
        cellRendererFramework: 'Operator',
        width: this.nowpx(0.15) + 'px'
      }
      columnData.push(operateAg)
      this.gridOptions.api.setColumnDefs(columnData)
      // this.gridOptions.api.sizeColumnsToFit()
      this.getList()
    },

    getList () {
      let endTime = null
      if (this.endTime) {
        endTime = new Date(this.endTime).getTime() / 1000
      }

      const obj = {
        name: this.searchQuery,
        type: 'partner',
        level: this.level,
        time: endTime,
        status: this.status,
        pSize: this.page.pSize,
        pageIndex: this.page.pageIndex,
        selectStoreData: this.selectStoreData
      }
      this.$store
        .dispatch('partner/getMember', obj)
        .then((res) => {
          if (res.code == 200) {
            this.partnerData = res.data ? res.data.list : []
            this.page.totalCount = res.data ? parseInt(res.data.page.totalCount) : 0
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
    addData (id) {
      this.isDialogStatus = true
      this.$nextTick(() => {
        this.$refs.addRef.init(id)
      })
    },
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    clean () {
      this.searchQuery = ''
      this.level = ''
      this.endTime = ' '
      this.selectStoreData = []
      this.status = ''
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
        // params.api.sizeColumnsToFit()
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
