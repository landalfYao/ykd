<template>
    <div>
        <h2><el-button @click="$router.go(-1)" size="small" icon="el-icon-arrow-left" circle ></el-button> 分类列表</h2>
        <div class="line" style="margin-top:15px"></div>
        <!-- <div class="search-bar">
            <Input v-for="(item,index) in searchList" :key="index" v-model="item.value" :placeholder="item.label" class="il in" />
            
            <Button class="il" @click="clear()">清空</Button>
            <Button class="il" type="primary" @click="search()" style="width:100px">搜索</Button>
        </div> -->
        <div class="panel-between">
            <ButtonGroup >
                <Button @click="update(-1)">删除</Button>
                <Button @click="navTo2('/goods_cate_edit',shopid)">新增分类</Button>
            </ButtonGroup>
            <div>
                <span>条数：</span>
                <InputNumber :step="1" v-model="data.length" @on-blur="changeSize" style="width:60px"></InputNumber>
            </div>
            
        </div>
        
        <el-table :data="data" style="width: 100%;margin-top:15px" @selection-change="handleSelectionChange">
            <el-table-column  type="selection" width="55"> </el-table-column>
            <el-table-column  prop="id" label="ID"> 
            </el-table-column>
            <el-table-column  prop="name" label="分类名称" >  </el-table-column>

            <el-table-column label="操作"> 
                <template slot-scope="scope">
                    <el-dropdown trigger="click">
                        <el-button class="el-dropdown-link" type="text">
                            操作<i class="el-icon-arrow-down el-icon--right"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item><div style="width:100px" @click="navTo('/goods_cate_edit',scope.row)">编辑分类</div></el-dropdown-item>
                            <el-dropdown-item><div style="width:100px"  @click="navTo3('/goods',scope.row.id)">查看商品</div></el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </template>
            </el-table-column>
        </el-table>
        <div class="panel-end" style="margin-top:20px">
            <!-- <Page :total="total" :page-size="query.size" :current="query.page" size="small" show-total @on-change="changePage" /> -->
        </div>
        

        <!-- ************************************************ -->
     

    </div>
</template>

<script>
var that;
export default {
  data() {
    return {
      shopid: "",
      remarksDialog: false,
      newDialog: false,
      content: "",
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
        page: 1,
        size: 100000,
        orderBy: "",
        id: ""
      },
      multipleSelection: [],
      selectionId: "",
      remarks: ""
    };
  },
  mounted() {
    that = this;
    this.getDataList();
    this.shopid = sessionStorage.getItem('adminType') == 0 ?this.$route.query.id: sessionStorage.getItem('shopid')
  },
  methods: {
    navTo(path, data) {
      var query = {};
      if (data) {
        query.data = this.com.secrets.encrypt(
          JSON.stringify({ data: data }),
          "utf8",
          this.com.ivkey,
          "hex",
          true
        );
        query.id = this.$route.query.id;
      }

      this.$router.push({ path: path, query: query });
    },
    navTo2(path, id) {
      this.$router.push({ path: path, query: { id: id } });
    },
    navTo3(path, id) {
      this.$router.push({
        path: path,
        query: { cateid: id, id: this.$route.query.id }
      });
    },
    /******基础********************************************* */
    getDataList() {
      this.$http
        .post(
          this.com.JAVA_API + "category/findbyshop",
          { shopId:sessionStorage.getItem('adminType') == 0 ?this.$route.query.id: sessionStorage.getItem('shopid')},
          { emulateJSON: true }
        )
        .then(res => {
          if (res.data.code) {
            that.data = res.data.params.list;
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
        id: this.selectionId
      };
      var url = "category/update";
      if (e == 2) {
        url += "remarks";
        data.remarks = that.remarks;
        that.doupdate(data, url);
        that.selectionId = "";
      } else if (this.checkSelection()) {
        if (e == -1) {
          data.isdelete = 1;
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
          data.status = 0;
          that.doupdate(data, url);
        } else if (e == 1) {
          data.status = 1;
          that.doupdate(data, url);
        }
      }
    },
    doupdate(data, url) {
      this.$http
        .post(this.com.JAVA_API + url, data, { emulateJSON: true })
        .then(res => {
          if (res.data.code) {
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
    filterType(value, row) {
      return row.admin_type == value;
    }
  }
};
</script>
