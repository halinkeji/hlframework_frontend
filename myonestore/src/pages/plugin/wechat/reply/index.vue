<template>
  <q-page>
    <div class="q-gutter-x-xs row q-pl-xs q-px-sm ">
      <q-input class="col-10 col-md-2 q-mt-sm" outlined v-model="module_name" label="输入规则名或者关键字名称" dense />
      <q-select class="col-10 col-md-2 q-mt-sm" outlined v-model="type" :options="options" dense label="回复规则" />
      <q-btn color="primary" class=" q-mt-sm" unelevated label="查询"  @click="getRuleList" />
      <q-btn color="grey-6" class=" q-mt-sm" unelevated label="重置" />
      <q-btn color="primary" class=" q-mt-sm" v-if="authorityMeta('add')" unelevated label="新增" :to="{ name: 'addReply' }" />
    </div>

    <hl-auto-height class="q-mt-sm q-px-sm">
      <template slot="body">
        <ag-grid-vue
          ref="agGridTable"
          :gridOptions="gridOptions"
          class="ag-theme-balham hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :rowData="goodsUnitData"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          @first-data-rendered="adaptiveTable"
          rowHeight="50"
          :stopEditingWhenGridLosesFocus="true"
          :singleClickEdit="true"
          :context="context"
          :localeText="localeText"
        ></ag-grid-vue>
      </template>
    </hl-auto-height>
    <div>
      <hl-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="page.pageIndex"
        :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
        :page-size="page.pageSize"
        :total="page.pageTotal"
      ></hl-pagination>
    </div>
  </q-page>
</template>

<script>
import AgMeasureOperate from './components/AgMeasureOperate.vue'
import Mode from './components/AgMode'
export default {
  components: {
    AgMeasureOperate,
    Mode
  },
  data () {
    return {
      type: '',
      module_name: '',
      options: [
        {
          label: '全部',
          value: 1
        },
        {
          label: '回复图文',
          value: 2
        },
        {
          label: '回复语音',
          value: 3
        },
        {
          label: '回复文字',
          value: 4
        }
      ],
      gridOptions: {},
      context: null,
      components: {
        AgMeasureOperate,
        Mode
      },
      goodsUnitData: [],
      columnDefs: [
        {
          headerName: '规则名称',
          field: 'name',
          filter: false
        },
        {
          headerName: '关键字',
          field: 'gu_goodsOrService',
          filter: false
        },
        {
          headerName: '回复内容',
          field: 'gu_goodsOrService',
          filter: false
        },
        {
          headerName: '开关',
          field: 'status',
          filter: false,
          cellRendererFramework: 'Mode'
        },

        {
          headerName: '添加时间',
          field: 'created_at',
          filter: false,
          valueGetter: (p) => {
            return this.$q_date.formatDate(p.data.created_at * 1000, 'YYYY-MM-DD HH:mm')
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
    this.getRuleList()
    this.context = this
  },
  methods: {
    getRuleList () {
      const obj = {
        module: this.module_name,
        type: this.type,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      }
      this.$store
        .dispatch('wechatRule/getRuleList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data == false) {
              this.page.pageTotal = 0
            } else {
              this.page.pageTotal = res.data.page.totalCount
            }
            this.goodsUnitData = res.data.list
          }
        })
        .catch((error) => {})
    },
    // 自适应
    adaptiveTable (params) {
      params.api.sizeColumnsToFit()
    },
    // 获取当前每页显示数量
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getRuleList()
    },
    // 当前页数
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getRuleList()
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

<style></style>
