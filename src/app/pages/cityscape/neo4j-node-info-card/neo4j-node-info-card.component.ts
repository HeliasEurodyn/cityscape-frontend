import { HttpErrorResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Neo4jNodeDTO, Neo4jNodePropertyDTO } from 'app/dtos/cityscape/neo4j/neo4j-node-dto';
import { HttpError } from 'app/dtos/sofia/http/http-error';
import { Neo4jService } from 'app/services/crud/cityscape/neo4j.service';
import { NotificationService } from 'app/services/system/sofia/notification.service';
import * as e from 'express';


@Component({
  selector: 'app-neo4j-node-info-card',
  templateUrl: './neo4j-node-info-card.component.html',
  styleUrls: ['./neo4j-node-info-card.component.scss']
})
export class Neo4jNodeInfoCardComponent implements OnInit {
  @Output() nodeUpdatedEmmiter: EventEmitter<Neo4jNodeDTO> = new EventEmitter<Neo4jNodeDTO>();

  // private modalElement: HTMLElement | null = null;

  node: Neo4jNodeDTO = null;
  nodeId: number;
  nodeColor: String;
  newLabel: string = '';

  constructor(private el: ElementRef, private neo4jService: Neo4jService, private notificationService: NotificationService) { }

  ngOnInit(): void {
  }

  loadNodeFromServer(nodeId: number) {
    this.nodeId = nodeId;
    this.neo4jService.getNodeById(this.nodeId).subscribe(
      (response: any) => {
        this.node = response;
        const ngsocColor = this.node.properties.find((obj) => obj.name == 'ngsocColor')
        if (ngsocColor) {
          this.nodeColor = ngsocColor.value;
        } else {
          this.nodeColor = '#FF5733';
        }
      },
      (error) => {
        console.error('Error receiving data', error);
      }
    )
  }

  setNode(node: Neo4jNodeDTO) {
    this.node = node;
    const ngsocColor = node.properties.find((obj) => obj.name == 'ngsocColor');
    if (ngsocColor) {
      this.nodeColor = ngsocColor.value;
    }
  }

  createNodeToServer() {
    if (this.node != null) {
      this.neo4jService.createNode(this.node).subscribe(
        (response: Neo4jNodeDTO) => {
          this.node = response;
          this.neo4jService.notifyNodeCreated(response)
        }
      );
    }
  }

  saveNode(nodeId: number) {
    if (nodeId != null) {
      this.neo4jService.updateNodeById(nodeId, this.node).subscribe(
        (response: Neo4jNodeDTO) => {
          this.nodeUpdatedEmmiter.emit(response);
        }
      );
      return this.node;
    } else {
      this.neo4jService.createNode(this.node).subscribe(

      )
    }

  }

  deleteNode(nodeId: number) {
    this.neo4jService.deleteNodeById(nodeId).subscribe({
      next: () => {
        console.log(nodeId);
        this.neo4jService.notifyNodeDeleted(nodeId); // Notify other components
      },
      error: (response: HttpErrorResponse) => {
        this.notificationService.showNotification('top', 'center', 'alert-danger', 'fa-thumbs-down', response?.error?.message);
      }
    }

    );
  }

  addNodeProperty() {
    this.node.properties.push(new Neo4jNodePropertyDTO('', ''));
  }

  deleteNodeProperty(index) {
    this.node.properties.splice(index, 1);
  }

  changeColor(event: any): void {
    const color = event.target.value;
    const ngsocColor = this.node.properties.find((obj) => obj.name == 'ngsocColor')
    if (ngsocColor) {
      ngsocColor.value = color;
    } else {
      this.node.properties.push(new Neo4jNodePropertyDTO('ngsocColor', color));
    }
  }

  addNodeLabel() {
    if (this.newLabel.trim()) {
      this.node.labels.push(this.newLabel);
      this.newLabel = '';
    }
  }

  deleteNodeLabel(index: number) {
    this.node.labels.splice(index, 1);
  }

}
