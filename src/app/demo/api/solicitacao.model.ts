interface InventoryStatus {
    label: string;
    value: string;
}

interface Pet {
    // Define the properties of the Pet interface
    id?: string;
    name?: string;
    // Add other properties as needed
}

export interface solicitacao {
    id?: string;
  key?: string;
  Pet?: Pet;  
  tutor?: string;
  servico?: string;
  dataSolicitacao?: Date;
  nome?: string;
}