<script>
  import { bitable } from '@lark-base-open/js-sdk';
  import { ref, onMounted } from 'vue';
  import {
    ElButton,
    ElForm,
    ElFormItem,
    ElSelect,
    ElOption,
  } from 'element-plus';

  export default {
    components: {
      ElButton,
      ElForm,
      ElFormItem,
      ElSelect,
      ElOption,
    },
    setup() {
      const formData = ref({ table: '' });
      const tableMetaList = ref([]);

      const addRecord = async () => {
        const tableId = formData.value.table;
        if (tableId) {
          const table = await bitable.base.getTableById(tableId);
          table.addRecord({ fields: {} });
        }
      };

      onMounted(async () => {
        const [tableList, selection] = await Promise.all([bitable.base.getTableMetaList(), bitable.base.getSelection()]);
        formData.value.table = selection.tableId;
        tableMetaList.value = tableList;
      });

      return {
        formData,
        tableMetaList,
        addRecord,
      };
    },
  };
</script>

<template>
  <el-header style="display: flex; align-items: center; justify-content: center; height: 60px;">
    <h1 style="margin: 0; font-size: 16px; font-weight: bold; text-align: center; width: 100%;">上传数据</h1>
  </el-header>
  <el-main>
    <el-upload
      class="upload-demo"
      drag
      :action="uploadUrl"
      :show-file-list="false"
      :before-upload="beforeUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :headers="headers"
      :data="uploadData"
      accept=".zip"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      <div class="el-upload__tip" slot="tip">只能上传.zip文件</div>
    </el-upload>
    <!-- 简历文件名列表 -->
    <el-table :data="fileList" style="width: 100%; margin-top: 20px;">
      <el-table-column prop="file_name" label="文件名" min-width="80%" />
      <el-table-column label="操作" min-width="20%" align="center">
        <template #default="scope">
          <el-button type="primary" size="small" @click="changeStatus(scope.row)">已确认</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      style="margin-top: 10px; text-align: right"
      background
      layout="prev, pager, next"
      :current-page="page"
      :page-size="pageSize"
      :total="total"
      @current-change="val => { page = val; fetchResumeList() }"
    />
  </el-main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import axios from 'axios'

const uploadUrl = ref('/api/upload-file')

const headers = ref({})
const uploadData = ref({})

const beforeUpload = (file) => {
  const isZip = file.type === 'application/zip' || file.name.endsWith('.zip')
  if (!isZip) {
    ElMessage.error('只能上传.zip文件')
  }
  return isZip
}

const fileList = ref([])
const total = ref(0)
const page = ref(1)
const pageSize = ref(20)

const fetchResumeList = async () => {
  try {
    const res = await axios.get('/api/lark/plugin/hr/list', {
      params: {
        page: page.value,
        size: pageSize.value,
        status: "error"
      }
    })
    if (res.data.status === 'success') {
      fileList.value = res.data.data.items
      total.value = res.data.data.total
      page.value = res.data.data.page
      pageSize.value = res.data.data.page_size
    }
  } catch (e) {
    ElMessage.error('获取简历列表失败')
  }
}

const handleSuccess = async (response) => {
  const token = response?.token
  if (!token) {
    ElMessage.error('上传返回结果无效')
    return
  }
  try {
    const res = await axios.get(`/api/lark/plugin/hr/${token}`)
    console.log('二次请求结果:', res.data)
    ElMessage.success('处理成功')
    await fetchResumeList()
  } catch (e) {
    ElMessage.error('二次请求失败')
  }
}

const changeStatus = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确定要修改该条记录的状态吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    await axios.get('/api/lark/plugin/hr/update_status', {
      params: {
        cv_id: row.id,
        status: 'processed'
      }
    })
    ElMessage.success('状态修改成功')
    fetchResumeList()
  } catch (e) {
    if (e !== 'cancel') {
      ElMessage.error('状态修改失败')
    }
  }
}

onMounted(() => {
  fetchResumeList()
})

</script>

<style scoped>
el-header {
  width: 100%;
  height: 60px;
  padding: 0;
  /* 让 header 内部内容居中 */
  display: flex;
  justify-content: center;
  align-items: center;
}

el-header h1 {
  margin: 0;
  width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: bold;
}
</style>
