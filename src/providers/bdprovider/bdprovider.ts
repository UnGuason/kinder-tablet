import { CONSTANTES } from './../../app/clases/constantes';
import { Injectable } from '@angular/core';
import { Notificaciones } from './../../app/clases/notificaciones';
import { Platform } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Infante } from './../../app/clases/infante';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { RemotoProvider } from './../remoto/remoto';
@Injectable()
export class BdproviderProvider {
  private Listainfantes: Observable<Array<Infante>>;
  private currentDate: string = "";
  private dateStorage: string = "";


 
  public text: string = "";
  public db = null;
  public arr = [];

  constructor(private sqlite: SQLite,
    private platform: Platform, private servRemot: RemotoProvider
  ) {
    this.dateStorage = localStorage.getItem('fecha');
    this.currentDate = CONSTANTES.getDate();
    let version: string = localStorage.getItem('version');
    if (version != CONSTANTES.VERSION && platform.is('android')) {
      this.sqlite.create({
        name: CONSTANTES.nombreDb,
        location: 'default'
      }).then((db: SQLiteObject) => {

        db.executeSql('DROP TABLE  IF EXISTS sala', {})
        db.executeSql('DROP TABLE  IF EXISTS infantes', {})
        db.executeSql('DROP TABLE  IF EXISTS notificaciones', {})
        db.executeSql(CONSTANTES.sqlTablaSala, {})
        db.executeSql(CONSTANTES.sqlTablaInfantes, {})
        db.executeSql(CONSTANTES.sqlTablaNotificaciones, {})
          .then(() => console.log('creacion de tablas'))
          .catch((e) => console.error('crear notificaciones', e));
        localStorage.setItem("version", CONSTANTES.VERSION);
      })
        .catch(e => console.log(e));

    }



    this.sync();


  }





  public refresh2(): Observable<any> {
    let indices_update: number[] = [];
    let indices_nuevos: number[] = [];
    let inddices_delete_local: number[] = [];
    let seEncuentra: boolean = false;
    let infantes_local: Infante[] = []
    let infantes_remoto: any[] = [];

    return new Observable(observer => {
      this.servRemot.iniciar().subscribe(data => {
        console.log(data);
        if (data.error) { 
          return null;
        }
        //se recibio la data
        infantes_remoto = data.infantes;
        localStorage.setItem('correo', data.maestra.correo);
        localStorage.setItem('nombre', data.maestra.nombre_completo);
        localStorage.setItem('nombre_sala',data.sala.nombre );
        localStorage.setItem('color',data.sala.color );
        
        /////////////////
        //        peticcion a la base de datos local
        this.sqlite.create({
          name: CONSTANTES.nombreDb,
          location: 'default'
        }).then((db: SQLiteObject) => {
          let query = `SELECT id,nombre,foto FROM infantes`  //trae todos los id y nombres de la tabla
          db.executeSql(query, []).then((data) => {
            if (data.rows.length > 0) {
              for (let i = 0; i < data.rows.length; i++) { //recorre el cursor respuesta de la bd

                let infante = new Infante(data.rows.item(i).nombre, data.rows.item(i).id, 'estado', data.rows.item(i).foto); //crea un nuevo objeto infante ,con nombre documento y estado

                infantes_local.push(infante);


              }

            }
          }
          ).catch(error => {
            console.log('error en consulta traer infantes con estado', error)
          }).then(() => {
            //infante local tiene tods los infantes de la tablet

            //              recorro el array de infantes remotods
            for (var index = 0; index < infantes_remoto.length; index++) {

              var remoto = infantes_remoto[index];
              for (let local of infantes_local) {

                seEncuentra = false;
                //comparo los campos
                if (remoto.id === local.id) {
                  //lo encutnra comparo los campos
                  if (remoto.foto != local.foto) {
                    indices_update.push(index);
                    observer.next('se necesita actualizar');

                  }


                  seEncuentra = true;
                  break;


                } else {
                  seEncuentra = false;
                }

              }
              if (!seEncuentra) {
                indices_nuevos.push(index);
              }



            }
            //compara la bd local con la remota para ver si se elimino alguna infante
            for (var indices = 0; indices < infantes_local.length; indices++) {
              let existe = false;

              var local = infantes_local[indices];
              for (var index = 0; index < infantes_remoto.length; index++) {
                var remoto = infantes_remoto[index];
                if (local.id === remoto.id) {
                  existe = true;
                  break;
                } else {
                  existe = false;
                }



              }
              if (!existe) {
                console.log('borrar');
                inddices_delete_local.push(indices);
              }



            }

            for (var index = 0; index < inddices_delete_local.length; index++) {
              var element = inddices_delete_local[index];
              this.deleteInfante(infantes_local[element]).then(data => observer.next('elimino ')

                , error => {
                  console.log(error);
                })
            }
            for (var index = 0; index < indices_update.length; index++) {
              var element = indices_update[index];
              let item = infantes_remoto[element];
              this.updateFoto(item).then(data => {
                observer.next('respuesta update');

              }).catch(error => {
                console.log(error);
              })



            }
            for (var index = 0; index < indices_nuevos.length; index++) {
              var element = indices_nuevos[index];
              let item = infantes_remoto[element];
              this.insertInfante(item).then(data => {
                console.log('nuevo infante', data);
                observer.next('respuesta insert');


              }).catch(error => {
                console.log(error);
              })



            }
            observer.complete();


          })
        }).catch(error => console.error(error)).then(datta => {
          //update array






        })













      })

    })
  }

  public deleteInfante(infante: any) {
    return new Promise<any>((resolve, reject) => {
      this.sqlite.create({
        name: CONSTANTES.nombreDb,
        location: 'default'
      }).then((db: SQLiteObject) => {
        console.log('notificacion a enviar ', );



        let query = ` DELETE FROM infantes WHERE id = '${infante.id}' `;
        db.executeSql(query, []).then((data) => {
          console.log(data);

        }
        ).catch(error => {
          console.error('erro en setear presente', error);
          reject(error);
        });
        let query2 = ` DELETE FROM notificaciones WHERE id_infante = '${infante.id}' `;
        db.executeSql(query2, []).then((data) => {
          console.log(data);
          resolve(null);

        }
        ).catch(error => {
          console.error('erro en setear presente', error);
          reject(error);
        });

      }).catch(error => console.error(error));

    })



  }
  //actualiza la foto
  public updateFoto(infante: any) {
    return new Promise<any>((resolve, reject) => {
      this.sqlite.create({
        name: CONSTANTES.nombreDb,
        location: 'default'
      }).then((db: SQLiteObject) => {
        console.log('notificacion a enviar ', );



        let query = ` UPDATE infantes SET  foto = '${infante.foto}' WHERE id = '${infante.id}' `;
        db.executeSql(query, []).then((data) => {
          console.log(data);
          resolve(null);

        }
        ).catch(error => {
          console.error('erro en setear presente', error);
          reject(error);
        });
      }).catch(error => console.error(error));

    })


  }
  public insertInfante(infante: any) {
    return new Promise<any>((resolve, reject) => {
      this.sqlite.create({
        name: CONSTANTES.nombreDb,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT OR IGNORE INTO infantes (id,nombre,sala,foto) VALUES (?,?,?,?)', [infante.id, infante.nombre_completo, infante.id_sala, infante.foto])
          .then((data) => {
            console.log('inserccion infantes', data);
            localStorage.setItem(infante.id, CONSTANTES.AUSENTE);
            resolve(data);
          })
          .catch(e => {
            console.log('error insert');
            reject(e);
          });


      })
        .catch(e => console.log(e));

    })

  }


  public sync() {
    //peticion al servidor
    this.servRemot.iniciar().subscribe(data => {
      if (data.error) {
        console.error('data');
        return null;
      }
      console.error(data);
      

      let sala= data.sala;
      let nombre = sala.nombre;
      let id = sala.id;
      let color = sala.color;
      let id_maestra = 3;
      let maestra = data.maestra;
      localStorage.setItem('correo', data.maestra.correo);
      localStorage.setItem('nombre', data.maestra.nombre_completo);
      localStorage.setItem('nombre_sala', data.sala.nombre);
      


      this.sqlite.create({
        name: CONSTANTES.nombreDb,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT OR IGNORE INTO sala (id,nombre,id_maestra,color) VALUES (?,?,?,?)', [id, nombre, id_maestra, color])
          .then((data) => console.log('insert sala', data))
          .catch(e => console.error('insert sala ', e));

      })
        .catch(e => console.log(e));



      for (let item of data.infantes) {
        let fecha: string = CONSTANTES.getDate();
        let hora: string = CONSTANTES.getHora();

        this.sqlite.create({
          name: CONSTANTES.nombreDb,
          location: 'default'
        }).then((db: SQLiteObject) => {
          db.executeSql('INSERT OR IGNORE INTO infantes (id,nombre,sala,foto) VALUES (?,?,?,?)', [item.id, item.nombre_completo, item.id_sala, item.foto])
            // db.executeSql('INSERT INTO notificaciones (documento,fecha,hora) VALUES (?,?,?)', [item.documento, fecha, hora])
            .then((data) => console.log('inserccion infantes', data))
            .catch(e => console.error('insert infantes', e));


        })
          .catch(e => console.log(e));

      }





    })






  }
  // devuelve la tabla que recibe como parametro
  public getBD(tabla: string): Observable<string> {
    return new Observable(observer => {
      this.sqlite.create({
        name: CONSTANTES.nombreDb,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql(`SELECT * FROM  ${tabla} `, [])
          .then((data) => {

            console.log(data.rows.length);

            let texto: string = '';
            var listaa: Array<Object>;

            if (data.rows.length > 0) {
              let lista: string[] = [];
              for (let i = 0; i < data.rows.length; i++) {

                lista.push(JSON.stringify(data.rows.item(i)));
                // personList.push({
                //     "id": data.res.rows.item(i).id,
                //     "firstname": data.res.rows.item(i).firstname,
                //     "lastname": data.res.rows.item(i).lastname,
                // });
                texto = texto + JSON.stringify(data.rows.item(i));

              }
              observer.next(texto);


            }
            //          
          }
          )
          .catch(e => console.error('error select ', e));

      })
        .catch(e => console.log(e));
    })
  }


  public setNotificationsAusente(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: CONSTANTES.nombreDb,
        location: 'default'
      }).then((db: SQLiteObject) => {
        let query = 'SELECT id FROM infantes';//trae todos los documentos
        db.executeSql(query, []).then((data) => {
          if (data.rows.length > 0) {
            let dni = '';
            for (let i = 0; i < data.rows.length; i++) {
              dni = data.rows.item(i).id;
              this.setAusente(dni, this.currentDate, 'null');//ingresa un nuevo registro ingreso ausente  
              console.log('id', dni);                 // y guarda en local storage el estado Ausente

            }
            localStorage.setItem('fecha', this.currentDate);   //al finalizar guarda la fecha actual en el día 

            resolve(true);

          }
        }).catch(error => {
          reject(error);
          console.log(error)
        });
      }).catch(error => console.error(error));
    });

  }


  //esta función ingresa un nuevo registro con la fecha del dia e ingreso ausente
  // también guarda en local storage (documento, ausente)
  private setAusente(id: string, fecha: string, hora: string) {

    this.sqlite.create({
      name: CONSTANTES.nombreDb,
      location: 'default'
    }).then((db: SQLiteObject) => {
      let query = 'INSERT INTO notificaciones (id_infante,fecha,hora) VALUES(?,?,?)'
      db.executeSql(query, [id, fecha, hora]).then((data) => {
        localStorage.setItem(id, CONSTANTES.AUSENTE);



        console.log('insert notificacion', data)
      }).catch(error => {
        console.log('error en insert notification', error)
      });
    }).catch(error => console.error(error));

  }
  private pruebaAusente(id: string, fecha: string): Promise<string> {

    return new Promise((resolve, reject) => {
      let dni;

      this.sqlite.create({
        name: CONSTANTES.nombreDb,
        location: 'default'
      }).then((db: SQLiteObject) => {
        let query = 'Select * from notificaciones where id_infante = ? and fecha = ? and tipo = ? and cantidad = ?'
        db.executeSql(query, [id, fecha, 'ingreso', 'ausente']).then((data) => {
          console.log('query', query)
          if (data.rows.length > 0) {
            dni = data.rows.item(0).id;
            console.log('respuesta ', dni);

            resolve(dni);
          }





        }).catch(error => {
          reject(error);
          console.log('error en insert notification', error)
        });
      }).catch(error => console.error(error));

    })


  }





  public traerInfantes(): Observable<Infante> {//funcion que devuelve un array de infantes , con el estado
    return new Observable(observable => {
      if (!this.platform.is('android')) {//si la plataforma es diferente a android
        for (let item of CONSTANTES.INFO.INFANTES) {//recorre el array infantes que esta guardado en la clase constantes
          let estado = 'qwe';
          let infante = new Infante(item.nombre_completo, item.id, estado, item.foto);
          observable.next(infante);


        }
        observable.complete();
        return;

      } //si es plataforma android
      this.sqlite.create({
        name: CONSTANTES.nombreDb,
        location: 'default'
      }).then((db: SQLiteObject) => {
        let query = `SELECT id,nombre,foto FROM infantes`  //trae todos los documentos y nombres de la tabla
        db.executeSql(query, []).then((data) => {
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) { //recorre el cursor respuesta de la bd




              let estado = localStorage.getItem(data.rows.item(i).id.toString());// trae el estado del infante

              let infante = new Infante(data.rows.item(i).nombre, data.rows.item(i).id, estado, data.rows.item(i).foto); //crea un nuevo objeto infante ,con nombre documento y estado
              observable.next(infante);
              console.log(data.rows.item(i).foto);
            }
            observable.complete();

          }
        }
        ).catch(error => {
          console.log('error en consulta traer infantes con estado', error)
        });
      }).catch(error => console.error(error));
    })
  }

  //cambia el estado de ausente a presente para el infante con el dni pasado como parametro
  public setPresente(notificacion: Notificaciones) {
    this.pruebaAusente(notificacion.id_infante, notificacion.fecha).then(id =>
      notificacion.id = id).catch(error => {
        console.log(error);
      })
    this.sqlite.create({
      name: CONSTANTES.nombreDb,
      location: 'default'
    }).then((db: SQLiteObject) => {
      console.log('notificacion a enviar ', notificacion);



      let query = ` UPDATE notificaciones SET  hora = '${notificacion.hora}' ,  cantidad = '${notificacion.cantidad}'
      WHERE id_infante = '${notificacion.id_infante}' AND tipo = '${CONSTANTES.TIPO_INGRESO}' AND fecha =  '${notificacion.fecha}' `;
      db.executeSql(query, []).then((data) => {
        //  localStorage.setItem(insertId)


        localStorage.setItem(notificacion.id_infante, CONSTANTES.PRESENTE.toString());
        this.servRemot.sendNotifcation(notificacion).then(id => {
          this.updateSyncro(id);
        })

      }
      ).catch(error => {
        console.error('erro en setear presente', error)
      });
    }).catch(error => console.error(error));


  }
  public InsertInfante(infante: Infante) {
    if (this.platform.is('android')) {
      this.sqlite.create({
        name: CONSTANTES.nombreDb,
        location: 'default'
      }).then((db: SQLiteObject) => {
        db.executeSql('INSERT OR IGNORE INTO infantes (id,nombre,sala) VALUES (?,?,?)', [infante.id, infante.nombre_completo, '2'])
          // db.executeSql('INSERT INTO notificaciones (documento,fecha,hora) VALUES (?,?,?)', [item.documento, fecha, hora])
          .then((data) => console.log('inserccion infantes', data))
          .catch(e => console.error('insert infantes', e));



      })
        .catch(e => console.log(e));


    }
  }

  //update syncro a true cuando se inserta en el web service
  public updateSyncro(id: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: CONSTANTES.nombreDb,
        location: 'default'
      }).then((db: SQLiteObject) => {
        return db.executeSql(`UPDATE notificaciones SET syncro = 1 WHERE id = '${id}' `, [])
          .then((data) => {
            console.log('update syncro', data);
            resolve(data);


          }).catch(e => {
            console.error('update syncro', e);
            reject(e)
          });
      })
        .catch(e => {
          reject(e);

        });
    });
  }

  //guarda la notificacion
  public InsertNotificacion(notificacion: Notificaciones): Promise<any> {
    //si se va a dormir guardo la hora 
  if(notificacion.tipo == CONSTANTES.TIPO_DESCANSO && notificacion.cantidad ==CONSTANTES.DESCANSO_INICIO){
   let aux= notificacion.id_infante+notificacion.tipo;
    localStorage.setItem(aux,notificacion.hora);
     
  }
  //si se despierta calculo cuanto durmio
  if(notificacion.tipo == CONSTANTES.TIPO_DESCANSO && notificacion.cantidad ==CONSTANTES.DESCANSO_FINAL){
    let aux= notificacion.id_infante+notificacion.tipo;
    let inicio= localStorage.getItem(aux);
    let despierta = notificacion.hora;
    var time = new Date(despierta).getTime() - new Date(inicio).getTime();
   let desanso=CONSTANTES.pasarMillisegundos(time);
     console.log('time',desanso); 
     notificacion.cantidad= desanso;
      
   }
    return new Promise((resolve, reject) => {
      this.sqlite.create({
        name: CONSTANTES.nombreDb,
        location: 'default'
      }).then((db: SQLiteObject) => {
        return db.executeSql('INSERT INTO notificaciones (id_infante,tipo,cantidad,fecha,hora) VALUES (?,?,?,?,?)', [

          notificacion.id_infante,
          notificacion.tipo,
          notificacion.cantidad,
          notificacion.fecha,
          notificacion.hora])
          .then((data) => {
            console.log('inserccion notificacion', data);
            notificacion.id = data.insertId;
            console.log('íd after insertt', notificacion.id)
            this.servRemot.sendNotifcation(notificacion).then(id => {
              this.updateSyncro(id);
            })
            this.setearEstado(notificacion);

            resolve(data);


          }).catch(e => {
            console.error('insert notificacion', e);
            reject(e)
          });
      })
        .catch(e => {
          reject(e);

        });
    });
  }

  //Asigna el estado del infante --- dormido , no ingreso  o retirado
  private setearEstado(notificacion: Notificaciones) {

    if (notificacion.tipo == CONSTANTES.TIPO_DESCANSO && notificacion.cantidad === CONSTANTES.DESCANSO_INICIO) {
      localStorage.setItem(notificacion.id_infante, CONSTANTES.DESCANSO_INICIO)

    } else if (notificacion.tipo == CONSTANTES.TIPO_DESCANSO && notificacion.cantidad !=  CONSTANTES.DESCANSO_INICIO) {
      localStorage.setItem(notificacion.id_infante, CONSTANTES.PRESENTE.toString());
    } else if (notificacion.tipo == CONSTANTES.TIPO_SALIDA) {
      localStorage.setItem(notificacion.id_infante, CONSTANTES.TIPO_SALIDA.toString());

    }


  }
  public traerNotificaciones(id_infante:string): Observable<Notificaciones> {//funcion que devuelve notificaciones por id de infante
    return new Observable(observable => {
      if (!this.platform.is('android')) {//si la plataforma es diferente a android
        for (let item of CONSTANTES.INFO.INFANTES) {//recorre el array infantes que esta guardado en la clase constantes
          let estado = 'qwe';
          let infante = new Infante(item.nombre_completo, item.id, estado, item.foto);


        }
        observable.complete();
        return;

      } //si es plataforma android
      this.sqlite.create({
        name: CONSTANTES.nombreDb,
        location: 'default'
      }).then((db: SQLiteObject) => {
  /*
   public id_infante:string;
    public tipo:string;
    public cantidad:string;
    public fecha:string;
    public hora:string;
    public id:string;
  */
        let query = `SELECT id_infante,tipo,cantidad,fecha,hora FROM notificaciones where id_infante = '${id_infante}' `  //select a notificaciones
        db.executeSql(query, []).then((data) => {
          if (data.rows.length > 0) {
            for (let i = 0; i < data.rows.length; i++) { //recorre el cursor respuesta de la bd

              let notificacion = new Notificaciones(data.rows.item(i).id_infante,
               data.rows.item(i).tipo,
              data.rows.item(i).cantidad,
               data.rows.item(i).fecha, 
               data.rows.item(i).hora); //crea un nuevo objeto infante ,con nombre documento y estado
               observable.next(notificacion);
            }
            observable.complete();

          }
        }
        ).catch(error => {
          console.log('error en consulta traer notificaciones', error)
        });
      }).catch(error => console.error(error));
    })
  }











}
