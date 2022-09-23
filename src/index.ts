import { IFiscalDocument, ICompany } from './dian/IFiscalDocument';
import { UblFactory } from './ubl/UblFactory';

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
    invoiceNumber: 1,
    invoiceDate: new Date(),
    dueDate: '2022-09-30',
    note: 'Any note',
    currency: 'COP',
    subtotal: 0.0,
    amountIVA: 0.0,
    totalAmount: 0.0,
    invoiceTypeCode: '01',
    customizationID: '10',
    taxExclusiveAmount: 0.0,
    descountTotalAmount: 0.0,
    chargeTotalAmount: 0.0,
    customer: {
        entityType: 2,
        idCustomer: '1046274165',
        documentType: '31',
        dvNit: '0',
        name: 'JULIO SARMIENTO PEÑA',
        departmentCode: '08',
        departmentName: 'ATLANTICO',
        cityCode: '08001',
        cityName: 'BARRANQUILLA',
        fiscalAddress: 'CL 36B 20 81',
        countryCode: 'CO',
        countryName: 'COLOMBIA',
        postalCode: '080005',
        taxLevelCode: 'R-99-PN',
        contactPhone: '3017611414',
        contactElectronicMail: 'test@gmail.com',
    },
    trm: undefined,
    paymentMethods: [],
    relatedTaxes: [],
    pos: {
        prefix: 'INV',
        resolution: '18000683498704',
        technicalKey: '548a2dda-6d18-4ffb-b5d2-adc3ae830512',
        rangeFrom: 1,
        rangeTo: 1000,
        startDate: '2022-09-12',
        endDate: '2023-09-12',
    },
    items: [{
        item: 12,
        concept: 1,
        note: 'PRODUCTO DE PRUEBA',
        um: 'UND',
        totalPrice: 100000.00,
        quantity: 1,
        tax: {
            totalAmount: 19000.00,
            roundingAmount: 0.00,
            baseAmount: 100000.00,
            amount: 19000.00,
            baseUnitMeasure: 100000.00,
            measurementunit: 'UND',
            perUnitAmount: 19.00,
            percent: 19.00,
            code: '01',
            name: 'IVA'
        }
    }],
    relatedCufe: '',
    relatedInvoiceDate: new Date()
};

const ubl = UblFactory.getInstance(document, company);

(async () => {
    console.log(
        await(await ubl.mapToUbl()).toXml());
})();