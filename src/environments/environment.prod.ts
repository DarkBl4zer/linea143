export const environment = {
  production: true,
  //base_url: 'http://127.0.0.1:8000/api',
  base_url: 'https://uct.personeriabogota.gov.co/api',
  //base_url: 'https://uct-dev.personeriabogota.gov.co'
  base_urlMsy: 'https://apps.personeriabogota.gov.co/uctBackend',
  images_url: 'https://apps.personeriabogota.gov.co/uct/imgUsr',
  languages: {
    processing:     "Procesando ...",
    search:         "Buscar:",
    lengthMenu:     "Mostrar _MENU_ registros",
    info:           "Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
    infoEmpty:      "Mostrando registros del 0 al 0 de un total de 0 registros",
    infoFiltered:   "(filtrado de un total de _MAX_ registros)",
    infoPostFix:    "",
    loadingRecords: "Cargando...",
    zeroRecords:    "Sin registro",
    emptyTable:     "Sin registro",
    paginate: {
        first:      "Primero",
        previous:   "Anterior",
        next:       "Siguiente",
        last:       "Último"
    },
    aria: {
        sortAscending:  ": Activar para ordenar la columna de manera ascendente",
        sortDescending: ": Activar para ordenar la columna de manera descendente"
    }
  }
};
