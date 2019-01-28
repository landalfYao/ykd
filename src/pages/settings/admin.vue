<template>
    <div>
        <h2>账号管理</h2>
        <div class="line" style="margin-top:15px"></div>
        <div class="search-bar">
            <Input v-for="(item,index) in searchList" :key="index" v-model="item.value" :placeholder="item.label" class="il in" />
            
            <Button class="il" @click="clear()">清空</Button>
            <Button class="il" type="primary" @click="search()" style="width:100px">搜索</Button>
        </div>
        <div class="panel-between">
            <ButtonGroup >
                <Button @click="update(-1)">删除</Button>
                <Button @click="update(0)">启用</Button>
                <Button @click="update(1)">关闭</Button>
                <Button @click="newDialog = true">新增账号</Button>
            </ButtonGroup>
            <div>
                <span>条数：</span>
                <InputNumber :step="1" v-model="query.size" @on-blur="changeSize" style="width:60px"></InputNumber>
            </div>
            
        </div>
        
        <el-table :data="data" style="width: 100%;margin-top:15px" @selection-change="handleSelectionChange">
            <el-table-column  type="selection" width="55"> </el-table-column>
            <el-table-column fixed prop="id" label="ID" width="60"> </el-table-column>
            <el-table-column fixed prop="remarks" label="备注" > 
                <template slot-scope="scope">
                    <el-button type="text" @click="selectionId=scope.row.id,remarks=scope.row.remarks,remarksDialog = true">{{scope.row.remarks}}</el-button>
                </template>
            </el-table-column>
            <el-table-column fixed prop="admin_name" label="管理员账号"> </el-table-column>
            <el-table-column fixed prop="status" :filters="[{text:'启用',value:0},{text:'关闭',value:1}]" 
                :filter-method="filterStatus" label="账号状态"> 
                <template slot-scope="scope">
                    <el-tag
                    :type="scope.row.status == 0 ? 'success' : 'danger'"
                    disable-transitions>{{scope.row.status == 0 ? '启用':'关闭'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed :filters="[{text:'管理员',value:0},{text:'基地',value:1}]" 
                :filter-method="filterType" label="账号类型"> 
                <template slot-scope="scope">
                    <el-tag
                    :type="scope.row.admin_type == 0 ? 'primary' : 'warning'"
                    disable-transitions>{{scope.row.admin_type == 0 ? '管理员':'基地'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column fixed prop="create_date" label="创建时间"> </el-table-column>
        </el-table>
        <div class="panel-end" style="margin-top:20px">
            <Page :total="total" :page-size="query.size" :current="query.page" size="small" show-total @on-change="changePage" />
        </div>
        

        <!-- ************************************************ -->
        <el-dialog title="修改备注" :visible.sync="remarksDialog" width="300px" center>
            <span><Input v-model="remarks" placeholder="修改备注"  /></span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="remarksDialog = false">取 消</el-button>
                <el-button type="primary" @click="remarksDialog = false,update(2)">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="添加管理员" :visible.sync="newDialog" width="300px" center>
            <Form :model="submitData" label-postion="top" >
                <FormItem label="账号">
                    <Input v-model="submitData.adminName" placeholder="账号"></Input>
                </FormItem>
                
                <FormItem label="登录密码">
                    <Input v-model="submitData.adminPwd" placeholder="登录密码"></Input>
                </FormItem>
                
                <FormItem label="备注">
                    <Input v-model="submitData.remarks" placeholder="备注"></Input>
                </FormItem>
                <FormItem label="类型">
                    <Select v-model="submitData.adminType" >
                        <Option value="0" >管理员账号</Option>
                        <Option value="1" >基地账号</Option>
                    </Select>
                </FormItem>
                <FormItem label="基地ID">
                    <Input v-model="submitData.jidid" placeholder="备注"></Input>
                </FormItem>
            </Form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="newDialog = false">取 消</el-button>
                <el-button type="primary" @click="newDialog = false,add()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
var that;
export default {
  data() {
    return {
      remarksDialog: false,
      newDialog: false,
      data: [],
      searchList: [
        { key: "Id", value: "", label: "输入ID" },
        { key: "remarks", value: "", label: "输入备注" },
        { key: "admin_name", value: "", label: "输入管理员账号" },
        { key: "create_date", value: "", label: "输入时间" }
      ],
      total: 0,
      query: {
        page: JSON.parse(sessionStorage.getItem("config")).current_page,
        size: JSON.parse(sessionStorage.getItem("config")).page_size,
        wheres: "",
        order: []
      },
      submitData: {
        id:sessionStorage.getItem('adminId'),
        adminName: "",
        adminPwd: "",
        adminType: 0,
        status: 0,
        remarks: "",
        jidid:""
      },
      multipleSelection: [],
      selectionId: "",
      remarks: ""
    };
  },
  mounted() {
    that = this;
    this.getDataList();
  },
  methods: {
    /******基础********************************************* */
    getDataList() {
      this.$http
        .get(
          this.com.NODE_API +
            "admin/finds?page=" +
            this.query.page +
            "&wheres=" +
            this.query.wheres +
            "&order=" +
            this.query.order.toString() +
            "&size=" +
            this.query.size
        )
        .then(res => {
          if (res.data.code == 1000) {
            that.data = res.data.data.list;
            that.total = res.data.data.total;
          } else {
            that.$message.error(res.data.msg);
          }
        });
    },
    changePage(e) {
      this.query.page = e;
      this.getDataList();
    },
    changeSize() {
      this.getDataList();
    },
    search() {
      this.query.wheres = this.com.filterSearch(this.searchList);
      this.getDataList();
    },
    clear() {
      this.query.wheres = "";
      for (var i in this.searchList) {
        this.searchList[i].value = "";
      }
      this.getDataList();
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      var arr = [];
      for (var i in val) {
        arr.push(val[i].id);
      }
      this.selectionId = arr.toString();
    },
    /**** 操作 *********************************************/
    checkSelection() {
      if (this.multipleSelection.length == 0) {
        this.$message({
          showClose: true,
          message: "提示：您还没有选择任何一项",
          type: "warning"
        });
        return false;
      } else {
        return true;
      }
    },
    update(e) {
      var data = {
        id: sessionStorage.getItem('adminId'),
        ids: this.selectionId
      };
      var url = "admin/update/";
      if (e == 2) {
        url += "remarks";
        data.remarks = that.remarks;
        that.doupdate(data, url);
        that.selectionId = "";
      } else if (this.checkSelection()) {
        if (e == -1) {
          url += "delete";
          this.$confirm(
            "此操作将永久删除该文件, 是否继续? 若误删请联系开发人员。",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          ).then(() => {
            that.doupdate(data, url);
          });
        } else if (e == 0) {
          url += "status_open";
          that.doupdate(data, url);
        } else if (e == 1) {
          url += "status_close";
          that.doupdate(data, url);
        }
      }
    },
    doupdate(data, url) {
      this.$http.post(this.com.NODE_API + url,{data:this.com.secrets.encrypt(JSON.stringify(data),'utf8', this.com.ivkey, 'hex', true)} ).then(res => {
        if (res.data.code == 1000) {
          that.$message({ message: res.data.msg, type: "success" });
          that.getDataList();
        } else {
          that.$message({ message: res.data.msg, type: "error" });
        }
      });
    },
    add() {
      this.$http
        .post(this.com.NODE_API + "admin/add", {data:this.com.secrets.encrypt(JSON.stringify(this.submitData),'utf8', this.com.ivkey, 'hex', true)})
        .then(res => {
          if (res.data.code == 1000) {
            that.$message({ message: res.data.msg, type: "success" });
            that.getDataList();
          } else {
            that.$message({ message: res.data.msg, type: "error" });
          }
        });
    },
    /**** 表格筛选 ********************************************/

    filterStatus(value, row) {
      return row.status == value;
    },
    filterType(value, row){
        return row.admin_type == value;
    }
  }
};
</script>
