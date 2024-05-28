<template>
  <q-dialog v-model="activePrompt" maximized persistent full-height full-width>
    <q-card
      :style="{
        width: this.$q.screen.width + 'px',
        'min-width': this.$q.screen.width + 'px',
      }"
      class="fit"
    >
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class=" col-shrink q-ml-md q-ma-sm">
          <div class="row items-center q-pr-md">
            <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
            选择商品
            <q-space />

            <q-btn icon="close" flat round dense v-close-popup @click="closeDialog" />
          </div>
        </div>

        <q-separator class="q-my-sm" />

        <div class="col-shrink row q-px-md q-gutter-sm">
          <div class="col-12 col-md-2 ">
            <q-input outlined v-model="searchValue" label="名称/条码" dense />
          </div>
          <q-btn color="primary" unelevated @click="getInquireType(goodsModel)">搜索</q-btn>
          <q-btn color="grey-6" unelevated @click="handleFormReset">重置</q-btn>
        </div>

        <div class="col-shrink  full-height q-py-md q-mx-md">
          <q-scroll-area class="fit">

          <q-table
            :pagination="{
              rowsPerPage: 0,
            }"
            flat
            bordered
            hide-bottom
            separator="cell"
            title="搜索结果"
            :data="specificationNewsData"
            :columns="columns"
            row-key="id"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="code" :props="props">
                  {{ props.row.code }}
                </q-td>
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>
                <q-td key="picture" :props="props">
                  <q-img v-if="props.row.picture" :src="props.row.picture" :ratio="1" style="height: 60px; width: 60px" />
                </q-td>
                <q-td key="picture_urls" :props="props">
                  <q-scroll-area style="height: 70px; max-width: 200px;"  v-if="props.row.picture_urls">
                    <q-img
                      v-for="(item, key) in props.row.picture_urls"
                      :key="key"
                      :src="item"
                      :ratio="1"
                      class="q-mx-xs"
                      style="height: 60px; width: 60px"
                    />
                  </q-scroll-area>
                </q-td>
                <q-td key="price" :props="props">
                  {{ props.row.price }}
                </q-td>
                <q-td key="price_unit" :props="props">
                  {{ props.row.price_unit }}
                </q-td>
                <q-td key="specification" :props="props">
                  {{ props.row.specification }}
                </q-td>
                <q-td key="brand" :props="props">
                  {{ props.row.brand }}
                </q-td>
                <q-td key="id" :props="props">
                  <q-btn color="primary" unelevated @click="addGoods(props.row)" label="添加" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
          </q-scroll-area>
        </div>

        <q-separator class="q-my-sm" />

        <div class="col-shrink bg-white q-pb-md row q-gutter-md items-center  q-px-md">
          <q-btn class="q-px-xl" @click="openBufferDialog" unelevated color="primary" label="已选列表">
            <q-badge color="red" floating>{{ currentBufferData.length }}</q-badge>
          </q-btn>

          <q-btn
            class="q-px-xl"
            unelevated
            color="primary"
            @click="batchAddGoods"
            :disable="checkGoodsData.length > 0 ? false : true"
            label="批量选择"
          >
            <q-badge color="red" floating>{{ checkGoodsData.length }}</q-badge>
          </q-btn>

          <q-btn class="q-px-xl" unelevated color="grey" @click="closeDialog" label="关闭" />
          <q-space />
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :page-sizes="[20, 50, 100, 200, 300, 500, 1000]"
            :current-page="page.pageIndex"
            :page-size="page.pSize"
            :total="page.pageTotal"
          ></hl-pagination>
        </div>
      </div>

      <q-dialog v-model="detailDialogStatus"   full-height full-width>
        <q-card
          :style="{
            width: this.$q.screen.width * 0.6 + 'px',
            'min-width': this.$q.screen.width * 0.6 + 'px',
          }"
          class="fit column justify-between"
        >

        <q-card-section class="col">
           <q-scroll-area class="fit">
          <q-table
            :pagination="{
              rowsPerPage: 0,
            }"
            flat
            bordered
            hide-bottom
            separator="cell"
            title="添加列表"
            :data="currentBufferData"
            :columns="columns"
            row-key="id"
          >
            <template v-slot:body="props">
              <q-tr :props="props">
                <q-td key="code" :props="props">
                  {{ props.row.code }}
                </q-td>
                <q-td key="name" :props="props">
                  {{ props.row.name }}
                </q-td>
                <q-td key="picture" :props="props">
                  <q-img v-if="props.row.picture" :src="props.row.picture" :ratio="1" style="height: 60px; width: 60px" />
                </q-td>
                <q-td key="picture_urls" :props="props">
                  <q-scroll-area style="height: 70px; max-width: 200px;"  v-if="props.row.picture_urls">
                    <q-img
                      v-for="(item, key) in props.row.picture_urls"
                      :key="key"
                      :src="item"
                      :ratio="1"
                      class="q-mx-xs"
                      style="height: 60px; width: 60px"
                    />
                  </q-scroll-area>
                </q-td>
                <q-td key="price" :props="props">
                  {{ props.row.price }}
                </q-td>
                <q-td key="price_unit" :props="props">
                  {{ props.row.price_unit }}
                </q-td>
                <q-td key="specification" :props="props">
                  {{ props.row.specification }}
                </q-td>
                <q-td key="brand" :props="props">
                  {{ props.row.brand }}
                </q-td>
                <q-td key="id" :props="props">
                  <q-btn color="red" unelevated @click="delBufferGoods(props.rowIndex)" label="删除" />
                </q-td>
              </q-tr>
            </template>
          </q-table>
           </q-scroll-area>
        </q-card-section>

        <q-card-actions class="col-1 row q-gutter-md items-center q-px-md">
          <q-btn class="q-px-xl"  unelevated @click="addCloudGoosdData" color="primary" label="立即添加"></q-btn>

          <q-btn class="q-px-xl" @click="closeDialogStatus" unelevated color="grey" label="关闭"></q-btn>
        </q-card-actions>

        </q-card>
      </q-dialog>

    </q-card>
  </q-dialog>
</template>
<script>

export default {
  components: {

  },

  data () {
    return {
      searchValue: '',
      specificationNewsData: [], // 默认数据源
      gridOptions: {},
      columns: [
        { name: 'code', align: 'center', label: '条码', field: 'code' },
        { name: 'name', align: 'center', label: '名称', field: 'name' },
        { name: 'picture', align: 'center', label: '产品封面', field: 'picture' },
        { name: 'picture_urls', align: 'center', label: '产品图片列表', field: 'picture_urls' },
        { name: 'price', align: 'center', label: '建议售价', field: 'price' },
        { name: 'price_unit', align: 'center', label: '价格计量单位', field: 'price_unit' },
        { name: 'specification', align: 'center', label: '产品规格', field: 'specification' },
        { name: 'brand', align: 'center', label: '品牌名称', field: 'brand' },
        { name: 'id', align: 'center', label: '操作', field: 'id' }
      ],

      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: true,
        suppressMenu: false,
        rowDragManaged: true
      },
      localeText: this.$ag_grid_localeText,
      page: {
        pageIndex: 1,
        pSize: 20,
        pageTotal: 0
      },
      activePrompt: false,
      goodsModel: '',
      picUrl: '',
      context: null,
      currentBufferData: [],
      checkGoodsData: [],
      detailDialogStatus: false
    }
  },

  mounted () {},
  created () {},
  computed: {},
  methods: {
    init () {
      this.context = this
      this.activePrompt = true
      // this.getCloudPicUrl()
    },
    openBufferDialog () {
      this.detailDialogStatus = true
    },
    closeDialogStatus () {
      this.detailDialogStatus = false
    },
    getCloudPicUrl () {
      const obj = {}
      this.$store
        .dispatch('components/getCloudPicUrl', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.picUrl = res.data
          }
        })
        .catch((error) => {})
    },
    closeDialog () {
      this.activePrompt = false

      this.$emit('closeDialog')
    },

    addGoods (item) {
      if (item.code) {
        const index = _.findIndex(this.currentBufferData, function (o) { return o.code == item.code })
        if (index < 0) {
          this.$q.notify({
            color: 'green',
            message: '成功',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: '添加成功'
          })
          this.currentBufferData.push(item)
        } else {
          this.$q.notify({
            message: '错误',
            caption: '已选列表已存在',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
        }
      }
    },

    rowSelectedAg (p) {
      this.checkGoodsData = p.api.getSelectedRows()
    },
    batchAddGoods () {
      const that = this
      this.checkGoodsData.forEach((item) => {
        that.addGoods(item)
      })
      this.gridOptions.api.deselectAll()
      this.checkGoodsData = []
    },
    // 选择商品开启弹窗调取数据
    getInquireType () {
      const obj = {
        searchValue: this.searchValue,
        pageIndex: this.page.pageIndex,
        pSize: this.page.pSize
      }
      this.$store
        .dispatch('components/getCloudGoodsLists', obj)
        .then((res) => {
          if (res.code == 200) {
            this.specificationNewsData = res.data.list

            this.page.pageTotal = parseInt(res.data.page.totalCount)
          }
        })
        .catch((error) => {})
    },

    addCloudGoosdData () {
      const obj = {
        currentBufferData: this.currentBufferData
      }
      this.$store
        .dispatch('components/addCloudGoosdData', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.$q.notify({
              color: 'green',
              message: '成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 2000,
              position: 'top-right',
              caption: '成功导入' + (res.data.successCount || 0) + '条商品数据'
            })
            this.closeDialog()
          }
        })
        .catch((error) => {})
    },

    delBufferGoods (key) {
      if (key > -1) {
        this.currentBufferData.splice(key, 1)
      }
    },

    // 每页数
    sizeChangeHandle (val) {
      this.page.pSize = val
      this.page.pageIndex = 1
      this.getInquireType()
    },
    // 当前页
    currentChangeHandle (val) {
      this.page.pageIndex = val
      this.getInquireType()
    },

    // 重置
    handleFormReset () {
      this.searchValue = ''
      this.getInquireType()
    },
    onFirstDataRendered (params) {
      const nowWidth = this.$q.screen.width
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit()
      }
    }
  }
}
</script>
<style>
.my-green-class {
  text-align: center;
}

.goods-select-table .cell-span-goods-select {
  background: white;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
