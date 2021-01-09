<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>
    <el-form label-width="120px">
      <el-form-item label="课程标题">
        <el-input v-model="courseInfo.title" placeholder="示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
      </el-form-item>
      <!-- 所属分类：级联下拉列表 -->
      <!-- 一级分类 -->
      <el-form-item label="课程类别">
        <el-select
          v-model="courseInfo.subjectParentId"
          placeholder="课程一级分类"
          @change="subjectLevelOneChange">
          <el-option
            v-for="subject in subjectOneList"
            :key="subject.id"
            :label="subject.label"
            :value="subject.id"/>
        </el-select>

        <el-select
          v-model="courseInfo.subjectId"
          placeholder="课程二级分类">
          <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.label"
            :value="subject.id"/>
        </el-select>


      </el-form-item>
      <!-- 课程讲师 -->
      <el-form-item label="课程讲师">
        <el-select
          v-model="courseInfo.teacherId"
          placeholder="请选择">
          <el-option
            v-for="teacher in teacherList"
            :key="teacher.id"
            :label="teacher.name"
            :value="teacher.id"/>
        </el-select>
      </el-form-item>
      <el-form-item label="总课时">
        <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
      </el-form-item>
      <!-- 课程简介-->
      <el-form-item label="课程简介">
        <tinymce :height="300" v-model="courseInfo.description"/>
      </el-form-item>
      <!-- 课程封面-->
      <el-form-item label="课程封面">
        <el-upload
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
          :action="BASE_API+'/edu-oss/file-oss'"
          class="avatar-uploader">
          <img :src="courseInfo.cover">
        </el-upload>
      </el-form-item>
      <el-form-item label="课程价格">
        <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/>
        元
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate()">保存并下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import course from '@/api/edu/course'
import teacher from '@/api/edu/teacher'
import subject from '@/api/edu/subject'
import Tinymce from '@/components/Tinymce'

export default {
  components: {
    Tinymce
  },
  data() {
    return {
      saveBtnDisabled: false,
      // 保存按钮是否禁用
      courseInfo: {
        id: '',
        title: '',
        subjectId: '',
        subjectParentId: '',
        teacherId: '',
        lessonNum: 0,
        description: '',
        cover: '/static/img/avatar.jpg',
        price: 0
      },
      teacherList: [],
      subjectOneList: [],
      subjectTwoList: [],
      BASE_API: process.env.BASE_API //获取dev.env.js里面地址
    }
  },
  created() {
    if (this.$route.params && this.$route.params.id) {
      this.courseInfo.id = this.$route.params.id
      this.getInfo()
    } else {
      // 初始化获取到所有的讲师信息
      this.getAllTeacher()
      // 初始化获取到一级课程信息
      this.getSubjectList()
    }
  },
  watch: {
    $route(to, from) { //路由变化方式，路由发生变化，方法就会执行
      this.init()
    }
  },
  methods: {
    // 根据课程ID查询信息
    getInfo() {
      course.getCourseInfo(this.courseInfo.id).then(response => {
        this.courseInfo = response.data.courseInfoVo
        subject.getSubjectList()
          .then(response => {
            // 获取所有的一级分类
            this.subjectOneList = response.data.list
            // 把所有一级分类的数组进行遍历, 比较当前courseInfo里面的一级分类ID进行比较
            for (let i = 0; i < this.subjectOneList.length; i++) {
              // 获取里面的有所的一级分类
              let oneSubject = this.subjectOneList[i]
              if (this.courseInfo.subjectParentId === oneSubject.id) {
                // 获取所有的二级分类
                this.subjectTwoList = oneSubject.children
                break
              }
            }
          })
        // 初始化所有讲师
        this.getAllTeacher()
      })
    },
    // 图片上传之前
    beforeAvatarUpload(file) {
      const isImg = (file.type === 'image/jpeg' || file.type === 'image/png')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImg) {
        this.$message.error('上传头像图片只能是 JPG 格式或者png格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isImg && isLt2M
    },
    // 图片上传成功之后
    handleAvatarSuccess(response, file) {
      this.courseInfo.cover = response.data.url
    },
    // 一级目录改变后触发的方法
    subjectLevelOneChange(value) {
      for (let i = 0; i < this.subjectOneList.length; i++) {
        if (this.subjectOneList[i].id === value) {
          this.subjectTwoList = this.subjectOneList[i].children
          this.courseInfo.subjectId = ''
          break
        }
      }
    },
    // 获取全部课程科目信息
    getSubjectList() {
      subject.getSubjectList().then(response => {
        this.subjectOneList = response.data.list
      })
    }
    ,
    saveOrUpdate() {
      //  判断是添加还是修改, 如果courseInfo中id是''空字符串的话，那么就是添加
      if (this.courseInfo.id) {
        // 修改
        course.updateCourseInfo(this.courseInfo).then(response=>{
          this.$message({
            type: 'success',
            message: '修改课程信息成功'
          })
          this.$router.push({path: '/course/chapter/'+this.courseInfo.id})
        })
      } else {
        // 添加
        course.addCourseInfo(this.courseInfo).then(response => {
          this.$message({
            type: 'success',
            message: '添加课程信息成功'
          })
          this.$router.push({ path: '/course/chapter/' + response.data.courseId })
        })
      }
    },
    getAllTeacher() {
      teacher.findAllTeacher().then(response => {
        this.teacherList = response.data.items
      })
    }
  }
}
</script>
<style scoped>
.tinymce-container {
  line-height: 29px;
}
</style>
