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
          <el-radio-group v-model="video.isFree">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">收费</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/edu-vod/video/upload-aly-video'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primary">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question"/>
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
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
        isFree: 0,
        videoSourceId: '',
        videoOriginalName:''//视频名称
      },
      BASE_API: process.env.BASE_API, // 接口地址
      fileList: [] // 上传文件列表
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
    //============上传视频对应的方法=======
    //上传视频成功调用的方法
    handleVodUploadSuccess(response, file, fileList) {
      //上传视频id赋值
      this.video.videoSourceId = response.data.videoId
      //上传视频名称赋值
      this.video.videoOriginalName = file.name
    },
    // 上传完成后点击取消的调用方法
    beforeVodRemove(file,fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    // 弹窗现实点击确定后触发的方法
    handleVodRemove() {
      //调用接口的删除视频的方法
      video.deleteAlyVod(this.video.videoSourceId)
        .then(response => {
          //提示信息
          this.$message({
            type: 'success',
            message: '删除视频成功!'
          });
          //把文件列表清空
          this.fileList = []
          //把video视频id和视频名称值清空
          //上传视频id赋值
          this.video.videoSourceId = ''
          //上传视频名称赋值
          this.video.videoOriginalName = ''
        })
    },
    // 一次上传多个视频时触发的方法
    handleUploadExceed() {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
    //============小节操作===============
    openAddVideo(chapterId) {
      // 打开小节弹框
      this.dialogVideoFormVisible = true
      this.video = {
        title: '',
        sort: 0,
        isFree: 0,
        videoSourceId: ''
      }
      // 设置章节ID
      this.video.chapterId = chapterId
    },
    // 添加小节
    addVideo() {
      // 设置课程ID
      this.video.courseId = this.courseId
      video.addVideo(this.video).then(response => {
        this.$message({
          type: 'success',
          message: '添加小节成功'
        })
        this.dialogVideoFormVisible = false
        this.getChapterVideo()
      })
      this.fileList = []
    },
    // 修改小节
    editVideo() {
      video.updateVideoById(this.video).then(result => {
        this.$message({
          type: 'success',
          message: '更新小节成功'
        })
        this.dialogVideoFormVisible = false
        this.getChapterVideo()
      })
    },
    // 修改或删除（在小节的编辑页面或者小节的添加页面点击确定后触发）
    saveOrUpdateVideo() {
      if (this.video.id) {
        // 修改
        this.editVideo()
      } else {
        // 添加
        this.addVideo()
      }
    },
    // 打开编辑小节弹窗
    openEditVideo(videoId) {
      // 根据VideoId进行查询
      this.dialogVideoFormVisible = true
      video.queryVideoById(videoId).then(response => {
        this.video = response.data.video
      })
    },
    deleteVideo(videoId) {

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
      this.$router.push({ path: '/course/publish/'+this.courseId })
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
