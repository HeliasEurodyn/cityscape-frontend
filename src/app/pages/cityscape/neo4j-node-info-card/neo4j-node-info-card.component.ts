import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, EventEmitter, Output, ComponentRef } from '@angular/core';
import { Neo4jNodeDTO, Neo4jNodePropertyDTO } from 'app/dtos/cityscape/neo4j/neo4j-node-dto';
import { Neo4jService } from 'app/services/crud/cityscape/neo4j.service';
import { NotificationService } from 'app/services/system/sofia/notification.service';
import { CommandNavigatorService } from '../../../services/system/sofia/command-navigator.service';


@Component({
  selector: 'app-neo4j-node-info-card',
  templateUrl: './neo4j-node-info-card.component.html',
  styleUrls: ['./neo4j-node-info-card.component.scss']
})
export class Neo4jNodeInfoCardComponent {

  node: Neo4jNodeDTO = null;
  nodeId: number;
  nodeColor: String;
  newLabel: string = '';

  constructor(private el: ElementRef,
    private neo4jService: Neo4jService,
    private notificationService: NotificationService,
    private commandNavigatorService: CommandNavigatorService,) { }


  setNode(node: Neo4jNodeDTO) {
    this.node = JSON.parse(JSON.stringify(node));
    console.log(this.node);
    const ngsocColor = node.properties.find((obj) => obj.name == 'ngsocColor');
    console.log(ngsocColor);
    if (ngsocColor) {
      this.nodeColor = ngsocColor.value;
    } else {
      this.nodeColor = "#FF5733"
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

  updateNodeToServer(nodeId: number) {
    if (nodeId != null) {
      this.neo4jService.updateNodeById(nodeId, this.node).subscribe(
        (response: Neo4jNodeDTO) => {
          console.log('info-card-updateeeeeeee');
          this.node = response;
          this.neo4jService.notifyNodeUpdated(response);
        }
      );
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
    });
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

  openList() {
    const componentRefOnNavigation: ComponentRef<any> = this.commandNavigatorService.navigate('POPUPLIST[LOCATE:(ID=73ebafde-77c7-47e5-8f6c-82891c5d9c23),RETURN:cf_cpe_name,FOCUS:header-filter-cf_cpe_name,DISPLAY:(asset.detailed_cpe)]');
    componentRefOnNavigation.instance.setPresetCommand('POPUPLIST[LOCATE:(ID=73ebafde-77c7-47e5-8f6c-82891c5d9c23),RETURN:cf_cpe_name,FOCUS:header-filter-cf_cpe_name,DISPLAY:(asset.detailed_cpe)]');
    componentRefOnNavigation.instance.selectEmmiter.subscribe((returningValues: string[]) => {
      console.log(returningValues);
      console.log(returningValues['RETURN']);
    });
  }

}
