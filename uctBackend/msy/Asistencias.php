<?php
include('../config.php');
$conn=oci_connect($usr,$pw,$bd,'WE8ISO8859P1');


$data = json_decode(file_get_contents('php://input'), true);
$idMsy=$data['datos']['idMsy'];
$idSolicitud=$data['datos']['idTipoSol'];

//$idSolicitud=$data['idTipoSol'];

$sql="SELECT ID_ASISTENCIA,DESCRIPCION 
FROM msy_asistencias 
WHERE ID_DEPENDENCIA=$idMsy
AND ID_TIPO_SOLICITUD=$idSolicitud
AND ESTADO=0
ORDER BY DESCRIPCION";

$return_arr = array();   
$query=oci_parse($conn,$sql);  oci_execute($query);
while(oci_fetch($query)){ 
  $idDep=oci_result($query,"ID_ASISTENCIA");
  $descript=utf8_encode(oci_result($query,"DESCRIPCION"));
  array_push($return_arr, ["asistencia" => " $idDep","descripcion"=>"$descript"]);
}

oci_free_statement($query);
echo json_encode($return_arr);
oci_close($conn);
  
?>