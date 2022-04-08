<?php
include('../config.php');
$conn=oci_connect($usr,$pw,$bd,'WE8ISO8859P1');

$data = json_decode(file_get_contents('php://input'), true);
$asistencia=$data['datos']['asistencia'];
$idDepMsy=$data['datos']['idDepMsy'];
$mesaDeAyuda=$data['datos']['mesaDeAyuda'];
$observacion=$data['datos']['observacion'];
$pU=$data['datos']['pU'];
$pD=$data['datos']['pD'];
$pT=$data['datos']['pT']; 
$pC=$data['datos']['pC'];  if(empty($pC)){ $pC=9; }
$pCi=$data['datos']['pCi']; if(isset($pCi)){ $pCi=9; }
$pS=$data['datos']['pS'];if(isset($pS)){ $pS=9; }
$pSi=$data['datos']['pSi'];if(isset($pSi)){ $pSi=9; }


$servicio=$data['datos']['servicio'];

//VERIFICAR SI ENCUESTA FUE RESPONDIDA
$sql="SELECT COUNT(*) FROM TRAMITEUSUARIO WHERE NUM_SOLICITUD=$mesaDeAyuda AND NUMERO01 IS NULL 
AND NUMERO02 IS NULL AND NUMERO03 IS NULL";
$totalRespuestas=consultar_unico($conn,$sql);
if($totalRespuestas != 1){
    $return_arr[] = array(
        "codigo" => '1', 
        "msg" => "La actual mesa de ayuda ya cuenta con la correspondiente calififcaion del servicio",
        "sql" => "$sql"
    );
    echo json_encode($return_arr);
    oci_close($conn);
    return;
}
//ACTUALIZACION EN TRAMITEUSUARIO
$sql="UPDATE TRAMITEUSUARIO SET NUMERO01=$pU, NUMERO02=$pD, NUMERO03=$pT, NUMERO04=$pC, NUMERO05=$pCi,
    NUMERO06=$pS, NUMERO07=$pSi, TEXTO20='$observacion'
WHERE NUM_SOLICITUD=$mesaDeAyuda AND ID_TRAMITE=301 AND ESTADO_TRAMITE='Finalizado'";
$registrar = oci_parse($conn, $sql);
if(!oci_execute($registrar)){
    $return_arr[] = array(
        "codigo" => '3', 
        "msg" => "El sistema no puede actualizar los datos registrados en la encuesta.",
        "sql" => "$sql"
    );
    echo json_encode($return_arr);
    oci_close($conn);
    return;
}

$return_arr[] = array(
    "codigo" => '0', 
    "msg" => "La encuesta de la mesa de ayuda: $mesaDeAyuda <br> fue registrada de forma correcta en el sistema.",
    "sql" => ""
);
echo json_encode($return_arr);
oci_close($conn);
return;