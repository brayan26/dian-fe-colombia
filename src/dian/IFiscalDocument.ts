export interface IFiscalDocument extends IFiscalDocumentCreditAndDebitNote {
    //Numero de comprobante
    invoiceNumber: number;
    //Fecha y hora de emision de la factura
    invoiceDate: Date;
    //Fecha de vencimiento
    dueDate: string;
    //Notas o cualquier obervacion de la factura
    note: string;
    //COP
    currency: string;
    //Subtotal general del documento
    subtotal: number;
    //Total general del impuesto IVA
    amountIVA: number;
    //Total general del documento => subtotal + amountIVA + chargeTotalAmount - descountTotalAmount
    totalAmount: number;
    //Tipo de documento 01=Factura 94=Nota Débito 95=Nota crédito
    invoiceTypeCode: string;
    //Tipo de factura 10= Factura estandar
    customizationID: string;
    //Sumatoria del los subtotales a nivel de items que tengan el impuesto IVA
    taxExclusiveAmount: number;
    //Valor total de descuentos en la factura
    descountTotalAmount: number;
    //Valor total de recargos a la factura
    chargeTotalAmount: number;
    //Identificacioni del pedido
    orderReference?: IFiscalDocumentOrderReference;
    //Cliente
    customer: IFiscalDocumentCustomer;
    //Tasa representativa del mercado
    trm?: IFiscalDocumentTRM;
    //Medios de pago
    paymentMethods: IFiscalDocumentPaymentMethods[];
    //Impuestos del documento
    relatedTaxes: IFiscalDocumentRelatedTaxes[];
    //Resolucion de facturación
    pos: IFiscalDocumentPos;
    //Articulos del documento
    items: IFiscalDocumentItems[];
}

interface IFiscalDocumentCustomer {
    entityType: number;
    idCustomer: string;
    documentType: string;
    dvNit: string;
    name: string;
    departmentCode: string;
    departmentName: string;
    cityCode: string;
    cityName: string;
    fiscalAddress: string;
    countryCode: string;
    countryName: string;
    postalCode: string;
    taxLevelCode: string;
    contactPhone: string;
    contactElectronicMail: string;
    taxId?: string;
    taxName?: string;
}

//Informacion referente a la tasa de cambio de la factura con respecto a una moneda extrangera
//TRM: Tasa representativa del mercado
interface IFiscalDocumentTRM {
    //Codigo de la moneda extranjera
    targetCurrencyCode: string;
    //Cantidad base para el calculo de la TRM, por defecto => 1.00
    targetCurrencyBaseRate: number;
    //Valor de la TRM del dia en el que se realizo la factura
    calculationRate: number;
    //Fecha del dia de la TRM por defecto la fecha en la que se realizó la factura
    date: string;
}

interface IFiscalDocumentOrderReference {
    //Numero de la orden de compra
    id: string;
    //Fecha de la orden de compra
    issueDate: string;
}

interface IFiscalDocumentPaymentMethods {
    paymentType: number;
    code: String;
    dueDate: Date;
    identificationPayment: String;
}

interface IFiscalDocumentRelatedTaxes {
    totalAmount: number;
    roundingAmount: number;
    baseAmount: number;
    amount: number;
    baseUnitMeasure: number;
    measurementunit: string;
    perUnitAmount: number;
    percent: number;
    code: string;
    name: string;
}

interface IFiscalDocumentPos {
    prefix: string;
    resolution: string;
    technicalKey: string;
    rangeFrom: number;
    rangeTo: number;
    startDate: string;
    endDate: string;
}

interface IFiscalDocumentItems {
    item: number;
    concept: number;
    note: String;
    um: String;
    totalPrice: number;
    quantity: number;
    tax: IFiscalDocumentRelatedTaxes;
}

export interface ICompany {
    identificationNumber: string;
    //Digito de verificacion
    dv: string;
    //Entorno de envio del documento 1=producción 2=Habilitación
    //Parsear este campo
    testMode: boolean;
    //Proveido por la Dian
    softwareID: string;
    //Asignado al momento de registrar la empresa para Factura Electrónica en la app de la Dian
    pinCode: string;
    //31 = Nit  | 13 = Cedula de ciudadania
    documentType: string;
    //Tipo de persona: 1 - Juridica 2 - Natural
    additionalAccountID: string;
    //Nombre de la empresa, si es persona natural entonces el nombre completo de dicha persona que se encuentra en el RUT
    fullName: string;
    //Codigo iso-2 de colombia: 'CO'
    countryCode: string;
    //Nombre del pais: Colombia
    countryName: string;
    //Departamento o provincia
    stateCode: string;
    stateName: string;
    //Ciudad o municipio
    cityCode: string;
    cityName: string;
    //Codigo postal en la ciudad de la empresa
    postalCode: string;
    addressLine: string;
    //Responsabilidades fiscales expresadas en el RUT | R-99-PN => Si no cuenta con ninguna responsabilidad
    taxLevelCode: string;
    //Si no es regimen simple de tributación, entonces taxId=01 o 'ZZ'
    taxId?: string;
    //Si no es regimen simple de tributación, entonces taxName=IVA o 'No Aplica'
    taxName?: string;
    //Numero de matricula mercantil, si tiene alguno
    commercialRegistration?: string;
    //Nombre de un contacto en la empresa
    contactName: string;
    //Celular o telefono del contacto en la empresa
    contactPhone: string;
    //Email del contacto en la empresa
    contactElectronicMail: string;
    //Alguna nota del contacto de la empresa
    contactNote: string;
}

export interface Ubl {
    mapToUbl(): any;
}

interface IFiscalDocumentCreditAndDebitNote {
    typeNote?: string;
    descriptionTypeNote?: string;
    relatedInvoice?: string;
    relatedCufe: string;
    relatedInvoiceDate: Date;
}