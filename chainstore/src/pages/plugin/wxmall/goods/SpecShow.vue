<template>
  <div>
    <div class="row q-mt-xs" :key="key" v-for="(item, key) in specPriceData">
      <q-card flat class="row" v-if="item.chil && item.chil.length > 0">
        <q-card-section class="col-12 q-pa-xs">
          <q-item>
            <q-item-section>
              <q-item-label overline>{{ item.main_lable }}</q-item-label>
              <q-item-label class="text-center">{{ item.lable }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-card-section>
        <div class="col-12">
          <q-separator />
        </div>

        <div class="col-12">
          <spec-show :specPriceData="item.chil" />
        </div>
      </q-card>

      <div class="col-12 row" v-else>
        <q-card flat  class="q-mt-xs col-12">
          <q-card-section class="col-12 q-pa-xs">
            <q-item>
              <q-item-section>
                <q-item-label overline>{{ item.main_lable }}</q-item-label>
                <q-item-label class="text-center">{{ item.lable }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-separator class="q-my-sm" />
          <q-card-section class="row q-pa-xs q-col-gutter-sm" v-if="item.levelPrice && item.levelPrice.length > 0">
            <div class="col-6" :key="k" v-for="(i, k) in item.levelPrice">
              <q-input outlined dense v-model="i.wmp_member_price" :label="i.level_name + '会员价'" />
            </div>
          </q-card-section>

          <q-card-section class="row q-pa-xs q-col-gutter-sm" v-else>
            <q-item-section>
              <q-input outlined dense v-model="item.listPrice" readonly label="标价" />
            </q-item-section>
            <q-item-section>
              <q-input outlined dense v-model="item.sellPrice" readonly label="售价" />
            </q-item-section>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SpecShow',
  components: {},
  props: ['specPriceData'],
  data () {
    return {}
  },
  mounted () {},
  computed: {},
  created () {},
  methods: {}
}
</script>
