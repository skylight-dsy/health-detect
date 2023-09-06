<template>
    <h3 style="display: flex;justify-content: center">霍兰德人格六角形模型</h3>
    <div style="display: flex;justify-content: center">
        <div ref="charts" style="height: 400px;width: 300px;"></div>
    </div>
</template>

<script setup >
import * as echarts from 'echarts';
import {onMounted, ref} from "vue";
const charts=ref(null)

onMounted(()=>{
  init();
})
function init()
{
  var mycharts=echarts.init(charts.value);
  var option = {
    legend: {
      data: ['模型A', '模型B'],
    },
    radar: {
      // shape: 'circle',
      indicator: [
        { name: '适用型', max: 6500 },
        { name: '事物型', max: 16000 },
        { name: '企业型', max: 30000 },
        { name: '社会型', max: 38000 },
        { name: '艺术型', max: 52000 },
        { name: '研究型', max: 25000 }
      ]
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        data: [
          {
            value: [4200, 3000, 20000, 35000, 50000, 18000],
            name: '模型A'
          },
          {
            value: [5000, 14000, 28000, 26000, 42000, 21000],
            name: '模型B'
          }
        ]
      }
    ]
  };
  mycharts.setOption(option);
}

</script>

<style scoped>

</style>