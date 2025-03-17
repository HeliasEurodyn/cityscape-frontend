import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Neo4jNodeInfoCardComponent } from './neo4j-node-info-card.component';

describe('Neo4jNodeInfoCardComponent', () => {
  let component: Neo4jNodeInfoCardComponent;
  let fixture: ComponentFixture<Neo4jNodeInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Neo4jNodeInfoCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Neo4jNodeInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
