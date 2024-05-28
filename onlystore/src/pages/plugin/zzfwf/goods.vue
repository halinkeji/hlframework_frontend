<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-py-md">
        <q-form ref="zzfwfFormRef" class="row  q-gutter-sm items-start">
          <div class="col-12 col-md-2">
            <q-input outlined v-model="searchValue" label="名称/条码/助记码/简称" dense />
          </div>

          <div class="col-12 col-md-2">
            <hl-select-tree
              :list_width="400"
              @getItem="
                (item) => {
                  goodsTypeId = item.id
                }
              "
              @resetValue="goodsTypeId = ''"
              :dataList="goodsTypeData"
              textName="请选择分类"
              :inputLabel="'gt_name'"
              :inputValue="'id'"
              :showValue="goodsTypeId"
              ref="selectTreeRef"
            />
          </div>
          <!-- <div class="col-12 col-md-2">
            <q-select class=" col-12 col-md-2" outlined option-value="value" option-label="label" emit-value map-options v-model="goodsOrService" :options="serviceOptions" dense label="属性" clearable />
          </div> -->
          <q-btn color="primary" unelevated @click="getList()">搜索</q-btn>
          <q-btn color="grey-6" unelevated @click="emptySeacher()">重置</q-btn>
          <div class="col-2">
            <q-select v-model="zzfwfForm.zrg_link_type" dense outlined option-value="value" option-label="label" emit-value map-options :options="linkTypeOptions" label="选择服务费类型" />
          </div>
                   <div class="col-4 row" v-if="zzfwfForm.zrg_link_type != 'close'">
            <div class="col-6" v-if="zzfwfForm.zrg_link_type == 'discount'">
              <q-input
                v-model="zzfwfForm.zrg_discount_proportion"
                :rules="[
                (val) => /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) || '请输入正确的数值',
                (val) => val > 0 && val <= 100 || '请输入正确的数值',
                ]"
                dense
                outlined
                label="百分比"
              />
            </div>
            <div class="col-6" v-if="zzfwfForm.zrg_link_type == 'fixed'">
              <q-input
                v-model="zzfwfForm.zrg_fixed_amount"
                :rules="[(val) => /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/.test(val) || '请输入正确的数值',]"
                dense
                outlined
                label="固定金额"
              />
            </div>
            <div  class="col-6">
              <q-input
                v-model="zzfwfForm.zrg_serve_title"
                :rules="[(val) => !!val || '请输入服务费说明']"
                dense
                outlined
                label="服务费说明"
              />
            </div>
          </div>
          <q-btn color="primary" unelevated :disable="!(selectedLink && selectedLink.length)" @click="setAllData()">同步</q-btn>
        </q-form>
      </div>

      <div class="col-shrink q-px-xs full-height bg-grey-2">
        <ag-grid-vue
          ref="agGridTable"
          :components="components"
          :gridOptions="gridOptions"
          class="ag-theme-balham ag-grid-table   hl_header_center hl_content_center full-height"
          :columnDefs="columnDefs"
          :suppressMovableColumns="true"
          :defaultColDef="defaultColDef"
          :rowData="goodsListData"
          rowSelection="multiple"
          :rowDragManaged="true"
          colResizeDefault="shift"
          :animateRows="false"
          :floatingFilter="false"
          :enableCellTextSelection="true"
          :suppressCellSelection="true"
          :suppressRowClickSelection="true"
          :rowMultiSelectWithClick="true"
          rowHeight="50"
          :context="context"
          :stopEditingWhenGridLosesFocus="true"
          :singleClickEdit="true"
          @rowSelected="rowSelectedAg"
          :localeText="localeText"
        ></ag-grid-vue>
      </div>
      <div class="col-shrink bg-white q-pb-md">
        <hl-pagination
          @size-change="sizeChangeHandle"
          @current-change="currentChangeHandle"
          :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
          :current-page="page.pageIndex"
          :page-size="page.pageSize"
          :total="page.pageTotal"
          layout="total, sizes, prev, pager, next, jumper"
        ></hl-pagination>
      </div>
    </div>
  </q-page>
</template>
<script>
import AgInputSet from './components/AgInputSet.vue'
import AgType from './components/AgType.vue'
import AgInputTitle from './components/AgInputTitle.vue'
export default {
  name: 'zzfwfGoods',
  components: {
    AgInputSet,
    AgType,
    AgInputTitle
  },
  data () {
    return {
      editPoppupStatus: false,
      memberInfo: '',
      sonMemberInfo: '',
      context: '',
      selectedLink: [],
      linkList: [],
      gridOptions: {},
      localeText: this.$ag_grid_localeText,
      components: {},
      columnDefs: [
        {
          checkboxSelection: true,
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          width: 60
        },
        {
          headerName: '条码',
          field: 'goo_code',
          width: 237
        },
        {
          headerName: '商品名称', // 列标题
          field: 'goo_name', // 列与数据源对应的字段
          width: 400
        },

        {
          headerName: '类型',
          field: 'created_at',
          cellRendererFramework: 'AgType',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '百分比/固定金额',
          field: 'created_at',
          cellRendererFramework: 'AgInputSet',
          width: this.nowpx(0.2) + 'px'
        },
        {
          headerName: '服务费说明',
          field: 'created_at',
          cellRendererFramework: 'AgInputTitle',
          width: this.nowpx(0.1) + 'px'
        },

        {
          headerName: '分类',
          field: 'goodsTypeId',
          width: 237,
          valueGetter: (p) => {
            if (p.data.goodsType) {
              return p.data.goodsType.gt_name
            } else {
              return '无'
            }
          }
        },

        {
          headerName: '启用规格',
          field: 'goo_size',
          width: 180,
          valueGetter: (p) => {
            if (parseInt(p.data.goo_size) == 1) {
              return '启用'
            } else {
              return '关闭'
            }
          }
        },
        {
          headerName: '是否称重',
          field: 'goo_goodsOrService',
          width: 120,
          valueGetter: (p) => {
            if (parseInt(p.data.goo_is_weigh) == 1) {
              return '开启'
            } else {
              return '关闭'
            }
          }
        },

        {
          headerName: '入库价',
          field: 'goo_purchasePrice',
          width: 150
        },
        {
          headerName: '标价',
          field: 'goo_listPrice',
          width: 150
        },
        {
          headerName: '售价',
          field: 'goo_price',
          width: 150
        },
        {
          headerName: '状态',
          field: 'goo_status',
          pinned: 'right',
          width: 100,
          valueGetter: function (p) {
            return p.data.goo_status == 1 ? '上架' : '下架'
          }
        }
      ],
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
      goodsListData: [],
      goodsTypeId: '',
      goodsOrService: '1',
      serviceOptions: [
        {
          label: '实物商品',
          value: 1
        },
        {
          label: '服务商品',
          value: 2
        }
      ],
      goodsTypeData: [],
      searchValue: '',
      linkTypeOptions: [
        {
          label: '百分比',
          value: 'discount'
        },
        {
          label: '固定金额',
          value: 'fixed'
        },
        {
          label: '关闭',
          value: 'close'
        }
      ],
      zzfwfForm: {
        zrg_link_type: 'close',
        zrg_discount_proportion: '0',
        zrg_fixed_amount: '0'
      }
    }
  },
  created () {
    this.getGoodsType()
    this.context = this
  },
  mounted () {
    this.getList()
  },
  computed: {},
  methods: {
    // 获取商品分类
    getGoodsType () {
      const obj = {
        goodsType: [1, 2]
      }
      this.$store
        .dispatch('goodstype/getTreeList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.goodsTypeData = res.data ? res.data : []
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
    getList () {
      this.selectedLink = []
      const obj = {
        type: 1,
        text: this.searchValue,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        goodsTypeId: this.goodsTypeId,
        goodsOrService: 1
      }
      this.$store
        .dispatch('zzfwf/getListData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0

            this.goodsListData = res.data.list
          }
        })
        .catch((error) => {})
    },

    nowpx (px) {
      let nowWidth = this.$q.screen.width - 274
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024
      }
      return parseInt(nowWidth * px)
    },
    emptySeacher () {
      this.searchValue = ''
      this.goodsTypeId = ''

      this.$refs.selectTreeRef.resetValueData()
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
    rowSelectedAg (p) {
      this.selectedLink = p.api.getSelectedRows()
    },
    setAllData () {
      if (this.selectedLink && this.selectedLink.length > 0) {
        const goodsIds = this.selectedLink.map((item) => {
          return item.main_goods_id
        })
        this.$refs.zzfwfFormRef.validate().then((success) => {
          if (success) {
            const obj = {
              ...this.zzfwfForm,
              goodsIds
            }
            this.$store
              .dispatch('zzfwf/setAllData', obj)
              .then((res) => {
                if (res.code == 200) {
                  this.$q.notify({
                    message: '成功',
                    icon: 'ion-checkmark-circle-outline',
                    timeout: 500,
                    position: 'top-right',
                    caption: '成功设置' + res.data + '条',
                    color: 'green'
                  })
                  this.getList()
                }
              })
              .catch((error) => {
                this.$q.notify({
                  message: '错误',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  caption: error.message,
                  color: 'red'
                })
              })
          }
        })
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
