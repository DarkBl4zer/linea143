<?php
include('../config.php');
$conn=oci_connect($usr,$pw,$bd,'WE8ISO8859P1');

$sql="SELECT DESCRIPCION FROM co_catalogo_c order by DESCRIPCION";

$return_arr = array();   
$query=oci_parse($conn,$sql);  oci_execute($query);
while(oci_fetch($query)){ 
  $descript=utf8_encode(oci_result($query,"DESCRIPCION"));
  array_push($return_arr, ["descripcion" => " $descript","descripcion"=>"$descript"]);
}

oci_free_statement($query);
echo json_encode($return_arr);
oci_close($conn);

?>