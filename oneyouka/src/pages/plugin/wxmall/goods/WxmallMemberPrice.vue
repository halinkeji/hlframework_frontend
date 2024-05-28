<template>
  <div class="row">
    <q-table
      :data="levelMemberPriceList"
      flat
      square
      :pagination="{
        rowsPerPage: 0,
      }"
      hide-bottom
      bordered
      :columns="columnDefs"
      row-key="name"
      separator="cell"
      class="full-width"
    >
      <template v-slot:body="props">
        <q-tr :props="props">
          <q-td key="level_id" :props="props">
            {{ props.row.level_name }}
          </q-td>
          <q-td key="spe_name" :props="props">
            {{ props.row.spe_name }}
          </q-td>
          <q-td key="wmp_member_price" :props="props">
            <q-input outlined dense v-model="props.row.wmp_member_price"  />
          </q-td>
          <q-td key="wmp_point_price" :props="props">
            <q-input outlined dense v-model="props.row.wmp_point_price"  />
          </q-td>
          <q-td key="wmp_balance_price" :props="props">
            <q-input outlined dense v-model="props.row.wmp_balance_price"  />
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </div>
</template>
<script>
export default {
  name: 'WxmallMemberPrice',
  props: [],
  components: {},
  data () {
    return {
      levelMemberPriceList: [],
      columnDefs: [
        { name: 'level_id', align: 'center', label: '会员级别', field: 'level_id' },
        { name: 'spe_name', align: 'center', label: '规格', field: 'spe_name' },
        { name: 'wmp_member_price', align: 'center', label: '会员价', field: 'wmp_member_price' },
        { name: 'wmp_point_price', align: 'center', label: this.$q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_integralUnit + '价', field: 'wmp_point_price' },
        { name: 'wmp_balance_price', align: 'center', label: this.$q.localStorage.getItem('oneyouka_store_local').storeBaseConfig.consume_base_balanceUnit + '价', field: 'wmp_balance_price' }
      ]
    }
  },
  mounted () {},
  computed: {},
  created () {

  },
  methods: {
    setLevelPriceData (val) {
      this.levelMemberPriceList = val && val.length > 0 ? val : []
    }
  }
}
</script>
