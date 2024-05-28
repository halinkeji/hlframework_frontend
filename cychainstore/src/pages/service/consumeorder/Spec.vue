<template>
  <q-dialog @hide="hideNowPage" v-model="showDialog">
    <q-card
      :style="{
        width: this.$q.screen.width * 0.6 + 'px',
        'min-width': this.$q.screen.width * 0.6 + 'px',
      }"
    >
      <q-card-section class="row items-center q-py-sm">
        <div class="text-subtitle2">
          多规格商品
        </div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-separator />
      <q-form ref="specFormRef">
        <q-card-section horizontal>
          <q-card-section class="q-pa-sm">
            <div v-if="dishesData.coverImage">
              <q-img :src="$q.localStorage.getItem('cychainstore_system_local').attach_url + dishesData.coverImage.path" :ratio="16 / 10" />
            </div>
            <div v-else>
              <q-img :ratio="16 / 10">
                <div class="absolute-full flex flex-center bg-grey-3 text-dark">
                  <q-icon name="wallpaper" color="grey" size="60px"> </q-icon>
                </div>
              </q-img>

            </div>
            <q-card-section>
              <div class="text-subtitle1 ">{{ dishesData.goo_name }}</div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div class="text-caption text-grey-8">编码：</div>
              <div class="text-caption">{{ dishesData.goo_code }}</div>
            </q-card-section>
          </q-card-section>

          <q-separator vertical />
          <q-card-section class="q-pa-sm full-width">
            <div class="row q-col-gutter-sm full-width" v-if="foodSpec">
              <div class="col-6" v-for="(item, key) in foodSpec" :key="key">
                <q-card bordered flat>
                  <q-card-section class="q-pa-xs">
                    <div class="text-subtitle2 text-center">
                      {{ item.fsm_name }} <q-badge rounded v-if="parseInt(item.fsm_required) == 1" color="positive"> 必选 </q-badge> <q-badge rounded v-if="parseInt(item.fsm_multiple) == 2" color="positive"> 可多选 </q-badge>
                    </div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section class="q-pa-sm">
                    <div v-if="item.sonItem && parseInt(item.fsm_multiple) == 2" class="row">
                      <q-field :rules="[(val) => val.length > 0 || '当前选项不可为空']" v-model="selectedSpec[item.id]" class="full-width">
                        <template v-slot:control>
                          <div class="row q-gutter-sm">
                            <div v-for="(i, k) in item.sonItem" :key="k">

                              <q-btn
                                :outline="selectedSpec[item.id].indexOf(i.id) > -1 ? false : true"
                                :unelevated="selectedSpec[item.id].indexOf(i.id) > -1 ? true : false"
                                rounded
                                color="positive"
                                @click="addSpecData(selectedSpec[item.id], i.id)"
                              >

                              {{ i.fss_name }} <span class="text-caption text-weight-bold q-px-sm">¥{{ i.fss_price }}</span>
                              </q-btn>
                            </div>
                          </div>
                        </template>
                      </q-field>
                    </div>
                    <div v-else>
                      <q-field :rules="[(val) => val.length > 0 || '当前选项不可为空']" v-model="selectedSpec[item.id]" class="full-width">
                        <template v-slot:control>
                          <div class="row q-gutter-sm">
                            <div v-for="(i, k) in item.sonItem" :key="k">
                              <!-- <q-radio color="positive" size="lg" checked-icon="task_alt" v-model="selectedSpec[item.id]" :val="i.id">
                              {{ i.fss_name }}
                            </q-radio> -->
                              <q-btn
                                :outline="selectedSpec[item.id].indexOf(i.id) > -1 ? false : true"
                                :unelevated="selectedSpec[item.id].indexOf(i.id) > -1 ? true : false"
                                rounded
                                color="positive"
                                @click="selectedSpec[item.id] = i.id"
                              >
                              {{ i.fss_name }} <span class="text-caption text-weight-bold q-px-sm">¥{{ i.fss_price }}</span>
                              </q-btn>
                            </div>
                          </div>
                        </template>
                      </q-field>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <div class="row q-col-gutter-sm full-width q-mt-sm" v-if="dishesData.foodAttributes">
              <div class="col-6" v-for="(item, key) in dishesData.foodAttributes" :key="key">
                <q-card bordered flat>
                  <q-card-section class="q-pa-xs">
                    <div class="text-subtitle2 text-center">{{ item.fsm_name }}</div>
                  </q-card-section>
                  <q-separator />
                  <q-card-section class="q-pa-sm">
                    <div class="row q-gutter-sm">
                      <div v-for="(i, k) in item.sonItem" :key="k">
                        <q-btn
                          :outline="selectedAttributes[item.id].indexOf(i.id) > -1 ? false : true"
                          :unelevated="selectedAttributes[item.id].indexOf(i.id) > -1 ? true : false"
                          rounded
                          :label="i.fss_name"
                          color="positive"
                          @click="selectedAttributes[item.id] = i.id"
                        />
                      </div>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>

            <q-card-actions align="center">
              <q-btn @click="setDeskCarData" unelevated rounded :disable="addButtonDisabled" color="positive" :label="`加入购物车¥${totalAmount}`" />
            </q-card-actions>
          </q-card-section>
        </q-card-section>
      </q-form>
    </q-card>
  </q-dialog>
</template>
<script>
export default {
  name: 'Spec',
  components: {},
  data () {
    return {
      showDialog: true,
      addButtonDisabled: false,

      dishesData: {},
      selectedSpec: [],
      selectedAttributes: [],
      foodSpec: [],
      currentDeskId: ''
      // totalAmount: 0
    }
  },
  created () {},
  mounted () {},
  computed: {
    totalAmount () {
      let totalAmountData = 0
      const that = this
      const foodSpec = this.foodSpec
      if (this.selectedSpec) {
        const selectedSpec = this.selectedSpec
        for (const item in this.selectedSpec) {
          if (selectedSpec[item] && Array.isArray(selectedSpec[item])) {
            if (selectedSpec[item] && selectedSpec[item].length > 0) {
              selectedSpec[item].forEach(function (i) {
                totalAmountData += that.formatAmount(foodSpec[item].sonItem[i].fss_price)
              })
            }
          } else if (selectedSpec[item]) {
            totalAmountData += that.formatAmount(foodSpec[item].sonItem[selectedSpec[item]].fss_price)
          }
        }
      }
      return totalAmountData
    }
  },
  methods: {
    init (id, deskId, levelId, memberId) {
      this.showDialog = true
      this.currentDeskId = deskId
      if (id > 0) {
        this.$store
          .dispatch('dishes/getOrderFoodData', { id })
          .then((res) => {
            if (res.code == 200) {
              this.dishesData = res.data ? res.data.foodData : {}
              this.foodSpec = res.data ? res.data.foodSpec : []

              this.selectedSpec = res.data ? res.data.selectedSpec : []
              this.selectedAttributes = res.data ? res.data.selectedAttributes : []
            } else {
              this.$q.notify({
                message: '失败',
                icon: 'ion-close-circle-outline',
                timeout: 500,
                position: 'top-right',
                caption: '操作失败',
                color: 'red'
              })
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
      }
    },
    addSpecData (data, value) {
      if (data.indexOf(value) > -1) {
        data.splice(data.indexOf(value), 1)
      } else {
        data.push(value)
      }
    },

    setDeskCarData () {
      this.$refs.specFormRef.validate().then((success) => {
        if (success) {
          this.showDialog = false
          const item = this.dishesData
          const params = {
            doc_food_id: item.id,
            doc_food_name: item.goo_name,
            doc_food_code: item.goo_code,
            doc_status: -1,
            doc_desk_id: this.currentDeskId,
            doc_list_price: this.totalAmount,
            doc_selling_price: this.totalAmount,
            doc_quantity: 1,
            selectedSpec: this.selectedSpec,
            selectedAttributes: this.selectedAttributes,
            doc_goods_service: item.goo_goodsOrService
          }

          if (item.fl_is_limit_time == 1 && item.last_buy_quantity > 0) {
            params.doc_selling_price = item.tld_discount_price
            params.doc_time_limit_discount_price = item.tld_discount_price
            params.doc_is_limit_time = item.fl_is_limit_time
            params.doc_limit_quantity = item.tld_limit_quantity
            params.doc_limit_time_start = item.tld_time_start
            params.doc_limit_time_end = item.tld_time_end
          }
          this.$emit('addSpecData', params)
        } else {
          // oh no, user has filled in
          // at least one invalid value
        }
      })

      return false
    },
    hideNowPage () {
      this.$emit('dataList')
      this.addButtonDisabled = false
    },
    changeSelectedSpec (i, key) {
      this.selectedSpec[key].s_name = i.fss_name
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
