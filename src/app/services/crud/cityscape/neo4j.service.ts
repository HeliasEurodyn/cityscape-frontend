import { Injectable } from '@angular/core';
import { CrudService } from '../common/crud.service';
import { HttpClient, HttpHeaders,HttpContext  } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Neo4jNodeDTO, Neo4jNodePositionDTO } from 'app/dtos/cityscape/neo4j/neo4j-node-dto';
import { Neo4jRelationshipDTO } from 'app/dtos/cityscape/neo4j/neo4j-relationship-dto';
import { IGNORE_HTTP_ERROR_INTERCEPTOR } from 'app/constants/ignore-http-error-interceptor';


@Injectable({
  providedIn: 'root'
})
export class Neo4jService extends CrudService<any> {

  private nodeCreatedSource = new Subject<Neo4jNodeDTO>(); // Subject to broadcast deletion events
  nodeCreated$ = this.nodeCreatedSource.asObservable(); // Observable that other components can subscribe to

  private nodeUpdatedSource = new Subject<Neo4jNodeDTO>(); // Subject to broadcast deletion events
  nodeUpdated$ = this.nodeUpdatedSource.asObservable(); // Observable that other components can subscribe to

  private nodeDeletedSource = new Subject<number>(); // Subject to broadcast deletion events
  nodeDeleted$ = this.nodeDeletedSource.asObservable(); // Observable that other components can subscribe to

  private relationshipCreatedSource = new Subject<Neo4jRelationshipDTO>(); // Subject to broadcast deletion events
  relationshipCreated$ = this.relationshipCreatedSource.asObservable(); // Observable that other components can subscribe to

  private relationshipUpdatedSource = new Subject<Neo4jRelationshipDTO>(); // Subject to broadcast deletion events
  relationshipUpdated$ = this.relationshipUpdatedSource.asObservable(); // Observable that other components can subscribe to

  private relationshipDeletedSource = new Subject<number>(); // Subject to broadcast deletion events
  relationshipDeleted$ = this.relationshipDeletedSource.asObservable(); // Observable that other components can subscribe to


  constructor(public http: HttpClient) {
    super(http, 'neo4j');
  }

  createNode(node: Neo4jNodeDTO): Observable<any> {
    return this.http.post(`${environment.serverUrl}/neo4j/node/`, node);
    
  }

  getNodeById(id: number): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/neo4j/node/${id}`);
  }

  getAllNodes(): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/neo4j/nodes/`);
  }

  getAllRelationships(): Observable<any> {
    return this.http.get<any>(`${environment.serverUrl}/neo4j/relationships/`);
  }

  updateNodeById(id:number, object: Neo4jNodeDTO): Observable<any>{
    return this.http.put(`${environment.serverUrl}/neo4j/node/${id}`, object);
  }

  deleteNodeById(id: any): Observable<any> {
    return this.http.delete(`${environment.serverUrl}/neo4j/node/${id}`,{context: new HttpContext().set(IGNORE_HTTP_ERROR_INTERCEPTOR, true)});        
  }

  updateNodesPositions(object: Neo4jNodePositionDTO[]): Observable<any>{
    return this.http.put(`${environment.serverUrl}/neo4j/nodes/positions`, object)
  }

  updateRelationshipById(id:number, object: Neo4jRelationshipDTO): Observable<any>{
    return this.http.put(`${environment.serverUrl}/neo4j/relationship/${id}`, object)
  }

  deleteRelationshipById(id: any): Observable<any> {
    return this.http.delete(`${environment.serverUrl}/neo4j/relationship/${id}`);        
  }

  createRelationship(relationship: Neo4jRelationshipDTO): Observable<any> {
    return this.http.post(`${environment.serverUrl}/neo4j/relationship/`, relationship);
  }

  notifyNodeCreated(node: Neo4jNodeDTO) {
    this.nodeCreatedSource.next(node);
  }

  notifyNodeUpdated(node: Neo4jNodeDTO) {
    this.nodeUpdatedSource.next(node);
  }

  notifyNodeDeleted(nodeId: number) {
    this.nodeDeletedSource.next(nodeId);
  }

  notifyRelationshipCreated(relationship: Neo4jRelationshipDTO) {
    this.relationshipCreatedSource.next(relationship);
  }

  notifyRelationshipUpdated(relationship: Neo4jRelationshipDTO) {
    this.relationshipUpdatedSource.next(relationship);
  }

  notifyRelationshipDeleted(relationshipId: number) {
    this.relationshipDeletedSource.next(relationshipId);
  }
}
