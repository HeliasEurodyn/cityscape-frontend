export class Neo4jRelationshipDTO {

  constructor(identity: number, start:number, end:number, type:string, properties: Neo4jRelationshipPropertyDTO[]) {
    this.identity = identity;
    this.start = start;
    this.end = end;
    this.type = type;
    this.properties = properties;
  }

  identity: number;

  start: number;

  end: number;

  type: string;

  properties: Neo4jRelationshipPropertyDTO[];
}

export class Neo4jRelationshipPropertyDTO {

  constructor(name: string, value: string) {
    this.name = name;
    this.value = value;
  }

  name: string;

  value: string;
}