<script setup>
import { async } from "q";
import { ref } from "vue"
import request from "./utils/request";
// 数据
let queryInput = ref("")
const tableData = ref([
  // {
  //   id: "1",
  //   name: 'Tom1',
  //   email: '21111@qq.com',
  //   phone: '12121212121',
  //   status: '在线',
  //   address: 'No. 189, Grove St, Los Angeles',
  // },
  // {
  //   id: "2",
  //   name: 'Tom2',
  //   email: '21111@qq.com',
  //   phone: '12121212121',
  //   status: '在线',
  //   address: 'No. 189, Grove St, Los Angeles',
  // },
  // {
  //   id: "3",
  //   name: 'Tom3',
  //   email: '21111@qq.com',
  //   phone: '12121212121',
  //   status: '在线',
  //   address: 'No. 189, Grove St, Los Angeles',
  // },
  // {
  //   id: "4",
  //   name: 'Tom4',
  //   email: '21111@qq.com',
  //   phone: '12121212121',
  //   status: '在线',
  //   address: 'No. 189, Grove St, Los Angeles',
  // },
])
let tableDataCopy = Object.assign(tableData.value)
let multipleSelection = ref([])
let dialogFormVisible = ref(false)
let tableForm = ref(
  {
    name: '张三',
    email: "12121",
    phone: 12121212,
    status: "在线",
    address: "北京"
  }
)
let dialogType = ref('add')
let total = ref(10)
let curPage = ref(1)
// 方法
// 删除一条
const handleDelete = async ({ ID }) => {
  // console.log(row.id)
  // 通过id获取对应值
  // let index = tableData.value.findIndex(item => item.id === row.id)
  // console.log(index)
  // // 通过索引值删除对应条目
  // tableData.value.splice(index, 1)

  await request.delete(`/delete/${ID}`)
  await getTableData(curPage)
}


// 选择
const handleSelectionChange = (val) => {
  // multipleSelection.value = val
  // console.log(val)
  multipleSelection.value = []
  val.forEach(item => {
    multipleSelection.value.push(item.ID)
  })
  // console.log(multipleSelection.value)
}
// 添加
const handleAdd = () => {
  dialogType = 'add'
  dialogFormVisible.value = true
  // 清空数据
  tableForm.value = {}
}
// console.log(tableForm)
// 添加确认
const dialogConfirm = async () => {
  // 关闭弹窗
  dialogFormVisible.value = false
  // 判断是新增还是编辑
  if (dialogType === 'add') {
    // 1.拿到数据
    // 2.添加到table

    // tableData.value.push({
    //   id: (tableData.value.length + 1).toString(),
    //   ...tableForm.value
    // })

    // 添加数据
    await request.post("/add", {
      ...tableForm.value // 展开运算符
    })
    // 刷新数据
    getTableData(curPage)
  } else if (dialogType === 'edit') {
    // // 获取到当前这条的索引
    // tableData.value[index] = tableForm.value
    // // console.log(index)
    // // 替换值

    // 编辑
    await request.put(`/update/${tableForm.value.ID}`, {
      ...tableForm.value
    })
    console.log(tableForm.value.ID)
    await getTableData(curPage)
  }

}
// 删除多条
const handleDelList = () => {
  multipleSelection.value.forEach(ID => {
    handleDelete({ ID })
    // console.log(id)
  })
  multipleSelection.value = []
}
// 编辑
const handleEdit = (row) => {
  // console.log("123")
  dialogType = 'edit'
  dialogFormVisible.value = true

  tableForm.value = { ...row }
}
// 搜索
const handfQueryName = async (val) => {
  // // console.log(queryInput.value)
  // // console.log(val)
  // if (val.length > 0) {
  //   // 输入框有值
  //   tableData.value = tableData.value.filter(item => item.name.toLowerCase().match(val.toLowerCase()))
  //   // console.log(tableData)
  // } else {
  //   //输入框没有值还是原值
  //   // console.log(tableDataCopy.value)
  //   tableData.value = tableDataCopy
  //   // console.log(tableData.value)
  // }

  if (val.length > 0) {
    tableData.value = await request.get(`/list/${val}`)
  }else{
    await getTableData(curPage)
  }

}
// request
const getTableData = async (cur = 1) => {
  let res = await request.get('/list', {
    pageSize: 10,
    pageNum: cur
  })
  // let res = await request.get(`/list?pageSize=10&pageNum=${cur}`)
  // console.log(res)
  tableData.value = res.list
  total = res.total
  curPage = res.pageNum
  // console.log(total.value)
}
getTableData(1)
// 请求分页
const handleChangePage = () => {
  getTableData(curPage)
}
</script>

<template>
  <div class="table-box">
    <div class="title">
      <h3>Go实现CRUD</h3>
    </div>
    <!-- query -->
    <div class="query-box">
      <el-input class="query-input" v-model="queryInput" placeholder="请输入姓名" @change="handfQueryName" />
      <div class="buttonlist">
        <el-button type="primary" @click="handleAdd">增加</el-button>
        <el-button type="danger" @click="handleDelList" v-if="multipleSelection.length > 0">删除多选</el-button>
      </div>

    </div>
    <!-- table -->
    <el-table :data="tableData" border style="width: 100%" ref="multipleTableRef"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" />
      <!-- <el-table-column label="Date" width="120">
        <template #default="scope">{{ scope.row.date }}</template>
      </el-table-column> -->
      <el-table-column prop="name" label="姓名" width="150" />
      <el-table-column prop="email" label="邮箱" width="120" />
      <el-table-column prop="phone" label="电话" width="120" />
      <el-table-column prop="status" label="状态" width="120" />
      <el-table-column prop="address" label="地址" width="300" />
      <el-table-column fixed="right" label="操作" width="120">
        <template #default="scope">
          <el-button size="small" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- dialog -->
    <el-dialog v-model="dialogFormVisible" :title="dialogType === 'add' ? '新增' : '编辑'">
      <el-form :model="tableForm">
        <el-form-item label="姓名" :label-width="80">
          <el-input v-model="tableForm.name" autocomplete="off" />
        </el-form-item>
        <el-form-item label="邮箱" :label-width="80">
          <el-input v-model="tableForm.email" autocomplete="off" />
        </el-form-item>
        <el-form-item label="电话" :label-width="80">
          <el-input v-model="tableForm.phone" autocomplete="off" />
        </el-form-item>
        <el-form-item label="状态" :label-width="80">
          <el-input v-model="tableForm.status" autocomplete="off" />
        </el-form-item>
        <el-form-item label="地址" :label-width="80">
          <el-input v-model="tableForm.address" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogConfirm">
            确认
          </el-button>
        </span>
      </template>
    </el-dialog>
    <!-- 分页 -->
    <div class="example-pagination-block">
      <el-pagination layout="prev, pager, next" :total="total" v-model:current-page="curPage"
        @current-change="handleChangePage" />
    </div>
  </div>
</template>

<style scoped>
.table-box {
  width: 800px;
  margin: 200px auto;
}

.title {
  text-align: center;
}

.query-box {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.query-input {
  width: 200px;
}

.example-pagination-block {
  margin-top: 10px;
  display: flex;
  justify-content: center;
}
</style>
