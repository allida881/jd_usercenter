<?php
/**统计出过去12个月内按月消费统计，以JSON格式**/
/**
  [
	{ name="1月",  value="3500"},
	{ name="2月",  value="3500"},
	{ name="3月",  value="3500"}
  ]
**/

header('Content-Type: application/json');
//此处使用伪造的数据
$output = [ ];
$output[] = ['name'=>'1月', 'value'=>4000];
$output[] = ['name'=>'2月', 'value'=>3000];
$output[] = ['name'=>'3月', 'value'=>4500];
$output[] = ['name'=>'4月', 'value'=>2000];
$output[] = ['name'=>'5月', 'value'=>6000];
$output[] = ['name'=>'6月', 'value'=>5000];
$output[] = ['name'=>'7月', 'value'=>8000];
$output[] = ['name'=>'8月', 'value'=>3000];
$output[] = ['name'=>'9月', 'value'=>5500];
$output[] = ['name'=>'10月', 'value'=>9000];
$output[] = ['name'=>'11月', 'value'=>2000];
$output[] = ['name'=>'12月', 'value'=>6500];

echo  json_encode($output);
?>