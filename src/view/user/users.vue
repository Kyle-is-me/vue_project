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
      <el-button type="success" round>添加用户</el-button>
    </div>
    <!-- 添加用户 -->
    <el-dialog title="添加用户" :visible.sync="addFormVisible">
      <el-form
        :model="ruleForm"
        :rules="rules2"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="ruleForm.name"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 表格 -->
    <el-table :data="userList" border style="width: 100%;margin-top:15px">
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
            <el-button type="primary" icon="el-icon-edit" @click="editUserById(scope.row.id)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button
              type="primary"
              icon="el-icon-caret-bottom"
              @click="allotRoleById(scope.row.id)"
            ></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete"></el-button>
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
        :model="uesrData"
        :rules="rules"
        ref="uesrEdit"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="姓名">
          <el-input :disabled="true" v-model="uesrData.username" style="width:100px"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="uesrData.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="uesrData.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配角色 -->
    <el-dialog title="分配角色" :visible.sync="allotFormVisible" :close-on-click-modal="false">
      <el-form ref="form" :model="uesrData" label-width="80px">
        <el-form-item label="用户名:">
          <span>{{uesrData.username}}</span>
        </el-form-item>
        <el-form-item label="角色:">
          <el-select v-model="uesrData.rid" placeholder="请选择角色">
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
        <el-button type="primary" @click="allotFormVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllUsers,
  getUserById,
  editUserById,
  getAllRoles,
  changeState
} from '@/api/user_index.js'

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
      allotFormVisible: false,
      addFormVisible: false,
      uesrData: {},
      // 添加用户
      ruleForm: {
        name: ''
      },
      rules2: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ]
      },
      // 所有角色信息
      allRoles: [],
      rules: {
        email: [{ required: true, message: '请输入邮箱', trigger: 'blur' }],
        mobile: [{ required: true, message: '请输入手机号', trigger: 'blur' }]
      }
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
    // 获取数据
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
    // 根据id获取数据
    getUserById (userId) {
      getUserById(userId)
        .then(res => {
          if (res.data.meta.status === 200) {
            this.uesrData = res.data.data
            // console.log(this.uesrData)
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
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
    // 用户编辑
    editUserById (userId) {
      this.editFormVisible = true
      this.getUserById(userId)
    },
    // 提交编辑
    editUser () {
      this.editFormVisible = false
      editUserById(this.uesrData.id, {
        username: this.uesrData.username,
        email: this.uesrData.email,
        mobile: this.uesrData.mobile
      })
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
    // 分配角色
    allotRoleById (userId) {
      this.allotFormVisible = true
      this.getUserById(userId)

      // 获取所有角色分类
      getAllRoles()
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.allRoles = res.data.data
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
.navbar {
  line-height: 45px;
}
</style>
