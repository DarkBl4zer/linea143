<?php
include('../config.php');
$conn=oci_connect($usr,$pw,$bd,'WE8ISO8859P1');


$data = json_decode(file_get_contents('php://input'), true);
$idMsy=$data['datos']['idMsy'];
$idAsistencia=$data['datos']['idAsistencia'];
$idServicio=$data['datos']['idServicio'];

//$idSolicitud=$data['idTipoSol'];

$sql="SELECT NVL(FORMATO,'La solicitud no requiere formato') FORMATO,
NVL(URL_FORMATO,'La solicitud no requiere formato') URL_FORMATO,
APROBACION,DIAS_NECESARIO,DETALLE_DEL_SERVICIO
FROM msy_servicios
WHERE ID_DEPENDENCIA=$idMsy
    AND ID_SERVICIO=$idServicio
    AND ID_ASISTENCIA=$idAsistencia";

$return_arr = array();   
$query=oci_parse($conn,$sql);  
if(!oci_execute($query)){
    $return_arr[] = array(
        "codigo" => '1', 
        "msg" => "El sistema no puedo extraer los datos necesarios",
        "sql" => "$sql"
    );
    echo json_encode($return_arr);
    oci_close($conn);
    return;
}else{
    while(oci_fetch($query)){ 
        $detalleServicio=utf8_encode(oci_result($query,"DETALLE_DEL_SERVICIO"));
        $dias=utf8_encode(oci_result($query,"DIAS_NECESARIO"));
        $aprobacion=utf8_encode(oci_result($query,"APROBACION"));
        $formatoUrl=utf8_encode(oci_result($query,"URL_FORMATO"));
        $formato=utf8_encode(oci_result($query,"FORMATO"));
        array_push($return_arr, ["detalleServicio" => " $detalleServicio","dias"=>"$dias",
            "aprobacion"=>"$aprobacion","formatoUrl"=>"$formatoUrl","formato"=>"$formato"
        ]);
    }
}

oci_free_statement($query);
echo json_encode($return_arr);
oci_close($conn);
return;
  
?>