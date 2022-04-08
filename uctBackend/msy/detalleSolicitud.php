<?php
include('../config.php');
$conn=oci_connect($usr,$pw,$bd,'WE8ISO8859P1');

$data = json_decode(file_get_contents('php://input'), true);
$numMesaAyudaSis=$data['datos']['mesaAyuda'];

$sql="SELECT MS.CONSECUTIVO,MA.DESCRIPCION ASISTENCIA,MSE.DESCRIPCION servicio,
DES.DESCRIPCION dependencia,MS.DETALLE_SOLICITUD,MS.DOCUMENTO,UR.NOMBRE||' '||UR.APELLIDO SOLICITANTE, 
DEP.DESCRIPCION dependenciaSol,MS.RUTADOCUMENTO,MS.ID_DEPENDENCIA
FROM msy_solicitud MS
    INNER JOIN MSY_ASISTENCIAS  MA ON(MA.ID_ASISTENCIA=MS.ID_ASISITENCIA AND MA.ID_DEPENDENCIA=MS.ID_DEPENDENCIA)
    INNER JOIN MSY_SERVICIOS MSE ON ( MSE.ID_SERVICIO=MS.ID_SERVICIO AND MSE.ID_ASISTENCIA=MS.ID_ASISITENCIA)
    INNER JOIN DEPENDENCIA DES ON (DES.CONSECUTIVO=MS.ID_DEPENDENCIA)
    INNER JOIN USUARIO_ROL UR ON (UR.CEDULA=TO_CHAR(MS.CC_SOLICITANTE))
    INNER JOIN DEPENDENCIA DEP ON (DEP.CONSECUTIVO=MS.DEPENDENCIA_SOLICITA)
WHERE MS.NUM_SOLICITUD=$numMesaAyudaSis";

$return_arr = array();   
$query=oci_parse($conn,$sql);  oci_execute($query);
while(oci_fetch($query)){ 

  $numMesaAyuda=utf8_encode(oci_result($query,"CONSECUTIVO"));
  $asistencia=utf8_encode(oci_result($query,"ASISTENCIA"));
  $servicio=utf8_encode(oci_result($query,"SERVICIO"));
  $dependencia=utf8_encode(oci_result($query,"DEPENDENCIA"));
  $detalleSolicitud=utf8_encode(oci_result($query,"DETALLE_SOLICITUD"));
  $documento=utf8_encode(oci_result($query,"DOCUMENTO"));
  $solicitante=utf8_encode(oci_result($query,"SOLICITANTE"));
  $dependenciaSol=utf8_encode(oci_result($query,"DEPENDENCIASOL"));
  $rutaDoc=utf8_encode(oci_result($query,"RUTADOCUMENTO"));
  $idDepMsy=utf8_encode(oci_result($query,"ID_DEPENDENCIA"));
 
  array_push($return_arr, ["numMesaAyuda" => "$numMesaAyuda","asistencia"=>"$asistencia","servicio"=>"$servicio","dependencia"=>"$dependencia","detalleSolicitud"=>"$detalleSolicitud","documento"=>"$documento","solicitante"=>"$solicitante","dependenciaSol"=>"$dependenciaSol","rutaDoc"=>"$rutaDoc","idDepMsy"=>"$idDepMsy"]);
}

$sql2="SELECT  UR.NOMBRE||' '||UR.APELLIDO FUNTIENE,URT.NOMBRE||' '||URT.APELLIDO FUNENTREGO,
TR.FEC_RESPUESTA,TR.TEX_RESPUESTA,DEP.DESCRIPCION DEPTIENE,DEPT.DESCRIPCION DEPENTREGO
FROM tramiterespuesta TR
    INNER JOIN MSY_SOLICITUD MS ON (
        MS.ID_TRAMITE=TR.ID_TRAMITE AND MS.VIGENCIA=TR.VIGENCIA AND MS.NUM_SOLICITUD=TR.NUM_SOLICITUD
    )
    INNER JOIN USUARIO_ROL UR ON (UR.CONSEC=TR.ID_USU_ADM)
    INNER JOIN USUARIO_ROL URT ON (URT.CONSEC=TR.ID_USU_ADM_CONTESTA)
    INNER JOIN DEPENDENCIA DEP ON (DEP.CONSECUTIVO=TR.ID_DEPENDENCIA_REG)
    INNER JOIN DEPENDENCIA DEPT ON (DEPT.CONSECUTIVO=TR.ID_DEPENDENCIA_ASIG)
WHERE MS.NUM_SOLICITUD=$numMesaAyudaSis";

$return_arr2 = array();   
$query=oci_parse($conn,$sql2);  oci_execute($query);
while(oci_fetch($query)){ 
  $funTiene=oci_result($query,"FUNTIENE");
  $funEntrego=oci_result($query,"FUNENTREGO");
  $fechaRespuesta=utf8_encode(oci_result($query,"FEC_RESPUESTA"));
  $textoRespuesta=utf8_encode(oci_result($query,"TEX_RESPUESTA"));
  $depTiene=utf8_encode(oci_result($query,"DEPTIENE"));
  $depEntrego=utf8_encode(oci_result($query,"DEPENTREGO"));
 
  array_push($return_arr2, ["funTiene" =>"$funTiene","funEntrego"=>"$funEntrego","fechaRespuesta"=>"$fechaRespuesta","textoRespuesta"=>"$textoRespuesta","depTiene"=>"$depTiene","depEntrego"=>"$depEntrego"]);
}

$data[] = array(
  "detalleMsy" => $return_arr, 
  "historial" => $return_arr2,  
);

oci_free_statement($query);
echo json_encode($data);
oci_close($conn);