<template>
    <h3 style="display: flex;justify-content: center">心理分析</h3>
    <div ref="charts" style="height: 400px"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import {ref, onMounted} from "vue";
const charts = ref(null);

onMounted(() => {
    init();
})

function init() {
    var mycharts = echarts.init(charts.value);
    var option = {
        title: {
            text: '心理异常分析',
            subtext: 'Psychological anomaly analysis',
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
                name: '正常',
                type: 'pie',
                radius: '50%',
                data: [
                    {value: 92, name: '正常'},
                    {value: 5, name: '严重异常'},
                    {value: 3, name: '轻度异常'},
                    /* { value: 484, name: 'Union Ads' },
                     { value: 300, name: 'Video Ads' }*/
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    mycharts.setOption(option);
}

</script>

<style scoped>

</style>