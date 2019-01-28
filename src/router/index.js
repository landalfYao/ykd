import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import app from '../pages/app/app'
import adminOverview from '../pages/admin/overview'
import wxaSettings from '../pages/settings/wxa'
import wxconfig from '../pages/settings/wxconfig'
import resetpwd from '../pages/settings/resetpwd'
import adminlist from '../pages/settings/admin'
import adminLogin from '../pages/admin/login'
import gallery from '../pages/gallery/gallery'
import setting from '../pages/settings/setting'
import mobile from '../components/mobile'
import richtext from '../pages/gallery/richtext'
import richtextModel from '../components/richtext'
import richtextList from '../pages/gallery/richtext_list'
import carousel from '../pages/carousel/carousel'
import carouselEdit from '../pages/carousel/carousel_edit'
import notice from '../pages/notice/notice'
import noticeEdit from '../pages/notice/notice_edit'

import shop from '../pages/shop/shop'
import shopEdit from '../pages/shop/shop_edit'
import goods_cate from '../pages/shop/goods/goods_cate'
import goods_cate_edit from '../pages/shop/goods/goods_cate_edit'
import goods from '../pages/shop/goods/goods'
import goods_edit from '../pages/shop/goods/goods_edit'

import tui from '../pages/tuitui/tui'
import tui_edit from '../pages/tuitui/tui_edit'

import zttype from '../pages/tuitui/zt'
import zttype_edit from '../pages/tuitui/zt_edit'

import tuin from '../pages/tuitui/tuin'
import tuin_edit from '../pages/tuitui/tuin_edit'
import wxuser from '../pages/admin/wxuser'
import coupon from '../pages/conpon/conpon'
import coupon_edit from '../pages/conpon/conpon_edit'

import coupon_pub from '../pages/conpon/conpon_pub'
import nongc from '../pages/shop/nongc'
import order from '../pages/order/order'

import cz from '../pages/shop/cz/cz'
import di from '../pages/shop/cz/di'

import gi from '../pages/shop/goods/goods_wan'

import jbset from '../pages/jbset'
import bz from '../pages/shop/cz/bz.vue'

Vue.use(Router)

export default new Router({
  routes: [{
      path: '/admin_login',
      name: 'adminLogin',
      component: adminLogin
    },
    {
      path: '/',
      name: 'app',
      component: app,
      children: [{
          path: '/admin_overview',
          name: 'adminOverview',
          component: adminOverview
        },
        {
          path: '/wxa_settings',
          name: 'wxaSettings',
          component: wxaSettings
        },
        {
          path: '/wxconfig',
          name: 'wxconfig',
          component: wxconfig
        },
        {
          path: '/bz',
          name: 'bz',
          component: bz
        },
        {
          path: '/resetpwd',
          name: 'resetpwd',
          component: resetpwd
        },
        {
          path: '/adminlist',
          name: 'adminlist',
          component: adminlist
        },
        {
          path: '/gallery',
          name: 'gallery',
          component: gallery
        },
        {
          path: '/richtext',
          name: 'richtext',
          component: richtext
        },
        {
          path: '/richtext_list',
          name: 'richtextList',
          component: richtextList
        },
        {
          path: '/setting',
          name: 'setting',
          component: setting
        },
        {
          path: '/carousel',
          name: 'carousel',
          component: carousel
        },
        {
          path: '/carousel_edit',
          name: 'carouselEdit',
          component: carouselEdit
        },
        {
          path: '/notice',
          name: 'notice',
          component: notice
        },
        {
          path: '/notice_edit',
          name: 'noticeEdit',
          component: noticeEdit
        },
        {
          path: '/shop',
          name: 'shop',
          component: shop
        },
        {
          path: '/nongc',
          name: 'nongc',
          component: nongc
        },
        {
          path: '/shop_edit',
          name: 'shopEdit',
          component: shopEdit
        },
        {
          path: '/goods_cate',
          name: 'goods_cate',
          component: goods_cate
        },
        {
          path: '/goods_cate_edit',
          name: 'goods_cate_edit',
          component: goods_cate_edit
        },
        {
          path: '/goods',
          name: 'goods',
          component: goods
        },
        {
          path: '/goods_edit',
          name: 'goods_edit',
          component: goods_edit
        },
        {
          path: '/tui',
          name: 'tui',
          component: tui
        },
        {
          path: '/tui_edit',
          name: 'tui_edit',
          component: tui_edit
        },
        {
          path: '/zttype',
          name: 'zttype',
          component: zttype
        },
        {
          path: '/zttype_edit',
          name: 'zttype_edit',
          component: zttype_edit
        },
        {
          path: '/tuin',
          name: 'tuin',
          component: tuin
        },
        {
          path: '/tuin_edit',
          name: 'tuin_edit',
          component: tuin_edit
        },
        {
          path: '/wxuser',
          name: 'wxuser',
          component: wxuser
        },
        {
          path: '/coupon',
          name: 'coupon',
          component: coupon
        },
        {
          path: '/coupon_edit',
          name: 'coupon_edit',
          component: coupon_edit
        },
        {
          path: '/coupon_pub',
          name: 'coupon_pub',
          component: coupon_pub
        },
        {
          path: '/order',
          name: 'order',
          component: order
        },
        {
          path: '/cz',
          name: 'cz',
          component: cz
        },
        {
          path: '/di',
          name: 'di',
          component: di
        },
        {
          path: '/gi',
          name: 'gi',
          component: gi
        },
        {
          path: '/jbset',
          name: 'jbset',
          component: jbset
        }
      ]
    },
    {
      path: '/mobile',
      name: 'mobile',
      component: mobile
    },
    {
      path: '/richtext_m',
      name: 'richtext_m',
      component: richtextModel
    }
  ]
})
