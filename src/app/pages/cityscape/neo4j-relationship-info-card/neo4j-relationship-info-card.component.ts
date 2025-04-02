import { Component } from '@angular/core';
import { Neo4jRelationshipDTO, Neo4jRelationshipPropertyDTO } from 'app/dtos/cityscape/neo4j/neo4j-relationship-dto';
import { Neo4jService } from 'app/services/crud/cityscape/neo4j.service';

@Component({
  selector: 'app-neo4j-relationship-info-card',
  templateUrl: './neo4j-relationship-info-card.component.html',
  styleUrls: ['./neo4j-relationship-info-card.component.scss']
})
export class Neo4jRelationshipInfoCardComponent {

  relationship: Neo4jRelationshipDTO = null;

  constructor(private neo4jService: Neo4jService) { }


  setRelationship(relationship: Neo4jRelationshipDTO) {
    this.relationship = JSON.parse(JSON.stringify(relationship));
  }

  createRelationshipToServer() {
    if (this.relationship != null) {
      this.neo4jService.createRelationship(this.relationship).subscribe(
        (response: Neo4jRelationshipDTO) => {
          this.relationship = response;
          this.neo4jService.notifyRelationshipCreated(response)
        }
      );
    }
  }

  updateRelationshipToServer() {
    this.neo4jService.updateRelationshipById(this.relationship.identity, this.relationship).subscribe(
      (response: Neo4jRelationshipDTO) => {
        this.relationship = response;
        this.neo4jService.notifyRelationshipUpdated(response)
      }
    );
  }

  deleteRelationship(relationshipId: number) {
    this.neo4jService.deleteRelationshipById(relationshipId).subscribe(
      {
        next: () => {
          this.neo4jService.notifyRelationshipDeleted(relationshipId); // Notify other components
        }
      }

    );
  }

  addRelationshipProperty() {
    this.relationship.properties.push(new Neo4jRelationshipPropertyDTO('', ''));
  }

  deleteRelationshipProperty(index) {
    this.relationship.properties.splice(index, 1);
  }

}
