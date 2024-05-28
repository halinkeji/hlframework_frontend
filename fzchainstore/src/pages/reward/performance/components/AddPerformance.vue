<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll bg-grey-3">
      <div class="col-shrink bg-white q-px-xs q-pb-md q-pt-sm text-subtitle2">
        <q-icon name="las la-square-full" class="text-primary q-mr-sm" />
        提成方案{{ $route.query.id > 0 ? '编辑' : '新增' }}
      </div>
      <div class="col-shrink full-height bg-white q-pa-sm q-mt-xs">
        <q-scroll-area class="fit full-height">
          <q-form ref="configDataRef">
            <q-card flat bordered square class="rounded-borders q-mt-xs q-pa-sm">
              <div class="q-pa-xs">
                <div class="text-subtitle2">基本信息</div>
              </div>
              <q-separator />
              <div class="row q-mt-sm">
                <div class="col-4 q-px-lg">
                  <q-input
                    v-model="dataForm.prp_name"
                    outlined
                    bottom-slots
                    dense
                    label="提成名称*"
                    :rules="[(val) => !!val || '提成名称是必填项']"
                  ></q-input>
                </div>
                <div class="col-md-4 col-12 q-px-lg">
                  <q-input
                    v-model="dataForm.prp_number"
                    outlined
                    bottom-slots
                    dense
                    label="方案编号"
                    readonly
                    :rules="[(val) => !!val || '方案编号是必填项']"
                  >
                    <template v-slot:after>
                      <q-btn unelevated color="blue-6" @click="oneKeyGenerateCode()" label="一键生成方案编号" />
                    </template>
                  </q-input>
                </div>
                <div class="col-md-4 col-12 q-px-lg">
                  <q-select
                    outlined
                    v-model="dataForm.prp_status"
                    map-options
                    emit-value
                    dense
                    option-label="label"
                    option-value="value"
                    :options="[
                      {
                        label: '开启',
                        value: '1',
                      },
                      {
                        label: '关闭',
                        value: '0',
                      },
                    ]"
                    :rules="[(val) => !!val || '状态是必填项']"
                    label="方案状态"
                  />
                </div>
              </div>
            </q-card>

            <q-card flat bordered square class="rounded-borders q-mt-xs q-pa-sm">
              <div class="q-pa-xs">
                <div class="text-subtitle2">提成设置</div>
              </div>
              <q-separator />
              <div class="row q-col-gutter-x-xs q-col-gutter-y-lg q-mt-sm text-center q-pl-lg">
                <span>参与提成设置：</span>
                <q-checkbox v-model="dataForm.prp_if_promotion" label="促销商品不参与提成" true-value="1" dense false-value="0" />
                <q-checkbox v-model="dataForm.prp_if_member_price" label="会员价商品不参与提成" true-value="1" dense false-value="0" />
                <q-checkbox v-model="dataForm.prp_if_discount" label="打折或议价商品不参与提成" true-value="1" dense false-value="0" />
                <q-input
                  class="q-mx-sm col-3"
                  v-if="dataForm.prp_if_discount == '1'"
                  v-model="dataForm.prp_discount_limit"
                  outlined
                  bottom-slots
                  dense
                  label="折扣率"
                  placeholder="请输入折扣率"
                  lazy-rules
                  :rules="[
                    (val) => (val > -1 && val <= 100) || '请输入正确的折扣率格式',
                    (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的折扣率格式',
                  ]"
                >
                  <template v-slot:hint> 折扣率低于此值不参与提成 </template>
                  <template slot="append">%</template>
                </q-input>
              </div>
              <q-separator class="q-my-sm" />
              <div class="row q-col-gutter-x-xs q-col-gutter-y-lg text-center q-pl-lg">
                <span>模式选择：</span>
                <q-radio dense v-model="dataForm.prp_model" val="1" label="统提均分" />
                <q-radio dense v-model="dataForm.prp_model" val="2" label="阶段" @input="changScopeModel" />
              </div>
              <q-separator class="q-my-sm" />
              <div class="row q-col-gutter-x-xs q-col-gutter-y-lg text-center q-pl-lg">
                <span>提成范围：</span>
                <q-radio dense v-model="dataForm.prp_type" val="5" @input="changScope(5)" label="全部" />
                <q-radio dense v-model="dataForm.prp_type" val="1" @input="changScope(1)" label="商品" />
                <q-radio dense v-model="dataForm.prp_type" val="2" @input="changScope(2)" label="类别" />
                <q-radio dense v-model="dataForm.prp_type" val="3" @input="changScope(3)" label="品牌" />
                <q-radio dense v-model="dataForm.prp_type" val="4" @input="changScope(4)" label="综合" />
              </div>
            </q-card>
            <q-card flat bordered square class="rounded-borders q-mt-xs q-pa-sm">
              <div class="text-h6 q-pa-xs q-pl-lg">提成明细</div>
              <q-separator />
              <div v-if="dataForm.prp_type == '1' || dataForm.prp_type == '4'">
                <div class="q-gutter-x-xs row q-mt-sm">
                  <q-btn color="primary" class="q-ma-sm" @click="selectBut" unelevated label="选择商品" />
                  <q-btn
                    :disabled="dataListSelections.length > 0 ? false : true"
                    @click="delGoodsRow"
                    color="red"
                    class="q-ma-sm"
                    unelevated
                    label="批量删除"
                  />
                </div>
                <div class="col-shrink q-px-xs q-py-none bg-grey-2" style="height: 400px; min-height: 400px">
                  <ag-grid-vue
                    ref="agGridTable"
                    :gridOptions="gridOptions"
                    class="ag-theme-balham ag-grid-table hl_header_center hl_content_center full-height goods-select-table"
                    :columnDefs="columnDefs"
                    :suppressMovableColumns="true"
                    :rowData="goodsData"
                    rowSelection="multiple"
                    @first-data-rendered="onFirstDataRendered"
                    rowHeight="40"
                    :rowDragManaged="true"
                    colResizeDefault="shift"
                    :animateRows="false"
                    :floatingFilter="false"
                    :enableCharts="true"
                    :enableRangeSelection="true"
                    :enableCellTextSelection="true"
                    :suppressRowTransform="true"
                    :suppressCellSelection="true"
                    :suppressRowClickSelection="true"
                    :rowMultiSelectWithClick="true"
                    :singleClickEdit="true"
                    :stopEditingWhenGridLosesFocus="true"
                    :localeText="localeText"
                    :context="context"
                    @rowSelected="rowSelectedAg"
                    @gridReady="onFirstDataRendered"
                  ></ag-grid-vue>
                </div>
                <hl-goods-table
                  ref="specificationTree"
                  rowSelection="multiple"
                  v-if="showGoodsList"
                  @getSelectedGoodsData="getSelectedGoodsData"
                  @closeDialog="showGoodsList = false"
                ></hl-goods-table>
              </div>
              <div class="row q-py-lg q-px-md q-col-gutter-md" v-if="dataForm.prp_type == '2' || dataForm.prp_type == '4'">
                <div class="col-md-12 row q-py-lg q-col-gutter-md">
                  <div class="col-md-5 col-12 q-pt-none">
                    <q-select outlined dense v-model="type" :options="typeData" option-label="gt_name" label="选择商品分类" />
                  </div>
                  <div class="col-md-2 col-12 q-pt-none">
                    <q-btn-group unelevated>
                      <q-btn color="primary" label="添加明细" @click="addTypeDiscounts" unelevated icon="las la-plus-square" />
                    </q-btn-group>
                  </div>
                </div>
                <div class="col-md-12 col-12 q-pt-none">
                  <div class="row" v-for="(item, normIndex) in typeInfoData" :key="normIndex">
                    <div class="col-md-2 col-12">
                      <q-input
                        v-model="item.rpd_type_name"
                        outlined
                        bottom-slots
                        dense
                        label="分类名称"
                        class="q-mt-md"
                        readonly
                        lazy-rules
                        :rules="[(val) => (val && val.length > 0) || '类别名称']"
                      />
                    </div>
                    <div class="col-md-2 col-12">
                      <div class="q-gutter-sm q-mt-md q-pl-sm">
                        <q-radio dense v-model="item.rpd_type" val="1" label="额度" />
                        <q-radio dense v-model="item.rpd_type" val="2" label="比例" />
                      </div>
                    </div>

                    <div class="col-2" v-if="item.rpd_type == 1">
                      <q-input
                        class="q-mt-md q-mx-sm"
                        v-model="item.rpd_performance_amount"
                        outlined
                        bottom-slots
                        dense
                        label="提成额度"
                        placeholder="请输入提成额度"
                        lazy-rules
                        :rules="[(val) => !!val || '请设置提成额度', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '提成额度为非负两位以内小数']"
                      >
                        <template v-slot:append> 元</template>
                      </q-input>
                    </div>
                    <div class="col-2" v-if="item.rpd_type == 2">
                      <q-input
                        class="q-mt-md q-mx-sm"
                        v-model="item.rpd_performance_proportion"
                        outlined
                        bottom-slots
                        dense
                        label="提成比例"
                        placeholder="请输入提成比例"
                        lazy-rules
                        :rules="[
                          (val) => (val > -1 && val <= 100) || '请输入正确的提成比例格式',
                          (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的提成比例格式',
                        ]"
                      >
                      </q-input>
                    </div>
                    <q-input
                      outlined
                      dense
                      label="完成率范围"
                      class="col-md-2 col-12 q-mt-md q-mx-sm"
                      :rules="[(val) => !!val || '必填项', , (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的业绩范围']"
                      v-model="item.rpd_min_amount"
                      placeholder="请输入业绩范围"
                    >
                      <!-- <template slot="append"
                        ><span class="text-h6">{{
                          $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit
                        }}</span></template
                      > -->
                    </q-input>
                    <div class="text-h6 q-mx-sm q-mt-md q-mx-sm">-</div>
                    <q-input
                      outlined
                      dense
                      class="col-md-2 col-12 q-mt-md q-mx-sm"
                      label="完成率范围"
                      :rules="[(val) => !!val || '必填项', , (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的业绩范围']"
                      v-model="item.rpd_max_amount"
                      placeholder="请输入业绩范围"
                    >
                      <!-- <template slot="append"
                        ><span class="text-h6">{{
                          $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit
                        }}</span></template
                      > -->
                    </q-input>
                    <div class="col-md-1">
                      <div class="q-pl-none q-mt-lg">
                        <q-icon @click="addSpecification(item)" color="primary" class="text-h5" name="las la-plus-square">
                          <q-tooltip> 添加阶段 </q-tooltip></q-icon
                        >
                        <q-icon @click="deleteType(normIndex)" color="red" class="text-h5" name="delete"> <q-tooltip> 删除阶段 </q-tooltip></q-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row q-py-lg q-px-md q-col-gutter-md" v-if="dataForm.prp_type == '3' || dataForm.prp_type == '4'">
                <div class="col-md-12 row q-py-lg q-col-gutter-md">
                  <div class="col-md-5 col-12 q-pt-none">
                    <q-select outlined dense v-model="brand" :options="brandData" option-label="cp_name" label="选择品牌" />
                  </div>
                  <div class="col-md-4 col-12 q-pt-none">
                    <q-btn-group unelevated>
                      <q-btn color="primary" label="添加明细" @click="addBrandDiscounts" unelevated icon="las la-plus-square" />
                    </q-btn-group>
                  </div>
                </div>

                <div class="col-md-12 col-12 q-pt-none">
                  <div class="row" v-for="(item, normIndex) in detailData" :key="normIndex">
                    <div class="col-md-2 col-12">
                      <q-input
                        v-model="item.rpd_brand_name"
                        outlined
                        bottom-slots
                        dense
                        label="品牌名称"
                        class="q-mt-md"
                        readonly
                        lazy-rules
                        :rules="[(val) => (val && val.length > 0) || '品牌名称']"
                      />
                    </div>
                    <div class="col-md-2 col-12">
                      <div class="q-gutter-sm q-mt-md q-pl-sm">
                        <q-radio dense v-model="item.rpd_type" val="1" label="额度" />
                        <q-radio dense v-model="item.rpd_type" val="2" label="比例" />
                      </div>
                    </div>

                    <div class="col-2" v-if="item.rpd_type == 1">
                      <q-input
                        class="q-mt-md q-mx-sm"
                        v-model="item.rpd_performance_amount"
                        outlined
                        bottom-slots
                        dense
                        label="提成额度"
                        placeholder="请输入提成额度"
                        lazy-rules
                        :rules="[(val) => !!val || '请设置提成额度', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '提成额度为非负两位以内小数']"
                      >
                        <template v-slot:append> 元</template>
                      </q-input>
                    </div>
                    <div class="col-2" v-if="item.rpd_type == 2">
                      <q-input
                        class="q-mt-md q-mx-sm"
                        v-model="item.rpd_performance_proportion"
                        outlined
                        bottom-slots
                        dense
                        label="提成比例"
                        placeholder="请输入提成比例"
                        lazy-rules
                        :rules="[
                          (val) => (val > -1 && val <= 100) || '请输入正确的提成比例格式',
                          (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的提成比例格式',
                        ]"
                      >
                      </q-input>
                    </div>
                    <q-input
                      outlined
                      dense
                      label="完成率范围"
                      class="col-md-2 col-12 q-mt-md q-mx-sm"
                      :rules="[(val) => !!val || '必填项', , (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的业绩范围']"
                      v-model="item.rpd_min_amount"
                      placeholder="请输入业绩范围"
                    >
                      <!-- <template slot="append"
                        ><span class="text-h6">{{
                          $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit
                        }}</span></template
                      > -->
                    </q-input>
                    <div class="text-h6 q-mx-sm q-mt-md q-mx-sm">-</div>
                    <q-input
                      outlined
                      dense
                      class="col-md-2 col-12 q-mt-md q-mx-sm"
                      label="完成率范围"
                      :rules="[(val) => !!val || '必填项', , (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的业绩范围']"
                      v-model="item.rpd_max_amount"
                      placeholder="请输入业绩范围"
                    >
                      <!-- <template slot="append"
                        ><span class="text-h6">{{
                          $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneyUnit
                        }}</span></template
                      > -->
                    </q-input>
                    <div class="col-md-1">
                      <div class="q-pl-none q-mt-lg">
                        <q-icon @click="addBrandSpecification(item)" color="primary" class="text-h5" name="las la-plus-square">
                          <q-tooltip> 添加阶段 </q-tooltip></q-icon
                        >
                        <q-icon @click="deleteSpecification(normIndex)" color="red" class="text-h5" name="delete">
                          <q-tooltip> 删除阶段 </q-tooltip></q-icon
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row q-py-lg q-px-md q-col-gutter-md" v-if="dataForm.prp_type == '5'">
                <div class="col-md-12 col-12 q-pt-none">
                  <div class="row" v-for="(item, normIndex) in detailData" :key="normIndex">
                    <div class="col-md-2 col-12">
                      <div class="q-gutter-sm q-mt-md q-pl-sm">
                        <q-radio dense v-model="item.rpd_type" val="1" label="额度" />
                        <q-radio dense v-model="item.rpd_type" val="2" label="比例" />
                      </div>
                    </div>

                    <div class="col-2" v-if="item.rpd_type == 1">
                      <q-input
                        class="q-mt-md q-mx-sm"
                        v-model="item.rpd_performance_amount"
                        outlined
                        bottom-slots
                        dense
                        label="提成额度"
                        placeholder="请输入提成额度"
                        lazy-rules
                        :rules="[(val) => !!val || '请设置提成额度', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '提成额度为非负两位以内小数']"
                      >
                        <template v-slot:append> 元</template>
                      </q-input>
                    </div>
                    <div class="col-2" v-if="item.rpd_type == 2">
                      <q-input
                        class="q-mt-md q-mx-sm"
                        v-model="item.rpd_performance_proportion"
                        outlined
                        bottom-slots
                        dense
                        label="提成比例"
                        placeholder="请输入提成比例"
                        lazy-rules
                        :rules="[
                          (val) => (val > -1 && val <= 100) || '请输入正确的提成比例格式',
                          (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的提成比例格式',
                        ]"
                      >
                      </q-input>
                    </div>
                    <q-input
                      outlined
                      dense
                      label="完成率范围"
                      class="col-md-2 col-12 q-mt-md q-mx-sm"
                      :rules="[(val) => !!val || '必填项', , (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的业绩范围']"
                      v-model="item.rpd_min_amount"
                      placeholder="请输入业绩范围"
                    >
                    </q-input>
                    <div class="text-h6 q-mx-sm q-mt-md q-mx-sm">-</div>
                    <q-input
                      outlined
                      dense
                      class="col-md-2 col-12 q-mt-md q-mx-sm"
                      label="完成率范围"
                      :rules="[(val) => !!val || '必填项', , (val) => /^[0-9]+([.]\d{1,2})?$/.test(val) || '请输入正确的业绩范围']"
                      v-model="item.rpd_max_amount"
                      placeholder="请输入业绩范围"
                    >
                    </q-input>
                    <div class="col-md-1">
                      <div class="q-pl-none q-mt-lg">
                        <q-icon @click="addBrandSpecification(item)" color="primary" class="text-h5" name="las la-plus-square">
                          <q-tooltip> 添加阶段 </q-tooltip></q-icon
                        >
                        <q-icon @click="deleteSpecification(normIndex)" color="red" class="text-h5" name="delete">
                          <q-tooltip> 删除阶段 </q-tooltip></q-icon
                        >
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </q-card>
          </q-form>
        </q-scroll-area>
      </div>
      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs">
        <q-btn unelevated :disable="btnDisable" v-if="authorityMeta('save')" label="保存" @click="saveData()" color="primary" class="q-px-xl" />
        <q-btn unelevated label="返回" type="reset" color="grey" class="q-px-xl" :to="{ name: 'performance' }" />
      </div>
    </div>
  </q-page>
</template>

<script>
import AgTimeSelect from './AgTimeSelect.vue'
export default {
  name: 'AddPerformance',
  components: {
    AgTimeSelect
  },
  data () {
    return {
      dataId: 0,
      showGoodsList: false,
      dataForm: {
        prp_name: '',
        prp_number: '',
        prp_status: '1',
        prp_type: '5',
        prp_model: '1',
        prp_if_promotion: '0',
        prp_if_member_price: '0',
        prp_if_discount: '0',
        prp_discount_limit: '100'
      },
      detailData: [
        {
          rpd_type: '1',
          rpd_performance_amount: '',
          rpd_performance_proportion: '',
          rpd_min_amount: '',
          rpd_max_amount: ''
        }
      ],

      goodsData: [],
      typeInfoData: [],
      specialGoods: [],

      btnDisable: false,
      libInStoreList: [],
      typeData: [],
      type: '',
      brand: '',
      brandData: [],
      columnDefs: [
        {
          headerName: '',
          field: '',
          headerCheckboxSelectionFilteredOnly: true,
          headerCheckboxSelection: true,
          checkboxSelection: true,
          width: this.nowpx(0.01) + 'px'
        },
        {
          headerName: '商品名称',
          field: 'rpd_goods_name',
          filter: false, // 是否过滤
          width: this.nowpx(0.13) + 'px',
          onCellValueChanged: function (p) {
            const itemsToUpdate = []
            const data = p.data
            data.rpd_goods_name = Math.floor(Math.random() * 20000 + 20000)
            itemsToUpdate.push(data)
            const res = p.api.applyTransaction({ update: itemsToUpdate })
          }
        },
        {
          headerName: '提成类型',
          field: 'rpd_type',
          filter: false,
          cellRendererFramework: 'AgTimeSelect',
          width: this.nowpx(0.1) + 'px'
        },
        {
          headerName: '提成额度',
          field: 'rpd_performance_amount',
          filter: false,
          editable: (p) => {
            return p.data.rpd_type == 1
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.06) + 'px'
        },
        {
          headerName: '提成比例',
          field: 'rpd_performance_proportion',
          filter: false,
          editable: (p) => {
            return p.data.rpd_type == '2'
          },
          singleClickEdit: true,
          onCellValueChanged: this.changeNumber,
          width: this.nowpx(0.06) + 'px'
        }
      ],
      dataListSelections: [],
      context: '',
      localeText: this.$ag_grid_localeText,
      gridOptions: {}
    }
  },
  watch: {
    'dataForm.prp_type' (val) {
      this.getBrand()
      this.getType()
      if ((parseInt(val) == 1 || parseInt(val) == 4) && dataId < 1) {
        setTimeout(() => {
          this.restColumnData()
        }, 100)
      }
    },
    'dataForm.prp_model' (val) {
      if ((this.dataForm.prp_type == '1' || this.dataForm.prp_type == '4') && dataId < 1) {
        setTimeout(() => {
          this.restColumnData()
        }, 100)
      }
    }
  },

  mounted () {
    this.getBrand()
    this.getType()
  },
  computed: {},
  created () {
    if (this.$route.query.id) {
      this.getItem(this.$route.query.id)
    }
    this.getLibInStoreData()
  },
  methods: {
    getType () {
      this.$store
        .dispatch('clothingType/getTypeslistData')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.typeData = res.data
              this.reschType()
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
    reschType () {
      this.typeInfoData.forEach((value, index) => {
        const data = this.typeData.findIndex(function (x) {
          return x.id == value.rpd_type_id
        })
        if (data > -1) {
          this.typeData.splice(data, 1)
        }
      })
    },
    getBrand () {
      const obj = {
        type: 'brand',
        status: 1
      }
      this.$store
        .dispatch('clothingProperty/getPropertyList', obj)
        .then((res) => {
          if (res.code == 200) {
            this.brandData = res.data ? res.data : []
            this.reschBrand()
          }
        })
        .catch((error) => {})
    },
    reschBrand () {
      this.typeInfoData.forEach((value, index) => {
        const data = this.brandData.findIndex(function (x) {
          return x.id == value.ppd_brand_id
        })
        if (data > -1) {
          this.brandData.splice(data, 1)
        }
      })
    },
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getItem (val) {
      if (val > 0) {
        this.dataId = this.$route.query.id
        this.$store.dispatch('rewardPerformance/getItem', val).then((res) => {
          if (res.code == 200) {
            this.dataForm = res.data ? res.data : {}
            if (this.dataForm.prp_type == '1') {
              this.goodsData = res.data.detail
            }
            if (this.dataForm.prp_type == '2') {
              this.typeInfoData = res.data.detail
            }
            if (this.dataForm.prp_type == '3') {
              this.detailData = res.data.detail
            }
            if (this.dataForm.prp_type == '5') {
              this.detailData = res.data.detail
            }
            if (this.dataForm.prp_type == '4' && res.data.detail.length > 0) {
              res.data.detail.forEach((value, index) => {
                if (value.rpd_type_scope == '1') {
                  this.goodsData.push(value)
                }
                if (value.rpd_type_scope == '2') {
                  this.typeInfoData.push(value)
                }
                if (value.rpd_type_scope == '3') {
                  this.detailData.push(value)
                }
              })
              console.log('abc', this.goodsData)

              setTimeout(() => {
                this.editColumnData(this.goodsData)
              }, 500)
            }
            if (this.dataForm.prp_type == '1') {
              setTimeout(() => {
                this.editColumnData(this.goodsData)
              }, 500)
            }
          }
        })
      }
    },
    changScope (val) {
      if (parseInt(val) == 1) {
        if (this.dataForm.ppi_discounts_model == '1') {
          if (this.dataForm.ppi_discounts_type == '1') {
            this.detailData = [
              {
                ppd_discounts: '',
                ppd_meet_amount: '',
                ppd_meet_number: ''
              }
            ]
          }
        }
        if (this.dataForm.ppi_discounts_model == '2') {
          if (this.dataForm.ppi_discounts_type == '1' || this.dataForm.ppi_discounts_type == '3') {
            this.detailData = [
              {
                ppd_discounts: '',
                ppd_meet_amount: '',
                ppd_meet_number: ''
              }
            ]
          }
        }
      }
      if (parseInt(val) == 2 || parseInt(val) == 3) {
        setTimeout(() => {
          this.detailData = []
          this.getBrand()
          this.getType()
        }, 100)
      }
      if (parseInt(val) == 4) {
        setTimeout(() => {
          this.restColumnData()
        }, 100)
      }
      if (parseInt(val) == 5) {
        setTimeout(() => {
          this.goodsData = []
          this.detailData = [
            {
              rpd_type: '1',
              rpd_performance_amount: '',
              rpd_performance_proportion: '',
              rpd_min_amount: '',
              rpd_max_amount: ''
            }
          ]
        }, 100)
      }
    },

    changScopeModel () {
      if (this.dataForm.prp_type == '1 ' && this.dataForm.prp_model == '2') {
        setTimeout(() => {
          this.restColumnData()
        }, 100)
      }
    },
    restColumnData () {
      this.goodsData = []
      this.gridOptions.api.setColumnDefs([])
      if (this.dataForm.prp_type == '1' || this.dataForm.prp_type == '4') {
        var columnData = [
          {
            headerName: '',
            field: '',
            headerCheckboxSelectionFilteredOnly: true,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: this.nowpx(0.01) + 'px'
          },
          {
            headerName: '商品名称',
            field: 'rpd_goods_name',
            filter: false, // 是否过滤
            width: this.nowpx(0.13) + 'px',
            onCellValueChanged: function (p) {
              const itemsToUpdate = []
              const data = p.data
              data.rpd_goods_name = Math.floor(Math.random() * 20000 + 20000)
              itemsToUpdate.push(data)
              const res = p.api.applyTransaction({ update: itemsToUpdate })
            },
            rowSpan: this.rowSpan,
            cellClassRules: {
              'cell-span-goods-select': function (p) {
                if (p.value) {
                  return true
                }
              }
            }
          },
          {
            headerName: '提成类型',
            field: 'rpd_type',
            filter: false,
            cellRendererFramework: 'AgTimeSelect',
            width: this.nowpx(0.1) + 'px'
          },

          {
            headerName: '提成额度',
            field: 'rpd_performance_amount',
            filter: false,
            editable: (p) => {
              return p.data.rpd_type == 1
            },
            singleClickEdit: true,
            onCellValueChanged: this.changeNumber,
            width: this.nowpx(0.06) + 'px'
          },
          {
            headerName: '提成比例',
            field: 'rpd_performance_proportion',
            filter: false,
            editable: (p) => {
              return p.data.rpd_type == '2'
            },
            singleClickEdit: true,
            onCellValueChanged: this.changeNumber,
            width: this.nowpx(0.06) + 'px'
          },
          {
            headerName: '业绩范围',
            field: 'rpd_min_amount',
            filter: false,
            editable: true,
            singleClickEdit: true,
            onCellValueChanged: this.changeNumber,
            width: this.nowpx(0.06) + 'px'
          },
          {
            headerName: '业绩范围',
            field: 'rpd_max_amount',
            filter: false,
            editable: true,
            singleClickEdit: true,
            onCellValueChanged: this.changeNumber,
            width: this.nowpx(0.06) + 'px'
          }
        ]
      }
      this.gridOptions.api.setColumnDefs(columnData)
      this.gridOptions.api.sizeColumnsToFit()
    },
    editColumnData (data) {
      this.gridOptions.api.setColumnDefs([])
      if (this.dataForm.prp_type == '1' || this.dataForm.prp_type == '4') {
        var columnData = [
          {
            headerName: '',
            field: '',
            headerCheckboxSelectionFilteredOnly: true,
            headerCheckboxSelection: true,
            checkboxSelection: true,
            width: this.nowpx(0.01) + 'px'
          },
          {
            headerName: '商品名称',
            field: 'rpd_goods_name',
            filter: false, // 是否过滤
            width: this.nowpx(0.13) + 'px',
            onCellValueChanged: function (p) {
              const itemsToUpdate = []
              const data = p.data
              data.rpd_goods_name = Math.floor(Math.random() * 20000 + 20000)
              itemsToUpdate.push(data)
              const res = p.api.applyTransaction({ update: itemsToUpdate })
            },
            rowSpan: this.rowSpan,
            cellClassRules: {
              'cell-span-goods-select': function (p) {
                if (p.value) {
                  return true
                }
              }
            }
          },
          {
            headerName: '提成类型',
            field: 'rpd_type',
            filter: false,
            cellRendererFramework: 'AgTimeSelect',
            width: this.nowpx(0.1) + 'px'
          },

          {
            headerName: '提成额度',
            field: 'rpd_performance_amount',
            filter: false,
            editable: (p) => {
              return p.data.rpd_type == 1
            },
            singleClickEdit: true,
            onCellValueChanged: this.changeNumber,
            width: this.nowpx(0.06) + 'px'
          },
          {
            headerName: '提成比例',
            field: 'rpd_performance_proportion',
            filter: false,
            editable: (p) => {
              return p.data.rpd_type == '2'
            },
            singleClickEdit: true,
            onCellValueChanged: this.changeNumber,
            width: this.nowpx(0.06) + 'px'
          },
          {
            headerName: '业绩范围',
            field: 'rpd_min_amount',
            filter: false,
            editable: true,
            singleClickEdit: true,
            onCellValueChanged: this.changeNumber,
            width: this.nowpx(0.06) + 'px'
          },
          {
            headerName: '业绩范围',
            field: 'rpd_max_amount',
            filter: false,
            editable: true,
            singleClickEdit: true,
            onCellValueChanged: this.changeNumber,
            width: this.nowpx(0.06) + 'px'
          }
        ]
      }
      this.gridOptions.api.setColumnDefs(columnData)
      this.gridOptions.api.sizeColumnsToFit()
      this.gridOptions.api.redrawRows()
      this.goodsData = data
    },
    rowSpan (params) {
      const fields = ['rpd_goods_name']
      const data = this.goodsData
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
    delGoodsRow () {
      const selRows = this.gridOptions.api.getSelectedNodes() // 获取选中的行
      if (selRows.length > 0) {
        const obj = selRows.map((item) => {
          return item.childIndex
        })
        this.goodsData.splice(obj, 1)
      }
      this.dataListSelections = []
    },
    saveData () {
      this.$refs.configDataRef.validate().then((success) => {
        if (success) {
          this.btnDisable = true
          if (this.dataForm.prp_type == '1') {
            var detailData = this.goodsData
          }
          if (this.dataForm.prp_type == '2') {
            var detailData = this.typeInfoData
          }
          if (this.dataForm.prp_type == '4') {
            const goodsData = this.detailData.concat(this.goodsData)
            var detailData = goodsData.concat(this.typeInfoData)
          }
          if (this.dataForm.prp_type == '5') {
            var detailData = this.detailData
          }
          const obj = {
            ...this.dataForm,
            id: this.dataId,
            detailData: detailData
          }
          this.$store
            .dispatch('rewardPerformance/setData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: `${this.dataId > 0 ? '修改' : '新增'}提成方案`,
                  icon: 'ion-checkmark-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  color: 'green'
                })
                this.btnDisable = false
                this.$router.push({ name: 'performance' })
              } else {
                this.$q.notify({
                  message: '失败',
                  icon: 'ion-close-circle-outline',
                  timeout: 500,
                  position: 'top-right',
                  caption: res.message,
                  color: 'red'
                })
                this.btnDisable = false
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
              this.btnDisable = false
            })
        }
      })
    },
    oneKeyGenerateCode () {
      const Rand = Math.random()
      const mineId = Math.round(Rand * 100000000)
      const newDate = this.$q_date.formatDate(new Date(), 'YYYYMMDDHHmm')
      this.dataForm.prp_number = 'TCFA-' + newDate + mineId
    },
    // 添加
    addSpecification (item) {
      const layoutArray = this.typeInfoData
      const newlayout = {
        rpd_type: '1',
        rpd_type_scope: '2',
        rpd_min_amount: '',
        rpd_max_amount: '',
        rpd_performance_proportion: '',
        rpd_performance_amount: '',
        rpd_type_id: item.rpd_type_id,
        rpd_type_name: item.rpd_type_name
      }
      layoutArray.push(newlayout)
    },
    addTypeDiscounts () {
      const type = this.type
      if (type) {
        const layoutArray = this.typeInfoData
        const newlayout = {
          rpd_type: '1',
          rpd_type_scope: '2',
          rpd_min_amount: '',
          rpd_max_amount: '',
          rpd_performance_proportion: '',
          rpd_performance_amount: '',
          rpd_type_id: type.id,
          rpd_type_name: type.gt_name
        }
        layoutArray.push(newlayout)
        this.type = null
      }
      // this.reschConfig();
    },
    reschConfig () {
      this.typeInfoData.forEach((value, index) => {
        const data = this.typeData.findIndex(function (x) {
          return x.id == value.rpd_type_id
        })
        if (data > -1) {
          this.typeData.splice(data, 1)
        }
      })
    },
    addBrandSpecification (item) {
      const layoutArray = this.detailData
      const newlayout = {
        rpd_type: '1',
        rpd_type_scope: '3',
        rpd_min_amount: '',
        rpd_max_amount: '',
        rpd_performance_proportion: '',
        rpd_performance_amount: '',
        rpd_brand_id: item.rpd_brand_id,
        rpd_brand_name: item.rpd_brand_name
      }
      layoutArray.push(newlayout)
    },
    addBrandDiscounts () {
      const brand = this.brand
      if (brand) {
        const layoutArray = this.detailData
        const newlayout = {
          rpd_type: '1',
          rpd_type_scope: '3',
          rpd_min_amount: '',
          rpd_max_amount: '',
          rpd_performance_proportion: '',
          rpd_performance_amount: '',
          rpd_brand_id: brand.id,
          rpd_brand_name: brand.cp_name
        }
        layoutArray.push(newlayout)
        this.brand = null
      }
      // this.reschBrandConfig();
    },
    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    changeNumber (p) {
      const row = p.data
      const itemsToUpdate = []

      const regu2 = /^[0-9]+\.?[0-9]{0,2}$/
      if (row.rpd_performance_amount && !regu2.test(row.rpd_performance_amount)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正两位小数或整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        row.rpd_performance_amount = p.oldValue
      }

      // const regu3 = /^([1-9][0-9]{0,1}|100)$/;
      const regu3 = / ^[0-9]+([.]\d{1,2})?$/
      if (row.rpd_performance_proportion && !regu3.test(row.rpd_performance_proportion)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        row.rpd_performance_proportion = p.oldValue
      }
      const regu4 = /^[0-9]+\.?[0-9]{0,2}$/
      if (row.rpd_min_amount && !regu4.test(row.rpd_min_amount)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正两位小数或整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        row.rpd_min_amount = p.oldValue
      }

      const regu5 = /^[0-9]+\.?[0-9]{0,2}$/
      if (row.rpd_max_amount && !regu5.test(row.rpd_max_amount)) {
        this.$q.notify({
          message: '警告',
          caption: '请输入正两位小数或整数',
          color: 'red',
          icon: 'ion-close-circle-outline',
          timeout: 500,
          position: 'top-right'
        })
        row.rpd_max_amount = p.oldValue
      }

      itemsToUpdate.push(row)
      p.api.applyTransaction({ update: itemsToUpdate })
      if (!p.newValue || p.newValue == p.oldValue) {
        return false
      }
    },
    reschBrandConfig () {
      this.detailData.forEach((value, index) => {
        const data = this.brandData.findIndex(function (x) {
          return x.id == value.ppd_brand_id
        })
        if (data > -1) {
          this.brandData.splice(data, 1)
        }
      })
    },
    // 删除
    deleteType (mainKey) {
      setTimeout(() => {
        this.typeInfoData.splice(mainKey, 1)
      }, 100)
    },
    // 删除
    deleteSpecification (mainKey) {
      setTimeout(() => {
        this.detailData.splice(mainKey, 1)
      }, 100)
    },
    selectBut () {
      this.showGoodsList = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.specificationTree.getInquireType([1, 2, 3])
        }, 500)
      })
    },
    // 获取选中规格商品数据
    getSelectedGoodsData (data, status = false) {
      this.showGoodsList = status
      const that = this
      if (data && data.length > 0) {
        const specNewsDataBak = []
        const list = this.goodsData.map((item) => {
          return parseInt(item.ppd_goods_id)
        })
        for (let i = 0; i < data.length; i++) {
          if (list.indexOf(parseInt(data[i].id)) == -1) {
            const person = {}
            person.rpd_goods_id = data[i].id
            person.rpd_goods_name = data[i].goo_name
            person.rpd_performance_proportion = ''
            person.rpd_performance_amount = ''
            person.rpd_type_scope = 1
            person.rpd_type = '1'
            specNewsDataBak.push(person)
          } else {
            this.$q.notify({
              color: 'red',
              message: '失败',
              caption: data[i].goo_name + '已存在',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right'
            })
          }
        }
        this.goodsData = this.goodsData.concat(specNewsDataBak)
      }
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
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    authorityMeta (key) {
      return true
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
