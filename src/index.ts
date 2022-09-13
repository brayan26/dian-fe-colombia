import { UblTransformer } from "./dian/UblTransformer";
import { IFiscalDocument, ICompany } from "./dian/IFiscalDocument";

const ubl = new UblTransformer();

const company: ICompany = {
  identificationNumber: "900668729",
  dv: "1",
  testMode: true,
  softwareID: "548a2dda-6d18-4ffb-b5d2-adc3ae830512",
  pinCode: "12345",
  documentType: "31",
  additionalAccountID: "1",
  fullName: "",
  countryCode: "",
  CountryName: "",
  stateCode: "",
  stateName: "",
  cityCode: "",
  cityName: "",
  postalCode: "",
  addressLine: "",
  taxLevelCode: "",
  contactName: "",
  contactPhone: "",
  contactElectronicMail: "",
  contactNote: "",
};

const document: IFiscalDocument = {
  invoiceNumber: 1,
  invoiceDate: new Date(),
  dueDate: "2022-09-30",
  note: "",
  currency: "COP",
  subtotal: 0.0,
  amountIVA: 0.0,
  totalAmount: 0.0,
  invoiceTypeCode: "",
  customizationID: "",
  taxExclusiveAmount: 0.0,
  descountTotalAmount: 0.0,
  chargeTotalAmount: 0.0,
  customer: {
    entityType: 2,
    idCustomer: "1046274165",
    documentType: "31",
    dvNit: "0",
    name: "JULIO SARMIENTO PEÑA",
    departmentCode: "08",
    departmentName: "ATLANTICO",
    cityCode: "08001",
    cityName: "BARRANQUILLA",
    fiscalAddress: "CL 36B 20 81",
    countryCode: "CO",
    countryName: "COLOMBIA",
    postalCode: "080005",
  },
  trm: undefined,
  paymentMethods: [],
  relatedTaxes: [],
  pos: {
    prefix: "INV",
    resolution: "18000683498704",
    technicalKey: "548a2dda-6d18-4ffb-b5d2-adc3ae830512",
    rangeFrom: 1,
    rangeTo: 1000,
    startDate: "2022-09-12",
    endDate: "2023-09-12",
  },
  items: [],
};
ubl
  .transformToInvoice(document, company)
  .then((resp) => {
    console.log(resp);
  })
  .catch((err) => {
    console.log(err);
  });
