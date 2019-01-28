<template>
    <div>
        <h2>富文本列表</h2>
        <div class="line" style="margin-top:15px"></div>
        <div class="search-bar">
            <Input v-for="(item,index) in searchList" :key="index" v-model="item.value" :placeholder="item.label" class="il in" />
            
            <Button class="il" @click="clear()">清空</Button>
            <Button class="il" type="primary" @click="search()" style="width:100px">搜索</Button>
        </div>
        <div class="panel-between">
            <ButtonGroup >
                <Button @click="update(-1)">删除</Button>
                <Button @click="update(0)">上架</Button>
                <Button @click="update(1)">下架</Button>
            </ButtonGroup>
            <div>
                <span>条数：</span>
                <InputNumber :step="1" v-model="query.size" @on-blur="changeSize" style="width:60px"></InputNumber>
            </div>
            
        </div>
        
        <el-table :data="data" style="width: 100%;margin-top:15px" @selection-change="handleSelectionChange">
            <el-table-column  type="selection" width="55"> </el-table-column>
            <el-table-column  prop="Id" label="ID" > </el-table-column>
            <el-table-column  prop="author" label="编辑人" >  </el-table-column>
            <el-table-column  prop="title" label="标题"> </el-table-column>
            <el-table-column  prop="is_show" :filters="[{text:'下架',value:0},{text:'上架',value:1}]" 
                :filter-method="filterStatus" label="状态"> 
                <template slot-scope="scope">
                    <el-tag
                    :type="scope.row.is_show == 0 ? 'danger' : 'success'"
                    disable-transitions>{{scope.row.is_show == 0 ? '下架':'上架'}}</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="remarks" label="备注"> </el-table-column>
            <el-table-column prop="create_date" label="创建时间"> </el-table-column>
            <el-table-column label="操作"> 
                <template slot-scope="scope">
                    <el-button type="text" @click="newDialog = true,content = scope.row.content">预览</el-button>
                    <el-button type="text" @click="navTo('/richtext',scope.row)">修改</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="panel-end" style="margin-top:20px">
            <Page :total="total" :page-size="query.size" :current="query.page" size="small" show-total @on-change="changePage" />
        </div>
        

        <!-- ************************************************ -->
     
        <el-dialog  :visible.sync="newDialog" width="370px" center>
            <mobile title="富文本预览" style="margin-top:-40px" :content="content" :bgcolor="bgcolor" :frcolor="frcolor"></mobile>
        </el-dialog>
    </div>
</template>

<script>
import mobile from '../../components/mobile'
var that;
export default {
  components:{
      mobile
  },
  data() {
    return {
      remarksDialog: false,
      newDialog: false,
      content:'',
      data: [],
      bgcolor: JSON.parse(sessionStorage.getItem("config")).wx_background_color,
      frcolor: JSON.parse(sessionStorage.getItem("config")).wx_front_color,
      searchList: [
        { key: "Id", value: "", label: "输入ID" },
        { key: "author", value: "", label: "输入编辑人" },
        { key: "title", value: "", label: "输入标题" },
        { key: "remarks", value: "", label: "输入备注" }
      ],
      total: 0,
      query: {
        page: JSON.parse(sessionStorage.getItem("config")).current_page,
        size: JSON.parse(sessionStorage.getItem("config")).page_size,
        wheres: "admin_id="+sessionStorage.getItem('adminId'),
        order: "create_date desc"
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
        this.$router.push({path:path,query:{data:this.com.secrets.encrypt( JSON.stringify({data:data}), "utf8", this.com.ivkey,
            "hex",  true )}})
    },
    /******基础********************************************* */
    getDataList() {
      this.$http
        .post(
          this.com.NODE_API +
            "richtext/finds" ,
            {data:this.com.secrets.encrypt(JSON.stringify(this.query),'utf8', this.com.ivkey, 'hex', true)}
        )
        .then(res => {
          if (res.data.code == 1000) {
            for(var i in res.data.data.list){
                res.data.data.list[i].content = res.data.data.list[i].content.replace(new RegExp('<img','g'),'<img width="100%"')
            }
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
        id: sessionStorage.getItem('adminId'),
        ids: this.selectionId
      };
      var url = "richtext/update/";
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
      return row.is_show == value;
    },
    filterType(value, row){
        return row.admin_type == value;
    }
  }
};
</script>
