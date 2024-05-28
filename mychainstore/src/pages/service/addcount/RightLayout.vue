<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-md">
      <q-tabs
        v-model="goodsTypeTab"
        align="left"
        inline-label
        outside-arrows
        class="text-dark"
        mobile-arrows
        active-class="bg_cinnabar text-white"
        @input="getGoodsList"
      >
        <q-tab name="allGoods"><span :class="{ 'text-h6': goodsTypeTab == 'allGoods' }">全部</span></q-tab>
        <q-tab :name="item.id" v-for="(item, key) in goodsTagData" :key="key">
          <span :class="{ 'text-h6': goodsTypeTab == item.id }">{{ item.gt_name }}({{ item.gt_hot_key }})</span>
        </q-tab>
      </q-tabs>
      <q-separator class="bg_cinnabar" />
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
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-2">
              <q-card flat bordered @click="getSelectedGoodsData(props.row)">
                <q-img
                  v-if="props.row.coverImage && props.row.coverImage.path"
                  :ratio="1"
                  :src="`${$q.localStorage.getItem('mychainstore_system_local').attach_url}` + props.row.coverImage.path"
                />

                <q-img v-else :ratio="1">
                  <template v-slot:default>
                    <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                      暂无封面
                    </div>
                  </template>
                </q-img>
                <q-badge color="primary" rounded floating v-if="props.row.goo_goodsOrService == 1">
                  实
                </q-badge>
                <q-badge color="green" rounded floating v-else-if="props.row.goo_goodsOrService == 2">
                  服
                </q-badge>

                <q-card-section class="q-pa-xs" style="font-size:10px">
                  <div class="text-subtitle2 ellipsis">{{ props.row.goo_name }}</div>
                  <div class=" text-dark">
                    {{ props.row.goo_code }}
                  </div>

                  <div class="text-deep-orange" v-if="parseInt(props.row.goo_size) == 1">按规格</div>

                  <div class="text-deep-orange" v-else>￥ {{ props.row.goo_price }}</div>
                  <q-item-label class="text-primary row">
                    <div v-if="props.row.goo_goodsOrService == 1">
                      <div @click="toolbar = true" v-if="props.row.goo_size == 1">
                        按规格
                      </div>
                      <div v-else>
                        {{ props.row.gn_number }}
                      </div>
                    </div>

                    <div v-else-if="props.row.goo_goodsOrService == 2">
                      无限制
                    </div>
                  </q-item-label>
                </q-card-section>
              </q-card>
            </div>
          </template>
        </q-table>
      </q-scroll-area>
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
  </div>
</template>

<script>
import keyboardJS from 'keyboardJS'
export default {
  name: 'RightLayout',
  components: {},
  props: ['memberId'],
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

      goodsTypeData: [],
      goodsListData: [],
      page: {
        pageTotal: 0,
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 18
      },
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
    //     .dispatch('goodstype/getAllData', { property: [1, 2] })
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

    // 获取商品列表
    getGoodsList () {
      const obj = {
        type: this.goodsTypeTab,
        text: this.goodsInfo,
        page: this.page.page,
        pSize: this.page.rowsPerPage,
        property: [1, 2]
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

    // 获取选中规格商品数据
    getSelectedGoodsData (item) {
      if (!this.memberId) {
        return false
      }
      if (item) {
        const that = this

        const goodsItem = {
          recharge_type: 1,
          member_id: that.memberId,
          goods_id: item.id,
          mrc_goodsName: item.goo_name,
          // goodsItem.spe_id : item.id,
          // goodsItem.mrc_speName : item.specificationName,
          mrc_count: 1,
          mrc_price: item.goo_price,
          mrc_totalPrice: item.goo_price,

          mrc_limitTime: 1, // 设置限制使用周期为无限期
          mrc_limitCount: 0, // 设置无限制次数

          mrc_expiryTimeType: 1, // 设置到期时间为永久有效
          mrc_timeRuleOne: '1', // 设置开始规则为空

          mrc_timeRuleTwo: '1' // 设置结束规则为空
        }

        if (goodsItem.goods_id) {
          const obj = {
            mId: this.memberId,
            goodsData: [goodsItem]
          }

          this.$store
            .dispatch('addCount/addShoppingCart', obj)
            .then((res) => {
              if (res.code == 200) {
                this.$q.notify({
                  message: '成功',
                  caption: '成功添加' + res.data + '条商品',
                  icon: 'ion-checkmark-circle-outline',
                  color: 'green',
                  position: 'top-right'
                })

                this.$emit('getShoppingCartList')
              } else {
                this.$q.notify({
                  message: '失败',
                  caption: '操作失败',
                  icon: 'ion-close-circle-outline',
                  color: 'red',
                  position: 'top-right'
                })
                this.disabled = false
              }
            })
            .catch((error) => {})
        }
      }
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
