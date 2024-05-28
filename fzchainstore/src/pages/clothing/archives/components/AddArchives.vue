<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-sm q-mb-xs">
        <q-tabs v-model="tab" indicator-color="primary" dense class="text-grey-8 bg-white" align="left">
          <q-tab name="1" label="档案信息" />
          <q-tab name="3" label="基础属性" />
          <q-tab name="2" label="规格价格" />
          <q-tab name="erp" label="erp设置" />
        </q-tabs>
      </div>

      <div class="col-shrink  full-height bg-white">
        <div style="overflow-y: scroll;" class="fit full-height">
          <q-form ref="goodsDataRef">
            <div v-show="tab == '1'" class="q-pa-sm row q-col-gutter-sm">
              <div class="col-12">
                <q-input v-model="dataForm.goo_name" outlined bottom-slots dense label="名称*" :rules="[(val) => !!val || '名称是必填项']">
                  <template v-slot:after>
                    <q-btn unelevated color="blue-6" @click="oneKeyGenerateJianCode()" label="一键生成简称与助记码" />
                  </template>
                </q-input>
              </div>
              <div class="col-6">
                <q-input v-model="dataForm.goo_nick" outlined bottom-slots dense label="简称"> </q-input>
              </div>
              <div class="col-6">
                <q-input v-model="dataForm.goo_pinYin" outlined bottom-slots dense label="助记码 *" :rules="[(val) => !!val || '助记码是必填项']">
                </q-input>
              </div>

              <div class="col-3">
                <q-input
                  v-model="dataForm.goo_sort"
                  outlined
                  bottom-slots
                  dense
                  label="排序"
                  :rules="[(val) => /^\d+$/.test(val) || '请输入正确的序号']"
                >
                </q-input>
              </div>
              <div class="col-3">
                <q-select
                  outlined
                  v-model="dataForm.goo_status"
                  map-options
                  emit-value
                  dense
                  option-label="label"
                  option-value="value"
                  :options="statusOptions"
                  label="选择状态"
                />
              </div>
              <div class="col-3">
                <hl-select-tree
                  :list_width="400"
                  @getItem="changeGoodsType"
                  @resetValue="dataForm.goodsTypeId = ''"
                  :dataList="typedata"
                  textName="请选择分类"
                  :inputLabel="'gt_name'"
                  :inputValue="'id'"
                  :showValue="dataForm.goodsTypeId"
                />
              </div>

              <div class="col-3">
                <q-select
                  outlined
                  dense
                  v-model="dataForm.goodsUnit_id"
                  :options="unitList"
                  option-value="id"
                  option-label="gu_name"
                  emit-value
                  map-options
                  label="计量单位 *"
                  :rules="[(val) => !!val || '计量单位是必填项']"
                />
              </div>

              <div class="col-12">
                <q-input outlined bottom-slots v-model="dataForm.goo_description" dense label="描述"> </q-input>
              </div>

              <div class="col-md-4 col-12 q-px-lg">
                <hl-upload
                  :multiple="false"
                  :currentAttach="dataForm.coverImage"
                  @input="
                    (val) => {
                      $nextTick(() => {
                        dataForm.goo_cover_image = val;
                      });
                    }
                  "
                  currentDescription="建议尺寸比例1:1"
                  currentTitle="封面图"
                />
              </div>

              <div class="col-md-6 col-12 q-px-lg">
                <hl-upload
                  :multiple="true"
                  :maxTotal="5"
                  :currentAttach="dataForm.loopImage"
                  @input="
                    (val) => {
                      $nextTick(() => {
                        dataForm.goo_loop_image = val;
                      });
                    }
                  "
                  currentDescription="建议尺寸比例1:1"
                  currentTitle="详情图"
                />
              </div>
              <div class="col-12">
                <div class="text-h6 q-pa-xs q-pl-lg">商品标签</div>
                <select-tag @getTag="getTag" :archivesId="goodsId" class="q-my-md"> </select-tag>
              </div>

              <div class="col-12">
                <hl-editor
                  @change="
                    (v) => {
                      dataForm.goo_content = v;
                    }
                  "
                  :content="dataForm.goo_content"
                  :minHeight="$q.screen.height * 0.4"
                  titleText="商品详情"
                ></hl-editor>
              </div>
            </div>
            <div v-show="tab == '2'" class="q-pa-sm">
              <q-card flat>
                <q-card-section>
                  <div class="text-subtitle1">价格设置</div>
                </q-card-section>
                <q-separator />
                <div class="row q-pb-md">
                  <div class="col-md-2 col-12 q-px-sm">
                    <q-input
                      v-model="archives.ca_article_code"
                      standout
                      dense
                      outlined
                      label="货号"
                      class="q-mt-md"
                      :rules="[(val) => !!val || '请输入货号', (val) => /^[A-Za-z0-9]{5}$/.test(val) || '请输入正确的货号']"
                    >
                    </q-input>
                  </div>
                  <div class="col-md-2 col-12 q-px-sm">
                    <q-input
                      v-model="dataForm.goo_price"
                      standout
                      dense
                      outlined
                      label="吊牌价"
                      class="q-mt-md"
                      :rules="[(val) => !!val || '请输入吊牌价', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '吊牌价为非负两位以内小数']"
                    >
                    </q-input>
                  </div>
                </div>
              </q-card>
              <q-card flat class="q-mt-xs">
                <q-card-section>
                  <div class="text-subtitle1">规格设置</div>
                </q-card-section>
                <q-separator />
                <div class="row  q-pt-lg">
                  <div class="col-md-4 col-12 q-px-sm">
                    <q-select
                      outlined
                      dense
                      v-model="archives.ca_format_id"
                      :options="formatList"
                      map-options
                      emit-value
                      option-value="id"
                      @input="showFormatData"
                      option-label="cf_name"
                      label="选择规格组"
                      :rules="[(val) => !!val || '规格组是必填项']"
                    />
                  </div>
                </div>
                <!-- {{ format }}  text-center -->
                <q-card flat bordered class="rounded-borders q-pa-md">
                  <div class="row" v-if="sizeData.length > 0">
                    <div class="col-1 text-center">尺寸</div>
                    <q-separator :vertical="true" class="q-mx-sm" />
                    <div class="col-10">
                      <span v-for="(item, key) in sizeData" :key="key" @click="addFormat(item, 'size')">
                        <q-btn unelevated class="q-mx-sm" text-color="white" :color="item.status == 1 ? 'green' : 'primary'">
                          {{ item.cft_name }}
                          <q-badge color="grey-5 " rounded floating v-if="item.status == 1"> x </q-badge>
                        </q-btn>
                      </span>
                    </div>
                  </div>
                  <div class="row  q-mt-md" v-if="colorData.length > 0">
                    <div class="col-1 text-center">颜色</div>
                    <q-separator :vertical="true" class="q-mx-sm" />
                    <div class="col-10">
                      <span v-for="(item, key) in colorData" :key="key" @click="addFormat(item, 'color')">
                        <q-btn unelevated text-color="white" class="q-ml-none q-mx-sm" :color="item.status == 1 ? 'green' : 'primary'">
                          {{ item.cft_name }}
                          <q-badge color="grey-5 " rounded floating v-if="item.status == 1">x </q-badge>
                        </q-btn>
                      </span>
                    </div>
                  </div>
                </q-card>
                <div class="q-mt-sm" :style="`height:${gridOptions.rowHeight * 6}px`">
                  <ag-grid-vue
                    ref="agGridTable"
                    class="ag-theme-balham ag-grid-table goods-count-table hl_header_center hl_content_center full-height spe-ag-grid"
                    :columnDefs="columnDefs"
                    :gridOptions="gridOptions"
                    :suppressMovableColumns="true"
                    :defaultColDef="defaultColDef"
                    :rowData="tableData"
                    rowSelection="multiple"
                    :rowDragManaged="true"
                    colResizeDefault="shift"
                    :animateRows="false"
                    :floatingFilter="false"
                    :enableCellTextSelection="true"
                    @first-data-rendered="onFirstDataRendered"
                    @gridReady="onFirstDataRendered"
                    rowHeight="50"
                    domLayout="autoHeight"
                    :suppressCellSelection="true"
                    :suppressRowClickSelection="true"
                    :stopEditingWhenGridLosesFocus="true"
                    :localeText="localeText"
                    :components="components"
                    :context="context"
                  ></ag-grid-vue>
                </div>
              </q-card>
            </div>
            <div v-show="tab == '3'" class="q-pa-sm ">
              <div class="row q-col-gutter-sm">
                <div class="col-3">
                  <q-select
                    outlined
                    dense
                    v-model="archives.ca_brand_id"
                    :options="brandList"
                    option-value="id"
                    option-label="cp_name"
                    emit-value
                    map-options
                    label="品牌*"
                    :rules="[(val) => !!val || '品牌是必填项']"
                  />
                </div>
                <div class="col-3">
                  <q-select
                    outlined
                    dense
                    v-model="archives.ca_years_id"
                    :options="yearsList"
                    option-value="id"
                    option-label="cp_name"
                    emit-value
                    map-options
                    label="年份*"
                    :rules="[(val) => !!val || '年份是必填项']"
                  />
                </div>
                <div class="col-3">
                  <q-select
                    outlined
                    dense
                    v-model="archives.ca_season_id"
                    :options="seasonList"
                    option-value="id"
                    option-label="cp_name"
                    emit-value
                    map-options
                    label="季度*"
                    :rules="[(val) => !!val || '季度是必填项']"
                  />
                </div>
                <div class="col-3">
                  <q-select
                    outlined
                    dense
                    v-model="archives.ca_band_id"
                    :options="bandList"
                    option-value="id"
                    option-label="cp_name"
                    emit-value
                    map-options
                    label="波段*"
                    :rules="[(val) => !!val || '波段是必填项']"
                  />
                </div>
                <div class="col-3">
                  <q-select
                    outlined
                    dense
                    v-model="archives.ca_series_id"
                    :options="seriesList"
                    option-value="id"
                    option-label="cp_name"
                    emit-value
                    map-options
                    label="系列*"
                    :rules="[(val) => !!val || '系列是必填项']"
                  />
                </div>
                <div class="col-3">
                  <q-select
                    outlined
                    dense
                    v-model="archives.ca_style_id"
                    :options="styleList"
                    option-value="id"
                    option-label="cp_name"
                    emit-value
                    map-options
                    label="风格 *"
                    :rules="[(val) => !!val || '风格是必填项']"
                  />
                </div>
                <div class="col-3">
                  <q-select
                    outlined
                    dense
                    v-model="archives.ca_fabric_id"
                    :options="fabricList"
                    option-value="id"
                    option-label="cp_name"
                    emit-value
                    map-options
                    label="面料类别 *"
                    :rules="[(val) => !!val || '面料类别是必填项']"
                  />
                </div>
                <div class="col-3">
                  <q-select
                    outlined
                    dense
                    v-model="archives.ca_safetytype_id"
                    :options="safetyTypeList"
                    option-value="id"
                    option-label="cp_name"
                    emit-value
                    map-options
                    label="安全级别 *"
                    :rules="[(val) => !!val || '安全级别是必填项']"
                  />
                </div>
                <div class="col-3">
                  <q-select
                    outlined
                    dense
                    v-model="archives.ca_standard_id"
                    :options="standardList"
                    option-value="id"
                    option-label="cs_name"
                    emit-value
                    map-options
                    label="执行标准 *"
                    :rules="[(val) => !!val || '执行标准是必填项']"
                  >
                    <template v-slot:option="scope">
                      <q-item v-bind="scope.itemProps" v-on="scope.itemEvents">
                        <q-item-section>
                          <q-item-label>{{ scope.opt.cs_name }}</q-item-label>
                          <q-item-label caption>编码:{{ scope.opt.cs_code }}</q-item-label>
                        </q-item-section>
                      </q-item>
                    </template>
                  </q-select>
                </div>
                <div class="col-3">
                  <q-select
                    outlined
                    dense
                    v-model="archives.ca_priority_id"
                    :options="priorityList"
                    option-value="id"
                    option-label="cp_name"
                    emit-value
                    map-options
                    label="商品层次 *"
                    :rules="[(val) => !!val || '商品层次是必填项']"
                  />
                </div>
                <div class="col-3">
                  <q-select
                    outlined
                    dense
                    v-model="archives.ca_group_id"
                    :options="groupList"
                    option-value="id"
                    option-label="cgi_name"
                    emit-value
                    map-options
                    label="商品分组 *"
                    :rules="[(val) => !!val || '商品分组是必填项']"
                  />
                </div>

                <div class="col-6">
                  <q-list bordered separator>
                    <q-item-label class="text-subtitle2 q-pa-md">自定义属性</q-item-label>
                    <q-separator />
                    <q-item>
                      <q-item-section>
                        <q-select outlined dense v-model="customizeData" :options="customizeList" option-label="cc_name" label="选择自定义属性" />
                      </q-item-section>
                      <q-item-section side>
                        <q-btn color="primary" label="添加属性" @click="addCustomize" unelevated icon="las la-plus-square" />
                      </q-item-section>
                    </q-item>

                    <q-item v-for="(item, key) in customizeDetail" :key="key">
                      <q-item-section v-if="item.cc_if_choose == 1 && item.detail.length > 0">
                        <q-select
                          outlined
                          dense
                          v-model="item.customize_info"
                          :options="item.detail"
                          option-value="id"
                          option-label="ccd_name"
                          emit-value
                          map-options
                          multiple
                          use-chips
                          :label="item.cc_name"
                          :rules="[
                            (val) =>
                              (parseInt(item.cc_if_required) != 1 ? true : !!val && parseInt(item.cc_if_required) == 1 ? true : false) ||
                              item.cc_name + '为必填项',
                          ]"
                        />
                      </q-item-section>
                      <q-item-section v-if="item.cc_if_choose != 1 && item.detail.length > 0">
                        <q-select
                          outlined
                          dense
                          v-model="item.customize_info"
                          :options="item.detail"
                          option-value="id"
                          option-label="ccd_name"
                          emit-value
                          map-options
                          :label="item.cc_name"
                          :rules="[
                            (val) =>
                              (parseInt(item.cc_if_required) != 1 ? true : !!val && parseInt(item.cc_if_required) == 1 ? true : false) ||
                              item.cc_name + '为必填项',
                          ]"
                        />
                      </q-item-section>
                      <q-item-section v-if="item.cc_if_manual_input == 1">
                        <q-input
                          v-model="item.customize_info"
                          standout
                          dense
                          outlined
                          :label="item.cc_name"
                          :rules="[
                            (val) =>
                              (parseInt(item.cc_if_required) != 1 ? true : !!val && parseInt(item.cc_if_required) == 1 ? true : false) ||
                              item.cc_name + '为必填项',
                          ]"
                        />
                      </q-item-section>
                      <q-item-section side top>
                        <q-btn @click="deleteCustomize(item, key)" color="red" flat unelevated round icon="delete "> </q-btn>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </div>
              </div>
            </div>
            <div v-show="tab == 'erp'" class="q-pa-sm row q-col-gutter-sm">
              <div class="col-3">
                <q-select
                  outlined
                  dense
                  v-model="archives.ca_depot_id"
                  :options="depotList"
                  option-value="id"
                  option-label="cd_code"
                  emit-value
                  map-options
                  @input="getShelfAll"
                  label="商品仓库 "
                />
              </div>
              <div class="col-3">
                <q-select
                  outlined
                  dense
                  v-model="archives.ca_shelf_id"
                  :options="shelfList"
                  @input="getLocationfAll"
                  option-value="id"
                  option-label="cs_code"
                  emit-value
                  map-options
                  label="商品货架 "
                />
              </div>
              <div class="col-3">
                <q-select
                  outlined
                  dense
                  v-model="archives.ca_location_id"
                  :options="locationList"
                  @input="getLocationfItem"
                  option-value="id"
                  option-label="cl_code"
                  emit-value
                  map-options
                  label="商品货位 "
                />
              </div>
              <div class="col-3">
                <q-input readonly v-model="archives.ca_clothing_location" outlined bottom-slots dense label="库位/货位 "> </q-input>
              </div>
              <div class="col-3">
                <q-select
                  outlined
                  v-model="archives.ca_supplier_id"
                  :options="supplierData"
                  option-value="id"
                  option-label="ces_name"
                  option-disable="inactive"
                  emit-value
                  map-options
                  dense
                  label="请选择供货商"
                />
              </div>
              <div class="col-3">
                <q-input
                  v-model="archives.ca_supplier_article_code"
                  outlined
                  bottom-slots
                  dense
                  label="供应商货号"
                  :rules="[(val) => /^[0-9a-zA-Z]*$/g.test(val) || '请输入正确的供应商货号']"
                >
                </q-input>
              </div>
              <div class="col-3 ">
                <q-select
                  outlined
                  dense
                  v-model="archives.ca_direct_set"
                  :options="[
                    {
                      value: '1',
                      label: '关闭',
                    },
                    {
                      value: '2',
                      label: '增量',
                    },
                    {
                      value: '3',
                      label: '倍数',
                    },
                  ]"
                  option-value="value"
                  option-label="label"
                  emit-value
                  map-options
                  @input="getShelfAll"
                  label="商品仓库 "
                />
              </div>
              <div class="col-3">
                <q-input v-model="archives.ca_minimum_order" outlined bottom-slots dense label="起订数量"> </q-input>
              </div>
            </div>
          </q-form>
        </div>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
        <q-btn unelevated color="primary" class="q-px-xl" :disable="disabledStatus" label="保存" @click="saveBut()" />
        <q-btn unelevated color="grey" class="q-px-xl" label="返回" :to="{ name: 'clothingArchives' }" />
      </div>
    </div>
  </q-page>
</template>

<script>
import toPinYin from 'pinyin4js' // 汉字转拼音组件
import AgButton from './AgButton.vue'
import SelectTag from 'src/pages/clothing/tag/components/SelectTag.vue'
export default {
  name: 'AddArchives',
  components: {
    SelectTag,
    AgButton
  },
  data () {
    return {
      multiple: false,
      typedata: [],
      unitList: [],
      dataForm: {
        // id: "",
        goo_sort: '1',
        goo_pinYin: '',
        goo_nick: '',
        goo_name: '',
        goodsTypeId: '',
        goodsUnit_id: '',
        goodssupplier_id: '',
        goo_status: '1',
        goo_goodsOrService: 1,
        goo_price: '',
        goo_description: '',
        goo_content: '',
        goo_cover_image: '',
        goo_loop_image: [],
        goo_note: ''
      }, // 基础设置数据
      changeSpe: {
        cad_size_name: '',
        cad_color_name: '',
        cad_skc_code: '',
        cad_only_code: '',
        cad_price: ''
      },
      archives: {
        ca_article_code: '',
        ca_supplier_article_code: '',
        ca_supplier_id: '',
        ca_priority_id: '',
        ca_fabric_id: '',
        ca_safetytype_id: '',
        ca_brand_id: '',
        ca_years_id: '',
        ca_season_id: '',
        ca_band_id: '',
        ca_series_id: '',
        ca_style_id: '',
        ca_standard_id: '',
        ca_depot_id: '',
        ca_location_id: '',
        ca_shelf_id: '',
        ca_clothing_location: '',
        ca_markup_id: '',
        ca_group_id: '',
        ca_format_id: '',
        ca_minimum_order: '',
        ca_direct_set: '1'
      },

      uploadImgStatus: false,
      gridOptions: {
        onGridReady: function (p) {
          p.api.sizeColumnsToFit()
        }
      },
      tableData: [],
      treeData: [],
      specificationModifyData: [],
      localeText: this.$ag_grid_localeText,
      columnDefs: [
        {
          headerName: '尺寸',
          field: 'cad_size_name',
          width: 300
        },
        {
          headerName: '颜色',
          field: 'cad_color_name',
          width: 300
        },
        {
          headerName: '条码',
          field: 'cad_skc_code',
          width: 300
        },
        {
          headerName: '售价',
          field: 'cad_price',
          width: 300
        },
        {
          headerName: '唯一码',
          field: 'cad_only_code',
          width: 300
        },
        {
          headerName: '操作',
          field: 'cad_only_code',
          cellRendererFramework: 'AgButton',
          width: 150
        }
      ],
      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      disabledStatus: false,
      tab: '1',
      statusOptions: [
        {
          label: '上架',
          value: '1'
        },
        {
          label: '下架',
          value: '2'
        }
      ],
      goodsId: 0,
      components: {},
      context: '',
      fabricList: [],
      safetyTypeList: [],
      brandList: [],
      yearsList: [],
      seasonList: [],
      bandList: [],
      seriesList: [],
      styleList: [],
      priorityList: [],
      groupList: [],
      standardList: [],
      tagData: [],
      formatList: [],
      format: [],
      depotList: [],
      shelfList: [],
      locationList: [],
      customizeList: [],
      sizeData: [],
      colorData: [],
      configList: [],
      sizeLayoutData: [],
      colorLayoutData: [],
      customizeDetail: [],
      customizeData: '',
      supplierData: [],
      markupList: [],
      typeId: ''
    }
  },
  created () {},
  mounted () {
    this.getPropertyAll()
    this.getType()
    this.getUnit()
    this.getShelfAll()
    this.getLocationfAll()
    this.getSupplierList()
    this.goodsId = this.$route.query.id
    if (this.goodsId > 0) {
      this.getItemData()
    }
    this.context = this
  },
  computed: {},
  methods: {
    // 获取单条数据
    getItemData () {
      this.$store
        .dispatch('clothingArchives/getItemData', this.goodsId)
        .then((res) => {
          if (res.code == 200) {
            this.dataForm = res.data.goodsItem
            this.archives = res.data.archives
            this.dataForm.id = this.goodsId
            if (res.data.goodsItem.ca_format_id > 0) {
              this.showFormatData()
            }
            if (res.data.newSpeListArray) {
              this.tableData = res.data.newSpeListArray
              this.$nextTick(() => {
                this.showSpeList()
              })
            }

            if (res.data.customizeLinkData) {
              this.customizeDetail = res.data.customizeLinkData
              this.reschConfig()
            }
          }
        })
        .catch((error) => {})
    },
    showSpeList () {
      if (this.sizeData.length > 0) {
        this.sizeData.forEach((index) => {
          this.tableData.forEach((item) => {
            if (index.id == item.cad_format_size_id) {
              index.status = 1
            }
          })
          if (index.status == 1) {
            this.sizeLayoutData.push(index)
          }
        })
      }
      if (this.colorData.length > 0) {
        this.colorData.forEach((index) => {
          this.tableData.forEach((item) => {
            if (index.id == item.cad_format_color_id) {
              index.status = 1
            }
          })
          if (index.status == 1) {
            this.colorLayoutData.push(index)
          }
        })
      }
    },
    getPropertyAll () {
      this.$store
        .dispatch('clothingArchives/getLists')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.fabricList = res.data.fabric ? res.data.fabric : []
              this.safetyTypeList = res.data.safetytype ? res.data.safetytype : []
              this.brandList = res.data.brand ? res.data.brand : []
              this.yearsList = res.data.years ? res.data.years : []
              this.seasonList = res.data.season ? res.data.season : []
              this.bandList = res.data.band ? res.data.band : []
              this.styleList = res.data.style ? res.data.style : []
              this.seriesList = res.data.series ? res.data.series : []
              this.standardList = res.data.standard ? res.data.standard : []
              this.depotList = res.data.depot ? res.data.depot : []
              this.locationList = res.data.location ? res.data.location : []
              this.priorityList = res.data.priority ? res.data.priority : []
              this.groupList = res.data.group ? res.data.group : []
              this.formatList = res.data.format ? res.data.format : []
              this.configList = res.data.config ? res.data.config : []
              this.customizeList = res.data.customize ? res.data.customize : []
              this.markupList = res.data.markup ? res.data.markup : []
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
    // 获取供应商
    getSupplierList () {
      this.$store
        .dispatch('clothingSupplier/getSupp')
        .then((res) => {
          if (res.code == 200) {
            this.supplierData = res.data ? res.data : []
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
    // 保存
    saveBut () {
      this.$refs.goodsDataRef.validate().then((success) => {
        if (success) {
          this.disabledStatus = true
          const obj = {
            ...this.dataForm,
            archives: this.archives,
            tagData: this.tagData,
            selectRecordsArr: this.tableData, // 规格详细数据
            customizeDetail: this.customizeDetail
          }
          this.$store
            .dispatch('clothingArchives/addData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '添加成功!',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.disabledStatus = false
                this.$router.push({ name: 'clothingArchives' })
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: res.message,
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'red'
                })
                this.disabledStatus = false
              }
            })
            .catch((error) => {
              this.disabledStatus = false
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
      })
    },
    // 获取商品分类
    getType () {
      this.$store
        .dispatch('clothingType/getTreeList')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.typedata = res.data
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

    getUnit () {
      this.$store
        .dispatch('clothingUnit/getUnit')
        .then((res) => {
          if (res.code == 200) {
            this.unitList = res.data
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
    getShelfAll () {
      this.archives.ca_shelf_id = ''
      this.shelfList = []
      this.archives.ca_location_id = ''
      this.locationList = []
      const obj = {
        depot_id: this.archives.ca_depot_id
      }
      this.$store
        .dispatch('clothingShelf/getAllData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.shelfList = res.data ? res.data : []
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
    getLocationfAll () {
      this.archives.ca_location_id = ''
      this.locationList = []
      const obj = {
        depot_id: this.archives.ca_depot_id,
        shelf_id: this.archives.ca_shelf_id
      }
      this.$store
        .dispatch('clothingLocation/getAllData', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.locationList = res.data ? res.data : []
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
    getLocationfItem () {
      this.$store
        .dispatch('clothingLocation/getItemData', this.archives.ca_location_id)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              // this.locationList = res.data ? res.data : []
              this.archives.ca_clothing_location = res.data.depot.cd_code + res.data.shelf.cs_code + res.data.cl_code
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
    // 汉字转拼音，且获取拼音首字母大写
    oneKeyGenerateJianCode () {
      const chinaVal = this.dataForm.goo_name
      if (chinaVal) {
        this.dataForm.goo_nick = chinaVal.substr(0, 6)
        this.dataForm.goo_pinYin = toPinYin
          .convertToPinyinString(chinaVal, '', toPinYin.FIRST_LETTER)
          .toUpperCase()
          .substr(0, 6)
      } else {
        this.$q.notify({
          message: '注意',
          caption: '错误！商品名称未填写！',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
      }
    },
    showFormatData () {
      const that = this
      const datas = that.formatList.find(function (x) {
        return x.id == that.archives.ca_format_id
      })
      this.sizeData = []
      this.colorData = []
      this.tableData = []
      this.sizeLayoutData = []
      this.colorLayoutData = []
      if (datas.sizeItem.length > 0) {
        this.sizeData = datas.sizeItem
      }
      if (datas.colorItem.length > 0) {
        this.colorData = datas.colorItem
      }
    },
    addFormat (val, type) {
      const status = val.status ? val.status : 0
      const sizeLayout = this.sizeLayoutData ? this.sizeLayoutData : []
      const colorLayout = this.colorLayoutData ? this.colorLayoutData : []
      if (status < 1) {
        if (type == 'size') {
          sizeLayout.push(val)
        }
        if (type == 'color') {
          colorLayout.push(val)
        }
        val.status = 1
        this.sizeLayoutData = sizeLayout
        this.colorLayoutData = colorLayout
        this.$nextTick(() => {
          this.refreshSpecificationData()
        })
      } else {
        this.$q
          .dialog({
            title: '确定',
            message: `删除名称为 "${val.cft_name}"规格属性吗？`,
            cancel: true,
            persistent: true
          })
          .onOk(() => {
            val.status = 0
            if (type == 'size') {
              const data = sizeLayout.findIndex(function (x) {
                return x.id == val.id
              })
              if (data > -1) {
                sizeLayout.splice(data, 1)
              }
            }
            if (type == 'color') {
              const data = colorLayout.findIndex(function (x) {
                return x.id == val.id
              })
              if (data > -1) {
                colorLayout.splice(data, 1)
              }
            }
            this.$nextTick(() => {
              this.refreshSpecificationData()
            })
          })
      }
    },
    refreshSpecificationData () {
      const specificationArray = []
      if (this.sizeLayoutData.length > 0) {
        const sizeLayout = this.sizeLayoutData
        const colorLayout = this.colorLayoutData
        // 循环第一个数组
        sizeLayout.forEach((item) => {
          if (colorLayout.length > 0) {
            this.colorLayoutData.forEach((i) => {
              const skcCode = this.groupCode(item.id, i.id)
              console.log('skcCode1', skcCode)
              specificationArray.push({
                cad_format_size_id: item.id,
                cad_size_name: item.cft_name,
                cad_format_color_id: i.id,
                cad_color_name: i.cft_name,
                cad_skc_code: this.archives.ca_article_code + skcCode,
                cad_type: item.cft_type,
                cad_price: this.dataForm.goo_price
              })
            })
          } else {
            const skcCode = this.groupCode(item.id)
            console.log('skcCode2', skcCode)
            specificationArray.push({
              cad_format_size_id: item.id,
              cad_size_name: item.cft_name,
              cad_skc_code: this.archives.ca_article_code + skcCode,
              cad_type: item.cft_type,
              cad_price: this.dataForm.goo_price
            })
          }
        })
      } else {
        if (this.colorLayoutData.length > 0) {
          this.colorLayoutData.forEach((i) => {
            const skcCode = this.groupCode(null, i.id)
            console.log('skcCode3', skcCode)
            specificationArray.push({
              cad_format_color_id: i.id,
              cad_color_name: i.cft_name,
              cad_skc_code: this.archives.ca_article_code + skcCode,
              cad_type: i.cft_type,
              cad_price: this.dataForm.goo_price
            })
          })
        }
      }
      this.$nextTick(() => {
        this.tableData = specificationArray
      })
    },
    getImageData (v) {
      this.uploadImgStatus = false
      const that = this
      const caLoopImage = []
      if (that.multiple) {
        _(v).forEach(function (value, k) {
          if (k <= 4) {
            caLoopImage.push(value.path)
          }
        })
        that.dataForm.goo_loop_image = caLoopImage
      } else {
        that.dataForm.goo_cover_image = v[0].path
      }
    },
    closeUpload (v) {
      this.uploadImgStatus = false
    },
    clickImage () {
      this.multiple = false
      this.$nextTick(() => {
        this.uploadImgStatus = true
      })
    },
    delImage () {
      this.dataForm.goo_cover_image = ''
    },
    delLoopImage (key) {
      setTimeout(() => {
        this.dataForm.goo_loop_image.splice(key, 1)
      }, 100)
    },
    uplodMultipleImgSubmit () {
      this.multiple = true
      this.$nextTick(() => {
        this.uploadImgStatus = true
      })
    },
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
    getTag (val) {
      if (val) {
        this.tagData = val
      }
    },
    groupCode (sizeId, colorId) {
      const that = this
      let code = ''
      if (this.configList.length > 0) {
        this.configList.forEach((value, index) => {
          const configType = value.cc_type
          if (configType == 'type') {
            if (that.typeId > 0) {
              const data = that.typedata.find(function (x) {
                return x.id == that.typeId
              })
              code += data.gt_code
            }
          }
          if (configType == 'size') {
            if (sizeId > 0) {
              const data = that.sizeLayoutData.find(function (x) {
                return x.id == sizeId
              })
              code += data.cft_code
            }
          }
          if (configType == 'color') {
            if (colorId > 0) {
              const data = that.colorLayoutData.find(function (x) {
                return x.id == colorId
              })
              code += data.cft_code
            }
          }
          if (configType == 'brand') {
            if (that.archives.ca_brand_id > 0) {
              const data = that.brandList.find(function (x) {
                return x.id == that.archives.ca_brand_id
              })
              code += data.cp_code
            }
          }
          if (configType == 'years') {
            if (that.archives.ca_years_id > 0) {
              const data = that.yearsList.find(function (x) {
                return x.id == that.archives.ca_years_id
              })
              code += data.cp_code
            }
          }
          if (configType == 'season') {
            if (that.archives.ca_season_id > 0) {
              const data = that.seasonList.find(function (x) {
                return x.id == that.archives.ca_season_id
              })
              code += data.cp_code
            }
          }
          if (configType == 'band') {
            if (that.archives.ca_band_id > 0) {
              const data = that.bandList.find(function (x) {
                return x.id == that.archives.ca_band_id
              })
              code += data.cp_code
            }
          }
          if (configType == 'series') {
            if (that.archives.ca_series_id > 0) {
              const data = that.seriesList.find(function (x) {
                return x.id == that.archives.ca_series_id
              })
              code += data.cp_code
            }
          }
          if (configType == 'style') {
            if (that.archives.ca_style_id > 0) {
              const data = that.styleList.find(function (x) {
                return x.id == that.archives.ca_style_id
              })
              code += data.cp_code
            }
          }
        })
      } else {
        if (sizeId > 0) {
          const data = that.sizeLayoutData.find(function (x) {
            return x.id == sizeId
          })
          code += data.cft_code
        }

        if (colorId > 0) {
          const data = that.colorLayoutData.find(function (x) {
            return x.id == colorId
          })
          code += data.cft_code
        }
      }
      return code
    },
    addCustomize () {
      const customiz = this.customizeData
      if (customiz) {
        this.customizeDetail.push(customiz)
        this.customizeData = null
      }
      this.$nextTick(() => {
        this.reschConfig()
      })
    },
    reschConfig () {
      this.customizeDetail.forEach((value, index) => {
        const data = this.customizeList.findIndex(function (x) {
          return x.id == value.id
        })
        if (data > -1) {
          this.customizeList.splice(data, 1)
        }
      })
    },
    deleteCustomize (item, mainKey) {
      this.$q
        .dialog({
          title: '确定',
          message: `删除名称为 "${item.cc_name}"自定义属性吗？`,
          cancel: true,
          persistent: true
        })
        .onOk(() => {
          this.customizeList.push(item)
          setTimeout(() => {
            this.customizeDetail.splice(mainKey, 1)
          }, 100)
        })
    },
    changeGoodsType (item) {
      this.dataForm.goodsTypeId = item.id
    }
  }
}
</script>
