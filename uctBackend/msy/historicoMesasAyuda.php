<?php
include('../config.php');
$conn=oci_connect($usr,$pw,$bd,'WE8ISO8859P1');

$data = json_decode(file_get_contents('php://input'), true);
$ccSolicitante=$data['datos']['ccSolicitante'];

$sql="SELECT  MS.CONSECUTIVO,UR.NOMBRE||' '||UR.APELLIDO RESPONSABLE,
DES.DESCRIPCION as dependencia,MS.DETALLE_SOLICITUD,TU.NUM_SOLICITUD SINPROC,
to_char(TU.FEC_SOLICITUD_TRAMITE,'DD/MM/YYYY') as fecregistro
FROM msy_solicitud ms
    INNER JOIN TRAMITERESPUESTA  TR ON (TR.ID_TRAMITE=MS.ID_TRAMITE AND TR.VIGENCIA=MS.VIGENCIA AND TR.NUM_SOLICITUD=MS.NUM_SOLICITUD)
    INNER JOIN USUARIO_ROL UR ON (UR.CONSEC=TR.ID_USU_ADM)
    INNER JOIN TRAMITEUSUARIO TU ON (TR.ID_TRAMITE=TU.ID_TRAMITE AND TR.VIGENCIA=TU.VIGENCIA AND TR.NUM_SOLICITUD=TU.NUM_SOLICITUD)
    INNER JOIN DEPENDENCIA DES ON (DES.CONSECUTIVO=MS.ID_DEPENDENCIA)
WHERE MS.CC_SOLICITANTE=$ccSolicitante
    AND TU.ESTADO_TRAMITE='Remitido'
    AND TR.CONSECUTIVO=((SELECT MAX (consecutivo) FROM TRAMITERESPUESTA WHERE VIGENCIA=TR.VIGENCIA AND ID_TRAMITE=TR.ID_TRAMITE AND NUM_SOLICITUD=TR.NUM_SOLICITUD))";

$return_arr = array();   
$query=oci_parse($conn,$sql);  oci_execute($query);
while(oci_fetch($query)){ 
  $numMesaAyuda=oci_result($query,"CONSECUTIVO");
  $numSolicitud=oci_result($query,"SINPROC");
  $responsable=utf8_encode(oci_result($query,"RESPONSABLE"));
  $dependenciaResp=utf8_encode(oci_result($query,"DEPENDENCIA"));
  $detalleSolicitud=utf8_encode(oci_result($query,"DETALLE_SOLICITUD"));
  $fechaRegistro=utf8_encode(oci_result($query,"fecregistro"));
 
  array_push($return_arr, ["numMesaAyuda" => " $numMesaAyuda","numSolicitud"=>"$numSolicitud",
  "responsable"=>"$responsable","dependenciaResp"=>"$dependenciaResp","detalleSolicitud"=>"$detalleSolicitud",
  "fechaRegistro"=>"$fechaRegistro"]);
}

$sql="SELECT  MS.CONSECUTIVO,UR.NOMBRE||' '||UR.APELLIDO RESPONSABLE,
DES.DESCRIPCION as dependencia,MS.DETALLE_SOLICITUD,TU.NUM_SOLICITUD SINPROC,
to_char(TU.FEC_SOLICITUD_TRAMITE,'DD/MM/YYYY') as fecregistro
FROM msy_solicitud ms
    INNER JOIN TRAMITERESPUESTA  TR ON (TR.ID_TRAMITE=MS.ID_TRAMITE AND TR.VIGENCIA=MS.VIGENCIA AND TR.NUM_SOLICITUD=MS.NUM_SOLICITUD)
    INNER JOIN USUARIO_ROL UR ON (UR.CONSEC=TR.ID_USU_ADM)
    INNER JOIN TRAMITEUSUARIO TU ON (TR.ID_TRAMITE=TU.ID_TRAMITE AND TR.VIGENCIA=TU.VIGENCIA AND TR.NUM_SOLICITUD=TU.NUM_SOLICITUD)
    INNER JOIN DEPENDENCIA DES ON (DES.CONSECUTIVO=MS.ID_DEPENDENCIA)
WHERE MS.CC_SOLICITANTE=$ccSolicitante
    AND TU.ESTADO_TRAMITE='Finalizado'
    AND TR.CONSECUTIVO=((SELECT MAX (consecutivo) FROM TRAMITERESPUESTA WHERE VIGENCIA=TR.VIGENCIA AND ID_TRAMITE=TR.ID_TRAMITE AND NUM_SOLICITUD=TR.NUM_SOLICITUD))";
$return_arr2 = array();   
$query=oci_parse($conn,$sql);  oci_execute($query);
while(oci_fetch($query)){ 
  $numMesaAyuda=oci_result($query,"CONSECUTIVO");
  $numSolicitud=oci_result($query,"SINPROC");
  $responsable=utf8_encode(oci_result($query,"RESPONSABLE"));
  $dependenciaResp=utf8_encode(oci_result($query,"DEPENDENCIA"));
  $detalleSolicitud=utf8_encode(oci_result($query,"DETALLE_SOLICITUD"));
  $fechaRegistro=utf8_encode(oci_result($query,"fecregistro"));
 
  array_push($return_arr2, ["numMesaAyuda" => " $numMesaAyuda","numSolicitud"=>"$numSolicitud",
  "responsable"=>"$responsable","dependenciaResp"=>"$dependenciaResp","detalleSolicitud"=>"$detalleSolicitud",
  "fechaRegistro"=>"$fechaRegistro"]);
}

$data[] = array(
    "mesasActivas" => $return_arr, 
    "mesasaArchivadas" => $return_arr2,  
);

oci_free_statement($query);
echo json_encode($data);
oci_close($conn);
  
?>