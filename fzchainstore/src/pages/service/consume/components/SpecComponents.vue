<template>
  <div class="flex flex-wrap">
    <!-- 规格弹出框 -->
    <q-dialog v-model="specificationPopup">
      <q-card
        :style="{
          width: parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 0.8 : 0.6)) + 'px',
          'max-width': parseInt(this.$q.screen.width * (['xs', 'sm', 'md'].indexOf($q.screen.name) > -1 ? 0.8 : 0.6)) + 'px',
        }"
      >
        <q-toolbar>
          <q-toolbar-title>
            商品规格
          </q-toolbar-title>
          <q-btn flat round dense icon="close" @click="specificationPopup = false" />
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
                    v-if="currentGoodsInfo.coverImage"
                    :ratio="1"
                    :src="currentGoodsInfo.coverImage && currentGoodsInfo.coverImage.id ? $q.localStorage.getItem('fzchainstore_system_local').attach_url + currentGoodsInfo.coverImage.path : ''"
                  />

                  <q-img v-else :ratio="1">
                    <template v-slot:default>
                      <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                        暂无封面
                      </div>
                    </template>
                  </q-img>

                  <q-card-section class="q-pa-xs" style="font-size:10px">
                    <div class="text-subtitle2 ellipsis">{{ props.row.cad_color_name }},{{ props.row.cad_size_name }}</div>
                    <div class=" text-dark">
                      {{ props.row.cad_skc_code }}
                    </div>

                    <q-item-label class="text-primary row">
                      {{ $q.localStorage.getItem('fzchainstore_store_local').storeBaseConfig.consume_base_moneySymbol }} {{ props.row.cad_price }}

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
        { name: 'cad_color_name', label: '名称', field: 'cad_color_name' },
        { name: 'cad_size_name', label: '名称', field: 'cad_size_name' },
        { name: 'cad_skc_code', label: '条码', field: 'cad_skc_code' },
        { name: 'cad_price', label: '售价', field: 'cad_price' },
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

      this.$emit('confirmWeighResult', item, 2, this.currentGoodsInfo)
    },
    // 规格商品
    specificationBut (val, data) {
      const obj = {
        goods_id: val
      }
      this.$store
        .dispatch('consume/getSpecification', obj)
        .then((res) => {
          if (res.data) {
            this.specificationPopup = true
            this.specificationData = res.data
            this.currentGoodsInfo = data
          }
        })
        .catch((error) => {})
    }
  }
}
</script>
