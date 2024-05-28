<template>
  <q-page>
    <q-card flat class="row q-ma-sm" v-if="authorityMeta('edit')">
      <q-card-section class="col-4">
        <q-input color="primary"  outlined v-model="maxLimitAmount" label="转赠限额">
          <template v-slot:append>
            <q-btn color="primary" @click="saveMaxTurnAmount" unelevated label="确定" />
          </template>
        </q-input>
      </q-card-section>
    </q-card>

    <div class="q-gutter-x-xs row q-pl-xs q-px-sm ">
      <q-input class="col-10 col-md-2 q-mt-sm" outlined v-model="inquireForm.invoiceCode" :label="`扣除|接收${$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit}单据号`" dense />
      <q-input class="col-10 col-md-2 q-mt-sm" outlined v-model="inquireForm.memberText" label="扣除|接收人昵称、卡号" dense />
      <q-btn color="primary" class=" q-mt-sm" unelevated label="查询" v-if="authorityMeta('search')" @click="getCzzsRecord" />
      <q-btn color="warning" class=" q-mt-sm" unelevated label="重置" v-if="authorityMeta('reset')" @click="cleanFrom" />
    </div>
    <hl-auto-height class="q-mt-sm q-px-sm">
      <template slot="body">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham full-height hl_header_center hl_content_center"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="turnRecordData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          @first-data-rendered="onFirstDataRendered"
          rowHeight="50"
          :stopEditingWhenGridLosesFocus="true"
          :singleClickEdit="true"
          :context="context"
          :localeText="localeText"
          :suppressRowTransform="true"
          :suppressCellSelection="true"
        ></ag-grid-vue>
      </template>
    </hl-auto-height>
    <div>
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pageSize"
        :total="page.pageTotal"
      ></hl-pagination>
    </div>
  </q-page>
</template>

<script>
import AgOperate from './components/AgOperate'
export default {
  name: 'czzsManage',
  components: {
    AgOperate
  },
  data () {
    return {
      inquireForm: {
        memberText: '',
        invoiceCode: ''
      },
      gridOptions: {},
      context: null,
      components: {
        AgOperate
      },
      turnRecordData: [],
      columnDefs: [
        {
          headerName: '转赠金额',
          field: 'pcr_operate_balance',
          filter: false
        },
        {
          headerName: '扣除' + this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit + '单据号',
          field: 'pcr_give_invoice_code',
          filter: false
        },
        {
          headerName: '接收' + this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit + '单据号',
          field: 'pcr_take_invoice_code',
          filter: false
        },

        {
          headerName: '转赠人昵称',
          field: 'pcr_give_member_name',
          filter: false
        },

        {
          headerName: '转赠人卡号',
          field: 'pcr_give_member_card_number',
          filter: false
        },

        {
          headerName: '接收人昵称',
          field: 'pcr_take_member_name',
          filter: false
        },
        {
          headerName: '接收人卡号',
          field: 'pcr_take_member_card_number',
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
          headerName: '状态',
          field: 'pcr_take_member_card_number',
          filter: false,
          valueGetter: (p) => {
            if (parseInt(p.data.pcr_status) == 1) {
              return '已到账'
            }
            if (parseInt(p.data.pcr_status) == 2) {
              return '待审核'
            }
            if (parseInt(p.data.pcr_status) == 3) {
              return '已拒绝'
            }
          }
        },
        {
          headerName: '操作',
          filter: false,
          cellRendererFramework: 'AgOperate'
        }
      ],
      page: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },
      localeText: this.$ag_grid_localeText,
      maxLimitAmount: ''
    }
  },

  created () {},
  mounted () {
    this.getCzzsConfig()
    this.getCzzsRecord()
    this.context = this
  },
  computed: {},
  methods: {

    saveMaxTurnAmount () {
      const obj = {
        plugin_czzs_maxLimitAmount: this.maxLimitAmount
      }

      this.$store
        .dispatch('czzs/setSwitch', obj)
        .then(res => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '编辑成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              position: 'top-right'
            })
          }
        })
        .catch(error => {})
    },

    getCzzsConfig () {
      this.$store
        .dispatch('czzs/getSetSwitch')
        .then((res) => {
          if (res.code == 200) {
            this.maxLimitAmount = res.data ? res.data.value : ''
          }
        })
        .catch((error) => {})
    },

    getCzzsRecord () {
      const params = {
        ...this.inquireForm,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('czzs/getCzzsRecord', params)
        .then((res) => {
          if (res.code == 200) {
            this.turnRecordData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
          }
        })
        .catch((error) => {})
    },
    // 自适应
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    },
    // 获取当前每页显示数量
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getCzzsRecord()
    },
    // 当前页数
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getCzzsRecord()
    },
    cleanFrom () {
      this.inquireForm = {
        memberText: '',
        invoiceCode: ''
      }
      this.getCzzsRecord()
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
