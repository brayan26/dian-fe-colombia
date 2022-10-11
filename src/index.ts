import { IFiscalDocument, ICompany } from './dian/IFiscalDocument';
import { CarvajalUblFactory } from './carvajal/CarvajalUblFactory';

const company: ICompany = {
    identificationNumber: '900668729',
    dv: '1',
    testMode: true,
    softwareID: '548a2dda-6d18-4ffb-b5d2-adc3ae830512',
    pinCode: '12345',
    documentType: '31',
    additionalAccountID: '1',
    fullName: 'TEST COMPANY CORP.',
    countryCode: 'CO',
    countryName: 'Colombia',
    stateCode: '08',
    stateName: 'ATLANTICO',
    cityCode: '08001',
    cityName: 'BARRANQUILLA',
    postalCode: '080006',
    addressLine: 'CL 36B 20 81',
    taxLevelCode: 'R-99-PN',
    contactName: 'BRYAN PARRA',
    contactPhone: '3024026718',
    contactElectronicMail: 'brayan.parra@napse.global',
    contactNote: 'System area',
    taxId: '01',
    taxName: 'IVA',
};

const document: IFiscalDocument = {
    internalId: 1,
    invoiceType: 'INVOIC',
    currency: 'COP',
    currencyChange: 1.00,
    invoiceDate: new Date(),
    paymentDueDate: new Date(),
    periodStartDate: new Date(),
    periodEndDate: new Date(),
    subtotalAmount: 0,
    ticketDiscount: 0,
    nonTaxedAmount: 0,
    taxedAmount: 0,
    amountIVA: 0,
    totalAmount: 0,
    orderNumber: 0,
    operator: '',
    relatedInvoice: [],
    customer: {
        documentType: '31',
        identificationNumber: '1046274165',
        entityType: 1,
        taxCategory: '01',
        sendVoucher: true,
        billingEmail: 'brayanpp2697@gmail.com',
        personalEmail: 'brayanpp2697@gmail.com',
        code: '002563',
        businessName: 'JULIO SARMIENTO PEÑA',
        civilStatus: 'SOLTERO',
        fiscalAddress: 'CALLE 36B 20 81',
        city: 'BARRANQUILLA',
        state: 'ATLANTICO',
        postalCode: '080006',
    },
    paymentMethods: [],
    relatedTaxes: [],
    relatedOtherTaxes: [],
    pos: {
        prefix: 'INV',
        resolution: '18000683498704',
        technicalKey: '548a2dda-6d18-4ffb-b5d2-adc3ae830512',
        rangeFrom: 1,
        rangeTo: 1000,
        startDate: '2022-09-12',
        endDate: '2023-09-12',
    },
    items: [],
    orderReference: undefined,
    relatedCufe: '',
    relatedInvoiceDate: undefined
};

const ubl = CarvajalUblFactory.getInstance(document, company);

(async () => {
    console.log(
        await(await ubl.mapToUbl()).toXml());
})();