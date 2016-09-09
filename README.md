# jd_usercenter
仿京东的一个网站。包含我的京东，消费统计，幸运抽奖模块。首页包含了轮播和楼层效果。
# 如何运行
下载后项目中有.sql的文件，需要在本地建立数据库。
```php
 $conn = mysqli_connect('127.0.0.1','root','','app_jduser', 3306);
```
使用时，可以创建同名数据库。如果不同名，请在运行前，将data文件夹下面，所有.php文件中涉及数据库连接的部分，改成你自己创建的数据库。
# 运行效果
####  登录页面：
  ![登录页](http://od841n3ha.bkt.clouddn.com/1.png)
####  订单详情页面：
  ![我的订单](http://od841n3ha.bkt.clouddn.com/2.jpg)
####  消费统计
![消费统计](http://od841n3ha.bkt.clouddn.com/3.jpg)  

####  幸运抽奖
![幸运抽奖](http://od841n3ha.bkt.clouddn.com/4.jpg)

####  点击首页--》进入另外页面，查看到轮播效果:
![轮播效果](http://od841n3ha.bkt.clouddn.com/5.jpg)

#### 楼层效果
![楼层效果](http://od841n3ha.bkt.clouddn.com/6.jpg)

# 补充说明
点击首页，跳转到其它页面，可以看到轮播和楼层效果。

# 问题
有其它问题欢迎随时提出issue或者直接联系我都ok。
www.icidstar.com-->点击关于 查看个人信息


