<?php

header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header("Access-Control-Allow-Headers: Content-Type, Authorization");

//CONEXION PRUEBAS
//$usr='Andres_dev';
//$pw='Ac123456';
//$bd='172.28.4.40:1521/webopru';
//CONEXION PRODUCCION
$usr='APPSINPROC';
$pw='*tiC@2018_nL_aS*aC*'; 
$bd='WEBOIDO';

//Obtiene el año actual para utilizarse en varios script de consulta 
date_default_timezone_set("America/Bogota");
$vigencia_actual = date("Y");

/****************************************************************/
/************** FUNCIONES PERSONALIZADAS ************************/
/****************************************************************/
function consultar_unico($conex_r, $sql_r){
	$consultar = oci_parse($conex_r, $sql_r); 
	@oci_execute($consultar);
	$dato = @oci_fetch_array($consultar, OCI_NUM);
	$resultado_consulta=@$dato[0];
	oci_free_statement($consultar);
	unset($consultar,$dato); 
	return(@$resultado_consulta);
	unset($resultado_consulta);
}

//RUTA FIJA EN LA CUAL IRAN LOS EXPEDEINTES DIGITALES
$target_path = "/exp_digital/";

