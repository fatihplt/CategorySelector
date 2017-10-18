<?php

$returnvalue	=	"";

$CategoryID	=	$_POST["CategoryID"];

//Burada categoryid ye göre kategoriler yüklenecek. istenirse category id 0 gönderilerek root kategoriler yüklenmeli

if	($CategoryID	==	0)	{
	$returnvalue	=	$returnvalue	.	"1-Kategori1#2-Kategori2#3-Kategori3";
}

if	($CategoryID	==	1)	{
	$returnvalue	=	$returnvalue	.	"4-Kategori1_1#5-Kategori2_1#6-Kategori3_1";
}

if	($CategoryID	==	2)	{
	$returnvalue	=	$returnvalue	.	"7-Kategori1_2#8-Kategori2_2#9-Kategori3_2";
}

if	($CategoryID	==	4)	{
	$returnvalue	=	$returnvalue	.	"10-Kategori1_1_1#11-Kategori2_1_1#12-Kategori3_1_1";
}


echo	$returnvalue;
?>