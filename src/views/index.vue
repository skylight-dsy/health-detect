<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card>
                    <el-statistic title="每日活跃用户" :value="268500"/>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <el-statistic :value="138">
                        <template #title>
                            <div style="display: inline-flex; align-items: center">
                                男女比例
                                <el-icon style="margin-left: 4px" :size="12">
                                    <Male/>
                                </el-icon>
                            </div>
                        </template>
                        <template #suffix>/100</template>
                    </el-statistic>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <el-statistic title="累计测评数" :value="172000"/>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card>
                    <el-statistic title="反馈数" :value="562">
                        <template #suffix>
                            <el-icon style="vertical-align: -0.125em">
                                <ChatLineRound/>
                            </el-icon>
                        </template>
                    </el-statistic>
                </el-card>
            </el-col>
        </el-row>
        <el-row gutter="20">
            <el-col :span="24">
                <el-card>
                    <chart2></chart2>
                </el-card>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card>
                    <chart1></chart1>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card>
                    <chart3></chart3>
                </el-card>
            </el-col>
            <el-col :span="8">
                <el-card>
                    <chart4></chart4>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup name="Index">
import Chart1 from "@/views/echart/chart1.vue";
import Chart2 from "@/views/echart/chart2.vue";
import Chart3 from "@/views/echart/chart3.vue";
import Chart4 from "@/views/echart/chart4.vue";

</script>

<style scoped>
.el-row {
    margin-bottom: 20px;
}

.el-row:last-child {
    margin-bottom: 0;
}

.el-col {
    border-radius: 4px;
    text-align: center;
}
</style>

