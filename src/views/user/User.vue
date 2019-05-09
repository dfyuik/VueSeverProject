<template>
  <div class="userBg">
    <el-row>
      <el-col :span="24">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>
            <a href="/">活动管理</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>活动列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
    </el-row>
    <div class="user">
      <!-- 给组件绑定原生事件的话 需要一个native的修饰符 -->
      <el-input placeholder="请输入内容" class="search-input" v-model="usercontent" @keydown.enter.native="initList">
        <el-button slot="append" icon="el-icon-search" @click="initList"></el-button>
      </el-input>
      <el-button type="success" plain>添加用户</el-button>
      <el-table :data="userList" style="width: 100%" border>
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeUserState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" class="el-icon-edit" type="primary" plain></el-button>
            <el-button size="mini" class="el-icon-delete-solid" type="danger" plain></el-button>
            <el-button size="mini" class="el-icon-check" type="warning" plain></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[1, 2, 3, 4]"
          :page-size="1"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { getUserList, changeUserState } from "@/api";
export default {
  data() {
    return {
      usercontent:'',
      value2:true,
      userList: [],
      total:0,
      pagesize:1,
      currentPage:1
    };
  },
  created() {
    this.initList();
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize=val
      this.initList()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage=val
     this.initList()
    },
    initList() {
      getUserList({ params: { query: this.usercontent, pagenum:this.currentPage, pagesize: this.pagesize } }).then(
        res => {
           console.log(res);
          this.userList = res.data.users;
          this.total=res.data.total;    
        }
      );
    },
    changeUserState(row){
      console.log(row)
      changeUserState({uId:row.id,type:row.mg_state}).then(res=>{
        console.log(res)
        if(res.meta.status==200){
          this.$message({
          message: '状态修改成功',
          type: 'success'
        })
        }else{
          this.$message({
          message: res.meta.msg,
          type: 'warning'
        })
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.user {
  .search-input {
    width: 300px;
  }
  .page {
    padding: 5px 0;
    background-color: #d3dce6;
  }
}
</style>

