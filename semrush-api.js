function onOpen() {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [];

//nombres de los subelementos del menú. Código de ejemplo:
//entries.push({nme: “nombre del submenú”, functionName: “nombre de la función”});
   entries.push({name: "SiteAudit", functionName: "Siteaudit"});
   entries.push({name: "Keywords", functionName: "Keywords"});
  
// nombre del nuevo elemento del menú. Código de ejemplo:
//spreadsheet.addMenu(“Nombre del elemento principal del menu”, entries);
  spreadsheet.addMenu("Actualizar", entries);
};
function Siteaudit()
{
//identifica la hoja en la que deseamos escribir
  var sheet = SpreadsheetApp.getActive().getSheetByName("Siteaudit");
     
      //Llamada a la api del siteaudit
//var chuckNorrisJSON = UrlFetchApp.fetch("url que hemos creado");
      var chuckNorrisJSON = UrlFetchApp.fetch("https://api.semrush.com/reports/v1/projects/idproject/siteaudit/info?key=CLAVE");

//paseamos el json para poder extraer los datos
      var chuckNorrisObject = JSON.parse(chuckNorrisJSON);
  
//Indicamos en que celda queremos escribir y qué dato queremos extraer del json
//Sheet.getRange(numero de fila, numero de columna).setValue(“dato que insertamos”): se utiliza para identificar donde se insertará el dato
//chuckNorrisObject.current_snapshot.quality.value: es el valor del JSON que queremos extraer
      sheet.getRange(1,1).setValue(chuckNorrisObject.current_snapshot.quality.value);  
}

function Keywords()
{
//identifica la hoja en la que deseamos escribir
    var sheet = SpreadsheetApp.getActive().getSheetByName(“nombre de la página en la que vamos a escribir”)

    //Creamos url con las fechas para consultar la api de semrush y extraer las keywords del position tracker
    var urlTexto= "https://api.semrush.com/reports/v1/projects/idproject/tracking/?key=CLAVE&action=report&type=tracking_position_organic&display_limit=100&display_offset=0&display_sort=ph_desc&date_begin=Fecha_mas_antigua&date_end=Fecha_mas_nueva&display_filter=&url=*.nombre_dominio*&linktype_filter=0&serp_filter_filter=fsn";


    //Llamamos a la api y guardamos Json en variable
    var deadPoolJSON = UrlFetchApp.fetch(urlTexto);
    //Parseamos Json
    var deadPoolObject = JSON.parse(deadPoolJSON);
  
    // Bucle de llamada a cada celda e imprimimos resultados por cada keyword
    i=0;
    fila=2;

//mientras que el objeto tenga datos, el bucle continua, es decir, mientras el deadPoolObjectdata[i] tenga keywords, seguirá el bucle
    while (deadPoolObject.data[i] != null)
    {
//imprimimos palabra clave
       sheet.getRange(fila,1).setValue(deadPoolObject.data[i].Ph); 
  
//imprimimos la posición inicial en la que se encontraba la palabra clave
       sheet.getRange(fila,3).setValue(deadPoolObject.data[i].Be['*.nombre-del-dominio.es*']);

//imprimimos la posición final en la que se encontraba la palabra clave
       sheet.getRange(fila,4).setValue(deadPoolObject.data[i].Fi['*.nombre-del-dominio.es*']);

//imprimimos la diferencia de posiciones del periodo inicial y final
       sheet.getRange(fila,5).setValue(deadPoolObject.data[i].Diff['*.nombre-del-dominio.es*']);

//imprimimos el número de búsquedas de la palabra clave
       sheet.getRange(fila,2).setValue(deadPoolObject.data[i].Nq);

//pasamos a la siguiente keyword
       i++;

//aumentamos el número de fila para que los datos se impriman en la siguiente fila y no se sobreescriban los datos
       fila++;
    }
}
