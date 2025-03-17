import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Neo4jRelationshipInfoCardComponent } from './neo4j-relationship-info-card.component';

describe('Neo4jRelationshipInfoCardComponent', () => {
  let component: Neo4jRelationshipInfoCardComponent;
  let fixture: ComponentFixture<Neo4jRelationshipInfoCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Neo4jRelationshipInfoCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Neo4jRelationshipInfoCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
