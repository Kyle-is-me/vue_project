<template>
  <div class="roles">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="navbar">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮区域 -->
    <el-button type="primary" round>添加角色</el-button>
    <!-- 角色列表区域 -->
    <el-table :data="rolesList" border style="width: 100%;margin-top:15px">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-tag v-for="item in rolesList" :key="item.id" closable >{{scope.authName}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-tooltip class="item" effect="dark" content="编辑" placement="top">
            <el-button type="primary" icon="el-icon-edit" @click="a(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="分配角色" placement="top">
            <el-button type="primary" icon="el-icon-caret-bottom"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllRoles } from '@/api/roles_index.js'
export default {
  data () {
    return {
      rolesList: []

    }
  },
  mounted () {
    getAllRoles()
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.rolesList = res.data.data
        } else {
          this.$message.error(res.data.meta.msg)
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
