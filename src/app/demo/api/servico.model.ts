interface InventoryStatus {
    label: string;
    value: string;
}
export interface Servico {
    id?: string;  
    key?: string;          
    name?: string;           
    cor?: string;            
    idade?: number;          
    sexo?: 'Masculino' | 'Feminino' | 'Outro'; 
    species?: string;         
    nascimento?: Date;       
    peso?: number;           
}
