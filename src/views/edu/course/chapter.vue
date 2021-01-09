<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="提交审核"/>
    </el-steps>

    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chapterList">
      <li
        v-for="chapter in chapterVideoList"
        :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
              <el-button type="text" @click="openAddVideo(chapter.id)">添加小节</el-button>
              <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
              <el-button type="text" @click="deleteChapter(chapter.id)">删除</el-button>
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chapterList videoList">
          <li
            v-for="video in chapter.children"
            :key="video.id">
            <p>
              {{ video.title }}
              <span class="acts">
                <el-button style="" type="text" @click="openEditVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>

    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title"/>
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="addVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'

export default {
  data() {
    return {
      // 保存按钮是否禁用
      saveBtnDisabled: false,
      courseId: '',
      chapterVideoList: [],
      //是否显示章节表单
      dialogChapterFormVisible: false,
      // 章节对象
      chapter: {
        title: '',
        sort: 0
      },
      // 小节弹框
      dialogVideoFormVisible: false,
      // 课时对象
      video: {
        title: '',
        sort: 0,
        free: 0,
        videoSourceId: ''
      }
    }
  },
  created() {
    //获取路由的id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      //根据课程id查询章节和小节
      this.getChapterVideo()
    }
  },
  methods: {
    //============小节操作===============
    openAddVideo(chapterId) {
      // 打开小节弹框
      this.dialogVideoFormVisible = true
      // 设置章节ID
      this.video.chapterId = chapterId
    },
    // 添加小节
    addVideo() {
      // 设置课程ID
      this.video.courseId = this.courseId
      video.addVideo(this.video).then(response=>{
        this.$message({
          type: 'success',
          message: '添加小节成功'
        })
        this.dialogVideoFormVisible = false
        this.getChapterVideo()
      })
    },

    //============章节操作==============
    // 根据章节Id删除
    deleteChapter(chapterId) {
      this.$confirm('此操作将删除小节，是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 点击确定执行then方法
        chapter.deleteChapter(chapterId).then(response => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          // 刷新页面
          this.getChapterVideo()
        })
      }).catch(() => {
        // 点击取消执行Catch方法
        this.$message({
          type: 'warning',
          message: '取消删除'
        })
      })
    },
    // 修改章节弹窗数据回显
    openEditChapter(chapterId) {
      // 弹框
      this.dialogChapterFormVisible = true
      chapter.getChapter(chapterId).then(response => {
        this.chapter = response.data.chapter
      })
    },
    // 弹出添加章节页面
    openChapterDialog() {
      this.dialogChapterFormVisible = true
      this.chapter.title = ''
      this.chapter.sort = 0
    },
    // 添加章节
    addChapter() {
      // 给chapter对象中传入courseId
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter).then(response => {
        // 关闭弹框
        this.dialogChapterFormVisible = false
        // 给出提示信息
        this.$message({
          type: 'success',
          message: '添加章节信息成功'
        })
        // 刷新页面
        this.getChapterVideo()
      })
    },
    // 修改章节
    updateChapter() {
      chapter.updateChapter(this.chapter).then(response => {
        this.dialogChapterFormVisible = false
        this.$message({
          type: 'success',
          message: '添加章节成功'
        })
        // 刷新页面
        this.getChapterVideo()
      })
    },
    saveOrUpdate() {
      if (this.chapter.id) {
        // 有ID是修改操作
        this.updateChapter()
      } else {
        // 无ID是新增操作
        this.addChapter()
      }
    },
    // 根据课程id查询章节和小节(刷新页面)
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId)
        .then(response => {
          this.chapterVideoList = response.data.list
        })
    },
    previous() {
      console.log('previous')
      this.$router.push({ path: '/course/info/' + this.courseId })
    },
    next() {
      console.log('next')
      this.$router.push({ path: '/course/publish/1' })
    }
  }
}
</script>
<style scoped>
.chapterList {
  position: relative;
  list-style: none;
  margin: 0;
  padding: 0;
}

.chapterList li {
  position: relative;
}

.chapterList p {
  float: left;
  font-size: 20px;
  margin: 10px 0;
  padding: 10px;
  height: 70px;
  line-height: 50px;
  width: 100%;
  border: 1px solid #DDD;
}

.chapterList .acts {
  float: right;
  font-size: 14px;
}

.videoList {
  padding-left: 50px;
}

.videoList p {
  float: left;
  font-size: 14px;
  margin: 10px 0;
  padding: 10px;
  height: 50px;
  line-height: 30px;
  width: 100%;
  border: 1px dotted #DDD;
}
</style>
