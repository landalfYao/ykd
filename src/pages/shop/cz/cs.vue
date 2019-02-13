<template>
  <div>
    <h2>
      <el-button @click="$router.go(-1)" size="small" icon="el-icon-arrow-left" circle></el-button>成熟列表
    </h2>
    <div class="line" style="margin-top:15px"></div>
    <!-- <div class="search-bar">
            <Input v-for="(item,index) in searchList" :key="index" v-model="item.value" :placeholder="item.label" class="il in" />

            <Button class="il" @click="clear()">清空</Button>
            <Button class="il" type="primary" @click="search()" style="width:100px">搜索</Button>
    </div>-->
    <div class="panel-between">
      <ButtonGroup>
        <!-- <Button @click="wanc()">批量完成</Button> -->
        <Button @click="wanc()">新增成熟</Button>
      </ButtonGroup>
      <div>
        <!-- <span>条数：</span>
        <InputNumber :step="1" v-model="query.size" @on-blur="changeSize" style="width:60px"></InputNumber>-->
      </div>
    </div>

    <el-table
      :data="data"
      style="width: 100%;margin-top:15px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="msg" label="描述"></el-table-column>
      <el-table-column prop="state" label="状态">
        <template slot-scope="scope">
          <div>
            <el-tag v-if="scope.row.state == 0" type="danger">成熟</el-tag>
            <el-tag v-if="scope.row.state == 1" type="success">已采摘</el-tag>
            <el-tag v-if="scope.row.state == 3" type="warning">待邮寄</el-tag>
            <el-tag v-if="scope.row.state == 4" type="primary">已邮寄</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="邮寄地址"></el-table-column>
      <el-table-column prop="cssj" label="成熟时间"></el-table-column>
      <el-table-column prop="szsj" label="采摘时间"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <div>
            <el-button
              type="text"
              v-if="scope.row.state == 1"
              @click="temprow=scope.row,centerDialogVisible = true"
            >采摘描述</el-button>
            <el-button type="text" v-if="scope.row.state == 3" @click="wc3(scope.row)">邮寄</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="panel-end" style="margin-top:20px">
      <!-- <Page
        :total="total"
        :page-size="query.size"
        :current="query.page"
        size="small"
        show-total
        @on-change="changePage"
      />-->
    </div>
    <el-dialog title="新增成熟" :visible.sync="centerDialogVisible" width="300px" center>
      <el-input v-model="content" placeholder="描述"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="wc2()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- ************************************************ -->
  </div>
</template>

<script>
var that;
export default {
  data() {
    return {
      centerDialogVisible: false,
      cateid: "",
      shopid: "",
      remarksDialog: false,
      newDialog: false,
      content: "",
      data: [],
      bgcolor: JSON.parse(sessionStorage.getItem("config")).wx_background_color,
      frcolor: JSON.parse(sessionStorage.getItem("config")).wx_front_color,
      searchList: [],
      total: 0,
      query: {
        page: JSON.parse(sessionStorage.getItem("config")).current_page,
        size: JSON.parse(sessionStorage.getItem("config")).page_size,
        orderBy: "",
        id: ""
      },
      temprow: {},
      multipleSelection: [],
      selectionId: "",
      remarks: ""
    };
  },
  mounted() {
    that = this;
    this.getDataList();
    this.cateid = this.$route.query.cateid;
    this.shopid = this.$route.query.id;
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
      this.$router.push({ path: path, query: { cateid: id, id: this.shopid } });
    },
    wc3(row) {
      let content = JSON.parse(row.content);
      content.state = 4;
      this.$http
        .post(
          this.com.JAVA_API + "sh/update",
          {
            id: row.id,
            content: JSON.stringify(content)
          },
          { emulateJSON: true }
        )
        .then(res => {
          that.centerDialogVisible = false;
          if (res.data.code) {
            that.$message.success(res.data.msg);
            that.getDataList();
          } else {
            that.$message.error(res.data.msg);
          }
        });
    },
    wc2() {
      let content = JSON.parse(this.temprow.content);
      content.szsj = new Date();
      content.msg = this.content;
      this.$http
        .post(
          this.com.JAVA_API + "sh/update",
          {
            id: this.temprow.id,
            content: JSON.stringify(content)
          },
          { emulateJSON: true }
        )
        .then(res => {
          that.centerDialogVisible = false;
          if (res.data.code) {
            that.$message.success(res.data.msg);
            that.getDataList();
          } else {
            that.$message.error(res.data.msg);
          }
        });
    },
    wanc() {
      this.$http
        .post(
          this.com.JAVA_API + "sh/add",
          {
            placeid: this.$route.query.id,
            content: JSON.stringify({ state: 0, cssj: new Date() })
          },
          { emulateJSON: true }
        )
        .then(res => {
          that.centerDialogVisible = false;
          if (res.data.code) {
            that.$message.success(res.data.msg);
            that.getDataList();
          } else {
            that.$message.error(res.data.msg);
          }
        });
    },
    /******基础**********************************************/
    getDataList() {
      this.$http
        .post(
          this.com.JAVA_API + "sh/find",
          { placeid: this.$route.query.id },
          { emulateJSON: true }
        )
        .then(res => {
          if (res.data.code) {
            for (let i in res.data.params.list) {
              let t = JSON.parse(res.data.params.list[i].content);
              res.data.params.list[i].state = t.state;
              if (t.msg) {
                res.data.params.list[i].msg = t.msg;
              }
              if (t.cssj) {
                res.data.params.list[i].cssj = t.cssj.substring(0, 10);
              }
              if (t.szsj) {
                res.data.params.list[i].szsj = t.szsj.substring(0, 10);
              }
              if (t.address) {
                res.data.params.list[i].address = t.address;
              }
            }
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
      var url = "product/update";
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
          data.isshow = 0;
          that.doupdate(data, url);
        } else if (e == 1) {
          data.isshow = 1;
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
      return row.isshow == value;
    },
    filterType(value, row) {
      return row.admin_type == value;
    }
  }
};
</script>
