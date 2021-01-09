import request from '@/utils/request'

export default {
  getAllChapterVideo(courseId) {
    return request({
      url: '/edu-service/edu-chapter/getChapterVideo/' + courseId,
      method: 'get'
    })
  },
  //添加章节
  addChapter(chapter) {
    return request({
      url: '/edu-service/edu-chapter/addChapter',
      method: 'post',
      data: chapter
    })
  },
  //根据id查询章节
  getChapter(chapterId) {
    return request({
      url: '/edu-service/edu-chapter/getChapterInfo/' + chapterId,
      method: 'get'
    })
  },
  //修改章节
  updateChapter(chapter) {
    return request({
      url: '/edu-service/edu-chapter/updateChapter',
      method: 'post',
      data: chapter
    })
  },
  //删除章节
  deleteChapter(chapterId) {
    return request({
      url: '/edu-service/edu-chapter/deleteChapter/' + chapterId,
      method: 'delete'
    })
  }
}
