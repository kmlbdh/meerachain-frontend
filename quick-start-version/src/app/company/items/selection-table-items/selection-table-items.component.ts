import { Component, OnInit, Input, Output } from '@angular/core';
import { DualListComponent } from 'angular-dual-listbox';
import { ItemsService } from 'src/app/Shared/Items/items.service';
import { Item } from 'src/app/Shared/Items/item';
import { EventEmitter } from '@angular/core';
import { SystemApiKeys } from 'src/app/Shared/Enums/SystemApiKeys';


@Component({
  selector: 'app-selection-table-items',
  templateUrl: './selection-table-items.component.html',
  styleUrls: ['./selection-table-items.component.scss']
})
export class SelectionTableItemsComponent implements OnInit {
  @Output('ItemsBelogToSupllierChange') ItemsBelogToSupllierChange: EventEmitter<number[]> = new EventEmitter<number[]>();
  echo($e) {
    this.ItemsBelogToSupllierChange.emit($e.map(z => z.id))
  }
  keepSorted = true;
  format: any = {
    add: 'Add To Supplier Items', remove: 'Remove From Supplier Items',
    direction: DualListComponent.LTR, draggable: true, locale: 'da'
  };
  sourceStations; confirmedStations;
  source; confirmed; display;
  key;
  disabled = false;
  filter = true;
  showMapping = false;
  @Input() supId;
  constructor(private itemsService: ItemsService) {
    this.confirmedStations = [];

  }
  private useStations() {
    this.key = 'id';
    this.display = this.stationLabel;
    this.keepSorted = true;
    this.source = this.sourceStations;
    this.confirmed = this.confirmedStations;
    this.ItemsBelogToSupllierChange.emit(this.confirmed.map(z => z.id))
  }
  private stationLabel(item: Item) {
    return typeof item.englishName != 'undefined' ? item.englishName : "" + typeof item.arabicName != 'undefined' ?  ', ' + item.arabicName : "" ;
  }
  ngOnInit() {
    var req = this.itemsService.loadallcompanyitems(this.supId, SystemApiKeys.Company_Edit_Contact_Supplier);
    if (typeof this.supId == 'undefined') req = this.itemsService.loadallcompanyitems(this.supId, SystemApiKeys.Company_Create_Contact_Supplier);
    req.subscribe((z: any) => {
      this.sourceStations = z.items;
      z.supitems.forEach(itm => {
        this.confirmedStations.push(this.sourceStations.find(li => li.id == itm.itemId));
      });
      this.useStations();
      this.confirmedStations.forEach(el => {
        this.sourceStations = this.sourceStations.filter(z => z.id != el.id);
      });
      this.showMapping = true;
    })
  }
  doFilter() {
    this.filter = !this.filter;
  }
  filterBtn() {
    return (this.filter ? 'Hide Filter' : 'Show Filter');
  }
  doDisable() {
    this.disabled = !this.disabled;
  }
  disableBtn() {
    return (this.disabled ? 'Enable' : 'Disabled');
  }
}
