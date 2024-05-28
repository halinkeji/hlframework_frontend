<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <q-tabs
        v-model="goodsTypeDataTab"
        align="left"
        inline-label
        outside-arrows
        class="text-dark"
        mobile-arrows
        active-color="white"
        active-bg-color="orange"
        indicator-color="deep-orange"
        @input="getGoodsList"
      >
        <q-tab name="allGoods"><span :class="{ 'text-h6': goodsTypeDataTab == 'allGoods' }">全部</span></q-tab>
        <q-tab :name="key" v-for="(item, key) in goodsTypeData" :key="key">
          <span :class="{ 'text-h6': goodsTypeDataTab == key }">{{ item.jt_name }}</span>
        </q-tab>
      </q-tabs>
      <q-separator />
    </div>
    <div class="col-shrink bg-white full-height">
      <q-scroll-area class="fit" v-if="goodsListData.length > 0">
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
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-2">
              <q-card flat bordered @click="triggerOperate(props.row)">
                <q-img
                  :src="
                    props.row.coverImage && props.row.coverImage.id
                      ? $q.localStorage.getItem('sspacechainstore_system_local').attach_url + props.row.coverImage.path
                      : ''
                  "
                  :ratio="1"
                  class="full-width"
                >
                  <template v-if="!props.row.coverImage">
                    <div class="absolute-full flex flex-center bg-grey-3 text-dark">暂无封面</div>
                  </template>
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-grey-3 text-dark">暂无封面</div>
                  </template>
                </q-img>

                <q-card-section class="q-pa-xs">
                  <div class="text-subtitle2 ellipsis-2-lines">{{ props.row.jg_name }}</div>

                  <div v-if="levelId">
                    <span
                      class="text-subtitle2 text-weight-bold text-deep-orange"
                      v-if="props.row.goodsPrice && formatAmount(props.row.goodsPrice.jmp_point_price) > 0"
                    >
                      {{ props.row.goodsPrice.jmp_point_price }}
                      <span class="text-caption text-dark">
                        {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_integralUnit }}
                      </span>
                    </span>

                    <span
                      class="text-subtitle2 text-weight-bold text-deep-orange"
                      color="blue"
                      v-if="props.row.goodsPrice && formatAmount(props.row.goodsPrice.jmp_member_price) > 0"
                    >
                      <span class="text-grey-9" v-if="props.row.goodsPrice && formatAmount(props.row.goodsPrice.jmp_point_price) > 0"> + </span>
                      <span class="text-caption text-dark">
                        {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                      </span>

                      {{ props.row.goodsPrice.jmp_member_price }}
                    </span>

                    <span
                      class="text-subtitle2 text-weight-bold text-deep-orange"
                      color="blue"
                      v-if="props.row.goodsPrice && formatAmount(props.row.goodsPrice.jmp_balance_price) > 0"
                    >
                      <span
                        class="text-grey-9"
                        v-if="
                          props.row.goodsPrice &&
                          (formatAmount(props.row.goodsPrice.jmp_point_price) > 0 || formatAmount(props.row.goodsPrice.jmp_member_price) > 0)
                        "
                      >
                        +
                      </span>
                      {{ props.row.goodsPrice.jmp_balance_price }}
                      <span class="text-caption text-dark">
                        {{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}
                      </span>
                    </span>
                  </div>
                  <div class="text-orange" v-else>
                    <span class="text-green" v-if="props.row.goods && parseInt(props.row.goods.goo_size) == 1"> 选择规格 </span>
                    <span v-else>
                      <span class="text-dark text-caption">
                        原价:{{ $q.localStorage.getItem('sspacechainstore_store_local').storeBaseConfig.consume_base_moneySymbol }}
                      </span>
                      {{ props.row.jg_list_price }}
                    </span>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </q-scroll-area>
      <div class="flex flex-center text-blue-grey justify-end fit">
        <div>
          <div class="text-center">
            <q-icon size="83px" name="fas fa-box-open"></q-icon>
          </div>
          <div>没有更多了...</div>
        </div>
      </div>
    </div>
    <div class="col-shrink bg-white q-py-sm">
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
              icon="arrow_back_ios"
              label="上一页"
            />
          </q-item-section>
          <q-item-section class="flex-center">
            <q-pagination
              v-model="page.page"
              :max="maxPage"
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
              icon="arrow_forward_ios"
              label="下一页"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <spec-components v-if="specDialogStatus" ref="specDialogRef" @confirmWeighResult="setSpecData" />
  </div>
</template>

<script>
import SpecComponents from './components/SpecComponents.vue'

export default {
  name: 'RightLayout',
  props: ['member_id', 'consumehangup_id', 'levelId'],
  components: {
    SpecComponents
  },
  data () {
    return {
      goodsTypeDataTab: 'allGoods',
      columns: [{ name: 'id', label: 'id', field: 'id' }],

      goodsTypeData: [],
      goodsListData: [],

      savingPrice: 0,
      pointPrice: 0,
      memberPrice: 0,
      currentSortFir: '',
      page: {
        pageTotal: 0,
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 18
      },
      specDialogStatus: false
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
  mounted () {
    this.getGoodsType()
    this.getGoodsList()
  },
  methods: {
    goodsOrService (val) {
      return val.goo_goodsOrService
    },
    // 获取商品分类
    getGoodsType () {
      this.$store
        .dispatch('jfType/getAllListData', {})
        .then((res) => {
          if (res.code == 200) {
            this.goodsTypeData = res.data
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

    // 获取商品列表
    getGoodsList () {
      const obj = {
        nowTypeId: this.goodsTypeDataTab == 'allGoods' ? '' : this.goodsTypeDataTab,
        text: this.goodsInfo,
        page: this.page.page,
        currentLevelId: this.levelId,
        pSize: this.page.rowsPerPage
      }
      this.$store
        .dispatch('jfGoods/getData', obj)
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

    triggerOperate (item) {
      if (this.member_id <= 0) {
        this.$q.notify({
          color: 'red',
          message: '操作失败',
          caption: '请先读卡',
          icon: 'ion-close-circle-outline',
          position: 'top-right'
        })
        return false
      }
      if (item.goods && parseInt(item.goods.goo_size) == 1) {
        this.specDialogStatus = true
        this.$nextTick(() => {
          this.$refs.specDialogRef.specificationBut(item.id, this.levelId, item)
        })
      } else {
        let unitPrice = 0

        if (item && item.goodsPrice && item.goodsPrice.jmp_member_price > 0) {
          unitPrice = this.formatAmount(item.goodsPrice.jmp_member_price)
        } else {
          unitPrice = this.formatAmount(item.jg_price)
        }

        const objs = {
          main_goods_id: item.goods_id,
          goods_id: item.id,
          spe_id: 0,
          jc_member_level_price: item && item.goodsPrice && item.goodsPrice.jmp_member_price > 0 ? this.formatAmount(item.goodsPrice.jmp_member_price) : 0,
          jc_unit_price: unitPrice,
          jc_unit_point: item && item.goodsPrice && item.goodsPrice.jmp_point_price > 0 ? this.formatAmount(item.goodsPrice.jmp_point_price) : 0,
          jc_unit_balance: item && item.goodsPrice && item.goodsPrice.jmp_balance_price > 0 ? this.formatAmount(item.goodsPrice.jmp_balance_price) : 0,
          jc_number: 1,
          membercardlevel_id: this.levelId,
          member_id: this.member_id,
          jc_source: 'exchange'
        }
        this.setData(objs)
      }
    },

    setSpecData (goodsInfo, specItem) {
      let unitPrice = 0

      if (specItem && specItem.goodsPrice && specItem.goodsPrice.jmp_member_price > 0) {
        unitPrice = this.formatAmount(specItem.goodsPrice.jmp_member_price)
      } else {
        unitPrice = this.formatAmount(specItem.jg_price)
      }

      const objs = {
        main_goods_id: goodsInfo.goods_id,
        goods_id: goodsInfo.id,
        spe_id: specItem.id,
        jc_member_level_price: specItem && specItem.goodsPrice && specItem.goodsPrice.jmp_member_price > 0 ? this.formatAmount(specItem.goodsPrice.jmp_member_price) : 0,
        jc_unit_price: unitPrice,
        jc_unit_point: specItem && specItem.goodsPrice && specItem.goodsPrice.jmp_point_price > 0 ? this.formatAmount(specItem.goodsPrice.jmp_point_price) : 0,
        jc_unit_balance: specItem && specItem.goodsPrice && specItem.goodsPrice.jmp_balance_price > 0 ? this.formatAmount(specItem.goodsPrice.jmp_balance_price) : 0,
        jc_number: 1,
        membercardlevel_id: this.levelId,
        member_id: this.member_id,
        jc_source: 'exchange'
      }

      this.$nextTick(() => {
        this.setData(objs)
      })
    },

    setData (objs) {
      this.$store
        .dispatch('jfExchange/setData', objs)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '操作成功',
              icon: 'ion-checkmark-circle-outline',
              color: 'green',
              timeout: 500,
              position: 'top-right'
            })

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
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            caption: error.message,
            icon: 'ion-close-circle-outline',
            color: 'red',
            timeout: 500,
            position: 'top-right'
          })
        })
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
