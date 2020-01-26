import { Directive, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTableStickyHeader]'
})
export class TableStickyHeaderDirective implements AfterViewInit {


  constructor(private el: ElementRef, private renderer: Renderer2) {

  }

  ngAfterViewInit(): void {
    const tableElement: HTMLTableElement = this.el.nativeElement;

    const theadElement = tableElement.querySelector('thead');
    const theadElementRow = tableElement.querySelector('thead tr');
    const theadElementRowCells = theadElementRow.querySelectorAll('th');

    const tbodyElementFirstRowCells = tableElement.querySelector('tbody tr').querySelectorAll('td');

    const cellsWidth: string[] = [];
    const cellsText: string[] = []

    tbodyElementFirstRowCells.forEach(c => cellsWidth.push(getComputedStyle(c).width));
    theadElementRowCells.forEach(c => cellsText.push(c.innerText));

    console.log(cellsWidth);

    cellsWidth.forEach(c => {
      const colElement = this.renderer.createElement('col');
      colElement.width = c;
      this.renderer.appendChild(tableElement, colElement);
    })

    const headerTable = this.createTable(cellsWidth, cellsText, theadElementRow.className);

    this.renderer.insertBefore(tableElement.parentElement.parentElement, headerTable, tableElement.parentElement);
    // this.renderer.removeChild(tableElement, theadElement); // this line kills IE pergormance - display none is better
    this.renderer.setStyle(theadElementRow, 'display', 'none');
  }


  createTable(cellsWidth: string[], cellsText: string[], rowClasses?: string): HTMLTableElement {
    const table = this.renderer.createElement('table');
    const thead = this.renderer.createElement('thead');
    const tr = this.renderer.createElement('tr');
    if (rowClasses) {
      tr.className = rowClasses;
    }

    for (let i = 0; i < cellsText.length; i++) {
      const td = this.renderer.createElement('th');
      td.width = cellsWidth[i];
      td.innerText = cellsText[i];
      tr.appendChild(td)
    }

    this.renderer.appendChild(thead, tr);
    this.renderer.appendChild(table, thead);

    this.renderer.setStyle(table, 'width', '98%');

    return table;
  }

}
