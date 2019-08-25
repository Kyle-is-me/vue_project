<template>
  <div class="right">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="navbar">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表区域 -->
    <el-table :data="rightsList" border style="width: 100%">
      <el-table-column type="index" style="width:50px"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="" label="层级">
          <template slot-scope="scope">
              {{scope.row.level | levelFormat}}
          </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllRights } from '@/api/rights_index.js'
export default {
  data () {
    return {
      type: 'list',
      rightsList: []
    }
  },
  mounted () {
    getAllRights(this.type)
      .then((res) => {
        // console.log(res)
        if (res.data.meta.status === 200) {
          this.rightsList = res.data.data
        }
      })
      .catch((err) => {
        console.log(err)
      })
  },
  // 定义过滤器
  filters: {
    levelFormat (level) {
      if (level === '0') {
        return '一级'
      } else if (level === '1') {
        return '二级'
      } else if (level === '2') {
        return '三级'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.navbar {
  line-height: 45px;
}
</style>
