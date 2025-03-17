import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Neo4jGraphComponent } from './neo4j-graph.component';

describe('Neo4jGraphComponent', () => {
  let component: Neo4jGraphComponent;
  let fixture: ComponentFixture<Neo4jGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Neo4jGraphComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Neo4jGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
