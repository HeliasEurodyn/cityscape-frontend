import { Component, ElementRef, ViewChild } from '@angular/core';
import { Neo4jNodeDTO, Neo4jNodePositionDTO, Neo4jNodePropertyDTO } from 'app/dtos/cityscape/neo4j/neo4j-node-dto';
import { Neo4jRelationshipDTO } from 'app/dtos/cityscape/neo4j/neo4j-relationship-dto';
import { Neo4jService } from 'app/services/crud/cityscape/neo4j.service';
import cytoscape from 'cytoscape';
// import { cytoscape_ } from 'cytoscape-node-html-label';
import { Neo4jNodeInfoCardComponent } from '../neo4j-node-info-card/neo4j-node-info-card.component';
import { Subscription } from 'rxjs';
import { Neo4jRelationshipInfoCardComponent } from '../neo4j-relationship-info-card/neo4j-relationship-info-card.component';


// cytoscape.use(cytoscape_);

@Component({
  selector: 'app-neo4j-graph',
  templateUrl: './neo4j-graph.component.html',
  styleUrls: ['./neo4j-graph.component.scss']
})
export class Neo4jGraphComponent {

  cy: any;
  nodes: Neo4jNodeDTO[] = [];
  nodesPosition: Neo4jNodePositionDTO[] = [];
  relationships: Neo4jRelationshipDTO[] = [];
  graphElements: any;
  infoCardVisibility = false;
  infoCardState = 'none';

  selectedCytoElement: any;
  hoveredCytoElement: any;

  sourceCytoElement: any;
  targetCytoElement: any;

  isVisible = false;
  position = { x: 0, y: 0 };

  relationshipBtn: any;


  private nodeCreationSubscription!: Subscription;
  private nodeUpdateSubscription!: Subscription;
  private nodeDeletionSubscription!: Subscription;
  private relationshipCreationSubscription!: Subscription;
  private relationshipUpdateSubscription!: Subscription;
  private relationshipDeletionSubscription!: Subscription;


  @ViewChild('neo4jContainer', { static: false }) neo4jContainer!: ElementRef;
  @ViewChild('nodeInfoCard') nodeCard!: Neo4jNodeInfoCardComponent;
  @ViewChild('relationshipInfoCard') relationshipCard!: Neo4jRelationshipInfoCardComponent;
  @ViewChild('createRelaionshipButton') actionButton!: ElementRef<HTMLButtonElement>;

  constructor(private neo4jService: Neo4jService) { }

  ngOnInit() {
    this.loadNodesAndRelationshipsFromServer();

    this.nodeCreationSubscription = this.neo4jService.nodeCreated$.subscribe(node => {
      this.handleNodeCreation(node);
    });
    this.nodeUpdateSubscription = this.neo4jService.nodeUpdated$.subscribe(node => {
      this.handleNodeUpdate(node);
    });
    this.nodeDeletionSubscription = this.neo4jService.nodeDeleted$.subscribe(() => {
      this.handleNodeDeletion();
    });
    this.relationshipCreationSubscription = this.neo4jService.relationshipCreated$.subscribe(relationship => {
      this.handleRelationshipCreation(relationship);
    });
    this.relationshipUpdateSubscription = this.neo4jService.relationshipUpdated$.subscribe(relationship => {
      this.handleRelationshipUpdate(relationship);
    });
    this.relationshipDeletionSubscription = this.neo4jService.relationshipDeleted$.subscribe(() => {
      this.handleRelationshipDeletion();
    });
  }

  loadNodesAndRelationshipsFromServer() {
    this.neo4jService.get().subscribe(
      (response: any[]) => {
        this.nodes = response["nodes"];
        this.relationships = response["relationships"];
        this.initializeGraphElements();
      },
      (error) => {
        console.error('Error receiving data', error);
      }
    )
  }


  initializeGraphElements() {
    this.graphElements = this.nodes.map((obj: Neo4jNodeDTO) => {

      const name = obj.properties.find(prop => prop.name === 'name')?.value ?? `Node ${obj.identity}`;
      const color = obj.properties.find(prop => prop.name === 'ngsocColor')?.value ?? '#FF5733';
      const posX = obj.properties.find(prop => prop.name === 'ngsocPosX')?.value ?? null;
      const posY = obj.properties.find(prop => prop.name === 'ngsocPosY')?.value ?? null;

      let style = {
        'background-color': color
      }

      // Set image to node with id = 4 (dokimastiko)
      // if (obj.identity == 4) {
      //   const imageStyle = {
      //     'background-image': './assets/img/server.png',
      //     'background-fit': 'contain',
      //     'background-clip': 'none',
      //     'background-color': '#ffffff',
      //   };
      //   style = imageStyle;
      // }

      return {
        data: {
          id: obj.identity,
          label: name,
          neo4jNode: obj
        },
        position: { x: posX, y: posY },
        style: style
      }

    });

    this.graphElements = [...this.graphElements, ...this.relationships.map((obj) => ({
      data: {
        source: obj.start,
        target: obj.end,
        label: obj.type,
        // identity: Number(obj.identity),
        neo4jRelationship: obj
      }
    }))]

    this.initializeNeo4j();
  }

  initializeNeo4j() {
    // const elements = [
    //   { data: { id: 'group1', label: 'Group 1', type: 'area' }, position: { x: 300, y: 300 }, grabbable: true },
    //   { data: { id: 'resizeTopLeft', parent: 'group1', type: 'resize' }, position: { x: 250, y: 250 } },
    //   { data: { id: 'resizeTopRight', parent: 'group1', type: 'resize' }, position: { x: 350, y: 250 } },
    //   { data: { id: 'resizeBottomLeft', parent: 'group1', type: 'resize' }, position: { x: 250, y: 350 } },
    //   { data: { id: 'resizeBottomRight', parent: 'group1', type: 'resize' }, position: { x: 350, y: 350 } },
    //   { data: { id: 1, label: 'Node 1', lat: 40.7128, lon: -74.0060, type: 'A', icon: true }, position: { x: 280, y: 280 } },
    //   { data: { id: 2, label: 'Node 2', lat: 34.0522, lon: -118.2437, type: 'B' }, position: { x: 500, y: 80 } },
    //   { data: { id: 3, label: 'Node 3', lat: 50, lon: -74.0060, type: 'A', icon: true }, position: { x: 500, y: 280 } },
    //   { data: { source: 1, target: 2, label: 'Edge 1 to 2' } }
    // ];

    // const elements = [
    //   { data: { id: 4, label: 'Node 4'}, position: { x: 300, y: 300 }},
    //   { data: { id: 1, label: 'Node 1', type: 'A', icon: true }, position: { x: 280, y: 280 } },
    //   { data: { id: 2, label: 'Node 2', type: 'B' }, position: { x: 500, y: 80 } },
    //   { data: { id: 3, label: 'Node 3', type: 'A', icon: true }, position: { x: 500, y: 280 } },
    //   { data: { source: 1, target: 2, label: 'Edge 1 to 2' } }
    // ];

    // const elements = [
    //   { data: { id: 4, label: 'Node 4'}, position: { x: 300, y: 200 }},
    //   { data: { id: 1, label: 'Node 1', type: 'A', icon: true }, position: { x: 60, y: 400 }},
    //   { data: { id: 2, label: 'Node 2', type: 'B' }},
    //   { data: { id: 3, label: 'Node 3', type: 'A', icon: true }},
    //   { data: { id: 5, label: 'Node 5', type: 'A', icon: true }},
    //   { data: { id: 6, label: 'Node 6', type: 'A', icon: true }},
    //   { data: { source: 1, target: 2, label: 'Edge 1 to 2' } }
    // ];

    this.cy = cytoscape({
      container: this.neo4jContainer.nativeElement,
      elements: this.graphElements,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'font-size': 12,
            'width': 50,
            'height': 50,
            'text-valign': 'center',
            'text-halign': 'center'
          }
        },
        {
          selector: '.highlighted',
          style: {
            'border-width': '3px',
            'border-color': '#2891e2',

            // 'shadow-blur': 20,        // Soft glow effect
            // 'shadow-color': '#0b0c0c',
            // 'shadow-opacity': 0.8,
            // 'shadow-offset-x': 0,
            // 'shadow-offset-y': 0
          }
        },
        // {
        //   selector: 'node:selected',
        //   style: {
        //     'overlay-padding': 25, // Expands the clickable area around the node
        //     'overlay-color': 'rgba(40, 145, 226, 0.3)', // Semi-transparent blue bounding box effect
        //     'overlay-opacity': 0.8
        //   }

        // },
        // {
        //   selector: 'node:selected',
        //   style: {
        //     'shadow-blur': 10,   // Soft glow effect
        //     'shadow-color': '#2891e2',
        //     'shadow-opacity': 0.8,
        //     'shadow-offset-x': 0,
        //     'shadow-offset-y': 0
        //   }
        // },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'font-size': 12,
            'target-arrow-shape': 'triangle',
            'label': 'data(label)', // Shows the label from edge data
            'text-valign': 'top',   // Align text above the edge
            'text-halign': 'center', // Center align text horizontally
            'curve-style': 'bezier'
          }
        }
      ],
      layout: {
        name: 'preset'
      },
    });

    // Lock the nodes that have a predefined position
    this.cy.nodes().forEach(node => {
      if (node.position().x && node.position().y) {
        node.lock();
      }
    });

    // Apply a secondary layout to unpositioned nodes (the locked nodes will not be affected)
    this.cy.layout({
      name: 'cose',
      seed: 42,
      animate: false,
      randomiize: false,
      gravity: 0,
      padding: 30,
      nodeOverlap: 10, // Adjust spacing
      idealEdgeLength: 80, // Space between nodes
      fit: true
    }).run();

    // Retrieve positions of unlocked nodes. Locked nodes already have fixed positions.
    this.cy.nodes().forEach(node => {
      if (!node.locked()) {
        const pos = {
          identity: Number(node.id()),
          ngsocPosX: node.position().x,
          ngsocPosY: node.position().y
        }
        this.nodesPosition.push(pos);
      }
    })

    // Send the node positions back to server
    if (this.nodesPosition.length !== 0) {
      this.neo4jService.updateNodesPositions(this.nodesPosition).subscribe(() => {
        this.nodesPosition = [];
      });
    }

    // Unlock the nodes in order to be dragable
    this.cy.nodes().forEach(node => {
      node.unlock();
    });

    this.cy.style()
      .selector('.relationshipButtonNode')
      .style({
        'width': 15,
        'height': 15
      })
      .update();


    // this.cy.layout({ name: 'preset' }).run();


    // this.cy.layout({
    //   name: 'preset',
    // }).run();


    // this.cy.nodes().on('drag', function (event) {
    //   const node = event.target;
    //   // Loop through all nodes to check for overlap
    //   this.cy.nodes().forEach(otherNode => {
    //     if (node.id() !== otherNode.id()) { // Avoid self-checking
    //       const box1 = node.boundingBox();
    //       const box2 = otherNode.boundingBox();
    //       // Simple collision detection
    //       if (
    //         box1.x1 < box2.x2 &&
    //         box1.x2 > box2.x1 &&
    //         box1.y1 < box2.y2 &&
    //         box1.y2 > box2.y1
    //       ) {
    //         // Move the node slightly to prevent overlap
    //         let directionX: number = (node.position().x - otherNode.position().x) / Math.abs(node.position().x - otherNode.position().x)
    //         let directionY: number = (node.position().y - otherNode.position().y) / Math.abs(node.position().y - otherNode.position().y)
    //         otherNode.position({
    //           x: otherNode.position().x + -2 * directionX, // Adjust the spacing
    //           y: otherNode.position().y + -2 * directionY
    //         });
    //       }
    //     }
    //   });
    // });


    // // Node mouse-over event
    // this.cy.on('mouseover', 'node', (event: any) => {
    //   // this.updateRelationshipBtnPosition(event)
    //   const node = event.target;
    //   if (node.data().id != 'add-relationship-node') {
    //     this.showRelationshipBtn(event);
    //     this.hoveredCytoElement = node;
    //   }
    // });


    // // Node mouse-out event
    // this.cy.on('mouseout', 'node', (event) => {
    //   const node = event.target;
    //   if (node.data().id != 'add-relationship-node') {
    //     this.hoveredCytoElement = null;
    //     this.relationshipBtn.remove();
    //   }

    //   // this.hideRelationshipBtn()
    // });


    // Node click event
    this.cy.on('click', 'node', (event) => {
      if (this.sourceCytoElement != null && this.targetCytoElement == null) {
        event.target.addClass('highlighted');
        this.targetCytoElement = event.target;
        const startNode = this.sourceCytoElement.data().neo4jNode;
        const endNode = this.targetCytoElement.data().neo4jNode;
        const newRelationship = new Neo4jRelationshipDTO(null, startNode.identity, endNode.identity, null, [])
        this.relationshipCard.setRelationship(newRelationship);
        this.infoCardState = 'create-relationship';
        this.infoCardVisibility = true;
        this.neo4jContainer.nativeElement.style.cursor = 'default';

      } else {
        this.clearRelationshipSelections();
        this.selectedCytoElement = event.target;
        this.selectedCytoElement.addClass('highlighted');
        this.nodeCard.setNode(this.selectedCytoElement.data().neo4jNode);
        this.infoCardVisibility = true;
        this.infoCardState = 'edit-node';
      }
    });


    // Edge click event
    this.cy.on('click', 'edge', (event) => {
      this.clearRelationshipSelections();
      this.selectedCytoElement = event.target;
      this.infoCardVisibility = true;
      this.infoCardState = 'edit-relationship';
      this.relationshipCard.setRelationship(this.selectedCytoElement.data().neo4jRelationship);
    });


    // Background click event
    this.cy.on('click', (event) => {
      if (this.infoCardState == 'none') {
        if (event.target == this.cy) {
          this.clearRelationshipSelections();
        }
      }
    });


    // Edge unselect event
    this.cy.on('unselect', 'edge', (event) => {
      if (this.infoCardState == 'edit-relationship') {
        this.selectedCytoElement.select();
      }
    })


    // Node dragging-ends event
    this.cy.on('dragfree', 'node', (event) => {
      const cytoscapeNode = event.target;
      const pos = {
        identity: Number(cytoscapeNode.id()),
        ngsocPosX: cytoscapeNode.position().x,
        ngsocPosY: cytoscapeNode.position().y
      }
      this.nodesPosition.push(pos);
      this.neo4jService.updateNodesPositions(this.nodesPosition).subscribe(() => {
        this.nodesPosition = [];
      });
    });


    // this.cy.on('drag', 'node', (event) => {
    //   this.updateRelationshipBtnPosition(event);
    // })


    // Background double-click event
    this.cy.on('dblclick', (event) => {
      if (event.target === this.cy) {
        this.selectedCytoElement = null;
        this.infoCardState = 'create-node';
        this.infoCardVisibility = true;

        const xPos = new Neo4jNodePropertyDTO('ngsocPosX', event.position.x);
        const yPos = new Neo4jNodePropertyDTO('ngsocPosY', event.position.y);
        const color = new Neo4jNodePropertyDTO('ngsocColor', '#FF5733');
        const newNode = new Neo4jNodeDTO(null, [], [xPos, yPos, color])

        this.nodeCard.setNode(newNode);
      }
    });


    // Node double-click event
    this.cy.on('dblclick', 'node', (event) => {
      this.clearRelationshipSelections();
      if (event.target.isNode()) {
        event.target.addClass('highlighted');
        this.sourceCytoElement = event.target;
        this.targetCytoElement = null;
      }
    })
  }


  updateRelationshipBtnPosition(event: any) {
    const node = event.target;
    const nodePosition = node.renderedPosition();
    const renderedWidth = parseFloat(node.renderedStyle('width'));  // Actual circle width
    const renderedHeight = parseFloat(node.renderedStyle('height')); // Actual circle height
    const button = this.actionButton.nativeElement;
    button.style.left = `${nodePosition.x + renderedWidth / 2 - 2}px`;  // Adjust X position
    button.style.top = `${nodePosition.y + renderedHeight / 2 + 13}px`;  // Adjust Y position
  }


  showRelationshipBtn(event) {
    const button = this.actionButton.nativeElement;
    button.classList.remove('d-none');

    // this.cy.nodes().forEach(node => {
    //   node.lock();
    // });

    // const node = event.target;
    // const nodePosition = node.position();
    // console.log(nodePosition);

    // this.relationshipBtn = this.cy.add({
    //   data: {
    //     id: 'add-relationship-node',
    //     label: '',
    //     // parent: node.data().id
    //   },
    //   // position: { x: nodePosition.x + 18, y: nodePosition.y - 18 },
    //   position: {
    //     x: node.position('x') + 18, // Keep position relative to parent
    //     y: node.position('y') - 18
    //   },
    //   classes: 'relationshipButtonNode'
    // });
    // // this.cy.layout({ name: 'preset' }).run();
  }


  hideRelationshipBtn() {
    this.actionButton.nativeElement.classList.add('d-none');
  }


  onRelationshipBtnClick() {
    this.clearRelationshipSelections();
    if (this.hoveredCytoElement != null) {
      this.sourceCytoElement = this.hoveredCytoElement;
      this.neo4jContainer.nativeElement.style.cursor = 'pointer';
      this.sourceCytoElement.addClass('highlighted');
    }
  }


  clearRelationshipSelections() {
    this.sourceCytoElement = null;
    this.targetCytoElement = null;
    this.cy.nodes().forEach(node => {
      node.removeClass('highlighted');
    });
  }


  infoCardSave() {
    if (this.infoCardState == 'edit-node' && this.selectedCytoElement.isNode()) {
      this.nodeCard.updateNodeToServer(this.selectedCytoElement.data().neo4jNode.identity);
    }
    else if (this.infoCardState == 'edit-relationship' && this.selectedCytoElement.isEdge()) {
      this.relationshipCard.updateRelationshipToServer();
    }
  }


  infoCardDelete() {
    if (this.selectedCytoElement.isNode()) {
      this.nodeCard.deleteNode(this.selectedCytoElement.data().neo4jNode.identity);
    }
    else if (this.selectedCytoElement.isEdge()) {
      this.relationshipCard.deleteRelationship(this.selectedCytoElement.data().neo4jRelationship.identity);
    }
  }


  infoCardCreate() {
    if (this.infoCardState == 'create-node') {
      this.nodeCard.createNodeToServer()
    }

    if (this.infoCardState == 'create-relationship') {
      this.relationshipCard.createRelationshipToServer()
    }
  }


  closeInfoCard() {
    this.infoCardVisibility = false;
    switch (this.infoCardState) {
      case 'edit-node': {
        this.selectedCytoElement.removeClass('highlighted');
        this.selectedCytoElement = null;
        this.infoCardState = 'none';
        break;
      }
      case 'create-node': {
        this.selectedCytoElement = null;
        this.infoCardState = 'none';
        break;
      }
      case 'edit-relationship': {
        this.infoCardState = 'none';
        this.selectedCytoElement.unselect();
        this.selectedCytoElement = null;
        break;
      }
      case 'create-relationship': {
        this.sourceCytoElement.removeClass('highlighted');
        this.targetCytoElement.removeClass('highlighted');
        this.sourceCytoElement = null;
        this.targetCytoElement = null;
        this.infoCardState = 'none';
        break;
      }
    }
  }


  handleNodeCreation(node: Neo4jNodeDTO) {
    const name = node.properties.find(prop => prop.name === 'name')?.value ?? `Node ${node.identity}`;
    const color = node.properties.find(prop => prop.name === 'ngsocColor')?.value ?? '#FF5733';
    const posX = node.properties.find(prop => prop.name === 'ngsocPosX')?.value ?? null;
    const posY = node.properties.find(prop => prop.name === 'ngsocPosY')?.value ?? null;
    this.cy.add({
      data: {
        id: node.identity,
        label: name,
        neo4jNode: node
      },
      position: { x: posX, y: posY },
      style: {
        'background-color': color,
      }
    });

    this.infoCardState = 'edit-node';
    this.nodeCard.setNode(node);
  }


  handleNodeUpdate(node: Neo4jNodeDTO) {
    if (this.selectedCytoElement != null && this.selectedCytoElement.isNode() && this.selectedCytoElement.data().neo4jNode.identity == node.identity) {
      this.selectedCytoElement.data().neo4jNode = JSON.parse(JSON.stringify(node));
      const name = node.properties.find(prop => prop.name === 'name')?.value ?? `Node ${node.identity}`;
      this.selectedCytoElement.style('label', name);  // Update name
      const colorProperty = node.properties.find(prop => prop.name === 'ngsocColor');
      if (colorProperty) {
        const color = colorProperty?.value ?? '#FF5733';
        this.selectedCytoElement.style('background-color', color);  // Update color
      }
    }
  }

  handleNodeDeletion() {
    this.selectedCytoElement.remove();
    this.infoCardVisibility = false;
    this.selectedCytoElement = null;
  }


  handleRelationshipCreation(relationship: Neo4jRelationshipDTO) {
    this.cy.add({
      data: {
        id: `edge-${relationship.identity}`,
        source: relationship.start,
        target: relationship.end,
        label: relationship.type,
        neo4jRelationship: relationship
      }
    });
    const edge = this.cy.getElementById(`edge-${relationship.identity}`)
    if (edge) {
      edge.select();
    }
    this.selectedCytoElement = edge;
    this.clearRelationshipSelections();
    this.infoCardState = 'edit-relationship';
    this.relationshipCard.setRelationship(relationship);
  }

  handleRelationshipUpdate(relationship: Neo4jRelationshipDTO) {
    console.log('hiiiiiiiiiiiiiiiiiiii x333');
    if (this.selectedCytoElement != null && this.selectedCytoElement.isEdge() && this.selectedCytoElement.data().neo4jRelationship.identity == relationship.identity) {
      console.log('hiiiiiiiiiiiiiiiiiiii x444');
      this.selectedCytoElement.data().neo4jRelationship = JSON.parse(JSON.stringify(relationship));
    }
  }

  handleRelationshipDeletion() {
    this.selectedCytoElement.remove();
    this.infoCardVisibility = false;
    this.selectedCytoElement = null;
  }

  setState(state: string) {

  }

}
