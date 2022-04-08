<?php
include('../config.php');
$conn=oci_connect($usr,$pw,$bd,'WE8ISO8859P1');
/*
error_reporting(-1);
ini_set('display_errors', 'On');
set_error_handler("var_dump");
*/
$data = json_decode(file_get_contents('php://input'), true);
$idTramite=$data['datos']['idTramite'];
$vigencia=$data['datos']['vigencia'];
$numSolicitud=$data['datos']['sinproc'];

$sql="SELECT UR.EMAIL||'_@@_'||MS.NUM_SOLICITUD
    FROM MSY_SOLICITUD MS
INNER JOIN USUARIO_ROL UR ON TO_CHAR(MS.CC_SOLICITANTE)=UR.CEDULA 
WHERE MS.NUM_SOLICITUD= $numSolicitud AND MS.VIGENCIA=$vigencia";
$datosMesaAyuda=consultar_unico($conn,$sql);
$porciones = explode("_@@_", $datosMesaAyuda);
$emailSolicitante=$porciones[0];
$mesaAyuda=$porciones[1];
$fecha=date("d-m-Y (H:i)");
$nomCiudadano='Sr(a) solicitante';

//ENVIAR EMAIL A JEFE PARA SOLICITAR APROBACION
include("../../mail-global/PHPMailerAutoload.php");
include("../../mail-global/cabeceraParaEnvioDeCorreos.php");

$mail->SetFrom = "master@personeriabogota.gov.co";
$mail->FromName = "Solicitud respuesta de encuesta para la mesa de ayuda # $mesaAyuda ";
$mail->AddAddress($emailSolicitante,'Sr(a) coordinador');
$mail->Subject = "Encuenta mesa de ayuda $mesaAyuda ";
$htmlBody  = "<html><head>";
$htmlBody .= "<meta http-equiv='Content-Type' />"; //charset='UTF-8'
$htmlBody .= "</head><body>";
$htmlBody .= "<h3>Estimado(a) Solictante</h3>";
$htmlBody .= "<p align='justify'>Recibido el dia: $fecha.</p>";
$htmlBody .= "<p>&nbsp;</p>";
$htmlBody .= "<p style='text-align:justify'>Reciba un cordial saludo en nombre de la Personeria de Bogota D.C., ";
$htmlBody .= "con respecto a su solicitud mesa de ayuda # $mesaAyuda, adjuntamos la respectiva encuesta de satisfacción</p>";
$htmlBody .= "<p style='text-align:justify'>Para dar respuesta a esta debera dar clic en el siguiente enlace:";
$htmlBody .= "en el siguiente enlace: </p>";
$htmlBody .= "<p style='text-align:center'><a href='https://apps.personeriabogota.gov.co/uctV2/#/dashboard/msy_registroEncuesta?semilla=$mesaAyuda'><button style='background-color: #4CAF50;  border: none;color: white;padding: 15px 32px;text-align: center;text-decoration: none;display: inline-block;font-size: 16px;'> Respoder encuesta</button></a></p>";
$htmlBody .= "</body></html>";

$mail->Body=$htmlBody;
$mail->isHTML(true);
if(!$mail->send($emailSolicitante)){
    $return_arr[] = array(
        "codigo" => '4', 
        "msg" => "El sistema no pudo enviar el correo electrónico al encuentador.",
    );
    echo json_encode($return_arr);
    oci_close($conn);
    return;
}

$return_arr[] = array(
    "codigo" => '0', 
    "msg" => "La solicitud de encuenta para la mesa de ayuda: $mesaAyuda fue registrada de forma correcta en el sistema.",
);
echo json_encode($return_arr);
oci_close($conn);
return;
