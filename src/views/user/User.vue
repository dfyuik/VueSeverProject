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
      <el-table :data="userList" style="width: 100%" border class="margin-20">
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
            <el-button
              size="mini"
              class="el-icon-delete-solid"
              type="danger"
              plain
              @click="deleteUser(scope.row)"
            ></el-button>
            <el-button
              size="mini"
              class="el-icon-check"
              type="warning"
              plain
              @click="showGrantDialog(scope.row)"
            ></el-button>
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
      <!-- 分配角色 -->
      <el-dialog title="分配角色" :visible.sync="grantDialogFormVisible">
        <el-form :model="grantForm" label-width="120px">
          <el-form-item label="当前的用户" prop="username">
            <el-tag type="info">{{grantForm.username}}</el-tag>
          </el-form-item>
          <el-form-item label="请选择角色:">
            <el-select v-model="roleId" placeholder="请选择角色">
              <el-option
                v-for="(role,index) in grantRolesList"
                :key="index"
                :label="role.roleName"
                :value="role.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="editDialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="grantUserSubmit()">确 定</el-button>
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
  editUser,
  deleteUser,
  getRolesList,
  grantUserRole
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
      roleId: "",
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
      grantDialogFormVisible: false,
      grantRolesList: [],
      grantForm: {
        userName: "",
        region: ""
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
    },
    // 删除用户
    deleteUser(row) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUser(row.id).then(res => {
            console.log(res);
            if ((res.meta.status = 200)) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
            }
            this.initList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    // 显示角色分配框
    showGrantDialog(row) {
      this.grantDialogFormVisible = true;
      this.grantForm = row;
      getRolesList().then(res => {
        if (res.meta.status == 200) {
          this.grantRolesList = res.data;
        }
      });
    },
    //  分配角色
    grantUserSubmit() {
      if (!this.roleId) {
        this.$message({
              message:'请选择角色，不能为空',
              type: "warning"
            })
      } else {
        grantUserRole({ id: this.grantForm.id, rid: this.roleId }).then(res => {
          if (res.meta.status == 200) {
            this.$message({
              message: "分配角色成功",
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

      this.grantDialogFormVisible = false;
      this.initList();
    }
  }
};
</script>
<style lang="scss" scoped>
.user {
  .margin-20{
    margin: 20px 0;
  }
  .search-input {
    width: 300px;
  }
  .page {
    padding: 5px 0;
    background-color: #d3dce6;
  }
}
</style>

