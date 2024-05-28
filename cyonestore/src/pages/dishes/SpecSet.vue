<template>
  <div class="fit bg-white row q-col-gutter-sm">
    <div class="row col-12">
      <div class="col-3 q-mb-sm ">
        <q-select
          outlined
          dense
          :rules="[(val) => !!val || '请选择菜品属性']"
          v-model="dishesData.goo_goodsOrService"
          :disable="dishesData.id > 0"
          :options="serviceTypeOptions"
          label="菜品属性"
          emit-value
          map-options
        />
      </div>
    </div>

    <div class="col-3 q-mb-sm" v-if="parseInt(dishesData.goo_goodsOrService) < 3">
      <q-list bordered>
        <q-item>
          <q-item-section>
            是否启用规格
          </q-item-section>

          <q-item-section side v-if="parseInt(dishesData.goo_size) == 1">
            <q-btn unelevated color="primary" @click="addSpecification()" label="新增规格"
          /></q-item-section>
          <q-item-section side>
            <q-checkbox true-value="1" false-value="0" v-model="dishesData.goo_size"
          /></q-item-section>
        </q-item>
      </q-list>
    </div>

    <div class="col-3 q-mb-sm" v-if="parseInt(dishesData.goo_goodsOrService) < 3">
      <q-list bordered>
        <q-item>
          <q-item-section>
            是否启用原料
          </q-item-section>

          <q-item-section side>
            <q-checkbox true-value="1" false-value="0" v-model="dishesData.fl_is_material"
          /></q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="col-3 q-mb-sm">
      <q-list bordered>
        <q-item>
          <q-item-section>
            是否启用会员级别价
          </q-item-section>
          <q-item-section side>
            <q-checkbox
              true-value="1"
              false-value="0"
              @input="updateLevelPriceStatus"
              v-model="dishesData.fl_is_member_level_price"
          /></q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="row col-12 q-col-gutter-sm">
      <div class="col-12 col-md-3 ">
        <q-input
          outlined
          dense
          v-model="dishesData.goo_listPrice"
          label="标价"
          :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入标价']"
        >
          <template v-slot:append>
            <span class="text-dark text-caption">{{
              $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneyUnit
            }}</span>
          </template>
        </q-input>
      </div>

      <div class="col-12 col-md-3 ">
        <q-input
          outlined
          dense
          v-model="dishesData.goo_purchasePrice"
          label="入库价"
          :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入库价']"
          v-if="parseInt(dishesData.goo_goodsOrService) == 1"
        >
          <template v-slot:append>
            <span class="text-dark text-caption">{{
              $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneyUnit
            }}</span>
          </template>
        </q-input>
      </div>
    </div>

    <div class="row col-12 full-width q-col-gutter-sm " v-if="parseInt(dishesData.goo_size) == 1 && parseInt(dishesData.goo_goodsOrService) < 3">
      <div class="col-4" v-for="(item, key) in specMain" :key="key">
        <q-card flat bordered>
          <q-item class="q-mt-sm">
            <q-item-section>
              <q-input  outlined dense bottom-slots label="规格名称" v-model="item.fsm_name"> </q-input>
            </q-item-section>
            <q-item-section side class="q-mb-md">
              <q-btn-toggle
                v-model="item.fsm_multiple"
                class="my-custom-toggle"
                rounded
                unelevated
                toggle-color="primary"
                color="white"
                text-color="primary"
                :options="[
                  { label: '单选', value: '1' },
                  { label: '多选', value: '2' },
                ]"
              />
            </q-item-section>
            <q-item-section side class="q-mb-md">
              <q-checkbox true-value="1"  false-value="0" label="是否必选" v-model="item.fsm_required" />
            </q-item-section>
            <q-item-section side class="q-mb-md">
              <q-btn unelevated color="red" dense  @click="deleteSpecification(item, key)" icon="las la-trash-alt" round />
            </q-item-section>
          </q-item>
          <q-separator />

          <q-card-section class="q-pa-sm">
            <q-card flat bordered class="q-pa-sm q-mt-sm" v-for="(i, k) in item.sonItem" :key="k">

              <q-item >
                <q-item-section>
                  <q-input outlined bottom-slots  label="子规格名称" dense v-model="i.fss_name"> </q-input>
                </q-item-section>
                <q-item-section>
                  <q-input
                    outlined
                    bottom-slots
                    label="规格单价"
                    dense
                    v-model="i.fss_price"
                    :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入规格单价']"
                  >
                    <template v-slot:append>
                      <span class="text-dark text-caption">{{
                        $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneyUnit
                      }}</span>
                    </template>
                  </q-input>
                </q-item-section>

                <q-item-section>
                  <q-input
                    outlined
                    bottom-slots
                    label="入库单价"
                    dense
                    v-model="i.fss_purchase_price"
                    :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入入库单价']"
                  >
                    <template v-slot:append>
                      <span class="text-dark text-caption">{{
                        $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneyUnit
                      }}</span>
                    </template>
                  </q-input>
                </q-item-section>

                <q-item-section side top>
                  <q-btn
                    unelevated
                    color="red"
                    dense
                    icon="las la-trash-alt"
                    round
                    @click="deleteSpecificationSum(i, key, k)"
                  />
                </q-item-section>
              </q-item>

              <q-item-section v-if="parseInt(dishesData.fl_is_member_level_price) == 1">
                <div class="row q-col-gutter-sm">
                  <div class="col-12" v-for="(value, ks) in i.fss_level_price">
                    <q-card flat>
                      <q-card-section class="text-subtitle2 q-pa-sm text-center">
                        {{ value.levelName }}
                      </q-card-section>
                      <q-separator />
                      <q-item>
                        <q-item-section>
                          <q-input
                            outlined
                            bottom-slots
                            label="单价"
                            dense
                            v-model="value.price"
                            :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入单价']"
                          >
                            <template v-slot:append>
                              <span class="text-dark text-caption">{{
                                $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneyUnit
                              }}</span>
                            </template>
                          </q-input>
                        </q-item-section>

                        <q-item-section>
                          <q-input outlined bottom-slots label="折扣" dense v-model="value.discount">
                            <template v-slot:append>
                              <span class="text-dark text-caption">%</span>
                            </template>
                          </q-input>
                        </q-item-section>
                      </q-item>
                    </q-card>
                  </div>
                </div>
              </q-item-section>
              <q-list v-if="parseInt(dishesData.fl_is_material) == 1">
                <q-item>
                  <q-item-section>
                    <q-item-label>已开启原料开关，请选择当前规格所需原料</q-item-label>
                  </q-item-section>

                  <q-item-section side >
                    <q-btn unelevated color="primary"  @click="bindMaterial(key, k)" label="选择原料" dense />
                  </q-item-section>
                </q-item>

                <q-item :key="ks + k" v-for="(value, ks) in i.materialData">
                  <q-item-section>
                    {{ value.fmb_material_name }}
                  </q-item-section>
                  <q-item-section>
                    <q-input
                      outlined
                      bottom-slots
                      label="数量"
                      dense
                      v-model="value.fmb_material_quantity"
                      :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入数量']"
                    >
                      <template v-slot:append>
                        <span class="text-dark text-caption"> {{ value.fmb_material_unit }}</span>
                      </template>
                    </q-input>
                  </q-item-section>
                  <q-item-section side class="q-mb-md">
                    <q-btn unelevated color="red"  @click="deleteMaterialData(key,k,ks)" dense icon="las la-trash-alt" round />
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </q-card-section>
          <q-separator v-if="item.sonItem && item.sonItem.length > 0" />
          <q-card-actions align="center">
            <q-btn unelevated color="primary"  @click="addSubSpecification(key)" label="添加子规格" />
          </q-card-actions>
        </q-card>
      </div>
    </div>

    <div class="row col-12 q-col-gutter-sm" v-if="parseInt(dishesData.fl_is_member_level_price) == 1">
      <div class="col-4" v-for="(item, key) in flLevelPrice">
        <q-card flat bordered>
          <q-card-section class="text-subtitle2 q-pa-sm text-center">
            {{ item.levelName }}
          </q-card-section>
          <q-separator />
          <q-item>
            <q-item-section>
              <q-input
                outlined
                bottom-slots
                label="单价"
                dense
                v-model="item.price"
                :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入单价']"
              >
                <template v-slot:append>
                  <span class="text-dark text-caption">{{
                    $q.localStorage.getItem('cyonestore_store_local').storeBaseConfig.consume_base_moneyUnit
                  }}</span>
                </template>
              </q-input>
            </q-item-section>

            <q-item-section>
              <q-input outlined bottom-slots  label="折扣" dense v-model="item.discount">
                <template v-slot:append>
                  <span class="text-dark text-caption">%</span>
                </template>
              </q-input>
            </q-item-section>
          </q-item>
        </q-card>
      </div>
    </div>

    <div class="row col-12 q-col-gutter-sm" v-if="parseInt(dishesData.fl_is_material) == 1 && parseInt(dishesData.goo_size) != 1">
      <div class="col-4">
        <q-list bordered>
          <q-item>
            <q-item-section>
              <q-item-label>已开启原料开关，请选择当前规格所需原料</q-item-label>
            </q-item-section>

            <q-item-section side >
              <q-btn unelevated color="primary" @click="bindMainMaterial" label="选择原料" dense />
            </q-item-section>
          </q-item>

          <q-item :key="'material' + key" v-for="(item, key) in mainMaterialData">
            <q-item-section>
              {{ item.fmb_material_name }}
            </q-item-section>
            <q-item-section>
              <q-input
                outlined
                bottom-slots
                label="数量"
                dense
                v-model="item.fmb_material_quantity"
                :rules="[(val) => /^(\d+|\d+\.\d{1,2})$/.test(val) || '请输入数量']"
              >
                <template v-slot:append>
                  <span class="text-dark text-caption"> {{ item.fmb_material_unit }}</span>
                </template>
              </q-input>
            </q-item-section>
            <q-item-section side class="q-mb-md">
              <q-btn unelevated color="red" @click="deleteMainMaterialData(key)" dense icon="las la-trash-alt" round />
            </q-item-section>
          </q-item>
        </q-list>
      </div>

    </div>

    <div class="row col-12" v-if="parseInt(dishesData.goo_goodsOrService) == 3">
      <div class="col-12">
        <q-btn unelevated color="primary" label="选择菜品" @click="openSelectFoodDialog" />
      </div>
      <div class="col-6 q-mt-sm">
        <q-table
          flat
          bordered
          :data="packageData"
          :columns="packageColumns"
          row-key="name"
          hide-bottom
          hide-pagination
          :pagination="{
            rowsPerPage: 0,
          }"
        >
          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td key="fp_name" :props="props">
                {{ props.row.fp_name }}
              </q-td>

              <q-td key="fp_spec_mian_name" :props="props">
                {{ props.row.fp_spec_mian_name }}
              </q-td>

              <q-td key="fp_spec_son_name" :props="props">
                {{ props.row.fp_spec_son_name }}
              </q-td>

              <q-td key="fp_list_price" :props="props">
                {{ props.row.fp_list_price }}
              </q-td>

              <q-td key="fp_quantity" :props="props">
                <q-input outlined v-model="props.row.fp_quantity" dense label="数量" />
              </q-td>

              <q-td key="fp_goods_id" :props="props">
                <q-btn
                  round
                  color="negative"
                  icon="las la-trash"
                  unelevated
                  @click="delPackageData(props.rowIndex)"
                  dense
                />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>

    <hl-material-list
      ref="materialListDialogRef"
      v-if="showMaterialList"
      @getSelectedData="getSelectedData"
      @closeDialog="showMaterialList = false"
    />

    <hl-foods-list ref="foodListDialogRef" v-if="showFoodsList" @getSelectedFoodsData="getSelectedFoodsData" @closeDialog="showFoodsList = false" />
  </div>
</template>
<script>
import HlMaterialList from '../material/hl-material-list/index.vue'
import { LocalStorage } from 'quasar'
export default {
  name: 'SpecSet',
  components: { HlMaterialList },
  props: {},
  data () {
    return {
      specMain: [],

      dishesData: {
        goo_listPrice: '',
        goo_purchasePrice: '',
        goo_size: '0',
        fl_is_member_level_price: '0',
        goo_goodsOrService: '3',
        fl_is_material: '0'
      },
      levelData: [],
      flLevelPrice: [],
      serviceTypeOptions: [
        { label: '启用库存', value: '1' },
        { label: '关闭库存', value: '2' },
        { label: '启用套餐', value: '3' }
      ],
      showFoodsList: false,
      showMaterialList: false,
      packageColumns: [
        {
          name: 'fp_name',
          label: '商品名称',
          align: 'left',
          field: 'fp_name'
        },

        { name: 'fp_spec_mian_name', label: '主规格', field: 'fp_spec_mian_name' },
        { name: 'fp_spec_son_name', label: '子规格', field: 'fp_spec_son_name' },
        { name: 'fp_list_price', label: '售价', field: 'fp_list_price' },
        { name: 'fp_quantity', label: '数量', field: 'fp_quantity' },
        { name: 'fp_goods_id', label: '操作', field: 'fp_goods_id' }
      ],
      packageData: [],
      materialSpecKey: -1,
      materialSpecK: -1,
      mainMaterialData: []
    }
  },
  created () {},
  mounted () {},
  computed: {

  },
  methods: {
    setCurrentDishes (value) {
      this.dishesData = value

      if (parseInt(value.goo_size) == 1) {
        this.specMain = value.foodSpec
      }
      if (parseInt(value.fl_is_material) == 1) {
        this.mainMaterialData = value.mainMaterialData
      }

      this.flLevelPrice = value.fl_level_price
      if (parseInt(this.dishesData.fl_is_member_level_price) == 1) {
        this.getMenberLevelPriceList()
      }
      if (parseInt(value.goo_goodsOrService) == 3) {
        this.packageData = value.foodPackage && value.foodPackage.length > 0 ? value.foodPackage : []
      }
    },

    updateLevelPriceStatus () {
      if (parseInt(this.dishesData.fl_is_member_level_price) == 1) {
        this.getMenberLevelPriceList()
      }
    },

    // 新增规格方法
    addSpecification () {
      this.specMain.push({
        fsm_name: '',
        fsm_multiple: '1',
        fsm_required: '1',
        sonItem: []
      })
      this.$emit('setSpecData', this.specMain)
    },

    // 新增子规格方法
    addSubSpecification (key) {
      const that = this
      const levelPrice = []
      if (this.levelData && this.levelData.length > 0) {
        const levelData = this.levelData

        levelData.forEach(function (item, key) {
          levelPrice.push({
            levelId: item.id,
            price: 0,
            discount: 0,
            levelName: item.mcl_level_name
          })
        })
      }

      this.$nextTick(() => {
        this.specMain[key].sonItem.push({
          fss_name: '',
          fss_code: '',
          fss_price: '',
          fss_purchase_price: '',
          fss_level_price: levelPrice,
          materialData: []
        })
      })
    },

    // 删除规格方法
    deleteSpecification (item, key) {
      this.specMain.splice(key, 1)
      this.$emit('setSpecData', this.specMain)
    },

    // 删除子规格方法
    deleteSpecificationSum (i, key, k) {
      this.specMain[key].sonItem.splice(k, 1)
      this.$emit('setSpecData', this.specMain)
    },

    getMenberLevelPriceList () {
      this.$store
        .dispatch('level/getAllData')
        .then((res) => {
          if (res.code == 200) {
            this.levelData = res.data ? res.data : []
            if (parseInt(this.dishesData.goo_size) == 1) {
              if (this.levelData && this.levelData.length > 0 && this.specMain && this.specMain.length > 0) {
                this.combinationSpecData()
              }
            } else {
              if (this.levelData && this.levelData.length > 0) {
                this.combinationData()
              }
            }
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-checkmark-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
    },

    combinationData () {
      const that = this
      if (this.levelData && this.levelData.length > 0) {
        const levelData = this.levelData

        levelData.forEach(function (item, key) {
          if (_.findIndex(that.flLevelPrice, function (o) { return o.levelId == item.id }) < 0) {
            that.flLevelPrice.push({
              levelId: item.id,
              price: 0,
              discount: 0,
              levelName: item.mcl_level_name
            })
          }
        })
      }
    },

    combinationSpecData () {
      if (this.specMain && this.specMain.length > 0 && this.levelData && this.levelData.length > 0) {
        const levelData = this.levelData
        const specMain = this.specMain
        specMain.forEach(function (item, key) {
          if (item.sonItem && item.sonItem.length > 0) {
            item.sonItem.forEach(function (i, k) {
              if (i.fss_level_price && !Array.isArray(i.fss_level_price)) {
                i.fss_level_price = JSON.parse(i.fss_level_price)
              } else {
                i.fss_level_price = []
              }

              levelData.forEach(function (vs, ks) {
                if (_.findIndex(i.fss_level_price, function (o) { return o.levelId == vs.id }) < 0) {
                  i.fss_level_price.push({
                    levelId: vs.id,
                    price: 0,
                    discount: 0,
                    levelName: vs.mcl_level_name
                  })
                }
              })
            })
          }
        })
      }
    },
    openSelectFoodDialog () {
      this.showFoodsList = true
      this.$nextTick(() => {
        setTimeout(() => {
          this.$refs.foodListDialogRef.getInquireType([1, 2])
        }, 500)
      })
    },
    getSelectedFoodsData (value) {
      if (value && value.length > 0) {
        this.packageData = value.map((item) => {
          return {
            fp_name: item.goo_name,
            fp_spec_mian_name: item.spec_main_name,
            fp_spec_son_name: item.spec_son_name,
            fp_list_price: item.goo_listPrice,
            fp_spec_son_id: item.spec_son_id,
            fp_spec_main_id: item.spec_main_id,
            fp_goods_id: item.id,
            fp_food_id: item.foodId,
            fp_goods_service: item.goo_goodsOrService
          }
        })
      }
    },
    delPackageData (key) {
      this.packageData.splice(key, 1)
    },

    bindMaterial (key, k) {
      if (key > -1 && k > -1) {
        this.materialSpecKey = key
        this.materialSpecK = k
        this.showMaterialList = true
        this.$nextTick(() => {
          this.$refs.materialListDialogRef.getList()
        })
      }
    },

    bindMainMaterial () {
      this.materialSpecKey = -1
      this.materialSpecK = -1
      this.showMaterialList = true
      this.$nextTick(() => {
        this.$refs.materialListDialogRef.getList()
      })
    },

    getSelectedData (data) {
      const that = this
      if (that.materialSpecKey > -1 && that.materialSpecK > -1) {
        const materialData = that.specMain[that.materialSpecKey].sonItem[that.materialSpecK].materialData
        data.forEach(function (item, key) {
          if (_.findIndex(materialData, function (o) { return parseInt(o.fmb_material_id) == parseInt(item.id) }) < 0) {
            materialData.push({
              fmb_material_name: item.cm_name,
              fmb_material_unit: item.cm_unit,
              fmb_material_id: item.id,
              fmb_material_quantity: 0
            })
          }
        })

        this.materialSpecKey = -1
        this.materialSpecK = -1
        this.showMaterialList = false
      } else {
        const mainMaterialData = this.mainMaterialData
        data.forEach(function (item, key) {
          if (_.findIndex(mainMaterialData, function (o) { return parseInt(o.fmb_material_id) == parseInt(item.id) }) < 0) {
            mainMaterialData.push({
              fmb_material_name: item.cm_name,
              fmb_material_unit: item.cm_unit,
              fmb_material_id: item.id,
              fmb_material_quantity: 0
            })
          }
        })
      }
    },

    deleteMaterialData (key, k, ks) {
      const that = this
      that.specMain[key].sonItem[k].materialData.splice(ks, 1)
    },

    deleteMainMaterialData (key) {
      const that = this
      that.mainMaterialData.splice(key, 1)
    }
  }
}
</script>
<style lang="sass" scoped>
.my-custom-toggle
  border: 1px solid #027be3
</style>
