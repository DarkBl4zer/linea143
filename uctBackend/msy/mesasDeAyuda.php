<?php
include('../config.php');
$conn=oci_connect($usr,$pw,$bd,'WE8ISO8859P1');

$sql="SELECT ID_DEPENDENCIA, DESCRIPCION
FROM msy_dependencias MD
JOIN DEPENDENCIA DES ON (DES.CONSECUTIVO=MD.ID_DEPENDENCIA)
WHERE MD.ESTADO=0";

$return_arr = array();   
$query=oci_parse($conn,$sql);  oci_execute($query);
while(oci_fetch($query)){ 
  $idDep=oci_result($query,"ID_DEPENDENCIA");
  $descript=utf8_encode(oci_result($query,"DESCRIPCION"));
  array_push($return_arr, ["dependencia" => " $idDep","descripcion"=>"$descript"]);
}

oci_free_statement($query);
echo json_encode($return_arr);
oci_close($conn);
  
?>