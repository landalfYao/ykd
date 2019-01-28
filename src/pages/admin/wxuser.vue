<template>
    <div>
        <h2>基地列表</h2>
        <div class="line" style="margin-top:15px"></div>
        <!-- <div class="search-bar">
            <Input v-for="(item,index) in searchList" :key="index" v-model="item.value" :placeholder="item.label" class="il in" />
            
            <Button class="il" @click="clear()">清空</Button>
            <Button class="il" type="primary" @click="search()" style="width:100px">搜索</Button>
        </div> -->
        <div class="panel-between">
            <!-- <ButtonGroup >
                <Button @click="update(-1)">删除</Button>
                <Button @click="update(0)">上线</Button>
                <Button @click="update(1)">下线</Button>
            </ButtonGroup> -->
            <div>
                <span>条数：</span>
                <InputNumber :step="1" v-model="query.size" @on-blur="changeSize" style="width:60px"></InputNumber>
            </div>
            
        </div>
        
        <el-table :data="data" style="width: 100%;margin-top:15px" @selection-change="handleSelectionChange">
            <el-table-column  type="selection" width="55"> </el-table-column>
            
            <el-table-column  prop="openid" label="ID" >  </el-table-column>
            <el-table-column   label="图片"> 
                <template slot-scope="scope">
                  <Avatar :src="scope.row.avatarurl"></Avatar>
                </template>
            </el-table-column>
            <el-table-column  prop="nickname" label="昵称" >  </el-table-column>
            
            <el-table-column  prop="gender" label="性别" >  </el-table-column>
            <el-table-column  prop="province" label="省份" >  </el-table-column>
            <el-table-column  prop="city" label="城市" >  </el-table-column>
            <el-table-column prop="level" label="等级"></el-table-column>
            <el-table-column prop="places.length" label="地数量" 
             :filters="[{ text: '有地', value: 1 }, { text: '无地', value: 0 }]"
      :filter-method="filterTag">
              <template slot-scope="scope">
                <div>
                  {{scope.row.places.length}}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="address" label="默认地址"></el-table-column>
            <el-table-column type="expand">
              <template slot-scope="scope">
                <div>
                  <div v-for="(item,index) in scope.row.places" :key="index">
                    <el-row :gutter="30">
                      <el-col :span="6">ID:{{item.id}}</el-col>
                      <el-col :span="6">地名:{{item.name}}</el-col>
                      <el-col :span="6" style="font-weight:bold">商品名:{{item.productName}}</el-col>
                      <el-col :span="6">买地时间:{{item.createtime}}</el-col>
                    </el-row>
                  </div>
                </div>
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
        page: JSON.parse(sessionStorage.getItem("config")).current_page,
        size: JSON.parse(sessionStorage.getItem("config")).page_size,
        orderBy: ""
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
      let temp = -1
      if(row.places.length>0){
        temp=1
      }else{
        temp=0
      }
      return value == temp;
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
        .post(this.com.JAVA_API + "wxuser/find", this.query, {
          emulateJSON: true
        })
        .then(res => {
          if (res.data.code) {
            for(let i in res.data.params.list){
              for(let j in res.data.params.list[i].places)
              res.data.params.list[i].places[j].createtime = res.data.params.list[i].places[j].createtime.substring(0,12)
            }
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
        arr.push(val[i].openid);
      }
      this.selectionId = arr.toString();
      this.com.da.wxu = arr.toString()
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
      var url = "shop/update";
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
