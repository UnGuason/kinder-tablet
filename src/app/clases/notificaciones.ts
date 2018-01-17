export class Notificaciones{
/*
 public static sqlTablaNotificaciones=`create table notificaciones(
 documento integer,
 tipo integer DEFAULT ${CONSTANTES.INGRESO},
 cantidad integer DEFAULT ${CONSTANTES.AUSENTE} ,
 fecha text,
 hora text,
 syncro boolean DEFAULT FALSE
*/

    
    public id_infante:string;
    public tipo:string;
    public cantidad:string;
    public fecha:string;
    public hora:string;
    public id:string;
    constructor(_id_infante:string,_tipo:string,_cantidad:string,_fecha:string,_hora:string){
        this.id_infante=_id_infante;
        this.cantidad=_cantidad;
        this.fecha=_fecha;
        this.hora=_hora;
        this.tipo=_tipo;


    }
}