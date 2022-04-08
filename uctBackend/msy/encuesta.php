<?php
    include('../config.php');
    $conn=oci_connect($usr,$pw,$bd,'WE8ISO8859P1');
    $mesaAyuda=$_GET['semilla'];   


    
    $sql="SELECT MS.CONSECUTIVO,MA.DESCRIPCION ASISTENCIA,MSE.DESCRIPCION servicio,
    DES.DESCRIPCION dependencia,MS.DETALLE_SOLICITUD,MS.DOCUMENTO,UR.NOMBRE||' '||UR.APELLIDO SOLICITANTE, 
    DEP.DESCRIPCION dependenciaSol,MS.RUTADOCUMENTO
    FROM msy_solicitud MS
        INNER JOIN MSY_ASISTENCIAS  MA ON(MA.ID_ASISTENCIA=MS.ID_ASISITENCIA)
        INNER JOIN MSY_SERVICIOS MSE ON ( MSE.ID_SERVICIO=MS.ID_SERVICIO AND MSE.ID_ASISTENCIA=MS.ID_ASISITENCIA)
        INNER JOIN DEPENDENCIA DES ON (DES.CONSECUTIVO=MS.ID_DEPENDENCIA)
        INNER JOIN USUARIO_ROL UR ON (UR.CEDULA=TO_CHAR(MS.CC_SOLICITANTE))
        INNER JOIN DEPENDENCIA DEP ON (DEP.CONSECUTIVO=MS.DEPENDENCIA_SOLICITA)
    WHERE MS.NUM_SOLICITUD=$mesaAyuda";
    
    $query=oci_parse($conn,$sql);  oci_execute($query);
    while(oci_fetch($query)){ 
        $numMesaAyuda=utf8_encode(oci_result($query,"CONSECUTIVO"));
        $asistencia=utf8_encode(oci_result($query,"ASISTENCIA"));
        $servicio=utf8_encode(oci_result($query,"SERVICIO"));
        $dependencia=utf8_encode(oci_result($query,"DEPENDENCIA"));
        $detalleSolicitud=oci_result($query,"DETALLE_SOLICITUD");
        $documento=utf8_encode(oci_result($query,"DOCUMENTO"));
        $solicitante=utf8_encode(oci_result($query,"SOLICITANTE"));
        $dependenciaSol=utf8_encode(oci_result($query,"DEPENDENCIASOL"));
        $rutaDoc=utf8_encode(oci_result($query,"RUTADOCUMENTO"));
    }

    $sql="SELECT  UR.NOMBRE||' '||UR.APELLIDO FUNTIENE,URT.NOMBRE||' '||URT.APELLIDO FUNENTREGO,
    TR.FEC_RESPUESTA,TR.TEX_RESPUESTA,DEP.DESCRIPCION DEPTIENE,DEPT.DESCRIPCION DEPENTREGO
    FROM tramiterespuesta TR
        INNER JOIN MSY_SOLICITUD MS ON (
            MS.ID_TRAMITE=TR.ID_TRAMITE AND MS.VIGENCIA=TR.VIGENCIA AND MS.NUM_SOLICITUD=TR.NUM_SOLICITUD
        )
        INNER JOIN USUARIO_ROL UR ON (UR.CONSEC=TR.ID_USU_ADM)
        INNER JOIN USUARIO_ROL URT ON (URT.CONSEC=TR.ID_USU_ADM_CONTESTA)
        INNER JOIN DEPENDENCIA DEP ON (DEP.CONSECUTIVO=TR.ID_DEPENDENCIA_REG)
        INNER JOIN DEPENDENCIA DEPT ON (DEPT.CONSECUTIVO=TR.ID_DEPENDENCIA_ASIG)
    WHERE MS.NUM_SOLICITUD=$mesaAyuda";
    $query=oci_parse($conn,$sql); oci_execute($query);
?>
<html>
    <head>
        <title>Encuesta satisfaccion</title>
        <meta charset="UTF-8"/>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.2/dist/css/bootstrap.min.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="../../css-global/validationEngine.jquery.css"/>
        <link rel="stylesheet" type="text/css" href="../notyJs.css"/>
    </head>
    <body>
        <div class="container" style="background-color: white">
            <div class="alert alert-primary" style="background-color: #003e65; color:#ffffff" role="alert">
                <center>
                    <span>Calificación del nivel de satisfacción para la mesa de ayuda <?php echo $mesaAyuda ?></span>
                </center>
            </div>
            <br>
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Detalle de la solicitud</h5>
                    <ul class="list-group list-group-flush">
                        <li class="list-group-item">Asistecia: <?php echo $asistencia ?> <br> Servicio: <?php echo $servicio ?></li>
                        <li class="list-group-item">Detalle Solicitud: <br> <?php echo $detalleSolicitud ?></li>
                    </ul>
                </div>
            </div>
            <br>
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">Historico de la solicitud</h5>  
                    <table class="table table-striped table-sm dataTable no-footer" style="width: 100%;" data-page-size="10">
                    <thead>
                        <tr>
                            <th>FUNCIONARIO REMITE</th>
                            <th>FECHA RESPUESTA</th>
                            <th>TEXTO RESPUESTA</th>
                            <th>FUNCIONARIO ACTUAL</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        while(oci_fetch($query)){ 
                            $funTiene=oci_result($query,"FUNTIENE");
                            $funEntrego=oci_result($query,"FUNENTREGO");
                            $fechaRespuesta=utf8_encode(oci_result($query,"FEC_RESPUESTA"));
                            $textoRespuesta=oci_result($query,"TEX_RESPUESTA");
                            $depTiene=utf8_encode(oci_result($query,"DEPTIENE"));
                            $depEntrego=utf8_encode(oci_result($query,"DEPENTREGO"));
                        ?>
                        <tr>
                            <td style="font-size: 12px;">
                                <small>-<?php echo $funEntrego."<br>-". $depEntrego  ?></small>
                            </td>
                            <td style="font-size: 12px;">
                                <small><?php echo $fechaRespuesta ?></small>
                            </td>
                            <td style="font-size: 12px;">
                                <small><?php echo $textoRespuesta ?></small>
                            </td>
                            <td style="font-size: 12px;">
                                <small>-<?php echo $funTiene."<br>-". $depTiene  ?></small>
                            </td>
                        </tr>
                        <?php } ?>
                    </tbody>
                    </table>
                </div>
            </div>
            <br>
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">
                        Recuerde que sus observaciones son de gran valor para mejorar el servicio, por favor diligéncialas en este campo 
                    </h5>
                    <form class="form-horizontal form-material" id="frmRegistroInforme" enctype="multipart/form-data" autocomplete="off">
                        <div class="row">
                            <div class="col-md-12">
                                <label for="personal" class="form-label">
                                    1) ¿El personal fue claro, amable y respetuoso?
                                </label>
                                <select id="personal"  name="personal" class="form-control form-control-sm" required>
                                    <option value=" ">- Seleccione una opcion -</option>
                                    <option value="1">Si</option>
                                    <option value="2">No</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <label for="tiempo" class="form-label">
                                    2) ¿El tiempo de respuesta al requerimiento fue?
                                </label>
                                <select id="tiempo"  name="tiempo" class="form-control form-control-sm" required>
                                    <option value=" ">- Seleccione una opcion -</option>
                                    <option value="1">Excelente</option>
                                    <option value="2">Bueno</option>
                                    <option value="3">Regular</option>
                                    <option value="4">Malo</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <label for="calidadServ" class="form-label">
                                    3) ¿Indique el nivel de satisfacción general, con el servicio recibido?
                                </label>
                                <select id="calidadServ"  name="calidadServ" class="form-control form-control-sm" required>
                                    <option value=" ">- Seleccione una opcion -</option>
                                    <option value="1">Excelente</option>
                                    <option value="2">Bueno</option>
                                    <option value="3">Regular</option>
                                    <option value="4">Malo</option>
                                </select>
                            </div>
                        </div>
                        <?php 
                        if($numMesaAyuda==331 && $asistencia=2 && $servicio==2 ){ ?>
                        <div class="row">
                            <div class="col-md-12">
                                <label for="conducResp" class="form-label">
                                    4) ¿El conductor respetó lo límites de velocidad permitidos?
                                </label>
                                <select id="conducResp"  name="conducResp" class="form-control form-control-sm" required>
                                    <option value=" ">- Seleccione una opcion -</option>
                                    <option value="1">Si</option>
                                    <option value="2">No</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <label for="conduSignal" class="form-label">
                                    5) ¿El conductor respetó las señales de tránsito?
                                </label>
                                <select id="conduSignal"  name="conduSignal" class="form-control form-control-sm" required>
                                    <option value=" ">- Seleccione una opcion -</option>
                                    <option value="1">Si</option>
                                    <option value="2">No</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <label for="usoCinturon" class="form-label">
                                    6) ¿Todos los usuarios hicieron uso del cinturón de seguridad?
                                </label>
                                <select id="usoCinturon"  name="usoCinturon" class="form-control form-control-sm" required>
                                    <option value=" ">- Seleccione una opcion -</option>
                                    <option value="1">Si</option>
                                    <option value="2">No</option>
                                </select>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <label for="conduChat" class="form-label">
                                    7) ¿Durante el recorrido el conductor realizó llamadas o chateó mientras conducía?
                                </label>
                                <select id="conduChat"  name="conduChat" class="form-control form-control-sm" required>
                                    <option value=" ">- Seleccione una opcion -</option>
                                    <option value="1">Si</option>
                                    <option value="2">No</option>
                                </select>
                            </div>
                        </div>
                        <?php } ?>
                        <div class="row">
                            <div class="col-md-12">
                                <label class="form-group has-float-label">
                                * Recuerde que sus observaciones son de gran valor para mejorar el servicio, por favor diligéncialas en este campo*
                                </label> 
                                <textarea class="form-control form-control-sm" id="detalleEncuesnta" name="detalleEncuesnta" required> </textarea>
                            </div>
                        </div>
                        <br>
                        <div class="row">
                            <div class="col-md-3"></div>
                            <div class="col-md-6">
                                <center>
                                    <button class="btn btn-primary btn-block btn-rounded" type="button" onclick="registrar()">Registrar Encuesta</button>
                                    <button class="btn btn-primary btn-block btn-rounded" >Registrar Encuesta</button>
                                </center>
                            </div>
                            <div class="col-md-3"></div>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    </body>
</html>
<script type="text/javascript" src="../../js-global/jquery.js" charset="utf-8"></script>
<script type="text/javascript" src="../../js-global/jquery.min.js"></script>
<script type="text/javascript" src="../../js-global/jquery-migrate-1.2.1.js"></script>
<script type="text/javascript" src="../../js-global/jquery.validationEngine.js" charset="utf-8"></script>
<script type="text/javascript" src="../../js-global/jquery.validationEngine-es.js" charset="utf-8"></script>
<script type="text/javascript" src="../notyJs.js" charset="utf-8"></script>

<script>

    function registrar(){
        var formData=new FormData(document.getElementById("frmRegistroInforme"));
        formData.append("dato","valor");
        $.ajax({
            type: "POST",
            url: "uctBackend/msy/registroRespEncuenta.php",
            dataType: 'html',
            data:formData,
            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
            beforeSend:function(){},
            success: function(r){
                var datUsr=r.split("|");
                var valor=datUsr[1];
                var msg=datUsr[2];
                if(valor==0) {
                    console.log('MAl');
                }else{
                    console.log('BIEN');
                }
            }
        });
    }



</script>