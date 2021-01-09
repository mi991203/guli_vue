import request from '@/utils/request'

export default {
  //讲师列表带分页
  getTeacherListPage(current, limit, teacherQuery) {
    return request({
      url: `/edu-service/edu-teacher/pageTeacherCondition/${current}/${limit}`,
      method: 'post',
      data: teacherQuery
    })
  },
  deleteTeacherId(id) {
    return request({
      url: `/edu-service/edu-teacher/${id}`,
      method: 'delete'
    })
  },
  addTeacher(eduTeacher) {
    return request({
      url: `/edu-service/edu-teacher/addTeacher`,
      method: 'post',
      data: eduTeacher
    })
  },
  getTeacherById(id) {
    return request({
      url: `/edu-service/edu-teacher/getTeacher/${id}`,
      method: 'get'
    })
  },
  updateTeacher(eduTeacher) {
    return request({
      url: `/edu-service/edu-teacher/updateTeacher`,
      method: 'put',
      data: eduTeacher
    })
  },
  // 查询所有讲师
  findAllTeacher() {
      return request({
        url: `/edu-service/edu-teacher/findAll`,
        method: 'get'
      })
  }
}
