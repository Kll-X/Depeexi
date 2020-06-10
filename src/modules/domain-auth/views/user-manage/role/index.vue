<template>
  <div class="user-manage">
    <el-data-table ref="role-table" v-bind="tableConfig"></el-data-table>

    <el-drawer
      v-if="permission.isShow"
      :visible.sync="permission.isShow"
      title="配置权限"
      direction="rtl"
      size="650px"
    >
      <div class="config-permission">
        <p>
          <label>角色名称：</label>
          <el-input
            v-model="currentRoleData.name"
            style="width:300px;"
            disabled
          ></el-input>
        </p>
        <div class="config-permission-content">
          <label>配置权限</label>
          <el-tree
            ref="roleTree"
            :data="permission.data"
            :props="permission.props"
            default-expand-all
            class="permisison-tree"
            node-key="id"
            show-checkbox
          ></el-tree>
        </div>

        <operate-row>
          <el-button @click="permission.isShow = false">取消</el-button>
          <el-button type="primary" @click="savePermission">确定</el-button>
        </operate-row>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import {
  roleListUrl,
  changeUserStatus,
  getPermissionTree,
  saveRolePermission,
  deleteRole,
} from '../../../services/role-manage'

import columnsConfig from './column-config'
import searchConfig from './search-config'
import OperateRow from '../../../component/operate-row'

export default {
  components: {
    OperateRow,
  },
  data() {
    return {
      currentRoleData: {},
      checkedKeys: [],
      permission: {
        isShow: false,
        loading: false,
        data: [],
        props: {
          children: 'children',
          label: 'name',
        },
      },
      tableConfig: {
        dataPath: 'payload.content',
        totalPath: 'payload.totalElements',
        url: roleListUrl,
        operationAttrs: {
          width: '200px',
          fixed: 'right',
        },
        formAttrs: {
          'label-width': '120px',
        },
        hasOperate: false,
        hasNew: false,
        hasEdit: false,
        hasDelete: false,
        searchForm: searchConfig,
        extraButtons: [
          // {
          //   text: '禁用',
          //   show: ({status}) => status === 1,
          //   atClick: row => {
          //     return changeUserStatus({
          //       status: row.status,
          //     }).then(() => {
          //       this.$message.success('操作成功')
          //     })
          //   },
          // },
          // {
          //   text: '启用',
          //   show: ({status}) => status === 0,
          //   atClick: row => {
          //     return changeUserStatus({
          //       status: row.status,
          //     }).then(() => {
          //       this.$message.success('操作成功')
          //     })
          //   },
          // },
          {
            text: '修改',
            atClick: row => {
              this.$router.push({
                path: 'role-detail',
                query: {
                  id: row.id,
                },
              })
            },
          },
          {
            text: '配置权限',
            atClick: row => {
              this.currentRoleData = row
              this.getCurrentRoleTree(row.id)
              return Promise.resolve(false)
            },
          },
          {
            text: '删除',
            type: 'danger',
            atClick: row => {
              this.$confirm('确定要删除吗？')
                .then(() => {
                  return deleteRole(row.id)
                })
                .then(() => {
                  this.$refs['role-table'].getList()
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
              this.$router.push('role-detail')
            },
          },
        ],
        columns: columnsConfig(this.$createElement),
      },
    }
  },
  computed: {
    groupData() {
      return this.$store.state.user.functionGroupData
    },
  },
  methods: {
    filterCheckedKeys(arr, res = []) {
      arr.forEach(v => {
        v.checkedStatus && res.push(v.id)
        v.children && this.filterCheckedKeys(v.children, res)
      })

      return res
    },
    async getCurrentRoleTree(roleId) {
      let permissionData = await getPermissionTree(roleId, this.groupData.id)

      this.permission.data = permissionData.payload
      this.checkedKeys = this.filterCheckedKeys(permissionData.payload)
      this.permission.isShow = true

      await this.$nextTick()

      this.checkedKeys.forEach(v => {
        this.$refs.roleTree.setChecked(v, true, false)
      })
    },
    async savePermission() {
      let currentCheckKeys = this.$refs.roleTree.getCheckedNodes(false, true)
      currentCheckKeys = currentCheckKeys.map(v => v.id)
      let savedKeys = this.checkedKeys.slice(0)

      let data = {
        addElementIdList: currentCheckKeys.filter(
          v => !savedKeys.find(key => key == v),
        ),
        deleteElementIdList: savedKeys.filter(
          v => !currentCheckKeys.find(key => key == v),
        ),
      }

      this.permission.loading = true
      try {
        await saveRolePermission(
          this.currentRoleData.id,
          this.groupData.id,
          data,
        )
        this.$message.success('保存成功')
        this.permission.isShow = false
      } catch (e) {
      } finally {
        this.permission.loading = false
      }
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

.config-permission {
  padding: 20px;
  padding-top: 0;

  &-content {
    padding-top: 20px;
  }

  .permisison-tree {
    vertical-align: top;
    width: 500px;
    display: inline-block;
  }
}
</style>
