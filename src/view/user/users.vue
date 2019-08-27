<template>
  <div class="user">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/" class="navbar">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框+按钮 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="userObj.query"
        class="input-with-select"
        style="width:300px;margin-right:10px"
        @input.native="init()"
      >
        <el-button slot="append" icon="el-icon-search" @click="init()"></el-button>
      </el-input>
      <el-button type="success" round @click="addFormVisible = true">添加用户</el-button>
    </div>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addFormVisible">
      <el-form
        :model="addUserForm"
        :rules="addRules"
        ref="addUserForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addUserForm.username"></el-input>
        </el-form-item>
        <el-form-item  label="密码" prop="password">
          <el-input type="password" v-model="addUserForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table :data="userList" ref="userTable" border style="width: 100%;margin-top:15px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeState(scope.row.id,scope.row.mg_state)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="editUserById(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button
              type="primary"
              icon="el-icon-caret-bottom"
              @click="showAllotDialog(scope.row)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete" @click="delUser(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页结构 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userObj.pagenum"
        :page-sizes="[1,2,3,4]"
        :page-size="userObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <!-- 编辑用户 -->
    <el-dialog title="编辑用户" :visible.sync="editFormVisible" :close-on-click-modal="false">
      <el-form
        :model="editForm"
        :rules="rules"
        ref="editForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名">
          <el-input :disabled="true" v-model="editForm.username" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="allotFormVisible" :close-on-click-modal="false">
      <el-form ref="form" :model="allotForm" label-width="80px">
        <el-form-item label="用户名:">
          <span>{{allotForm.username}}</span>
        </el-form-item>
        <el-form-item label="角色:">
          <el-select v-model="allotForm.rid" placeholder="请选择角色">
            <el-option
              v-for="item in allRoles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="allotFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRole">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllUsers,
  editUserById,
  changeState,
  addUser,
  allotUserRole,
  delUserById
} from '@/api/user_index.js'

import { getAllRoles } from '@/api/roles_index.js'

export default {
  data () {
    return {
      total: 0,
      userList: [],
      userObj: {
        query: '',
        pagenum: 1,
        pagesize: 3
      },
      editFormVisible: false,
      editForm: {
        username: '',
        email: '',
        id: '',
        mobile: ''
      },
      rules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }, // 添加正则表达式
          {
            pattern: /\w+[@]\w+[.]\w+/,
            message: '请输入合法的电子邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' }, // 添加正则表达式
          {
            pattern: /^1\d{10}$/,
            message: '请输入合法的手机号',
            trigger: 'blur'
          }
        ]
      },
      allotFormVisible: false,
      allotForm: {
        username: '',
        id: '',
        rid: ''
      },
      addFormVisible: false,
      // 添加用户
      addUserForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请正确填写邮箱', trigger: 'blur' },
          // 添加正则表达式
          {
            pattern: /\w+[@]\w+[.]\w+/,
            message: '请输入合法的电子邮箱',
            trigger: 'blur'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机', trigger: 'blur' },
          // 添加正则表达式
          {
            pattern: /^1\d{10}$/,
            message: '请输入合法的手机号',
            trigger: 'blur'
          }
        ]
      },
      // 角色列表
      allRoles: []
    }
  },
  methods: {
    // 分页功能
    handleSizeChange (val) {
      this.userObj.pagesize = val
      // 获取数据
      this.init()
    },
    handleCurrentChange (val) {
      this.userObj.pagenum = val
      this.init()
    },
    // 获取全部用户数据
    init () {
      getAllUsers(this.userObj)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.userList = res.data.data.users
            this.total = res.data.data.total
          } else if (res.data.meta.status === 400) {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(() => {
          this.$message.error('服务器异常')
        })
    },
    // 修改用户状态
    changeState (uid, type) {
      changeState(uid, type)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.$message.success(res.data.meta.msg)
            this.init()
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 添加用户
    addUser () {
      this.addFormVisible = false
      // 实现二次验证
      this.$refs.addUserForm.validate(valid => {
        if (valid) {
          addUser(this.addUserForm)
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 201) {
                this.$message.success('添加用户成功')
                this.init()
                this.$refs.addUserForm.resetFields()
              } else {
                this.$message.error(res.data.meta.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.$message.error('请输入所有必填信息！')
          return false
        }
      })
    },
    // 展示用户编辑框
    editUserById (row) {
      this.editFormVisible = true
      // console.log(row)
      this.editForm.username = row.username
      this.editForm.email = row.email
      this.editForm.mobile = row.mobile
      this.editForm.id = row.id
    },
    // 提交编辑
    editUser () {
      // 二次验证
      this.$refs.editForm.validate(valid => {
        if (valid) {
          editUserById(this.editForm)
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 200) {
                this.$message.success(res.data.meta.msg)
                this.init()
                this.editFormVisible = false
              } else {
                this.$message.error(res.data.meta.msg)
              }
            })
            .catch(err => {
              console.log(err)
            })
        } else {
          this.$message.error('请填写完整信息')
          return false
        }
      })
    },
    // 展示分配角色对话框
    showAllotDialog (row) {
      // console.log(row)
      this.allotFormVisible = true
      this.allotForm.username = row.username
      this.allotForm.id = row.id
      // 修改后台代码，增加rid数据的返回
      this.allotForm.rid = row.rid
    },
    // 分配角色
    allotRole () {
      // 调用接口方法
      if (this.allotForm.rid) {
        allotUserRole(this.allotForm)
          .then(res => {
            if (res.data.meta.status === 200) {
              this.$message.success(res.data.meta.msg)
              this.init()
              this.allotFormVisible = false
            } else {
              this.$message.error(res.data.meta.msg)
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$message.warning('请选择角色')
      }
    },
    // 删除用户
    delUser (id) {
      console.log(this.$refs.userTable)
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delUserById(id)
            .then(res => {
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.userObj.pagenum = Math.ceil((this.total - 1) / this.userObj.pagesize) < this.userObj.pagenum ? --this.userObj.pagenum : this.userObj.pagenum
                this.init()
              } else {
                this.$message.error('删除失败')
              }
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  },
  mounted () {
    this.init()
    // 获取所有角色分类
    getAllRoles()
      .then(res => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.allRoles = res.data.data
        }
      })
      .catch(err => {
        console.log(err)
      })
  }
}
</script>

<style lang="less" scoped>
.navbar {
  line-height: 45px;
}
</style>
