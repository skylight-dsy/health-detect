<template>
    <div class="app-container">
        <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
            <el-form-item label="量表名称" prop="scaleName">
                <el-input
                        v-model="queryParams.scaleName"
                        placeholder="请输入量表名称"
                        clearable
                        style="width: 150px"
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="用户名" prop="userName">
                <el-input
                        v-model="queryParams.userName"
                        placeholder="请输入用户名称"
                        clearable
                        style="width: 150px"
                        @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="分数" prop="scaleResult">
                <el-input
                    v-model="queryParams.scaleResult"
                    placeholder="请输入分数"
                    clearable
                    style="width: 150px"
                    @keyup.enter="handleQuery"
                />
            </el-form-item>
            <el-form-item label="预警情况" prop="warning">
                <el-select v-model="queryParams.warning" style="width: 150px" placeholder="请选择预警情况" clearable>
                    <el-option
                            v-for="dict in sys_scale_test"
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
                        type="danger"
                        plain
                        icon="Delete"
                        :disabled="multiple"
                        @click="handleDelete"
                        v-hasPermi="['system:result:remove']"
                >删除
                </el-button>
            </el-col>
            <el-col :span="1.5">
                <el-button
                        type="warning"
                        plain
                        icon="Download"
                        @click="handleExport"
                        v-hasPermi="['system:result:export']"
                >导出
                </el-button>
            </el-col>
            <right-toolbar v-model:show-search="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="resultList" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55" align="center"/>
            <el-table-column label="结果ID" align="center" prop="reId"/>
            <el-table-column label="量表名称" align="center" prop="scale.scaleName" show-overflow-tooltip="true"/>
            <el-table-column label="用户名" align="center" prop="user.userName"/>
            <el-table-column label="分数" align="center" prop="scaleResult"/>
            <el-table-column label="预警情况" align="center" prop="warning">
                <template #default="scope">
                    <dict-tag :options="sys_scale_test" :value="scope.row.warning"/>
                </template>
            </el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime" sortable />
            <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                <template #default="scope">
                    <el-tooltip content="删除" placement="top">
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)" v-hasPermi="['system:result:remove']"></el-button>
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

<script setup name="Result">
import {listResult, delResult} from "@/api/system/result";
import {getCurrentInstance, ref} from "vue";

const {proxy} = getCurrentInstance();
const {sys_scale_test} = proxy.useDict("sys_scale_test");

const loading = ref(true);
const ids = ref([]);
const multiple = ref(true);
const showSearch = ref(true);
const total = ref(0);
const resultList = ref([]);
const queryParams = ref({
    pageNum: 1,
    pageSize: 10,
    scaleName: null,
    userName: null,
    warning: null,
    scaleResult: null
});

/** 查询量表测试结果数据列表 */
function getList() {
    loading.value = true;
    listResult(queryParams.value).then((response) => {
        resultList.value = response.rows;
        total.value = response.total;
        loading.value = false;
    });
}

/** 搜索按钮操作 */
function handleQuery() {
    queryParams.value.pageNum = 1;
    getList();
}

/** 重置按钮操作 */
function resetQuery() {
    proxy.resetForm("queryForm");
    handleQuery();
}

// 多选框选中数据
function handleSelectionChange(selection) {
    ids.value = selection.map((item) => item.reId);
    multiple.value = !selection.length;
}

/** 删除按钮操作 */
function handleDelete(row) {
    const reIds = row.reId || ids.value;
    proxy.$modal.confirm('是否确认删除量表测试结果数据编号为"' + reIds + '"的数据项？').then(function () {
        return delResult(reIds);
    }).then(() => {
        getList();
        proxy.$modal.msgSuccess("删除成功");
    }).catch(() => {
    });
}

/** 导出按钮操作 */
function handleExport() {
    proxy.download('system/result/export', {
        ...queryParams.value
    }, `result_${new Date().getTime()}.xlsx`)
}

getList();
</script>
