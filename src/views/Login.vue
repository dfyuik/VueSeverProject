<template>
    <div class="login">
      <el-form ref="form" :model="form" class="container" :rules="rules">
       <el-form-item >
        <div class="avatar">
            <img src="../assets/avatar.jpg" alt="">
        </div>
       </el-form-item>
       <el-form-item prop="username">
       <el-input v-model="form.username" placeholder="用户名"  prefix-icon="myicon myicon-user"></el-input>
       </el-form-item>
       <el-form-item prop="password">
      <el-input v-model="form.password" placeholder="密码" type='password'  prefix-icon="myicon myicon-key" @keydown.enter.native="forLogin('form')"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="login-btn" @click="forLogin('form')">登录</el-button>
      </el-form-item>
      </el-form>
    </div>
</template>
<script>
import {checkUser} from '@/api'
export default {
    data(){
        return{
           form:{
               username:'',
               password:''
           },
          rules: {
            username: [
            { required: true, message: '请输入姓名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 2 到 5 个字符', trigger: 'blur' }
          ],
          password:[
              { required: true, message: '请输入密码', trigger: 'blur' },
          ]
            
        }
      }  
    },
    methods:{
        forLogin(formName){
            this.$refs[formName].validate((valid)=>{
                if(valid){
                   checkUser(this.form).then(res=>{
                       console.log(res)
                      if(res.meta.status==200){
                      this.$store.commit('setUsername',res.data.username)
                          localStorage.setItem('mytoken',res.data.token)
                          this.$router.push({name:'Home'})
                      }else{
                    this.$message({
                        type: 'error',
                       message:res.meta.msg    
                   })
                }
              })
                }else{
                    this.$message({
                        type: 'warning',
                       message:'校检不通过'   
                   })
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.login{
    position:fixed;
    width:100%;
    height:100%;
    background-color: #2f4050;
    
    .container {
        position: absolute;
        left:0;
        right:0;
        width:400px;
        padding:0px 40px 15px 40px;
        margin: 200px auto;
        background-color: #fff;
        .avatar {
            position:relative;
            left:50%;
            width:120px;
            height:120px;
            margin-left: -60px;
            margin-top:-60px;
            box-sizing: border-box;
            border-radius:50%;
            border: 10px solid #fff;
            box-shadow:0 1px 5px #ccc;
            overflow: hidden;
        }
        .login-btn {
            width: 100%;
        }
    }
}
</style>

