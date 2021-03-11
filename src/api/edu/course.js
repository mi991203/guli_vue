import request from '@/utils/request'

export default {
  //1 添加课程信息
  addCourseInfo(courseInfo) {
    return request({
      url: '/edu-service/edu-course/addCourseInfo',
      method: 'post',
      data:courseInfo
    })
  },
  // 根据课程ID查询课程的基本信息
  getCourseInfo(courseId){
    return request({
      url: `/edu-service/edu-course/getCourseInfo/${courseId}`,
      methods: 'get'
    })
  },
  // 修改课程信息
  updateCourseInfo(courseInfoVo) {
    return request({
      url: '/edu-service/edu-course/updateCourseInfo',
      method: 'post',
      data: courseInfoVo
    })
  },
  // 课程概要信息获取
  getPublishCourseInfo(courseId) {
    return request({
      url: '/edu-service/edu-course/getPublishCourseInfo/'+courseId,
      method: 'get'
    })
  },
  // 课程最终发布
  publishCourse(id) {
    return request({
      url: '/edu-service/edu-course/publishCourse/'+id,
      method: 'put',
    })
  },
  // 课程最终发布
  getListCourse(courseQuery) {
    return request({
      url: '/edu-service/edu-course?title='+courseQuery.title+'&status='+courseQuery.status,
      method: 'get'
    })
  },
  // 根据课程ID删除课程（同时会删除相关的章节表、小节表、课程描述表）中的数据
  removeCourse(courseId) {
    return request({
      url: '/edu-service/edu-course/deleteCourse/'+courseId,
      method: 'delete'
    })
  }
}
