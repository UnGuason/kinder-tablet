export class Infante{


    
    public nombre_completo:string;
    public id:string;
    public estado:string;
    public id_sala:number;
    public foto:string;
    constructor(_nombre_completo:string,_id:string,estado?:string,_foto?:string){
        this.nombre_completo=_nombre_completo;
        this.id=_id;
        this.estado=estado;
        this.foto=_foto;


    }
}