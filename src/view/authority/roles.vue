<template>
  <div class="roles">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="navbar">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 添加按钮区域 -->
    <el-button type="primary" round @click="addFormVisible = true">添加角色</el-button>
    <!-- 角色列表区域 -->
    <el-table :data="rolesList" border style="width: 100%;margin-top:15px">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 准备进行嵌套循环生成展开行数据展示结构 -->
          <el-row
            v-for="first in scope.row.children"
            :key="first.id"
            style="margin-bottom:15px;border-bottom:1px dashed #ccc"
          >
            <el-col :span="4">
              <el-tag
                closable
                :type="'success'"
                @close="cnt=0;delRights(scope.row,first.id)"
              >{{first.authName}}</el-tag>
            </el-col>
            <el-col :span="20">
              <el-row v-for="second in first.children" :key="second.id" style="margin-bottom:10px">
                <el-col :span="4">
                  <el-tag
                    closable
                    :type="'info'"
                    @close="cnt=0;delRights(scope.row,second.id)"
                  >{{second.authName}}</el-tag>
                </el-col>
                <el-col :span="20">
                  <el-tag
                    closable
                    v-for="third in second.children"
                    :key="third.id"
                    :type="'warning'"
                    style="margin-right:5px;margin-bottom:5px"
                    @close="cnt=0;delRights(scope.row,third.id)"
                  >{{third.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" v-show="scope.row.children.length===0">还没有任何权限，请先分配!</el-col>
          </el-row>
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
          <el-tooltip class="item" effect="dark" content="角色授权" placement="top">
            <el-button type="primary" icon="el-icon-caret-bottom" @click="showGrant(scope.row)"></el-button>
          </el-tooltip>
          <el-tooltip class="item" effect="dark" content="删除" placement="top">
            <el-button type="primary" icon="el-icon-delete" @click="delRole(scope.row.id)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <!-- 角色授权 -->
    <el-dialog title="角色授权" :visible.sync="grantFormVisible" :close-on-click-modal="false">
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        ref="tree"
        :default-expand-all="true"
        :default-checked-keys="chkedArr"
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="grantFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="grantRights">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 添加角色 -->
    <el-dialog title="添加角色" :visible.sync="addFormVisible" :close-on-click-modal="false">
      <el-form ref="roleForm" :model="roleForm" :rules="rules" label-width="100px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addNewRole()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getAllRoles,
  delRightById,
  addRole,
  delRoleById,
  grantRightsById
} from '@/api/roles_index.js'
import { getAllRights } from '@/api/rights_index.js'
export default {
  data () {
    return {
      cnt: 0,
      defaultProps: {
        label: 'authName',
        children: 'children'
      },
      rightsList: [],
      chkedArr: [],
      rolesList: [],
      grantFormVisible: false,
      currentUserId: '',
      // ridList: [],
      addFormVisible: false,
      roleForm: {
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请填写角色名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 添加新角色
    addNewRole () {
      // 二次验证
      this.$refs.roleForm.validate(valid => {
        if (valid) {
          addRole(this.roleForm)
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 201) {
                this.$message.success(res.data.meta.msg)
                this.$refs.roleForm.resetFields()
                this.init()
              } else {
                this.$message.error(res.data.meta.msg)
              }
            })
            .catch(err => {
              console.log(err)
              this.$message.error('服务器异常，稍后重试')
            })

          this.addFormVisible = false
        } else {
          this.$message.error('请输入必填信息')
          return false
        }
      })
    },
    // 通过id删除角色
    delRole (id) {
      // console.log(id)
      this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          delRoleById(id)
            .then(res => {
              // console.log(res)
              if (res.data.meta.status === 200) {
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                })
                this.init()
              } else {
                this.$message.error(res.data.meta.msg)
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
    },
    // 展示角色授权对话框
    showGrant (row) {
      this.currentUserId = row.id
      this.grantFormVisible = true
      // 获取所有权限--更新
      // this.initial()
      // 深拷贝也可以实现更新
      this.rightsList = [...this.rightsList]
      // console.log(row)
      this.chkedArr.length = 0
      if (row.children && row.children.length > 0) {
        row.children.forEach(first => {
          if (first.children && first.children.length > 0) {
            first.children.forEach(second => {
              if (second.children && second.children.length > 0) {
                second.children.forEach(third => {
                  // console.log(third.id)
                  this.chkedArr.push(third.id)
                })
              }
            })
          }
        })
      }
    },
    // 角色授权
    async grantRights () {
      // console.log(this.$refs.tree.getCheckedKeys())
      // 1.获取节点数据
      let arr = this.$refs.tree.getCheckedNodes()
      // console.log(arr)
      // 2.遍历数组,拼接数据
      let temp = []
      arr.forEach(e => {
        temp.push(e.id + ',' + e.pid)
      })
      // console.log(temp) ['131,110,125', '145,0', '146,145', '148,146,145']
      // 3将获取到的数组数据进行拼接
      let tempstr = temp.join(',')
      // console.log(tempstr)  145,0,146,145,148,146,145
      // 4.将字符串重新转换成数组
      let temparr = tempstr.split(',')
      // console.log(temparr) ["145", "0", "146", "145", "148", "146", "145"]
      // 5.数组去重--es6新语法
      let finaltemp = [...new Set(temparr)]
      // console.log(finaltemp) ["145", "0", "146", "148"]
      // 6.将数组转换成最终我们需要的字符串
      let rids = finaltemp.join(',')
      // console.log(rids) 145,0,146,148
      // 用es7新语法做一遍
      let res = await grantRightsById(this.currentUserId, rids)
      console.log(res)
      if (res.data.meta.status === 200) {
        this.$message.success(res.data.meta.msg)
        this.init()
        this.grantFormVisible = false
      } else {
        this.$message.error(res.data.meta.msg)
      }
      // grantRightsById(this.currentUserId, rids)
      //   .then(res => {
      //     if (res.data.meta.status === 200) {
      //       this.$message.success(res.data.meta.msg)
      //       this.init()
      //     } else {
      //       this.$message.error(res.data.meta.msg)
      //     }
      //     this.grantFormVisible = false
      //   })
      //   .catch(err => {
      //     console.log(err)
      //   })
    },
    // 删除角色指定权限
    delRights (row, rid) {
      delRightById(row.id, rid)
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            if (this.cnt === 0) {
              this.$message.success(res.data.meta.msg)
              this.cnt++
            }
            // 刷新
            row.children = res.data.data
            // 判断当前权限是否还有下一级权限，如果没有下级权限，则当前的权限也应该删除
            row.children.forEach((e1, i1) => { // 遍历一级权限
              if (e1.children.length === 0) { // 说明这个一级权限下面没有任何的二级权限
                this.delRights(row, e1.id)
              } else {
                e1.children.forEach((e2, i2) => { // 遍历二级权限
                  if (e2.children.length === 0) { // 说明这个二级权限下面没有任何三级权限
                    this.delRights(row, e2.id)
                  }
                })
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取所有角色
    init () {
      getAllRoles()
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.rolesList = res.data.data
          } else {
            this.$message.error(res.data.meta.msg)
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 获取所有权限
    initial () {
      getAllRights('tree')
        .then(res => {
          // console.log(res)
          if (res.data.meta.status === 200) {
            this.rightsList = res.data.data
          }
        })
        .catch(err => {
          console.log(err)
        })
    }
  },
  mounted () {
    this.init()
    // 获取所有权限
    this.initial()
  }
}
</script>

<style lang="less" scoped>
.navbar {
  line-height: 45px;
}
</style>
