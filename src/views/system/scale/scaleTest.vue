<template>
    <div class="app-container">
        <el-card>
            <el-row :gutter="20">
                <el-col :span="6"></el-col>
                <el-col :span="12">
                    <el-form v-model="form">
                        <el-form-item>
                            <p style="text-align: center;color: #303133;font-weight: 600;
                            font-size: 20px;">{{ form.scaleName }}</p>
                            <p style="color: #A8ABB2">{{ form.scaleDescription }}</p>
                        </el-form-item>
                        <el-form-item :label="(index+1)+'.'" v-for="(item,index) in form.scaleContent.itemList"
                                      :key="index" class="bg">
                            <div v-text='item.title'></div>
                            <!-- 单选 -->
                            <div v-if="item.type==='radio'">
                                <el-radio-group v-model="value[index]">
                                    <el-radio :label="elm.score" v-for="(elm, i) in item.textList" :key="i">
                                        {{ elm.content }}
                                    </el-radio>
                                </el-radio-group>
                            </div>

                            <!-- 多选 -->
                            <div v-else-if="item.type==='checkbox'">
                                <el-checkbox-group v-model="value[index]">
                                    <el-checkbox :label="elm.score" v-for="(elm, i) in item.textList" :key="i">
                                        {{ elm.content }}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </div>

                            <!-- 选择填空 -->
                            <div v-else-if="item.type === 'select'">
                                <el-select v-model="value[index]" placeholder="请选择">
                                    <el-option
                                            v-for="(elm, i) in item.textList" :key="i"
                                            :label="elm.content"
                                            :value="elm.score">
                                    </el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">立即提交</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="6"></el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script setup name="scaleTest">
import {getCurrentInstance, reactive, ref} from "vue";
import {useRouter} from "vue-router";
import {getScale} from "@/api/system/scale";
import {addResult} from "@/api/system/result";

const router = useRouter();
const {proxy} = getCurrentInstance();

const value = ref([]);
const scaleResult = ref(null);
const form = reactive(
    {
        scaleName: null,
        scaleDescription: null,
        scaleContent: {
            itemList: []
        },
    }
);
const queryParams = reactive({
    scaleId: null,
    scaleResult: null,
    warning: '',
});

// 获取量表信息
function getScales() {
    getScale(router.currentRoute.value.params.scaleId).then(response => {
        form.scaleName = response.data.scaleName;
        form.scaleDescription = response.data.scaleDescription;
        form.scaleContent = JSON.parse(response.data.scaleContent);
    }).catch(error => {
        proxy.$modal.msgError(error);
    });
}

// 检查填写情况
function check() {
    let flag = true;
    form.scaleContent.itemList.forEach((item, index) => {
        if (item.type === 'radio' || item.type === 'checkbox') {
            if (value.value[index] === undefined) {
                flag = false;
            }
        } else if (item.type === 'select') {
            if (value.value[index] === undefined || value.value[index] === '') {
                flag = false;
            }
        }
    });
    return flag;
}

// 计算分数
function calculate() {
    let score = 0;
    form.scaleContent.itemList.forEach((item, index) => {
        if (item.type === 'radio') {
            if (value.value[index] !== undefined) {
                score += value.value[index];
            }
        } else if (item.type === 'checkbox') {
            if (value.value[index] !== undefined) {
                for (let i = 0; i < value.value[index].length; i++) {
                    score += value.value[index][i];
                }
            }
        } else if (item.type === 'select') {
            if (value.value[index] !== undefined && value.value[index] !== '') {
                score += value.value[index];
            }
        }
    });
    return score;
}

//提交结果
function onSubmit() {
    if (!check()) {
        proxy.$modal.msgError("请填写完整后提交");
        return;
    }
    proxy.$modal.confirm("确认要提交吗？").then(function () {
        scaleResult.value = calculate();
        queryParams.scaleId = parseInt(router.currentRoute.value.params.scaleId);
        queryParams.scaleResult = scaleResult.value;
        if (scaleResult.value > form.scaleContent.wScore) {
            queryParams.warning = '1';
        } else {
            queryParams.warning = '0';
        }
        const obj = { path: "/assessment/scale/evaluation" };
        addResult(queryParams).then(() => {
        }).catch(error => {
            proxy.$modal.msgError(error);
        });
        proxy.$tab.closeOpenPage(obj);
    }).then(function () {
        proxy.$modal.msgSuccess( "提交成功");
    }).catch(() => {
        proxy.$modal.msgError("取消提交");
    });
}

getScales();
</script>

<style scoped lang="scss">
.bg {
  :deep(.el-form-item__content) {
      align-items: flex-start;
  }
}
:deep(.el-form-item__content) {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    flex-direction: column;
}
</style>