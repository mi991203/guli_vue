import request from '@/utils/request'

export default {
  getSubjectList() {
    return request({
      url: `/edu-service/edu-subject/getAllSubject`,
      method: 'get'
    })
  }
}
