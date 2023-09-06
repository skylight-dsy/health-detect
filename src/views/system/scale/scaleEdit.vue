<template>
    <div class="app-container">
        <el-row :gutter="20">
            <el-col :span="6">
                <el-card>
                    <el-collapse v-model="activeName">
                        <el-collapse-item title="选择组件" name="1">
                            <el-button @click="add('radio')">单选</el-button>
                            <el-button @click="add('checkbox')">多选</el-button>
                            <el-button @click="add('select')">选择填空</el-button>
                        </el-collapse-item>
                        <el-collapse-item title="配置项" name="2">
                            <span style="color: #5a5e66" class="mr20">预警分数</span>
                            <el-input-number v-model="form.wScore" :min="0"/>
                        </el-collapse-item>
                    </el-collapse>
                </el-card>
            </el-col>
            <el-col :span="18">
                <el-card>
                    <el-scrollbar height="700px">
                        <el-form :model="form" label-width="90px">
                            <p style="text-align: center;color: #5a5e66">{{ name }}</p>
                            <el-divider border-style="dashed"/>
                            <el-form-item label="量表名称">
                                <el-input v-model="form.name" placeholder="请输入量表名称"></el-input>
                            </el-form-item>
                            <el-form-item label="量表描述">
                                <el-input type="textarea" resize="none" :autosize="{ minRows: 2, maxRows: 4 }"
                                          v-model="form.desc" placeholder="请输入量表描述"></el-input>
                            </el-form-item>
                            <el-form-item :label="(index+1)+'.'" v-for="(item,index) in form.itemList"
                                          :key="index">
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
                                <!-- 上移、下移、删除 -->
                                <div style="margin-top: 10px">
                                    <el-button @click="handleItem('up', item)" v-if="index!==0">上移</el-button>
                                    <el-button @click="handleItem('down', item)" v-if="index!==form.itemList.length-1">
                                        下移
                                    </el-button>
                                    <el-button @click="handleItem('del', item)">删除</el-button>
                                    <el-button @click="edit(item, index)">编辑</el-button>
                                </div>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="onSubmit">立即提交</el-button>
                            </el-form-item>
                            <el-dialog
                                    :title="typeMap[questItem.type]"
                                    v-model="showItem"
                                    width="50%">
                                <el-form-item label="标题">
                                    <el-input v-model="itemTitle"></el-input>
                                </el-form-item>
                                <el-form-item label="添加选项">
                                    <el-input-number v-model="optionsNum" @change="handleChange" :min="1"
                                                     :max="10"></el-input-number>
                                </el-form-item>
                                <el-form-item :label="'选项'+(i+1)" v-for="(text, i) in itemText" :key="i">
                                    <el-row justify="space-between">
                                        <el-col :span="10">
                                            <el-input v-model="itemText[i].content"></el-input>
                                        </el-col>
                                        <el-col :span="2">分值</el-col>
                                        <el-col :span="10">
                                            <el-input-number v-model="itemText[i].score" :min="0"></el-input-number>
                                        </el-col>
                                    </el-row>
                                </el-form-item>
                                <template #footer>
                                    <el-button @click="clearItem">取 消</el-button>
                                    <el-button type="primary" @click="determine">确 定</el-button>
                                </template>
                            </el-dialog>
                        </el-form>
                    </el-scrollbar>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<script setup name="ScaleEdit">
import {getCurrentInstance, ref, watch} from "vue";
import {useRouter} from "vue-router";
import {addScale, getScale, updateScale} from "@/api/system/scale";

const router = useRouter();
const {proxy} = getCurrentInstance();

const name = ref('创建量表');
const activeName = ref('1');
const queryParams = ref({
    warnScore: 0,
    scaleName: '',
    scaleDescription: '',
    scaleContent: '',
});
const form = ref({
    name: '',
    desc: '',
    wScore: 0,
    itemList: []
});
const typeMap = ref({
    radio: '单选',
    checkbox: '多选',
    select: '选择填空'
});
const itemTitle = ref('');
const itemText = ref(new Array({}));
const questItem = ref({});
const showItem = ref(false);
const editIndex = ref('');
const optionsNum = ref(1);
const value = ref([]);

watch(showItem, (val) => {
    if (!val) {
        clearItem()
    }
})

function handleItem(val, item) {
    switch (val) {
        case 'up':
            moveUp(item);
            break;
        case 'down':
            moveDown(item);
            break;
        case 'del':
            delItem(item);
            break;
        default:
            throw new Error("该操作不存在！")
    }
}

function add(type) {
    questItem.value.type = type
    showItem.value = true
}

// 关闭弹窗，清空数据
function clearItem() {
    optionsNum.value = 1;
    itemTitle.value = '';
    itemText.value = [{}];
    questItem.value = {};
    showItem.value = false;
}

// 确定将选项添加进列表中进行渲染
function determine() {
    // 单选、多选、矩阵
    if (itemTitle.value === '') {
        proxy.$modal.msgWarning("请输入选项的标题内容");
        return;
    }
    for (var i = 0; i < itemText.value.length; i++) {
        if (itemText.value[i].content === '' || itemText.value[i].score === ''
            || itemText.value[i].content === undefined || itemText.value[i].score === undefined) {
            proxy.$modal.msgWarning("请完整输入每个选项内容");
            return;
        }
    }
    if (editIndex.value !== '') {
        questItem.value.title = itemTitle.value;
        questItem.value.textList = itemText.value;
        form.value.itemList.splice(parseInt(editIndex.value), 1, questItem.value);
        editIndex.value = '';
    } else {
        questItem.value.title = itemTitle.value;
        questItem.value.textList = itemText.value;
        form.value.itemList.push(questItem.value);
    }
    clearItem();
}

function handleChange(currentValue, oldValue) {
    itemText.value.length = currentValue;
    if (currentValue > oldValue) {
        for (let i = oldValue; i < currentValue; i++) {
            itemText.value[i] = {};
        }
    }
}

// 上移
function moveUp(item) {
    let index = form.value.itemList.indexOf(item)
    form.value.itemList.splice(index, 1)
    form.value.itemList.splice(index - 1, 0, item)
}

// 下移
function moveDown(item) {
    let index = form.value.itemList.indexOf(item)
    moveUp(form.value.itemList[index + 1])
}

// 删除
function delItem(item) {
    let index = form.value.itemList.indexOf(item)
    form.value.itemList.splice(index, 1)
}

// 编辑
function edit(item, index) {
    editIndex.value = index
    optionsNum.value = item.textList.length
    showItem.value = true
    questItem.value = item
    itemTitle.value = item.title
    itemText.value = []
    itemText.value.push(...item.textList)
}

// 提交
function onSubmit() {
    if (form.value.name === '') {
        proxy.$modal.msgWarning("请输入标题内容");
        return;
    }
    if (form.value.desc === '') {
        proxy.$modal.msgWarning("请输入量表描述内容");
        return;
    }
    if (form.value.itemList.length === 0) {
        proxy.$modal.msgWarning("至少添加一个选项");
        return;
    }
    queryParams.value.warnScore = form.value.wScore;
    queryParams.value.scaleName = form.value.name;
    queryParams.value.scaleDescription = form.value.desc;
    queryParams.value.scaleContent = JSON.stringify(form.value);
    if (router.currentRoute.value.params.scaleId) {
        updateScale(queryParams.value).then(res => {
            proxy.$modal.msgSuccess("修改成功");
            proxy.$tab.refreshPage();
        }).catch(err => {
            proxy.$modal.msgError(err);
        })
    } else {
        addScale(queryParams.value).then(res => {
            proxy.$modal.msgSuccess("创建成功");
            proxy.$tab.refreshPage();
        }).catch(err => {
            proxy.$modal.msgError(err);
        })
    }
}
//删除和修改判断
function addOrEdit() {
    if (router.currentRoute.value.params.scaleId) {
        name.value = '修改量表';
        queryParams.value.scaleId = router.currentRoute.value.params.scaleId;
        getScale(router.currentRoute.value.params.scaleId).then(res => {
            form.value.name = res.data.scaleName;
            form.value.desc = res.data.scaleDescription;
            form.value.wScore = res.data.warnScore;
            form.value.itemList = JSON.parse(res.data.scaleContent).itemList;
        }).catch(err => {
            proxy.$modal.msgError(err);
        })
    }
}
addOrEdit();
</script>

<style scoped>
:deep(.el-form-item__content) {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    flex-direction: column;
}
</style>