<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="5">
                <el-card>
                    <el-row justify="center" style="margin: 5px 0 15px 0">
                        <el-button type="primary" style="padding: 12px 25px" icon="Plus" plain>新建诊断</el-button>
                    </el-row>
                    <el-collapse v-model="activeName">
                        <el-collapse-item title="历史记录" name="1">
                            <el-scrollbar height="500px">

                            </el-scrollbar>
                        </el-collapse-item>
                    </el-collapse>
                </el-card>
            </el-col>
            <el-col :span="19">
                <el-card>
                    <div style="min-height: calc(100vh - 400px)">
                        <div class="box-upload">
                            <strong style="font-size: 26px">欢迎使用，智能面诊</strong>
                        </div>
                        <div class="box-upload">
                            <el-radio-group v-model="radio1" size="large" fill="#626aef">
                                <el-radio-button label="普通模式" />
                                <el-radio-button label="极速模式" />
                                <el-radio-button label="精准模式" />
                            </el-radio-group>
                        </div>
                        <div style="margin: 0 250px">
                            <el-upload
                                    class="upload-demo"
                                    drag
                                    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
                                    multiple
                            >
                                <svg-icon icon-class="upload2"  class-name='upload-icon' />
                                <div class="el-upload__text">
                                    <p>
                                        <strong style="font-size: 26px">点击 或 拖拽</strong>
                                    </p>
                                    <p>
                                        即可上传面象文件
                                    </p>
                                </div>
                            </el-upload>
                        </div>
                        <div class="box-upload">
                            <el-button color="#626aef" size="large">开始诊断</el-button>
                        </div>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup>
import {ref} from 'vue'

const activeName = ref('1')
const radio1 = ref('普通模式')

</script>
<style scoped>
.box-upload {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 35px 0;
}
:deep(.el-radio-button__inner:hover) {
    color: #626aef;
}
.upload-icon {
    width: 100px;
    height: 100px;
    color: #626aef;
}
</style>