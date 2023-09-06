<template>
    <div class="app-container">
        <el-card class="home">
            <el-scrollbar height="650px" ref="main">
                <el-container id="main">
                    <el-main style="min-height: calc(100vh - 320px)">
                        <div v-if="showChat">
                            <el-row justify="center">
                                <el-row style="flex-direction: column">
                                    <strong style="font-size: 26px">欢迎使用，AI心理咨询助手</strong>
                                    <div style="margin-top: 20px">
                                        由AI驱动的心理咨询助手，可能出现意外和错误，请确保核对事实
                                    </div>
                                </el-row>
                            </el-row>
                            <el-row :gutter="30" justify="center">
                                <el-col :span="6">
                                    <el-row justify="center">
                                        😘 了解情绪状态
                                    </el-row>
                                    <el-row justify="center">
                                        <el-card @click="checkMsg" shadow="hover" style="cursor: pointer">
                                            “我最近总感觉心情很烦躁，这是为什么呢？有什么方法可以缓解吗？”
                                        </el-card>
                                    </el-row>
                                </el-col>
                                <el-col :span="6">
                                    <el-row justify="center">
                                        🙌 获取信息咨询
                                    </el-row>
                                    <el-row justify="center">
                                        <el-card @click="checkMsg" shadow="hover" style="cursor: pointer">
                                            “我想了解一下心理学相关的知识，可以给我推荐一些心理学相关的书籍吗?”
                                        </el-card>
                                    </el-row>
                                </el-col>
                                <el-col :span="6">
                                    <el-row justify="center">
                                        😉 心理支持和建议
                                    </el-row>
                                    <el-row justify="center">
                                        <el-card @click="checkMsg" shadow="hover" style="cursor: pointer">
                                            “我最近遇到了一些困难，感觉有些无助，不知道该怎么办，可以给我一些建议吗？”
                                        </el-card>
                                    </el-row>
                                </el-col>
                            </el-row>
                        </div>
                        <div v-for="(item, index) in historyC"
                             :key="index">
                            <el-row style="flex-wrap: nowrap;" v-for="(msg, i) in item" :key="i"
                                    :class=" i % 2 === 0 ? rowRe : ''">
                                <el-avatar :src="i % 2 === 0 ? avatar : robot"></el-avatar>
                                <div class="msg">{{ msg }}</div>
                            </el-row>
                        </div>
                    </el-main>
                    <el-footer>
                        <el-row>
                            <el-button icon="Delete" size="large" circle
                                       style="margin-right: 10px" @click="clearHistory"></el-button>
                            <div :style="send" class="send-box">
                                <el-icon>
                                    <ChatLineSquare/>
                                </el-icon>
                                <el-input
                                        v-model="input"
                                        :autosize="{ minRows: 1, maxRows: 10 }"
                                        type="textarea"
                                        resize="none"
                                        placeholder="有问题尽管问我..."
                                        maxlength="1000"
                                        show-word-limit
                                        style="display: flex;flex-direction: column-reverse"
                                        @keydown="sendMsg"
                                />
                                <el-button icon="Position" class="btn-send" type="text"
                                           @click="sendMsg"></el-button>
                            </div>
                        </el-row>
                    </el-footer>
                </el-container>
            </el-scrollbar>
        </el-card>
    </div>
</template>

<script setup>
import {getCurrentInstance, nextTick, onMounted, onUpdated, ref, watch} from "vue";
import useUserStore from "@/store/modules/user";
import {getChat} from "@/api/chat";
import robotImg from "@/assets/images/robot.png";

const name = 'ChatPsy AI心理咨询助手';
const {proxy} = getCurrentInstance();
const userStore = useUserStore();
const input = ref('');
const historyC = ref([]);
const message = ref({prompt: "", history: []});
const avatar = ref(userStore.avatar);
const robot = ref(robotImg);
const rowRe = ref('rowRe');
const send = ref({
    boxShadow: '0px 0.3px 0.9px rgba(0, 0, 0, 0.12), 0px 1.6px 3.6px rgba(0, 0, 0, 0.16)',
    borderRadius: '50px',
    padding: '5px 20px',
    backgroundColor: '#FFFFFF',
    width: '60%',
    alignItems: 'center',
});
const showChat = ref(true);

function checkMsg(e) {
    input.value = e.target.innerText;
    sendMsg(e);
}

function handleMessageChange() {
    if (input.value.split('\n').length > 1) {
        send.value.borderRadius = '10px';
        send.value.alignItems = 'flex-start';
    } else {
        send.value.borderRadius = '50px';
        send.value.alignItems = 'center';
    }
}

watch(input, () => {
    handleMessageChange();
});

watch(historyC, () => {
    scrollToBottom();
});

function scrollToBottom() {
    nextTick(() => {
        proxy.$refs.main.setScrollTop(document.getElementById('main').scrollHeight);
    })
}

onMounted(() => {
    scrollToBottom();
    historyC.value = JSON.parse(proxy.$cache.local.get('history'));
    message.value.history = JSON.parse(proxy.$cache.local.get('history'));
    avatar.value = userStore.avatar;
});

async function sendMsg(e) {
    if ((!e.shiftKey && e.keyCode === 13) || e.type === 'click') {
        e.preventDefault(); //取消事件的默认动作*换行
        if (input.value.trim() === "") {
            proxy.$message.error("请输入内容");
            return;
        }
        message.value.prompt = input.value;
        input.value = "";
        if (!historyC.value) {
            historyC.value = [];
        }
        message.value.history = historyC.value.slice();
        historyC.value.push([message.value.prompt, ""]);
        scrollToBottom();
        await getChat(message.value).then(res => {
            message.value.history = res.history;
            historyC.value = res.history;
            proxy.$cache.local.set('history', JSON.stringify(res.history));
        }).catch(err => {
            proxy.$message.error(err.message);
        })
    }
}

function clearHistory() {
    historyC.value = [];
    message.value.history = [];
    proxy.$cache.local.remove('history');
}

</script>

<style scoped>
.home {
    background-color: #FAFCFF;
    padding: 0 30px 20px 30px;
}

.el-row {
    margin-bottom: 25px;
    align-items: center;
}

.msg {
    background-color: #F0F2F5;
    border-radius: 5px;
    padding: 15px;
    margin: 0 12px;
    max-width: 50%;
}

.rowRe {
    flex-direction: row-reverse;
}

.send-box {
    display: flex;
    justify-content: space-between;
    position: absolute;
    bottom: 0;
    left: 23%;
}

.btn-send {
    font-size: 20px;
}

footer :deep(.el-textarea__inner) {
    box-shadow: none;
    border: 0;
}
</style>