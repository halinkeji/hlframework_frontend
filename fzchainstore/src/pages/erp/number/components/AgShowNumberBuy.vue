<template>
  <div :style="{ 'max-width': params.colDef.width, width: params.colDef.width }">
     <div class="bg-white ">
      <div class="row q-pa-xs text-center bg-grey-3" v-if="sizeData.length > 0">
        <div class="col" v-for="i in sizeData">{{ i.name }} <q-separator :vertical="true" /></div>
      </div>
      <div class="row q-pa-sm  text-center" style="border-left:1px solid #d2d2d2;border-bottom:1px solid #d2d2d2;border-right:1px solid #d2d2d2;">
        <div class="col text-grey" v-for="item in params.data.buy_number">
      
          {{ item.number ? item.number : 0 }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AgShowNumberBuy',
  data () {
    return {
      sizeData: [],
      
    }
  },
  mounted () {},
  computed: {},
  created () {
    this.sizeData = this.params.data.size
  },
  methods: {}
}
</script>
