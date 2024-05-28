<template>
  <div class="fit row no-wrap justify-between items-stretch content-stretch">
    <!-- left -->
    <div class="col-shrink col-xs-3 col-sm-4 col-md-4 col-lg-4 col-xl-4 bg-primary">
      <left-layout :member_id="currentMemberInfo.id"  :currentMemberInfo="currentMemberInfo" ref="shoppingCarRef" />
      <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <q-input outlined v-model="text" label="请输入商品条码/名称/简称" hint="按快捷键(s)激活" class="q-mt-xs" :dense="true"/>
        </div>

        <div class="col-shrink bg-white full-height">
          <q-scroll-area class="fit">
            <q-list bordered separator  class="q-mx-xs">
              <q-item clickable v-ripple :active="active" active-class="bg-teal-1 text-grey-8">
                <q-item-section no-wrap>
                  <q-item-label lines="1"><span class="text-orange">[套]</span>鱼子精华雪肌晶纯系列</q-item-label>
                  <q-item-label caption class="text-body2 text-dark" lines="1">1658974859655</q-item-label>
                  <q-item-label caption class="text-body2 text-dark">¥ 95.26</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label><span class="cursor-pointer text-dark text-subtitle1">5件</span></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption class="text-italic text-body2">原售价:¥ 105.26</q-item-label>
                  <q-item-label class="text-h5 text-negative">¥ 55.26</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple :active="active" active-class="bg-teal-1 text-grey-8">
                <q-item-section no-wrap>
                  <q-item-label lines="1"><span class="text-orange">[套]</span>鱼子精华雪肌晶纯系列</q-item-label>
                  <q-item-label caption class="text-body2 text-dark" lines="1">1658974859655</q-item-label>
                  <q-item-label caption class="text-body2 text-dark">¥ 95.26</q-item-label>
                </q-item-section>
                <q-item-section side bottom>
                  <q-item-label><span class="cursor-pointer text-dark text-subtitle1">5件</span></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption class="text-italic text-body2">原售价:¥ 105.26</q-item-label>
                  <q-item-label class="text-h5 text-negative">¥ 55.26</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple :active="active" active-class="bg-teal-1 text-grey-8">
                <q-item-section no-wrap>
                  <q-item-label lines="1"><span class="text-orange">[套]</span>鱼子精华雪肌晶纯系列</q-item-label>
                  <q-item-label caption class="text-body2 text-dark" lines="1">1658974859655</q-item-label>
                  <q-item-label caption class="text-body2 text-dark">¥ 95.26</q-item-label>
                </q-item-section>
                <q-item-section side bottom>
                  <q-item-label><span class="cursor-pointer text-dark text-subtitle1">5件</span></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption class="text-italic text-body2">原售价:¥ 105.26</q-item-label>
                  <q-item-label class="text-h5 text-negative">¥ 55.26</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple :active="active" active-class="bg-teal-1 text-grey-8">
                <q-item-section no-wrap>
                  <q-item-label lines="1"><span class="text-orange">[套]</span>鱼子精华雪肌晶纯系列</q-item-label>
                  <q-item-label caption class="text-body2 text-dark" lines="1">1658974859655</q-item-label>
                  <q-item-label caption class="text-body2 text-dark">¥ 95.26</q-item-label>
                </q-item-section>
                <q-item-section side bottom>
                  <q-item-label><span class="cursor-pointer text-dark text-subtitle1">5件</span></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption class="text-italic text-body2">原售价:¥ 105.26</q-item-label>
                  <q-item-label class="text-h5 text-negative">¥ 55.26</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple :active="active" active-class="bg-teal-1 text-grey-8">
                <q-item-section no-wrap>
                  <q-item-label lines="1"><span class="text-orange">[套]</span>鱼子精华雪肌晶纯系列</q-item-label>
                  <q-item-label caption class="text-body2 text-dark" lines="1">1658974859655</q-item-label>
                  <q-item-label caption class="text-body2 text-dark">¥ 95.26</q-item-label>
                </q-item-section>
                <q-item-section side bottom>
                  <q-item-label><span class="cursor-pointer text-dark text-subtitle1">5件</span></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption class="text-italic text-body2">原售价:¥ 105.26</q-item-label>
                  <q-item-label class="text-h5 text-negative">¥ 55.26</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple :active="active" active-class="bg-teal-1 text-grey-8">
                <q-item-section no-wrap>
                  <q-item-label lines="1"><span class="text-orange">[套]</span>鱼子精华雪肌晶纯系列</q-item-label>
                  <q-item-label caption class="text-body2 text-dark" lines="1">1658974859655</q-item-label>
                  <q-item-label caption class="text-body2 text-dark">¥ 95.26</q-item-label>
                </q-item-section>
                <q-item-section side bottom>
                  <q-item-label><span class="cursor-pointer text-dark text-subtitle1">5件</span></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption class="text-italic text-body2">原售价:¥ 105.26</q-item-label>
                  <q-item-label class="text-h5 text-negative">¥ 55.26</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple :active="active" active-class="bg-teal-1 text-grey-8">
                <q-item-section no-wrap>
                  <q-item-label lines="1"><span class="text-orange">[套]</span>鱼子精华雪肌晶纯系列</q-item-label>
                  <q-item-label caption class="text-body2 text-dark" lines="1">1658974859655</q-item-label>
                  <q-item-label caption class="text-body2 text-dark">¥ 95.26</q-item-label>
                </q-item-section>
                <q-item-section side bottom>
                  <q-item-label><span class="cursor-pointer text-dark text-subtitle1">5件</span></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption class="text-italic text-body2">原售价:¥ 105.26</q-item-label>
                  <q-item-label class="text-h5 text-negative">¥ 55.26</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple :active="active" active-class="bg-teal-1 text-grey-8">
                <q-item-section no-wrap>
                  <q-item-label lines="1"><span class="text-orange">[套]</span>鱼子精华雪肌晶纯系列</q-item-label>
                  <q-item-label caption class="text-body2 text-dark" lines="1">1658974859655</q-item-label>
                  <q-item-label caption class="text-body2 text-dark">¥ 95.26</q-item-label>
                </q-item-section>
                <q-item-section side bottom>
                  <q-item-label><span class="cursor-pointer text-dark text-subtitle1">5件</span></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption class="text-italic text-body2">原售价:¥ 105.26</q-item-label>
                  <q-item-label class="text-h5 text-negative">¥ 55.26</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple :active="active" active-class="bg-teal-1 text-grey-8">
                <q-item-section no-wrap>
                  <q-item-label lines="1"><span class="text-orange">[套]</span>鱼子精华雪肌晶纯系列</q-item-label>
                  <q-item-label caption class="text-body2 text-dark" lines="1">1658974859655</q-item-label>
                  <q-item-label caption class="text-body2 text-dark">¥ 95.26</q-item-label>
                </q-item-section>
                <q-item-section side bottom>
                  <q-item-label><span class="cursor-pointer text-dark text-subtitle1">5件</span></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption class="text-italic text-body2">原售价:¥ 105.26</q-item-label>
                  <q-item-label class="text-h5 text-negative">¥ 55.26</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple :active="active" active-class="bg-teal-1 text-grey-8">
                <q-item-section no-wrap>
                  <q-item-label lines="1"><span class="text-orange">[套]</span>鱼子精华雪肌晶纯系列</q-item-label>
                  <q-item-label caption class="text-body2 text-dark" lines="1">1658974859655</q-item-label>
                  <q-item-label caption class="text-body2 text-dark">¥ 95.26</q-item-label>
                </q-item-section>
                <q-item-section side bottom>
                  <q-item-label><span class="cursor-pointer text-dark text-subtitle1">5件</span></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption class="text-italic text-body2">原售价:¥ 105.26</q-item-label>
                  <q-item-label class="text-h5 text-negative">¥ 55.26</q-item-label>
                </q-item-section>
              </q-item>
              <q-item clickable v-ripple :active="active" active-class="bg-teal-1 text-grey-8">
                <q-item-section no-wrap>
                  <q-item-label lines="1"><span class="text-orange">[套]</span>鱼子精华雪肌晶纯系列</q-item-label>
                  <q-item-label caption class="text-body2 text-dark" lines="1">1658974859655</q-item-label>
                  <q-item-label caption class="text-body2 text-dark">¥ 95.26</q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label><span class="cursor-pointer text-dark text-subtitle1">5件</span></q-item-label>
                </q-item-section>
                <q-item-section side>
                  <q-item-label caption class="text-italic text-body2">原售价:¥ 105.26</q-item-label>
                  <q-item-label class="text-h5 text-negative">¥ 55.26</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-scroll-area>
        </div>
        <div class="col-shrink q-pb-md">
          <q-separator color="primary"/>
          <q-card class="no-border-radius">
            <q-list>
              <q-item clickable v-ripple>
                <q-item-section>
                  <q-item-label>乔峰</q-item-label>
                  <q-item-label caption lines="1">卡号:8884564644654</q-item-label>
                </q-item-section>
                <q-item-section side top>155****9999</q-item-section>
              </q-item>
              <q-separator inset />
              <q-item clickable v-ripple>
                <q-item-section class="text-subtitle1 text-weight-bold">
                  共3件
                </q-item-section>
                <q-item-section side top>
                  <q-item-label class="text-h4 text-negative text-weight-bolder">¥ 49884855.26</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-card>
        </div>
      </div>
    </div>
    <!-- center -->
    <div class="col-shrink col-xs-2 col-sm-1 col-md-1 col-lg-1 col-xl-1">
      <div class="fit column no-wrap  justify-between items-stretch content-stretch">
        <div class="col-shrink q-px-xs">
           <q-btn color="deep-orange" @click="changeQuantityValue(1)" class="full-width q-my-xs" >
             <span class="text-h4">+</span>
           </q-btn>
           <q-btn color="orange" @click="changeQuantityValue(2)" class="full-width q-my-xs" >
             <span class="text-h4">-</span>
           </q-btn>
           <q-btn color="white" class="full-width q-my-xs q-py-sm" padding="none">
             <span class="text-subtitle1 q-my-xs text-black" @click="quantityDialogStatus = true">数量(*)</span>
           </q-btn>
           <q-btn color="white" class="full-width q-my-xs q-py-sm" padding="none">
             <span class="text-subtitle1 q-my-xs text-black" @click="sellPriceDialogStatus = true">改价(g)</span>
           </q-btn>
           <q-btn color="white" class="full-width q-my-xs q-py-sm" padding="none">
             <span class="text-subtitle1 q-my-xs text-black" @click="deleteAllData">清空(q)</span>
           </q-btn>
           <q-btn color="white" class="full-width q-my-xs q-py-sm" padding="none">
             <span class="text-subtitle1 q-my-xs text-black">挂单(h)
               <q-badge color="red" rounded floating >5</q-badge>
             </span>
           </q-btn>
           <q-btn color="white" class="full-width q-my-xs q-py-sm" padding="none"  @click="openReadingDialog">
             <span class="text-subtitle1 q-my-xs text-black">会员(m)</span>
           </q-btn>

        </div>
        <div class="col-shrink q-px-xs">
           <q-btn color="deep-orange" class="full-width q-py-sm q-mb-xs" no-caps @click="openCheckoutCounterPage()">
             <span class="text-h6 q-my-xs text-white">结账<br>(Ent)</span>
           </q-btn>
        </div>
      </div>
    </div>
    <!-- right -->
    <div class="col-shrink col-xs-7 col-sm-7 col-md-7 col-lg-7 col-xl-7">
      <right-layout :member_id="currentMemberInfo.id" :currentMemberInfo="currentMemberInfo" @refreshShoppingCart="refreshShoppingCart" />
      <!-- <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
        <div class="col-shrink bg-white q-px-xs q-pb-md">
          <q-tabs
            v-model="tab"
            align="left"
            inline-label
            outside-arrows
            mobile-arrows
            class="text-orange"
          >
            <q-tab name="mails"><span class="text-h6">全部</span></q-tab>
            <q-tab name="alarms" label="快捷" />
            <q-tab name="movies" label="水果" />
            <q-tab name="photos" label="零食" />
            <q-tab name="videos" label="生鲜" />
            <q-tab name="addressbook" label="百货" />
            <q-tab name="alarms1" label="快捷" />
            <q-tab name="movies2" label="水果" />
            <q-tab name="photos2" label="零食" />
            <q-tab name="videos2" label="生鲜" />
            <q-tab name="alarms2" label="快捷" />
            <q-tab name="movies15" label="水果" />
            <q-tab name="photos6" label="零食" />
            <q-tab name="videos4" label="生鲜" />
            <q-tab name="addressbook5" label="百货" />
            <q-tab name="addressbook6" label="百货" />
          </q-tabs>
          <q-separator color="deep-orange" />
        </div>
        <div class="col-shrink bg-white full-height">
          <q-scroll-area class="fit">
            <q-table
              grid
              :card-container-class="cardContainerClass"
              title="Treats"
              :data="data"
              :columns="columns"
              row-key="name"
              :filter="filter"
              hide-header
              :pagination.sync="pagination"
              :rows-per-page-options="rowsPerPageOptions"
            >
              <template v-slot:top-right>
                <q-input borderless dense debounce="300" v-model="filter" placeholder="Search">
                  <template v-slot:append>
                    <q-icon name="search" />
                  </template>
                </q-input>
              </template>

              <template v-slot:item="props">
                <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
                  <q-card>
                    <q-card-section class="text-center">
                      Calories for
                      <br>
                      <strong>{{ props.row.name }}</strong>
                    </q-card-section>
                    <q-separator />
                    <q-card-section class="flex flex-center" :style="{ fontSize: props.row.calories + 'px' }">
                      <div>{{ props.row.calories }} g</div>
                    </q-card-section>
                  </q-card>
                </div>
              </template>
            </q-table>
          </q-scroll-area>
        </div>
        <div class="col-shrink bg-white q-py-sm">
          <q-separator inset/>
          <q-list>
            <q-item>
              <q-item-section avatar>
                <q-btn outline color="primary" icon="arrow_back_ios" label="上一页" />
              </q-item-section>
              <q-item-section class="flex-center">
                <q-pagination
                  v-model="current"
                  :max="5"
                  direction-links
                  boundary-links
                  icon-first="skip_previous"
                  icon-last="skip_next"
                  icon-prev="fast_rewind"
                  icon-next="fast_forward"
                />
              </q-item-section>
              <q-item-section side>
                <q-btn outline color="primary" icon="arrow_forward_ios" label="下一页" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>
      </div> -->
    </div>

    <!-- 修改数量弹窗 -->
    <q-dialog v-model="quantityDialogStatus">
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * ($q.screen.name.indexOf(['xs', 'sm', 'md']) > -1 ? 0.6 : 0.4)) + 'px',
          'max-width': parseInt(this.$q.screen.width * ($q.screen.name.indexOf(['xs', 'sm', 'md']) > -1 ? 0.6 : 0.4)) + 'px',
        }"
      >
        <q-card-section>
          <q-input class="q-mb-md text-h6" v-model="quantityValue" outlined square>
            <template v-slot:prepend>
              数量
            </template>
          </q-input>
          <hl-keyboard
            :inputNumber="quantityValue"
            @changeNumber="
              (v) => {
                quantityValue = v
              }
            "
            @confirmEvent="editQuantityValue(3,quantityValue)"
            :decimal="true"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <!-- 修改价格弹窗 -->
    <q-dialog v-model="sellPriceDialogStatus">
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * ($q.screen.name.indexOf(['xs', 'sm', 'md']) > -1 ? 0.6 : 0.4)) + 'px',
          'max-width': parseInt(this.$q.screen.width * ($q.screen.name.indexOf(['xs', 'sm', 'md']) > -1 ? 0.6 : 0.4)) + 'px',
        }"
      >
        <q-card-section>
          <q-input class="q-mb-md text-h6" v-model="sellPriceValue" outlined square>
            <template v-slot:prepend>
              数量
            </template>
          </q-input>
          <hl-keyboard
            :inputNumber="sellPriceValue"
            @changeNumber="
              (v) => {
                sellPriceValue = v
              }
            "
            @confirmEvent="editSellPriceValueValue(sellPriceValue)"
            :decimal="true"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <hl-dialog-card-reading ref="cardReadingRef" v-if="cardReading" />
  </div>
</template>

<script>
import LeftLayout from './service/consume/LeftLayout.vue'
import RightLayout from './service/consume/RightLayout.vue'
export default {
  name: 'cash',
  components: {
    LeftLayout,
    RightLayout
  },
  data () {
    return {
      text: '',
      active: false,
      tab: 'mails',
      current: 3,
      quantityDialogStatus: false, // 修改数量弹窗状态
      quantityValue: '', // 数量文本框
      sellPriceDialogStatus: false, // 修改售价弹窗状态
      sellPriceValue: '', // 售价文本框
      cardReading: false, // 读卡弹窗状态
      currentMemberInfo: {} // 会员信息
    }
  },
  computed: {

  },

  watch: {

  },
  methods: {
    // 刷新购物车列表
    refreshShoppingCart () {
      this.$nextTick(() => {
        this.$refs.shoppingCarRef.getShoppingCartList()
      })
    },
    // 加 减 购物车选中商品数量
    changeQuantityValue (type, quantity) {
      this.$nextTick(() => {
        this.$refs.shoppingCarRef.changeQuantityValue(type, quantity)
      })
    },
    // 清空购物车
    deleteAllData () {
      this.$nextTick(() => {
        this.$refs.shoppingCarRef.deleteAllData()
      })
    },
    // 修改购物车选中商品数量
    editQuantityValue (type, quantity) {
      this.quantityDialogStatus = false
      this.quantityValue = ''
      this.$nextTick(() => {
        this.$refs.shoppingCarRef.changeQuantityValue(type, quantity)
      })
    },
    // 修改购物车选中商品售价
    editSellPriceValueValue (newPrice) {
      this.sellPriceDialogStatus = false
      this.sellPriceValue = ''
      this.$nextTick(() => {
        this.$refs.shoppingCarRef.changSellingValue(newPrice)
      })
    },
    // 结账
    openCheckoutCounterPage () {
      this.$nextTick(() => {
        this.$refs.shoppingCarRef.openCheckoutCounterPage()
      })
    },
    // 打开读卡界面
    openReadingDialog () {
      this.cardReading = true
      this.$nextTick(() => {
        this.$refs.cardReadingRef.openReaderDialog()
      })
    },
    // 获取读卡后数据
    getMemberInfo (memberInfo) {
      this.cardReading = false
      this.currentMemberInfo = memberInfo
    }
  }
}
</script>

<style lang="sass">
.grid-masonry
  flex-direction: column
  height: 700px

  &--2
    > div
      &:nth-child(2n + 1)
        order: 1
      &:nth-child(2n)
        order: 2

    &:before
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 1
  &--3
    > div
      &:nth-child(3n + 1)
        order: 1
      &:nth-child(3n + 2)
        order: 2
      &:nth-child(3n)
        order: 3

    &:before,
    &:after
      content: ''
      flex: 1 0 100% !important
      width: 0 !important
      order: 2
</style>
