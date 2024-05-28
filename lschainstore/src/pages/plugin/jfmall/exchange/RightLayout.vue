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
        @input="getGoodsTypeList"
      >
        <q-tab name="allGoods"><span :class="{ 'text-h6': goodsTypeDataTab == 'allGoods' }">全部</span></q-tab>
        <q-tab :name="key" v-for="(item, key) in goodsTypeData" :key="key">
          <span :class="{ 'text-h6': goodsTypeDataTab == key }">{{ item.gt_name }}</span>
        </q-tab>
      </q-tabs>
      <q-separator color="deep-orange" />
      <q-tabs
        v-model="goodsTypeTab"
        align="left"
        inline-label
        outside-arrows
        class="text-dark"
        mobile-arrows
        active-color="white"
        active-bg-color="orange"
        indicator-color="deep-orange"
        @input="getGoodsList"
        v-if="goodsTypeSubTab.length > 0"
      >
        <q-tab :name="item.id" v-for="(item, key) in goodsTypeSubTab" :key="key">
          <span :class="{ 'text-h6': goodsTypeTab == item.id }">{{ item.gt_name }}</span>
        </q-tab>
      </q-tabs>
    </div>
    <q-separator color="deep-orange"  v-if="goodsTypeSubTab.length > 0" />
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
                  :src="props.row.coverImage && props.row.coverImage.id ? $q.localStorage.getItem('lschainstore_system_local').attach_url + props.row.coverImage.path : ''"
                  :ratio="1"
                  class="full-width"
                >
                 <template v-if="!props.row.coverImage">
                    <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                      暂无封面
                    </div>
                  </template>
                  <template v-slot:error>
                    <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                      暂无封面
                    </div>
                  </template>
                </q-img>

                <q-card-section class="q-pa-xs" >
                  <div class="text-subtitle2 ellipsis-2-lines">{{ props.row.jg_name }}</div>

                  <div class="text-deep-orange" v-if="parseInt(props.row.goo_size) == 1">按规格</div>

                  <div v-else>
                    <div>
                     {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }} {{ props.row.price ? props.row.price : props.row.jg_price }}
                    </div>
                    <div class="text-primary">
                      库存：{{ props.row.gn_number }}
                    </div>
                  </div>
                   <q-badge color="positive" v-if="parseInt(props.row.jg_is_member_price) == 1">
                     会员价
                    </q-badge>
                    <q-badge color="orange" v-if="parseInt(props.row.jg_is_point_price) ==1">
                     {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit }}支付
                    </q-badge>
                     <q-badge color="blue" v-if="parseInt(props.row.jg_is_save_price) ==1">
                     {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit }}支付
                    </q-badge>

                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </q-scroll-area>
       <div class="flex flex-center text-blue-grey justify-end fit ">
        <div>
          <div class="text-center">
            <q-icon size="83px" name="fas fa-box-open"></q-icon>
          </div>
          <div>
            没有更多了...
          </div>
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
                page.page--
                getGoodsList()
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
                page.page++
                getGoodsList()
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
    <spec-components v-if="specDialogStatus" ref="specDialogRef" @confirmWeighResult="setData" />
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
      goodsTypeTab: 'allGoods',
      goodsTypeDataTab: 'allGoods',
      columns: [
        { name: 'id', label: 'id', field: 'id' },
        { name: 'goo_goodsOrService', label: '属性', field: 'goo_goodsOrService' },
        { name: 'goo_is_weigh', label: '是否称重', field: 'goo_is_weigh' },
        { name: 'jg_name', label: '名称', field: 'jg_name' },
        { name: 'goo_code', label: '条码', field: 'goo_code' },
        { name: 'goo_price', label: '售价', field: 'goo_price' },
        { name: 'gn_number', label: '库存', field: 'gn_number' },
        { name: 'goo_size', label: '是否规格', field: 'goo_size' },
        { name: 'goo_cover_image', label: '图片', field: 'goo_cover_image' },
        { name: 'jg_is_member_price', label: '会员价', field: 'price' },
        { name: 'jg_is_point_price', label: this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_integralUnit + '支付', field: 'point' },
        { name: 'jg_is_save_price', label: this.$q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_balanceUnit + '支付', field: 'saving' }
      ],

      goodsTypeData: [],
      goodsListData: [],
      goodsTypeSubTab: [],
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
    getGoodsTypeList () {
      this.goodsTypeSubTab = []
      this.goodsTypeTab = ''
      if (this.goodsTypeDataTab == 'allGoods') {
        this.getGoodsList()
      } else {
        if (this.goodsTypeData[this.goodsTypeDataTab].goodsType.length > 0) {
          this.goodsTypeSubTab = this.goodsTypeData[this.goodsTypeDataTab].goodsType
        }
        this.goodsTypeTab = this.goodsTypeData[this.goodsTypeDataTab].id
        this.getGoodsList()
      }
    },

    goodsOrService (val) {
      return val.goo_goodsOrService
    },
    // 获取商品分类
    getGoodsType () {
      this.$store
        .dispatch('goodstype/getAllData', { property: 1 })
        .then((res) => {
          if (res.code == 200) {
            if (res.data) {
              this.goodsTypeData = res.data
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

    // 获取商品列表
    getGoodsList () {
      const obj = {
        type: this.goodsTypeTab,
        text: this.goodsInfo,
        page: this.page.page,
        levelId: this.levelId,
        pSize: this.page.rowsPerPage
      }
      this.$store
        .dispatch('jfExchange/getGoodsList', obj)
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
      if (parseInt(item.goo_size) == 1) {
        this.specDialogStatus = true
        this.$nextTick(() => {
          this.$refs.specDialogRef.specificationBut(item.id, this.levelId, item)
        })
      } else {
        this.setData(item, item.goods_id)
      }
    },

    setData (item, goods_id, spe_id) {
      const objs = {
        id: 0,
        member_id: this.member_id,
        main_goods_id: goods_id,
        goods_id: item.id,
        spe_id: spe_id,
        jc_type: 2,
        jc_number: 1,
        levelId: this.levelId
      }
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
