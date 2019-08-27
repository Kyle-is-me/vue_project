<template>
  <div class="list">
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right" class="navbar">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 搜索框+按钮 -->
    <div style="margin-top: 15px;">
      <el-input
        placeholder="请输入内容"
        v-model="goodsObj.query"
        class="input-with-select"
        style="width:300px;margin-right:10px"
      >
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button type="success" round>添加商品</el-button>
    </div>

    <!-- 商品列表区域 -->
    <el-table :data="goodList" border stripe style="width: 100%;margin-top:15px">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="goods_name" label="商品名称" width="300px"></el-table-column>
      <el-table-column prop="goods_price" label="商品价格"></el-table-column>
      <el-table-column  label="商品状态">
        <template slot-scope="scope">
          {{scope.row.goods_state | stateFormat}}
        </template>
      </el-table-column>
      <el-table-column prop="goods_weight" label="商品重量"></el-table-column>
      <el-table-column  label="创建时间">
         <template slot-scope="scope">
          {{scope.row.upd_time | timeFormat('-')}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100px">
        <template >
          <el-tooltip  effect="dark" content="编辑" placement="top-start">
          <el-button type="primary" icon="el-icon-edit"></el-button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="审核" placement="top-start">
          <el-button type="primary" icon="el-icon-check"></el-button>
          </el-tooltip>
          <el-tooltip  effect="dark" content="删除" placement="top-start">
          <el-button type="primary" icon="el-icon-delete"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页功能区域 -->
  </div>
</template>

<script>
import { getAllGoods } from '@/api/goods_index.js'
export default {
  data () {
    return {
      goodList: [],
      goodsObj: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0
    }
  },
  mounted () {
    getAllGoods(this.goodsObj)
      .then(res => {
        console.log(res)
        if (res.data.meta.status === 200) {
          this.goodList = res.data.data.goods
          this.total = res.data.data.total
        }
      })
      .catch(err => {
        console.log(err)
      })
  },
  filters: {
    timeFormat (seconds, spe) {
      let date = new Date(seconds * 1000)
      let year = date.getFullYear()
      let month = date.getMonth() + 1
      let day = date.getDate()
      return year + spe + month + spe + day
    },
    stateFormat (state) {
      if (state === 0) {
        return '未通过'
      } else if (state === 1) {
        return '审核中'
      } else if (state === 2) {
        return '已审核'
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
