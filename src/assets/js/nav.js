const admin1 = [
  // {title:'总览',icon:'md-stats',sub:[
  //     {title:'平台总览',path:'/admin_overview'}
  // ]},
  {
    title: '广告管理',
    icon: 'logo-dropbox',
    sub: [{
        title: '首页广告',
        path: '/carousel'
      },
      {
        title: '首页公告',
        path: '/notice'
      },
      {
        title: '农产品推荐',
        path: '/tui'
      },
      // {title:'农场推荐',path:'/zttype'},
    ]
  },
  {
    title: '优惠券',
    icon: 'logo-yahoo',
    sub: [{
        title: '优惠券列表',
        path: '/coupon'
      },
      {
        title: '新增优惠券模板',
        path: '/coupon_edit'
      },
      {
        title: '发放优惠券',
        path: '/coupon_pub'
      }
    ]
  },
  {
    title: '微信用户',
    icon: 'md-person',
    sub: [{
      title: '用户列表',
      path: '/wxuser'
    }]
  },
  {
    title: '金币设置',
    icon: 'md-person',
    sub: [{
      title: '金币设置',
      path: '/jbset'
    }]
  },
]

const admin2 = [{
    title: '帖子管理',
    icon: 'md-stats',
    sub: [{
        title: '帖子列表',
        path: '/admin_overview'
      },

    ]
  },
  // {title:'文字过滤',icon:'md-stats',sub:[
  //     {title:'敏感词过滤',path:'/'},
  //     {title:'过滤设置',path:'/'}
  // ]},

]

const admin3 = [{
    title: '基地管理',
    icon: 'ios-school',
    sub: [{
        title: '基地列表',
        path: '/shop'
      },
      // {title:'新增基地',path:'/shop_edit'}
    ]
  },
  {
    title: '农场申请',
    icon: 'ios-school',
    sub: [{
      title: '申请列表',
      path: '/nongc'
    }]
  },
  {
    title: '订单管理',
    icon: 'md-stats',
    sub: [{
      title: '订单列表',
      path: '/order'
    }, ]
  },
  {
    title: '地管理',
    icon: 'md-stats',
    sub: [{
      title: '地列表',
      path: '/di'
    }, ]
  },
  {
    title: '报摊产品',
    icon: 'md-stats',
    sub: [{
      title: '列表',
      path: '/gi'
    }, ]
  },

]


const admin4 = [{
    title: '图库',
    icon: 'ios-images',
    sub: [{
      title: '图库列表',
      path: '/gallery'
    }, ]
  },
  {
    title: '富文本管理',
    icon: 'md-book',
    sub: [{
        title: '富文本列表',
        path: '/richtext_list'
      },
      {
        title: '新增富文本',
        path: '/richtext'
      }
    ]
  },
]

const admin5 = [

  // {title:'小程序设置',icon:'ios-infinite',sub:[
  //     {title:'小程序信息',path:'/wxa_settings'},
  //     {title:'配置信息',path:'/wxconfig'},
  //     {title:'小程序页面路径',path:'/'}
  // ]},
  {
    title: '账号管理',
    icon: 'md-contacts',
    sub: [{
      title: '账号列表',
      path: '/adminlist'
    }, ]
  },
  // {title:'后台设置',icon:'ios-settings',sub:[
  //     {title:'基础设置',path:'/setting'},
  // ]},
  // {title:'安全设置',icon:'md-alert',sub:[
  //     {title:'修改密码',path:'/resetpwd'},
  // ]},
]
const jidi = [{
    title: '管理',
    icon: 'md-stats',
    sub: [{
      title: '类目列表',
      path: '/goods_cate'
    }, ]
  },
  {
    title: '地',
    icon: 'md-stats',
    sub: [{
      title: '地列表',
      path: '/di'
    }, ]
  },
  {
    title: '订单管理',
    icon: 'md-stats',
    sub: [{
      title: '订单列表',
      path: '/order'
    }, ]
  },
]
module.exports = {
  admin1: admin1,
  admin2: admin2,
  admin3: admin3,
  admin4: admin4,
  admin5: admin5,
  app: app,
  jidi: jidi
}
