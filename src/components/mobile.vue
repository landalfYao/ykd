<template>
    <div>
        <div class="db-mobile">
            <div class="db-top">
                <div class="db-ri"></div>
                <div class="db-ti"></div>
            </div>
            <div class="db-ping">
                <div class="titlebar" :style="'background:'+bgcolor+';color:'+frcolor">{{title}}</div>
                <div class="ddg">
                    <div class="ddg-p ql-editor">
                        <div v-html="content"></div>
                    </div>
                </div>
            </div>
            <div class="db-top">
                <div class="db-btn"></div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
    props:{
        title: String,
        content: String,
        bgcolor: String,
        frcolor:String
    }
}
</script>
<style>
@import url('../assets/css/quail.css');
.titlebar{
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center
}
.db-mobile{
    height: 600px;
    width: 320px;
    background: #f3f3f3;
    border-radius: 30px;
    box-shadow: 0 0 50px 0 #d1d1d1
}
.db-top{
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center
}
.db-ri{
    height: 10px;
    width: 10px;
    border-radius: 20px;
    background: #888888
}
.db-ti{
    height: 7px;
    width: 50px;
    margin-left:10px;
    border-radius: 20px;
    background: #888888
}
.db-ping{
    width: 300px;
    margin-left: 10px;
    height: 500px;
    background: #ffffff;
    border-radius: 10px
}
.ddg{
    height: 460px;
    width: 100%;
    overflow: hidden;
}
.ddg-p{
    height: 460px;
    overflow-y: scroll;
    width: 317px
}
.db-btn{
    width: 50px;
    height: 20px;
    background: #e1e1e1;
    border-radius: 20px
}
</style>