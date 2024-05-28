<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-lg">
        <q-chip square color="red" text-color="white" icon="report_problem" label="警告：如果上级分类被删除，那么相应的子分类也将被删除。" />
        <div class="q-gutter-x-xs row">
          <q-select
            class="col-12 col-md-2 q-mt-sm"
            outlined
            v-model="goodsType"
            :options="options"
            option-value="value"
            option-label="label"
            emit-value
            map-options
            dense
            label="请选择分类属性"
            clearable
          />
          <q-select
            class="col-12 col-md-2 q-mt-sm"
            clearable
            outlined
            v-model="modeId"
            :options="mode"
            dense
            label="请选择分类状态"
            emit-value
            map-options
          />
          <q-input class="col-12 col-md-2 q-mt-sm" clearable outlined v-model="searchQuery" label="请输入分类名称" dense />

          <div class="col-12 col-md-3 q-mt-sm" v-if="is_main_store">
            <q-select
              label="查询门店"
              v-model="selectStoreData"
              option-value="id"
              option-label="name"
              multiple
              emit-value
              map-options
              dense
              outlined
              clearable
              use-chips
              :options="libInStoreList"
            />
          </div>

          <q-btn color="primary" class="q-mt-sm" unelevated label="搜索" @click="getList" />
          <q-btn color="warning" class="q-mt-sm" unelevated label="重置" @click="resetSearch" />
          <q-btn color="primary" class="q-mt-sm" unelevated label="新增" v-if="authorityMeta('add')" :to="{ name: 'addGoodsType' }" />
          <q-btn
            color="red"
            class="q-mt-sm"
            unelevated
            :disable="dataListSelections.length > 0 ? false : true"
            label="批量删除"
            v-if="authorityMeta('delAll')"
            @click="delAll()"
          />
        </div>
      </div>

      <div class="col-shrink q-px-xs full-height q-my-xs bg-grey-2">
        <q-table
          flat
          :data="goodsTypeListData"
          :columns="columns"
          row-key="id"
          card-class="full-height"
          table-header-class="text-center"
          no-data-label="空"
          separator="cell"
          hide-bottom
          :pagination="{
            rowsPerPage: 0,
          }"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="ids" :props="props">
                <q-checkbox v-model="dataListSelections" @input="setSelectData(props.row, $event)" :val="props.row.id" />
              </q-td>
              <q-td key="expand" class="text-center">
                <q-btn
                  size="sm"
                  :disable="props.row.goodsType && props.row.goodsType.length > 0 ? false : true"
                  color="primary"
                  round
                  unelevated
                  dense
                  @click="props.expand = !props.expand"
                  :icon="props.expand ? 'remove' : 'add'"
                />
              </q-td>
              <q-td key="gt_sort" class="text-center" :props="props">
                {{ props.row.gt_sort }}
                <q-popup-edit v-model="props.row.gt_sort" label-set="确定" buttons @save="changeNumber(props.row)" title="编辑排序">
                  <q-input v-model="props.row.gt_sort" dense autofocus counter />
                </q-popup-edit>
              </q-td>
              <q-td key="gt_name" class="text-center" :props="props">
                {{ props.row.gt_name }}
              </q-td>
              <q-td key="gt_goods_type" class="text-center" :props="props">
                <q-chip color="primary" text-color="white" size="sm" v-if="parseInt(props.row.gt_goods_type) == 1"> 实物商品 </q-chip>
                <q-chip color="green" text-color="white" size="sm" v-if="parseInt(props.row.gt_goods_type) == 2"> 服务商品 </q-chip>
                <q-chip color="red" size="sm" text-color="white" v-if="parseInt(props.row.gt_goods_type) == 3"> 套餐商品 </q-chip>
              </q-td>
              <q-td key="gt_ifSetStore" class="text-center" :props="props">
                <q-toggle
                  v-model="props.row.gt_ifSetStore"
                  true-value="1"
                  false-value="0"
                  @input="updatedTypeStatus(props.row.gt_ifSetStore, props.row)"
                  v-if="authorityMeta('edit') && verifyMain(props.row)"
                  color="green"
                />
              </q-td>
              <q-td key="mcl_default" class="text-center" :props="props">
                <div class="text-center">
                  <span v-for="(item, key) in props.row.goodsTypeStore">
                    <q-chip outline color="green" size="xs" square text-color="white" class="q-ml-none" v-if="item.store">
                      {{ item.store.name }}
                    </q-chip>
                  </span>
                  <q-tooltip content-class="bg-white" :offset="[10, 10]">
                    <div v-if="props.row.goodsTypeStore && props.row.goodsTypeStore.length > 0">
                      <span v-for="(item, key) in props.row.goodsTypeStore">
                        <q-chip outline color="green" size="xs" square text-color="white" class="q-ml-none" v-if="item.store">
                          {{ item.store.name }}
                        </q-chip>
                      </span>
                    </div>
                  </q-tooltip>
                </div>
              </q-td>
              <q-td key="id" :props="props">
                <q-btn
                  :to="{
                    name: 'addGoodsType',
                    query: { id: props.row.id },
                  }"
                  color="primary"
                  v-if="authorityMeta('edit') && verifyMain(props.row)"
                  class="q-mr-sm"
                  unelevated
                  label="修改"
                >
                </q-btn>
                <q-btn
                  label="删除"
                  unelevated
                  color="red"
                  @click="confirmDeleteRecord(props.row)"
                  v-if="authorityMeta('del') && verifyMain(props.row)"
                ></q-btn>
              </q-td>
            </q-tr>
            <q-tr v-show="props.expand" :props="props">
              <q-td colspan="100%">
                <type-table :typeListData="props.row.goodsType" @resetList="getList" @selectedTypeData="selectedTypeData" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center">
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
  </q-page>
</template>

<script>
import Operator from './components/AgOperator'
import Mode from './components/AgMode'
import TypeChip from './components/AgTypeChip'
import AgLinkStore from './components/AgLinkStore'
import TypeTable from './components/TypeTable'

export default {
  name: 'goodsType',
  components: {
    Operator,
    Mode,
    TypeChip,
    AgLinkStore,
    TypeTable
  },
  data () {
    return {
      dataListSelections: [],
      localeText: this.$ag_grid_localeText,
      context: null,
      gridOptions: {},
      columnDefs: [],
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

      goodsTypeListData: [],
      selectData: [],
      components: {
        Operator,
        Mode,
        TypeChip
      },
      searchQuery: '',
      modeId: '',
      mode: [
        { label: '可用', value: 1 },
        { label: '不可用', value: 2 }
      ],
      options: [
        {
          label: '实物商品',
          value: 1
        },
        {
          label: '服务商品',
          value: 2
        },
        {
          label: '套餐商品',
          value: 3
        }
      ],
      goodsType: '',
      columns: [],
      currentSelectType: [],
      selectStoreData: [],
      libInStoreList: []
    }
  },

  created () {
    this.getList()
    this.context = this
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
    const columnDefs = [
      {
        name: 'ids',
        required: true,
        label: '操作',
        align: 'center'
      },
      {
        name: 'expand',
        required: true,
        label: '子分类',
        align: 'center'
      },
      {
        name: 'gt_sort',
        label: '排序',
        align: 'center'
      },
      { name: 'gt_name', align: 'center', label: '分类名称', field: 'gt_name' },
      {
        name: 'gt_goods_type',
        align: 'center',
        label: '分类类型',
        field: 'gt_goods_type'
      },
      {
        name: 'gt_ifSetStore',
        align: 'center',
        label: '状态',
        field: 'gt_ifSetStore'
      }
    ]

    if (this.is_main_store) {
      columnDefs.push({
        name: 'mcl_default',
        align: 'center',
        label: '可用门店',
        field: 'mcl_default'
      })
    }
    columnDefs.push({ name: 'id', align: 'center', label: '操作', field: 'id' })

    this.columns = columnDefs
  },
  mounted () {},
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    setSelectData (row, $event) {
      const status = !(this.dataListSelections.indexOf(row.id) > -1)
      this.selectedTypeData(row, status)
    },

    selectedTypeData (row, status) {
      if (status) {
        const dataIndex = _.findIndex(this.currentSelectType, function (o) {
          return parseInt(o.id) == parseInt(row.id)
        })
        if (dataIndex > -1) {
          this.currentSelectType.splice(dataIndex, 1)
        }
      } else {
        const dataIndex = _.findIndex(this.currentSelectType, function (o) {
          return parseInt(o.id) == parseInt(row.id)
        })
        if (dataIndex < 0) {
          this.currentSelectType.push(row)
        }
      }
    },

    updatedTypeStatus (status, row) {
      const obj = {
        gt_ifSetStore: status,
        id: row.id
      }
      this.$store
        .dispatch('goodstype/setData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '修改状态成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
    },
    verifyMain (row) {
      if (!this.is_main_store) {
        const accountInfo = this.$q.localStorage.getItem('chainstore_account_info')
        if (accountInfo && accountInfo.store_id) {
          if (parseInt(accountInfo.store_id) == row.store_id) {
            return true
          }
        }
      } else {
        return true
      }
    },
    resetSearch () {
      this.searchQuery = ''
      this.goodsType = ''
      this.modeId = ''
      this.selectStoreData = []
      this.getList()
      this.dataListSelections = []
    },
    getList () {
      const obj = {
        text: this.searchQuery,
        attribute: this.goodsType,
        mode: this.modeId,
        page: this.page.pageIndex,
        pSize: this.page.pageSize,
        level: 1,
        selectStoreData: this.selectStoreData
      }

      this.$store
        .dispatch('goodstype/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.page.pageTotal = res.data.page.totalCount
            } else {
              this.page.pageTotal = 0
            }
            this.goodsTypeListData = res.data.list
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
    delAll () {
      this.$q
        .dialog({
          type: 'confirm',
          color: 'primary',
          title: '是否确认',
          message: `确定删除 ${this.dataListSelections.length} 条商品分类吗`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteRecordBatch()
        })
    },
    deleteRecordBatch () {
      const currentSelectType = this.currentSelectType
      if (currentSelectType.length > 0) {
        const accountInfo = this.$q.localStorage.getItem('chainstore_account_info')

        const obj = currentSelectType.map((item) => {
          if (parseInt(item.store_id) == parseInt(accountInfo.store_id)) {
            return item.id
          } else if (this.is_main_store) {
            return item.id
          } else {
            return null
          }
        })

        this.$store.dispatch('goodstype/delData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green',
              message: '成功',
              caption: '成功删除 ' + res.data + ' 条商品分类'
            })
            this.getList()
          }
        })
      }
    },

    supTypeName (p) {
      const data = p.data
      if (data.gt_pid == 0) {
        return ''
      } else {
        for (let i = 0; i < this.goodsTypeListData.length; i++) {
          if (data.gt_pid == this.goodsTypeListData[i].id) {
            return this.goodsTypeListData[i].gt_name
          }
        }
      }
    },
    changeNumber (row) {
      const data = row
      const regu = /^\+?[0-9][0-9]*$/
      data.gt_sort = data.gt_sort.replace(/\s+/g, '')
      if (!data.gt_sort) {
        this.getList()
        return ''
      }
      if (!regu.test(data.gt_sort)) {
        this.$q.notify({
          message: '错误',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        this.getList()
      } else {
        const obj = {
          gt_sort: data.gt_sort,
          id: data.id
        }
        this.$store.dispatch('goodstype/setData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '修改排序成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.getList()
          }
        })
      }
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
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
    sizeChangeHandle (val) {
      this.page.pageSize = val
      this.getList()
    },
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getList()
    },
    confirmDeleteRecord (row) {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${row.gt_name}"的商品分类吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteRecord(row)
        })
        .onCancel(() => {})
        .onDismiss(() => {})
    },
    deleteRecord (row) {
      const obj = [row.id]
      this.$store
        .dispatch('goodstype/delData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '删除分类成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.getList()
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: 'Error',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        })
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
