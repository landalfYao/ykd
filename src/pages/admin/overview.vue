<template>
    <div>
        <h2>信息总览</h2>
        <div class="line" style="margin-top:15px"></div>
        <div class="panel-between">
            <div>
                <div class="panel-start">
                    <div class="over-box">
                        <div class="text-center ob"><span>用户数</span><br><span>0</span></div>
                    </div>
                    <div class="over-box">
                        <div class="text-center ob"><span>今日访问量</span><br><span>0</span></div>
                    </div>
                    <div class="over-box">
                        <div class="text-center ob"><span>交易总额</span><br><span>0</span></div>
                    </div>
                </div>
                <div class="mounts">
                    <div class="panel-between">
                        <Select  v-model="mountValue" placeholder="请选择" style="width:150px">
                            <Option v-for="(item,index) in mounts" :key="index" :label="item" :value="item">
                            </Option>
                        </Select>
                        <DatePicker :value="dates" format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="选择时间" style="width: 220px"></DatePicker>
                    </div>
                    <div style="margin-top:50px" id="mountNode"></div>
                </div>
            </div>
            
            <div class="right">
                <div class="saoyisao">
                    <div>手机查看数据</div>
                    <img src="../../assets/st.png" width="180px" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import G2 from "@antv/g2";
var that
export default {
  data() {
    return {
        mountValue:'累计用户数',
        mounts:[ '累计用户数', '累计访问量','累计交易额'  ], 
        dates:[],    //时间筛选
    };
  },
  mounted(){
      that = this;
      that.dochart()
  },
  methods: {
    dochart() {
      var data = [
        { year: "1991", value: 3 },
        { year: "1992",
          value: 4
        },
        {
          year: "1993",
          value: 3.5
        },
        {
          year: "1994",
          value: 5
        },
        {
          year: "1995",
          value: 4.9
        },
        {
          year: "1996",
          value: 6
        },
        {
          year: "1997",
          value: 7
        },
        {
          year: "1998",
          value: 9
        },
        {
          year: "1999",
          value: 13
        }
      ];
      var chart = new G2.Chart({
        container: "mountNode",
        forceFit: true,
        height: 300
      });
      chart.source(data);
      chart.scale("value", {
        min: 0
      });
      chart.scale("year", {
        range: [0, 1]
      });
      chart.tooltip({
        crosshairs: {
          type: "line"
        }
      });
      chart.line().position("year*value");
      chart
        .point()
        .position("year*value")
        .size(4)
        .shape("circle")
        .style({
          stroke: "#fff",
          lineWidth: 1
        });
      chart.render();
    }
  }
};
</script>
