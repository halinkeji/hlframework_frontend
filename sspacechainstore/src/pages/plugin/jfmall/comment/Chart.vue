<template>
  <q-page class="fit">
    <div class="fit column no-wrap justify-between items-stretch content-stretch no-scroll">
      <div class="col-shrink q-pa-sm full-height bg-white">
        <q-scroll-area class="fit full-height">

          <div class="bg-white q-py-sm  q-px-sm" v-if="starCountData && starCountData.length > 0">
            <div class="row">
              <div class="q-px-sm col-3 q-pt-sm" v-for="(item, key) in starCountData" :key="key">
                <q-card flat bordered>
                  <!-- <q-icon name="star" size="xs" class="color_cinnabar absolute-top-right"> </q-icon> -->
                  <q-card-section align="center" class="q-pa-none q-py-sm">
                    <q-item>
                      <q-item-section>
                        <q-item-label class="text-h6 text-weight-bold ">{{ formatAmount(item.comment_sum) }}</q-item-label>
                        <q-item-label caption>{{ item.sum_label }}</q-item-label>
                      </q-item-section>

                    </q-item>

                  </q-card-section>
                  <q-separator />
                  <q-card-actions class="bg-primary text-white" align="center">
                    <div class="q-py-sm">
                      {{ item.serve_label }}
                    </div>
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </div>

          <div id="serviceChart" class="col-12 bg-white " :style="{ height: '500px' }"></div>
        </q-scroll-area>
      </div>
    </div>
  </q-page>
</template>
<script>
import echarts from 'echarts'
import { date } from 'quasar'
export default {
  name: 'chartsService',
  components: { echarts },
  data () {
    return {
      selectDate: 7,

      startTime: '',
      endTime: '',
      chartsData: {},
      countData: [],
      starCountData: [],
      serveStarData: [],
      serveItem: 'all',
      userStarData: {}
    }
  },
  created () {
    this.getchartsData()
  },
  mounted () {},
  computed: {},
  methods: {
    drawLine (topTenList) {
      const serviceChart = echarts.init(document.getElementById('serviceChart'))
      serviceChart.setOption({
        title: {
          text: '商品好评排行榜'
        },
        xAxis: {
          type: 'category',
          data: topTenList.x

        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: topTenList.s,
            type: 'bar',
            barWidth: 40
          }
        ]
      })
    },

    getchartsData () {
      const params = {

      }
      this.$store
        .dispatch('jfComment/getChartCount', params)
        .then((res) => {
          if (res.code == 200) {
            this.starCountData = res.data && res.data.starCountData ? res.data.starCountData : []
            const topTenList = res.data && res.data.topTenList ? res.data.topTenList : []
            this.drawLine(topTenList)
          }
        })
        .catch((err) => {
          this.$q.notify({
            message: '失败',
            caption: err.message,
            color: 'red',
            icon: 'ion-close-circle-outline',
            timeout: 500,
            position: 'top-right'
          })
        })
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
