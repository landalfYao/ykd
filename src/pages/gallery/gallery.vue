<template>
    <div>
        <h2>图库</h2>
        <div class="line" style="margin-top:15px"></div>
        <div class="panel-start">
            <div class="gallery_meun">
                <el-button style="margin:10px 0" icon="el-icon-circle-plus-outline" @click="addDialog = true,acStatus = true,submitData.group_name=''">添加分类</el-button>
                <el-menu style="width:150px"
                    :default-active="activeMenu"
                    class="el-menu-vertical-demo" @select="menuSelect">
                    <el-menu-item index="all">
                        <span slot="title">全部</span>
                    </el-menu-item>
                    <el-menu-item index="wei">
                        <span slot="title">未分组</span>
                    </el-menu-item>
                    <el-menu-item v-for="(item,index) in cates" :index="index+'-'+item.group_name" :key="index">
                        <span slot="title">{{item.group_name}}</span>
                    </el-menu-item>
                </el-menu>
                
            </div>
            <div class="gallery-panel">
                <div class="operate-panel panel-between item-center">
                    <div class="panel-start">
                        <el-button-group v-if="activeIndex > -1">
                            <el-button type="default" icon="el-icon-edit" @click="upgroup()"></el-button>
                            <el-button type="default" icon="el-icon-delete" @click="del()">删除分类</el-button>
                        </el-button-group>
                        <el-button type="danger" style="margin-left:10px" :loading="delload" @click="delfile()" icon="el-icon-delete" circle></el-button>
                        <el-dropdown style="margin-left:10px">
                            <el-button type="default">
                                移动到<i class="el-icon-arrow-down el-icon--right"></i>
                            </el-button>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(item,index) in cates" :key="index"><div  @click="moveTo(item.Id)">{{item.group_name}}</div></el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <el-button type="primary" icon="el-icon-upload" @click="fileDialog = true">上传图片</el-button>
                </div>
                <div class="kupa">
                    
                    <div class="kupa-item"  v-for="(item,index) in list" :key="index" @click="checkIt(index)">
                        <div class="kuit-img" :style="'background-image:url('+item.file_url+')'"></div>
                        <div class="kuit-txt">
                            <div>{{item.mimetype.replace('image/','')}}</div>
                            <div>{{(item.file_size/1024)/1024 >= 1 ? (item.file_size/1024/1024).toFixed(0) +'mb': (item.file_size/1024).toFixed(0)+'kb' }}</div>
                        </div>
                        <div class="kucheck panel-center item-center" v-if="item.checked"><Icon color="#ffffff" size="50" type="md-checkmark" /></div>
                    </div>
                    <div style="width:100%;height:100%" class="panel-center item-center " v-if="list.length==0 && !listload">
                        <div>
                            <Icon type="ios-images-outline" size="100" color="#aaaaaa" />
                            <div style="color:#aaa;text-align:center">暂无图片</div>
                        </div>
                    </div>
                    <div  class="panel-center item-center spin-ku" v-if="listload">
                        <Spin size="large"></Spin>
                    </div>
                </div>
                <Page style="margin-left:20px" :total="total" :page-size="10" :current="page" size="small" show-total @on-change="changePage" />
            </div>
        </div>

        <el-dialog :title="acStatus ? '添加分类':'修改分类'" :visible.sync="addDialog" width="300px" center>
            <span><Input v-model="submitData.group_name" placeholder="分类名称"  /></span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="loading=false,addDialog = false">取 消</el-button>
                <el-button :loading="loading" type="primary" @click="submitCate(0)">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="上传图片" :visible.sync="fileDialog" width="400px" center >
            <div style="max-height:600px;overflow-y:scroll;width:100%">
                <el-upload
                    class="upload-demo"
                    :action="NODE_API+'file/upload'"
                    :on-preview="handlePreview"
                    :multiple="true"
                    :on-success="handleSuccess"
                    :file-list="fileList"
                    :data="fileData"
                    :before-upload="beforeUpload"
                    list-type="picture">
                    <el-button size="small" type="primary">点击上传</el-button>
                    <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过2mb</div>
                </el-upload>
            </div>
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="loading=false,fileDialog = false">关闭</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
var that;
export default {
  data() {
    return {
      group_id: null,
      fileData: {
        data: this.com.secrets.encrypt(
          JSON.stringify({ admin_id: sessionStorage.getItem("adminId") }),
          "utf8",
          this.com.ivkey,
          "hex",
          true
        )
      },
      cates: [],
      page: 1,
      total: 0,
      fileDialog: false,
      NODE_API: this.com.NODE_API,
      acStatus: true,
      activeIndex: -1,
      activeMenu: "all",
      addDialog: false,
      loading: false,
      listload: false,
      fileList: [],
      list: [],
      delload: false,
      submitData: {
        id: "",
        group_name: "",
        admin_id: sessionStorage.getItem("adminId")
      }
    };
  },
  mounted() {
    that = this;
    this.getCate();
    this.getFile();
  },
  methods: {
    handleSuccess(e) {
      this.getFile();
    },
    initCheck() {
      for (var i in this.list) {
        this.list[i].checked = false;
      }
    },
    moveTo(id) {
      if (this.getChecked() == "") {
        that.$message({
          showClose: true,
          message: "您还没选择图片",
          type: "warning"
        });
      } else {
        that.$http
          .get(
            this.com.NODE_API +
              "file/move?group_id=" +
              id +
              "&ids=" +
              this.getChecked()
          )
          .then(res => {
            if (res.data.code == 1000) {
              if (that.activeIndex != -1) {
                that.getFile();
              }
              that.initCheck();
              that.$message({
                showClose: true,
                message: res.data.msg,
                type: "success"
              });
            } else {
              that.$message({
                showClose: true,
                message: res.data.msg,
                type: "error"
              });
            }
          });
      }
    },
    changePage(e) {
      this.page = e;
      this.getFile();
    },
    checkIt(e) {
      if (this.list[e].checked) {
        this.list[e].checked = false;
      } else {
        this.list[e].checked = true;
      }
      sessionStorage.setItem('imgUrls',JSON.stringify(this.getChecked2()))
    },
    getChecked() {
      var arr = [];
      for (var i in this.list) {
        if (this.list[i].checked) {
          arr.push(this.list[i].id);
        }
      }
      return arr.toString();
    },
    getChecked2() {
      var arr = [];
      for (var i in this.list) {
        if (this.list[i].checked) {
          arr.push(this.list[i]);
        }
      }
      return arr;
    },
    delfile() {
      if (that.getChecked() == "") {
        that.$message({
          showClose: true,
          message: "您还没选择图片",
          type: "warning"
        });
      } else {
        this.$confirm(
          "此操作将永久删除该文件, 是否继续? 若误删请联系开发人员。",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        ).then(() => {
          that.delload = true;
          that.$http
            .get(that.com.NODE_API + "file/del?ids=" + that.getChecked())
            .then(res => {
              that.delload = false;
              if (res.data.code == 1000) {
                that.getFile();
                that.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "success"
                });
              } else {
                that.$message({
                  showClose: true,
                  message: res.data.msg,
                  type: "error"
                });
              }
            });
        });
      }
    },
    getFile() {
      this.listload = true;
      this.$http
        .post(this.com.NODE_API + "file/find/by/admin", {
          data: this.com.secrets.encrypt(
            JSON.stringify({
              admin_id: sessionStorage.getItem("adminId"),
              page: this.page,
              group_id: this.group_id
            }),
            "utf8",
            this.com.ivkey,
            "hex",
            true
          )
        })
        .then(res => {
          that.listload = false;
          if (res.data.code == 1000) {
            for (var i in res.data.data.list) {
              res.data.data.list[i].checked = false;
            }
            that.list = res.data.data.list;
            that.total = res.data.data.total;
          } else {
            that.$message({
              showClose: true,
              message: res.data.data,
              type: "error"
            });
          }
        });
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    upgroup() {
      this.acStatus = false;
      this.addDialog = true;
      this.submitData.group_name = this.cates[this.activeIndex].group_name;
      this.submitData.id = this.cates[this.activeIndex].Id;
    },
    menuSelect(e) {
      var data = {
        admin_id: sessionStorage.getItem("adminId")
      };
      if (e == "all") {
        this.group_id = "";
        this.activeIndex = -1;
      } else if (e == "wei") {
        this.group_id = "is null";
        this.activeIndex = -2;
      } else {
        this.activeIndex = e.substring(0, e.indexOf("-"));
        this.group_id = this.cates[this.activeIndex].Id;
        data.group_id = this.group_id;
      }
      this.fileData.data = this.com.secrets.encrypt(
        JSON.stringify(data),
        "utf8",
        this.com.ivkey,
        "hex",
        true
      );
      this.getFile();
      this.activeMenu = e;
    },
    getCate() {
      this.$http
        .post(this.com.NODE_API + "file_group/find/by/admin", {
          data: this.com.secrets.encrypt(
            JSON.stringify({ admin_id: sessionStorage.getItem("adminId") }),
            "utf8",
            this.com.ivkey,
            "hex",
            true
          )
        })
        .then(res => {
          if (res.data.code == 1000) {
            res.data.data = JSON.parse(
              that.com.secrets.decypt(
                res.data.data,
                "base64",
                that.com.ivkey,
                "hex",
                true
              )
            );
            that.cates = res.data.data;
            if (!that.acStatus && activeIndex != -1) {
              that.activeMenu =
                that.activeIndex +
                "-" +
                that.cates[that.activeIndex].group_name;
            }
          } else {
            that.$message({
              showClose: true,
              message: res.data.data,
              type: "error"
            });
          }
        });
    },
    del() {
      this.$confirm(
        "此操作将永久删除该文件, 是否继续? 若误删请联系开发人员。",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        that.$http
          .post(that.com.NODE_API + "file_group/del", {
            data: that.com.secrets.encrypt(
              JSON.stringify({ id: that.cates[that.activeIndex].Id }),
              "utf8",
              that.com.ivkey,
              "hex",
              true
            )
          })
          .then(res => {
            if (res.data.code == 1000) {
              that.$message({
                showClose: true,
                message: res.data.msg,
                type: "success"
              });
              that.menuSelect("all");
              that.getCate();
            }
          });
      });
    },
    submitCate() {
      this.loading = true;
      var url;
      if (this.acStatus) {
        url = "file_group/add";
      } else {
        url = "file_group/update";
      }
      this.$http
        .post(this.com.NODE_API + url, {
          data: this.com.secrets.encrypt(
            JSON.stringify(this.submitData),
            "utf8",
            this.com.ivkey,
            "hex",
            true
          )
        })
        .then(res => {
          that.loading = false;
          that.addDialog = false;
          if (res.data.code == 1000) {
            that.$message({
              showClose: true,
              message: res.data.msg,
              type: "success"
            });
            that.getCate();
          }
        });
    }
  }
};
</script>

