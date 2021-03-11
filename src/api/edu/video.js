import request from '@/utils/request'

export default {
  //添加小节
  addVideo(video) {
    return request({
      url: '/edu-service/edu-video/addVideo',
      method: 'post',
      data: video
    })
  },

  //删除小节
  deleteVideo(id) {
    return request({
      url: '/edu-service/edu-video/delete'+id,
      method: 'delete'
    })
  },

  // 根据小节ID查询小节
  queryVideoById(id) {
    return request({
      url: '/edu-service/edu-video/queryVideoById/'+id,
      method: 'get'
    })
  },

  // 根据videoId对表进行更新
  updateVideoById(eduVideo) {
    return request({
      url: '/edu-service/edu-video/updateVideoById',
      method: 'post',
      data: eduVideo
    })
  },

  // 根据视频id来删除阿里云的视频资源
  deleteAlyVod(id) {
    return request({
      url: '/edu-vod/video/remove-aly-video/'+id,
      method: 'delete'
    })
  }
}
