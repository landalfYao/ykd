<template>
    <div>
        <div class="header">
            <div class="main-width height-header layout-center panel-between item-center">
                <div class="panel-start item-center">
                    <div class="panel-start item-center" >
                        <img src="../../assets/logo.png" width="40px" alt="">
                        <span style="font-size:16px;font-weight:bold;margin-left:20px">一块地管理系统</span>
                    </div>
                    <div style="margin-left:200px" v-if="adminType == 0">
                        <Menu mode="horizontal" active-name="1"  @on-select="topSelect">
                            <MenuItem name="1"> 平台管理 </MenuItem>
                            <!-- <MenuItem name="2"> 论坛管理 </MenuItem> -->
                            <MenuItem name="3"> 农场管理 </MenuItem>
                            <MenuItem name="4"> 素材管理 </MenuItem>
                            <MenuItem name="5"> 系统设置 </MenuItem>
                        </Menu>
                    </div>
                </div>
                <el-button type="text" @click="logout">{{remarks}} 退出登录</el-button>
            </div>
        </div>
        <div class="main-container layout-center panel-start">
            <div class="aside">
                <Menu :active-name="activeName" style="width:220px" @on-select="navOnSelect">
                        <MenuGroup v-for="(item,index) in nav" :key="index"  :title="item.title">
                            <MenuItem v-for="(item1,index1) in item.sub" :name="item1.path" :key="index1">
                                <Icon :type="item.icon"  />
                                {{item1.title}}
                            </MenuItem>
                        </MenuGroup>
                </Menu>
            </div>
            <div class="main-panel">
                <router-view />
            </div>
        </div>
        <div class="footer"></div>
    </div>
</template>

<script>
const nav = require("../../assets/js/nav");
var that;
export default {
  data() {
    return {
      nav: [],
      adminType:0,
      activeName: "",
      remarks:sessionStorage.getItem('adminRemarks')
    };
  },
  mounted() {
    that = this;
    this.initLogin();
  },
  methods: {
    initLogin() {
      if (sessionStorage.getItem("adminId")) {
        this.adminType = sessionStorage.getItem("adminType") 
        if (sessionStorage.getItem("adminType") == 0) {
          this.nav = nav.admin1
          this.activeName = this.nav[0].sub[0].path;
          this.getConfig();
        } else {
          this.nav = nav.jidi
          this.activeName = this.nav[0].sub[0].path;
        }
      } else {
        this.$router.push({ path: "/admin_login" });
      }
    },
    logout() {
      sessionStorage.removeItem("adminId");
      sessionStorage.removeItem("adminName");
      sessionStorage.removeItem("adminType");
      sessionStorage.removeItem("adminRemarks");
      this.$router.push({ path: "/admin_login" });
    },
    navOnSelect(e) {
      this.$router.push({ path: e });
    },
    topSelect(e) {
      this.nav = nav["admin" + e];
      this.activeName = this.nav[0].sub[0].path;
      this.$router.push({ path: this.nav[0].sub[0].path });
    },
    getConfig() {
      this.com.getConfig(this,function(){

      })
    }
  }
};
</script>
