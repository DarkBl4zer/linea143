<?php
include('../config.php');
$conn=oci_connect($usr,$pw,$bd,'WE8ISO8859P1');

$data = json_decode(file_get_contents('php://input'), true);
$detalleRespuesta=$data['datos']['DetalleRepuesta'];
$aprobacion=$data['datos']['aprobacion'];
$mesaAyuda=$data['datos']['mesaDeAyuda'];
$idTramite=301;
$vigencia =date('Y');
$fecha=date('d/m/Y');
if($aprobacion==0){
    $numPaso=0;
    $mensaje="Solicitud aporbada: ".$detalleRespuesta;
    $estadoTramite='Remitido';
}else{
    $numPaso=20;
    $mensaje="Solicitud rechazada: ".$detalleRespuesta;
    $estadoTramite='Finalizado';
}
//VERIFICAR RESPUESTA MESA DE AYUDA
$sql="SELECT COUNT(*)
FROM TRAMITEUSUARIO 
WHERE NUM_SOLICITUD=$mesaAyuda AND ESTADO_TRAMITE='Inactivo'";
$estadoSolicitudTu=consultar_unico($conn,$sql);
$sql="SELECT COUNT(*)
FROM TRAMITEUSUARIO 
WHERE NUM_SOLICITUD=$mesaAyuda AND ESTADO_TRAMITE='Inactivo'";
$estadoSolicitudTr=consultar_unico($conn,$sql);
if($estadoSolicitudTu!=1 && $estadoSolicitudTr!=1){
    $return_arr[] = array(
        "codigo" => '1', 
        "msg" => "La actual mesa de ayuda ya cuenta con la respuesta registrada en el sistema ",
        "sql" => "$sql"
    );
    echo json_encode($return_arr);
    oci_close($conn);
    return;
}

//CONSULTAR DATOS DE LA SOLICITUD
$sql="SELECT id_dependencia||'_@@_'||id_asisitencia||'_@@_'||id_servicio||'_@@_'||CC_SOLICITANTE||'_@@_'||DETALLE_SOLICITUD||'_@@_'||NUM_SOLICITUD
FROM msy_solicitud 
WHERE CONSECUTIVO=$mesaAyuda";
$datosMesaAyuda=consultar_unico($conn,$sql);
$porciones = explode("_@@_", $datosMesaAyuda);
$idDep=$porciones[0];
$idAsistencia=$porciones[1];
$idServicio=$porciones[2];
$ccFunc=$porciones[3];
$detalleSol=$porciones[4];
$numSolicitud=$porciones[5];




$sql="UPDATE TRAMITEUSUARIO SET ESTADO_TRAMITE='$estadoTramite' 
WHERE NUM_SOLICITUD=$mesaAyuda AND ID_TRAMITE=$idTramite  AND ESTADO_TRAMITE='Inactivo'";
$registrar = oci_parse($conn, $sql);
if(!oci_execute($registrar)){
    $return_arr[] = array(
        "codigo" => '3', 
        "msg" => "El sistema no puede actualizar el numero de sinproc en la mesa de ayuda TU.",
        "sql" => "$sql"
    );
    echo json_encode($return_arr);
    oci_close($conn);
    return;
}


$sql="UPDATE TRAMITERESPUESTA SET ESTADO_TRAMITE='$estadoTramite' 
WHERE NUM_SOLICITUD=$mesaAyuda AND ID_TRAMITE=$idTramite AND ESTADO_TRAMITE='Inactivo'";
$registrar = oci_parse($conn, $sql);
if(!oci_execute($registrar)){
    $return_arr[] = array(
        "codigo" => '3', 
        "msg" => "El sistema no puede actualizar el numero de sinproc en la mesa de ayuda TR.",
        "sql" => "$sql"
    );
    echo json_encode($return_arr);
    oci_close($conn);
    return;
}



/*
//DATOS DEL SOLICITANTE ORIGINAL 

$sql="SELECT CONSEC||'_@@_'||DEPEND_CODIGO
FROM USUARIO_ROL 
WHERE CEDULA = TO_CHAR($ccFunc)";
$datosMesaAyuda=consultar_unico($conn,$sql);
$porciones = explode("_@@_", $datosMesaAyuda);
$consecFunc=$porciones[0];
$idDepSol=$porciones[1];
//DEFINIR FECHA REGISTRO
$fechaFestiva=1;
$i=1;
while($fechaFestiva==1){
    $fechaFestiva = calcularDiaFestivo($conn,$i);
    $fechaRegistro=date('d/m/Y', strtotime("+$i day"));
    $i++;
}

//Extraer usuario responsable del caso 
$sql="SELECT * FROM 
(SELECT APROBADOR FROM MSY_LIDERES_SERVICIOS  
WHERE ID_SERVICIO=$idServicio  AND ID_ASISTENCIA=$idAsistencia AND ID_DEPENDENCIA=$idDep AND ESTADO=0 
    AND SERVICIOS_REG=( SELECT MIN(SERVICIOS_REG) FROM MSY_LIDERES_SERVICIOS  
    WHERE ID_SERVICIO=$idServicio AND ID_ASISTENCIA=$idAsistencia AND ID_DEPENDENCIA=$idDep AND ESTADO=0 )
ORDER BY dbms_random.value) PARTICIPANTES WHERE rownum = 1";
$aprobadorCC=consultar_unico($conn,$sql);
if($aprobadorCC==''){
    $return_arr[] = array(
        "codigo" => '1', 
        "msg" => "El sistema no puede extraer el responsable de la solicitud, ya que no esta registrado en el sistema",
        "sql" => "$sql"
    );
    echo json_encode($return_arr);
    oci_close($conn);
    return;
}

//EXTRAER DATOS DEL APROBADOR   
$sql="SELECT depend_codigo dependencia,consec,email FROM USUARIO_ROL WHERE CEDULA=TO_CHAR($aprobadorCC)";
$query=oci_parse($conn,$sql);  
if(oci_execute($query)){
    while(oci_fetch($query)){
        $consecResponsable=oci_result($query,"CONSEC");
        $dependResponsable=oci_result($query,"DEPENDENCIA");
        $emailResponsable=oci_result($query,"EMAIL");
    }
}else{
    $return_arr[] = array(
        "codigo" => '1', 
        "msg" => "El sistema no puede extraer los datos del responsable del serivicio",
        "sql" => "$sql"
    );
    echo json_encode($return_arr);
    oci_close($conn);
    return;
}

//EXTRAER BINCONSECUTIVO SINPROC
$numSolicitud=callConsecutivoSinproc($conn,$vigencia);
//ACTUALIZAR CONSECITVO DE SINPROC BINCONSECUTIVO

$sql="UPDATE binconsecutivo SET secuencial=$numSolicitud WHERE NOMBRE='SINPROC' AND VIGENCIA='$vigencia'";
$registrar = oci_parse($conn, $sql);
if(!oci_execute($registrar)){
    $return_arr[] = array(
        "codigo" => '3', 
        "msg" => "El sistema no puede actualizar el num_solicitud de registro de mesa de ayuda.",
        "sql" => "$sql"
    );
    echo json_encode($return_arr);
    oci_close($conn);
    return;
}
//REGISTRO TRAMITEUSUARIO
$sql="INSERT INTO TRAMITEUSUARIO (NUM_SOLICITUD,ID_TRAMITE,ID_USUARIO_REG,FEC_SOLICITUD_TRAMITE,ESTADO_TRAMITE,VIGENCIA,OIDO_CODIGO,TEXTO08) 
VALUES
($numSolicitud,$idTramite,$ccFunc,sysdate,'$estadoTramite',$vigencia,0,'$detalleSol')";
$registrar = oci_parse($conn, $sql);
if(!oci_execute($registrar)){ 
    $return_arr[] = array(
        "codigo" => '2', 
        "msg" => "El sistema no puedo registrar la informacion en tramiteUsr",
        "sql" => "$sql"
    );
    echo json_encode($return_arr);
    oci_close($conn);
    return;
}

//EXTRAER CONSECUTIVO TRAMITERESPUESTA
try {
    $sql="SELECT MAX(CONSECUTIVO) FROM tramiterespuesta";
    $consecutivoTr=consultar_unico($conn,$sql)+rand(1,3);
} catch (Exception $e) {
    $return_arr[] = array(
        "codigo" => '1', 
        "msg" => "El sistema no puede extraer el consecutivo de registro Tr.",
        "sql" => "$sql"
    );
    echo json_encode($return_arr);
    oci_close($conn);
    return;
}

//INSERTAR INFORMACION EN TRAMITERESPUESTA
$sql="INSERT INTO TRAMITERESPUESTA 
(NUM_SOLICITUD,ID_TRAMITE,NUM_PASO,FEC_RESPUESTA,TEX_RESPUESTA,ID_USU_ADM_CONTESTA,ID_USU_ADM,
ESTADO_TRAMITE,CONSECUTIVO,VIGENCIA,ID_DEPENDENCIA_REG,ID_DEPENDENCIA_ASIG) 
VALUES
($numSolicitud,$idTramite,$numPaso,sysdate,'$mensaje',$consecFunc,$consecResponsable,
'$estadoTramite',$consecutivoTr,$vigencia,$idDepSol,$dependResponsable)";
$registrar = oci_parse($conn, $sql);
if(!oci_execute($registrar)){
    $return_arr[] = array(
        "codigo" => '2', 
        "msg" => "El sistema no puedo registrar la informacion en tramiteRes",
        "sql" => "$sql"
    );
    echo json_encode($return_arr);
    oci_close($conn);
    return;
} 

//CONSULTAR LISTA DE SERVICIOS
try {
    $sql="SELECT servicios_reg FROM msy_lideres_servicios WHERE APROBADOR=$aprobadorCC AND ID_DEPENDENCIA=$idDep";
    $totalServicios=consultar_unico($conn,$sql)+1;
} catch (Exception $e) {
    $return_arr[] = array(
        "codigo" => '1', 
        "msg" => "El sistema no puede extraer el consecutivo de registro Tr.",
        "sql" => "$sql"
    );
    echo json_encode($return_arr);
    oci_close($conn);
    return;
}
//ACTUALIZAR LISTA DE SERVICIOS APORBADOR

$sql="UPDATE msy_lideres_servicios SET SERVICIOS_REG=$totalServicios 
WHERE APROBADOR='$aprobadorCC' 
AND ID_DEPENDENCIA='$idDep'
AND ID_ASISTENCIA='$idAsistencia'
AND ID_SERVICIO='$idServicio'";
$registrar = oci_parse($conn, $sql);
if(!oci_execute($registrar)){
    $return_arr[] = array(
        "codigo" => '3', 
        "msg" => "El sistema no puede actualizar la cantidad de casos para el responsable.",
        "sql" => "$sql"
    );
    echo json_encode($return_arr);
    oci_close($conn);
    return;
}

$sql="UPDATE MSY_SOLICITUD SET NUM_SOLICITUD=$numSolicitud WHERE CONSECUTIVO='$mesaAyuda'";
$registrar = oci_parse($conn, $sql);
if(!oci_execute($registrar)){
    $return_arr[] = array(
        "codigo" => '3', 
        "msg" => "El sistema no puede actualizar el numero de sinproc en la mesa de ayuda .",
        "sql" => "$sql"
    );
    echo json_encode($return_arr);
    oci_close($conn);
    return;
}

$return_arr[] = array(
    "codigo" => '0', 
    "msg" => "La solicitud de mesa de ayuda: $mesaAyuda con sinproc: $numSolicitud.<br> fue registrada de forma correcta en el sistema.",
    "sql" => ""
);
echo json_encode($return_arr);
oci_close($conn);
return;



function calcularDiaFestivo($conn,$dia){
    $sql="SELECT COUNT(*) FROM DIAS_FESTIVOS_YEAR 
    WHERE TO_CHAR(FECHA,'DD/MM/DDDD')= TO_CHAR(SYSDATE+$dia,'DD/MM/DDDD')";
    $totalFecha=consultar_unico($conn,$sql);
    return $totalFecha;
}

function callConsecutivoSinproc($conn,$vigencia){
    $sql="SELECT secuencial FROM binconsecutivo WHERE NOMBRE='SINPROC' AND VIGENCIA='$vigencia'";
    return consultar_unico($conn,$sql)+1;
}

*/

$return_arr[] = array(
    "codigo" => '0', 
    "msg" => "La solicitud de mesa de ayuda: $mesaAyuda con sinproc: $numSolicitud.<br> fue registrada de forma correcta en el sistema.",
    "sql" => ""
);
echo json_encode($return_arr);
oci_close($conn);
return;
