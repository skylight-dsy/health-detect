<template>
    <h3 style="display: flex;justify-content: center">实际上抑郁的人感觉到</h3>
    <div ref="charts" style="height: 400px;"></div>
</template>

<script setup>
import * as echarts from 'echarts';
import {onMounted, ref} from "vue";
const charts=ref(null)

onMounted(() => {
    init();
})

function init() {
    var mycharts = echarts.init(charts.value);
    var option = {
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                name: 'Access From',
                type: 'pie',
                radius: ['40%', '70%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: [
                    {value: 20, name: '绝望'},
                    {value: 14, name: '自我厌恶'},
                    {value: 14, name: '孤立'},
                    {value: 3, name: '焦虑'},
                    {value: 50, name: '悲伤'},
                    {value: 20, name: '负罪感'}

                ]
            }
        ]
    };
    mycharts.setOption(option);
}

</script>

<style scoped>

</style>