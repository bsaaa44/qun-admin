<style lang="stylus" scoped>
.preview-pop 
  .content 
    text-align left
  .title 
    font-size 20px
    font-weight bold
    margin-bottom 10px
  .time 
    margin-bottom 10px
    font-size 14px

</style>

<template>
  <div>
    <div class='search-block'>
      <el-input class='search-inp' placeholder='输入文章标题查询' v-model='keyword' @keyup.native.enter='handleSearch' size='mini'/>
      <el-button type='primary' size='mini' @click='navToCreate'>创建项目</el-button>
      <el-button type='primary' @click='handleSearch' size='mini'>搜索</el-button>
      <el-button @click='bindClear' size='mini'>重置</el-button>
    </div>
    <div class='table-block'>
      <el-table v-loading='tableLoading' :data='tableData' :max-height='maxHeight'>
        <el-table-column prop='id' label='ID'></el-table-column>
        <el-table-column prop='title' label='标题'></el-table-column>
        <el-table-column prop='release_time' label='发布时间'></el-table-column>
        <el-table-column label='文章预览'>
          <template slot-scope='scope'>
            <el-button type='text' @click='currentScope = scope;showPreview = true'>预览</el-button>
          </template>
        </el-table-column>
        <el-table-column prop='view' label='浏览量'></el-table-column>
        <el-table-column label='操作'>
          <template slot-scope='scope'>
            <el-button type='text' @click='navToEdit(scope.row.id)'>编辑</el-button>
            <el-button type='text' @click='handleDelete(scope.row.id)'>删除</el-button>
            <el-button type='text' @click='handlePost(scope)' v-if='scope.row.public == 0'>发布</el-button>
            <el-button type='text' @click='handlePost(scope)' v-if='scope.row.public == 1'>下架</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class='pagination'>
      <el-pagination v-if="tableData.length!=0"  :total='paginate.total' :page-size=20 layout='total,prev,pager,next,jumper' @current-change='bindPageChange'></el-pagination>
    </div>
    <el-dialog title='预览' width="600px" v-if='currentScope!=""' :visible.sync="showPreview" class='preview-pop'>
      <div class='title'>{{currentScope.row.title}}</div>
      <div class='time'>{{currentScope.row.release_time}}</div>        
      <div class='content' v-html='currentScope.row.content'></div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      maxHeight: 0,
      keyword: '',
      currentPage: 1,
      tableLoading: false,
      tableData: [],
      paginate: '',
      showPreview: false,
      currentScope: ''
    }
  },
  created(){
    this.handleGetList()
    this.maxHeight = window.innerHeight - 200
  },
  methods: {
    navToEdit: function(id){
      this.$router.push({
        path: '/home/createPassage',
        query: {
          id
        }
      })
    },
    handlePost: function(scope){
      let data = {
        id: scope.row.id,
        public: scope.row.public == 0? 1: 0
      }
      this.$utils.axiosRequest('PUT', `/article/toggle-show`, data, '', res=>{
        this.$message({
            message: '操作成功',
            type: 'success'
        })
        let data = {
          keyword: this.keyword,
          page: this.currentPage
        }
        this.handleGetList(data)
      },res=>{

      })
    },  
    handleDelete: function(id){
      this.$confirm('确认执行该操作？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$utils.axiosRequest('GET', `/article/${id}`, '', '', res=>{
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          let data = {
            keyword: this.keyword,
            page: this.currentPage
          }
          this.handleGetList(data)
        },res=>{

        })
      }).catch(()=>{

      })
    },
    navToCreate: function(){
      this.$router.push('/home/createPassage')
    },
    handleSearch: function(){
      let data = {
        keyword: this.keyword
      }
      this.handleGetList(data)
    },
    handleGetList: function(data){
      this.tableLoading = true
      this.$utils.axiosRequest('GET', `/article/list`, data, '', res=>{
        this.tableLoading = false
        this.tableData = res.data.payload.list
        this.paginate = res.data.payload.paginate
      },res=>{
        this.tableLoading = false
      })
    },
    bindClear: function(){
      this.keyword = ''
      this.currentPage = 1
      this.handleGetList()
    },
    bindPageChange: function(val){
      this.currentPage = val
      let data = {
        keyword: this.keyword,
        page: val
      }
      this.handleGetList(data)
    },
  }
}
</script>
