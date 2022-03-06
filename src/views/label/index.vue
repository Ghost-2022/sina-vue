<template>
  <div class="scroll-y">
    <!--操作-->
    <div class="mr-3 rowSS">
      <el-button type="primary" @click="addBtnClick">新增</el-button>
      <el-button type="primary" @click="multiDelBtnClick">删除</el-button>
      <!--条件搜索-->
      <el-form ref="refsearchForm" :inline="true" class="demo-searchForm ml-3">
        <el-form-item label-width="0px" label="" prop="labelName" label-position="left">
          <el-input v-model="searchForm.labelName" class="widthPx-150" placeholder="标签名称" />
        </el-form-item>
      </el-form>
      <!--查询按钮-->
      <el-button type="primary" @click="searchBtnClick">搜索</el-button>
    </div>
    <!--表格和分页-->
    <el-table
      id="resetElementDialog"
      ref="refuserTable"
      height="calc(100vh - 280px)"
      border
      :data="VcitableData"
      @selection-change="handleSelectionChange"
    >
      <el-table-column align="center" type="selection" width="50" />
      <el-table-column align="center" prop="labelName" label="标签名称" min-width="100" />
      <el-table-column align="center" prop="rules" label="标签规则" min-width="100" />
      <!--点击操作-->
      <el-table-column align="center" label="操作" min-width="120">
        <template #default="{ row }">
          <el-button type="text" size="small" @click="tableEditClick(row)">编辑</el-button>
          <el-button type="text" size="small" @click="tableDelClick(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <div class="block columnCC mt-2 mb-5">
      <el-pagination
        :current-page="pageNum"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageTotalMixin"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
  <VciForm v-if="showFrom" ref="refVciForm" @hideComp="hideComp" @selectPageReq="selectPageReq" />
</template>

<script setup>
import { onMounted, ref, reactive, getCurrentInstance, nextTick } from 'vue'
import VciForm from './VciForm.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import tablePageHook from '@/hooks/tablePageHook'
let { proxy } = getCurrentInstance()
/*2.表格操作和查询*/
let multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
const refVciForm = ref(null)
let VcitableData = ref([])
let searchForm = reactive({
  labelName: ''
})
onMounted(() => {
  selectPageReq()
})
const getSearchData = () => {
  const data = Object.assign(searchForm, {
    pageNum: pageNum.value,
    pageSize: pageSize.value
  })
  Object.keys(data).forEach((fItem) => {
    if (data[fItem] === '' || data[fItem] === null || data[fItem] === undefined) delete data[fItem]
  })
  return data
}
// const { totalPage, startEndArr } = useCommon()
let selectPageReq = () => {
  let reqConfig = {
    url: '/integration-front/vci/selectPage',
    method: 'get',
    data: getSearchData(),
    isParams: true,
    isAlertErrorMsg: false
  }
  proxy.$axiosReq(reqConfig).then((resData) => {
    VcitableData.value = resData.data?.records
    proxy.pageTotalMixin = resData.data?.total
  })
}
// import tablePageHook from '@/hooks/useTablePage'
let { pageNum, pageSize, handleCurrentChange, handleSizeChange } = tablePageHook(selectPageReq)
// //添加和修改
let showFrom = ref(false)
let addBtnClick = () => {
  showFrom.value = true
  nextTick(() => {
    refVciForm.value.showModal()
  })
}
let tableEditClick = (row) => {
  showFrom.value = true
  nextTick(() => {
    refVciForm.value.showModal(true, row)
  })
}
const hideComp = () => {
  showFrom.value = false
}
//删除
// let { elMessage, elConfirm } = useElement()
let deleteByIdReq = (id) => {
  return proxy.$axiosReq({
    url: '/integration-front/vci/deleteById',
    data: { id: id },
    isParams: true,
    method: 'delete',
    bfLoading: true
  })
}
let tableDelClick = async (row) => {
  await ElMessageBox.confirm('确定', `您确定要删除【${row.labelName}】吗？`)
  deleteByIdReq(row.id).then(() => {
    selectPageReq()
    ElMessage({ message: `【${row.labelName}】删除成功`, type: 'success' })
  })
}
//批量删除
const multiDelBtnClick = async () => {
  let rowDeleteIdArr = []
  let deleteNameTitle = ''
  rowDeleteIdArr = multipleSelection.value.map((mItem) => {
    deleteNameTitle = deleteNameTitle + mItem.sn + ','
    return mItem.id
  })
  if (rowDeleteIdArr.length === 0) {
    ElMessage({ message: `表格选项不能为空`, type: 'success' })
    return
  }
  let stringLength = deleteNameTitle.length - 1
  await ElMessageBox.confirm('删除', `您确定要删除${deleteNameTitle.slice(0, stringLength)}吗`)
  const data = rowDeleteIdArr
  proxy
    .$axiosReq({
      url: `/integration-front/vci/deleteBatchIds`,
      data,
      method: 'DELETE',
      bfLoading: true
    })
    .then(() => {
      ElMessage({ message: `删除成功`, type: 'success' })
      selectPageReq()
    })
}
</script>
<style scoped lang="scss">
/*详情*/
.detail-container {
  flex-wrap: wrap;
}
.detail-container-item {
  min-width: 40%;
  margin-bottom: 20px;
}
.detailDialog-title {
  margin-bottom: 14px;
  font-weight: bold;
  font-size: 16px;
}
</style>
