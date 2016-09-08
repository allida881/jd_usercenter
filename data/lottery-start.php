<?php
  header('Content-Type:application/json');
  $uname=$_REQUEST['uname'];
  
  $output=[
     'total_count'=>0, //总的抽奖次数
	 'used_count'=>0, //已经使用的次数
     'left_count'=>0  //剩余抽奖次数
  ];
  //查询总的消费金额，计算总的抽奖次数
  $conn=mysqli_connect('127.0.0.1','root','','app_jduser',3306);
  mysqli_query($conn,'SET NAMES UTF8');
  $sql="select sum(price) from jd_orders";
  $price_result=mysqli_query($conn,$sql);
  $row=mysqli_fetch_assoc($price_result);
  $output['total_count']=floor($row['sum(price)']/100);
  
  //查询已经使用的抽奖次数
  $sql="select count(id) from jd_lottery";
  $result=mysqli_query($conn,$sql);
   
  while(($row=mysqli_fetch_assoc($result))!==null){
      $output['used_count']=intval($row['count(id)']);	   
  };
  
  $output['left_count']=$output['total_count']-$output['used_count'];

  echo json_encode($output);

?>