<template>
  <div>
    <h2>订单列表</h2>
    <div class="line" style="margin-top:15px"></div>
    <!-- <div class="search-bar">
            <Input v-for="(item,index) in searchList" :key="index" v-model="item.value" :placeholder="item.label" class="il in" />

            <Button class="il" @click="clear()">清空</Button>
            <Button class="il" type="primary" @click="search()" style="width:100px">搜索</Button>
    </div>-->
    <div class="panel-between">
      <ButtonGroup>
        <Button @click="update(-1)">删除</Button>
        <!-- <Button @click="update(0)">上线</Button>
        <Button @click="update(1)">下线</Button>-->
      </ButtonGroup>
      <div>
        <span>条数：</span>
        <InputNumber :step="1" v-model="data.length" @on-blur="changeSize" style="width:60px"></InputNumber>
      </div>
    </div>

    <el-table
      :data="data"
      style="width: 100%;margin-top:15px"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="姓名">
              <span>{{ props.row.addressName }}</span>
            </el-form-item>
            <el-form-item label="电话">
              <span>{{ props.row.addressPhone }}</span>
            </el-form-item>
            <el-form-item label="地址">
              <span>{{ props.row.address }}</span>
            </el-form-item>
            <el-form-item label="用户 ID">
              <span>{{ props.row.userid }}</span>
            </el-form-item>
            <el-form-item label="摆摊用户 ID">
              <span>{{ props.row.shopid }}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span>{{ props.row.remark }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="id" label="单号"></el-table-column>
      <el-table-column prop="op[0].productname" label="商品名"></el-table-column>
      <!-- <el-table-column prop="shopName" label="基地"></el-table-column> -->
      <el-table-column prop="type" label="类型"></el-table-column>
      <el-table-column
        prop="op[0].producttype"
        label="订单种类"
        :filters="[{ text: '地', value: '地' }, { text: '种子', value: '种子' }, { text: '农作物', value: '农作物' }]"
        :filter-method="filterTag"
      >
        <template slot-scope="scope">
          <div>{{scope.row.op[0].producttype}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="totalprice" label="付款"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column prop="createtime" label="下单时间"></el-table-column>
      <!-- <el-table-column  label="操作">
              <template slot-scope="scope">
                <Button type="primary" @click="navTo2('/cz',scope.row.id)">查看操作</Button>
              </template>
      </el-table-column>-->
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
        "page": 0,
        "size": 10000,
        type: "摆摊订单",
        "orderBy": "createtime desc",
        // shopid: "0d6035b4-8e5e-41d4-9190-8354b0ec9c76"
      },
      submitData: {
        id: sessionStorage.getItem("adminId"),
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
    filterTag(value, row) {
      return value == row.op[0].producttype;
    },
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
      }
      this.$router.push({ path: path, query: query });
    },
    navTo2(path, id) {
      this.$router.push({ path: path, query: { id: id } });
    },
    /******基础********************************************* */
    getDataList() {
      this.$http
        .post(this.com.JAVA_API + "orders/find", this.query, {
          emulateJSON: true
        })
        .then(res => {
          if (res.data.code) {
            that.data = res.data.params.list;
            that.total = res.data.params.list[0].mqo.total;
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
      var url = "orders/update";
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
