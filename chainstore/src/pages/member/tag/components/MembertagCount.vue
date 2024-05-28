<template>
  <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
    <div class="col-shrink bg-white q-px-xs q-pb-lg ">
       <div class="col-12 col-md-8" v-if="is_main_store">
        <q-select
          label="查询门店"
          v-model="selectStoreData"
          option-value="id"
          option-label="name"
          multiple
          emit-value
          map-options
          dense
          outlined
          clearable
          use-chips
          :options="libInStoreList"
          @input="getList"
        />
      </div>
    </div>
    <div class="col-shrink q-pa-sm full-height bg-white q-mt-xs q-px-xl">
      <div id="chartPie" class="pie-member-tag"></div>
    </div>
  </div>
</template>
<script>
import * as echarts from 'echarts'
export default {
  name: 'MembertagCount',
  components: {},
  data () {
    return {
      labelData: [],
      data: [],
      selectStoreData: [],
      libInStoreList: []
    }
  },
  created () {
    if (this.is_main_store) {
      this.getLibInStoreData()
    }
  },
  mounted () {
    this.getList()
  },
  computed: {
    is_main_store () {
      return this.$store.getters['merchant/is_main_store']
    }
  },
  methods: {
    getLibInStoreData () {
      this.$store.dispatch('merchant/getLibInStoreData').then((res) => {
        if (res.code == 200) {
          this.libInStoreList = res.data ? res.data : []
        }
      })
    },
    getList () {
      this.$store.dispatch('membertag/getMembertagCount', { selectStoreData: this.selectStoreData }).then((res) => {
        if (res.code == 200 && res.data) {
          this.myEcharts(res.data)
        }
      })
    },

    myEcharts (labelData) {
      this.chartPie = echarts.init(document.getElementById('chartPie'), 'macarons')
      const option = {
        title: {
          text: '会员标签使用统计',
          left: 'center'
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '50%',
            data: labelData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      // 使用刚指定的配置项和数据显示图表。
      this.chartPie.setOption(option)
    }
  }
}
</script>
<style scope>
.pie-member-tag {
  width: 80%;
  height: 300px;
}
</style>
