export class CompletedRmtTaskDTO {

    constructor(uuid: string, modified_on: string, risk_assessment_id: number) {
      this.uuid = uuid;
      this.modified_on = modified_on;
      this.risk_assessment_id = risk_assessment_id; 
    }

    uuid: string;

    modified_on: string;

    risk_assessment_id: number;
  
  }
  