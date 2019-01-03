<style lang="stylus" scoped>
.table-block img {
  width: 100px
}
</style>

<template>
  <div>
    <div class='search-block'>
      <el-input class='search-inp' placeholder='输入用户ID/用户昵称查询' v-model='keyword' @keyup.native.enter='handleSearch' size='mini'/>
      <span class='label'>注册时间:</span>
      <el-date-picker class='datePicker' value-format='yyyy-MM-dd' v-model="dataRange" type="daterange" @change='handleSearch' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" size='mini'>
      </el-date-picker>
      <el-button type='primary' @click='handleSearch' size='mini'>搜索</el-button>
      <el-button @click='bindClear' size='mini'>重置</el-button>
    </div>
    <div class='table-block'>
      <el-table v-loading='tableLoading' :data='tableData' :max-height='maxHeight'>
        <el-table-column prop='user_id' label='用户ID'></el-table-column>
        <el-table-column prop='nickName' label='用户昵称'></el-table-column>
        <el-table-column prop='created_at' label='注册时间'></el-table-column>
        <el-table-column prop='login_count' label='登录次数'></el-table-column>
        <el-table-column prop='invite_count' label='累计邀请'></el-table-column>
        <el-table-column prop='total_token' label='已领券'></el-table-column>
        <el-table-column prop='used_token' label='已用券'></el-table-column>
        <el-table-column prop='remain_token' label='待用券'></el-table-column>
      </el-table>
    </div>
    <div class='pagination'>
      <el-pagination v-if="tableData.length!=0"  :total='paginate.total' :page-size=20 layout='total,prev,pager,next,jumper' @current-change='bindPageChange'></el-pagination>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      maxHeight: 0,
      keyword: '',
      dataRange: '',
      currentPage: 1,
      tableLoading: false,
      tableData: [],
      paginate: ''
    }
  },
  created(){
    this.handleGetList()
    this.maxHeight = window.innerHeight - 200
  },
  methods: {
    handleSearch: function(){
      let data = {
        keyword: this.keyword,
        start_time: this.dataRange != null ? this.dataRange[0] : '',
        end_time: this.dataRange != null ? this.dataRange[1] : ''
      }
      this.handleGetList(data)
    },
    handleGetList: function(data){
      this.tableLoading = true
      this.$utils.axiosRequest('GET', `/users`, data, '', res=>{
        this.tableLoading = false
        this.tableData = res.data.payload.users
        this.paginate = res.data.payload.paginate
      },res=>{
        this.tableLoading = false
      })
    },
    bindClear: function(){
      this.keyword = ''
      this.dataRange = ''
      this.currentPage = 1
      this.handleGetList()
    },
    bindPageChange: function(val){
      this.currentPage = val
      let data = {
        keyword: this.keyword,
        start_time: this.dataRange != null ? this.dataRange[0] : '',
        end_time: this.dataRange != null ? this.dataRange[1] : '',
        page: val
      }
      this.handleGetList(data)
    },
  }
}
</script>
