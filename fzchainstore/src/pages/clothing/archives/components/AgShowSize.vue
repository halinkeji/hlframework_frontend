<template>
  <div :style="{ 'max-width': params.colDef.width, width: params.colDef.width }">
    <!-- <div class="row q-pa-sm text-center" v-if="sizeData.length > 0">
      <q-table
       title="尺寸"
        :data="sizeData"
        :columns="storedData"
        row-key="name"
        hide-bottom
        flat
        :pagination="{
          rowsPerPage: 0,
        }"
        bordered
        separator="vertical"
      />
    </div> -->
    <div class=" q-pa-sm q-mt-sm">
      <div class="row q-pa-sm text-center" v-if="sizeData.length > 0">
        <div class="col " v-for="i in sizeData">{{ i.name }} <q-separator :vertical="true" /></div>
      </div>
      <!-- <div class="row q-pa-sm  text-center" v-for="item in invoiceData.memberRechargeCountDetail">
        <div class="col text-grey">
          {{ item.mrc_goodsName + (item.mrc_speName ? item.mrc_speName : '') }}
        </div>
        <div class="col text-grey">{{ item.mrc_count }}</div>
        <div class="col text-grey" v-if="item.countDetail">
          {{ item.countDetail.mrc_count }}
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'AgShowSize',
  data () {
    return {
      sizeData: [],
      storedData: [
        {
          label: '尺寸',
          align: 'center',
          field: 'name'
        }
      ]
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
