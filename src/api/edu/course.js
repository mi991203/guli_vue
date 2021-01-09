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
  }
}
