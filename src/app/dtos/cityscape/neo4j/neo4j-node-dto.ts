export class Neo4jNodeDTO {

  constructor(identity: number, labels:string[], properties: Neo4jNodePropertyDTO[]) {
    this.identity = identity;
    this.labels = labels;
    this.properties = properties; 
  }

  identity: number;

  labels: string[];

  properties: Neo4jNodePropertyDTO[];
}

export class Neo4jNodePropertyDTO {

  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }

  name: string;

  value: string;

}

export class Neo4jNodePositionDTO {
  
  identity: number;
  
  ngsocPosX: number;
  
  ngsocPosY: number;
}