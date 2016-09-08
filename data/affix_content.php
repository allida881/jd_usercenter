<?php
   header("Content-Type:application/json;charset=utf-8");
   $uname=$_REQUEST['uname'];
   $pno=$_REQUEST['pno'];//待显示的页号

   $output=[
      'record_count'=>0, //总记录数
      'page_size'=>5,    //每页的记录数
	  'page_count'=>0,   //总页数
	  'cur_page'=>intval($pno),  //当前页号
	  'data'=>[]         //当前页中的数据
   ];
  
   $conn=mysqli_connect('127.0.0.1','root','','app_jduser',3306);
   mysqli_query($conn,'SET NAMES UTF8');
   
   /*查询总记录数*/
   $sql="select count(order_id) from jd_orders where user_name='$uname'";
   //echo $sql;
   $result=mysqli_query($conn,$sql);
   $row=mysqli_fetch_assoc($result);
   //总记录数
   $output['record_count']=intval($row['count(order_id)']);
   //echo "总记录数"+$output['record_count'];
   //总页数
   $output['page_count']=ceil($output['record_count'] / $output['page_size']);
   //echo "总页数"+$output['page_count'];
   

   /*分页查询需要的数据*/
   $start=($output['cur_page']-1)*$output['page_size'];
   $count=$output['page_size'];

   $sql="select * from  jd_orders where user_name='$uname' LIMIT $start,$count";
   
   $order_result=mysqli_query($conn,$sql);
   //var_dump($order_result);
   
   while(($order=mysqli_fetch_assoc($order_result))!==null){
       $order['products']=[];//订单中的产品
	   $oid=$order['order_id'];//根据订单编号 获取都买了哪些商品
	   
	   $sql="select * from jd_products where product_id in (select product_id from jd_order_product_detail where order_id='$oid')";
       $product_result=mysqli_query($conn,$sql);
       
	   while(($p=mysqli_fetch_assoc($product_result))!==null){
	     $order['products'][]=$p; 
	   }
	   $output['data'][]=$order;  
   }
   echo json_encode($output);
?>