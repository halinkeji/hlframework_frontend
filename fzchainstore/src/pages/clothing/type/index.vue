<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-lg">
        <q-chip square color="red" text-color="white" icon="report_problem" label="警告：如果上级类目被删除，那么相应的子类目也将被删除。" />
        <div class="q-gutter-x-xs row ">
          <q-select
            class="col-12 col-md-2 q-mt-sm q-ml-sm"
            outlined
            v-model="modeId"
            :options="mode"
            dense
            label="请选择类目状态"
            emit-value
            map-options
          />
          <q-input class="col-12 col-md-2 q-mt-sm" outlined v-model="searchQuery" label="请输入类目名称" dense />

          <q-btn color="primary" class="q-mt-sm" unelevated label="搜索" @click="getList" />
          <q-btn color="warning" class="q-mt-sm" unelevated label="重置" @click="resetSearch" />
          <q-btn color="primary" class="q-mt-sm" unelevated label="新增" v-if="authorityMeta('add')" :to="{ name: 'addClothingType' }" />
          <q-btn
            color="red"
            class="q-mt-sm"
            unelevated
            :disable="dataListSelections.length > 0 ? false : true"
            label="批量删除"
            v-if="authorityMeta('delAll')"
            @click="delAll()"
          />
          <q-btn color="primary" class="q-mt-sm" unelevated @click="exportCsv" label="导出Csv文件" :disable="goodsTypeListData.length == 0" />
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
              <q-td key="gt_code" class="text-center" :props="props">
                {{ props.row.gt_code }}
              </q-td>
              <q-td key="gt_status" class="text-center" :props="props">
                <q-toggle
                  v-model="props.row.gt_status"
                  true-value="1"
                  false-value="0"
                  @input="updatedTypeStatus(props.row.gt_status, props.row)"
                  v-if="authorityMeta('edit') && verifyMain(props.row)"
                  color="green"
                />
              </q-td>

              <q-td key="id" :props="props">
                <q-btn
                  :to="{
                    name: 'addClothingType',
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
import TypeTable from './components/TypeTable'
export default {
  name: 'PageIndex',
  components: {
    TypeTable
  },
  data () {
    return {
      dataListSelections: [],
      localeText: this.$ag_grid_localeText,
      context: null,
      gridOptions: {},

      page: {
        pageIndex: 1,
        pageSize: 20,
        pageTotal: 0
      },

      goodsTypeListData: [],
      selectData: [],

      searchQuery: '',
      modeId: '',
      mode: [
        { label: '可用', value: 1 },
        { label: '不可用', value: 2 }
      ],
      goodsType: ''
    }
  },

  created () {
    this.getList()
    this.context = this
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
      { name: 'gt_code', align: 'center', label: '分类编号', field: 'gt_code' },

      {
        name: 'gt_status',
        align: 'center',
        label: '状态',
        field: 'gt_status'
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
  computed: {},
  methods: {
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
        gt_status: status,
        id: row.id
      }
      this.$store
        .dispatch('clothingType/setData', obj)
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
      return true
    },
    resetSearch () {
      this.searchQuery = ''
      this.goodsType = ''
      this.modeId = ''
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
        level: 1
      }

      this.$store
        .dispatch('clothingType/getData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.goodsTypeListData = res.data ? res.data.list : []
            this.page.pageTotal = res.data ? res.data.page.totalCount : 0
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
          message: `确定删除 ${this.dataListSelections.length} 条商品类目吗`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.deleteRecordBatch()
        })
    },
    deleteRecordBatch () {
      const dataListSelections = this.gridOptions.api.getSelectedRows()
      if (dataListSelections.length > 0) {
        const obj = dataListSelections.map((item) => {
          return item.id
        })
        this.$store.dispatch('clothingType/delData', obj).then((res) => {
          if (res.code == 200) {
            if (res.data.code == 400) {
              this.$q.notify({
                message: '删除失败',
                caption: res.data.message,
                icon: 'ion-close-circle-outline',
                color: 'red',
                timeout: 1000,
                position: 'top-right'
              })
            } else {
              this.$q.notify({
                icon: 'ion-checkmark-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'green',
                message: '成功',
                caption: '成功删除 ' + res.data + ' 条商品类目'
              })
            }
            this.getList()
          } else {
            this.$q.notify({
              message: '删除失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 1000,
              position: 'top-right'
            })
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
    changeNumber (p) {
      const itemsToUpdate = []
      const data = p.data
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
        this.$store.dispatch('clothingType/setData', obj).then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '修改序号成功',
              color: 'green',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
            this.getList()
          }
        })
      }
      itemsToUpdate.push(data)
      const res = p.api.applyTransaction({ update: itemsToUpdate })
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
    exportCsv () {
      const date = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmmss')
      this.gridOptions.api.exportDataAsCsv({
        fileName: date + '-商品类目记录'
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
