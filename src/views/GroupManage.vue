<style lang="stylus" scoped>
.table-block img {
  width: 100px
  cursor pointer
}
.preview-pop img {
  width 100%
}
</style>

<template>
  <div>
    <div class='search-block'>
      <el-input class='search-inp' placeholder='输入群名称查询' v-model='keyword' @keyup.native.enter='handleSearch' size='mini'/>
      <el-select class='status-selector' v-model='status' placeholder='提现状态' @change='handleSearch' size='mini'>
        <el-option label='提现状态' value=''></el-option>
        <el-option v-for='(item,index) in categories' :key='index' :label='item.name' :value='item.id'></el-option>
      </el-select>
      <span class='label'>添加时间:</span>
      <el-date-picker class='datePicker' value-format='yyyy-MM-dd' v-model="dataRange" type="daterange" @change='handleSearch' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size='mini'>
      </el-date-picker>
      <el-button type='primary' @click='currentId = 0;showPop = true' size='mini'>添加群</el-button>
      <el-button type='primary' @click='handleSearch' size='mini'>搜索</el-button>
      <el-button @click='bindClear' size='mini'>重置</el-button>
    </div>
    <div class='table-block'>
      <el-table v-loading='tableLoading' :data='tableData' :max-height='maxHeight'>
        <el-table-column prop='id' label='群ID'></el-table-column>
        <el-table-column prop='category' label='群类别'></el-table-column>
        <el-table-column prop='group_name' label='群名称'></el-table-column>
        <el-table-column prop='created_at' label='添加时间'></el-table-column>
        <el-table-column prop='remain' label='已兑换次数'></el-table-column>
        <el-table-column label='群二维码'>
          <template slot-scope='scope'>
            <div @click='currentImg = scope.row.qrcode;showPreview = true'>
              <img :src='scope.row.qrcode'/>
            </div>
          </template>
        </el-table-column>
        <el-table-column label='操作'>
          <template slot-scope="scope">
            <el-button type='text' @click='handleAlterClick(scope)'>修改</el-button>
            <el-button type='text' @click='handleDelete(scope)'>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class='pagination'>
      <el-pagination v-if="tableData.length!=0"  :total='paginate.total' :page-size=20 layout='total,prev,pager,next,jumper' @current-change='bindPageChange'></el-pagination>
    </div>
    <el-dialog title='添加群' :visible.sync="showPop" width="320px">
      <div class='form-block'>
        <div class='label'>选择群类别</div>
        <el-select v-model='typeSelect' placeholder="群类别" @change='newTypeInp=""'>
          <el-option label='群类别' value=''></el-option>
          <el-option v-for='(item,index) in categories' :key='index' :label='item.name' :value='item.id'></el-option>
        </el-select>
      </div>
      <div class='form-block' v-if='currentId == 0'>
        <div class='label'>新增类别</div>
        <el-input class='inp' v-model='newTypeInp' placeholder="输入类别名称" @change='typeSelect=""'/>
      </div>
      <div class='form-block'>
        <div class='label'>群名称</div>
        <el-input class='inp' v-model='groupNameInp' placeholder="输入群的名称"/>
      </div>
      <div class='form-block'>
        <div class='label'>上传群二维码</div>
        <el-upload v-loading='upLoading' :show-file-list="false" class='uploader' :action='$global.hostUrl+"/upload"' :on-success='handleUploadSuccess'>
          <img v-if='uploadCover.length>0' :src='uploadCover' class='img-cover'>
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </div>
      <div class='btn-block'>
        <el-button @click='showPop = false'>取消</el-button>
        <el-button type="primary" @click='handleCreate()'>提交</el-button>
      </div>
    </el-dialog>
    <el-dialog title='预览' width="500px" :visible.sync="showPreview" class='preview-pop'>
      <img :src='currentImg'/>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data(){
    return{
      maxHeight: 0,
      keyword: '',
      status: '',
      dataRange: '',
      currentPage: 1,
      currentImg: '',
      tableLoading: false,
      tableData: [],
      paginate: '',
      showPop: false,
      categories: [],
      uploadCover: '',
      upLoading: false,
      showPreview:false,
      typeSelect: '',
      newTypeInp: '',
      groupNameInp: '',
      currentId: 0,
      currentRemain: 0
    }
  },
  created(){
    this.handleGetList()
    this.handleGetCategories()
    this.maxHeight = window.innerHeight - 200
  },
  methods: {
    handleDelete: function(scope){
      this.$confirm('确认执行该操作？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$utils.axiosRequest('DELETE', `/group/${scope.row.id}`, '', '', res=>{
            this.$message({
              message: '操作成功',
              type: 'success'
            })
            let data = {
              keyword: this.keyword,
              category_id: this.status,
              start_time: this.dataRange != null ? this.dataRange[0] : '',
              end_time: this.dataRange != null ? this.dataRange[1] : '',
              page: this.currentPage
            }
            this.handleGetList(data)
          },res=>{

          })
        }).catch(()=>{

        })
    },
    handleAlterClick: function(scope){
      this.currentId = scope.row.id
      for(let i = 0;i < this.categories.length;i++){
        if(this.categories[i].name == scope.row.category){
          this.typeSelect = this.categories[i].id
        }
      }
      this.groupNameInp = scope.row.group_name
      this.uploadCover = scope.row.qrcode
      this.currentRemain = scope.row.remain
      this.showPop = true
    },
    handleCreate: function(){
      let data 
      let methods
      if(this.currentId == 0){
        methods = 'POST'
        data = {
        group_id: this.currentId == 0?'':this.currentId,
        group_name: this.groupNameInp,
        category_id: this.typeSelect,
        new_category: this.newTypeInp,
        qrcode: this.uploadCover
      }
      }else{
        methods = 'PUT'
        data = {
        group_id: this.currentId == 0?'':this.currentId,
        group_name: this.groupNameInp,
        category_id: this.typeSelect,
        new_category: this.newTypeInp,
        qrcode: this.uploadCover,
        remain: this.currentRemain
      }
      }
      this.$utils.axiosRequest(methods, `/group`, '', data, res=>{
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.currentRemain = 0
        this.currentId = 0
        this.newTypeInp = ''
        this.groupNameInp = ''
        this.typeSelect = '' 
        this.bindClear()
        this.handleGetCategories()
        this.showPop = false
      },res=>{

      })
    },
    handleSearch: function(){
      let data = {
        keyword: this.keyword,
        category_id: this.status,
        start_time: this.dataRange != null ? this.dataRange[0] : '',
        end_time: this.dataRange != null ? this.dataRange[1] : ''
      }
      this.handleGetList(data)
    },
    bindPageChange: function(val){
      this.currentPage = val
      let data = {
        keyword: this.keyword,
        category_id: this.status,
        start_time: this.dataRange != null ? this.dataRange[0] : '',
        end_time: this.dataRange != null ? this.dataRange[1] : '',
        page: val
      }
      this.handleGetList(data)
    },
    bindClear: function(){
      this.keyword = ''
      this.status = ''
      this.dataRange = ''
      this.currentPage = ''
      this.handleSearch()
    },
    handleGetCategories: function(){
      this.$utils.axiosRequest('GET', `/group/categories`, '', '', res=>{
        this.categories = res.data.payload.categories
      },res=>{

      })
    },
    handleGetList: function(data){
      this.tableLoading = true
      this.$utils.axiosRequest('GET', `/groups`, data, '', res=>{
        this.tableLoading = false
        this.tableData = res.data.payload.list
        this.paginate = res.data.payload.paginate
      },res=>{
        this.tableLoading = false
      })
    },
    handleUploadSuccess: function(res,file){
      this.uploadCover = file.response.url
    }
  }
}
</script>
