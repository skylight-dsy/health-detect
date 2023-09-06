import request from '@/utils/request'

// 查询量表列表
export function listScale(query) {
  return request({
    url: '/system/scale/list',
    method: 'get',
    params: query
  })
}

// 查询量表详细
export function getScale(scaleId) {
  return request({
    url: '/system/scale/' + scaleId,
    method: 'get'
  })
}

// 新增量表
export function addScale(data) {
  return request({
    url: '/system/scale',
    method: 'post',
    data: data
  })
}

// 修改量表
export function updateScale(data) {
  return request({
    url: '/system/scale',
    method: 'put',
    data: data
  })
}

// 删除量表
export function delScale(scaleId) {
  return request({
    url: '/system/scale/' + scaleId,
    method: 'delete'
  })
}

// 量表状态修改
export function changeScaleStatus(scaleId, status) {
  const data = {
    scaleId,
    status
  }
  return request({
    url: '/system/scale/changeStatus',
    method: 'put',
    data: data
  })
}
