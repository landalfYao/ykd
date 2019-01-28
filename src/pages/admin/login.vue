<template>
    <div class="container" style="height:none">
        <div class="login-panel">
            <div class="panel-center item-center">
                <img src="../../assets/logo.png" width="40px" height="40px" alt="">
                <div style="margin-left:5px;font-size:16px">一块地后台管理系统</div>
            </div>
            <el-form :model="data" status-icon  ref="ruleForm" label-position="top" class="demo-ruleForm" style="margin-top:20px">
                <el-form-item label="管理员账号" prop="age">
                    <el-input v-model.number="data.adminName" placeholder="输入管理员账号"></el-input>
                </el-form-item>
                <el-form-item label="确认密码" prop="checkPass">
                    <el-input type="password" v-model="data.adminPwd" placeholder="输入密码" autocomplete="off"></el-input>
                </el-form-item>
                
                <el-form-item>
                    <el-button type="primary" :loading="loading" style="width:100%;margin-top:20px" @click="submitForm()">登录</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<style>
@import url('../../assets/css/common.css'); 
@import url('../../assets/css/style.css');
</style>
<script>

export default {
    data(){
        return {
            loading:false,
            data:{
                adminName:'',
                adminPwd:''
            }
        }
    },
    methods:{
        submitForm(){
            var that = this
            if(this.data.adminName == ''){
                this.$message({
                    type:'error',
                    message:'请输入账号'
                })
            }else if(this.data.adminPwd == ''){
                this.$message({
                    type:'error',
                    message:'请输入密码'
                })
            }else{
                this.loading = true
                this.$http.post(this.com.NODE_API+'admin/login',
                    {data:this.com.secrets.encrypt(JSON.stringify(this.data),'utf8', this.com.ivkey, 'hex', true)})
                    .then((res) => {
                        that.loading = false
                        if(res.data.code == 1000){
                            that.$message({
                                type:'success',
                                message:res.data.msg
                            })
                            res.data.data = JSON.parse(that.com.secrets.decypt(res.data.data,'base64', that.com.ivkey, 'hex', true))
                            sessionStorage.setItem('adminId',res.data.data.id)
                            sessionStorage.setItem('adminName',res.data.data.admin_name)
                            sessionStorage.setItem('adminType',res.data.data.admin_type)
                            sessionStorage.setItem('adminRemarks',res.data.data.remarks)
                            if(res.data.data.admin_type==0){
                                that.$router.push({path:'/carousel'})
                            }else{
                                that.$router.push({path:'/goods_cate'})
                                sessionStorage.setItem('shopid',res.data.data.jidid)
                                console.log(res.data.data.jidid)
                            }
                            
                        }else{
                            that.$message({
                                type:'error',
                                message:res.data.msg
                            })
                        }
                        
                    })
            }
        }
    }
}
</script>
