export interface IFiscalDocument extends IFiscalDocumentCreditAndDebitNote {
    //Numero de comprobante
    internalId: number;
    //Tipo de documento 01=Factura 94=Nota Débito 95=Nota crédito
    invoiceType: string;
    //COP
    currency: string;
    //Cotizacion de la moneda informada
    currencyChange: number;
    //Fecha y hora de emision de la factura
    invoiceDate: Date;
    //Fecha de vencimiento del pago de la factura
    paymentDueDate: Date;
    //Perido en el que se realiza la factura
    periodStartDate: Date;
    //Perido en el que se realiza la factura
    periodEndDate: Date;
    //Subtotal general del documento
    subtotalAmount: number;
    //Descuento total de la factura
    ticketDiscount: number;
    //Importe conceptos no gravados
    nonTaxedAmount: number;
    //Importe neto gravado del documento
    taxedAmount: number;
    //Total general del impuesto IVA
    amountIVA: number;
    //Total general del documento => subtotal + amountIVA + chargeTotalAmount - descountTotalAmount
    totalAmount: number;
    //Numero del pedido
    orderNumber: number;
    //Código del vendedor
    operator: string;
    //Periodo de facturación ideal para notas
    relatedInvoice: IFiscalDocumentRelatedInvoicesPeriod[];
    //Cliente
    customer: IFiscalDocumentCustomer;
    //Medios de pago
    paymentMethods: IFiscalDocumentPaymentMethods[];
    //Impuestos del documento
    relatedTaxes: IFiscalDocumentRelatedTaxes[];
    //Otros Impuestos del documento como retenciones, ReteFuente, ICA, Imp. Bolsa, etc.
    relatedOtherTaxes: IFiscalDocumentRelatedTaxes[];
    //Resolucion de facturación
    pos: IFiscalDocumentPos;
    //Articulos del documento
    items: IFiscalDocumentItems[];
    //
    orderReference?: IFiscalDocumentOrderReference;
    /** Estos son los que faltan */
    //Notas o cualquier obervacion de la factura
    //note: string;
    //Tipo de documento carvajal => INVOIC | ND | NC
    //carvajalInvoiceTypeCode: string;
    //Tipo de factura 10= Factura estandar, Si solo se realizaran facturas estandar que es lo mas común este dato puede ser una constante
    //customizationID: string;
    //Valor total de recargos a la factura
    //chargeTotalAmount: number;
}

interface IFiscalDocumentCustomer {
    documentType: string;
    identificationNumber: string;
    entityType: number;
    taxCategory: string;
    sendVoucher: boolean;
    billingEmail: string;
    personalEmail: string;
    code: string;
    businessName: string;
    civilStatus: string;
    fiscalAddress: string;
    city: string;
    state: string;
    postalCode: string;
    /** Estos son los que faltan */
    //dv: string;
    //country: string;
    //contactPhone: string;
}


interface IFiscalDocumentOrderReference {
    //Numero de la orden de compra
    id: string;
    //Fecha de la orden de compra
    issueDate: string;
}

interface IFiscalDocumentPaymentMethods {
    code: string;
    name: string;
    amount: number;
    /** Los que faltan */
    //paymentType: number;
    //identificationPayment: String;
    //dueDate: Date;
}

interface IFiscalDocumentRelatedInvoicesPeriod {
    startDate: Date;
    endDate: Date;
}

interface IFiscalDocumentRelatedTaxes {
    //totalAmount: number;
    //roundingAmount: number;
    baseAmount: number;
    amount: number;
    //baseUnitMeasure: number;
    //measurementunit: string;
    //perUnitAmount: number;
    //percent: number;
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
    action: string;
    sku: string;
    name: string;
    qty: number;
    um?: string;
    tax: IFiscalDocumentRelatedTaxes;
    taxAmount: number;
    discount: number;
    unitPrice: number;
    totalPrice: number;
    serialNumber?: string;
    code?: string;
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
    /** Atributos que faltan para las notas de crédito y débito */
    typeNote?: string;
    descriptionTypeNote?: string;
    relatedCufe?: string;
    relatedInvoiceDate?: Date;
}