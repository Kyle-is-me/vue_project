<template>
  <div class="login">
    <div class="container ">
        <img src="../assets/avatar.jpg" class="avatar" alt="">
      <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm ">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名" prefix-icon="myicon-user"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" placeholder="请输入密码" prefix-icon="myicon-key"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click='login' class="login-btn">立即登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入活动名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      // 实现二次验证
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          alert('sumit')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm (loginForm) {
      this.$refs[loginForm].resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;
  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
