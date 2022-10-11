import { IFiscalDocument, ICompany } from './IFiscalDocument';
import crypto from 'crypto';

export class Utils {
    private CUFE = 'CUFE';
    private CUDE = 'CUDE';
    public COLOMBIA_CODE_ISO_2 = "CO";
    public SCHEMA_AGENCY_NAME = "CO, DIAN (Dirección de Impuestos y Aduanas Nacionales)";
    public SCHEMA_AGENCY_ID = "195";
    public DIAN_DV = "4";
    public DIAN_IDENTIFICATION_NUMBER = "800197268";
    public DIAN_DOC_TYPE = "31";
    public UBL_VERSION = "UBL 2.1";
    public INVOICE_TYPE = "10";
    public LANGUAJE_ID = "es";
    public UNIT_CODE_CREDIT_NOTE = 'NIU';

    //Carvajal
    public INVOICE_CODE = 'INVOIC';
    public CREDIT_NOTE_CODE = 'NC';
    public DIAN_INVOICE = 'DIAN 2.1: Factura Electrónica de Venta';
    public DIAN_CREDIT_NOTE = 'DIAN 2.1: Nota Crédito de Factura Electrónica de Venta';
    public DIAN_DEBIT_NOTE = 'DIAN 2.1: Nota Débito de Factura Electrónica de Venta';

    constructor() {

    }

    public async getCufeSha384(document: IFiscalDocument, company: ICompany): Promise<string> {
        const precufe = this.calculatePreCufe(document, company, this.CUFE);
        const sha384 = crypto.createHash('sha384');
        const hash = sha384.update(precufe, 'utf-8');
        return hash.digest('hex');
    }

    public async getCudeSha384(document: IFiscalDocument, company: ICompany): Promise<string> {
        const precufe = this.calculatePreCufe(document, company, this.CUDE);
        const sha384 = crypto.createHash('sha384');
        const hash = sha384.update(precufe, 'utf-8');
        return hash.digest('hex');
    }

    public async getSoftwareSecurityCode(document: IFiscalDocument, company: ICompany ): Promise<string> {
        const input = company.softwareID + company.pinCode + document.pos.prefix + document.internalId;
        const sha384 = crypto.createHash('sha384');
        const hash = sha384.update(input, 'utf-8');
        return hash.digest('hex');
    }

    public getQRCode(cufe: string, company: ICompany): string {
        if(company.testMode) {
            return 'https://catalogo-vpfe-hab.dian.gov.co/document/searchqr?documentkey=' + cufe;
        }
        return 'https://catalogo-vpfe.dian.gov.co/document/searchqr?documentkey=' + cufe;
    }

    private calculatePreCufe(document: IFiscalDocument, company: ICompany, type: string): string {
        //prefix + invoiceNumber + date + hour + subtotal + tax-code-01 + tax-value-01 + tax-code-04 +
        //tax-value-04 + tax-code-03 + tax-value-03 + taxAmount + nitCompany + nitCustomer + technicalKey +
        //environment type

        //Get taxes
        const tax01 = document.relatedTaxes.find(tax => tax.code === '01');
        const tax03 = document.relatedTaxes.find(tax => tax.code === '03');
        const tax04 = document.relatedTaxes.find(tax => tax.code === '04');

        //Create string
        return document.pos.prefix 
            + document.internalId 
            + this.formatDate(document.invoiceDate, true)
            + this.formatDate(document.invoiceDate, false)
            + document.subtotalAmount
            + `${tax01?.code || '01'}`
            + document.amountIVA
            + `${tax04?.code || '04'}`
            + `${tax04?.amount || '0.00'}`
            + `${tax03?.code || '03'}`
            + `${tax03?.amount || '0.00'}`
            + document.totalAmount
            + company.identificationNumber
            + document.customer.identificationNumber
            + `${this.CUFE === type ? document.pos.technicalKey: company.pinCode}`
            + `${company.testMode ? 2 : 1}`
        ;
    }

    public getDianVersion(documentCode: string): string {
        if (this.INVOICE_CODE === documentCode) {
            return this.DIAN_INVOICE;
        }
        if (this.CREDIT_NOTE_CODE === documentCode) {
            return this.DIAN_CREDIT_NOTE;
        }
        return this.DIAN_DEBIT_NOTE;
    }

    private padTo2Digits(num: number): string {
        return num.toString().padStart(2, '0');
    }

    /**
     * 
     * @param date Full date without format
     * @param asDate Flag that indicates if you require it as a date or as a time
     * @returns string formatted
     */
    public formatDate(date: Date, asDate: boolean) {
        //As date YYYY-MM-DD
        if (asDate) {
            const format = [
                //Get year
                this.padTo2Digits(date.getFullYear()),
                //Get month
                this.padTo2Digits(date.getMonth() + 1),
                //Get day
                this.padTo2Digits(date.getDate()),
            ];
            return format.join('-');
        }
        //As hour HH:MM:SS-05:00
        const GTM = '-05:00';
        const format = [
            //Get Hour
            this.padTo2Digits(date.getHours()),
            //Get minutes
            this.padTo2Digits(date.getMinutes()),
            //Get seconds
            this.padTo2Digits(date.getSeconds()),
        ];
        return format.join(':') + GTM;
    }

    public formatDateRange(date: Date, rangeValue: number): string {
        const format = [
            //Get year
            this.padTo2Digits(date.getFullYear()),
            //Get month
            this.padTo2Digits(date.getMonth() + 1),
            //Get day
            this.padTo2Digits(rangeValue),
        ];
        return format.join('-'); 

    }
}