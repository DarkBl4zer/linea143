<?php
include('../config.php');
$conn=oci_connect($usr,$pw,$bd,'WE8ISO8859P1');

/*
VALOR -> ESTADOS
0 -> OK
1 -> Select
2 -> Insert
3 -> Update
4 -> Email
*/

$data = json_decode(file_get_contents('php://input'), true);
$Fichier1=$data['datos']['Fichier1'];
$ccFunc=$data['datos']['ccFunc'];
$consecFunc=$data['datos']['consecFunc'];
$idDep=$data['datos']['idDep'];
$detalleSol=$data['datos']['detalleSol'];
//$elementoDesc=$data['datos']['elementoDesc'];
//$elementoDescCan=$data['datos']['elementoDescCan'];
$exten=$data['datos']['exten'];
$mesaDeAyuda=$data['datos']['mesaDeAyuda'];
$numCel=$data['datos']['numCel'];
$tipoAsistencia=$data['datos']['tipoAsistencia'];
$tipoServicio=$data['datos']['tipoServicio'];
$tipoSolicitud=$data['datos']['tipoSolicitud'];
$aprobacion=$data['datos']['aprobacion'];
//Datos del sistema
$idTramite=301;
$vigencia =date('Y');
$fecha=date('d/m/Y');
//Primero registrar tramiterespuesta - Luego registrar archivo
$fechaFestiva=1;
$i=1;
while($fechaFestiva==1){
    $fechaFestiva = calcularDiaFestivo($conn,$i);
    $fechaRegistro=date('d/m/Y', strtotime("+$i day"));
    $i++;
}

//CARGAR ARCHIVO
if($Fichier1!=''){
    $nombreArchivo=utf8_decode($data['datos']['Fichier1']['name']);
    $pesoArchivo=$data['datos']['Fichier1']['size'];
    $tipoArchivo=$data['datos']['Fichier1']['type'];
    $valorArchivo=$data['datos']['Fichier1']['value'];
    $rutaFinal = $target_path.$nombreArchivo;
    if (!file_put_contents($rutaFinal,base64_decode($data['datos']['Fichier1']['value']))) {
        $return_arr[] = array(
            "codigo" => '2', 
            "msg" => "El sistema no puede almacenar el archivo adjunto",
            "sql" => ""
        );
        echo json_encode($return_arr);
        oci_close($conn);
        return;
    }
}else{
    $nombreArchivo='Sin Definir';
    $pesoArchivo='Sin Definir';
    $tipoArchivo='Sin Definir';
    $valorArchivo='Sin Definir';
    $rutaFinal='Sin Definir';
}

if($aprobacion==0){
    
    //CONSULTAR EMAIL DEL JEFE
    try {
        $sql="SELECT UR.EMAIL
        FROM LISTA_JEFE_DEPENDENCIA ljd 
            INNER JOIN USUARIO_ROL UR ON UR.CEDULA=TO_CHAR(ljd.CC_FUNCIONARIO)
        WHERE ljd.ESTADO=1 AND ljd.ID_DEPENDENCIA=$idDep";
        $emailJefe=consultar_unico($conn,$sql);
    } catch (Exception $e) {
        $return_arr[] = array(
            "codigo" => '1', 
            "msg" => "El sistema no puede extraer el email del jefe de su dependencia.",
            "sql" => "$sql"
        );
        echo json_encode($return_arr);
        oci_close($conn);
        return;
    }
    /*
    //CONSECUTIVO MESA DE AYUDA
    $consecutivoMsy=callConsecutivoMst($conn);
    
    //INSERTAR EN TABLA MESA DE AYUDA
    
    $sql="INSERT INTO msy_solicitud (
    CONSECUTIVO,ID_DEPENDENCIA,ID_ASISITENCIA,ID_SERVICIO,DETALLE_SOLICITUD,
    DOCUMENTO,CC_SOLICITANTE,DEPENDENCIA_SOLICITA,CELULAR,EXTENCION,ID_TRAMITE,VIGENCIA,RUTADOCUMENTO ) 
    VALUES
    ($consecutivoMsy,$mesaDeAyuda,$tipoAsistencia,$tipoServicio,'$detalleSol','$nombreArchivo',
    $ccFunc,$idDep,$numCel,$exten,$idTramite,$vigencia,'$rutaFinal')";
    $registrar = oci_parse($conn, $sql);
    if(!oci_execute($registrar)){
        $return_arr[] = array(
            "codigo" => '2', 
            "msg" => "El sistema no puedo registrar la informacion",
            "sql" => "$sql"
        );
        echo json_encode($return_arr);
        oci_close($conn);
        return;
    }
    */
    
    //ENVIAR EMAIL A JEFE PARA SOLICITAR APROBACION
    include("../../mail-global/PHPMailerAutoload.php");
    include("../../mail-global/cabeceraParaEnvioDeCorreos.php");

    $mail->SetFrom = "master@personeriabogota.gov.co";
    $mail->FromName = "Solicitud de aprobacion para una nueva mesa de ayuda";

    $fecha=date("d-m-Y (H:i)");
    $nomCiudadano='Sr(a) coordinador';
    $mail->AddAddress($emailJefe,'Sr(a) coordinador');
    $mail->Subject = "Aprobacion mesa de ayuda $consecutivoMsy";

    $htmlBody  = "<html><head>";
    $htmlBody .= "<meta http-equiv='Content-Type' />"; //charset='UTF-8'
    $htmlBody .= "</head><body>";
    $htmlBody .= "<h3>Estimado(a) $Ciudadano</h3>";
    $htmlBody .= "<p align='justify'>Recibido el dia: $fecha.</p>";
    $htmlBody .= "<p>&nbsp;</p>";
    $htmlBody .= "<p style='text-align:justify'>Reciba un cordial saludo en nombre de la Personeria de Bogota D.C., ";
    $htmlBody .= "con respecto a una Solicitud de aprobacion para una nueva mesa de ayuda, con numero $consecutivoMsy </p>";
    $htmlBody .= "<p style='text-align:justify'>Para consultar aprobar o rechazar esta nueva solicitud debera dar clic ";
    $htmlBody .= "en el siguiente enlace: </p>";
    $htmlBody .= "<p style='text-align:center'><a href='https://apps.personeriabogota.gov.co/uctV2/#/dashboard/msy_registroRespJefe?semilla=$consecutivoMsy'><button style='background-color: #4CAF50;  border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'> Respoder solicitud</button></a></p>";
    $htmlBody .= "</body></html>";

    $mail->Body=$htmlBody;
    $mail->isHTML(true);
    if(!$mail->send($email)){
        $return_arr[] = array(
            "codigo" => '4', 
            "msg" => "El sistema no pudo enviar el correo electrónico al supervisor.",
        );
        echo json_encode($return_arr);
        oci_close($conn);
        return;
    }
    /*
    $return_arr[] = array(
        "codigo" => '0', 
        "msg" => "La solicitud de mesa de ayuda: $consecutivoMsy fue registrada de forma correcta en el sistema. <br> Esta estará activada en el momento en que el coordinador/jefe apruebe su registro.",
    );
    echo json_encode($return_arr);
    oci_close($conn);
    return;
    */

        //Extraer usuario responsable del caso 
    
        $sql="SELECT * FROM 
        (SELECT APROBADOR FROM MSY_LIDERES_SERVICIOS  
        WHERE ID_SERVICIO=$tipoServicio AND ID_ASISTENCIA=$tipoAsistencia AND ID_DEPENDENCIA=$mesaDeAyuda AND ESTADO=0 
            AND SERVICIOS_REG=( SELECT MIN(SERVICIOS_REG) FROM MSY_LIDERES_SERVICIOS  
            WHERE ID_SERVICIO=$tipoServicio AND ID_ASISTENCIA=$tipoAsistencia AND ID_DEPENDENCIA=$mesaDeAyuda AND ESTADO=0 )
        ORDER BY dbms_random.value) PARTICIPANTES WHERE rownum = 1";
        $aprobadorCC=consultar_unico($conn,$sql);
     
        if($aprobadorCC==''){
            $return_arr[] = array(
                "codigo" => '1', 
                "msg" => "El sistema no puede extraer el responsable de la solicitud.",
                "sql" => "$sql"
            );
            echo json_encode($return_arr);
            oci_close($conn);
            return;
        }
       
        //EXTRAER DATOS DEL APROBADOR   
        $sql="SELECT depend_codigo dependencia,consec,email FROM USUARIO_ROL WHERE CEDULA='$aprobadorCC'";
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
    
        if($consecResponsable==''||$dependResponsable==''||$emailResponsable==''){
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
        //CONSECUTIVO MESA DE AYUDA
        $consecutivoMsy=callConsecutivoMst($conn);
    
        //INSERTAR EN TABLA MESA DE AYUDA
        
        $sql="INSERT INTO msy_solicitud (
        CONSECUTIVO,ID_DEPENDENCIA,ID_ASISITENCIA,ID_SERVICIO,DETALLE_SOLICITUD,
        DOCUMENTO,CC_SOLICITANTE,DEPENDENCIA_SOLICITA,CELULAR,EXTENCION,ID_TRAMITE,
        VIGENCIA,RUTADOCUMENTO,NUM_SOLICITUD ) 
        VALUES
        ($consecutivoMsy,$mesaDeAyuda,$tipoAsistencia,$tipoServicio,'$detalleSol','$nombreArchivo',
        $ccFunc,$idDep,$numCel,$exten,$idTramite,$vigencia,'$rutaFinal',$numSolicitud)";
        $registrar = oci_parse($conn, $sql);
        if(!oci_execute($registrar)){
        
            $return_arr[] = array(
                "codigo" => '2', 
                "msg" => "El sistema no puedo registrar la informacion",
                "sql" => "$sql"
            );
            echo json_encode($return_arr);
            oci_close($conn);
            return;
        }
        //REGISTRO TRAMITEUSUARIO
        
        $sql="INSERT INTO TRAMITEUSUARIO (NUM_SOLICITUD,ID_TRAMITE,ID_USUARIO_REG,FEC_SOLICITUD_TRAMITE,ESTADO_TRAMITE,VIGENCIA,OIDO_CODIGO,TEXTO08) 
        VALUES
        ($numSolicitud,$idTramite,$ccFunc,sysdate,'Inactivo',$vigencia,0,'$detalleSol')";
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
        $msg="Solicitud <br> $detalleSol";
        
        $sql="INSERT INTO TRAMITERESPUESTA 
        (NUM_SOLICITUD,ID_TRAMITE,NUM_PASO,FEC_RESPUESTA,TEX_RESPUESTA,ID_USU_ADM_CONTESTA,ID_USU_ADM,
        ESTADO_TRAMITE,CONSECUTIVO,VIGENCIA,ID_DEPENDENCIA_REG,ID_DEPENDENCIA_ASIG) 
        VALUES
        ($numSolicitud,$idTramite,0,sysdate,'$msg',$consecFunc,$consecResponsable,
        'Inactivo',$consecutivoTr,$vigencia,$idDep,$dependResponsable)";
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
        AND ID_ASISTENCIA='$tipoAsistencia'
        AND ID_SERVICIO='$tipoServicio'";
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
        //INSERTAR DATA DE ARCHIVO
    
        $sql="SELECT MAX(CONSECUTIVO_EXPEDIENTE) FROM EXPEDIENTE_DIGITAL";
        $consecExpedeinte = consultar_unico($conn, $sql) + 1; //unset($sql);
        $sql = "SELECT COUNT(*) FROM ETAPA_ACTUACION_DOCUMENTO WHERE TRARES_CONSECUTIVO='$consecutivoTr'";
        $consecTrasRes = consultar_unico($conn, $sql) + 1; //unset($sql);
    
        $sql="INSERT INTO EXPEDIENTE_DIGITAL (CONSECUTIVO_EXPEDIENTE, NOMBRE_DOCUMENTO, RUTA_DOCUMENTO, FECHA_CARGUE, 
        FUNCIONARIO_REGISTRA, ID_DEPENDENCIA_REGISTRA, ID_TRAMITE, ESTADO, TRARES_CONSECUTIVO, CONSECUTIVO_REGISTRO)
        VALUES ($consecExpedeinte, '$nombreArchivo', '$nombreArchivo', sysdate, '$ccFunc', $idDep, $idTramite, 0, 
        '$consecutivoTr', $consecTrasRes)";
        $registrar = oci_parse($conn, $sql);
        if(!oci_execute($registrar)){
            $return_arr[] = array(
                "codigo" => '2', 
                "msg" => "El sistema no puedo registrar la informacion del documento",
                "sql" => "$sql"
            );
            echo json_encode($return_arr);
            oci_close($conn);
            return;
        }
    
        $return_arr[] = array(
            "codigo" => '0', 
            "msg" => "La solicitud de mesa de ayuda: $consecutivoMsy con sinproc: $numSolicitud.<br> fue registrada de forma correcta en el sistema.",
            "sql" => ""
        );
        echo json_encode($return_arr);
        oci_close($conn);
        return;

}else{
    //Extraer usuario responsable del caso 
    
    $sql="SELECT * FROM 
    (SELECT APROBADOR FROM MSY_LIDERES_SERVICIOS  
    WHERE ID_SERVICIO=$tipoServicio AND ID_ASISTENCIA=$tipoAsistencia AND ID_DEPENDENCIA=$mesaDeAyuda AND ESTADO=0 
        AND SERVICIOS_REG=( SELECT MIN(SERVICIOS_REG) FROM MSY_LIDERES_SERVICIOS  
        WHERE ID_SERVICIO=$tipoServicio AND ID_ASISTENCIA=$tipoAsistencia AND ID_DEPENDENCIA=$mesaDeAyuda AND ESTADO=0 )
    ORDER BY dbms_random.value) PARTICIPANTES WHERE rownum = 1";
    $aprobadorCC=consultar_unico($conn,$sql);
 
    if($aprobadorCC==''){
        $return_arr[] = array(
            "codigo" => '1', 
            "msg" => "El sistema no puede extraer el responsable de la solicitud.",
            "sql" => "$sql"
        );
        echo json_encode($return_arr);
        oci_close($conn);
        return;
    }
   
    //EXTRAER DATOS DEL APROBADOR   
    $sql="SELECT depend_codigo dependencia,consec,email FROM USUARIO_ROL WHERE CEDULA='$aprobadorCC'";
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

    if($consecResponsable==''||$dependResponsable==''||$emailResponsable==''){
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
    //CONSECUTIVO MESA DE AYUDA
    $consecutivoMsy=callConsecutivoMst($conn);

    //INSERTAR EN TABLA MESA DE AYUDA
    
    $sql="INSERT INTO msy_solicitud (
    CONSECUTIVO,ID_DEPENDENCIA,ID_ASISITENCIA,ID_SERVICIO,DETALLE_SOLICITUD,
    DOCUMENTO,CC_SOLICITANTE,DEPENDENCIA_SOLICITA,CELULAR,EXTENCION,ID_TRAMITE,
    VIGENCIA,RUTADOCUMENTO,NUM_SOLICITUD ) 
    VALUES
    ($consecutivoMsy,$mesaDeAyuda,$tipoAsistencia,$tipoServicio,'$detalleSol','$nombreArchivo',
    $ccFunc,$idDep,$numCel,$exten,$idTramite,$vigencia,'$rutaFinal',$numSolicitud)";
    $registrar = oci_parse($conn, $sql);
    if(!oci_execute($registrar)){
    
        $return_arr[] = array(
            "codigo" => '2', 
            "msg" => "El sistema no puedo registrar la informacion",
            "sql" => "$sql"
        );
        echo json_encode($return_arr);
        oci_close($conn);
        return;
    }
    //REGISTRO TRAMITEUSUARIO
    
    $sql="INSERT INTO TRAMITEUSUARIO (NUM_SOLICITUD,ID_TRAMITE,ID_USUARIO_REG,FEC_SOLICITUD_TRAMITE,ESTADO_TRAMITE,VIGENCIA,OIDO_CODIGO,TEXTO08) 
    VALUES
    ($numSolicitud,$idTramite,$ccFunc,sysdate,'Remitido',$vigencia,0,'$detalleSol')";
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
    $msg="Solicitud <br> $detalleSol";
    
    $sql="INSERT INTO TRAMITERESPUESTA 
    (NUM_SOLICITUD,ID_TRAMITE,NUM_PASO,FEC_RESPUESTA,TEX_RESPUESTA,ID_USU_ADM_CONTESTA,ID_USU_ADM,
    ESTADO_TRAMITE,CONSECUTIVO,VIGENCIA,ID_DEPENDENCIA_REG,ID_DEPENDENCIA_ASIG) 
    VALUES
    ($numSolicitud,$idTramite,0,sysdate,'$msg',$consecFunc,$consecResponsable,
    'Remitido',$consecutivoTr,$vigencia,$idDep,$dependResponsable)";
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
    AND ID_ASISTENCIA='$tipoAsistencia'
    AND ID_SERVICIO='$tipoServicio'";
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
    //INSERTAR DATA DE ARCHIVO

    $sql="SELECT MAX(CONSECUTIVO_EXPEDIENTE) FROM EXPEDIENTE_DIGITAL";
    $consecExpedeinte = consultar_unico($conn, $sql) + 1; //unset($sql);
    $sql = "SELECT COUNT(*) FROM ETAPA_ACTUACION_DOCUMENTO WHERE TRARES_CONSECUTIVO='$consecutivoTr'";
    $consecTrasRes = consultar_unico($conn, $sql) + 1; //unset($sql);

    $sql="INSERT INTO EXPEDIENTE_DIGITAL (CONSECUTIVO_EXPEDIENTE, NOMBRE_DOCUMENTO, RUTA_DOCUMENTO, FECHA_CARGUE, 
    FUNCIONARIO_REGISTRA, ID_DEPENDENCIA_REGISTRA, ID_TRAMITE, ESTADO, TRARES_CONSECUTIVO, CONSECUTIVO_REGISTRO)
    VALUES ($consecExpedeinte, '$nombreArchivo', '$nombreArchivo', sysdate, '$ccFunc', $idDep, $idTramite, 0, 
    '$consecutivoTr', $consecTrasRes)";
    $registrar = oci_parse($conn, $sql);
    if(!oci_execute($registrar)){
        $return_arr[] = array(
            "codigo" => '2', 
            "msg" => "El sistema no puedo registrar la informacion del documento",
            "sql" => "$sql"
        );
        echo json_encode($return_arr);
        oci_close($conn);
        return;
    }

    $return_arr[] = array(
        "codigo" => '0', 
        "msg" => "La solicitud de mesa de ayuda: $consecutivoMsy con sinproc: $numSolicitud.<br> fue registrada de forma correcta en el sistema.",
        "sql" => ""
    );
    echo json_encode($return_arr);
    oci_close($conn);
    return;
}


function calcularDiaFestivo($conn,$dia){
    $sql="SELECT COUNT(*) FROM DIAS_FESTIVOS_YEAR 
    WHERE TO_CHAR(FECHA,'DD/MM/DDDD')= TO_CHAR(SYSDATE+$dia,'DD/MM/DDDD')";
    $totalFecha=consultar_unico($conn,$sql);
    return $totalFecha;
}
function callConsecutivoMst($conn){
    $sql="SELECT MAX(CONSECUTIVO) FROM msy_solicitud";
    return consultar_unico($conn,$sql)+1;
}

function callConsecutivoSinproc($conn,$vigencia){
    $sql="SELECT secuencial FROM binconsecutivo WHERE NOMBRE='SINPROC' AND VIGENCIA='$vigencia'";
    return consultar_unico($conn,$sql)+1;
}



?>