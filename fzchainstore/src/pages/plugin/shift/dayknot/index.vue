<template>
  <q-page class="q-pa-sm">
    <q-markup-table separator="cell" flat bordered square>
      <thead>
        <tr>
          <th class="text-center">销售额</th>
          <th class="text-center">成本价</th>
          <th class="text-center">毛利润</th>
          <th class="text-center">固定成本</th>
          <th class="text-center">纯利润</th>
          <th class="text-center">纯毛占比</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="text-center">
            {{ formatAmount(dayknotCountData.psi_total_sell_amounts) }}
          </td>
          <td class="text-center">
            {{ formatAmount(dayknotCountData.psi_total_cost_price) }}
          </td>
          <td class="text-center">
            {{ formatAmount(dayknotCountData.psi_total_gross_profit) }}
          </td>
          <td class="text-center">
            <q-input dense outlined class="full-width" v-model="dayknotCountData.psi_fixed_costs" @input="computeDaykNot" />
          </td>
          <td class="text-center">
            {{ formatAmount(dayknotCountData.psi_pure_profit) }}
          </td>
          <td class="text-center">
            {{ dayknotCountData.psi_pure_say_profit }}
          </td>
        </tr>
      </tbody>
    </q-markup-table>

    <q-markup-table separator="cell" class="q-mt-sm" flat square>
      <thead>
        <tr>
          <th class="text-center">商品名称</th>
          <th class="text-center">规格</th>
          <th class="text-center">报损数量</th>
          <th class="text-center">成本价</th>
          <th class="text-center">总成本</th>
          <th class="text-center">原因</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in damagedGoodsList">
          <td class="text-center">
            {{ item.gic_name }}
          </td>
          <td class="text-center">
            {{ item.gic_speName }}
          </td>
          <td class="text-center">
            {{ item.gic_number }}
          </td>
          <td class="text-center">
            {{ item.gic_cost_price }}
          </td>
          <td class="text-center">{{ item.gic_subtotal_price }}</td>
          <td class="text-center">
            {{ item.gic_reason }}
          </td>
        </tr>
        <tr>
          <td class="text-center">
            合计
          </td>
          <td class="text-center"></td>
          <td class="text-center">
            {{ sumCompute('gic_number') }}
          </td>
          <td class="text-center">
            {{ sumCompute('gic_cost_price') }}
          </td>
          <td class="text-center">
            {{ sumCompute('gic_subtotal_price') }}
          </td>
          <td class="text-center"></td>
        </tr>
      </tbody>
    </q-markup-table>

    <q-markup-table separator="cell" class="q-mt-sm" flat square v-if="expensesData && expensesData.length > 0">
      <thead>
        <tr>
          <th class="text-center">单据号</th>
          <th class="text-center">类型名称</th>
          <th class="text-center">开支项</th>
          <th class="text-center">类型</th>
          <th class="text-center">开支金额</th>
          <th class="text-center">时间</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in expensesData">
          <td class="text-center">
            {{ item.pkr_invoice_code }}
          </td>
          <td class="text-center">
            {{ item.pkr_group_name }}
          </td>
          <td class="text-center">
            {{ item.pkr_item_name }}
          </td>
          <td class="text-center">
            <span v-if="parseInt(item.pkr_status) == 1">
              开支
            </span>
            <span v-if="parseInt(item.pkr_status) == 2">
              收入
            </span>
          </td>
          <td class="text-center">{{ item.pkr_price }}</td>
          <td class="text-center">
            {{ $q_date.formatDate(item.created_at * 1000, 'YYYY-MM-DD HH:mm:ss') }}
          </td>
        </tr>
        <tr>
          <td class="text-center">
            合计
          </td>
          <td class="text-center"></td>
          <td class="text-center"></td>
          <td class="text-center"></td>
          <td class="text-center">{{ sumComputeExpenses('pkr_price') }}</td>
          <td class="text-center"></td>
        </tr>
      </tbody>
    </q-markup-table>

    <div class="row q-mt-sm">
      <q-space />
      <div class="text-right">
        <q-btn color="primary" @click="saveSettlementRecord" unelevated label="今日结算" :disable="lastRecordStatus" />
        <div class="text-red text-caption">上次结算未确认，请先前往确认</div>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'dayknotDetail',
  components: {},
  data () {
    return {
      dayknotCountData: {},
      damagedGoodsList: [],
      expensesData: [],
      lastRecordStatus: false
    }
  },
  created () {},
  computed: {},
  mounted () {
    this.getLastRecordStatus()
    this.getDayNotCount()
  },
  methods: {
    getDayNotCount () {
      const params = {}
      this.$store
        .dispatch('shift/getDayKnotCount', params)
        .then((res) => {
          if (res.code == 200) {
            this.dayknotCountData = res.data ? res.data.count : {}
            this.damagedGoodsList = res.data ? res.data.damagedGoodsList : []
            this.expensesData = res.data ? res.data.expensesData : []
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

    // 格式化保留小数点后两位数据
    formatAmount (value) {
      if (isNaN(value) || value == '' || value == undefined) {
        return 0.0
      } else {
        return Math.round(parseFloat(value) * 100) / 100
      }
    },
    computeDaykNot () {
      this.dayknotCountData.psi_pure_profit = this.formatAmount(this.dayknotCountData.psi_total_gross_profit - this.dayknotCountData.psi_fixed_costs)
      this.dayknotCountData.psi_pure_say_profit = this.formatAmount(this.dayknotCountData.psi_pure_profit / this.dayknotCountData.psi_total_gross_profit)
    },
    getLastRecordStatus () {
      this.$store
        .dispatch('shift/getLastStatus')
        .then((res) => {
          if (res.code == 200) {
            this.lastRecordStatus = res.data
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },

    saveSettlementRecord () {
      const obj = {
        ...this.dayknotCountData
      }

      this.$store
        .dispatch('shift/saveDayknotRecord', obj)
        .then((res) => {
          if (res.code == 200) {
            this.$q.notify({
              message: '成功',
              caption: '生成日结记录成功',
              icon: 'ion-checkmark-circle-outline',
              timeout: 500,
              position: 'top-right',
              color: 'green'
            })
            this.$router.push({ name: 'dayknotRecord' })
          } else {
            this.$q.notify({
              message: '失败',
              icon: 'ion-close-circle-outline',
              timeout: 500,
              position: 'top-right',
              caption: res.message,
              color: 'red'
            })
          }
        })
        .catch((error) => {
          this.$q.notify({
            message: '失败',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right',
            caption: error.message,
            color: 'red'
          })
        })
    },

    sumCompute (field) {
      const that = this
      if (this.damagedGoodsList.length > 0) {
        return _.sumBy(this.damagedGoodsList, function (o) {
          return that.formatAmount(o[field])
        })
      }
      return 0
    },
    sumComputeExpenses (field) {
      const that = this
      if (this.expensesData.length > 0) {
        return _.sumBy(this.expensesData, function (o) {
          return that.formatAmount(o[field])
        })
      }
      return 0
    }
  }
}
</script>
