<template>
  <div class="fit row no-wrap justify-between items-stretch content-stretch">
    <div class="col-shrink col-xs-11 col-sm-11 col-md-11 col-lg-11 col-xl-11">
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <q-tabs
            v-model="goodsTypeTab"
            align="left"
            inline-label
            outside-arrows
            class="text-dark"
            active-color="white"
            active-bg-color="orange"
            indicator-color="deep-orange"
            content-class="consume-tabs"
            @input="getGoodsList"
          >
            <q-tab name="allGoods"><span :class="{ 'text-subtitle1': goodsTypeTab == 'allGoods' }">全部</span></q-tab>
            <!--   <q-tab :name="item.id" v-for="(item, key) in goodsTypeData" :key="key">
          <span :class="{ 'text-h6': goodsTypeTab == item.id }">{{ item.gt_name }}</span>
        </q-tab> -->
            <q-tab :name="item.id" v-for="(item, key) in goodsTagData" :key="key">
              <span :class="{ 'text-subtitle1': goodsTypeTab == item.id }" class="text-lowercase">{{ item.gt_name }}({{ item.gt_hot_key }})</span>
            </q-tab>
          </q-tabs>
          <q-separator color="deep-orange" />
        </div>
        <div class="col-shrink bg-white full-height">
          <q-scroll-area class="fit">
            <q-table
              grid
              :card-container-class="cardContainerClass"
              :data="goodsListData"
              :columns="columns"
              row-key="id"
              hide-header
              hide-bottom
              hide-pagination
              :pagination="page"
            >
              <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-2 col-md-2 col-lg-3 col-xl-2">
                  <q-card flat bordered @click="triggerOperate(props.row)">
                    <q-img
                      v-if="props.row.coverImage"
                      :ratio="1"
                      :src="props.row.coverImage ? `${$q.localStorage.getItem('lschainstore_system_local').attach_url}` + props.row.coverImage.path : ''"
                    />

                    <q-img v-else :ratio="1">
                      <template v-slot:default>
                        <div class="absolute-full flex flex-center bg-grey-3 text-dark">暂无封面</div>
                      </template>
                    </q-img>
                    <q-badge color="primary" rounded floating v-if="props.row.goo_goodsOrService == 1"> 实 </q-badge>
                    <q-badge color="green" rounded floating v-else-if="props.row.goo_goodsOrService == 2"> 服 </q-badge>
                    <q-badge color="red" rounded floating v-else-if="props.row.goo_goodsOrService == 3"> 套 </q-badge>
                    <q-card-section class="q-pa-xs" style="font-size: 10px">
                      <div class="text-caption">{{ props.row.goo_name }}</div>
                      <div class="text-dark">{{ props.row.goo_pinYin }}</div>
                      <div class="text-deep-orange" v-if="parseInt(props.row.goo_size) == 1">按规格</div>
                      <div class="text-deep-orange" v-else>
                        {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }} {{ props.row.goo_price }}
                      </div>
                      <q-item-label class="text-primary row">
                        <div v-if="props.row.goo_goodsOrService == 1">
                          <div v-if="props.row.goo_size != 1">库存:{{ props.row.gn_number }}</div>
                        </div>
                        <div class="text-orange q-px-sm" v-if="parseInt(props.row.goo_is_weigh) == 1">称重</div>
                      </q-item-label>
                    </q-card-section>
                  </q-card>
                </div>
              </template>
            </q-table>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-py-sm row">
          <q-separator inset />

          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-btn
                  outline
                  @click="
                    page.page--;
                    getGoodsList();
                  "
                  :disable="page.page <= 1"
                  color="primary"
                  size="sm"
                  icon="arrow_back_ios"
                  label="上一页"
                />
              </q-item-section>
              <q-item-section class="flex-center">
                <q-pagination
                  v-model="page.page"
                  :max="maxPage"
                  boundary-numbers
                  :max-pages="3"
                  direction-links
                  boundary-links
                  icon-first="skip_previous"
                  icon-last="skip_next"
                  icon-prev="fast_rewind"
                  icon-next="fast_forward"
                  @input="getGoodsList"
                />
              </q-item-section>
              <q-item-section side>
                <q-btn
                  outline
                  @click="
                    page.page++;
                    getGoodsList();
                  "
                  :disable="page.page >= maxPage"
                  color="primary"
                  size="sm"
                  icon="arrow_forward_ios"
                  label="下一页"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div>
    </div>
    <div class="col-shrink col-xs-2 col-sm-1 col-md-1 col-lg-1 col-xl-1">
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white full-height">
          <q-scroll-area class="fit">
            <div class="col-shrink q-px-xs" v-for="(i, key) in yingwen" :key="key">
              <q-btn
                color="white"
                class="full-width q-py-sm q-my-xs"
                padding="none"
                size="xs"
                @click="seacher(i)"
                :class="{ 'bg-red': goodsInfo.indexOf(i) >= 0 ? true : false }"
              >
                <span class="text-body2 text-black">{{ i }}</span>
              </q-btn>
            </div>
          </q-scroll-area>
        </div>
      </div>
    </div>

    <q-page-container v-if="goodsInfo">
      <q-page padding>
        <q-page-sticky position="top-right" :offset="[90, 18]" class="q-mr-md">
          <q-card class="my-card">
            <q-card-section>
              <div v-for="(item, key) in goodsSecher">
                <q-chip removable color="primary" text-color="white" @remove="delOne(key)">
                  <div class="ellipsis">
                    {{ item }}
                  </div>
                </q-chip>
              </div>
            </q-card-section>
          </q-card>
        </q-page-sticky>
      </q-page>
    </q-page-container>

    <weigh-components v-show="weighDialogStatus" @cancelWeighResult="weighDialogStatus = false" @confirmWeighResult="addingGoodsBut" ref="weighRef" />
    <weigh-spec-components
      v-show="weighSpecDialogStatus"
      @cancelWeighResult="weighSpecDialogStatus = false"
      ref="weighSpecRef"
      @confirmWeighResult="addingGoodsBut"
    />
    <spec-components v-show="specDialogStatus" ref="SpecDialogRef" @confirmWeighResult="addingGoodsBut" />
  </div>
</template>

<script>
import WeighComponents from './components/WeighComponents.vue'
import WeighSpecComponents from './components/WeighSpecComponents.vue'
import SpecComponents from './components/SpecComponents.vue'
import keyboardJS from 'keyboardJS'
export default {
  name: 'RightLayout',
  props: ['member_id', 'consumehangup_id'],
  components: {
    WeighComponents,
    WeighSpecComponents,
    SpecComponents
  },
  data () {
    return {
      goodsTypeTab: 'allGoods',
      columns: [
        { name: 'id', label: 'id', field: 'id' },
        { name: 'goo_goodsOrService', label: '属性', field: 'goo_goodsOrService' },
        { name: 'goo_is_weigh', label: '是否称重', field: 'goo_is_weigh' },
        { name: 'goo_name', label: '名称', field: 'goo_name' },
        { name: 'goo_code', label: '条码', field: 'goo_code' },
        { name: 'goo_price', label: '售价', field: 'goo_price' },
        { name: 'gn_number', label: '库存', field: 'gn_number' },
        { name: 'goo_size', label: '是否规格', field: 'goo_size' },
        { name: 'goo_cover_image', label: '图片', field: 'goo_cover_image' }
      ],
      yingwen: [
        '重置',
        'A',
        'B',
        'C',
        'D',
        'E',
        'F',
        'G',
        'H',
        'I',
        'J',
        'K',
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
        'X',
        'Y',
        'Z'
      ],
      goodsTypeData: [],
      goodsListData: [],
      goodsInfo: '',
      goodsSecher: [],
      page: {
        pageTotal: 0,
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 36
      },
      // 36
      weighDialogStatus: false,
      weighSpecDialogStatus: false,
      specDialogStatus: false,
      goodsTagData: []
    }
  },
  computed: {
    maxPage () {
      return Math.ceil(this.page.pageTotal / this.page.rowsPerPage) && Math.ceil(this.page.pageTotal / this.page.rowsPerPage) != 'Infinity'
        ? Math.ceil(this.page.pageTotal / this.page.rowsPerPage)
        : 1
    },
    // 处理表格自适应
    cardContainerClass () {
      // if (this.$q.screen.gt.xs) {
      //   return 'grid-masonry grid-masonry--' + (this.$q.screen.gt.sm ? '3' : '2')
      // }

      return void 0
    }
  },

  watch: {},
  created () {
    const that = this

    keyboardJS.bind('', (e) => {
      that.onkeydownOperate(e.key)
    })
  },
  mounted () {
    // this.getGoodsType()
    this.getGoodsList()
    this.getGoodsTagList()
  },
  methods: {
    delOne (val) {
      this.goodsSecher.splice(val, 1)
      this.goodsInfo = this.goodsSecher.toString().split(',').join('')
      this.getGoodsList()
    },
    onkeydownOperate (keyId) {
      if (this.goodsTagData && this.goodsTagData.length > 0) {
        const tagIndex = _.findIndex(this.goodsTagData, function (o) {
          return o.gt_hot_key == keyId
        })

        if (tagIndex > -1 && this.goodsTagData[tagIndex]) {
          this.goodsTypeTab = this.goodsTagData[tagIndex].id
          this.$nextTick(() => {
            this.getGoodsList()
          })
        }
      }
    },

    // 获取商品分类
    // getGoodsType () {
    //   this.$store
    //     .dispatch('goodstype/getAllData')
    //     .then((res) => {
    //       if (res.code == 200) {
    //         if (res.data) {
    //           this.goodsTypeData = res.data
    //         }
    //       }
    //     })
    //     .catch((error) => {
    //       this.$q.notify({
    //         message: '失败',
    //         caption: error.message,
    //         icon: 'ion-close-circle-outline',
    //         timeout: 500,
    //         position: 'top-right',
    //         color: 'red'
    //       })
    //     })
    // },
    getGoodsTagList () {
      this.$store
        .dispatch('goodsTag/getTagAllData')
        .then((res) => {
          if (res.code == 200) {
            this.goodsTagData = res.data ? res.data : []
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
    seacher (i) {
      if (i == '重置') {
        this.goodsInfo = ''
        this.goodsSecher = []
        this.getGoodsList()
      } else {
        this.goodsInfo = this.goodsInfo + i
        this.goodsSecher = this.goodsInfo.split('')
        this.getGoodsList()
      }
    },
    // 获取商品列表
    getGoodsList () {
      const obj = {
        type: this.goodsTypeTab,
        text: this.goodsInfo,
        page: this.page.page,
        pSize: this.page.rowsPerPage
      }
      this.$store
        .dispatch('consume/getGoodsList', obj)
        .then((res) => {
          if (res.data) {
            this.goodsListData = res.data.list
            this.page.pageTotal = res.data.page.totalCount
          } else {
            this.goodsListData = []
            this.page.pageTotal = 0
          }
        })
        .catch((error) => {})
    },

    // 判断是否称重
    triggerOperate (item) {
      if (parseInt(item.goo_size) == 1) {
        if (parseInt(item.goo_goodsOrService) == 1 && parseInt(item.goo_is_weigh) == 1) {
          this.weighSpecDialogStatus = true
          this.$nextTick(() => {
            this.$refs.weighSpecRef.specificationBut(item.id, item)
          })
        } else {
          this.specDialogStatus = true
          this.$refs.SpecDialogRef.specificationBut(item.id, item)
        }
      } else if (parseInt(item.goo_goodsOrService) == 1 && parseInt(item.goo_is_weigh) == 1) {
        this.weighDialogStatus = true
        this.$nextTick(() => {
          this.$refs.weighRef.init(item, 1)
        })
      } else {
        this.addingGoodsBut(item, 1)
      }
    },

    // 添加商品
    addingGoodsBut (val, type, data) {
      if (parseInt(type) < 3 && val) {
        var goodsData = {
          member_id: parseInt(this.member_id),
          consumehangup_id: this.consumehangup_id,
          chud_specificationId: 0,
          chud_specificationName: '',
          chud_consumeNumber: val.chud_consumeNumber
        }
        if (parseInt(type) == 1) {
          goodsData.goods_id = val.id
          goodsData.chud_goo_name = val.goo_name
          goodsData.chud_goodsOrService = val.goo_goodsOrService
          goodsData.chud_goo_price = val.goo_price
          goodsData.chud_memberPrice = val.goo_price
          goodsData.chud_goo_code = val.goo_code
          goodsData.chud_cost_price = val.goo_purchasePrice
          goodsData.chud_selling_price = val.goo_price
        } else {
          goodsData.goods_id = val.goods_id
          goodsData.chud_specificationId = val.id
          goodsData.chud_specificationName = val.sl_title
          goodsData.chud_goodsOrService = data.goo_goodsOrService
          goodsData.chud_goo_price = val.sl_sellingPrice
          goodsData.chud_goo_name = data.goo_name
          goodsData.chud_memberPrice = val.sl_sellingPrice
          goodsData.chud_goo_code = val.sl_barCode
          goodsData.chud_cost_price = val.sl_warehousingPrice
          goodsData.chud_selling_price = val.sl_sellingPrice
        }
      } else if (parseInt(type) == 3) {
        var goodsData = {
          bar_code: this.goodsBarCode,
          member_id: parseInt(this.member_id)
        }
      } else if (parseInt(type) == 4) {
        var goodsData = val
      } else {
        this.$q.notify({
          message: '添加失败',
          caption: '请刷新重试',
          icon: 'ion-close-circle-outline',
          color: 'red',
          timeout: 500,
          position: 'top-right'
        })
        return false
      }

      let captionOperate = ''
      if (parseInt(type) == 4) {
        captionOperate = '更新购物车'
      } else {
        captionOperate = '添加商品'
      }

      this.$store
        .dispatch('consume/addShoppingCart', goodsData)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: `${captionOperate}成功`,
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })
            if (this.goodsBarCode) {
              this.goodsBarCode = ''
            }
            this.specificationPopup = false
            this.$emit('refreshShoppingCart')
          } else {
            this.$q.notify({
              message: '操作失败',
              caption: res.message,
              icon: 'ion-close-circle-outline',
              color: 'red',
              timeout: 500,
              position: 'top-right'
            })
            this.$emit('refreshShoppingCart')
          }
        })
        .catch((error) => {})
    },

    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    }
  }
}
</script>
<style>
.consume-tabs {
  flex-wrap: wrap !important;
}
</style>
