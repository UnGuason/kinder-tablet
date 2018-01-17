export class CONSTANTES {


  public static url="https://virtualkinder.com/";
    public static VERSION: string = "21";//version Base de datos

    public static TIPO_INGRESO: string = "ingreso";

    public static AUSENTE: string = 'ausente';
    public static PRESENTE: string = 'presente';

    public static TIPO_DESAYUNO: string = 'desayuno';
    public static TIPO_ALMUERZO: string = 'almuerzo';
    public static TIPO_MERIENDA: string = 'merienda';
    public static TIPO_PIS: string = 'pis';
    public static TIPO_CACA: string = 'caca';
    public static TIPO_ESPECIAL: string = 'especial';
    public static TIPO_DESCANSO: string = 'descanso';
    public static TIPO_SALIDA: string = 'salida';


    public static CACA_NORMAL = 'normal';
    public static CACA_BLANDA = 'normal';
    public static CACA_DURA = 'dura';

    public static DESCANSO_INICIO: string = 'INICIO';
    public static DESCANSO_FINAL: string = 'FINAL';


    public static ALIMENTACION_NADA = 'nada';
    public static ALIMENTACION_POCO = 'poco';
    public static ALIMENTACION_NORMAL = 'normal';
    public static ALIMENTACION_ABUNDANTE = 'abundante';

    public static nombreDb: string = 'kinder.db';
    public static sqlTablaSala = `create table sala(
 id integer PRIMARY KEY UNIQUE,
 nombre text NOT NULL,
 id_maestra text NOT NULL UNIQUE,
  color text NOT NULL )`;

    public static sqlTablaInfantes = `create table infantes(
 id PRIMARY KEY UNIQUE,
 nombre text NOT NULL,
 sala integer NOT NULL,
 foto text
 )`;

    public static sqlTablaNotificaciones = `create table notificaciones(
id integer PRIMARY KEY UNIQUE,
 id_infante integer,
 tipo integer DEFAULT ${CONSTANTES.TIPO_INGRESO},
 cantidad TEXT DEFAULT ${CONSTANTES.AUSENTE} ,
 fecha text,
 hora text,
 syncro boolean DEFAULT FALSE
 
 )`;





    public static SALAS = [
        {
            id_servidor: '345',
            nombre: 'Rosa',
            id_maestra: '99'
        },
        {
            id_servidor: '346',
            nombre: 'Azul',
            id_maestra: '100'
        }



    ]







    public static INFANTES = [
        {
            // 12','13','14','15','16','17'
            nombre_completo: "infante12",
            id: "1",
            id_sala: 1,
              foto:'default.png   '         , 
            estado: "ausente"
        },
        {
            nombre_completo: "infante13",
            id: "2",
            id_sala: 1,
              foto:'default.png   '      
   , estado: "ausente"
        },
        {
            nombre_completo: "infante14",
            id: "3",
            id_sala: 1,
            foto: 'default.png'
            , estado: "ausente"
        },
      

    ]


    public static INFO = {
        INFANTES: CONSTANTES.INFANTES,
        SALAS: CONSTANTES.SALAS
    }

    /*
    (new Date()).toISOString().substring(0, 19).replace('T', ' ')
    
    */
    public static getDate(): string {
        let fecha = new Date();
        let yyyy: string = fecha.getFullYear().toString();
        let mm: string = (fecha.getMonth() + 101).toString().slice(-2);
        let dd: string = (fecha.getDate() + 100).toString().slice(-2);
        return yyyy + mm + dd;
    }

    public static xxxx(): string {

        //  return  new Date().toLocaleString();
        let date = new Date();
        console.log('fecha', date);
        let texto = date.toISOString().substring(0, 19).replace('T', ' ');
        console.log('fecha', texto);

        // return (new Date()).toISOString().substring(0, 19).replace('T', ' ');
        return texto;
    }


    public static addZero(i: number): string {
        let response = i.toString();
        if (i < 10) {
            response = "0" + i;
        }
        return response;
    }

    public static getHora() {
        var d = new Date();

        let yyyy: string = d.getFullYear().toString();
        let mm: string = (d.getMonth() + 101).toString().slice(-2);
        let dd: string = (d.getDate() + 100).toString().slice(-2);
        var h = this.addZero(d.getHours());
        var m = this.addZero(d.getMinutes());
        var s = this.addZero(d.getSeconds());
        return yyyy + '-' + mm + '-' + dd + ' ' + h + ":" + m + ":" + s;
    }


    //pasa millisegundo to minutes
    public static pasarMillisegundos(milliseconds){
        //Get hours from milliseconds
        var hours = milliseconds / (1000*60*60);
        var absoluteHours = Math.floor(hours);
        var h = absoluteHours > 9 ? absoluteHours : '0' + absoluteHours;
      
        //Get remainder from hours and convert to minutes
        var minutes = (hours - absoluteHours) * 60;
        var absoluteMinutes = Math.floor(minutes);
        var m = absoluteMinutes > 9 ? absoluteMinutes : '0' +  absoluteMinutes;
      
        //Get remainder from minutes and convert to seconds
        var seconds = (minutes - absoluteMinutes) * 60;
        var absoluteSeconds = Math.floor(seconds);
        var s = absoluteSeconds > 9 ? absoluteSeconds : '0' + absoluteSeconds;
      
      
        return h + ':' + m + ':' + s;
      }
  


}