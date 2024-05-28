<template>
  <div class="flex flex-wrap">
    <!-- 规格弹出框 -->
    <q-dialog v-model="specificationPopup" persistent @hide="specificationPopup = false">
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 0.8 : 0.6)) + 'px',
          'max-width': parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 0.8 : 0.6)) + 'px',
        }"
      >
        <q-toolbar>
          <q-toolbar-title class="text-center"> 商品规格</q-toolbar-title>
           <q-btn icon="close" flat round dense v-close-popup @click="specificationPopup = false" />
        </q-toolbar>
        <q-card-section>
          <q-table
            grid
            :card-container-class="cardContainerClass"
            :data="specificationData"
            :columns="columns"
            row-key="id"
            hide-header
            hide-bottom
            class="full-width"
            hide-pagination
            :pagination="page"
          >
            <template v-slot:item="props">
              <div class="q-pa-xs col-xs-12 col-sm-6 col-md-2">
                <q-card @click="confirmWeighResult(props.row)" flat bordered>

                  <q-img
                  :src="currentGoodsInfo.coverImage && currentGoodsInfo.coverImage.id ? $q.localStorage.getItem('lschainstore_system_local').attach_url + currentGoodsInfo.coverImage.path : ''"
                  :ratio="1"
                  class="full-width"
                >
                 <template v-if="!currentGoodsInfo.coverImage">
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

                  <q-card-section class="q-pa-xs" style="font-size:10px">
                    <div class="text-subtitle2 ellipsis">{{ props.row.sl_title }}</div>
                    <div class=" text-dark">
                      {{ props.row.sl_barCode }}
                    </div>

                    <q-item-label class="text-primary row">
                      {{ $q.localStorage.getItem('lschainstore_store_local').storeBaseConfig.consume_base_moneySymbol }} {{ props.row.sl_sellingPrice }}

                      <div class="text-orange q-px-sm">
                        {{ props.row.sl_inventory }}
                      </div>
                    </q-item-label>
                  </q-card-section>
                </q-card>
              </div>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  name: 'WeighSpecComponents',
  components: {},
  data () {
    return {
      specificationPopup: false,
      specificationData: [],
      currentGoodsInfo: {},
      columns: [
        { name: 'id', label: 'id', field: 'id' },
        { name: 'sl_title', label: '名称', field: 'sl_title' },
        { name: 'sl_barCode', label: '条码', field: 'sl_barCode' },
        { name: 'sl_sellingPrice', label: '售价', field: 'sl_sellingPrice' },
        { name: 'sl_inventory', label: '库存', field: 'sl_inventory' }
      ],
      page: {
        pageTotal: 0,
        sortBy: 'desc',
        descending: false,
        page: 1,
        rowsPerPage: 18
      }
    }
  },

  mounted () {},
  created () {},
  computed: {
    // 处理表格自适应
    cardContainerClass () {
      // if (this.$q.screen.gt.xs) {
      //   return 'grid-masonry grid-masonry--' + (this.$q.screen.gt.sm ? '3' : '2')
      // }

      return void 0
    }
  },
  watch: {},
  methods: {
    confirmWeighResult (item) {
      this.specificationPopup = false
      this.$emit('confirmWeighResult', this.currentGoodsInfo, this.currentGoodsInfo.goods_id, item.id)
    },
    // 规格商品
    specificationBut (val, level, data) {
      const obj = {
        id: val,
        level_id: level
      }
      this.$store
        .dispatch('jfExchange/getGoods', obj)
        .then((res) => {
          if (res.data) {
            this.currentGoodsInfo = data || {}

            this.specificationData = res.data.goodsSpecificationLink ? res.data.goodsSpecificationLink : []
            this.specificationPopup = true
          }
        })
        .catch((error) => {})
    }
  }
}
</script>
