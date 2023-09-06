import request from '@/utils/request'

// 查询量表测试结果数据列表
export function listResult(query) {
  return request({
    url: '/system/result/list',
    method: 'get',
    params: query
  })
}

// 查询量表测试结果数据详细
export function getResult(reId) {
  return request({
    url: '/system/result/' + reId,
    method: 'get'
  })
}

// 新增量表测试结果数据
export function addResult(data) {
  return request({
    url: '/system/result',
    method: 'post',
    data: data
  })
}

// 修改量表测试结果数据
export function updateResult(data) {
  return request({
    url: '/system/result',
    method: 'put',
    data: data
  })
}

// 删除量表测试结果数据
export function delResult(reId) {
  return request({
    url: '/system/result/' + reId,
    method: 'delete'
  })
}
