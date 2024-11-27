interface InventoryStatus {
    label: string;
    value: string;
}
export interface tutor {
    id?: string;
    key?: string;
    logradouro?: string;
    uf?: string;
    name?: string;            
    nascimento?: string;       
    telefone?: string;         
    cep?: string;              
    estado?: string;           
    municipio?: string;           
    cpf?: string; 
    sexo?: 'Masculino' | 'Feminino' | 'Outro'

}