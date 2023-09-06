import request from "@/utils/request";

export function getChat(data) {
    return request({
        baseURL: "",
        url: "/getChat",
        method: "post",
        data: data
    });
}
