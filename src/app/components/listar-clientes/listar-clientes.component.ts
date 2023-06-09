import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Cliente } from 'src/app/models/cliente'
import { ClienteService } from 'src/app/services/cliente.service';


@Component({
  selector: 'app-listar-clientes',
  templateUrl: './listar-clientes.component.html',
  styleUrls: ['./listar-clientes.component.css'],
})
export class ClienteComponent {
  listClientes: Cliente[] = []
  fecha=new Date().getTime();
  idDelete: string;
  condicionDeudor=true
 

  displayedColumns: string[] = ['nombre', 'apellido','ciudad','fechaLicencia','deudaLicencia','acciones'];
  dataSource!: MatTableDataSource<Cliente>;

  hayLicenciasAlLimite: boolean= false;
  public showConfirmationDialog = false;
  private paginator: MatPaginator; 
  private sort: MatSort;

    

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();


}

@ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
  this.paginator = mp;
  this.paginator._intl.itemsPerPageLabel='Clientes por Página'
  this.paginator._intl.firstPageLabel="Primera Página"
  this.paginator._intl.previousPageLabel="Página Anterior"
  this.paginator._intl.nextPageLabel='Siguiente Página'
  this.paginator._intl.lastPageLabel="Última Página"
  this.setDataSourceAttributes();
}

setDataSourceAttributes() {
  this.dataSource.paginator = this.paginator;
  this.dataSource.sort = this.sort;
  }


  constructor(private _clienteService: ClienteService, private _snackBar: MatSnackBar
    ) {
    this.dataSource = new MatTableDataSource(this.listClientes);
  }

  ngOnInit() {
      this.cargarCliente()
      this.hayLicenciasAlLimite=false;
  }

  ngAfterViewInit() {

  }

applyFilter(event: Event) {
 const filterValue = (event.target as HTMLInputElement).value;
 this.dataSource.filter = filterValue.trim().toLowerCase()
}


   cargarCliente() {
    this._clienteService.getClients().subscribe(doc=>{
      this.listClientes=[]
      this.dataSource = new MatTableDataSource(this.listClientes)
      this.hayLicenciasAlLimite=false 
      doc.forEach((element: any) => {
        this.listClientes.push({
          id: element.payload.doc.id,
          ... element.payload.doc.data()
        })
      });
    })
  }


eliminarCliente(id: any){
  this.showConfirmationDialog = true;
  this.idDelete = id;
  }
confirm(){
  this._clienteService.deleteClient(this.idDelete).then(()=>{
    this._snackBar.open('El cliente ha sido eliminado correctamente', '', {
            duration: 1500,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
          })
        }, error => {
          console.log(error)
        });
        //  if (this.listClientes=[]){
        //   this.hayLicenciasAlLimite= false;
        //  } 
        this.showConfirmationDialog=false
        this.hayLicenciasAlLimite= false;
        this.paginator.length=this.paginator.length-1
        
      }

      cancel() {
        // Lógica para cancelar la acción
        this.showConfirmationDialog = false;
      }

      detalleCliente(id: any){
    
      }

      calcularDiferencia(date: Date): string {
        const currentDate = new Date();
        const inputDate = new Date(date);
        const currentTimestamp = currentDate.getTime();
        const inputTimestamp = inputDate.getTime();
        const difference =   inputTimestamp-currentTimestamp;
        const differenceInDays = Math.floor(difference / (1000 * 60 * 60 * 24));
        let dia = (Math.floor(differenceInDays))
        if(dia < 31){
          this.hayLicenciasAlLimite = true  
        }
        if (dia < (-180)){
          return '#FF4D4D'
        }
        else if(dia < 0){
          return '#FF884D'
        } else if(dia < 16){
          return '#FFDD33'
        }else if(dia < 31){
          return '#FFFF66'
        } else {
          // this.hayLicenciasAlLimite = false;
          return 'white'
        }
      }
      // confirm(){
      //   this.hayLicenciasAlLimite = false;
      // }

      formatoFecha(date: Date): string {
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString();
        return `${day}/${month}/${year}`;
      }

      deudor(){
        return this.condicionDeudor? 'red':'green'
      }
}

