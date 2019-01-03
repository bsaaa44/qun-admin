<template>
  <div>
    <div class='content-block'>
      <div class='label'>标题</div>
      <el-input class='inp' v-model='titleInp' placeholder="输入文章标题"/>
    </div>
    <div class='content-block'>
      <div class='label'>发布时间</div>
      <el-input class='inp' v-model='timeInp' placeholder="输入发布时间 格式yyyy-mm-dd"/>
    </div>
    <div class='content-block'>
      <vue-editor v-model='detailInp' id='editor' useCustomImageHandler
      @imageAdded="handleImageAdded"></vue-editor>
    </div>
    <div class='btn-block'>
      <el-button @click='navBack()'>取消</el-button>
      <el-button type="primary" @click='handleCreate()'>保存</el-button>
    </div>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'
export default {
  data(){
    return{
      editorLoading: false,
      detailInp: '',
      titleInp: '',
      timeInp: '',
      currentId: 0
    }
  },
  components: {
    'vue-editor': VueEditor
  },
  created(){
    console.log(this.$route.query.id)
    if(this.$route.query.id){
      console.log(this.$global.currentPassage)
      this.currentId = this.$route.query.id
      this.detailInp = this.$global.currentPassage.row.content
      this.titleInp = this.$global.currentPassage.row.title
      this.timeInp = this.$global.currentPassage.row.release_time
    }
  },
  methods:{
    navBack: function(){
      this.$router.push('/home/passageManage')
    },
    handleCreate: function(){
      let data = {
        id: this.currentId == 0? '':this.currentId,
        content: this.detailInp,
        release_time: this.timeInp,
        title: this.titleInp
      }
      this.$utils.axiosRequest('POST','/article','',data,res=> {
        this.$message({
          message: '发布成功',
          type: 'success'
        })
        this.$global.currentPassage = ''
        this.$router.push('/home/passageManage')
      },res=>{

      })
    },
    handleImageAdded: function(file,Editor,cursorLocation,resetUploader){
      this.editorLoading = true
      var formData = new FormData()
      formData.append('file', file)
      formData.append('path', 'gift/image')
      console.log('文件详情', file)
      console.log('选择了图片类型，开始执行上传')
      this.getImageUrl(formData, Editor, cursorLocation, resetUploader)
    },
    getImageUrl(data, Editor, cursorLocation, resetUploader) {
      let self = this
      this.$utils.axiosRequest(
        'post',
        '/upload',
        '',
        data,
        function(res) {
          console.log('图片上传成功', res)
          let url = res.data.url
          Editor.insertEmbed(cursorLocation, 'image', url)
          // cursorLocation= cursorLocation+1
          console.log('Editor',Editor)
          resetUploader()
          self.editorLoading = false
        },
        function(err) {
          console.log('图片上传失败', err)
          self.$message.error('图片上传失败')
          self.editorLoading = false
        }
      )
    },
  }
}
</script>

<style lang="stylus" scoped>
  .content-block 
    display flex
    flex-flow row
    align-items center
    margin-top 20px
    .label
      width 100px
      text-align left
      margin-right 10px
      font-weight bold
    .inp
      width 50%;
  .btn-block
    width 100%;
    text-align left
    margin-top 20px
</style>

