<template>
  <q-page>
    <!-- 读卡栏 -->
    <hl-checkout
      @paySuccessCallBack="paySuccessCallBack"
      ref="openCheckoutCounterPage"
      v-if="checkoutPageReceive"
    ></hl-checkout>
    <package-details ref="packageDetailsRef"></package-details>
    <hl-card-reading
      ref="memberCardReading"
      navType="horizontal"
      @refreshDataList="getMemberInfo"
    ></hl-card-reading>

    <div class="row q-ma-lg ">
      <q-card flat bordered class="col-12 col-md-6">
        <div class="row q-pa-md q-gutter-sm">
          <!-- <div class="col-8 col-md-4">
            <q-input
              outlined
              v-model="goodsInfo"
              label="商品编码/商品名称/简称"
              dense
            />
          </div> -->
          <div class="col-8 col-md-3">
            <q-select
              outlined
              dense
              v-model="goodsTypeId"
              :options="goodsTypeInfo"
              option-value="id"
              option-label="gt_name"
              option-disable="inactive"
              emit-value
              map-options
              label="选择分类"
            />
          </div>
          <q-btn
            unelevated
            color="blue-6"
            label="查询"
            class="full-height"
            @click="getGoodsList()"
            icon="las la-search"
          />
          <q-btn
            unelevated
            label="重置"
            color="amber-8"
            icon="ion-refresh"
            @click="
              goodsInfo = '';
              goodsTypeId = '';
              getGoodsList();
              getTypeData();
            "
            class="full-height"
          />

          <!-- <q-chip square color="red-1" text-color="red">
            规格商品不参与搜索
          </q-chip> -->
        </div>
        <q-tabs
          v-model="tab"
          indicator-color="primary"
          class="text-grey-8"
          align="left"
        >
          <q-tab
            :name="item.id"
            :label="item.gt_name"
            v-for="(item, index) in goodsTypeInfo"
            :key="index"
          />
        </q-tabs>
        <q-tab-panels v-model="tab" animated style="height:440px">
          <q-tab-panel
            :name="item.id"
            :label="item.gt_name"
            v-for="(item, index) in goodsTypeInfo"
            :key="index"
          >
            <div class="row">
              <div
                class="col-12 col-md-4 q-px-xs"
                v-for="goodsItem in goodsListData"
                :key="goodsItem.id"
                v-if="item.id == goodsItem.goodsTypeId"
                @click="
                  goodsItem.goo_size == 1
                    ? specificationBut(goodsItem.id, goodsItem)
                    : addingGoodsBut(goodsItem, 1)
                "
              >
                <q-card flat bordered>
                  <div>
                    <q-chip
                      square
                      color="blue-1"
                      text-color="blue"
                      v-if="goodsItem.goo_goodsOrService == 1"
                    >
                      实
                    </q-chip>
                    <q-chip
                      square
                      color="green-1"
                      text-color="green"
                      v-if="goodsItem.goo_goodsOrService == 2"
                    >
                      服
                    </q-chip>
                    <q-chip
                      square
                      color="red-1"
                      text-color="red"
                      v-if="goodsItem.goo_goodsOrService == 3"
                    >
                      套
                    </q-chip>
                    {{ ellipsis(goodsItem.goo_name) }}
                    <q-separator />
                    <div class="row q-pa-sm">
                      <div class="col-4">
                        <img
                          :src="goodsItem.goo_cover_image"
                          alt=""
                          style="width:60px;height:60px;"
                        />
                      </div>
                      <div class="col-8">
                        <div class=" q-pt-sm">编：{{ goodsItem.goo_code }}</div>
                        <div class="row q-pt-md">
                          <div
                            class="col text-red"
                            v-if="goodsItem.goo_size == 0"
                          >
                            {{ goodsItem.goo_usePoint }}积分
                          </div>
                          <div
                            class="col"
                            v-if="goodsItem.goo_goodsOrService == 3"
                          >
                            <q-chip
                              square
                              color="grey-6"
                              text-color="white"
                              size="12px"
                            >
                              按实际
                            </q-chip>
                          </div>

                          <div
                            class="col"
                            v-if="goodsItem.goo_goodsOrService == 1"
                          >
                            <div
                              @click="toolbar = true"
                              v-if="goodsItem.goo_size == 1"
                            >
                              <q-chip
                                square
                                color="primary"
                                text-color="white"
                                size="12px"
                              >
                                按规格
                              </q-chip>
                            </div>
                            <div v-else>
                              <q-chip
                                square
                                color="primary"
                                text-color="white"
                                size="12px"
                              >
                                {{ goodsItem.gn_number }}
                              </q-chip>
                            </div>
                          </div>

                          <div
                            class="col"
                            v-if="goodsItem.goo_goodsOrService == 2"
                          >
                            <q-chip
                              square
                              color="grey-6"
                              text-color="white"
                              size="12px"
                            >
                              无限制
                            </q-chip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card>
              </div>
            </div>
          </q-tab-panel>
        </q-tab-panels>
        <div class="q-pa-lg">
          <hl-pagination
            @size-change="sizeChangeHandle"
            @current-change="currentChangeHandle"
            :current-page="page.pageIndex"
            :page-sizes="[10, 20, 50, 100, 200, 300, 500, 1000]"
            :page-size="page.pageSize"
            :total="page.pageTotal"
            layout="total, prev, pager, next"
          ></hl-pagination>
        </div>
      </q-card>

      <!-- 右侧购物车栏 -->
      <q-card flat bordered class="col-12 col-md-6">
        <div class="q-ma-sm">
          <div class="row q-gutter-sm">
            <div class="col-6">
              <q-input
                outlined
                v-model="goodsBarCode"
                label="输入条码加入购物车"
                dense
              />
            </div>
            <q-btn
              unelevated
              color="blue-6"
              label="添加"
              @click="addingData()"
              icon="las la-plus"
            />
            <q-btn
              unelevated
              color="red-5"
              label="清空购物车"
              @click="deleteData(0, 2)"
              icon="las la-trash-alt"
            />
          </div>
          <hl-auto-height class="q-mt-sm">
            <template slot="body">
              <ag-grid-vue
                v-if="ifShoppingCartsLit"
                ref="shoppingAgGridTable"
                :components="components"
                :gridOptions="shoppingGridOptions"
                class="ag-theme-balham ag-grid-table full-height hl_header_center hl_content_center"
                :columnDefs="columnDefs"
                :suppressMovableColumns="true"
                :defaultColDef="defaultColDef"
                :rowData="shoppingCartsLit"
                rowSelection="multiple"
                :rowDragManaged="true"
                colResizeDefault="shift"
                :animateRows="false"
                :floatingFilter="false"
                :enableCellTextSelection="true"
                :suppressCellSelection="true"
                :suppressRowClickSelection="true"
                :rowMultiSelectWithClick="true"
                @first-data-rendered="onFirstDataRendered"
                rowHeight="50"
                :context="context"
                :stopEditingWhenGridLosesFocus="true"
                :singleClickEdit="true"
                :localeText="localeText"
              ></ag-grid-vue>
            </template>
          </hl-auto-height>
          <hl-pagination
            class="q-mt-sm"
            @size-change="shoppingCartSizeChangeHandle"
            @current-change="shoppingCartCurrentChangeHandle"
            :current-page="shoppingCartPage.pageIndex"
            :page-sizes="[12, 30, 50, 100, 200, 300, 500, 1000]"
            :page-size="shoppingCartPage.pageSize"
            :total="shoppingCartPage.pageTotal"
            layout="total, sizes, prev, pager, next, jumper"
          ></hl-pagination>

          <div class="row q-px-sm q-mt-sm">
            <div class="col-6 col-md-2 q-pa-xs">
              可用总积分：
              <span class="text-h6 text-green">
                {{ this.formatAmount(mem_memberPointsCount) }}</span
              >
            </div>
            <div class="col-6 col-md-2 q-pa-xs">
              兑换消费:
              <span class="text-h6 text-primary"> {{ totalAmount }}</span>
            </div>
            <div class="col-6 col-md-2 q-pa-xs">
              所需积分:
              <span class="text-h6 text-red-5"> {{ totalUsePoint }}</span>
            </div>
            <div class="col-6 col-md-2 q-pa-xs">
              所需储值:
              <span class="text-h6 text-primary"> {{ totalUseStored }}</span>
            </div>

            <div class="col-6 col-md-2 q-pa-xs">
              <q-btn
                unelevated
                color="red-5"
                class=" q-py-xs"
                @click="refreshBut()"
                label="重置"
                icon="ion-refresh"
              />
            </div>

            <div class="col-6 col-md-2 q-pa-xs">
              <q-btn
                unelevated
                color="blue-6"
                class=" q-py-xs"
                label="兑换"
                :disable="shoppingCartsLit.length == 0"
                @click="openCheckoutCounterPage()"
                icon="las la-chevron-circle-down"
              />
            </div>
          </div>
        </div>
      </q-card>
      <!-- 弹出框 -->
      <q-dialog v-model="specificationPopup">
        <q-card style="width: 1000px; max-width: 80vw;">
          <q-toolbar>
            <q-toolbar-title class="text-center"> 商品规格</q-toolbar-title>
            <q-btn flat round dense icon="close" v-close-popup />
          </q-toolbar>

          <q-card-section>
            <div class="row">
              <div
                class="col-md-4 col-12 q-px-xs"
                v-for="t in specificationData"
                :key="t.id"
              >
                <q-card
                  flat
                  bordered
                  @click="addingGoodsBut(t, 2, specificationData['data'])"
                >
                  <div>
                    <div class="q-pa-sm">{{ t.sl_title }}</div>

                    <q-separator />
                    <div class="row q-pa-sm">
                      <div class="col-4">
                        <img
                          :src="specificationData['data'].goo_cover_image"
                          alt=""
                          style="width:60px;height:60px;"
                        />
                      </div>
                      <div class="col-8">
                        <div class=" q-pt-sm">编：{{ t.sl_barCode }}</div>
                        <div class="row q-pt-md">
                          <div class="col text-red">
                            {{ t.sl_usePoint }}积分
                          </div>
                          <div class="col">
                            <q-chip
                              square
                              color="primary"
                              text-color="white"
                              size="12px"
                            >
                              {{ t.sl_inventory }}
                            </q-chip>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </q-card>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>
<script>
import HangDetails from "./components/HangDetails.vue";
import AgOperating from "./components/AgOperating.vue";
import AgProductName from "./components/AgProductName.vue";
import PackageDetails from "./components/PackageDetails.vue";

export default {
  name: "xfsy",
  components: {
    HangDetails,
    AgOperating,
    AgProductName,
    PackageDetails
  },
  data() {
    return {
      shoppingCartsLit: [],
      hangUpLit: [],
      goodsInfo: "",
      goodsBarCode: "",
      pendingOrderRemarks: "",
      mem_memberPointsCount: "0.00", //会员可用积分
      mem_memberMoneyCount: "0.00", //会员可用储值
      goodsTypeInfo: [],
      goodsListData: [],
      totalTimes: 0,
      totalAmount: 0,
      totalUsePoint: 0,
      totalUseStored: 0,
      goodsTypeId: "",
      page: {
        pageIndex: 1,
        pageSize: 12,
        pageTotal: 0
      },
      shoppingCartPage: {
        pageIndex: 1,
        pageSize: 10,
        pageTotal: 0
      },

      hangData: {
        chu_memberName: "非会员",
        chu_memberCardNum: "",
        chu_hangUpNote: "",
        chu_hangUpCode: "",
        member_id: 0
      },
      remarksPopup: false,
      hangDetails: false,
      hangDataList: [],
      consumehangup_id: 0,
      tab: "",
      checkoutPageReceive: false,
      cashRegisterData: {},
      gridOptions: {},
      shoppingGridOptions: {},
      components: {
        AgOperating: AgOperating,
        AgProductName: AgProductName
      },

      columnDefs: [
        //表格列数据
        {
          headerName: "商品名称", //列标题
          field: "pb_goo_name", //列与数据源对应的字段
          filter: false, //是否过滤
          width: this.nowpx(0.3) + "px",
          cellRendererFramework: "AgProductName"
        },
        {
          headerName: "售价",
          field: "pb_goo_price",
          width: this.nowpx(0.1) + "px",
          filter: false
        },
        {
          headerName: "积分",
          field: "pb_usePoint",
          width: this.nowpx(0.1) + "px",
          filter: false
        },
        {
          headerName: "储值",
          field: "pb_useStored",
          width: this.nowpx(0.1) + "px",
          filter: false
        },

        {
          headerName: "数量",
          field: "pb_consumeNumber",
          filter: false,
          editable: true,
          width: this.nowpx(0.1) + "px",
          onCellValueChanged: this.changeQuantityValue
        },
        // {
        //   headerName: "小计金额",
        //   field: "pb_totalPrice",
        //   filter: false,
        //   width: this.nowpx(0.1) + "px"
        // },
        {
          headerName: "操作",
          field: "id",
          filter: false,
          cellRendererFramework: "AgOperating",

          width: this.nowpx(0.1) + "px"
        }
      ],

      defaultColDef: {
        sortable: false,
        editable: false,
        resizable: false,
        suppressMenu: false,
        rowDragManaged: true
      },
      context: null,

      localeText: this.$ag_grid_localeText,
      ifShoppingCartsLit: true,
      ifHangUpLit: false,
      specificationPopup: false,
      specificationData: []
    };
  },
  mounted() {
    this.context = this;
    this.getTypeData();
    this.getGoodsList();
    this.getShoppingCartList();
    this.calculation();
  },
  created() {},
  computed: {},
  methods: {
    //自适应列宽

    onFirstDataRendered(params) {
      let nowWidth = this.$q.screen.width;
      if (nowWidth > this.$q.screen.sizes.md) {
        params.api.sizeColumnsToFit();
      }
    },
    nowpx(px) {
      let nowWidth = this.$q.screen.width;
      if (nowWidth <= this.$q.screen.sizes.md) {
        nowWidth = 1024;
      }
      return parseInt(nowWidth * px);
    },
    //获取商品分类
    getTypeData() {
      const obj = {};
      this.$store
        .dispatch("pointsexchange/getTypeData", obj)
        .then(res => {
          if (res.code == 200) {
            this.goodsTypeInfo = res.data;
            this.tab = res.data[0].id;
          }
        })
        .catch(error => {});
    },
    //获取商品列表
    getGoodsList() {
      this.tab = this.goodsTypeId;
      const obj = {
        type: this.goodsTypeId,
        point: 1,
        caption: this.goodsInfo,
        page: this.page.pageIndex,
        pSize: this.page.pageSize
      };
      this.$store
        .dispatch("pointsexchange/getGoodsList", obj)
        .then(res => {
          if (res.data) {
            this.goodsListData = res.data.list;
            this.page.pageTotal = res.data.page.totalCount;
          } else {
            this.goodsListData = [];
            this.page.pageTotal = 0;
          }
        })
        .catch(error => {});
    },
    sizeChangeHandle(val) {
      this.page.pageSize = val;
      this.getGoodsList();
    },
    currentChangeHandle(val) {
      this.page.pageIndex = val;
      this.getGoodsList();
    },

    //获取购物车数据
    getShoppingCartList() {
      const obj = {
        consumehangup_id: this.consumehangup_id,
        member_id: this.hangData.member_id,
        page: this.shoppingCartPage.pageIndex,
        pSize: this.shoppingCartPage.pageSize
      };
      this.$store
        .dispatch("pointsexchange/getShoppingCartList", obj)
        .then(res => {
          if (res.data) {
            this.shoppingCartsLit = res.data.list;
            this.shoppingCartPage.pageTotal = res.data.page.totalCount;
            this.calculation();
          } else {
            this.shoppingCartsLit = [];
            this.shoppingCartPage.pageTotal = 0;
            this.calculation();
          }
        })
        .catch(error => {});
    },
    shoppingCartSizeChangeHandle(val) {
      this.shoppingCartPage.pageSize = val;
      this.getShoppingCartList();
    },
    shoppingCartCurrentChangeHandle(val) {
      this.shoppingCartPage.pageIndex = val;
      this.getShoppingCartList();
    },

    // 读卡
    getMemberInfo(val) {
      if (val) {
        if (val.id) {
          this.mem_memberPointsCount = val.mem_memberPointsCount;
          this.mem_memberMoneyCount = this.formatAmount(
            val.mem_memberMoneyCount
          );
          this.hangData.chu_memberCardNum = val.mem_memberCardNum;
          this.hangData.chu_memberName = val.mem_memberName
            ? val.mem_memberName
            : "非会员";
          this.hangData.member_id = val.id;

          this.getShoppingCartList();
        }
      }
    },
    // 删除购物车单条数据
    deleteData(val, type) {
      const obj = {
        id: val,
        type: type,
        mId: this.hangData.member_id
      };
      this.$store.dispatch("pointsexchange/delData", obj).then(res => {
        if (res.code == 200) {
          this.$q.notify({
            message: "成功",
            caption: "删除成功",
            icon: "ion-checkmark-circle-outline",
            color: "green",
            position: "top-right"
          });
          this.getShoppingCartList();
        }
      });
    },
    // 限制商品名称长度,多余的...替代
    ellipsis(value) {
      if (!value) return "";
      if (value.length > 10) {
        return value.slice(0, 10) + "...";
      }
      return value;
    },
    // 添加商品
    addingGoodsBut(val, type, data) {
      console.log("goodsData", data);
      console.log("type", type);
      console.log("val", val);
      if (this.hangData.member_id > 0) {
        if (val) {
          if (type == 1) {
            var goodsData = {
              member_id: this.hangData.member_id,
              goods_id: val.id,
              pb_specificationId: 0,
              pb_goodsOrService: val.goo_goodsOrService,
              pb_totalPrice: val.goo_price,
              pb_goo_price: val.goo_price,
              pb_goo_name: val.goo_name,
              pb_usePoint: val.goo_usePoint,
              pb_useStored: val.goo_useStored,
              pb_consumeNumber: "1",
              pb_memberPrice: val.goo_price,
              consumehangup_id: 0,
              pb_goo_code: val.goo_code
            };
          } else {
            var goodsData = {
              member_id: this.hangData.member_id,
              goods_id: val.goods_id,
              pb_specificationId: val.id,
              pb_specificationName: val.sl_title,
              pb_totalPrice: val.sl_sellingPrice,
              pb_goo_price: val.sl_sellingPrice,
              pb_usePoint: val.sl_usePoint,
              pb_useStored: val.sl_useStored,
              pb_goodsOrService: data.goo_goodsOrService,
              pb_goo_name: data.goo_name,
              pb_consumeNumber: "1",
              pb_memberPrice: val.sl_sellingPrice,
              consumehangup_id: 0,
              pb_goo_code: val.sl_barCode
            };
          }

          const obj = {
            ...goodsData
          };
          this.$store
            .dispatch("pointsexchange/addShoppingCart", obj)
            .then(res => {
              if (res.data) {
                if (res.data.code == 1) {
                  this.$q.notify({
                    color: "red",
                    message: res.data.title,
                    icon: "ion-checkmark-circle-outline",
                    caption: res.data.text,
                    position: "top-right"
                  });
                }
                this.specificationPopup = false;
                this.getShoppingCartList();
              } else {
                this.$q.notify({
                  color: "red",
                  message: "操作失败",
                  caption: "商品库存不足",
                  icon: "ion-close-circle-outline",
                  position: "top-right"
                });
              }
            })
            .catch(error => {});
        }
      } else {
        this.$q.notify({
          color: "red",
          message: "操作失败",
          caption: "请先读卡",
          icon: "ion-close-circle-outline",
          position: "top-right"
        });
      }
    },
    // 计算总数和总数量
    calculation() {
      if (this.shoppingCartsLit) {
        var times = 0;
        var amount = 0;
        var usePoint = 0;
        var useStored = 0;

        this.shoppingCartsLit.forEach(function(item) {
          times += parseInt(item.pb_consumeNumber);
          amount += parseFloat(item.pb_totalPrice);
          usePoint += parseFloat(item.pb_usePoint);
          useStored += parseFloat(item.pb_useStored);
        });
        this.totalTimes = times;
        this.totalAmount = this.formatAmount(amount);
        this.totalUsePoint = this.formatAmount(usePoint);
        this.totalUseStored = this.formatAmount(useStored);
      }
    },
    // 购物车商品添加
    addingData() {
      const obj = {
        code: this.goodsBarCode,
        member_id: this.hangData.member_id
      };
      this.$store.dispatch("pointsexchange/addCodeCart", obj).then(res => {
        if (res.data) {
          this.$q.notify({
            message: "成功",
            caption: "添加成功",
            icon: "ion-checkmark-circle-outline",
            color: "green",
            position: "top-right"
          });
          this.goodsBarCode = "";
          this.getShoppingCartList();
        } else {
          this.$q.notify({
            message: "失败",
            caption: "请检查后重试",
            icon: "ion-close-circle-outline",
            color: "red",
            position: "top-right"
          });
          this.goodsBarCode = "";
        }
      });
    },
    //重置
    refreshBut() {
      this.hangData.member_id = 0;
      this.hangData.chu_hangUpNote = "";
      this.consumehangup_id = 0;
      this.mem_memberPointsCount = "0.00";
      this.mem_memberMoneyCount = "0.00";
      this.$refs.memberCardReading.emptyMemberCardInfo();
      this.getShoppingCartList();
      this.getGoodsList();
      this.calculation();
    },
    //格式化保留小数点后两位数据
    formatAmount(value) {
      if (isNaN(value) || value == "" || value == undefined) {
        return 0;
      } else {
        return Math.round(parseFloat(value) * 100) / 100;
      }
    },

    paySuccessCallBack(v) {
      this.cashRegisterData = v;
      this.checkoutPageReceive = false;
      const obj = {
        goodsData: this.shoppingCartsLit,
        ...this.cashRegisterData,
        consumehangup_id: this.consumehangup_id,
        usePointsExchangePoint: this.totalUsePoint,
        usePointsExchangeMoney: this.totalUseStored
      };
      this.$store
        .dispatch("pointsexchange/addinvoice", obj)
        .then(res => {
          if (res.data.code == 0) {
            this.$q.notify({
              color: "green",
              message: "操作成功",
              caption: "收银成功",
              icon: "ion-checkmark-circle-outline",
              position: "top-right"
            });
            this.refreshBut();
          } else {
            this.$q.notify({
              color: "red",
              message: res.data.title ? res.data.title : "操作失败",
              caption: res.data.text ? res.data.text : "操作失败",
              icon: "ion-close-circle-outline",
              position: "top-right"
            });
            this.disabled = false;
          }
        })
        .catch(error => {});
    },
    openCheckoutCounterPage() {
      if (
        this.totalUsePoint > this.mem_memberPointsCount &&
        this.totalUseStored > this.mem_memberMoneyCount
      ) {
        this.$q.notify({
          color: "red",
          message: "操作失败",
          caption: "您的积分或储值不足请重新选择兑换商品，或充值",
          icon: "ion-close-circle-outline",
          position: "top-right"
        });
      } else {
        var amountsPayable = this.totalAmount;
        this.checkoutPageReceive = true;
        this.$nextTick(() => {
          this.$refs.openCheckoutCounterPage.checkoutPageReceive(
            "pointsExchange",
            amountsPayable,
            parseInt(this.hangData.member_id)
          );
        });
      }
    },

    // 修改数量
    changeQuantityValue(p) {
      if (p.data.pb_consumeNumber) {
        var re = /^[0-9]*[0-9][0-9]*$/;
        if (re.test(p.data.pb_consumeNumber)) {
          const obj = {
            id: p.data.id,
            pb_consumeNumber: p.data.pb_consumeNumber
          };
          this.$store
            .dispatch("pointsexchange/addNumber", obj)
            .then(res => {
              if (res.data) {
                if (res.data.code == 1) {
                  this.$q.notify({
                    color: "red",
                    message: res.data.title,
                    caption: res.data.text,
                    position: "top-right"
                  });
                } else {
                  this.$q.notify({
                    color: "green",
                    message: "操作成功",
                    caption: "修改数量成功",
                    icon: "ion-checkmark-circle-outline",
                    position: "top-right"
                  });
                }
                this.getShoppingCartList();
              } else {
                this.$q.notify({
                  color: "red",
                  message: "操作失败",
                  caption: "商品库存不足",
                  icon: "ion-close-circle-outline",
                  position: "top-right"
                });
                this.getShoppingCartList();
              }
            })
            .catch(error => {});
        } else {
          this.getShoppingCartList();
        }
      }
    },

    // 规格商品
    specificationBut(val, data) {
      const obj = {
        goods_id: val
      };
      this.$store
        .dispatch("pointsexchange/getSpecification", obj)
        .then(res => {
          if (res.data) {
            this.specificationData = res.data;
            this.specificationData["data"] = data;
            this.specificationPopup = true;
          }
        })
        .catch(error => {});
    }
  }
};
</script>

<style lang="scss">
.bodayClass .vs-popup {
  width: 60%;
}
.borderClass {
  border: 1px solid rgb(221, 220, 220);
}
.hl_goods_image_err .image-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: #e8f0fc;
  color: #909399;
  font-size: 14px;
}
</style>
