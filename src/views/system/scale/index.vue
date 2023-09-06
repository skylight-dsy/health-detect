<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="量表名称" prop="scaleName">
                <el-input
                        v-model="queryParams.scaleName"
                        placeholder="请输入量表名称"
                        clearable
                        style="width: 240px"
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="量表描述" prop="scaleDescription">
                <el-input
                        v-model="queryParams.scaleDescription"
                        placeholder="请输入量表描述"
                        clearable
                        style="width: 240px"
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="状态" prop="status" v-hasRole="['admin']">
                <el-select
                    v-model="queryParams.status"
                    placeholder="量表状态"
                    clearable
                    style="width: 240px"
                >
                    <el-option
                        v-for="dict in sys_normal_disable"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                    />
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
                <el-button icon="Refresh" @click="resetQuery">重置</el-button>
            </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
            <el-col :span="1.5">
                <el-button
                        type="primary"
                        plain
                        icon="Plus"
                        @click="handleAdd"
                        v-hasPermi="['system:scale:add']" v-hasRole="['admin']"
                >新增
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="success"
                        plain
                        icon="Edit"
                        :disabled="single"
                        @click="handleUpdate"
                        v-hasPermi="['system:scale:edit']" v-hasRole="['admin']"
                >修改
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="danger"
                        plain
                        icon="Delete"
                        :disabled="multiple"
                        @click="handleDelete"
                        v-hasPermi="['system:scale:remove']" v-hasRole="['admin']"
                >删除
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="warning"
                        plain
                        icon="Download"
                        @click="handleExport"
                        v-hasPermi="['system:scale:export']"
                >导出
                </el-button>
            </el-col>
            <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="scaleList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="量表ID" align="center" prop="scaleId"/>
            <el-table-column label="计算公式ID" align="center" prop="calId" v-hasRole="['admin']"/>
            <el-table-column label="量表名称" align="center" prop="scaleName" show-overflow-tooltip="true"/>
            <el-table-column label="量表描述" align="center" prop="scaleDescription" show-overflow-tooltip="true"/>
            <el-table-column label="预警分数" align="center" prop="warnScore" v-hasRole="['admin']"/>
            <el-table-column label="量表状态" align="center" prop="status" v-hasRole="['admin']">
                <template #default="scope">
                    <el-switch
                            v-model="scope.row.status"
                            active-value="0"
                            inactive-value="1"
                            @change="handleStatusChange(scope.row)"
                    ></el-switch>
                </template>
            </el-table-column>
            <el-table-column label="创建者" align="center" prop="createBy"/>
            <el-table-column label="创建时间" align="center" prop="createTime"/>
            <el-table-column label="更新者" align="center" prop="updateBy"/>
            <el-table-column label="更新时间" align="center" prop="updateTime"/>
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-tooltip content="修改" placement="top">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                                   v-hasPermi="['system:scale:edit']" v-hasRole="['admin']"></el-button>
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                                   v-hasPermi="['system:scale:remove']" v-hasRole="['admin']"></el-button>
                    </el-tooltip>
                    <el-tooltip content="测试" placement="top">
                        <el-button link type="primary" icon="DataLine" @click="handleTest(scope.row)"
                                   v-hasPermi="['system:scale:query']"></el-button>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>

        <pagination
                v-show="total>0"
                :total="total"
                v-model:page="queryParams.pageNum"
                v-model:limit="queryParams.pageSize"
                @pagination="getList"
        />

    </div>
</template>

<script setup name="Scale">
import {listScale, delScale, changeScaleStatus} from "@/api/system/scale";
import {useRouter} from "vue-router";
import {getCurrentInstance, reactive, ref, toRefs} from "vue";

// vue3语法
const router = useRouter();
const { proxy } = getCurrentInstance();
const { sys_normal_disable } = proxy.useDict("sys_normal_disable");

const scaleList = ref([]);
const open = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const menuRef = ref(null);
const deptRef = ref(null);


const data = reactive({
    // 查询参数
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        scaleName: null,
        scaleDescription: null,
        status: null,
    },
});

const { queryParams } = toRefs(data);


/** 查询量表列表 */
function getList() {
    loading.value = true;
    listScale(queryParams.value).then(response => {
        scaleList.value = response.rows;
        total.value = response.total;
        loading.value = false;
    });
}
/** 搜索按钮操作 */
function handleQuery() {
    queryParams.pageNum = 1;
    getList();
}
/** 重置按钮操作 */
function resetQuery() {
    proxy.resetForm("queryForm");
    handleQuery();
}
// 多选框选中数据
function handleSelectionChange(selection) {
    ids.value = selection.map(item => item.scaleId)
    single.value = selection.length !== 1
    multiple.value = !selection.length
}
/** 新增按钮操作 */
function handleAdd() {
    router.push("/system/scale-edit/index");
}
/** 修改按钮操作 */
function handleUpdate(row) {
    const scaleId = row.scaleId
    router.push("/system/scale-edit/index/" + scaleId);
}
/** 测试按钮操作 */
function handleTest(row) {
    const scaleId = row.scaleId
    router.push("/system/scale-test/index/" + scaleId);
}
/** 量表状态修改 */
function handleStatusChange(row) {
    let text = row.status === "0" ? "启用" : "停用";
    proxy.$modal.confirm('确认要"' + text + '""' + row.scaleName + '"量表吗?').then(function () {
        return changeScaleStatus(row.scaleId, row.status);
    }).then(() => {
        proxy.$modal.msgSuccess(text + "成功");
    }).catch(function () {
        row.status = row.status === "0" ? "1" : "0";
    });
}
/** 删除按钮操作 */
function handleDelete(row) {
    const scaleIds = row.scaleId || ids.value;
    proxy.$modal.confirm('是否确认删除量表编号为"' + scaleIds + '"的数据项？').then(function () {
        return delScale(scaleIds);
    }).then(() => {
        getList();
        proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {
    });
}
/** 导出按钮操作 */
function handleExport() {
    proxy.download('system/scale/export', {
        ...queryParams.value,
    }, `scale_${new Date().getTime()}.xlsx`)
}

getList();
</script>

<style scoped>
:deep(.el-popper){
    max-width: 500px;
}
</style>
