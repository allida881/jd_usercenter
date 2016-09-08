<?php
   header('Conteny-Type:application/json');

  $uname=$_REQUEST['uname'];
   //echo  $uname;
  $time=date('y-m-d h:m:s');
 // echo $time;
  $level=$_REQUEST['level'];
  //echo $level;

   $conn=mysqli_connect('127.0.0.1','root','','app_jduser',3306);
   mysqli_query($conn,'SET NAMES UTF8');

  $sql="insert into jd_lottery values(null,'$uname','$time','$level');";
  //echo $sql;

  $result=mysqli_query($conn,$sql);

  if($result){
     echo  'y';
  }else{
	 $output[ ]='no';
    echo  'n';
  }

  

?>