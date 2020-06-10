<template>
  <div class="user-manage">
    <el-data-table ref="user-table" v-bind="userTableConfig"></el-data-table>

    <el-drawer
      v-if="showDistributeDialog"
      :visible.sync="showDistributeDialog"
      title="分配角色"
      direction="rtl"
      size="650px"
    >
      <div style="padding:15px;">
        <el-data-table
          ref="roleTable"
          v-bind="roleTableConfig"
          @update="dataUpdate"
        ></el-data-table>
        <operate-row>
          <el-button @click="showDistributeDialog = false">取 消</el-button>
          <el-button :loading="false" type="primary" @click="distributeRole"
            >确 定</el-button
          >
        </operate-row>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  userListUrl,
  changeUserStatus,
  getUserRoles,
  updateUserRoles,
  deleteUser,
} from '../../../services/user-manage'
import StateTag from '../../../component/state-tag'
import {roleListUrl} from '../../../services/role-manage'

import columnsConfig from './column-config'
import searchConfig from './search-config'
import roleColumnsConfig from '../role/column-config'

import OperateRow from '../../../component/operate-row'

const ENABLE = 1
const DISABLE = 0

export default {
  components: {
    OperateRow,
    StateTag,
  },
  data() {
    return {
      showDistributeDialog: false,
      roleTableData: [],
      currentUserRoles: [],
      currentRoleData: {},
      userTableConfig: {
        dataPath: 'payload.content',
        totalPath: 'payload.totalElements',
        url: userListUrl,
        hasEdit: false,
        hasDelete: false,
        hasNew: false,
        operationAttrs: {
          width: '200px',
          fixed: 'right',
        },
        formAttrs: {
          'label-width': '120px',
        },
        extraButtons: [
          {
            text: '修改',
            atClick: row => {
              this.$router.push({
                path: 'user-detail',
                query: {
                  id: row.id,
                },
              })
            },
          },
          {
            text: '禁用',
            type: 'danger',
            show: ({status}) => status == ENABLE,
            atClick: row => {
              return changeUserStatus(row.id, DISABLE).then(() => {
                this.$message.success('操作成功')
              })
            },
          },
          {
            text: '启用',
            show: ({status}) => status == DISABLE,
            atClick: row => {
              return changeUserStatus(row.id, ENABLE).then(() => {
                this.$message.success('操作成功')
              })
            },
          },
          {
            text: '分配角色',
            atClick: row => {
              return getUserRoles(row.id).then(res => {
                this.currentUserRoles = res.payload.map(v => v.id)
                this.showDistributeDialog = true
                this.currentRoleData = row
                return false
              })
            },
          },
          {
            text: '删除',
            type: 'danger',
            show: ({status}) => status == DISABLE,
            atClick: row => {
              this.$confirm('确定要删除吗？')
                .then(() => {
                  return deleteUser(row.id)
                })
                .then(() => {
                  this.$refs['user-table'].getList()
                  this.$message.success('删除成功')
                })
                .catch(() => {})
              return Promise.resolve(false)
            },
          },
        ],
        headerButtons: [
          {
            type: 'primary',
            text: '新增',
            atClick: row => {
              this.$router.push('user-detail')
            },
          },
        ],
        searchForm: searchConfig,
        columns: columnsConfig(this.$createElement),
      },
      roleTableConfig: {
        dataPath: 'payload.content',
        totalPath: 'payload.totalElements',
        url: roleListUrl,
        hasNew: false,
        hasOperation: false,
        hasDelete: false,
        paginationLayout: 'total, sizes, prev, pager, next',
        columns: roleColumnsConfig(this.$createElement),
      },
    }
  },
  methods: {
    /**
     * 已保存的角色，默认选中
     */
    async dataUpdate(data) {
      await this.$nextTick()

      let table = this.$refs.roleTable.$refs.table
      data.forEach(v => {
        if (this.currentUserRoles.find(role => role == v.id)) {
          table.toggleRowSelection(v)
        }
      })
    },
    /**
     * 分配角色
     */
    distributeRole() {
      let currentCheckKeys = this.$refs.roleTable.selected.map(v => v.id)
      let savedKeys = this.currentUserRoles.slice(0)

      let data = {
        saveRoleIds: currentCheckKeys.filter(
          v => !savedKeys.find(key => key == v),
        ),
        delRoleIds: savedKeys.filter(
          v => !currentCheckKeys.find(key => key == v),
        ),
      }

      updateUserRoles(this.currentRoleData.id, data)
        .then(res => {
          this.$message.success('保存成功')
          this.showDistributeDialog = false
        })
        .catch(e => {})
    },
  },
}
</script>

<style lang="less" scoped>
.user-manage {
  padding: 20px;
}

.enable {
  color: #2a50de;
}

.disable {
  color: #ea1f1f;
}
</style>
