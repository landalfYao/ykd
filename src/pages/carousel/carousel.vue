<template>
    <div>
        <h2>广告列表</h2>
        <div class="line" style="margin-top:15px"></div>
        <div class="search-bar">
            <Input v-for="(item,index) in searchList" :key="index" v-model="item.value" :placeholder="item.label" class="il in" />
            
            <Button class="il" @click="clear()">清空</Button>
            <Button class="il" type="primary" @click="search()" style="width:100px">搜索</Button>
        </div>
        <div class="panel-between">
            <ButtonGroup >
                <Button @click="update(-1)">删除</Button>
                <Button @click="update(0)">显示</Button>
                <Button @click="update(1)">关闭</Button>
                <Button @click="navTo('/carousel_edit')">新增广告</Button>
            </ButtonGroup>
            <div>
                <span>条数：</span>
                <InputNumber :step="1" v-model="query.size" @on-blur="changeSize" style="width:60px"></InputNumber>
            </div>
            
        </div>
        
        <el-table :data="data" style="width: 100%;margin-top:15px" @selection-change="handleSelectionChange">
            <el-table-column  type="selection" width="55"> </el-table-column>
            <el-table-column  prop="sort" label="序号" > </el-table-column>
            <el-table-column  prop="company" label="广告商" >  </el-table-column>
            <el-table-column   label="img"> 
                <template slot-scope="scope">
                  <img :src="scope.row.img" height="50px" alt="">
                </template>
            </el-table-column>
            <el-table-column  prop="phone" label="电话" >  </el-table-column>
            <el-table-column  :filters="[{text:'显示',value:0},{text:'关闭',value:1}]" 
                :filter-method="filterStatus" label="状态"> 
                <template slot-scope="scope">
                    <el-tag
                    :type="scope.row.status == 1 ? 'danger' : 'success'"
                    disable-transitions>{{scope.row.status == 0 ? '显示':'关闭'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="remarks" label="备注"> </el-table-column>
            <el-table-column prop="path" label="路径"> </el-table-column>
            <el-table-column prop="start_time" label="开始时间"> </el-table-column>
            <el-table-column prop="end_time" label="结束时间"> </el-table-column>
            <el-table-column label="操作"> 
                <template slot-scope="scope">
                    <el-button type="text" @click="navTo('/carousel_edit',scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="panel-end" style="margin-top:20px">
            <Page :total="total" :page-size="query.size" :current="query.page" size="small" show-total @on-change="changePage" />
        </div>
        

        <!-- ************************************************ -->
     

    </div>
</template>

<script>
var that;
export default {
  data() {
    return {
      remarksDialog: false,
      newDialog: false,
      content:'',
      data: [],
      bgcolor: JSON.parse(sessionStorage.getItem("config")).wx_background_color,
      frcolor: JSON.parse(sessionStorage.getItem("config")).wx_front_color,
      searchList: [
        { key: "sort", value: "", label: "输入序号" },
        { key: "company", value: "", label: "输入广告商" },
        { key: "phone", value: "", label: "输入电话" },
        { key: "remarks", value: "", label: "输入备注" }
      ],
      total: 0,
      query: {
        page: JSON.parse(sessionStorage.getItem("config")).current_page,
        size: JSON.parse(sessionStorage.getItem("config")).page_size,
        wheres: "",
        order: "sort asc,create_date desc"
      },
      submitData: {
        id:sessionStorage.getItem('adminId'),
        adminName: "",
        adminPwd: "",
        adminType: 0,
        status: 0,
        remarks: ""
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
    navTo(path,data){
        var query = {}
        if(data){
            query.data = this.com.secrets.encrypt( JSON.stringify({data:data}), "utf8", this.com.ivkey, "hex",  true )
        }
        this.$router.push({path:path,query:query})
    },
    /******基础********************************************* */
    getDataList() {
      this.$http
        .post(
          this.com.NODE_API +
            "carousel/finds" ,
            {data:this.com.secrets.encrypt(JSON.stringify(this.query),'utf8', this.com.ivkey, 'hex', true)}
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
      this.query.wheres = this.com.filterSearch(this.searchList).toString();
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
        arr.push(val[i].Id);
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
        admin_id: sessionStorage.getItem('adminId'),
        ids: this.selectionId
      };
      var url = "carousel/update/";
      if (e == 2) {
        url += "remarks";
        data.remarks = that.remarks;
        that.doupdate(data, url);
        that.selectionId = "";
      } else if (this.checkSelection()) {
        if (e == -1) {
          url += "del";
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
          url += "show";
          that.doupdate(data, url);
        } else if (e == 1) {
          url += "unshow";
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
    /**** 表格筛选 ********************************************/

    filterStatus(value, row) {
      return row.is_show == value;
    },
    filterType(value, row){
        return row.admin_type == value;
    }
  }
};
</script>
