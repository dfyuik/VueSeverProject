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
      <el-input
        placeholder="请输入内容"
        class="search-input"
        v-model="usercontent"
        @keydown.enter.native="initList"
      >
        <el-button slot="append" icon="el-icon-search" @click="initList"></el-button>
      </el-input>
      <el-button type="success" plain @click="addDialogFormVisible=true">添加用户</el-button>
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
            <el-button
              size="mini"
              class="el-icon-edit"
              type="primary"
              plain
              @click="getUserById(scope.row)"
            ></el-button>
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
          :page-sizes="[10, 20, 30, 40]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </div>
      <!-- 添加对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogFormVisible">
        <el-form :model="addForm" label-width="80px" :rules="rules" ref="addForm">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="addForm.username" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password" autocomplete="off" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="addDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserSubmit('addForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 编辑对话框 -->
      <el-dialog title="编辑用户" :visible.sync="editDialogFormVisible">
        <el-form :model="editForm" label-width="80px" :rules="rules" ref="editForm">
          <el-form-item label="姓名" prop="username">
            <el-input v-model="editForm.username" autocomplete="off" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="editForm.mobile" autocomplete="off"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser('editForm')">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getUserList,
  changeUserState,
  addUserSubmit,
  getUserById,
  editUser
} from "@/api";
export default {
  data() {
    return {
      usercontent: "",
      value2: true,
      userList: [],
      total: 0,
      pagesize: 10,
      currentPage: 1,
      addDialogFormVisible: false,
      addForm: {
        username: "",
        email: "",
        mobile: "",
        password: ""
      },
      editDialogFormVisible: false,
      editForm: {
        username: "",
        email: "",
        mobile: "",
        id: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        mobile: [{ required: true, message: "请输入手机号码", trigger: "blur" }]
      }
    };
  },
  created() {
    this.initList();
  },
  methods: {
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`);
      this.pagesize = val;
      this.initList();
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      this.currentPage = val;
      this.initList();
    },
    initList() {
      getUserList({
        params: {
          query: this.usercontent,
          pagenum: this.currentPage,
          pagesize: this.pagesize
        }
      }).then(res => {
        this.userList = res.data.users;
        this.total = res.data.total;
      });
    },
    changeUserState(row) {
      console.log(row);
      changeUserState({ uId: row.id, type: row.mg_state }).then(res => {
        if (res.meta.status == 200) {
          this.$message({
            message: "状态修改成功",
            type: "success"
          });
        } else {
          this.$message({
            message: res.meta.msg,
            type: "warning"
          });
        }
      });
    },
    // 添加用户
    addUserSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          addUserSubmit(this.addForm).then(res => {
            console.log(res);
            if (res.meta.status == 201) {
              this.$message({
                message: "添加用户成功",
                type: "success"
              });
              this.initList();
              this.addDialogFormVisible = false;
            } else {
              this.$message({
                message: res.meta.msg,
                type: "warning"
              });
            }
          });
        }
      });
    },
    // 根据id获取用户信息
    getUserById(row) {
      this.editDialogFormVisible = true;
      getUserById(row.id).then(res => {
        this.editForm.username = res.data.username;
        this.editForm.email = res.data.email;
        this.editForm.mobile = res.data.mobile;
        this.editForm.id = res.data.id;
      });
    },
    // 编辑用户
    editUser(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editUser(this.editForm).then(res => {
            if (res.meta.status == 200) {
              this.$message({
                message: "更新操作成功",
                type: "success"
              });
            } else {
              this.$message({
                message: res.meta.msg,
                type: "warning"
              });
            }
          });
        }
      }),
        this.initList();
      this.editDialogFormVisible = false;
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

