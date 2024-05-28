<template>
  <q-page class="fit">
    <q-form ref="packageDataRef" class="q-gutter-md fit">
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md q-mb-xs">
          <q-tabs v-model="currentPage" indicator-color="primary" class="text-grey-8 bg-white " dense align="left">
            <q-tab name="1" label="套餐基础" />
            <q-tab name="2" label="套餐详情" />
          </q-tabs>
           <hl-specification-tree ref="specificationTree" v-if="showGoodsList" @getSelectedGoodsData="getSelectedGoodsData" @closeDialog="showGoodsList = false"></hl-specification-tree>

          <div class="row q-pt-sm q-px-sm" v-show="currentPage == '2'">
            <q-input outlined label="套餐售价" class="col-4" v-model="goodsPackageDataForm.goo_price" dense :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入正确的价格']"> </q-input>
            <q-space />
            <q-btn unelevated size="md" class="q-mb-md" color="primary" @click="selectBut()" label="选择商品" />
          </div>
        </div>

        <div class="col-shrink bg-white full-height " v-show="currentPage == '1'">
          <div style="overflow-y: scroll;" class="fit full-height">
            <q-card flat class="q-pa-sm">
              <div class="row q-mt-md">
                <div class="col-md-6 col-12 q-pr-md">
                  <hl-select-tree
                    :list_width="400"
                    @getItem="changeGoodsType"
                    :dataList="googsTypeData"
                    textName="请选择分类"
                    :inputLabel="'gt_name'"
                    :inputValue="'id'"
                    :showValue="goodsPackageDataForm.goodsTypeId"
                  />
                </div>
                <div class="col-md-6 col-12 q-pr-md">
                  <q-select option-value="id" option-label="gu_name" emit-value map-options outlined dense v-model="goodsPackageDataForm.goodsUnit_id" :options="googsUnitData" label="单位" />
                </div>
              </div>
              <div class="row q-mt-md">
                <div class="col-md-6 col-12 q-pr-md">
                  <q-input v-model="goodsPackageDataForm.goo_name" outlined label="名称" dense :rules="[(val) => !!val || '名称是必填项']">
                    <template v-slot:after>
                      <q-btn unelevated color="blue-6" label="一键生成简称与助记码" @click="oneKeyGenerateJianCode()" class="full-width q-pt-xs q-px-xs" />
                    </template>
                  </q-input>
                </div>
                <div class="col-md-6 col-12 q-pr-md q-pr-md">
                  <q-input v-model="goodsPackageDataForm.goo_nick" outlined label="简称" dense :rules="[(val) => !!val || '简称是必填项']"> </q-input>
                </div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-md-6 col-12">
                  <div class="row q-pr-md">
                    <div class="col-md-8 col-12">
                      <q-input v-model="goodsPackageDataForm.goo_code" outlined bottom- label="条码" dense lazy-rules :rules="[(val) => !!val || '条码是必填项']"> </q-input>
                    </div>
                    <div class="col-md-4 col-12 q-pl-xs">
                      <q-btn unelevated color="amber-8" label="一键生成条码" @click="oneKeyGenerateCode()" class="full-width q-pt-xs" />
                    </div>
                  </div>
                </div>
                <div class="col-md-6 col-12 q-pr-md">
                  <q-input v-model="goodsPackageDataForm.goo_pinYin" outlined label="助记码" dense :rules="[(val) => !!val || '助记码是必填项']"> </q-input>
                </div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-md-6 col-12">
                  <hl-upload
                    :multiple="false"
                    :currentAttach="goodsPackageDataForm.coverImage"
                    @input="(val)=>{ $nextTick(()=>{ goodsPackageDataForm.goo_cover_image = val })}"
                    currentDescription="建议尺寸比例1:1"
                    currentTitle="封面图"
                  />
                </div>

                <div class="col-md-6 col-12">
                 <hl-upload
                    :multiple="true"
                    :maxTotal="5"
                    :currentAttach="goodsPackageDataForm.loopImage"
                    @input="(val)=>{ $nextTick(()=>{ goodsPackageDataForm.goo_loop_image = val })}"
                    currentDescription="建议尺寸比例1:1"
                    currentTitle="详情图"
                  />
                </div>
              </div>

              <div class="row">
                <div class="col-12 q-mt-xs">
                  <hl-editor
                    @change="
                      (v) => {
                        goodsPackageDataForm.goo_content = v
                      }
                    "
                    :content="goodsPackageDataForm.goo_content"
                    :minHeight="$q.screen.height * 0.4"
                   titleText="套餐详情"
                  ></hl-editor>
                </div>
              </div>
            </q-card>
          </div>
        </div>
        <div class="col-shrink q-px-xs full-height" v-show="currentPage == '2'">
          <ag-grid-vue
            ref="agGridTable"
            :gridOptions="gridOptions"
            class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height"
            :columnDefs="columnDefs"
            :suppressMovableColumns="true"
            :defaultColDef="defaultColDef"
            :rowData="goodsPackageData"
            rowSelection="multiple"
            :rowDragManaged="true"
            colResizeDefault="shift"
            :animateRows="false"
            :floatingFilter="false"
            :enableCellTextSelection="true"
            :suppressRowTransform="true"
            :suppressCellSelection="true"
            :suppressRowClickSelection="true"
            :rowMultiSelectWithClick="true"
            :stopEditingWhenGridLosesFocus="true"
            :singleClickEdit="true"
            @first-data-rendered="onFirstDataRendered"
            rowHeight="50"
            :localeText="localeText"
            :components="components"
            :context="context"
          ></ag-grid-vue>
        </div>

        <div class="col-shrink bg-white q-pt-sm q-pb-md q-gutter-sm text-center" :class="currentPage == '1' ? 'q-mt-xs' : ''">
          <q-btn :disable="goodsPackageData.length == 0 || !goodsPackageDataForm.goo_price" unelevated class="q-px-xl"  color="primary" @click="saveBut()" label="提交" />
          <q-btn unelevated color="grey"  :to="{ name: 'package' }" label="返回" class=" q-px-xl" />
        </div>
       </div>
    </q-form>
  </q-page>
</template>

<script>
import AgGoodsDel from './AgGoodsDel.vue'
import toPinYin from 'pinyin4js' // 汉字转拼音组件
export default {
  name: 'AddSpackage',
  components: { AgGoodsDel },
  data () {
    return {
      currentPage: '1',
      uploadContentStatus: false,
      gridOptions: {},
      components: {},
      context: null,
      goodsPackageDataForm: {
        id: '',
        goo_sort: 0,
        goo_code: '',
        goo_discountType: 0,
        goo_pinYin: '',
        goo_nick: '',
        goo_name: '',
        goodsTypeId: 0,
        goodsUnit_id: '',
        goo_status: 1,
        goo_goodsOrService: 3,
        goo_ifGoodsPackage: 0,
        goo_purchasePrice: '',
        goo_listPrice: '',
        goo_price: '',
        goo_description: '',
        goo_content: '',
        goo_cover_image: '', // 封面图
        goo_loop_image: [],
        goo_size: 0
      }, // 基础设置数据
      disabledStatus: false,
      goosId: 0,
      specificationLayoutData: [],
      showGoodsList: false,
      multiple: false,
      sumFrequency: 0,
      sumTotalCost: 0,
      goodsPackageData: [],
      columnDefs: [
        // 表格列数据
        {
          headerName: '商品名称', // 列标题
          field: 'gpd_goodsName', // 列与数据源对应的字段
          filter: false, // 是否过滤
          width: this.nowpx(0.25) + 'px',
          editable: false,
          onCellValueChanged: function (p) {
            const itemsToUpdate = []
            const data = p.data
            data.gpd_goodsName = Math.floor(Math.random() * 20000 + 20000)
            itemsToUpdate.push(data)
            const res = p.api.applyTransaction({ update: itemsToUpdate })
          },
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },
        {
          headerName: '规格名称',
          field: 'specificationName',
          filter: false,
          width: this.nowpx(0.15) + 'px',
          rowSpan: this.rowSpan,
          cellClassRules: {
            'cell-span': function (p) {
              if (p.value) {
                return true
              }
            }
          }
        },

        {
          headerName: '数量',
          field: 'gpd_goodsNumber',
          filter: false,
          editable: (p) => {
            return !p.data.showEdit
          },
          onCellValueChanged: this.changeQuantity,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '售价',
          field: 'gpd_goodsPrice',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '参考价(小计)',
          field: 'gpd_priceSubtotal',
          filter: false,
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '操作',
          field: 'gpd_packagePrice',
          filter: false,
          cellRendererFramework: 'AgGoodsDel',
          width: this.nowpx(0.15) + 'px'
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      localeText: this.$ag_grid_localeText,
      googsTypeData: [],
      googsUnitData: []
    }
  },
  mounted () {
    this.context = this
    this.goosId = this.$route.query.id
    if (this.goosId > 0) {
      this.getItemData()
    }
    this.getUnitData()
    this.getTypeData()
  },
  created () {},
  computed: {},
  methods: {
    // 列表自适应
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
    changeGoodsType (item) {
      if (item) {
        this.goodsPackageDataForm.goodsTypeId = item.id
      }
    },

    // 获取计量单位
    getUnitData () {
      const obj = {
        goodsType: 3
      }
      this.$store
        .dispatch('goods/getUnit', obj)
        .then((res) => {
          if (res.code == 200 && res.data) {
            this.googsUnitData = res.data
          } else {
            this.$q.notify({
              message: '失败',
              caption: '请先添加计量单位',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })
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

    // 获取分类
    getTypeData () {
      const obj = {
        goodsType: 3
      }
      this.$store
        .dispatch('goodstype/getTreeList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.googsTypeData = res.data ? res.data : []
            } else {
              this.$q.notify({
                message: '失败',
                caption: '请先添加商品分类',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                color: 'red'
              })
            }
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

    // 获取单条数据
    getItemData () {
      const obj = {
        id: this.goosId
      }
      this.$store
        .dispatch('goodspackage/getItemData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.goodsPackageDataForm = res.data

            if (res.data.goodsPackageDetail) {
              this.goodsPackageData = res.data.goodsPackageDetail
              this.setTopTabel(this.goodsPackageData)
            }
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },

    // 保存
    saveBut () {
      this.disabledStatus = true
      this.$refs.packageDataRef.validate().then((success) => {
        if (success) {
          const obj = {
            id: this.goosId | '',
            goodsPackageDataForm: this.goodsPackageDataForm,
            goodsPackageData: this.goodsPackageData
          }
          this.$store
            .dispatch('goodspackage/addData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  color: 'green',
                  message: '成功',
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  caption: '添加成功'
                })
                this.disabledStatus = false
                this.$router.push({ name: 'package' })
              }
            })
            .catch((error) => {
              this.disabledStatus = false
            })
        }
      })
    },

    // 一键生成简称和助记码
    oneKeyGenerateJianCode () {
      const chinaVal = this.goodsPackageDataForm.goo_name
      if (chinaVal) {
        this.goodsPackageDataForm.goo_nick = chinaVal.substr(0, 6)
        this.goodsPackageDataForm.goo_pinYin = toPinYin
          .convertToPinyinString(chinaVal, '', toPinYin.FIRST_LETTER)
          .toUpperCase()
          .substr(0, 6)
      } else {
        this.$q.notify({
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right',
          message: '错误',
          caption: '商品名称未填写！'
        })
      }
    },

    oneKeyGenerateCode () {
      const newDate = new Date()
      this.goodsPackageDataForm.goo_code = String(newDate.getTime())
    },

    // 选择商品
    selectBut () {
      this.showGoodsList = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType([1, 2])
        }, 500)
      })
    },
    // 获取选中规格商品数据
    getSelectedGoodsData (data, status = false) {
      this.showGoodsList = status
      if (data) {
        if (data.length > 0) {
          this.specNewsDataBak = []
          for (let i = 0; i < data.length; i++) {
            const person = {
              id: '',
              gpd_goodsName: '',
              gpd_goodsNumber: '',
              gpd_packagePrice: '',
              gpd_goodsPrice: '',
              gpd_goodsBarcode: '',
              specificationName: '',
              goods_id: '',
              specification_id: '',
              gpd_goodsGenre: ''
            }

            person.gpd_goodsNumber = data[i].frequency
            person.gpd_packagePrice = data[i].goo_price
            person.gpd_goodsPrice = data[i].goo_price
            person.gpd_goodsBarcode = data[i].goo_code
            person.gpd_goodsName = data[i].goo_name
            person.specificationName = data[i].specificationName
            person.goods_id = data[i].goods_id
            person.specification_id = data[i].id
            person.gpd_goodsGenre = data[i].goo_type
            person.gpd_priceSubtotal = data[i].goo_price * data[i].frequency
            this.specNewsDataBak.push(person)
          }
          this.goodsPackageData = this.goodsPackageData.concat(this.specNewsDataBak)
          this.setTopTabel(this.goodsPackageData)
        }
      }
    },
    // 商品单个数量
    changeQuantity (p) {
      const itemsToUpdate = []
      if (p.data.gpd_goodsNumber) {
        const re = /^[0-9]*[0-9][0-9]*$/

        if (re.test(p.data.gpd_goodsNumber)) {
          p.data.gpd_priceSubtotal = p.data.gpd_goodsPrice * p.data.gpd_goodsNumber
        } else {
          if (!re.test(p.data.gpd_goodsNumber)) {
            p.data.gpd_goodsNumber = 1
            this.$q.notify({
              message: '警告',
              caption: '请输入正整数',
              color: 'red',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }

          p.data.gpd_goodsNumber = 1
          p.data.gpd_priceSubtotal = p.data.gpd_goodsPrice * p.data.gpd_goodsNumber
        }

        itemsToUpdate.push(p.data)

        const res = p.api.applyTransaction({ update: itemsToUpdate })

        this.setTopTabel(this.goodsPackageData)
      }
    },

    rowSpan (params) {
      const fields = ['gpd_goodsName']

      const data = this.goodsPackageData
      const row = params.data
      const rowIndex = params.node.rowIndex
      const property = params.colDef.field
      const cellValue = row[property]

      if (cellValue && fields.includes(property)) {
        const prevRow = data[rowIndex - 1]
        let nextRow = data[rowIndex + 1]
        let countRowspan = 0
        if (prevRow && prevRow[property] === cellValue) {
          return countRowspan
        } else {
          countRowspan = 1
          while (nextRow && nextRow[property] === cellValue) {
            nextRow = data[++countRowspan + rowIndex]
          }

          if (countRowspan > 1) {
            return countRowspan
          }
        }
      }
    },

    setTopTabel (list) {
      const newRows = this.countColumnData(list, [
        {
          gpd_goodsName: '数据合计',
          showEdit: true,
          gpd_goodsNumber: '',
          gpd_priceSubtotal: '',
          gpd_goodsPrice: ''
        }
      ])
      setTimeout(() => {
        this.gridOptions.api.setPinnedBottomRowData(newRows) // 底部汇总
      }, 200)
    },

    countColumnData (data = [], condition = []) {
      if (data.length > 0 && condition.length > 0) {
        const rowData = []
        condition.forEach((i, k) => {
          const oneRowData = {}

          for (var j in i) {
            oneRowData[j] = 0
            if (!i[j]) {
              data.forEach((value, key) => {
                oneRowData[j] += this.formatAmount(value[j])
              })
            } else {
              oneRowData[j] = i[j]
            }
          }
          rowData.push(oneRowData)
        })
        return rowData
      }
    },

    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
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
<style>
.cell-span {
  background: white;
  border-left: 1px solid lightgrey !important;
  border-right: 1px solid lightgrey !important;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
</style>
