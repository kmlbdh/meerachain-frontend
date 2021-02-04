import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'my-auth-token',
      "Access-Control-Allow-Origin": '*'
    })
  };
  constructor(private http: HttpClient) {
  }
  refreshSearc = new Subject();
  updateuserfilter(userDataFilter) {
    this.authenticatedHttp();
    console.log(JSON.stringify(userDataFilter));
    return this.http.post("http://localhost:58991/api/roles/updateuserfilter", userDataFilter, this.httpOptions);
  }
  addupdateViewModels(vm) {
    this.authenticatedHttp();
    console.log(JSON.stringify(vm));
    return this.http.post("http://localhost:58991/api/roles/addupdateViewModels", vm, this.httpOptions);
  }
  getSingleUserInfo(id) {
    this.authenticatedHttp();
    return this.http.get(`http://localhost:58991/api/roles/getSingleUserInfo?id=${id}`, this.httpOptions);
  }
  getViewsModels(vmt) {
    this.authenticatedHttp();
    console.log(JSON.stringify(vmt));
    return this.http.get(`http://localhost:58991/api/roles/getViewsModels?vmt=${vmt}`, this.httpOptions);
  }
  initaddedituserfilterpage() {
    this.authenticatedHttp();
    console.log(`http://localhost:58991/api/roles/initaddedituserfilterpage`);
    return this.http.get(`http://localhost:58991/api/roles/initaddedituserfilterpage`, this.httpOptions);
  }
  addUpdateUserGroup(group) {
    this.authenticatedHttp();
    console.log(JSON.stringify(group));
    return this.http.post("http://localhost:58991/api/roles/addUpdateUserGroup", group, this.httpOptions);
  }
  getUsersGroups() {
    this.authenticatedHttp();
    return this.http.get(`http://localhost:58991/api/roles/getUsersGroups`, this.httpOptions);
  }
  getAllViewModel() {
    this.authenticatedHttp();
    return this.http.get(`http://localhost:58991/api/roles/getAllViewModel`, this.httpOptions);
  }
  getUserGroup(id) {
    this.authenticatedHttp();
    console.log(JSON.stringify(id));
    return this.http.get(`http://localhost:58991/api/roles/getUserGroup?id=${id}`, this.httpOptions);
  }

  getSingleViewModel(id) {
    this.authenticatedHttp();
    console.log(JSON.stringify(id));
    return this.http.get(`http://localhost:58991/api/roles/getViewModel?id=${id}`, this.httpOptions);
  }
  propsData = {
    "0": [ //items
      {
        Header: "Model Properties",
        dealingAs: "simpleText",
        key: "filterObject",
        props: [
          { label: 'Item English Name', value: 'englishName' },
          { label: 'Item Arabic Name', value: 'arabicName' },
          { label: 'Item Hebrew Name', value: 'hebrewName' },
          { label: 'Item Unit', value: 'unitId' },
          { label: 'Item HSCode', value: 'hScode' },
          { label: 'Item Customs Rate', value: 'customsRate' },
          { label: 'Item Category', value: 'categoryId' },
          { label: 'Item Description', value: 'description' },
          { label: 'Item Suppliers', value: 'lstSuppliers' }
        ]
      }
    ],
    "1": [  //orders
      {
        Header: "Main Model Properties",
        dealingAs: "simpleText",
        key: "main",
        props: [
          //id,performaId,createDate,isCleared //must include Serer side solve it !!
          // "": ",,,,,,,,"
          { label: 'Supplier', value: 'supplierId' },
          { label: 'number Of Containers', value: 'numberOfContainers' },
          { label: 'Loading Port', value: 'loadingPortId' },
          { label: 'Creation Date', value: 'orderCreationDate' },
          { label: 'Container Type', value: 'containerTypeId' },
          { label: 'Currency', value: 'currencyId' },
          { label: 'Shipping Type', value: 'shippingType' },
          { label: 'Description', value: 'orderDescription' },
          { label: 'incoterms', value: 'incotermsId' },
          { label: 'Arrival date to port', value: 'arrivalDateToPort' },
          { label: 'Priority', value: 'orderPriority' },
        ]
      },
      {
        //prevent orderId
        //
        Header: "General Model Properties",
        dealingAs: "simpleText",
        key: "orderGenerals",
        props: [
          { label: 'Order Reference ', value: 'orderRefrence' },
          { label: 'Goods Origin', value: 'originOfGoods' },
          { label: 'Export Country', value: 'exportCountryId' },
          { label: 'Payment Terms', value: 'paymentTerms' },
          { label: 'Ready Date', value: 'readyDate' },
          { label: 'Is Urgent', value: 'orderIsUrgent' },
          { label: 'Transshipment Allowed', value: 'transshipmentAllowed' },
          { label: 'Net Weight', value: 'netWeight' },
          { label: 'Total Weight', value: 'totalWeight' },
          { label: 'Number Of Packages', value: 'numberOfPackages' },
          { label: 'Cubic Volume', value: 'cubicVolume' },
          { label: 'Destination Port', value: 'destinationPortId' },/* check on server side render!!*/
          { label: 'Discharge Port', value: 'dischargePortId' },
          { label: 'Warehouses', value: 'warehousesId' },
        ]
      },
      {
        //prevent orderId
        Header: "Shipping Model Properties",
        dealingAs: "simpleText",
        key: "orderShippings",
        props: [
          { label: 'Shippings Status', value: 'orderShippingsStatus' },
          { label: 'Shipping Company Refrence', value: 'shippingCompanyRefrence' },
          { label: 'opening Shipping Date', value: 'openingShippingOrderDate' },
          { label: 'Shipping Date', value: 'shippingDate' },
          { label: 'Forwarder', value: 'forwarderId' },
          { label: 'Shipping Line', value: 'shippingLine' },
          { label: 'Foreign Agent', value: 'foreignAgent' },
          { label: 'Delayed Container Days', value: 'delayedContainerDays' },
          { label: 'BOL No', value: 'bOLNo' },
          { label: 'Vessel', value: 'vessel' },
          { label: 'Shipping Price', value: 'shippingPrice' },
          { label: 'Crane Fees', value: 'craneFees' },/* check on server side render!!*/
          { label: 'Delivery Cost', value: 'deliveryCost' },
          { label: 'Is Direct Shipping', value: 'isDirectShipping' },
          { label: 'Departure Date', value: 'departureDate' },
        ]
      },
      {
        //"": ",,,,,,,,,,,,,,",
        //prevent orderId
        Header: "Custom Model Properties",
        dealingAs: "simpleText",
        key: "orderCustoms",
        props: [
          { label: 'Customs Agent', value: 'customsAgentId' },
          { label: 'Document Received', value: 'documentReceived' },
          { label: 'Document Approved', value: 'documentApproved' },
          { label: 'Customs File Opening Date', value: 'customsFileOpeningDate' },
          { label: 'Customs File Number', value: 'customsFileNumber' },
          { label: 'Agent Payment Date', value: 'agentPaymentDate' },
          { label: 'Local Crossing', value: 'localCrossingId' },
          { label: 'Inland Shipper', value: 'inlandShipperId' },
          { label: 'Customes Declaration Number', value: 'customesDeclarationNumber' },
          { label: 'Customs Payment Date', value: 'customsPaymentDate' },
          { label: 'Is Cleared', value: 'isCleared' },
          { label: 'Is Scanned', value: 'isScanned' },
        ]
      },
      {
        //prevent orderId,
        //must include on serer side : id
        Header: "Containers Model Properties",
        dealingAs: "simpleText",
        key: "orderContainers",
        props: [
          { label: 'Container Number', value: 'containerNumber' },
          { label: 'Customs Agent', value: 'customsAgentId' },
          { label: 'Container Type', value: 'containerTypeId' },
          { label: 'Inland Shipper', value: 'inlandShipperId' },
          { label: 'Delayed Containers Days', value: 'delayedContainersDays' },
          { label: 'Seal Number', value: 'sealNumber' },
          { label: 'Net Weight', value: 'netWeight' },
          { label: 'Total Weight', value: 'totalWeight' },
          { label: 'Goods Description', value: 'goodsDescription' },
          { label: 'Good Dangerous', value: 'goodDangerous' },
          { label: 'Actual Arrival', value: 'actualArrival' },
          { label: 'Exit Date', value: 'exitDate' },
          { label: 'Arrival Date To Company', value: 'arrivalDateToCompany' },
          { label: 'Arrival Truck Number', value: 'arrivalTruckNumber' },
          { label: 'Arrival Hour To Company', value: 'arrivalHourToCompany' },
          { label: 'Supervisor Gaurd', value: 'supervisorGaurd' },
          { label: 'Returned Date To Port', value: 'returnedDateToPort' },
          { label: 'Is Scanned', value: 'isScanned' },
          { label: 'Is Cleared', value: 'isCleared' },
          { label: 'Scanning Hour', value: 'scanningHour' },
          { label: 'Scan By Text', value: 'scanByText' },
          { label: 'Warehouses', value: 'warehousesId' },
          { label: 'Forwarder', value: 'forwarderId' },
        ]
      },
      {

        //
        //prevent orderId,
        //must include on serer side : id
        Header: "Items Model Properties",
        dealingAs: "simpleText",
        key: "orderItems",
        props: [
          { label: 'Name', value: 'name' },
          { label: 'Quantity', value: 'quantity' },
          { label: 'Unit', value: 'unitId' },
          { label: 'Price', value: 'price' },
          { label: 'Currency', value: 'currencyId' },
          { label: 'Note', value: 'note' },
          // { label: 'Net Weight', value: 'netWeight' },
          // { label: 'Performa Dispatched Quantity', value: 'Dispatched Quantity' }, //Performa Just
        ]
      }
    ]
  }
  authenticatedHttp() {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem("token")
      })
    };
  }
}
