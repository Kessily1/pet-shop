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
    cep?: any;              
    estado?: any;           
    municipio?: any;           
    municipios?: any[]; // Adiciona uma nova propriedade para possíveis municípios
    cpf?: string; 
    sexo?: 'Masculino' | 'Feminino' | 'Outro'

}