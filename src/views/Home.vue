<template>
  <div class="home">
    <el-container >
      <el-aside width="auto" >
           <div class="logo"></div>
        <el-menu
         :router="true"
         :collapse="isCollapse"
          class="el-menu-admin"
          @open="handleOpen"
          @close="handleClose"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>用户管理</span>
            </template>
            <el-menu-item index="/user">
                 <i class="el-icon-menu"></i>
               <span slot="title">用户列表</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
         <i class="myicon myicon-menu toggle-btn" @click="isCollapse=!isCollapse"></i>
         <div class="system-title">电商后台管理系统</div>
         <div>
           <span class="welcome">欢迎{{$store.getters.username}}</span>
           <el-button type="text" @click="loginOut">退出</el-button>
         </div>
        </el-header>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import { getUserList } from "@/api";
export default {
    data(){
        return{
            isCollapse:true
        }
    },
  mounted() {
    let params = { params: { query: "", pagenum: 1, pagesize: 1 } };
    getUserList(params).then(res => {
      /* console.log(res); */
    });
  },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      loginOut(){
          localStorage.removeItem('mytoken')
          this.$router.push({name:'Login'})
      }
    }
};
</script>
<style lang="scss" scoped>
.home {
  height: 100%;
  background-color: #E8EDF3;
  .el-menu-admin:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
  }
  .el-container {
    height: 100%;
  }
  .el-aside {
    background-color: #545c64;
  }
  .el-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #545c64;
  }
  .logo {
    height: 80px;
    background: url(../assets/logo.png);
    background-size: cover;
    background-position: center center;
    background-color: #989898;
  }
  .toggle-btn {
    font-size: 36px;
    color: #989898;
    cursor: pointer;
    line-height: 60px;
  }
  .system-title {
    font-size: 28px;
    color: white;
  }
  .welcome {
    color: white;
  }
}
</style>

