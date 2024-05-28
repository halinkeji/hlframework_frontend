<template>
  <div id="chartDom" class="pie-wrap"></div>
</template>

<script>
import * as echarts from "echarts";
import "echarts/theme/macarons";
export default {
  props: ["sevenSummary"],
  data() {
    return {
      chartPie: null
    };
  },
  mounted() {
   
    this.$nextTick(() => {
      this.drawPieChart();
    });
  },
  watch: {
    sevenSummary() {
      this.drawPieChart();
    }
  },
  methods: {
    drawPieChart() {
      this.chartPie = echarts.init(
        document.getElementById("chartDom"),
        "macarons"
      );
      this.chartPie.setOption({
        title: {
          text: "近七天消费汇总"
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#6a7985"
            }
          }
        },

        legend: {
          data: this.sevenSummary.legend
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        xAxis: [
          {
            type: "category",
            boundaryGap: false,
            data: this.sevenSummary.time_data
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: this.sevenSummary.series
      });
    }
  }
};
</script>
<style scope>
.pie-wrap {
  width: 100%;
  height: 300px;
}
</style>
