<template>
        <div ref="charts" style="height: 400px"></div>
</template>

<script setup >
import * as echarts from 'echarts';
import {onMounted, ref} from "vue";
const charts=ref(null);

onMounted(()=>{
  init();
})
function init()
{
  var mycharts=echarts.init(charts.value);
  var option = option = {

    title: {
      text: '各区域关注人数对比',

    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {},
    grid: {
      left: '3%',
      right: '5%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.05]
    },
    yAxis: {
      type: 'category',
      data: ['湖南省', '山东省', '山西省', '河南省', '河北省', '山西省']
    },
    series: [
      {
        name: '2021',
        type: 'bar',
        data: [18203, 23489, 29034, 104970, 131744, 130230]
      },
      {
        name: '2022',
        type: 'bar',
        data: [19325, 23438, 31000, 121594, 134141, 181807]
      }
    ]
  };
  mycharts.setOption(option);
}

</script>

<style scoped>

</style>