//load() $.get()  $.post()
//$.getScript  $.getJSON()  $.ajax()

//验证用户名和密码
$('.header').load('header.html');
$('.footer').load('footer.html');

$('.submit').click(function(){
   var result=$('#user_login').serialize();
   $.post('data/checkuname.php',result,function(data){
	  console.log("开始处理返回数据...........");
	  console.log(data.status);

      if(data.status<0){
	     $('.modal .alert p').html(data.msg);
	     $('[name="uname"]').val('');
	     $('[name="pwd"]').val('');
	  }else{
	     $('#login-msg').html(data.msg+", 欢迎回来！");
		 sessionStorage.setItem('loginName',data.msg);
		 $('.modal').fadeOut();//隐藏遮罩层
		 getMyOrder(data.msg,1);//加载我的订单
		 lottery(data.msg);//异步请求抽奖次数
	  }
   });
})
//附加导航的切换
$('[data-toggle="affix-item"]').click(function(e){
	  //左侧导航栏选中切换
      e.preventDefault();
	  $(this).parent().addClass('active').siblings('.active').removeClass('active');
      //右侧内容切换
	  var id=$(this).attr('href');
	  $(id).addClass('active').siblings('.active').removeClass('active');	 
});

//异步加载所有的订单
function getMyOrder(uname,pno){
	$.get('data/affix_content.php',{'uname':uname,'pno':pno},function(pageObj){
	    console.log("开始处理我的订单");
		//console.log(pageObj);
	    var str=" ";
	    $.each(pageObj.data,function(i,order){
			   str += "<tr>"
				 +"<td colspan='6'>订单编号:"+order.order_num
				 +"<a href='#"+order.shop_url+"'>"+order.shop_name+"</a>"
				 +"</td>"
				 +"</tr>"
				 +"<tr><td class='order_img'>"; 
			   $.each(order.products,function(i,p){
			      str += "<a href='#"+p.product_url+"'><img src="+p.product_img+"></a>";
			   });
			   str+="</td>"
				  +"<td>"
				  +order.user_name+"</td>"
				  +"<td>￥:"+order.price+"</br>"
				  +order.payment_mode+"</td><td>"
				  +order.submit_time.replace('T','<br>')+"</td><td>"
				  +order.order_state+"</td>"
				  +"<td><a href='#'>查看</a></br><a href='#'>确认收货</a></br><a href='#'>取消订单</a></td></tr>";  
	    });
	    $('.order tbody').html(str);
        
		//根据分页对象编写分页条
		var str="";
		if((pageObj.cur_page-2)>0){
		   str+='<li ><a href="javascript:getMyOrder(\''+uname+'\','+(pageObj.cur_page-2)+')">'+(pageObj.cur_page-2)+"</a></li>";
		}
		if((pageObj.cur_page-1)>0){
           str+='<li ><a href="javascript:getMyOrder(\''+uname+'\','+(pageObj.cur_page-1)+')">'+(pageObj.cur_page-1)+"</a></li>";
		}
		str+="<li class='active'><a href='#'>"+pageObj.cur_page+"</a></li>";
		
		if((pageObj.cur_page+1)<=pageObj.page_count){ 
		  str+='<li ><a href="javascript:getMyOrder(\''+uname+'\','+(pageObj.cur_page+1)+')">'+(pageObj.cur_page+1)+'</a></li>';
		}
		if((pageObj.cur_page+2)<=pageObj.page_count){ 
          str+='<li ><a href="javascript:getMyOrder(\''+uname+'\','+(pageObj.cur_page+2)+')">'+(pageObj.cur_page+2)+'</a></li>';
		}

		$('.page').html(str);
	});
}

//异步请求消费统计数据绘制消费统计图
$.get('data/buy_start.php',function(data){
   console.log("开始处理服务器端返回的消费统计数据");
   console.log(data);
   //console.log(data.length);
   drawBuyStat(data);  
})

//绘制消费统计图
function  drawBuyStat(data){
	var w=800;
	var h=600;
	var  canvasBuyStart=$('#canvas-buy-start')[0];
	canvasBuyStart.width=w;
	canvasBuyStart.height=h;

	/*******绘制消费统计图需要用到的变量*********/
	var canvasWidth=canvasBuyStart.width;
	var canvasHeight=canvasBuyStart.height;
	var bgColor="#fff";//画布的背景色
	var padding=60;//画布边界的距离
	var fontColor='#333';
	var fontSize=14;
	var exisEndSpace=30;//坐标轴端点距离最后一个坐标的距离
	var origin={x:padding,y:(canvasHeight-padding)};//原点坐标
	var xExisEnd={x:(canvasWidth-padding),y:(canvasHeight-padding)}//x轴的终点坐标
	var yExisEnd={x:padding,y:padding};//y轴的终点坐标


	//console.log(data.length);
	//var count=data.length;
	var count=12;
    var xGridSpace=((canvasWidth-2*padding)-exisEndSpace)/count;//x轴每个单元格的间距
    var yGridSpace=((canvasHeight-2*padding)-exisEndSpace)/6;

	var ctx=canvasBuyStart.getContext('2d');
    ctx.font=fontSize+'px SimHei';
    var maxvalue=0;

    for(var i=0;i<count;i++){
	   if(data[i].value>maxvalue){
		 //console.log(data[i]);
	     maxvalue=data[i].value;
	   }
	}
    var avgvalue=parseInt(maxvalue/6);

	//绘制x坐标轴
	ctx.beginPath();
	ctx.moveTo(origin.x,origin.y);
	ctx.lineTo(xExisEnd.x,xExisEnd.y);
	ctx.lineTo(xExisEnd.x-15,xExisEnd.y-15);
	ctx.lineTo(xExisEnd.x,xExisEnd.y);
	ctx.lineTo(xExisEnd.x-15,xExisEnd.y+15);

	for(var i=0;i<count;i++){
	  var x=(i+1)*xGridSpace+origin.x;
	  var y=origin.y;
	  ctx.moveTo(x,y);
	  ctx.lineTo(x,y-5);//
	  //绘制柱状图
      var w=xGridSpace/2;
	  var h=data[i].value*(canvasHeight-2*padding-exisEndSpace)/maxvalue;
	  
	  var txt=data[i].name;
	  var txtWidth=ctx.measureText(txt).width;
	  ctx.fillStyle='#000';
	  ctx.fillText(txt,x-txtWidth,y+fontSize);

	  ctx.fillStyle=rc();
	  ctx.fillRect(x-w,y-h, w, h);
	}

	//绘制y坐标轴
	ctx.moveTo(origin.x,origin.y);
	ctx.lineTo(yExisEnd.x,yExisEnd.y);
	ctx.lineTo(yExisEnd.x-15,yExisEnd.y+15);
	ctx.lineTo(yExisEnd.x,yExisEnd.y);
	ctx.lineTo(yExisEnd.x+15,yExisEnd.y+15);
	for(var i=0;i<6;i++){
	  var x=origin.x;
	  var y=origin.y-(i+1)*yGridSpace;
	  ctx.moveTo(x,y);
	  ctx.lineTo(x+5,y);//
	  var txt=(i+1)*avgvalue;
	  var txtWidth=ctx.measureText(txt).width;
	  ctx.fillText(txt,x-txtWidth-2,y+fontSize/2);
	}	
	ctx.stroke();

	function rc(){
	     var r=Math.floor(Math.random()*256);
	     var g=Math.floor(Math.random()*256);
	     var b=Math.floor(Math.random()*256);
		 return 'rgb('+r+','+g+','+b+')';
	  }
}

//异步请求抽奖次数
function lottery(uname){
	//异步请求计算初始化的剩余抽奖次数
     $.get('data/lottery-start.php',{'uname':uname},function(data){
	    console.log("开始处理主体数据");
	    console.log(data);
		if(data.left_count>0){
		    drawLottery();
			$('#luck-lottery  span').html(data.left_count);
		}
        
    });
    //抽奖按钮绑定监听函数
	/*$('#bt-lottery').click(function(){
		   var user_name=uname;				 
		   var lotteryItems=['鼓励奖','一等奖','二等奖','三等奖','特等奖'];
		   $index=parseInt(Math.random()*5);
		   $lottery_value=lotteryItems[$index];   
		   $.post('data/save-lottery.php',{'uname':user_name,'level':$lottery_value},function(data){
				console.log("开始处理主体数据....");
				if(data==='y'){
				   lottery(uname);
				}
		   });
    }); 
	*/
}
function drawLottery(){
   var ctx=$('#canvas-lottery')[0].getContext('2d');
   var canvasWidth=500;
   var canvasHeigth=500;

   var pan=new Image();
   pan.src="img/pan.png";//圆盘图像
   var booleanPan=false;
   pan.onload=function(){
      booleanPan=true;
	  if(booleanPin){
	    startLotter();
	  }
   };
   
   var pin=new Image();
   pin.src="img/pin.png";//指针图像
   var booleanPin=false;
   pin.onload=function(){
      if(booleanPan){
	    startLottery();
	  }
   };

   function startLottery(){//必须等2张图片都加载完成后才可以执行
     // console.log("开始抽奖");
        $('#bt-lottery').attr('disabled',false);
	    ctx.drawImage(pan,0,0);
	    ctx.drawImage(pin,canvasWidth/2-pin.width/2,canvasHeigth/2-pin.height/2);
        //修改画布的原点
		ctx.translate(canvasWidth/2,canvasHeigth/2);
		
		$('#bt-lottery').click(function(){
		   $(this).attr('disabled',false);
		   var duration=Math.random()*3000+5000;//转动的持续时间
		   var last=0;//当前已经你转过的时间
		   var deg=0;
           var lotteryItem=" ";
           //设置定时器函数
		   var timer=setInterval(function(){
			    deg += 5; //此处的5可以使用速度函数来指定为变量
				deg%=360; //deg=deg%360
			   //圆盘每次都旋转一定角度后绘制在同一位置，无需调用clearRect()				
			    ctx.rotate(deg*Math.PI/180);
				ctx.drawImage(pan,-pan.width/2,-pan.height/2);
				ctx.rotate(-deg*Math.PI/180);
				ctx.drawImage(pin,-pin.width/2,-pin.height/2);
                last+=20;
				if(last>=duration){
				   console.log(deg);
				   //根据最终旋转的角度，判定它所获奖项
                   $(this).attr('disabled',false);//旋转完成后再启用按钮
                   if((30<deg<=60)||(180<deg<210)||(240<deg<270)||(300<deg<=330)){
				      lotteryItem="三等奖"; 
				   }else if((120<deg<150)||(330<deg<360)){
				      lotteryItem="二等奖";
				   }else if(60<deg<90){
				      lotteryItem="一等奖";
				   }else{
				      lotteryItem="幸运奖";
				   }

				   console.log(lotteryItem);
				   clearInterval(timer);
				}
		   },20);
		   ctx.clearRect(-canvasWidth/2,-canvasHeigth/2,500,500);
		   //console.log(lotteryItem);
	   }); 
    }
}



