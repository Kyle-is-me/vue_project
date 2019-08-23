<template>
  <div class="user">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
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
    <!-- 表格 -->
    <el-table :data="userList" border style="width: 100%;margin-top:15px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template>
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="primary" icon="el-icon-share"></el-button>
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
        :total= 'total'
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import { getAllUsers } from '@/api/user_index.js'
export default {
  data () {
    return {
      total: 0,
      userList: [],
      userObj: {
        query: '',
        pagenum: 1,
        pagesize: 3
      }

    }
  },
  methods: {
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
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
</style>
