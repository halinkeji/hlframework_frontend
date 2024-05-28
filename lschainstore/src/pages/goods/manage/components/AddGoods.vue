<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink bg-white q-px-xs q-pb-md">
        <q-tabs v-model="tab" indicator-color="primary" class="text-grey-8 bg-white" dense align="left">
          <q-tab name="1" label="基础信息" />
          <q-tab name="3" label="属性设置" />
          <q-tab name="price" label="价格/规格" />
          <q-tab name="2" label="商品详情" />
          <q-tab name="discount" label="会员折扣" />
          <q-tab name="fxzx" v-if="openPlugins && openPlugins.indexOf('Fxzx') > -1" label="分销" />
        </q-tabs>
      </div>

      <q-form ref="goodsDataRef" class="col-shrink bg-white full-height q-mt-xs" v-show="['1', '2', '3', 'price'].indexOf(tab) > -1">
        <div style="overflow-y: scroll" class="fit full-height">
          <div class="row q-col-gutter-sm q-pa-sm" v-show="tab == '1'">
            <div class="col-md-6 col-12">
              <q-input
                v-model="dataForm.goo_code"
                @keyup.enter="getCodeGoodsData"
                @input="changeSpe.standardBarCode = dataForm.goo_code"
                dense
                outlined
                label="条码"
                :rules="[(val) => !!val || '请输入条码']"
              >
                <template v-slot:after>
                  <q-btn unelevated color="blue-6" label="一键生成条码" @click="oneKeyGenerateCode()"> </q-btn>
                  <q-btn
                    v-if="barcodeApiConfig.pbc_status == 1 && !goodsId"
                    unelevated
                    color="green"
                    label="条码查询"
                    :disable="dataForm.goo_code ? false : true"
                    @click="getCodeGoodsData"
                  >
                  </q-btn>
                </template>
              </q-input>
            </div>

            <div class="col-12">
              <q-input v-model="dataForm.goo_name" outlined bottom-slots dense label="名称*" :rules="[(val) => !!val || '名称是必填项']">
                <template v-slot:after>
                  <q-btn unelevated color="blue-6" @click="oneKeyGenerateJianCode()" label="一键生成简称与助记码" />
                </template>
              </q-input>
            </div>

            <div class="col-md-4 col-12">
              <q-input v-model="dataForm.goo_nick" outlined bottom-slots dense label="简称"> </q-input>
            </div>

            <div class="col-md-4 col-12">
              <q-input v-model="dataForm.goo_pinYin" outlined bottom-slots dense label="助记码 *" :rules="[(val) => !!val || '助记码是必填项']">
              </q-input>
            </div>

            <div class="col-md-4 col-12">
              <q-input
                v-model="dataForm.goo_sort"
                outlined
                bottom-slots
                dense
                label="排序"
                :rules="[(val) => /^\d+$/.test(val) || '请输入正确的排序']"
              >
              </q-input>
            </div>

            <div class="col-md-4 col-12">
              <hl-select-tree
                :list_width="400"
                @getItem="changeGoodsType"
                @resetValue="dataForm.goodsTypeId = ''"
                :dataList="goodsTypedata"
                textName="请选择分类"
                :inputLabel="'gt_name'"
                :inputValue="'id'"
                :showValue="dataForm.goodsTypeId"
              />
              <div class="text-caption">
                说明：
                <q-btn dense anchor="bottom right" self="top left" flat class="q-mr-sm" icon="ion-help-circle" color="warning">
                  <q-tooltip>
                    商品分类修改后，会重置商品规格。假设原实物商品分类下有规格，修改后为服务分类，则原分类的商品规格会清空，会员详细折扣也会清空。
                  </q-tooltip>
                </q-btn>
              </div>
            </div>

            <div class="col-md-4 col-12">
              <q-select
                outlined
                dense
                v-model="dataForm.goodsUnit_id"
                :options="goodsUnitList"
                option-value="id"
                option-label="gu_name"
                emit-value
                map-options
                label="计量单位 *"
                :rules="[(val) => !!val || '计量单位是必填项']"
                @input="getUnitInfo('add')"
              />
            </div>

            <div class="col-md-4 col-12">
              <q-select
                outlined
                v-model="dataForm.goo_status"
                class="q-pb-md"
                map-options
                emit-value
                dense
                option-label="label"
                option-value="value"
                :options="statusOptions"
                label="选择状态"
              />
            </div>

            <div class="col-md-4 col-12">
              <q-select
                outlined
                v-model="dataForm.goo_is_weigh"
                map-options
                emit-value
                dense
                option-label="label"
                option-value="value"
                :options="[
                  {
                    label: '关闭',
                    value: '0',
                  },
                  {
                    label: '开启',
                    value: '1',
                  },
                ]"
                class="q-pb-md"
                :disable="parseInt(dataForm.goo_goodsOrService) != 1"
                label="是否称重"
              />
            </div>

            <div class="col-12">
              <div class="text-subtitle2 q-pa-xs q-pl-lg">商品标签</div>

              <select-tag @getTag="getTag" :goodsId="goodsId" class="q-my-md"> </select-tag>
            </div>
          </div>
          <div class="row q-col-gutter-sm q-pa-sm" v-show="tab == 'price'">
            <div class="col-4">
              <q-select
                outlined
                dense
                v-model="dataForm.goo_size"
                :options="[
                  {
                    value: 0,
                    label: '关闭',
                  },
                  {
                    value: 1,
                    label: '启用',
                  },
                ]"
                option-value="value"
                option-label="label"
                emit-value
                map-options
                label="商品规格"
              />
            </div>

            <div class="col-12">
              <q-card flat bordered v-if="dataForm.goo_size == 1">
                <q-card-section class="q-pa-sm">
                  <div class="text-subtitle1">规格设置</div>
                </q-card-section>
                <q-separator />

                <q-card-section class="q-pb-none">
                  <q-banner rounded class="bg-grey-3">
                    <template v-slot:avatar>
                      <q-icon size="sm" name="las la-bell" color="primary" />
                    </template>
                    <div>启用商品规格后，商品的价格及库存以商品规格为准</div>
                    <div>1.系统自动根据规格项排序。 更改规格及规格项后请点击下方的【刷新规格项目表】来更新数据。</div>
                    <div>2.每一种规格代表不同型号，例如颜色为一种规格，尺寸为一种规格。目前支持三种规格；</div>
                    <div>3.特别注意，添加规格项时一定要区分开，每个规格下的规格项不能有重复名字的，否则信息会显示错误</div>
                  </q-banner>
                </q-card-section>

                <q-card-section>
                  <q-btn-group class="q-mb-sm" unelevated v-if="goodsSizeDisable">
                    <q-btn
                      color="primary"
                      label="新增规格"
                      @click="addSpecification"
                      icon="las la-plus-square"
                      :disable="parseInt(goodsUnitData.gu_is_many) == 1 ? true : false"
                    />
                    <q-separator dark vertical />
                    <q-btn color="primary" label="刷新规格表" @click="refreshSpecification" icon="las la-redo-alt" />
                  </q-btn-group>
                  <div v-for="(normItem, normIndex) in specificationLayoutData" :key="normIndex" v-show="goodsSizeDisable">
                    <div class="row">
                      <div class="col-md-7 col-12">
                        <q-input
                          v-model="normItem.mainValue"
                          outlined
                          bottom-slots
                          dense
                          @change="refreshSpecification"
                          :disable="parseInt(goodsUnitData.gu_is_many) == 1 ? true : false"
                        >
                          <template v-slot:prepend>
                            <q-btn
                              color="white"
                              label="添加规格"
                              unelevated
                              @click="addSubSpecification(normIndex)"
                              text-color="grey-8"
                              icon="las la-plus-square"
                              :disable="parseInt(goodsUnitData.gu_is_many) == 1 ? true : false"
                            />
                          </template>
                          <template v-slot:append>
                            <div class="q-pl-none">
                              <div
                                @click="deleteSpecification(normIndex)"
                                class="text-h6"
                                v-if="parseInt(goodsUnitData.gu_is_many) == 1 ? false : true"
                              >
                                ×
                              </div>
                            </div>
                          </template>
                        </q-input>
                      </div>
                    </div>

                    <div class="row">
                      <div class="col-md-4 col-12 q-pr-sm" v-for="(item, itemIndex) in normItem.layoutItem" :key="itemIndex">
                        <q-input
                          v-model="item.itemValue"
                          outlined
                          bottom-slots
                          dense
                          @change="refreshSpecification"
                          :disable="parseInt(goodsUnitData.gu_is_many) == 1 ? true : false"
                        >
                          <template v-slot:append>
                            <div
                              v-if="parseInt(goodsUnitData.gu_is_many) == 1 ? false : true"
                              class="q-pl-none"
                              @click="deleteSpecificationItem(normIndex, itemIndex)"
                            >
                              <div class="text-h6">×</div>
                            </div>
                          </template>
                        </q-input>
                      </div>
                    </div>
                  </div>

                  <div class="row q-gutter-xs" v-if="goodsSizeDisable">
                    <div class="col">
                      <q-input readonly v-model="changeSpe.standardBarCode" standout dense outlined label="请输入条码" @change="refreshSpecification">
                        <template v-slot:append>
                          <q-btn flat dense round icon="las la-arrow-circle-down" @click="synchronizeSpeData('standardBarCode')" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col">
                      <q-input v-model="changeSpe.standardStoragePrice" standout dense outlined label="请输入入库价">
                        <template v-slot:append>
                          <q-btn flat dense round icon="las la-arrow-circle-down" @click="synchronizeSpeData('standardStoragePrice')" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col">
                      <q-input v-model="changeSpe.standardMarkedPrice" standout outlined dense label="请输入标价">
                        <template v-slot:append>
                          <q-btn flat dense round icon="las la-arrow-circle-down" @click="synchronizeSpeData('standardMarkedPrice')" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col">
                      <q-input v-model="changeSpe.standardSellingPrice" standout outlined dense label="请输入售价">
                        <template v-slot:append>
                          <q-btn flat dense round icon="las la-arrow-circle-down" @click="synchronizeSpeData('standardSellingPrice')" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col">
                      <q-input v-model="changeSpe.standardWholesalePrice" outlined bottom-slots dense label="批发价">
                        <template v-slot:append>
                          <q-btn flat dense round icon="las la-arrow-circle-down" @click="synchronizeSpeData('standardWholesalePrice')" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col">
                      <q-input v-model="changeSpe.standardSettlementCycle" outlined bottom-slots dense label="毛利润结算周期*">
                        <template v-slot:append>
                          <q-btn flat dense round icon="las la-arrow-circle-down" @click="synchronizeSpeData('standardSettlementCycle')" />
                        </template>
                      </q-input>
                    </div>
                    <div class="col">
                      <q-input v-model="changeSpe.standardSecondarySettlementCycle" outlined bottom-slots dense label="二级毛利润结算周期*">
                        <template v-slot:append>
                          <q-btn flat dense round icon="las la-arrow-circle-down" @click="synchronizeSpeData('standardSecondarySettlementCycle')" />
                        </template>
                      </q-input>
                    </div>
                  </div>

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
                      rowHeight="50"
                      domLayout="autoHeight"
                      :suppressCellSelection="true"
                      :suppressRowClickSelection="true"
                      :stopEditingWhenGridLosesFocus="true"
                      :localeText="localeText"
                      :components="components"
                      :goodsUnitData="goodsUnitData"
                      :context="context"
                    ></ag-grid-vue>
                  </div>
                </q-card-section>
              </q-card>
              <q-card flat bordered v-else>
                <q-card-section class="q-pa-sm">
                  <div class="text-subtitle1">价格设置</div>
                </q-card-section>
                <q-separator />
                <q-card-section class="row q-pb-md q-col-gutter-sm">
                  <div class="col-md-4 col-12">
                    <q-input
                      v-model="dataForm.goo_purchasePrice"
                      :disable="goodsSizeDisable"
                      standout
                      dense
                      outlined
                      label="入库价"
                      class="q-mt-md"
                      :rules="[(val) => !!val || '请输入入库价', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '入库价为非负两位以内小数']"
                    >
                    </q-input>
                  </div>
                  <div class="col-md-4 col-12">
                    <q-input
                      v-model="dataForm.goo_listPrice"
                      :disable="goodsSizeDisable"
                      standout
                      dense
                      outlined
                      label="标价"
                      class="q-mt-md"
                      :rules="[(val) => !!val || '请输入标价', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '标价为非负两位以内小数']"
                    >
                    </q-input>
                  </div>
                  <div class="col-md-4 col-12">
                    <q-input
                      v-model="dataForm.goo_price"
                      :disable="goodsSizeDisable"
                      standout
                      dense
                      outlined
                      label="售价"
                      class="q-mt-md"
                      :rules="[(val) => !!val || '请输入售价', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '售价为非负两位以内小数']"
                    >
                    </q-input>
                  </div>
                  <div class="col-md-4 col-12">
                    <q-input
                      v-model="completeGoods.cg_wholesale_price"
                      outlined
                      bottom-slots
                      dense
                      label="批发价*"
                      :rules="[(val) => (val && !/^(\d+|\d+\.\d{1,2})$/.test(val) ? false : true || '批发价为非负两位以内小数')]"
                    >
                    </q-input>
                  </div>
                  <div class="col-md-4 col-12">
                    <q-input v-model="completeGoods.cg_settlement_cycle" outlined bottom-slots dense label="毛利润结算周期*"> </q-input>
                  </div>
                  <div class="col-md-4 col-12">
                    <q-input v-model="completeGoods.cg_secondary_settlement_cycle" outlined bottom-slots dense label="二级毛利润结算周期*"> </q-input>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
          <div class="row q-col-gutter-sm q-pa-sm" v-show="tab == '3'">
            <div class="col-md-4 col-12">
              <q-select
                outlined
                dense
                v-model="completeGoods.cg_band_id"
                :options="brandList"
                option-value="id"
                option-label="cp_name"
                emit-value
                map-options
                label="品牌*"
              />
            </div>

            <div class="col-md-4 col-12">
              <q-select
                outlined
                dense
                v-model="completeGoods.cg_priority_id"
                :options="priorityList"
                option-value="id"
                option-label="cp_name"
                emit-value
                map-options
                label="商品层次 *"
              />
            </div>

            <div class="col-md-4 col-12">
              <q-input
                v-model="completeGoods.cg_shelf_life_days"
                outlined
                bottom-slots
                dense
                label="保质期"
                :rules="[(val) => !!val || '请输入保质期', (val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '保质期为非负两位以内小数']"
              >
                <template v-slot:after> 天 </template>
              </q-input>
            </div>

            <div class="col-md-4">
              <q-select
                outlined
                dense
                v-model="completeGoods.cg_direct_set"
                :options="[
                  {
                    label: '关闭',
                    value: '1',
                  },
                  {
                    label: '增量',
                    value: '2',
                  },
                  {
                    label: '倍数',
                    value: '3',
                  },
                ]"
                option-value="value"
                option-label="label"
                emit-value
                map-options
                label="直采设置 *"
              />
            </div>

            <div class="col-md-4 col-12">
              <q-input v-model="completeGoods.cg_minimum_order" outlined bottom-slots dense label="起订数量"> </q-input>
            </div>

            <div class="col-6">
              <q-card flat bordered>
                <q-card-section class="q-pa-none">
                  <q-item>
                    <q-item-section>
                      <q-item-label> 商品供货商绑定 </q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn color="primary" label="添加绑定" @click="addGoodsCode" unelevated icon="las la-plus-square" />
                    </q-item-section>
                  </q-item>
                </q-card-section>
                <q-separator />

                <q-card-section class="q-pa-none">
                  <q-list>
                    <q-item v-for="(normItem, normIndex) in goodsCode" :key="'code_' + normIndex">
                      <q-item-section>
                        <q-input
                          v-model="normItem.cgc_goods_code"
                          outlined
                          bottom-slots
                          dense
                          @change="checkCode(normItem.cgc_goods_code, normIndex)"
                        >
                          <template v-slot:after>
                            <q-btn unelevated color="blue-6" label="一键生成条码" @click="oneKeyGenerateGoodsCode(normIndex)"> </q-btn>
                          </template>
                        </q-input>
                      </q-item-section>
                      <q-item-section>
                        <q-select
                          outlined
                          dense
                          v-model="normItem.cgc_supplier_id"
                          :options="supplierList"
                          option-value="id"
                          option-label="ces_name"
                          emit-value
                          map-options
                          label="选择绑定供货商 *"
                          :rules="[(val) => !!val || '供货商是必填项']"
                        >
                          <template v-slot:after>
                            <q-btn unelevated color="red" label="删除" @click="delGoodsCode(normIndex)"> </q-btn>
                          </template>
                        </q-select>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
              </q-card>
            </div>

            <div class="col-6">
              <q-card flat bordered>
                <q-card-section class="q-pa-none">
                  <q-item>
                    <q-item-section>
                      <q-item-label> 自定义属性 </q-item-label>
                    </q-item-section>

                    <q-item-section>
                      <q-select outlined dense v-model="customizeData" :options="customizeList" option-label="cc_name" label="选择自定义属性" />
                    </q-item-section>
                    <q-item-section side>
                      <q-btn color="primary" label="添加属性" @click="addCustomize" unelevated icon="las la-plus-square" />
                    </q-item-section>
                  </q-item>
                </q-card-section>

                <q-separator />

                <q-card-section class="q-pa-none" v-if="customizeDetail && customizeDetail.length > 0">
                  <q-list>
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
                          stack-label
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

                      <q-item-section v-if="item.cc_if_choose != 1 && item.cc_if_manual_input == 1">
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

                      <q-item-section side>
                        <q-btn @click="deleteCustomize(item, key)" color="red" dense flat icon="delete "> </q-btn>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card-section>
                <q-card-section class="q-pa-none" v-else>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption> 未选择自定义属性 </q-item-label>
                    </q-item-section>
                  </q-item>
                </q-card-section>
              </q-card>
            </div>
          </div>

          <q-card flat v-show="tab == '2'">
            <q-card-section class="row q-gutter-xs">
              <div class="col-12 row q-mb-sm">
                <div class="col-md-2 col-12 q-px-lg">
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
              </div>
              <div class="col-12">
                <div class="col-md-12 col-12 q-px-lg">
                  <q-input outlined bottom-slots v-model="dataForm.goo_description" dense :rows="2" label="描述" type="textarea"> </q-input>
                </div>
              </div>
              <div class="col-12">
                <div class="col-12 q-px-lg">
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
            </q-card-section>
          </q-card>
        </div>
      </q-form>

      <div class="col-shrink full-height bg-grey-2 q-mb-xs" v-if="tab == 'discount'">
        <q-card square flat class="q-pa-md q-my-xs fit column no-wrap justify-between items-stretch content-stretch no-scroll">
          <div class="col-shrink bg-white q-px-xs q-pb-md">
            <div class="q-mt-sm q-ml-md text-center bg-gery-2">
              <div class="q-gutter-sm text-center">
                <q-radio dense v-model="dataForm.goo_discountType" val="0" label="关闭会员营销" />
                <q-radio dense v-model="dataForm.goo_discountType" val="1" label="统一设置折扣在 1 - 100之间" />
                <q-radio dense v-model="dataForm.goo_discountType" val="2" label="详情设置折扣" v-if="dataForm.goo_size == 1" />
              </div>
            </div>
            <div class="q-mt-sm q-ml-md bg-gery-2">
              <div class="q-gutter-sm">
                <div>1.本功能属于会员营销功能，每个级别有对应的折扣和标价。如果不填写默认使用商品售价</div>
                <div>2.当该会员等级的折扣低于标价则按照折扣计算，反之标价小于折扣则按照标价计算，按照最低价格计算，谨慎填写</div>
                <div>3.本功能的先后顺序，当该设置不为0的时候才可以进行计算，如果只填写其中一项则按照该项价格计算</div>
              </div>
            </div>
          </div>

          <div class="col-shrink q-pa-sm full-height">
            <goods-discount :goods="goodsId" :discountType="dataForm.goo_discountType" @getDiscount="getDiscount"></goods-discount>
          </div>
        </q-card>
      </div>

      <div class="col-shrink bg-white q-pb-md text-center q-gutter-sm q-mt-xs" v-show="['1', '2', '3', 'discount', 'price'].indexOf(tab) > -1">
        <q-btn unelevated color="primary" class="q-px-xl"  :disable="disabledStatus" label="保存" @click="saveBut('save')" />
        <q-btn unelevated color="green" class="q-px-xl" :disable="disabledStatus" label="下一步" v-show="['1', '2', '3','price'].indexOf(tab) > -1" @click="nextTab" />
        <q-btn unelevated color="grey" class="q-px-xl" label="返回" :to="{ name: 'manage' }" />
      </div>
    </div>
  </q-page>
</template>
<script>
import SelectTag from 'src/pages/goods/tag/components/SelectTag.vue'
import toPinYin from 'pinyin4js' // 汉字转拼音组件
import XEUtils from 'xe-utils'
import AgSelectUnit from './AgSelectUnit.vue'
import GoodsDiscount from './GoodsDiscount.vue'
import { LocalStorage } from 'quasar'
export default {
  components: {
    AgSelectUnit,
    SelectTag,
    GoodsDiscount
  },
  name: 'addGoods',
  data () {
    return {
      multiple: false,
      goodsTypedata: [],
      goodsUnitList: [],
      brandList: [],
      priorityList: [],
      supplierList: [],
      goodsCode: [
        {
          cgc_supplier_id: '',
          cgc_goods_code: ''
        }
      ],
      customizeList: [],
      customizeData: '',
      customizeDetail: [],
      dataForm: {
        // id: "",
        goo_sort: '1',
        goo_code: '',
        goo_discountType: '0',
        goo_pinYin: '',
        goo_nick: '',
        goo_name: '',
        goodsTypeId: '',
        goodsUnit_id: '',
        goo_status: '1',
        goo_is_weigh: '0',
        goo_goodsOrService: 1,
        goo_ifGoodsPackage: 0,
        goo_purchasePrice: '',
        goo_listPrice: '',
        goo_price: '',
        goo_description: '',
        goo_content: '',
        goo_cover_image: '',
        goo_loop_image: [],
        goo_size: 0
      }, // 基础设置数据
      completeGoods: {
        cg_goods_id: '',
        cg_band_id: '',
        cg_priority_id: '',
        cg_markup_id: '',
        cg_shelf_life_days: '',
        cg_minimum_order: '',
        cg_direct_set: '1',
        cg_wholesale_price: '0.00',
        cg_gross_profit: '',
        cg_secondary_gross_profit: '',
        cg_settlement_cycle: '0',
        cg_secondary_settlement_cycle: '0'
      },
      changeSpe: {
        standardBarCode: '',
        standardStoragePrice: '',
        standardMarkedPrice: '',
        standardSellingPrice: '',
        standardWholesalePrice: '',
        standardSettlementCycle: '',
        standardSecondarySettlementCycle: ''
      },

      gridOptions: {
        onGridReady: function (p) {
          p.api.sizeColumnsToFit()
        }
      },
      specificationLayoutData: [],
      tableData: [],
      treeData: [],
      fields: [],
      specificationModifyData: [],
      localeText: this.$ag_grid_localeText,
      columnDefs: [
        {
          headerName: '库存',
          field: 'standardStock',
          width: 100
        },
        {
          headerName: '单位',
          field: 'unitId',
          cellRendererFramework: 'AgSelectUnit'
        },
        {
          headerName: '条码',
          field: 'standardBarCode',
          editable: true,
          onCellValueChanged: this.changeSpeData,
          singleClickEdit: true
        },
        {
          headerName: '入库价',
          field: 'standardStoragePrice',
          width: 80,
          editable: true,
          onCellValueChanged: this.changeSpeData,
          singleClickEdit: true
        },
        {
          headerName: '标价',
          field: 'standardMarkedPrice',
          editable: true,
          onCellValueChanged: this.changeSpeData,
          singleClickEdit: true
        },
        {
          headerName: '售价',
          field: 'standardSellingPrice',
          editable: true,
          onCellValueChanged: this.changeSpeData,
          singleClickEdit: true
        },
        {
          headerName: '批发价',
          field: 'standardWholesalePrice',
          editable: true,
          onCellValueChanged: this.changeSpeData,
          singleClickEdit: true
        },
        {
          headerName: '毛利润结算周期',
          field: 'standardSettlementCycle',
          editable: true,
          onCellValueChanged: this.changeSpeData,
          singleClickEdit: true
        },
        {
          headerName: '二级毛利润结算周期',
          field: 'standardSecondarySettlementCycle',
          editable: true,
          onCellValueChanged: this.changeSpeData,
          singleClickEdit: true
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
      spkcText: '',
      // val: false,
      model: null,
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
      mergeFields: [],
      components: {
        AgSelectUnit
      },
      goodsUnitData: {},
      context: '',
      speUnitData: [],
      tagData: [],
      barcodeApiConfig: {},
      openPlugins: []
    }
  },
  mounted () {
    this.goodsId = this.$route.query.id
    this.getGoodsType()
    this.getPropertyAll()
    if (this.goodsId > 0) {
      this.getItemData()
    }
  },
  created () {
    this.context = this
    this.openPlugins = LocalStorage.getItem('lschainstore_plugins_local').openPlugins
    if (this.openPlugins.indexOf('Barcode') > -1) {
      this.getBarcodeItem()
    }
  },
  computed: {
    goodsSizeDisable () {
      const goodsSize = parseInt(this.dataForm.goo_size)
      return parseInt(goodsSize) == 1
    }
  },
  methods: {
    nextTab () {
      if (parseInt(this.tab) == 1) {
        this.tab = '3'
        return false
      }
      if (parseInt(this.tab) == 3) {
        this.tab = 'price'
        return false
      }
      if (this.tab == 'price') {
        this.tab = '2'
        return false
      }
      if (parseInt(this.tab) == 2) {
        this.tab = 'discount'
        return false
      }
    },
    getPropertyAll () {
      this.$store
        .dispatch('goods/getProperty')
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.supplierList = res.data.supplier ? res.data.supplier : []
              this.brandList = res.data.brand ? res.data.brand : []
              this.priorityList = res.data.priority ? res.data.priority : []
              this.customizeList = res.data.customize ? res.data.customize : []
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
    getTag (val) {
      if (val) {
        this.tagData = val
      }
    },
    getDiscount (data) {
      this.goodsDiscount = data
    },
    getItemData () {
      const obj = {
        id: this.goodsId
      }
      this.$store
        .dispatch('goods/getItemData', obj)
        .then((res) => {
          if (res.code == 200) {
            this.dataForm = res.data.goodsItem

            if (this.dataForm.goo_loop_image) {
              this.dataForm.goo_loop_image = this.dataForm.goo_loop_image.split(',')
            } else {
              this.dataForm.goo_loop_image = []
            }
            if (res.data.goodsItem.goodsType) {
              this.changeGoodsType(res.data.goodsItem.goodsType)
            }

            if (res.data.customizeLinkData) {
              this.customizeDetail = res.data.customizeLinkData
              setTimeout(() => {
                this.reschConfig()
              }, 200)
            }
            if (res.data.completeGoods) {
              this.completeGoods = res.data.completeGoods
            }

            if (res.data.goodsCode) {
              this.goodsCode = res.data.goodsCode
              setTimeout(() => {
                this.reschGoodsCode()
              }, 100)
            }
            this.dataForm.goo_size = parseInt(res.data.goodsItem.goo_size)
            if (parseInt(this.dataForm.goo_size) == 1) {
              this.specificationLayoutData = res.data.defuld
              this.specificationModifyData = res.data.newSpeListArray // 给规格赋值

              this.changeSpe.standardBarCode = this.dataForm.goo_code
              setTimeout(() => {
                this.refreshSpecification()
              }, 500)
              return false
            }
          }
        })
        .catch((error) => {})
    },
    // 保存
    saveBut (type) {
      this.$refs.goodsDataRef.validate().then((success) => {
        if (success) {
          let selectRecordsArr = []
          let oldSpecificationLayoutData = []

          if (this.goodsSizeDisable) {
            selectRecordsArr = this.tableData
            oldSpecificationLayoutData = this.specificationLayoutData
          }

          this.completeGoods.cg_gross_profit = this.formatAmount(
            (this.dataForm.goo_price - this.dataForm.goo_purchasePrice) / this.dataForm.goo_price
          )
          this.completeGoods.cg_secondary_gross_profit = this.formatAmount(
            (this.dataForm.goo_price - this.completeGoods.cg_wholesale_price) / this.dataForm.goo_price
          )

          this.disabledStatus = true
          const obj = {
            goodsUnitData: this.goodsUnitData,
            ...this.dataForm,
            selectRecordsArr: selectRecordsArr,
            oldSpecificationLayoutData: oldSpecificationLayoutData,
            goodsDiscount: this.goodsDiscount,
            tagData: this.tagData,
            completeGoods: this.completeGoods,
            customizeDetail: this.customizeDetail,
            goodsCode: this.goodsCode
          }
          this.$store
            .dispatch('goods/addData', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '添加成功！',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  timeout: 500,
                  position: 'top-right'
                })
                this.disabledStatus = false
                if (type == 'save') {
                  this.$router.push({ name: 'manage' })
                } else {
                  this.tab = '2'
                  this.goodsId = res.data.id
                  this.dataForm.id = this.goodsId
                }
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
        } else {
          this.$q.notify({
            message: '失败',
            caption: '继续完善数据',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            color: 'red'
          })
          this.nextTab()
        }
      })
    },
    // 获取商品分类
    getGoodsType () {
      const obj = {
        goodsType: [1, 2]
      }
      this.$store
        .dispatch('goodstype/getTreeList', obj)
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.goodsTypedata = res.data
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
    changeGoodsType (item) {
      const goodsOrService = item.gt_goods_type
      this.dataForm.goodsTypeId = item.id
      if (parseInt(this.dataForm.goodsTypeId) <= 0) {
        return false
      }

      if (parseInt(this.dataForm.goo_goodsOrService) != goodsOrService) {
        this.dataForm.goodsUnit_id = ''
      }
      this.dataForm.goo_goodsOrService = goodsOrService
      const obj = {
        goodsType: goodsOrService
      }
      this.$store
        .dispatch('goods/getUnit', obj)
        .then((res) => {
          if (res.code == 200) {
            this.goodsUnitList = res.data
            this.getUnitInfo('update')
          }
        })
        .catch((error) => {})
    },
    // 汉字转拼音，且获取拼音首字母大写
    oneKeyGenerateJianCode () {
      const chinaVal = this.dataForm.goo_name
      if (chinaVal) {
        this.dataForm.goo_nick = chinaVal.substr(0, 6)
        this.dataForm.goo_pinYin = toPinYin.convertToPinyinString(chinaVal, '', toPinYin.FIRST_LETTER).toUpperCase().substr(0, 6)
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
    // 添加规格
    addSpecification () {
      const layoutArray = this.specificationLayoutData
      if (layoutArray && layoutArray.length >= 3) {
        this.$q.notify({
          message: '注意',
          caption: '规格参数不可新增！',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
      const newlayout = {
        mainValue: '',
        layoutItem: []
      }
      layoutArray.push(newlayout)
    },
    // 添加子规格
    addSubSpecification (mainKey) {
      this.specificationLayoutData[mainKey].layoutItem.push({
        itemValue: ''
      })
    },
    // 删除规格 整条规格而不是规格项
    deleteSpecification (mainKey) {
      setTimeout(() => {
        this.specificationLayoutData.splice(mainKey, 1)
        setTimeout(() => {
          this.refreshSpecification()
        }, 100)
      }, 100)
    },
    // 删除规格项
    deleteSpecificationItem (mainKey, itemKey) {
      setTimeout(() => {
        this.specificationLayoutData[mainKey].layoutItem.splice(itemKey, 1)
        setTimeout(() => {
          this.refreshSpecification()
        }, 100)
      }, 100)
    },
    // 重组规格数组
    refreshSpecification () {
      const that = this

      const oldSpecificationLayoutData = JSON.parse(JSON.stringify(this.specificationLayoutData)) // 上面获取下无规则数据

      oldSpecificationLayoutData.sort(function (x, y) {
        if (x.layoutItem.length > y.layoutItem.length) {
          return 1
        }
        if (x.layoutItem.length < y.layoutItem.length) {
          return -1
        }
      })

      // 声明一个空数组
      const specificationArray = []
      // 判断大数组的长度是否大于0
      if (oldSpecificationLayoutData.length > 0) {
        // 循环第一个数组的子项
        for (var i = 0; i < oldSpecificationLayoutData[0].layoutItem.length; i++) {
          // 将大数组的第一个子数组的第一个子项的信息填入新数组
          specificationArray.push({
            id: oldSpecificationLayoutData[0].layoutItem[i].id > 0 ? oldSpecificationLayoutData[0].layoutItem[i].id : i + 1,
            name: oldSpecificationLayoutData[0].layoutItem[i].itemValue,
            standardBarCode: '',
            standardStock: '',
            standardStoragePrice: 0,
            standardMarkedPrice: 0,
            standardSellingPrice: 0,
            unitId: 0,
            children: []
          })

          // 开始遍历大数组
          oldSpecificationLayoutData.forEach((item, key) => {
            // 循环大数组的所有项 跳过大数组内第一个数组
            for (var g = 0; g < item.layoutItem.length; g++) {
              // 当大数组内的索引等于1 也就是说 跳过第一个数组 等于第二个数组时
              if (key == 1) {
                // 新建一个符合标准的数组
                const itemValue = {
                  id: item.layoutItem[g].id > 0 ? item.layoutItem[g].id : i + 11,
                  name: item.layoutItem[g].itemValue,
                  standardBarCode: '',
                  standardStock: '',
                  standardStoragePrice: 0,
                  standardMarkedPrice: 0,
                  standardSellingPrice: 0,
                  unitId: 0,
                  children: []
                }
                // 将新建的数组插入上面大数组的一个数组变量里
                specificationArray[i].children.push(itemValue)
                // 再次重新遍历大数组
                oldSpecificationLayoutData.forEach((valueItem, valueKey) => {
                  // 再次循环这个数组  跳过大数组内第一个和第二个数组
                  for (let y = 0; y < valueItem.layoutItem.length; y++) {
                    // 当大数组内的索引等于2 也就是说 跳过第二个数组 等于第三个数组时
                    if (valueKey == 2) {
                      const threeItemValue = {
                        id: valueItem.layoutItem[y].id > 0 ? valueItem.layoutItem[y].id : i + 111,
                        name: valueItem.layoutItem[y].itemValue,
                        standardBarCode: '',
                        standardStock: '',
                        standardStoragePrice: 0,
                        standardMarkedPrice: 0,
                        standardSellingPrice: 0,
                        unitId: 0,
                        children: []
                      }
                      specificationArray[i].children[g].children.push(threeItemValue)
                    }
                  }
                })
              }
            }
          })
        }
      }

      this.treeData = specificationArray
      const tableColumn = this.columnDefs
      const pushTableColumn = []
      const mergeFields = []
      for (let j = 0; j < oldSpecificationLayoutData.length; j++) {
        const df = j + 1
        const field_name = 'name_' + df
        mergeFields.push(field_name)

        pushTableColumn.push({
          cellClassRules: {
            'cell-span-goods': function (p) {
              if (p.value) {
                return true
              }
            }
          },
          // rowSpan: that.rowSpan,
          field: field_name,
          width: 100,
          pinned: 'left',
          headerName: oldSpecificationLayoutData[j].mainValue
        })
      }
      const newTableColumn = pushTableColumn.concat(tableColumn)

      this.mergeFields = mergeFields
      setTimeout(() => {
        if (this.gridOptions) {
          this.gridOptions.api.setColumnDefs(newTableColumn)
        }
      }, 200)

      this.toColTreeData()
    },
    rowSpan (params) {
      const fields = this.mergeFields
      const data = this.tableData

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

    // 转换横向树结构
    toColTreeData (type, valuea) {
      const options = { children: 'children' }
      const list = []
      const keyMap = {}
      XEUtils.eachTree(
        this.treeData,
        (item, index, result, paths, parent) => {
          keyMap[item.id] = item
          item.keys = parent ? parent.keys.concat([item.id]) : [item.id]
          item.keysId = ',' + item.id
          const keysJoin = item.keys.join(',')
          if (!item.children || !item.children.length) {
            const row = {}

            item.keys.forEach((key, index) => {
              const level = index + 1
              const obj = keyMap[key]
              row[`id_${level}`] = obj.id
              row[`name_${level}`] = obj.name
              if (this.specificationModifyData.length > 0) {
                this.specificationModifyData.forEach((value) => {
                  if (keysJoin == value.sl_link_id) {
                    row.standardStock = value.sl_inventory
                    row.standardBarCode = value.sl_barCode
                    row.standardStoragePrice = value.sl_warehousingPrice
                    row.standardMarkedPrice = value.sl_markedPrice
                    row.standardSellingPrice = value.sl_sellingPrice
                    row.unitId = value.sl_unit
                    if (value.goodsSpec) {
                      row.goodsSpecId = value.goodsSpec.id
                      row.standardWholesalePrice = value.goodsSpec.cgs_wholesale_price
                      row.standardSettlementCycle = value.goodsSpec.cgs_settlement_cycle
                      row.standardSecondarySettlementCycle = value.goodsSpec.cgs_secondary_settlement_cycle
                    }
                  }
                })
              } else {
                this.treeData.forEach((value) => {
                  row.standardStock = value.sl_inventory
                  row.standardBarCode = value.sl_barCode
                  row.standardStoragePrice = value.sl_warehousingPrice
                  row.standardMarkedPrice = value.sl_markedPrice
                  row.standardSellingPrice = value.sl_sellingPrice
                  row.unitId = value.sl_unit
                  if (value.goodsSpec) {
                    row.goodsSpecId = value.goodsSpec.id
                    row.standardWholesalePrice = value.goodsSpec.cgs_wholesale_price
                    row.standardSettlementCycle = value.goodsSpec.cgs_settlement_cycle
                    row.standardSecondarySettlementCycle = value.goodsSpec.cgs_secondary_settlement_cycle
                  }
                })
              }
            })
            list.push(row)
          }
        },
        options
      )

      this.$nextTick(() => {
        this.keyMap = keyMap
        this.tableData = list
      })
    },

    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },

    oneKeyGenerateCode () {
      const newDate = new Date()
      this.dataForm.goo_code = newDate.getTime().toString()
      this.changeSpe.standardBarCode = this.dataForm.goo_code
    },
    rowSelectedAg (p) {
      this.dataListSelections = p.api.getSelectedRows()
    },
    synchronizeSpeData (keys = null) {
      if (this.tableData && this.changeSpe[keys]) {
        const tableData = this.tableData
        const changeSpeValue = this.changeSpe[keys]
        if (!this.changeSpeDataVerify(keys, changeSpeValue)) {
          this.$q.notify({
            message: '注意',
            caption: '请输入正确的格式！',
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
          return false
        }
        const newsTableData = _(tableData).forEach(function (i, k) {
          i[keys] = changeSpeValue
        })

        this.tableData = newsTableData
        setTimeout(() => {
          this.gridOptions.api.refreshCells()
        }, 200)
      }
    },
    changeSpeData (p) {
      if (!this.changeSpeDataVerify(p.colDef.field, p.newValue)) {
        const data = p.data
        data[p.colDef.field] = !p.oldValue ? '' : p.oldValue
        const itemsToUpdate = []
        itemsToUpdate.push(data)
        p.api.applyTransaction({ update: itemsToUpdate })
        this.$q.notify({
          message: '注意',
          caption: '请输入正确的格式！',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }
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
      // if (nowWidth > this.$q.screen.sizes.md) {
      params.api.sizeColumnsToFit()
      // }
    },
    changeSpeDataVerify (p, value) {
      if (!value) {
        return false
      }
      switch (p) {
        case 'standardBarCode':
          var rg = /(^[1-9]\d*$)/
          return rg.test(value)
        case 'standardStoragePrice':
          var rg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
          return rg.test(value)
        case 'standardMarkedPrice':
          var rg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
          return rg.test(value)
        case 'standardSellingPrice':
          var rg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
          return rg.test(value)
        case 'standardWholesalePrice':
          var rg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/
          return rg.test(value)
        case 'standardSettlementCycle':
          var rg = /(^[1-9]\d*$)/
          return rg.test(value)
        case 'standardSecondarySettlementCycle':
          var rg = /(^[1-9]\d*$)/
          return rg.test(value)
        default:
          return true
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
    },
    // 获取计量单位信息
    getUnitInfo (operate = 'add') {
      const goodsUnit_id = this.dataForm.goodsUnit_id
      const unitKey = _.findIndex(this.goodsUnitList, function (o) {
        return parseInt(o.id) == parseInt(goodsUnit_id)
      })

      if (this.goodsUnitList[unitKey]) {
        this.goodsUnitData = this.goodsUnitList[unitKey]

        if (operate == 'add') {
          this.specificationLayoutData = []
        }

        if (this.goodsUnitData && parseInt(this.goodsUnitData.gu_is_many) == 1 && this.goodsUnitData.unitList) {
          this.dataForm.goo_size = 1
          const unitList = this.goodsUnitData.unitList
          unitList.big.id = parseInt(unitList.big.id)
          unitList.small.id = parseInt(unitList.small.id)
          this.speUnitData = [unitList.big, unitList.small]
          if (operate == 'add') {
            this.pushUnitSpe(unitList)
          }
          this.context = this
        }
        setTimeout(() => {
          this.refreshSpecification()
        }, 500)
      }
    },
    pushUnitSpe (unitList) {
      const layoutArray = this.specificationLayoutData
      const newlayout = {
        mainValue: '规格',
        layoutItem: [
          {
            itemValue: unitList.big.gu_name
          },
          {
            itemValue: unitList.small.gu_name
          }
        ]
      }
      layoutArray.push(newlayout)
    },
    getCodeGoodsData () {
      if (this.barcodeApiConfig.pbc_status != 1 || this.goodsId) {
        return false
      }
      const obj = {
        code: this.dataForm.goo_code
      }
      this.$store
        .dispatch('barcode/getCodeGoodsData', obj)
        .then((res) => {
          if (res.code == 200) {
            // this.dataForm.goo_code = res.data.goo_code ? res.data.goo_code : ''
            this.dataForm.goo_name = res.data.goo_name ? res.data.goo_name : ''
            this.dataForm.goo_description = res.data.goo_description ? res.data.goo_description : ''
            // this.dataForm.goo_cover_image = res.data.goo_cover_image ? res.data.goo_cover_image : ''
            // if (res.data.goo_loop_image) {
            //   this.dataForm.goo_loop_image = res.data.goo_loop_image.split(',')
            // } else {
            //   this.dataForm.goo_loop_image = []
            // }
            this.tab = '1'
            this.$nextTick(() => {
              this.oneKeyGenerateJianCode()
            })
          } else {
            this.$q.notify({
              message: '错误',
              caption: '未查询到该条码商品信息',
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
    // 获取扫码开关
    getBarcodeItem () {
      this.$store.dispatch('barcode/getItemData').then((res) => {
        if (res.code == 200 && res.data) {
          this.barcodeApiConfig = res.data ? res.data : {}
          this.barcodeApiConfig.pbc_status = parseInt(res.data.pbc_status)
        }
      })
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
    addGoodsCode () {
      const layoutArray = this.goodsCode
      const newlayout = {
        cgc_supplier_id: '',
        cgc_goods_code: ''
      }
      layoutArray.push(newlayout)
    },
    delGoodsCode (mainKey) {
      setTimeout(() => {
        this.goodsCode.splice(mainKey, 1)
      }, 100)
    },
    reschGoodsCode () {
      this.goodsCode.forEach((value, index) => {
        const data = this.supplierList.findIndex(function (x) {
          return x.id == value.cgc_supplier_id
        })
        if (data > -1) {
          this.supplierList.splice(data, 1)
        }
      })
    },
    oneKeyGenerateGoodsCode (key) {
      const newDate = new Date()
      this.goodsCode[key].cgc_goods_code = newDate.getTime().toString()
      this.checkCode(this.goodsCode[key].cgc_goods_code, key)
    },
    checkCode (code, key = null) {
      const obj = {
        code: code
      }
      this.$store
        .dispatch('goods/checkCodeGoods', obj)
        .then((res) => {
          if (res.code == 200) {
            this.goodsCode[key].cgc_goods_code = code
          } else {
            this.$q.notify({
              message: '错误',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'red'
            })

            this.goodsCode[key].cgc_goods_code = ''
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
    }
  }
}
</script>
<style>
.spe-ag-grid .cell-span-goods {
  background: white;
  border-left: 1px solid lightgrey !important;
  border-right: 1px solid lightgrey !important;
  border-bottom: 1px solid lightgrey !important;
  text-align: center;
}
.spe-ag-grid .ag-cell-value,
.ag-group-value {
  width: 100% !important;
}
</style>
